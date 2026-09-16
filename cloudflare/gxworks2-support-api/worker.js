const ALLOWED_ORIGIN_SUFFIX = '.denkicontrol-preview.pages.dev';
const PROD_ORIGIN = 'https://denkicontrol.com';
const MAIL_LOCK_MS = 120000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method === 'GET' && url.pathname === '/') {
      return json({ ok: true, service: 'gxworks2-support-api', message: 'Worker is running' }, 200, origin);
    }

    if (request.method === 'POST' && url.pathname === '/test-email') {
      return sendTestEmail(env, origin);
    }

    if (request.method === 'POST' && url.pathname === '/consultations') {
      if (!isAllowedOrigin(origin)) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      return createConsultation(request, env, origin);
    }

    if (request.method === 'POST' && url.pathname === '/consultations/status') {
      if (!isAllowedOrigin(origin)) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      return consultationStatus(request, env, origin);
    }

    return json({ ok: false, error: 'Not found' }, 404, origin);
  },
};

async function createConsultation(request, env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.DB) {
    return json({ ok: false, error: 'Server configuration is incomplete' }, 500, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400, origin);
  }

  const idempotencyKey = clean(body.idempotencyKey, 80);
  if (!isValidIdempotencyKey(idempotencyKey)) {
    return json({ ok: false, error: 'A valid idempotency key is required' }, 400, origin);
  }

  const data = sanitizeConsultation(body);
  if (!data.name || !isValidEmail(data.email) || !data.problem || !data.desired) {
    return json({ ok: false, error: 'Required fields are missing or invalid' }, 400, origin);
  }

  const requestHash = await sha256Hex(JSON.stringify(data));
  let row = await getConsultationByIdempotency(env.DB, idempotencyKey);

  if (row && row.request_hash !== requestHash) {
    return json({ ok: false, error: 'This request key was already used for different content' }, 409, origin);
  }

  if (!row) {
    const now = new Date().toISOString();
    const caseNumber = createCaseNumber();
    const storageMode = plannedZipMode(data.zipSize);

    try {
      await env.DB.prepare(`
        INSERT INTO consultations (
          idempotency_key, request_hash, case_number, state, accepted_at, updated_at,
          name, email, company, plc, problem, desired, photo, gxdata,
          zip_name, zip_size, zip_storage_mode
        ) VALUES (?1, ?2, ?3, 'received', ?4, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
      `).bind(
        idempotencyKey, requestHash, caseNumber, now,
        data.name, data.email, data.company, data.plc, data.problem, data.desired,
        data.photo, data.gxdata, data.zipName, data.zipSize, storageMode
      ).run();
    } catch (error) {
      row = await getConsultationByIdempotency(env.DB, idempotencyKey);
      if (!row) {
        console.error('D1 insert failed', error);
        return json({ ok: false, error: 'Receipt database write failed' }, 503, origin);
      }
      if (row.request_hash !== requestHash) {
        return json({ ok: false, error: 'This request key was already used for different content' }, 409, origin);
      }
    }

    row = row || await getConsultationByIdempotency(env.DB, idempotencyKey);
    if (!row) return json({ ok: false, error: 'Receipt database read failed' }, 503, origin);
    await addEvent(env.DB, row.id, 'received', 'Consultation accepted into D1');
  }

  return continueConsultation(row, env, origin);
}

