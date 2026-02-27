// Code.gs - 一人の参加者につき一行にデータを集約する

function doPost(e) {
  try {
    var jsonString = e.postData ? e.postData.contents : e.parameter.data;
    var data = JSON.parse(jsonString);
    var targetSheetName = "all-survey";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(targetSheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
    }
    
    // ヘッダー定義 (全95列)
    // 1:Pre-TS, 2:Post-TS, 3:Code, 4:Gender, 5:Age, 6:Lang, 7-42:Pre(36), 43-95:Post(53)
    var headers = ["Timestamp (Pre)", "Timestamp (Post)", "Anonymous Code", "Gender", "Age", "Language"];
    for (var i = 1; i <= 36; i++) { headers.push("Pre-Q" + i); }
    for (var i = 1; i <= 53; i++) { headers.push("Post-Q" + i); }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
      sheet.setFrozenRows(1);
    }
    
    var values = sheet.getDataRange().getValues();
    var anonCode = data.anonymous_code;
    var rowIndex = -1;
    
    // 既存の参加者を匿名コード(3列目)で検索
    for (var i = 1; i < values.length; i++) {
      if (values[i][2] == anonCode) {
        rowIndex = i + 1;
        break;
      }
    }
    
    var rowData;
    if (rowIndex !== -1) {
      rowData = values[rowIndex - 1];
      // 配列の長さを95に固定（既存行が短い場合への対応）
      if (rowData.length < 95) {
        var padding = new Array(95 - rowData.length).fill("");
        rowData = rowData.concat(padding);
      }
    } else {
      rowData = new Array(95).fill("");
    }
    
    // 基本情報の更新（常に最新を上書き）
    rowData[2] = anonCode;
    rowData[3] = data.gender || rowData[3];
    rowData[4] = data.age || rowData[4];
    rowData[5] = data.language || rowData[5];
    
    var payload = data.payload || {};
    if (data.page === "pre") {
      rowData[0] = data.timestamp || new Date().toISOString();
      // Pre-Q1 to Pre-Q36 (Index 6 to 41)
      for (var i = 1; i <= 8; i++) { rowData[5 + i] = payload.life_satisfaction ? payload.life_satisfaction["q" + i] : ""; }
      for (var i = 9; i <= 21; i++) { rowData[5 + i] = payload.self_efficacy ? payload.self_efficacy["q" + i] : ""; }
      for (var i = 22; i <= 36; i++) { rowData[5 + i] = payload.post_traumatic_growth ? payload.post_traumatic_growth["q" + i] : ""; }
    } else if (data.page === "post") {
      rowData[1] = data.timestamp || new Date().toISOString();
      // Post-Q1 to Post-Q53 (Index 42 to 94)
      for (var i = 1; i <= 8; i++) { rowData[41 + i] = payload.life_satisfaction ? payload.life_satisfaction["q" + i] : ""; }
      for (var i = 9; i <= 21; i++) { rowData[41 + i] = payload.self_efficacy ? payload.self_efficacy["q" + i] : ""; }
      for (var i = 22; i <= 36; i++) { rowData[41 + i] = payload.post_traumatic_growth ? payload.post_traumatic_growth["q" + i] : ""; }
      for (var i = 37; i <= 52; i++) { rowData[41 + i] = payload.learning_engagement ? payload.learning_engagement["q" + i] : ""; }
      rowData[94] = payload.feedback || "";
    }
    
    // データの保存
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", mode: rowIndex !== -1 ? "update" : "append" }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("GAS is running. 1 Row per Participant mode enabled.").setMimeType(ContentService.MimeType.TEXT);
}