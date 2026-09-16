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
      return json({
        ok: true,
        service: 'gxworks2-support-api',
        message: 'Worker is running',
        r2: Boolean(env.GXW_FILES),
        db: Boolean(env.DB),
        passwordStorage: Boolean(env.GXW_PASSWORD_KEY),
      }, 200, origin);
    }

    if (request.method === 'POST' && url.pathname === '/consultations') {
      if (!isAllowedOrigin(origin)) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      return createConsultation(request, env, origin);
    }

    if (request.method === 'PUT' && url.pathname === '/consultations/zip') {
      if (!isAllowedOrigin(origin)) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      return uploadConsultationZip(request, env, origin);
    }

    if (request.method === 'POST' && url.pathname === '/consultations/status') {
      if (!isAllowedOrigin(origin)) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      return consultationStatus(request, env, origin);
    }

    if (request.method === 'POST' && url.pathname === '/consultations/password') {
      if (!isAllowedOrigin(origin)) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      return submitConsultationPassword(request, env, origin);
    }

    return json({ ok: false, error: 'Not found' }, 404, origin);
  },
};

async function createConsultation(request, env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.DB || !env.GXW_FILES) {
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
  if (!isZipName(data.zipName) || data.zipSize < 1) {
    return json({ ok: false, error: 'A ZIP file is required' }, 400, origin);
  }

  const requestHash = await sha256Hex(JSON.stringify(data));
  let row = await getConsultationByIdempotency(env.DB, idempotencyKey);
  const existed = Boolean(row);

  if (row && row.request_hash !== requestHash) {
    return json({ ok: false, error: 'This request key was already used for different content' }, 409, origin);
  }

  if (!row) {
    const now = new Date().toISOString();
    const caseNumber = createCaseNumber();

    try {
      await env.DB.prepare(`
        INSERT INTO consultations (
          idempotency_key, request_hash, case_number, state, accepted_at, updated_at,
          name, email, company, plc, problem, desired, photo, gxdata,
          zip_name, zip_size, zip_storage_mode
        ) VALUES (?1, ?2, ?3, 'awaiting_zip', ?4, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, 'r2-private-pending')
      `).bind(
        idempotencyKey, requestHash, caseNumber, now,
        data.name, data.email, data.company, data.plc, data.problem, data.desired,
        data.photo, data.gxdata, data.zipName, data.zipSize
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
    await addEvent(env.DB, row.id, 'received', 'Consultation metadata accepted into D1; ZIP upload pending');
  }

  if (row.zip_object_key) {
    return continueConsultation(row, env, origin, existed);
  }

  return json({
    ok: true,
    duplicate: existed,
    uploadRequired: true,
    caseNumber: row.case_number,
    acceptedAt: row.accepted_at,
    state: row.state,
    zipUploaded: false,
  }, existed ? 200 : 201, origin);
}

async function uploadConsultationZip(request, env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.DB || !env.GXW_FILES) {
    return json({ ok: false, error: 'Server configuration is incomplete' }, 500, origin);
  }

  const idempotencyKey = clean(request.headers.get('X-GXW-Idempotency-Key') || '', 80);
  if (!isValidIdempotencyKey(idempotencyKey)) {
    return json({ ok: false, error: 'A valid idempotency key is required' }, 400, origin);
  }

  let row = await getConsultationByIdempotency(env.DB, idempotencyKey);
  if (!row) return json({ ok: false, error: 'Consultation was not found' }, 404, origin);

  if (row.state === 'completed' && row.zip_object_key) {
    return completedResponse(row, origin, true);
  }

  if (row.zip_object_key) {
    const existing = await env.GXW_FILES.head(row.zip_object_key);
    if (existing && (!row.zip_size || existing.size === row.zip_size)) {
      return continueConsultation(row, env, origin, true);
    }
  }

  if (!request.body) {
    return json({ ok: false, error: 'ZIP request body is required' }, 400, origin);
  }

  const contentType = (request.headers.get('Content-Type') || '').toLowerCase();
  if (contentType && !contentType.includes('zip') && !contentType.includes('octet-stream')) {
    return json({ ok: false, error: 'ZIP content type is required' }, 415, origin);
  }

  const declaredSize = parsePositiveInteger(request.headers.get('X-GXW-File-Size'));
  const contentLength = parsePositiveInteger(request.headers.get('Content-Length'));
  const expectedSize = row.zip_size || declaredSize || contentLength;

  if (row.zip_size && declaredSize && row.zip_size !== declaredSize) {
    return json({ ok: false, error: 'ZIP size does not match the consultation metadata' }, 409, origin);
  }
  if (row.zip_size && contentLength && row.zip_size !== contentLength) {
    return json({ ok: false, error: 'ZIP size does not match the request body' }, 409, origin);
  }

  const objectKey = `consultations/${row.case_number}/source.zip`;
  let stored;
  try {
    stored = await env.GXW_FILES.put(objectKey, request.body, {
      httpMetadata: { contentType: 'application/zip' },
      customMetadata: { caseNumber: row.case_number },
    });
  } catch (error) {
    console.error('R2 put failed', error);
    await addEvent(env.DB, row.id, 'zip_upload_failed', safeDetail(error?.message || error));
    return json({ ok: false, recoverable: true, caseNumber: row.case_number, error: 'ZIP storage failed' }, 503, origin);
  }

  if (!stored) {
    await addEvent(env.DB, row.id, 'zip_upload_failed', 'R2 put returned no object');
    return json({ ok: false, recoverable: true, caseNumber: row.case_number, error: 'ZIP storage failed' }, 503, origin);
  }

  if (expectedSize && stored.size !== expectedSize) {
    try { await env.GXW_FILES.delete(objectKey); } catch {}
    await addEvent(env.DB, row.id, 'zip_upload_failed', `Size mismatch expected=${expectedSize} stored=${stored.size}`);
    return json({ ok: false, recoverable: true, caseNumber: row.case_number, error: 'ZIP size verification failed' }, 409, origin);
  }

  const now = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE consultations
       SET state='zip_uploaded',
           zip_size=?2,
           zip_storage_mode='r2-private',
           zip_object_key=?3,
           updated_at=?4,
           last_error=NULL
     WHERE id=?1
  `).bind(row.id, stored.size, objectKey, now).run();
  await addEvent(env.DB, row.id, 'zip_uploaded', `Stored privately in R2: ${objectKey} (${stored.size} bytes)`);

  row = await getConsultationById(env.DB, row.id);
  return continueConsultation(row, env, origin, false);
}

async function continueConsultation(row, env, origin, duplicate = false) {
  let current = row;

  if (!current.zip_object_key || current.zip_storage_mode !== 'r2-private') {
    return json({
      ok: true,
      duplicate,
      uploadRequired: true,
      caseNumber: current.case_number,
      acceptedAt: current.accepted_at,
      state: current.state,
      zipUploaded: false,
    }, 200, origin);
  }

  if (current.admin_mail_status !== 'sent') {
    const claim = await claimMail(env.DB, current.id, 'admin');
    if (claim === 'busy') return processingResponse(current, origin);
    if (claim === 'claimed') {
      const result = await sendEmail(env, buildAdminEmail(current));
      if (!result.ok) {
        await markMailFailed(env.DB, current.id, 'admin', result.body);
        await addEvent(env.DB, current.id, 'admin_mail_failed', safeDetail(result.body));
        return json({ ok: false, recoverable: true, caseNumber: current.case_number, zipUploaded: true, error: 'Notification email failed' }, 502, origin);
      }
      await markMailSent(env.DB, current.id, 'admin', result.body.id || '');
      await addEvent(env.DB, current.id, 'admin_mail_sent', result.body.id || '');
    }
    current = await getConsultationById(env.DB, current.id);
  }

  if (current.customer_mail_status !== 'sent') {
    const claim = await claimMail(env.DB, current.id, 'customer');
    if (claim === 'busy') return processingResponse(current, origin);
    if (claim === 'claimed') {
      const result = await sendEmail(env, buildCustomerEmail(current));
      if (!result.ok) {
        await markMailFailed(env.DB, current.id, 'customer', result.body);
        await addEvent(env.DB, current.id, 'customer_mail_failed', safeDetail(result.body));
        return json({ ok: false, recoverable: true, caseNumber: current.case_number, zipUploaded: true, error: 'Customer confirmation email failed' }, 502, origin);
      }
      await markMailSent(env.DB, current.id, 'customer', result.body.id || '');
      await addEvent(env.DB, current.id, 'customer_mail_sent', result.body.id || '');
    }
    current = await getConsultationById(env.DB, current.id);
  }

  if (current.state !== 'completed') {
    const completedAt = new Date().toISOString();
    const result = await env.DB.prepare(`
      UPDATE consultations
         SET state='completed', updated_at=?2, last_error=NULL
       WHERE id=?1
         AND zip_object_key IS NOT NULL
         AND admin_mail_status='sent'
         AND customer_mail_status='sent'
         AND state!='completed'
    `).bind(current.id, completedAt).run();
    if ((result.meta?.changes || 0) > 0) {
      await addEvent(env.DB, current.id, 'completed', 'ZIP stored in R2 and both emails completed');
    }
    current = await getConsultationById(env.DB, current.id);
  }

  return completedResponse(current, origin, duplicate);
}

function completedResponse(row, origin, duplicate = false) {
  return json({
    ok: true,
    duplicate,
    uploadRequired: false,
    caseNumber: row.case_number,
    acceptedAt: row.accepted_at,
    state: row.state,
    zipUploaded: Boolean(row.zip_object_key),
    zipHandling: row.zip_storage_mode,
    completed: row.state === 'completed',
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
  const passwordRow = await getPasswordByConsultationId(env.DB, row.id).catch(() => null);
  return json({
    ok: true,
    found: true,
    caseNumber: row.case_number,
    acceptedAt: row.accepted_at,
    state: row.state,
    zipUploaded: Boolean(row.zip_object_key),
    zipStorageMode: row.zip_storage_mode,
    adminMail: row.admin_mail_status,
    customerMail: row.customer_mail_status,
    completed: row.state === 'completed',
    passwordReceived: Boolean(passwordRow),
    passwordNotification: passwordRow?.notification_status || 'not_received',
  }, 200, origin);
}

async function submitConsultationPassword(request, env, origin) {
  if (!env.DB || !env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.GXW_PASSWORD_KEY) {
    return json({ ok: false, error: 'Password service configuration is incomplete' }, 500, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400, origin);
  }

  const idempotencyKey = clean(body.idempotencyKey, 80);
  const caseNumber = clean(body.caseNumber, 40).toUpperCase();
  const password = typeof body.password === 'string' ? body.password.trim() : '';

  if (!isValidIdempotencyKey(idempotencyKey)) {
    return json({ ok: false, error: 'A valid receipt key is required' }, 400, origin);
  }
  if (!/^GXW-\d{8}-[A-F0-9]{8}$/.test(caseNumber)) {
    return json({ ok: false, error: 'Invalid case number' }, 400, origin);
  }
  if (!password || password.length > 200) {
    return json({ ok: false, error: 'ZIP password is required' }, 400, origin);
  }

  const row = await getConsultationByIdempotency(env.DB, idempotencyKey);
  if (!row || row.case_number !== caseNumber) {
    return json({ ok: false, error: 'Consultation verification failed' }, 403, origin);
  }
  if (!row.zip_object_key || row.zip_storage_mode !== 'r2-private') {
    return json({ ok: false, error: 'ZIP upload is not complete yet' }, 409, origin);
  }

  const passwordHash = await sha256Hex(password);
  const existing = await getPasswordByConsultationId(env.DB, row.id);

  if (existing && existing.password_hash === passwordHash && existing.notification_status === 'sent') {
    return json({
      ok: true,
      duplicate: true,
      caseNumber: row.case_number,
      passwordReceived: true,
      notificationSent: true,
    }, 200, origin);
  }

  let encrypted;
  try {
    encrypted = await encryptPassword(password, env.GXW_PASSWORD_KEY);
  } catch (error) {
    console.error('Password encryption failed', error);
    return json({ ok: false, error: 'Password encryption failed' }, 500, origin);
  }

  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO consultation_passwords (
      consultation_id, password_hash, ciphertext, iv,
      submitted_at, updated_at, notification_status, last_error
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?5, 'pending', NULL)
    ON CONFLICT(consultation_id) DO UPDATE SET
      password_hash=excluded.password_hash,
      ciphertext=excluded.ciphertext,
      iv=excluded.iv,
      updated_at=excluded.updated_at,
      notification_status=CASE
        WHEN consultation_passwords.password_hash=excluded.password_hash
         AND consultation_passwords.notification_status='sent'
        THEN 'sent'
        ELSE 'pending'
      END,
      notification_sent_at=CASE
        WHEN consultation_passwords.password_hash=excluded.password_hash
         AND consultation_passwords.notification_status='sent'
        THEN consultation_passwords.notification_sent_at
        ELSE NULL
      END,
      notification_provider_id=CASE
        WHEN consultation_passwords.password_hash=excluded.password_hash
         AND consultation_passwords.notification_status='sent'
        THEN consultation_passwords.notification_provider_id
        ELSE NULL
      END,
      last_error=NULL
  `).bind(row.id, passwordHash, encrypted.ciphertext, encrypted.iv, now).run();

  await addEvent(env.DB, row.id, 'password_received', 'ZIP password received and encrypted in separate D1 storage');

  let passwordRow = await getPasswordByConsultationId(env.DB, row.id);
  if (passwordRow?.notification_status !== 'sent') {
    const result = await sendEmail(env, buildPasswordAdminEmail(row, password));
    if (!result.ok) {
      await env.DB.prepare(`
        UPDATE consultation_passwords
           SET notification_status='failed', last_error=?2, updated_at=?3
         WHERE consultation_id=?1
      `).bind(row.id, safeDetail(result.body), new Date().toISOString()).run();
      await addEvent(env.DB, row.id, 'password_notification_failed', safeDetail(result.body));
      return json({
        ok: false,
        recoverable: true,
        caseNumber: row.case_number,
        passwordReceived: true,
        notificationSent: false,
        error: 'Password was saved, but owner notification failed',
      }, 502, origin);
    }

    const sentAt = new Date().toISOString();
    await env.DB.prepare(`
      UPDATE consultation_passwords
         SET notification_status='sent', notification_sent_at=?2,
             notification_provider_id=?3, last_error=NULL, updated_at=?2
       WHERE consultation_id=?1
    `).bind(row.id, sentAt, result.body.id || '').run();
    await addEvent(env.DB, row.id, 'password_notification_sent', result.body.id || '');
  }

  passwordRow = await getPasswordByConsultationId(env.DB, row.id);
  return json({
    ok: true,
    duplicate: Boolean(existing && existing.password_hash === passwordHash),
    caseNumber: row.case_number,
    passwordReceived: true,
    notificationSent: passwordRow?.notification_status === 'sent',
  }, 200, origin);
}