async function continueConsultation(row, env, origin) {
  let current = row;

  if (current.admin_mail_status !== 'sent') {
    const claim = await claimMail(env.DB, current.id, 'admin');
    if (claim === 'busy') {
      return processingResponse(current, origin);
    }
    if (claim === 'claimed') {
      const result = await sendEmail(env, buildAdminEmail(current));
      if (!result.ok) {
        await markMailFailed(env.DB, current.id, 'admin', result.body);
        await addEvent(env.DB, current.id, 'admin_mail_failed', safeDetail(result.body));
        return json({ ok: false, recoverable: true, caseNumber: current.case_number, error: 'Notification email failed' }, 502, origin);
      }
      await markMailSent(env.DB, current.id, 'admin', result.body.id || '');
      await addEvent(env.DB, current.id, 'admin_mail_sent', result.body.id || '');
    }
    current = await getConsultationById(env.DB, current.id);
  }

  if (current.customer_mail_status !== 'sent') {
    const claim = await claimMail(env.DB, current.id, 'customer');
    if (claim === 'busy') {
      return processingResponse(current, origin);
    }
    if (claim === 'claimed') {
      const result = await sendEmail(env, buildCustomerEmail(current));
      if (!result.ok) {
        await markMailFailed(env.DB, current.id, 'customer', result.body);
        await addEvent(env.DB, current.id, 'customer_mail_failed', safeDetail(result.body));
        return json({ ok: false, recoverable: true, caseNumber: current.case_number, error: 'Customer confirmation email failed' }, 502, origin);
      }
      await markMailSent(env.DB, current.id, 'customer', result.body.id || '');
      await addEvent(env.DB, current.id, 'customer_mail_sent', result.body.id || '');
    }
    current = await getConsultationById(env.DB, current.id);
  }

  const completedAt = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE consultations
       SET state='completed', updated_at=?2, last_error=NULL
     WHERE id=?1 AND admin_mail_status='sent' AND customer_mail_status='sent'
  `).bind(current.id, completedAt).run();
  await addEvent(env.DB, current.id, 'completed', 'Receipt and both emails completed');
  current = await getConsultationById(env.DB, current.id);

  return json({
    ok: true,
    duplicate: current.idempotency_key !== '',
    caseNumber: current.case_number,
    acceptedAt: current.accepted_at,
    state: current.state,
    zipHandling: current.zip_storage_mode,
    note: 'Preview phase: ZIP bytes are not uploaded yet.',
  }, 200, origin);
}

async function consultationStatus(request, env, origin) {
  if (!env.DB) return json({ ok: false, error: 'Database is not configured' }, 500, origin);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400, origin);
  }
  const key = clean(body.idempotencyKey, 80);
  if (!isValidIdempotencyKey(key)) return json({ ok: false, error: 'Invalid idempotency key' }, 400, origin);
  const row = await getConsultationByIdempotency(env.DB, key);
  if (!row) return json({ ok: false, found: false }, 404, origin);
  return json({
    ok: true,
    found: true,
    caseNumber: row.case_number,
    acceptedAt: row.accepted_at,
    state: row.state,
    adminMail: row.admin_mail_status,
    customerMail: row.customer_mail_status,
    completed: row.state === 'completed',
  }, 200, origin);
}

async function claimMail(db, id, kind) {
  const statusCol = `${kind}_mail_status`;
  const startedCol = `${kind}_mail_started_at`;
  const now = new Date();
  const nowIso = now.toISOString();
  const staleIso = new Date(now.getTime() - MAIL_LOCK_MS).toISOString();
  const result = await db.prepare(`
    UPDATE consultations
       SET ${statusCol}='sending', ${startedCol}=?2, updated_at=?2
     WHERE id=?1
       AND (
         ${statusCol} IN ('pending','failed')
         OR (${statusCol}='sending' AND (${startedCol} IS NULL OR ${startedCol} < ?3))
       )
  `).bind(id, nowIso, staleIso).run();
  if ((result.meta?.changes || 0) > 0) return 'claimed';
  const row = await getConsultationById(db, id);
  return row?.[statusCol] === 'sent' ? 'sent' : 'busy';
}

async function markMailSent(db, id, kind, providerId) {
  const statusCol = `${kind}_mail_status`;
  const sentCol = `${kind}_mail_sent_at`;
  const providerCol = `${kind}_mail_provider_id`;
  const now = new Date().toISOString();
  await db.prepare(`
    UPDATE consultations
       SET ${statusCol}='sent', ${sentCol}=?2, ${providerCol}=?3, updated_at=?2, last_error=NULL
     WHERE id=?1
  `).bind(id, now, providerId).run();
}

async function markMailFailed(db, id, kind, detail) {
  const statusCol = `${kind}_mail_status`;
  const now = new Date().toISOString();
  await db.prepare(`
    UPDATE consultations
       SET ${statusCol}='failed', updated_at=?2, last_error=?3
     WHERE id=?1
  `).bind(id, now, safeDetail(detail)).run();
}

async function getConsultationByIdempotency(db, key) {
  return db.prepare('SELECT * FROM consultations WHERE idempotency_key=?1 LIMIT 1').bind(key).first();
}

async function getConsultationById(db, id) {
  return db.prepare('SELECT * FROM consultations WHERE id=?1 LIMIT 1').bind(id).first();
}

async function addEvent(db, consultationId, eventType, detail='') {
  try {
    await db.prepare(`
      INSERT INTO consultation_events (consultation_id, event_type, event_at, detail)
      VALUES (?1, ?2, ?3, ?4)
    `).bind(consultationId, eventType, new Date().toISOString(), clean(detail, 1000)).run();
  } catch (error) {
    console.error('Event log write failed', error);
  }
}

function processingResponse(row, origin) {
  return json({
    ok: true,
    processing: true,
    caseNumber: row.case_number,
    acceptedAt: row.accepted_at,
    state: row.state,
    message: 'The receipt is already being processed. Check status instead of resubmitting.',
  }, 202, origin);
}

function buildAdminEmail(row) {
  return {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [row.notify_to_email || undefined].filter(Boolean),
    subject: `[${row.case_number}] GX Works2 新規相談受付`,
    text: [
      'GX Works2 オンライン相談を受け付けました。','',
      `相談番号: ${row.case_number}`,
      `受付日時: ${row.accepted_at}`,
      `お名前: ${row.name}`,
      `会社名: ${row.company || '未入力'}`,
      `返信先: ${row.email}`,
      `PLC型式: ${row.plc || '未入力'}`,
      `設備写真: ${row.photo || '未入力'}`,
      `GX Works2データ: ${row.gxdata || '未入力'}`,
      `ZIPファイル名: ${row.zip_name || '未接続'}`,
      `ZIP容量: ${formatBytes(row.zip_size)}`,'',
      '現在困っていること:',row.problem,'',
      'どのように変更したいか:',row.desired,'',
      '※ 現在のPreview段階ではZIP本体の保存・添付はまだ接続していません。'
    ].join('\n'),
    reply_to: row.email,
  };
}

function buildCustomerEmail(row) {
  return {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [row.email],
    subject: `[${row.case_number}] GX Works2 オンライン相談を受け付けました`,
    text: [
      `${row.name} 様`,'',
      'GX Works2 オンライン相談を受け付けました。',
      `相談番号: ${row.case_number}`,'',
      '続けて、画面に表示された相談番号を使ってZIPパスワードを別送してください。',
      '内容を確認後、返信用メールアドレスへご連絡します。','',
      '電気と制御の実務メモ'
    ].join('\n'),
  };
}

async function sendTestEmail(env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL) {
    return json({ ok: false, error: 'Server configuration is incomplete' }, 500, origin);
  }
  const result = await sendEmail(env, {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [env.NOTIFY_TO_EMAIL],
    subject: 'GX Works2 受付システム テストメール',
    text: 'GX Works2 オンライン相談受付システムのテストメールです。\n\nCloudflare Workers → Resend のメール送信に成功しました。',
  });
  if (!result.ok) return json({ ok: false, error: 'Email sending failed', details: result.body }, result.status, origin);
  return json({ ok: true, message: 'Test email sent', id: result.body.id }, 200, origin);
}

async function sendEmail(env, payload) {
  if ((!payload.to || payload.to.length === 0) && env.NOTIFY_TO_EMAIL) payload.to = [env.NOTIFY_TO_EMAIL];
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': 'denkicontrol-gxworks2-support',
    },
    body: JSON.stringify(payload),
  });
  let body = {};
  try { body = await response.json(); }
  catch { body = { message: 'Non-JSON response from email provider' }; }
  return { ok: response.ok, status: response.status, body };
}

function sanitizeConsultation(body) {
  return {
    name: clean(body.name, 100),
    email: clean(body.email, 254),
    company: clean(body.company, 160),
    plc: clean(body.plc, 120),
    problem: clean(body.problem, 5000),
    desired: clean(body.desired, 5000),
    photo: clean(body.photo, 40),
    gxdata: clean(body.gxdata, 40),
    zipName: clean(body.zipName, 255),
    zipSize: Number.isFinite(Number(body.zipSize)) ? Math.max(0, Math.floor(Number(body.zipSize))) : 0,
  };
}

function createCaseNumber() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `GXW-${y}${m}${d}-${suffix}`;
}

function plannedZipMode(size) {
  if (!size) return 'pending';
  return size < 20 * 1024 * 1024 ? 'email-attachment-planned' : 'private-storage-planned';
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

function isValidIdempotencyKey(value) {
  return /^[A-Za-z0-9_-]{20,80}$/.test(value);
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').trim().slice(0, max);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function formatBytes(value) {
  if (!value || value < 1) return '未接続';
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${(value / 1024 ** 3).toFixed(2)} GB`;
}

function safeDetail(value) {
  let text;
  try { text = typeof value === 'string' ? value : JSON.stringify(value); }
  catch { text = String(value); }
  return clean(text, 1000);
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === PROD_ORIGIN || origin === 'https://www.denkicontrol.com') return true;
  try {
    const u = new URL(origin);
    return u.protocol === 'https:' && u.hostname.endsWith(ALLOWED_ORIGIN_SUFFIX);
  } catch {
    return false;
  }
}

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
  };
  if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...corsHeaders(origin),
    },
  });
}
