
var sampleUserID = "A4"

// Function to generate a random ID
function generateRandomID() {
  return Math.random().toString(36).substr(2, 5); // Generate a 9-character random string
}

function logUserAction(userId, csvName, actionType, columnsUsed, results) {
  var timestamp = new Date().toISOString();
  console.log(userId)

  var actionId = generateRandomID();

  var userAction = {
    userId: userId,
    actionId: actionId,
    timestamp: timestamp,
    csvName: csvName,
    actionType: actionType,
    columnsUsed: columnsUsed,
    results: results,
  };


  console.log(userAction)

  var userActionsRecord = JSON.parse(
    localStorage.getItem("userActionsRecord")
  ) || { userActions: [] };

  userActionsRecord.userActions.push(userAction);
  console.log(userActionsRecord)

  localStorage.setItem("userActionsRecord", JSON.stringify(userActionsRecord));
}


