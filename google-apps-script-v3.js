function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'getAll') {
      return handleGetAll();
    } else if (action === 'delete') {
      return handleDelete(e.parameter.id);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // Parse JSON từ body để fix CORS
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    const action = data.action;
    
    if (action === 'add') {
      return handleAdd(data);
    } else if (action === 'getAll') {
      return handleGetAll();
    } else if (action === 'delete') {
      return handleDelete(data.id);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleAdd(params) {
  const sheet = SpreadsheetApp.openById('1wjmlenw_S2DDnma2STo-bVWY-JWGIKdEOvsk33dGIis').getActiveSheet();
  
  const newId = Utilities.getUuid();
  const row = [
    newId,
    params.a,
    params.b, 
    params.c,
    params.x1,
    params.x2,
    params.solutionType,
    params.solvedAt,
    params.note || ''
  ];
  
  sheet.appendRow(row);
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, id: newId}))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetAll() {
  const sheet = SpreadsheetApp.openById('1wjmlenw_S2DDnma2STo-bVWY-JWGIKdEOvsk33dGIis').getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: []}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const headers = data[0];
  const records = data.slice(1).map(row => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, data: records}))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleDelete(id) {
  const sheet = SpreadsheetApp.openById('1wjmlenw_S2DDnma2STo-bVWY-JWGIKdEOvsk33dGIis').getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

