const ALLOWED_ORIGIN_SUFFIX = '.denkicontrol-preview.pages.dev';
const PROD_ORIGIN = 'https://denkicontrol.com';
const MAIL_LOCK_MS = 120000;
const ADMIN_ATTACHMENT_MAX_BYTES = 20 * 1024 * 1024;
const ADMIN_CASE_STATUSES = new Set(['received','estimating','estimate_sent','deposit_wait','working','delivered','completed','on_hold','cancelled']);
const ADMIN_FOLLOWUP_STATUSES = new Set(['not_scheduled','scheduled','sent','replied','closed','cancelled']);
const ADMIN_NEXT_ACTION_DEFAULTS = Object.freeze({
  received:'相談内容と必要資料を確認する',
  estimating:'作業範囲・金額・納期を確認して見積を作成する',
  estimate_sent:'見積内容への回答を確認する',
  deposit_wait:'銀行で着手金の入金を確認する',
  working:'合意した作業範囲に沿って作業を進める',
  delivered:'フォロー予定日に納品後の状況を確認する',
  completed:'',
  on_hold:'保留理由と再開条件を確認する',
  cancelled:'',
});
const ADMIN_FOLLOWUP_NEXT_ACTION = 'フォローへの返信・追加要望を確認する';
const ADMIN_SUPABASE_URL = 'https://pavitnsnmoaiospswiys.supabase.co';
const ADMIN_SUPABASE_KEY = 'sb_publishable_J3Muz4RVr7sqDsSTen1LNA_y_mgKAyG';
let adminSchemaReady = false;

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
        adminZipAttachmentMaxBytes: ADMIN_ATTACHMENT_MAX_BYTES,
      }, 200, origin);
    }

    if (!isAllowedOrigin(origin)) {
      return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
    }

    if (url.pathname.startsWith('/admin/')) {
      return handleAdminRequest(request, env, origin, url);
    }

    if (request.method === 'GET' && url.pathname === '/general-consultations/config') {
      if (!env.TURNSTILE_SITE_KEY) return json({ ok: false, error: 'Turnstile is not configured' }, 503, origin);
      return json({ ok: true, turnstileSiteKey: env.TURNSTILE_SITE_KEY }, 200, origin);
    }

    if (request.method === 'POST' && url.pathname === '/consultations') {
      return createConsultation(request, env, origin);
    }
    if (request.method === 'PUT' && url.pathname === '/consultations/zip') {
      return uploadConsultationZip(request, env, origin);
    }
    if (request.method === 'POST' && url.pathname === '/consultations/status') {
      return consultationStatus(request, env, origin);
    }
    if (request.method === 'POST' && url.pathname === '/consultations/password') {
      return submitConsultationPassword(request, env, origin);
    }
    if (request.method === 'POST' && url.pathname === '/general-consultations') {
      return submitGeneralConsultation(request, env, origin);
    }

    return json({ ok: false, error: 'Not found' }, 404, origin);
  },
};

async function createConsultation(request, env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.DB || !env.GXW_FILES) {
    return json({ ok: false, error: 'Server configuration is incomplete' }, 500, origin);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400, origin); }

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
    await addEvent(env.DB, row.id, 'received', 'Consultation metadata accepted into D1; ZIP upload pending');
    try { await upsertAdminCaseFromGxw(env.DB, row); } catch (error) { console.error('Admin case sync failed', error); }
  }

  if (row.zip_object_key) return continueConsultation(row, env, origin, existed);

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

  if (!request.body) return json({ ok: false, error: 'ZIP request body is required' }, 400, origin);

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
       SET state='zip_uploaded', zip_size=?2, zip_storage_mode='r2-private',
           zip_object_key=?3, updated_at=?4, last_error=NULL
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
      let adminPayload = await buildAdminEmail(current, env, true);
      let result = await sendEmail(env, adminPayload);
      if (!result.ok && adminPayload.attachments?.length) {
        await addEvent(env.DB, current.id, 'admin_mail_attachment_failed', safeDetail(result.body));
        adminPayload = await buildAdminEmail(current, env, false);
        result = await sendEmail(env, adminPayload);
      }
      if (!result.ok) {
        await markMailFailed(env.DB, current.id, 'admin', result.body);
        await addEvent(env.DB, current.id, 'admin_mail_failed', safeDetail(result.body));
        return json({ ok: false, recoverable: true, caseNumber: current.case_number, zipUploaded: true, error: 'Notification email failed' }, 502, origin);
      }
      await markMailSent(env.DB, current.id, 'admin', result.body.id || '');
      await addEvent(env.DB, current.id, 'admin_mail_sent', adminPayload.attachments?.length ? 'ZIP attached to admin email' : (result.body.id || ''));
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

async function consultationStatus(request, env, origin) {
  if (!env.DB) return json({ ok: false, error: 'Database is not configured' }, 500, origin);

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400, origin); }

  const key = clean(body.idempotencyKey, 80);
  if (!isValidIdempotencyKey(key)) return json({ ok: false, error: 'Invalid idempotency key' }, 400, origin);

  const row = await getConsultationByIdempotency(env.DB, key);
  if (!row) return json({ ok: false, found: false }, 404, origin);

  let passwordRow = null;
  try { passwordRow = await getPasswordByConsultationId(env.DB, row.id); } catch {}
  let passwordCustomerConfirmation = false;
  try { passwordCustomerConfirmation = await hasEvent(env.DB, row.id, 'password_customer_confirmation_sent'); } catch {}

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
    passwordCustomerConfirmation,
  }, 200, origin);
}

