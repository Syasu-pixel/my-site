const ALLOWED_ORIGIN_SUFFIX = '.denkicontrol-preview.pages.dev';
const PROD_ORIGIN = 'https://denkicontrol.com';

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
      if (!isAllowedOrigin(origin)) {
        return json({ ok: false, error: 'Origin not allowed' }, 403, origin);
      }
      return createConsultation(request, env, origin);
    }

    return json({ ok: false, error: 'Not found' }, 404, origin);
  },
};

async function createConsultation(request, env, origin) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL) {
    return json({ ok: false, error: 'Server configuration is incomplete' }, 500, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400, origin);
  }

  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 254),
    company: clean(body.company, 160),
    plc: clean(body.plc, 120),
    problem: clean(body.problem, 5000),
    desired: clean(body.desired, 5000),
    photo: clean(body.photo, 40),
    gxdata: clean(body.gxdata, 40),
    zipName: clean(body.zipName, 255),
    zipSize: Number.isFinite(Number(body.zipSize)) ? Number(body.zipSize) : 0,
  };

  if (!data.name || !isValidEmail(data.email) || !data.problem || !data.desired) {
    return json({ ok: false, error: 'Required fields are missing or invalid' }, 400, origin);
  }

  const caseNumber = createCaseNumber();
  const acceptedAt = new Date().toISOString();
  const sizeLabel = formatBytes(data.zipSize);

  const adminSubject = `[${caseNumber}] GX Works2 新規相談受付`;
  const adminText = [
    'GX Works2 オンライン相談を受け付けました。',
    '',
    `相談番号: ${caseNumber}`,
    `受付日時: ${acceptedAt}`,
    `お名前: ${data.name}`,
    `会社名: ${data.company || '未入力'}`,
    `返信先: ${data.email}`,
    `PLC型式: ${data.plc || '未入力'}`,
    `設備写真: ${data.photo || '未入力'}`,
    `GX Works2データ: ${data.gxdata || '未入力'}`,
    `ZIPファイル名: ${data.zipName || '未接続'}`,
    `ZIP容量: ${sizeLabel}`,
    '',
    '現在困っていること:',
    data.problem,
    '',
    'どのように変更したいか:',
    data.desired,
    '',
    '※ 現在のPreview段階ではZIP本体の保存・添付はまだ接続していません。',
  ].join('\n');

  const customerSubject = `[${caseNumber}] GX Works2 オンライン相談を受け付けました`;
  const customerText = [
    `${data.name} 様`,
    '',
    'GX Works2 オンライン相談を受け付けました。',
    `相談番号: ${caseNumber}`,
    '',
    '続けて、画面に表示された相談番号を使ってZIPパスワードを別送してください。',
    '内容を確認後、返信用メールアドレスへご連絡します。',
    '',
    '電気と制御の実務メモ',
  ].join('\n');

  const adminResult = await sendEmail(env, {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [env.NOTIFY_TO_EMAIL],
    subject: adminSubject,
    text: adminText,
    reply_to: data.email,
  });

  if (!adminResult.ok) {
    console.error('Admin notification failed', adminResult.body);
    return json({ ok: false, error: 'Notification email failed', details: adminResult.body }, 502, origin);
  }

  const customerResult = await sendEmail(env, {
    from: 'GX Works2 オンライン相談 <support@denkicontrol.com>',
    to: [data.email],
    subject: customerSubject,
    text: customerText,
  });

  if (!customerResult.ok) {
    console.error('Customer confirmation failed', customerResult.body);
    return json({ ok: false, error: 'Customer confirmation email failed', details: customerResult.body }, 502, origin);
  }

  return json({
    ok: true,
    caseNumber,
    acceptedAt,
    zipHandling: data.zipSize > 0 && data.zipSize < 20 * 1024 * 1024 ? 'email-attachment-planned' : 'private-storage-planned',
    note: 'Preview phase: ZIP bytes are not uploaded yet.',
  }, 201, origin);
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

  if (!result.ok) {
    return json({ ok: false, error: 'Email sending failed', details: result.body }, result.status, origin);
  }

  return json({ ok: true, message: 'Test email sent', id: result.body.id }, 200, origin);
}

async function sendEmail(env, payload) {
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
  try {
    body = await response.json();
  } catch {
    body = { message: 'Non-JSON response from email provider' };
  }
  return { ok: response.ok, status: response.status, body };
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
