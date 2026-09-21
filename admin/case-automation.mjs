/**
 * Case workflow planning only. This module never sends mail or accesses a bank.
 * Callers must authenticate, persist atomically and validate event evidence.
 * Monetary values are tax-inclusive whole yen; no tax or deposit rate is guessed.
 */
export const CASE_STATUS_NAMES = Object.freeze({
  received: '受付済み', estimating: '見積作成中', estimate_sent: '見積提出済み',
  deposit_wait: '着手金待ち', working: '作業中', delivered: '納品済み',
  completed: '完了', on_hold: '保留', cancelled: 'キャンセル',
});
export const NEXT_ACTION_DEFAULTS = Object.freeze({
  received: '相談内容と必要資料を確認する',
  estimating: '作業範囲・金額・納期を確認して見積を作成する',
  estimate_sent: '見積内容への回答を確認する',
  deposit_wait: '銀行で着手金の入金を確認する',
  working: '合意した作業範囲に沿って作業を進める',
  delivered: 'フォロー予定日に納品後の状況を確認する',
  completed: '', on_hold: '保留理由と再開条件を確認する', cancelled: '',
});
const FOLLOWUP_NEXT = 'フォローへの返信・追加要望を確認する';
const ACTIVE = new Set(['received', 'estimating', 'estimate_sent', 'deposit_wait', 'working', 'delivered']);
const FOLLOWUP_STATES = new Set(['not_scheduled', 'scheduled', 'sent', 'replied', 'closed', 'cancelled']);
const FIELDS = Object.freeze({
  assignee: 120, due_date: 10, next_action: 1000, delivered_at: 10,
  followup_sent_at: 10, followup_result: 4000, customer_requests: 4000,
  handoff_note: 8000,
});
const MONEY = ['estimate_total', 'deposit_amount', 'balance_amount'];
const DATES = ['due_date', 'delivered_at', 'followup_sent_at'];
const EVENTS = new Set(['save', 'received', 'start_estimate', 'record_estimate_sent',
  'record_acceptance', 'after_deposit_confirmation', 'record_delivery', 'record_followup_sent']);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const text = v => v == null ? '' : String(v).trim();