async function submitConsultationPassword(request, env, origin) {
  if (!env.DB || !env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.GXW_PASSWORD_KEY) {
    return json({ ok: false, error: 'Password service configuration is incomplete' }, 500, origin);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400, origin); }

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
  const customerAlreadyConfirmed = await hasEvent(env.DB, row.id, 'password_customer_confirmation_sent');
  if (existing && existing.password_hash === passwordHash && existing.notification_status === 'sent' && customerAlreadyConfirmed) {
    return json({
      ok: true,
      duplicate: true,
      caseNumber,
      passwordReceived: true,
      notificationSent: true,
      customerConfirmationSent: true,
    }, 200, origin);
  }

  if (!existing || existing.password_hash !== passwordHash || existing.notification_status !== 'sent') {
    let encrypted;
    try { encrypted = await encryptPassword(password, env.GXW_PASSWORD_KEY); }
    catch (error) {
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
          THEN 'sent' ELSE 'pending' END,
        notification_sent_at=CASE
          WHEN consultation_passwords.password_hash=excluded.password_hash
           AND consultation_passwords.notification_status='sent'
          THEN consultation_passwords.notification_sent_at ELSE NULL END,
        notification_provider_id=CASE
          WHEN consultation_passwords.password_hash=excluded.password_hash
           AND consultation_passwords.notification_status='sent'
          THEN consultation_passwords.notification_provider_id ELSE NULL END,
        last_error=NULL
    `).bind(row.id, passwordHash, encrypted.ciphertext, encrypted.iv, now).run();

    await addEvent(env.DB, row.id, 'password_received', 'ZIP password received and encrypted in separate D1 storage');
  }

  let passwordRow = await getPasswordByConsultationId(env.DB, row.id);
  if (passwordRow.notification_status !== 'sent') {
    const result = await sendEmail(env, buildPasswordAdminEmail(row, password));
    if (!result.ok) {
      const failedAt = new Date().toISOString();
      await env.DB.prepare(`
        UPDATE consultation_passwords
           SET notification_status='failed', last_error=?2, updated_at=?3
         WHERE consultation_id=?1
      `).bind(row.id, safeDetail(result.body), failedAt).run();
      await addEvent(env.DB, row.id, 'password_notification_failed', safeDetail(result.body));
      return json({
        ok: false,
        recoverable: true,
        caseNumber,
        passwordReceived: true,
        notificationSent: false,
        customerConfirmationSent: false,
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

  let customerConfirmationSent = await hasEvent(env.DB, row.id, 'password_customer_confirmation_sent');
  if (!customerConfirmationSent) {
    const result = await sendEmail(env, buildPasswordCustomerEmail(row));
    if (!result.ok) {
      await addEvent(env.DB, row.id, 'password_customer_confirmation_failed', safeDetail(result.body));
      return json({
        ok: false,
        recoverable: true,
        caseNumber,
        passwordReceived: true,
        notificationSent: true,
        customerConfirmationSent: false,
        error: 'Password was saved and owner was notified, but customer confirmation failed',
      }, 502, origin);
    }
    await addEvent(env.DB, row.id, 'password_customer_confirmation_sent', result.body.id || '');
    customerConfirmationSent = true;
  }

  passwordRow = await getPasswordByConsultationId(env.DB, row.id);
  return json({
    ok: true,
    duplicate: Boolean(existing && existing.password_hash === passwordHash),
    caseNumber,
    passwordReceived: true,
    notificationSent: passwordRow?.notification_status === 'sent',
    customerConfirmationSent,
  }, 200, origin);
}


async function submitGeneralConsultation(request, env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.TURNSTILE_SECRET_KEY || !env.DB) {
    return json({ ok: false, error: 'General consultation configuration is incomplete' }, 500, origin);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400, origin); }

  const requestKey = clean(body.requestKey, 80);
  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : '';
  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 254),
    company: clean(body.company, 160),
    category: clean(body.category, 80),
    relatedUrl: clean(body.relatedUrl, 500),
    message: rawMessage,
    replyWanted: body.replyWanted !== false,
    privacyAccepted: body.privacyAccepted === true,
  };

  if (!isValidIdempotencyKey(requestKey)) {
    return json({ ok: false, error: 'A valid request key is required' }, 400, origin);
  }
  if (!data.name || !isValidEmail(data.email) || !data.category || !data.message || !data.privacyAccepted) {
    return json({ ok: false, error: 'Required fields are missing or invalid' }, 400, origin);
  }
  if (data.message.length > 8000) {
    return json({ ok: false, error: 'Message is too long' }, 400, origin);
  }
  if (!turnstileToken || turnstileToken.length > 2048) {
    return json({ ok: false, error: 'Human verification is required' }, 403, origin);
  }

  const remoteIp = clean(request.headers.get('CF-Connecting-IP') || '', 80);
  const verification = await verifyTurnstile(turnstileToken, remoteIp, env.TURNSTILE_SECRET_KEY);
  if (!verification.success || verification.action !== 'general_consultation' || !isAllowedTurnstileHostname(verification.hostname || '')) {
    return json({ ok: false, error: 'Human verification failed' }, 403, origin);
  }

  try {
    const allowed = await consumeGeneralConsultationRateLimit(env.DB, remoteIp, data.email);
    if (!allowed) return json({ ok: false, error: 'Too many consultation requests. Please try again later.' }, 429, origin);
  } catch (error) {
    console.error('General consultation rate limit failed', error);
    return json({ ok: false, error: 'Rate limit service unavailable' }, 503, origin);
  }

  const caseNumber = await createGeneralCaseNumber(requestKey);
  const acceptedAt = new Date().toISOString();

  try { await upsertAdminCaseFromGeneral(env.DB, caseNumber, acceptedAt, data); } catch (error) { console.error('General consultation admin case sync failed', error); }

  const adminPayload = {
    from: '電気と制御の実務メモ オンライン相談 <support@denkicontrol.com>',
    to: [],
    subject: `[${caseNumber}] オンライン相談｜${data.category}｜${data.name}様`,
    text: [
      'denkicontrol.com からオンライン相談を受け付けました。', '',
      `相談番号: ${caseNumber}`,
      `お名前: ${data.name}`,
      `会社名: ${data.company || '未入力'}`,
      `返信先: ${data.email}`,
      `相談の種類: ${data.category}`,
      `返信希望: ${data.replyWanted ? '希望する' : '返信不要'}`,
      `対象URL: ${data.relatedUrl || '未入力'}`, '',
      '相談内容:', data.message
    ].join('\n'),
    reply_to: data.email,
  };

  const adminResult = await sendEmail(env, adminPayload, `${requestKey}-admin`);
  if (!adminResult.ok) {
    return json({ ok: false, recoverable: true, ownerSent: false, error: 'Owner notification email failed' }, 502, origin);
  }

  const customerPayload = {
    from: '電気と制御の実務メモ <support@denkicontrol.com>',
    to: [data.email],
    subject: `[${caseNumber}] オンライン相談を受け付けました`,
    text: [
      `${data.name} 様`, '',
      '電気と制御の実務メモへのオンライン相談を受け付けました。',
      `相談番号: ${caseNumber}`,
      `相談の種類: ${data.category}`, '',
      data.replyWanted
        ? '内容を確認し、必要に応じて返信用メールアドレスへご連絡します。'
        : '「返信不要」で受け付けています。いただいた内容はサイト改善等の参考にします。',
      '',
      '※ 電気制御・回路・PLC等の技術相談は、設備仕様や現場状況を確認できないため、施工・安全・機器選定を個別に保証するものではありません。',
      '',
      '電気と制御の実務メモ'
    ].join('\n'),
  };

  const customerResult = await sendEmail(env, customerPayload, `${requestKey}-customer`);
  if (!customerResult.ok) {
    return json({
      ok: false,
      recoverable: true,
      caseNumber,
      acceptedAt,
      ownerSent: true,
      confirmationSent: false,
      error: 'Consultation was received, but confirmation email failed',
    }, 502, origin);
  }

  return json({
    ok: true,
    caseNumber,
    acceptedAt,
    ownerSent: true,
    confirmationSent: true,
  }, 200, origin);
}

async function verifyTurnstile(token, remoteIp, secret) {
  try {
    const body = { secret, response: token };
    if (remoteIp) body.remoteip = remoteIp;
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) return { success: false };
    return await response.json();
  } catch (error) {
    console.error('Turnstile verification failed', error);
    return { success: false };
  }
}

function isAllowedTurnstileHostname(hostname) {
  if (hostname === 'denkicontrol.com' || hostname === 'www.denkicontrol.com') return true;
  return hostname === 'denkicontrol-preview.pages.dev' || hostname.endsWith('.denkicontrol-preview.pages.dev');
}

async function consumeGeneralConsultationRateLimit(db, remoteIp, email) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS general_consultation_rate_limits (
      bucket TEXT PRIMARY KEY,
      window_start INTEGER NOT NULL,
      count INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  const buckets = [];
  if (remoteIp) buckets.push({ key: 'ip:' + await sha256Hex(remoteIp), limit: 6 });
  buckets.push({ key: 'email:' + await sha256Hex(email.toLowerCase()), limit: 3 });

  for (const bucket of buckets) {
    await db.prepare(`
      INSERT INTO general_consultation_rate_limits (bucket, window_start, count, updated_at)
      VALUES (?1, ?2, 1, ?3)
      ON CONFLICT(bucket) DO UPDATE SET
        count=CASE WHEN ?2 - window_start >= ?4 THEN 1 ELSE count + 1 END,
        window_start=CASE WHEN ?2 - window_start >= ?4 THEN ?2 ELSE window_start END,
        updated_at=?3
    `).bind(bucket.key, now, new Date(now).toISOString(), windowMs).run();
    const row = await db.prepare('SELECT window_start, count FROM general_consultation_rate_limits WHERE bucket=?1 LIMIT 1').bind(bucket.key).first();
    if (!row || row.count > bucket.limit) return false;
  }

  try {
    await db.prepare('DELETE FROM general_consultation_rate_limits WHERE window_start < ?1').bind(now - 24 * 60 * 60 * 1000).run();
  } catch {}
  return true;
}

async function createGeneralCaseNumber(requestKey) {
  const keyDate = /^web_(\d{8})_/.exec(requestKey)?.[1] || '';
  let date = keyDate;
  if (!date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    date = `${values.year}${values.month}${values.day}`;
  }
  const suffix = (await sha256Hex(requestKey)).slice(0, 8).toUpperCase();
  return `WEB-${date}-${suffix}`;
}

async function encryptPassword(password, secret) {
  const material = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  const key = await crypto.subtle.importKey('raw', material, { name: 'AES-GCM' }, false, ['encrypt']);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(password));
  return { ciphertext: bytesToBase64(new Uint8Array(encrypted)), iv: bytesToBase64(iv) };
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
  }
  return btoa(binary);
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
       AND (${statusCol} IN ('pending','failed') OR (${statusCol}='sending' AND (${startedCol} IS NULL OR ${startedCol} < ?3)))
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
async function getPasswordByConsultationId(db, consultationId) {
  return db.prepare('SELECT * FROM consultation_passwords WHERE consultation_id=?1 LIMIT 1').bind(consultationId).first();
}
async function hasEvent(db, consultationId, eventType) {
  const row = await db.prepare(`
    SELECT id FROM consultation_events
     WHERE consultation_id=?1 AND event_type=?2
     ORDER BY id DESC LIMIT 1
  `).bind(consultationId, eventType).first();
  return Boolean(row);
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

async function buildAdminEmail(row, env, includeAttachment = true) {
  const canAttach = includeAttachment && row.zip_object_key && row.zip_size > 0 && row.zip_size <= ADMIN_ATTACHMENT_MAX_BYTES;
  let attachment = null;

  if (canAttach) {
    try {
      const object = await env.GXW_FILES.get(row.zip_object_key);
      if (object) {
        const bytes = new Uint8Array(await object.arrayBuffer());
        if (bytes.byteLength === row.zip_size) {
          attachment = {
            filename: row.zip_name || `${row.case_number}.zip`,
            content: bytesToBase64(bytes),
          };
        }
      }
    } catch (error) {
      console.error('R2 attachment read failed', error);
    }
  }

  const attachmentNote = attachment
    ? '※ ZIP本体をこの管理者メールに添付しています。R2にも控えを保存しています。'
    : row.zip_size > ADMIN_ATTACHMENT_MAX_BYTES
      ? '※ ZIP本体は20MBを超えているためメール添付していません。非公開R2に保存されています。'
      : '※ ZIP本体はメール添付せず、非公開R2に保存されています。';

  const payload = {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [],
    subject: `[${row.case_number}] GX Works2 新規相談受付`,
    text: [
      'GX Works2 オンライン相談を受け付けました。', '',
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
      `ZIP保存: 非公開R2 (${row.zip_object_key || '未保存'})`, '',
      '現在困っていること:', row.problem, '',
      'どのように変更したいか:', row.desired, '',
      attachmentNote
    ].join('\n'),
    reply_to: row.email,
  };

  if (attachment) payload.attachments = [attachment];
  return payload;
}

function buildCustomerEmail(row) {
  return {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [row.email],
    subject: `[${row.case_number}] GX Works2 オンライン相談を受け付けました`,
    text: [
      `${row.name} 様`, '',
      'GX Works2 オンライン相談を受け付けました。',
      `相談番号: ${row.case_number}`, '',
      'パスワード付きZIPファイルの受信が完了しています。',
      '続けて、画面に表示された相談番号を使ってZIPパスワードを別送してください。',
      '内容を確認後、返信用メールアドレスへご連絡します。', '',
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
      'GX Works2 オンライン相談のZIPパスワードを別送で受け付けました。', '',
      `相談番号: ${row.case_number}`,
      `お名前: ${row.name}`,
      `返信先: ${row.email}`, '',
      `ZIPパスワード: ${password}`, '',
      '※ ZIP本体はこのメールには添付されていません。新規相談受付メール側の添付、または非公開R2の保存データをご確認ください。',
      '※ パスワードはD1内では暗号化して保存しています。'
    ].join('\n'),
    reply_to: row.email,
  };
}

function buildPasswordCustomerEmail(row) {
  return {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [row.email],
    subject: `[${row.case_number}] GX Works2 オンライン相談の受付が完了しました`,
    text: [
      `${row.name} 様`, '',
      'ZIPパスワードの登録が完了しました。',
      'これでGX Works2オンライン相談の受付は完了です。',
      `相談番号: ${row.case_number}`, '',
      'お送りいただいたGX Works2プロジェクトデータとご相談内容を確認し、',
      '原則2営業日以内にメールでご連絡いたします。', '',
      '電気と制御の実務メモ'
    ].join('\n'),
  };
}

async function sendEmail(env, payload, idempotencyKey = '') {
  if ((!payload.to || payload.to.length === 0) && env.NOTIFY_TO_EMAIL) payload.to = [env.NOTIFY_TO_EMAIL];
  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'denkicontrol-gxworks2-support',
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
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
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
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

function isValidIdempotencyKey(value) { return /^[A-Za-z0-9_-]{20,80}$/.test(value); }
function isZipName(value) { return typeof value === 'string' && value.toLowerCase().endsWith('.zip'); }
function parsePositiveInteger(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').trim().slice(0, max);
}
function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254; }
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


async function handleAdminRequest(request, env, origin, url) {
  if (!env.DB) return json({ ok:false, error:'Database is not configured' }, 503, origin);
  const admin = await verifyAdminAuthorization(request);
  if (!admin) return json({ ok:false, error:'Administrator access required' }, 401, origin);
  await ensureAdminCaseSchema(env.DB);
  await syncGxwCasesToAdmin(env.DB);

  if (request.method === 'GET' && url.pathname === '/admin/cases') {
    const result = await env.DB.prepare('SELECT * FROM admin_cases ORDER BY CASE status WHEN \'deposit_wait\' THEN 0 WHEN \'estimating\' THEN 1 WHEN \'estimate_sent\' THEN 2 WHEN \'working\' THEN 3 WHEN \'received\' THEN 4 WHEN \'delivered\' THEN 5 WHEN \'on_hold\' THEN 6 ELSE 7 END, COALESCE(due_date, \'9999-12-31\') ASC, updated_at DESC LIMIT 300').all();
    return json({ ok:true, cases:result.results || [] }, 200, origin);
  }

  const detailMatch = /^\/admin\/cases\/([^/]+)$/.exec(url.pathname);
  if (detailMatch && request.method === 'GET') {
    const caseNumber = decodeURIComponent(detailMatch[1]);
    const row = await env.DB.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
    if (!row) return json({ ok:false, error:'Case not found' }, 404, origin);
    const events = await env.DB.prepare('SELECT event_type, from_status, to_status, detail, actor, created_at FROM admin_case_events WHERE case_number=?1 ORDER BY id DESC LIMIT 100').bind(caseNumber).all();
    let source = null;
    if (row.source === 'gxworks2') {
      try { source = await env.DB.prepare('SELECT case_number,state,accepted_at,updated_at,name,email,company,plc,problem,desired,photo,gxdata,zip_name,zip_size,zip_storage_mode,admin_mail_status,customer_mail_status FROM consultations WHERE case_number=?1 LIMIT 1').bind(caseNumber).first(); } catch {}
    }
    return json({ ok:true, case:row, source, events:events.results || [], permissions:adminCasePermissions(row, admin), viewer:{ email:admin.email, name:admin.name } }, 200, origin);
  }

  if (detailMatch && request.method === 'PATCH') {
    return updateAdminCase(request, env.DB, decodeURIComponent(detailMatch[1]), admin, origin);
  }

  const depositMatch = /^\/admin\/cases\/([^/]+)\/deposit-confirm$/.exec(url.pathname);
  if (depositMatch && request.method === 'POST') {
    return confirmAdminCaseDeposit(env.DB, decodeURIComponent(depositMatch[1]), admin, origin);
  }

  const actionMatch = /^\/admin\/cases\/([^/]+)\/action$/.exec(url.pathname);
  if (actionMatch && request.method === 'POST') {
    return runAdminCaseAction(request, env.DB, decodeURIComponent(actionMatch[1]), admin, origin);
  }

  const reassignMatch = /^\/admin\/cases\/([^/]+)\/reassign$/.exec(url.pathname);
  if (reassignMatch && request.method === 'POST') {
    return reassignAdminCase(env.DB, decodeURIComponent(reassignMatch[1]), admin, origin);
  }
  return json({ ok:false, error:'Admin endpoint not found' }, 404, origin);
}

async function verifyAdminAuthorization(request) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return null;
  const token = authorization.slice(7).trim();
  if (!token || token.length > 8192) return null;
  try {
    const response = await fetch(ADMIN_SUPABASE_URL + '/rest/v1/rpc/admin_article_feedback_dashboard', {
      method:'POST',
      headers:{ apikey:ADMIN_SUPABASE_KEY, Authorization:'Bearer ' + token, 'Content-Type':'application/json' },
      body:'{}'
    });
    if (!response.ok) return null;
    const payload = decodeJwtPayload(token);
    const email = clean((payload && payload.email) || 'admin', 254) || 'admin';
    return { email, name:adminDisplayName(payload, email) };
  } catch (error) {
    console.error('Admin authorization check failed', error);
    return null;
  }
}

function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1] || '';
    const normalized = part.replace(/-/g,'+').replace(/_/g,'/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    if (typeof atob !== 'function') return {};
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch { return {}; }
}

async function ensureAdminCaseSchema(db) {
  if (adminSchemaReady) return;
  const statements = [
    "CREATE TABLE IF NOT EXISTS admin_cases (case_number TEXT PRIMARY KEY, source TEXT NOT NULL, source_id INTEGER, accepted_at TEXT NOT NULL, customer_name TEXT NOT NULL DEFAULT '', customer_email TEXT NOT NULL DEFAULT '', company TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'received', assignee TEXT NOT NULL DEFAULT '', assignee_email TEXT NOT NULL DEFAULT '', due_date TEXT, next_action TEXT NOT NULL DEFAULT '', estimate_total INTEGER, deposit_amount INTEGER, balance_amount INTEGER, deposit_confirmed_at TEXT, deposit_confirmed_by TEXT, delivered_at TEXT, followup_due_at TEXT, followup_status TEXT NOT NULL DEFAULT 'not_scheduled', followup_sent_at TEXT, followup_result TEXT NOT NULL DEFAULT '', customer_requests TEXT NOT NULL DEFAULT '', handoff_note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL DEFAULT '')",
    "CREATE INDEX IF NOT EXISTS idx_admin_cases_status ON admin_cases(status, updated_at DESC)",
    "CREATE INDEX IF NOT EXISTS idx_admin_cases_company ON admin_cases(company, customer_name)",
    "CREATE TABLE IF NOT EXISTS admin_case_events (id INTEGER PRIMARY KEY AUTOINCREMENT, case_number TEXT NOT NULL, event_type TEXT NOT NULL, from_status TEXT, to_status TEXT, detail TEXT NOT NULL DEFAULT '', actor TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)",
    "CREATE INDEX IF NOT EXISTS idx_admin_case_events_case ON admin_case_events(case_number, id DESC)"
  ];
  for (const sql of statements) await db.prepare(sql).run();
  try {
    await db.prepare("ALTER TABLE admin_cases ADD COLUMN assignee_email TEXT NOT NULL DEFAULT ''").run();
  } catch (error) {
    const message = String((error && error.message) || error || '').toLowerCase();
    if (!message.includes('duplicate column')) throw error;
  }
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_admin_cases_assignee_email ON admin_cases(assignee_email, status, updated_at DESC)").run();
  adminSchemaReady = true;
}

async function syncGxwCasesToAdmin(db) {
  try {
    await db.prepare("INSERT OR IGNORE INTO admin_cases (case_number,source,source_id,accepted_at,customer_name,customer_email,company,category,subject,summary,status,created_at,updated_at) SELECT case_number,'gxworks2',id,accepted_at,name,email,COALESCE(company,''),'GX Works2',CASE WHEN COALESCE(plc,'')='' THEN 'GX Works2 オンライン相談' ELSE 'GX Works2 / ' || plc END,COALESCE(problem,'') || CASE WHEN COALESCE(desired,'')='' THEN '' ELSE char(10) || '希望: ' || desired END,'received',accepted_at,updated_at FROM consultations WHERE case_number IS NOT NULL").run();
  } catch (error) { console.error('GX Works2 admin backfill failed', error); }
}

async function upsertAdminCaseFromGxw(db, row) {
  if (!row || !row.case_number) return;
  await ensureAdminCaseSchema(db);
  const subject = row.plc ? 'GX Works2 / ' + row.plc : 'GX Works2 オンライン相談';
  const summary = (row.problem || '') + (row.desired ? '\n希望: ' + row.desired : '');
  const result = await db.prepare("INSERT OR IGNORE INTO admin_cases (case_number,source,source_id,accepted_at,customer_name,customer_email,company,category,subject,summary,status,created_at,updated_at) VALUES (?1,'gxworks2',?2,?3,?4,?5,?6,'GX Works2',?7,?8,'received',?3,?9)").bind(row.case_number,row.id,row.accepted_at,row.name||'',row.email||'',row.company||'',subject,summary,row.updated_at||row.accepted_at).run();
  if ((result.meta && result.meta.changes || 0) > 0) await addAdminCaseEvent(db,row.case_number,'received','','received','GX Works2相談を案件管理へ登録','system');
}

async function upsertAdminCaseFromGeneral(db, caseNumber, acceptedAt, data) {
  await ensureAdminCaseSchema(db);
  const subject = data.relatedUrl ? (data.category || 'オンライン相談') + ' / ' + data.relatedUrl : (data.category || 'オンライン相談');
  const result = await db.prepare("INSERT OR IGNORE INTO admin_cases (case_number,source,accepted_at,customer_name,customer_email,company,category,subject,summary,status,created_at,updated_at) VALUES (?1,'general',?2,?3,?4,?5,?6,?7,?8,'received',?2,?2)").bind(caseNumber,acceptedAt,data.name||'',data.email||'',data.company||'',data.category||'オンライン相談',subject,data.message||'').run();
  if ((result.meta && result.meta.changes || 0) > 0) await addAdminCaseEvent(db,caseNumber,'received','','received','オンライン相談を案件管理へ登録','system');
}

async function updateAdminCase(request, db, caseNumber, admin, origin) {
  let body;
  try { body = await request.json(); } catch { return json({ ok:false, error:'Invalid JSON' }, 400, origin); }
  const before = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  if (!before) return json({ ok:false, error:'Case not found' }, 404, origin);
  if (!canAdminEditCase(before, admin)) return json({ ok:false, error:'This case is assigned to another administrator' }, 403, origin);
  if (Object.prototype.hasOwnProperty.call(body,'assignee') || Object.prototype.hasOwnProperty.call(body,'assignee_email')) {
    return json({ ok:false, error:'Use the reassignment action to change the assignee' }, 400, origin);
  }
  const values = {};

  if (Object.prototype.hasOwnProperty.call(body,'status')) {
    const status = clean(body.status,40);
    if (!ADMIN_CASE_STATUSES.has(status)) return json({ ok:false, error:'Invalid status' }, 400, origin);
    values.status = status;
  }
  if (Object.prototype.hasOwnProperty.call(body,'followup_status')) {
    const follow = clean(body.followup_status,40);
    if (!ADMIN_FOLLOWUP_STATUSES.has(follow)) return json({ ok:false, error:'Invalid follow-up status' }, 400, origin);
    values.followup_status = follow;
  }

  const textFields = {due_date:40,next_action:1000,delivered_at:40,followup_sent_at:40,followup_result:4000,customer_requests:4000,handoff_note:8000};
  for (const field of Object.keys(textFields)) if (Object.prototype.hasOwnProperty.call(body,field)) values[field] = clean(body[field],textFields[field]);

  for (const field of ['estimate_total','deposit_amount']) {
    if (!Object.prototype.hasOwnProperty.call(body,field)) continue;
    if (body[field] === '' || body[field] === null) values[field] = null;
    else {
      const amount = Number(body[field]);
      if (!Number.isSafeInteger(amount) || amount < 0 || amount > 999999999) return json({ ok:false, error:'Invalid amount: ' + field }, 400, origin);
      values[field] = amount;
    }
  }

  const total = Object.prototype.hasOwnProperty.call(values,'estimate_total') ? values.estimate_total : before.estimate_total;
  const deposit = Object.prototype.hasOwnProperty.call(values,'deposit_amount') ? values.deposit_amount : before.deposit_amount;
  if (total !== null && total !== undefined && deposit !== null && deposit !== undefined) {
    if (deposit > total) return json({ ok:false, error:'Deposit exceeds estimate total' }, 400, origin);
    values.balance_amount = total - deposit;
  } else if (Object.prototype.hasOwnProperty.call(values,'estimate_total') || Object.prototype.hasOwnProperty.call(values,'deposit_amount')) {
    values.balance_amount = null;
  }

  const deliveredChanged = Object.prototype.hasOwnProperty.call(values,'delivered_at') && clean(before.delivered_at || '',40) !== values.delivered_at;
  if (deliveredChanged && values.delivered_at) {
    if (before.status !== 'working' && before.status !== 'delivered') return json({ ok:false, error:'Delivery can only be recorded for working cases' }, 409, origin);
    if (!isAdminCalendarDate(values.delivered_at) || values.delivered_at > adminTodayJst()) return json({ ok:false, error:'Invalid delivery date' }, 400, origin);
    values.status = 'delivered';
    values.followup_due_at = addAdminCalendarDays(values.delivered_at, 7);
    if (!['sent','replied','closed','cancelled'].includes(values.followup_status || before.followup_status)) values.followup_status = 'scheduled';
    if (!body.next_action || body.next_action === before.next_action) values.next_action = ADMIN_NEXT_ACTION_DEFAULTS.delivered;
  } else if (deliveredChanged && !values.delivered_at && before.status === 'delivered') {
    return json({ ok:false, error:'Delivery date correction requires manual review' }, 409, origin);
  }

  const followupChanged = Object.prototype.hasOwnProperty.call(values,'followup_sent_at') && clean(before.followup_sent_at || '',40) !== values.followup_sent_at;
  if (followupChanged && values.followup_sent_at) {
    if (before.status !== 'delivered' || !before.delivered_at) return json({ ok:false, error:'Follow-up can only be recorded after delivery' }, 409, origin);
    if (!isAdminCalendarDate(values.followup_sent_at) || values.followup_sent_at > adminTodayJst() || values.followup_sent_at < before.delivered_at) return json({ ok:false, error:'Invalid follow-up date' }, 400, origin);
    values.followup_status = 'sent';
    if (!body.next_action || body.next_action === before.next_action) values.next_action = ADMIN_FOLLOWUP_NEXT_ACTION;
  }

  if (values.status === 'working' && before.status !== 'working' && !before.deposit_confirmed_at) {
    return json({ ok:false, error:'Deposit confirmation is required before work starts' }, 409, origin);
  }
  if (values.status === 'delivered' && before.status !== 'delivered' && !deliveredChanged) {
    return json({ ok:false, error:'Record a delivery date to move this case to delivered' }, 409, origin);
  }

  const changedValues = {};
  for (const [key,value] of Object.entries(values)) {
    const beforeValue = before[key] ?? null;
    const normalizedValue = value === '' ? null : value;
    const normalizedBefore = beforeValue === '' ? null : beforeValue;
    if (normalizedValue !== normalizedBefore) changedValues[key] = value;
  }
  const keys = Object.keys(changedValues);
  if (!keys.length) return json({ ok:true, case:before, unchanged:true }, 200, origin);

  const now = new Date().toISOString();
  const actor = admin.email || 'admin';
  const set = keys.map((key,index)=>key+'=?'+(index+2));
  set.push('updated_at=?'+(keys.length+2));
  set.push('updated_by=?'+(keys.length+3));
  const params = [caseNumber].concat(keys.map(key=>changedValues[key]),[now,actor]);
  await db.prepare('UPDATE admin_cases SET ' + set.join(', ') + ' WHERE case_number=?1').bind(...params).run();
  if (changedValues.status && changedValues.status !== before.status) await addAdminCaseEvent(db,caseNumber,'status_changed',before.status,changedValues.status,'',actor);
  const changed = keys.filter(key=>key!=='status').join(', ');
  if (changed) await addAdminCaseEvent(db,caseNumber,'updated','','','更新: '+changed,actor);
  const after = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  return json({ ok:true, case:after, changedFields:keys }, 200, origin);
}

async function confirmAdminCaseDeposit(db, caseNumber, admin, origin) {
  const before = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  if (!before) return json({ ok:false, error:'Case not found' }, 404, origin);
  if (!canAdminEditCase(before, admin)) return json({ ok:false, error:'This case is assigned to another administrator' }, 403, origin);
  if (before.deposit_confirmed_at) return json({ ok:true, case:before, unchanged:true }, 200, origin);
  if (before.status !== 'deposit_wait') return json({ ok:false, error:'Case is not waiting for deposit' }, 409, origin);
  const now = new Date().toISOString();
  const actor = admin.email || 'admin';
  const assignment = autoAdminAssignment(before, admin);
  const updates = {deposit_confirmed_at:now,deposit_confirmed_by:actor,status:'working',next_action:ADMIN_NEXT_ACTION_DEFAULTS.working,...assignment};
  const changed = Object.entries(updates).filter(([key,value]) => (before[key] ?? null) !== (value ?? null));
  const set = changed.map(([key],index)=>key+'=?'+(index+2));
  set.push('updated_at=?'+(changed.length+2));
  set.push('updated_by=?'+(changed.length+3));
  const params=[caseNumber].concat(changed.map(([,value])=>value),[now,actor]);
  await db.prepare('UPDATE admin_cases SET '+set.join(', ')+' WHERE case_number=?1').bind(...params).run();
  if (assignment.assignee_email) await addAdminCaseEvent(db,caseNumber,'assignee_assigned','','','最初の進行操作で '+assignment.assignee+' を担当者に設定',actor);
  await addAdminCaseEvent(db,caseNumber,'deposit_confirmed',before.status,'working','着手金の入金を手動確認し、作業中へ自動移行',actor);
  const after = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  return json({ ok:true, case:after }, 200, origin);
}

async function runAdminCaseAction(request, db, caseNumber, admin, origin) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const action = clean(body.action || '', 80);
  const before = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  if (!before) return json({ ok:false, error:'Case not found' }, 404, origin);
  if (!canAdminEditCase(before, admin)) return json({ ok:false, error:'This case is assigned to another administrator' }, 403, origin);

  const transitions = {
    start_estimate:{from:['received','estimating'],to:'estimating',event:'estimate_started',detail:'見積作成を開始'},
    record_estimate_sent:{from:['estimating','estimate_sent'],to:'estimate_sent',event:'estimate_sent',detail:'見積送付を記録'},
    record_acceptance:{from:['estimate_sent','deposit_wait'],to:'deposit_wait',event:'estimate_accepted',detail:'見積了承を記録'},
    record_delivery:{from:['working','delivered'],to:'delivered',event:'delivered',detail:'納品を記録'},
    record_followup_sent:{from:['delivered'],to:'delivered',event:'followup_sent',detail:'フォロー送信を記録'},
  };
  const spec = transitions[action];
  if (!spec) return json({ ok:false, error:'Unsupported case action' }, 400, origin);
  if (!spec.from.includes(before.status)) return json({ ok:false, error:'Action is not valid for the current status' }, 409, origin);

  if (action === 'record_estimate_sent' && (before.estimate_total === null || before.estimate_total === undefined)) {
    return json({ ok:false, error:'Estimate total is required before recording estimate sending' }, 409, origin);
  }
  if (action === 'record_acceptance' && !(Number(before.deposit_amount) > 0)) {
    return json({ ok:false, error:'Deposit amount is required before recording acceptance' }, 409, origin);
  }

  const actor = admin.email || 'admin';
  const now = new Date().toISOString();
  const assignment = autoAdminAssignment(before, admin);
  const updates = {status:spec.to,next_action:ADMIN_NEXT_ACTION_DEFAULTS[spec.to] || '',...assignment};

  if (action === 'record_delivery') {
    const delivered = clean(body.delivered_at || '', 10) || adminTodayJst();
    if (!isAdminCalendarDate(delivered) || delivered > adminTodayJst()) return json({ ok:false, error:'Invalid delivery date' }, 400, origin);
    updates.delivered_at = delivered;
    updates.followup_due_at = addAdminCalendarDays(delivered,7);
    updates.followup_status = ['sent','replied','closed','cancelled'].includes(before.followup_status) ? before.followup_status : 'scheduled';
  }
  if (action === 'record_followup_sent') {
    if (!before.delivered_at) return json({ ok:false, error:'Delivery must be recorded first' }, 409, origin);
    const sent = clean(body.followup_sent_at || '',10) || adminTodayJst();
    if (!isAdminCalendarDate(sent) || sent > adminTodayJst() || sent < before.delivered_at) return json({ ok:false, error:'Invalid follow-up date' }, 400, origin);
    updates.followup_sent_at = sent;
    updates.followup_status = 'sent';
    updates.next_action = ADMIN_FOLLOWUP_NEXT_ACTION;
  }

  const changed = Object.entries(updates).filter(([key,value]) => (before[key] ?? null) !== (value ?? null));
  if (!changed.length) return json({ ok:true, case:before, unchanged:true }, 200, origin);
  const set = changed.map(([key],index)=>key+'=?'+(index+2));
  set.push('updated_at=?'+(changed.length+2));
  set.push('updated_by=?'+(changed.length+3));
  const params=[caseNumber].concat(changed.map(([,value])=>value),[now,actor]);
  await db.prepare('UPDATE admin_cases SET '+set.join(', ')+' WHERE case_number=?1').bind(...params).run();
  if (assignment.assignee_email) await addAdminCaseEvent(db,caseNumber,'assignee_assigned','','','最初の進行操作で '+assignment.assignee+' を担当者に設定',actor);
  await addAdminCaseEvent(db,caseNumber,spec.event,before.status,updates.status,spec.detail,actor);
  const after=await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  return json({ok:true,case:after,changedFields:changed.map(([key])=>key)},200,origin);
}

async function reassignAdminCase(db, caseNumber, admin, origin) {
  const before = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  if (!before) return json({ ok:false, error:'Case not found' }, 404, origin);
  const actor = normalizeAdminEmail(admin && admin.email);
  if (!actor) return json({ ok:false, error:'Administrator email is required' }, 400, origin);
  const name = clean((admin && admin.name) || actor, 120) || actor;
  if (normalizeAdminEmail(before.assignee_email) === actor && clean(before.assignee || '',120) === name) {
    return json({ ok:true, case:before, unchanged:true, permissions:adminCasePermissions(before, admin) }, 200, origin);
  }
  const now = new Date().toISOString();
  await db.prepare('UPDATE admin_cases SET assignee=?2,assignee_email=?3,updated_at=?4,updated_by=?3 WHERE case_number=?1')
    .bind(caseNumber,name,actor,now).run();
  const from = clean(before.assignee || '',120) || '未割当';
  await addAdminCaseEvent(db,caseNumber,'assignee_changed','','',from+' → '+name,actor);
  const after = await db.prepare('SELECT * FROM admin_cases WHERE case_number=?1 LIMIT 1').bind(caseNumber).first();
  return json({ ok:true, case:after, permissions:adminCasePermissions(after, admin) }, 200, origin);
}

function normalizeAdminEmail(value) {
  return clean(typeof value === 'string' ? value : '',254).toLowerCase();
}
function adminDisplayName(payload, email) {
  const meta = payload && payload.user_metadata && typeof payload.user_metadata === 'object' ? payload.user_metadata : {};
  for (const value of [meta.full_name, meta.name, meta.display_name, payload && payload.name]) {
    const name = clean(typeof value === 'string' ? value : '',120);
    if (name) return name;
  }
  const local = normalizeAdminEmail(email).split('@')[0];
  return clean(local || '管理者',120) || '管理者';
}
function adminCasePermissions(row, admin) {
  const owner = normalizeAdminEmail(row && row.assignee_email);
  const viewer = normalizeAdminEmail(admin && admin.email);
  const legacyAssigned = Boolean(!owner && clean((row && row.assignee) || '',120));
  const isAssignee = Boolean(owner && viewer && owner === viewer);
  return { assigned:Boolean(owner || legacyAssigned), legacyAssigned, isAssignee, canEdit:!owner || isAssignee, canReassign:Boolean(viewer) };
}
function canAdminEditCase(row, admin) {
  return adminCasePermissions(row, admin).canEdit;
}
function autoAdminAssignment(before, admin) {
  if (normalizeAdminEmail(before && before.assignee_email) || clean((before && before.assignee) || '',120)) return {};
  const email = normalizeAdminEmail(admin && admin.email);
  if (!email) return {};
  const name = clean((admin && admin.name) || email,120) || email;
  return {assignee:name,assignee_email:email};
}

function isAdminCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value+'T00:00:00.000Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === value;
}
function addAdminCalendarDays(value, days) {
  if (!isAdminCalendarDate(value)) return '';
  const d = new Date(value+'T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate()+days);
  return d.toISOString().slice(0,10);
}
function adminTodayJst() {
  return new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
}

async function addAdminCaseEvent(db, caseNumber, eventType, fromStatus, toStatus, detail, actor) {
  await db.prepare('INSERT INTO admin_case_events (case_number,event_type,from_status,to_status,detail,actor,created_at) VALUES (?1,?2,?3,?4,?5,?6,?7)').bind(clean(caseNumber,80),clean(eventType,80),clean(fromStatus||'',40),clean(toStatus||'',40),clean(detail||'',4000),clean(actor||'',254),new Date().toISOString()).run();
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === PROD_ORIGIN || origin === 'https://www.denkicontrol.com') return true;
  try {
    const u = new URL(origin);
    return u.protocol === 'https:' && u.hostname.endsWith(ALLOWED_ORIGIN_SUFFIX);
  } catch { return false; }
}

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-GXW-Idempotency-Key, X-GXW-File-Size',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
  };
  if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...corsHeaders(origin) },
  });
}
