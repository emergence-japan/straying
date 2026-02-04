// Code.gs - ページごとにシートを振り分けて保存

/**
 * WebアプリからのPOSTリクエストを処理します
 */
function doPost(e) {
  try {
    // データの取得（JSON形式を想定）
    var jsonString = e.postData ? e.postData.contents : e.parameter.data;
    var data = JSON.parse(jsonString);
    
    // 書き込み先のシート名を決定
    var targetSheetName = "sheet1"; // デフォルト
    if (data.page === "pre") {
      targetSheetName = "pre-survey";
    } else if (data.page === "post") {
      targetSheetName = "post-survey";
    }
    
    // 書き込み先のシートを取得
    // スプレッドシートに紐付いたスクリプトとして実行されることを想定しています
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(targetSheetName);
    
    // シートが存在しない場合は、エラーを返します
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error", 
        message: "Sheet '" + targetSheetName + "' not found. Please create a sheet named '" + targetSheetName + "'."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // データの展開
    var timestamp = data.timestamp || new Date().toISOString();
    var anonymous_code = data.anonymous_code || "";
    var gender = data.gender || "";
    var age = data.age || "";
    var language = data.language || "";
    var page = data.page || "";
    var payload = JSON.stringify(data.payload || {}); // 詳細データはJSON文字列として保存
    
    // シートに1行追加
    sheet.appendRow([
      timestamp,
      anonymous_code,
      gender,
      age,
      language,
      page,
      payload
    ]);
    
    // 成功レスポンスを返す
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      received: {
        anonymous_code: anonymous_code,
        page: page,
        targetSheet: targetSheetName
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // エラーレスポンス
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 疎通確認用のGETリクエスト処理
 */
function doGet(e) {
  return ContentService.createTextOutput("GAS is running. Ready to receive data for pre-survey and post-survey sheets.")
    .setMimeType(ContentService.MimeType.TEXT);
}