async function encryptPassword(password, secret) {
  const material = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  const key = await crypto.subtle.importKey('raw', material, { name: 'AES-GCM' }, false, ['encrypt']);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(password)
  );
  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
  };
}

function bytesToBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
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
  await env.DB.prepare(`
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

async function getPasswordByConsultationId(db, consultationId) {
  return db.prepare('SELECT * FROM consultation_passwords WHERE consultation_id=?1 LIMIT 1').bind(consultationId).first();
}

async function addEvent(db, consultationId, eventType, detail = '') {
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
    zipUploaded: Boolean(row.zip_object_key),
    message: 'The receipt is already being processed. Check status instead of resubmitting.',
  }, 202, origin);
}

function buildAdminEmail(row) {
  return {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [],
    subject: `[${row.case_number}] GX Works2 新規相談受付`,
    text: [
      'GX Works2 オンライン相談を受け付けました。',
      '',
      `相談番号: ${row.case_number}`,
      `受付日時: ${row.accepted_at}`,
      `お名前: ${row.name}`,
      `会社名: ${row.company || '未入力'}`,
      `返信先: ${row.email}`,
      `PLC型式: ${row.plc || '未入力'}`,
      `設備写真: ${row.photo || '未入力'}`,
      `GX Works2データ: ${row.gxdata || '未入力'}`,
      `ZIPファイル名: ${row.zip_name || '未入力'}`,
      `ZIP容量: ${formatBytes(row.zip_size)}`,
      `ZIP保存: 非公開R2 (${row.zip_object_key || '未保存'})`,
      '',
      '現在困っていること:',
      row.problem,
      '',
      'どのように変更したいか:',
      row.desired,
      '',
      '※ ZIP本体はメール添付ではなく、非公開R2バケットに保存されています。'
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
      `${row.name} 様`,
      '',
      'GX Works2 オンライン相談を受け付けました。',
      `相談番号: ${row.case_number}`,
      '',
      'パスワード付きZIPファイルの受信が完了しています。',
      '続けて、画面に表示された相談番号を使ってZIPパスワードを別送してください。',
      '内容を確認後、返信用メールアドレスへご連絡します。',
      '',
      '電気と制御の実務メモ'
    ].join('\n'),
  };
}

function buildPasswordAdminEmail(row, password) {
  return {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [],
    subject: `[${row.case_number}] ZIPパスワード受信`,
    text: [
      'GX Works2 オンライン相談のZIPパスワードを別送で受け付けました。',
      '',
      `相談番号: ${row.case_number}`,
      `お名前: ${row.name}`,
      `返信先: ${row.email}`,
      '',
      `ZIPパスワード: ${password}`,
      '',
      '※ ZIP本体はこのメールには添付されていません。非公開R2に別管理されています。',
      '※ パスワードはD1内では暗号化して保存しています。'
    ].join('\n'),
    reply_to: row.email,
  };
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
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `GXW-${values.year}${values.month}${values.day}-${suffix}`;
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

function isValidIdempotencyKey(value) {
  return /^[A-Za-z0-9_-]{20,80}$/.test(value);
}

function isZipName(value) {
  return typeof value === 'string' && value.toLowerCase().endsWith('.zip');
}

function parsePositiveInteger(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').trim().slice(0, max);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function formatBytes(value) {
  if (!value || value < 1) return '未入力';
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
    'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-GXW-Idempotency-Key, X-GXW-File-Size',
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