export class CaseAutomationError extends Error {
  constructor(code, message) { super(message); this.name = 'CaseAutomationError'; this.code = code; }
}
function fail(code, message) { throw new CaseAutomationError(code, message); }
function record(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function money(value, key) {
  if (value === '' || value === null || value === undefined) return null;
  if (!(typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value.trim())))) {
    fail('INVALID_AMOUNT', key + 'は0以上の整数（円）で入力してください。');
  }
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 0 || n > 999999999) fail('INVALID_AMOUNT', '金額が入力範囲外です。');
  return n;
}
export function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function addCalendarDays(value, days) {
  if (!isCalendarDate(value) || !Number.isSafeInteger(days)) fail('INVALID_DATE', '日付を確認してください。');
  const d = new Date(value + 'T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + days);
  const result = d.toISOString().slice(0, 10);
  if (!isCalendarDate(result)) fail('INVALID_DATE', '日付が入力範囲外です。');
  return result;
}
export function tokyoDate(instant = new Date()) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(instant);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

/**
 * Return a patch containing only real value changes, plus an automation summary.
 * Evidence flags represent facts verified by the caller, not proof by themselves.
 * Repeated calls do not advance further or invent a new delivery/sending date.
 */
export function planCaseAutomation(before, input = {}, options = {}) {
  if (!record(before) || !record(input) || !record(options)) fail('INVALID_INPUT', '案件データを確認してください。');
  if (!own(CASE_STATUS_NAMES, before.status)) fail('INVALID_STATUS', '現在の状態を確認してください。');
  const event = options.event || 'save';
  if (!EVENTS.has(event)) fail('INVALID_EVENT', 'この進行操作には対応していません。');
  const today = options.today || tokyoDate();
  if (!isCalendarDate(today)) fail('INVALID_DATE', '基準日を確認してください。');
  const evidence = record(options.evidence) ? options.evidence : {};
  const after = { ...before };
  const automatic = new Set();
  const allowedFields = new Set([...Object.keys(FIELDS), ...MONEY, 'status', 'followup_status']);
  for (const key of Object.keys(input)) {
    if (!allowedFields.has(key)) fail('UNKNOWN_FIELD', '更新できない項目が含まれています: ' + key);
  }
  for (const [key, limit] of Object.entries(FIELDS)) {
    if (!own(input, key)) continue;
    if (input[key] !== null && typeof input[key] !== 'string') fail('INVALID_TEXT', key + 'の入力形式を確認してください。');
    const value = text(input[key]);
    if (value.length > limit || value.includes('\0')) fail('INVALID_TEXT', key + 'が長すぎるか無効です。');
    after[key] = value;
  }
  if (own(input, 'status')) {
    if (!own(CASE_STATUS_NAMES, input.status)) fail('INVALID_STATUS', '状態を確認してください。');
    after.status = input.status;
  }
  if (own(input, 'followup_status')) {
    if (!FOLLOWUP_STATES.has(input.followup_status)) fail('INVALID_FOLLOWUP', 'フォロー状態を確認してください。');
    after.followup_status = input.followup_status;
  }
  for (const key of MONEY) if (own(input, key)) after[key] = money(input[key], key);
  for (const key of DATES) {
    if (own(input, key) && after[key] && !isCalendarDate(after[key])) fail('INVALID_DATE', key + 'の日付を確認してください。');
  }
  const setAuto = (key, value) => { if (after[key] !== value) automatic.add(key); after[key] = value; };
  const transition = (from, to) => {
    if (![...from, to].includes(before.status)) fail('INVALID_TRANSITION', '現在の状態ではこの操作はできません。');
    if (own(input, 'status') && input.status !== before.status && input.status !== to) fail('CONFLICTING_STATUS', '進行操作と手入力の状態が一致しません。');
    setAuto('status', to);
  };
  const requireEvidence = (key, message) => { if (evidence[key] !== true) fail('EVIDENCE_REQUIRED', message); };
  const dateOf = key => {
    const value = text(after[key]) || today;
    if (!isCalendarDate(value) || value > today) fail('INVALID_EVENT_DATE', '実施日は本日以前の有効な日付を入力してください。');
    return value;
  };

  if (event !== 'save' && !ACTIVE.has(before.status)) fail('INACTIVE_CASE', '保留・完了・取消の案件は自動で進めません。');
  if (event === 'received' && before.status !== 'received') fail('INVALID_TRANSITION', '受付状態の案件のみ対象です。');
  if (event === 'start_estimate') transition(['received'], 'estimating');
  if (event === 'record_estimate_sent') {
    requireEvidence('estimateSent', '見積を実際に送付したことを確認してください。');
    if (money(after.estimate_total, 'estimate_total') === null) fail('ESTIMATE_REQUIRED', '見積金額を先に入力してください。');
    transition(['estimating'], 'estimate_sent');
  }
  if (event === 'record_acceptance') {
    requireEvidence('estimateAccepted', 'お客様の見積了承を確認してください。');
    if (!(money(after.deposit_amount, 'deposit_amount') > 0)) fail('DEPOSIT_REQUIRED', '合意済みの着手金額を入力してください。');
    transition(['estimate_sent'], 'deposit_wait');
  }
  if (event === 'after_deposit_confirmation') {
    // Never infer bank receipt from an amount, a date field or elapsed time.
    if (!before.deposit_confirmed_at || !Number.isFinite(Date.parse(before.deposit_confirmed_at))) {
      fail('BANK_CONFIRMATION_REQUIRED', '銀行で確認し、入金確認を記録してから進めてください。');
    }
    transition(['deposit_wait'], 'working');
  }
  const deliveryChanged = own(input, 'delivered_at') && text(after.delivered_at) !== text(before.delivered_at);
  const deliveryEvent = event === 'record_delivery' || (event === 'save' && deliveryChanged && !!after.delivered_at);
  if (deliveryEvent) {
    if (event === 'record_delivery') requireEvidence('delivered', '実際に納品したことを確認してください。');
    transition(['working'], 'delivered');
    setAuto('delivered_at', dateOf('delivered_at'));
    setAuto('followup_due_at', addCalendarDays(after.delivered_at, 7));
    const followState = after.followup_status || 'not_scheduled';
    if (['not_scheduled', 'scheduled'].includes(followState)) setAuto('followup_status', 'scheduled');
  }
  if (deliveryChanged && !after.delivered_at && before.status === 'delivered') {
    fail('DELIVERY_CORRECTION_REQUIRED', '納品日を消す場合は、状態も含めた例外修正として確認してください。');
  }
  const followupDateChanged = own(input, 'followup_sent_at') && text(after.followup_sent_at) !== text(before.followup_sent_at);
  if (event === 'record_followup_sent' || (event === 'save' && followupDateChanged && !!after.followup_sent_at)) {
    if (event === 'record_followup_sent') requireEvidence('followupSent', 'フォローメールを実際に送信したことを確認してください。');
    if (after.status !== 'delivered' || !after.delivered_at) fail('NOT_DELIVERED', '納品済みの案件のみフォロー送信を記録できます。');
    if (['closed', 'cancelled', 'replied'].includes(after.followup_status)) fail('FOLLOWUP_ADVANCED', 'このフォロー状態は自動で送信済みに戻しません。');
    setAuto('followup_sent_at', dateOf('followup_sent_at'));
    if (after.followup_sent_at < after.delivered_at) fail('INVALID_EVENT_DATE', 'フォロー送信日は納品日以降にしてください。');
    setAuto('followup_status', 'sent');
  }
  // Selecting a state must not invent a sent email or a customer agreement.
  if (event === 'save' && after.status !== before.status) {
    if (after.status === 'estimate_sent') fail('EVIDENCE_REQUIRED', '見積送付の記録操作を使ってください。');
    if (after.status === 'deposit_wait') fail('EVIDENCE_REQUIRED', '見積了承の記録操作を使ってください。');
    if (after.status === 'delivered' && !deliveryEvent) fail('DELIVERY_REQUIRED', '実際の納品日を入力してください。');
  }
  if (own(input, 'followup_status') && input.followup_status === 'sent' && before.followup_status !== 'sent' && !after.followup_sent_at) {
    fail('FOLLOWUP_DATE_REQUIRED', '実際のフォロー送信日を入力してください。');
  }
  // A date alone must not silently close a case or reopen a stopped case.
  if (after.status === 'completed' && before.status !== 'completed') fail('COMPLETION_REVIEW_REQUIRED', '完了は残対応を確認したうえで別途確定してください。');
  if (after.status === 'working' && before.status !== 'working' && !before.deposit_confirmed_at) fail('BANK_CONFIRMATION_REQUIRED', '着手金の入金確認が必要です。');
  if (event === 'save' && after.status !== before.status && ['completed', 'cancelled', 'on_hold'].includes(before.status)) {
    fail('EXCEPTION_REVIEW_REQUIRED', '保留・完了・取消からの再開は例外修正として確認してください。');
  }

  const moneyChanged = MONEY.some(key => own(input, key) && money(input[key], key) !== money(before[key], key));
  if (moneyChanged || ['record_estimate_sent', 'record_acceptance'].includes(event)) {
    const total = money(after.estimate_total, 'estimate_total'), deposit = money(after.deposit_amount, 'deposit_amount');
    if (total !== null && deposit !== null) {
      if (deposit > total) fail('DEPOSIT_EXCEEDS_TOTAL', '着手金が見積総額を超えています。');
      const balance = total - deposit;
      if (own(input, 'balance_amount') && money(input.balance_amount, 'balance_amount') !== money(before.balance_amount, 'balance_amount') && money(input.balance_amount, 'balance_amount') !== null && money(input.balance_amount, 'balance_amount') !== balance) {
        fail('BALANCE_MISMATCH', '残金は見積総額から着手金を引いた金額にしてください。');
      }
      setAuto('balance_amount', balance);
    }
  }
  const advances = after.status !== before.status || !['save', 'received'].includes(event);
  const assigneeEdited = own(input, 'assignee') && text(input.assignee) !== text(before.assignee);
  if (advances && !text(after.assignee) && !assigneeEdited && text(options.actorName)) {
    setAuto('assignee', text(options.actorName).slice(0, 120));
  }
  const nextEdited = own(input, 'next_action') && text(input.next_action) !== text(before.next_action);
  const defaults = new Set([...Object.values(NEXT_ACTION_DEFAULTS), FOLLOWUP_NEXT]);
  if (!nextEdited && (!text(before.next_action) || defaults.has(text(before.next_action)))) {
    const next = after.status === 'delivered' && after.followup_status === 'sent' ? FOLLOWUP_NEXT : NEXT_ACTION_DEFAULTS[after.status];
    if (ACTIVE.has(after.status) && (advances || event === 'received' || deliveryEvent || followupDateChanged)) setAuto('next_action', next);
  }
  const equivalent = (key, a, b) => MONEY.includes(key) ? money(a, key) === money(b, key) : text(a) === text(b);
  const patch = {};
  for (const key of [...Object.keys(FIELDS), ...MONEY, 'status', 'followup_status', 'followup_due_at']) {
    if (own(after, key) && !equivalent(key, after[key], before[key])) patch[key] = after[key];
  }
  return Object.freeze({ patch: Object.freeze(patch), automaticFields: Object.freeze([...automatic].filter(key => own(patch, key))) });
}
