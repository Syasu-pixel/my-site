/**
 * denkicontrol.com 管理画面 -> Google Sheets 見積書生成
 *
 * 有料AI APIは使用しない。Google Apps Script / Drive / Sheets のみを使用する。
 *
 * 初期設定:
 * 1. Script Properties に ESTIMATE_WEBHOOK_SECRET を保存する。
 * 2. Webアプリとして「次のユーザーとして実行: 自分」でデプロイする。
 * 3. アクセス権は外部からCloudflare WorkerがPOSTできる設定にする。
 *
 * テンプレート:
 * https://docs.google.com/spreadsheets/d/1UojO-T7TMuG3peAlvGSUtIux0DNtY8rG1tx2qglOIYM/edit
 */

const TEMPLATE_SPREADSHEET_ID = '1UojO-T7TMuG3peAlvGSUtIux0DNtY8rG1tx2qglOIYM';
const DESTINATION_FOLDER_ID = '1P7EmVyne6t_VmG3pTyWHN1ZGmppGXFAD';
const ESTIMATE_SHEET_NAME = '見積書';
const CASE_PROPERTY_PREFIX = 'estimateSheet:';

function doPost(e) {
  try {
    const body = parseJson_(e && e.postData && e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('ESTIMATE_WEBHOOK_SECRET') || '';
    if (!expected || String(body.secret || '') !== expected) {
      return json_({ok:false,error:'unauthorized'});
    }

    const caseNumber = clean_(body.case_number, 80);
    if (!caseNumber) return json_({ok:false,error:'case_number is required'});

    const props = PropertiesService.getScriptProperties();
    const propertyKey = CASE_PROPERTY_PREFIX + caseNumber;
    let fileId = props.getProperty(propertyKey) || '';
    let created = false;

    if (fileId) {
      try {
        DriveApp.getFileById(fileId).getName();
      } catch (_) {
        fileId = '';
        props.deleteProperty(propertyKey);
      }
    }

    if (!fileId) {
      const template = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
      const folder = DriveApp.getFolderById(DESTINATION_FOLDER_ID);
      const company = clean_(body.company, 120) || clean_(body.customer_name, 120) || '相談案件';
      const today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd');
      const title = sanitizeFileName_('見積書_' + caseNumber + '_' + company + '_' + today);
      const copy = template.makeCopy(title, folder);
      fileId = copy.getId();
      props.setProperty(propertyKey, fileId);
      created = true;
    }

    const ss = SpreadsheetApp.openById(fileId);
    const sheet = ss.getSheetByName(ESTIMATE_SHEET_NAME);
    const settingsSheet = ss.getSheetByName('見積設定');
    if (!sheet) throw new Error('見積書シートが見つかりません');
    if (!settingsSheet) throw new Error('見積設定シートが見つかりません');

    const now = new Date();
    const estimateDate = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd');
    const validUntilDate = new Date(now.getTime());
    validUntilDate.setDate(validUntilDate.getDate() + 30);
    const validUntil = Utilities.formatDate(validUntilDate, 'Asia/Tokyo', 'yyyy/MM/dd');

    const company = clean_(body.company, 120);
    const customerName = clean_(body.customer_name, 120);
    const subject = clean_(body.subject, 300) || 'GX Works2オンライン対応';
    const total = nullableAmount_(body.estimate_total);
    const firstTransaction = body.is_first_transaction === true;
    const transactionType = firstTransaction ? '初回取引' : '2回目以降';

    sheet.getRange('B3').setValue((company || customerName || '') + (company ? ' 御中' : ' 様'));
    sheet.getRange('B4').setValue(customerName ? customerName + ' 様' : '');
    sheet.getRange('F3').setValue(estimateDate);
    sheet.getRange('F4').setValue(caseNumber);
    sheet.getRange('B5').setValue(subject);
    sheet.getRange('B6').setValue(validUntil);

    // 社内用の見積設定は別タブへ分離し、見積書本体の印刷範囲をA:Fだけに保つ。
    settingsSheet.getRange('B2').setValue(transactionType);
    settingsSheet.getRange('C2').setValue(firstTransaction ? '完了案件0件=初回' : '完了案件あり=2回目以降');
    if (!settingsSheet.getRange('B3').getValue()) settingsSheet.getRange('B3').setValue('');

    // PLAN1〜3は総額・着手金・納期・内訳を自動。PLAN2は公開価格帯をA/Bに分ける。
    settingsSheet.getRange('B6').setFormula('=SWITCH(B3,"PLAN-01",22000,"PLAN-02A",44000,"PLAN-02B",66000,"PLAN-03",88000,"PLAN-04",SUM(B11:B16),"")');
    settingsSheet.getRange('B7').setFormula('=IF(B2="初回取引",SWITCH(B3,"PLAN-01",11000,"PLAN-02A",22000,"PLAN-02B",22000,"PLAN-03",44000,"PLAN-04",IF(B4="","",B4),""),0)');
    settingsSheet.getRange('B8').setFormula('=SWITCH(B3,"PLAN-01","3〜5営業日","PLAN-02A","5〜10営業日","PLAN-02B","5〜10営業日","PLAN-03","10〜15営業日","PLAN-04",B5,"")');

    sheet.getRange('F6').setFormula("='見積設定'!B8");
    sheet.getRange('D9').setFormula("='見積設定'!B7");
    sheet.getRange('E16').setFormula('=IF(\'見積設定\'!$B$3="PLAN-04",\'見積設定\'!B11,IF(\'見積設定\'!$B$6="","",ROUND(\'見積設定\'!$B$6*30%,0)))');
    sheet.getRange('E17').setFormula('=IF(\'見積設定\'!$B$3="PLAN-04",\'見積設定\'!B12,IF(\'見積設定\'!$B$6="","",ROUND(\'見積設定\'!$B$6*15%,0)))');
    sheet.getRange('E18').setFormula('=IF(\'見積設定\'!$B$3="PLAN-04",\'見積設定\'!B13,IF(\'見積設定\'!$B$6="","",ROUND(\'見積設定\'!$B$6*35%,0)))');
    sheet.getRange('E19').setFormula('=IF(\'見積設定\'!$B$3="PLAN-04",\'見積設定\'!B14,IF(\'見積設定\'!$B$6="","",ROUND(\'見積設定\'!$B$6*10%,0)))');
    sheet.getRange('E20').setFormula('=IF(\'見積設定\'!$B$3="PLAN-04",\'見積設定\'!B15,IF(\'見積設定\'!$B$6="","",ROUND(\'見積設定\'!$B$6*10%,0)))');
    sheet.getRange('E21').setFormula('=IF(\'見積設定\'!$B$3="PLAN-04",\'見積設定\'!B16,"")');

    sheet.getRange('B12').setFormula('=IF(COUNT(F16:F21)=0,"",SUM(F16:F21))');
    sheet.getRange('D12').setFormula('=IF(D9="","",D9)');
    sheet.getRange('F12').setFormula('=IF(OR(B12="",D12=""),"",B12-D12)');

    sheet.getRange('B12:F12').setNumberFormat('¥#,##0');
    sheet.getRange('D9').setNumberFormat('¥#,##0');
    sheet.getRange('E16:F21').setNumberFormat('¥#,##0');
    settingsSheet.getRange('B4').setNumberFormat('¥#,##0');
    settingsSheet.getRange('B6:B7').setNumberFormat('¥#,##0');
    settingsSheet.getRange('B11:B16').setNumberFormat('¥#,##0');

    SpreadsheetApp.flush();

    return json_({
      ok:true,
      created,
      caseNumber,
      spreadsheetId:fileId,
      url:ss.getUrl(),
      title:DriveApp.getFileById(fileId).getName(),
      transactionType,
      firstTransaction,
      completedCustomerCases:Number(body.completed_customer_cases || 0) || 0
    });
  } catch (error) {
    console.error(error);
    return json_({ok:false,error:String(error && error.message || error || 'unknown error')});
  }
}

function parseJson_(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

function clean_(value, max) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\u0000/g, '').trim().slice(0, max);
}

function nullableAmount_(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 0 || n > 999999999) return null;
  return n;
}

function sanitizeFileName_(value) {
  return clean_(value, 180).replace(/[\\/:*?"<>|]/g, '_');
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
