// Get the modal container and trigger button
const loginModal = document.getElementById("loginModal");
const openLoginModalBtn = document.getElementById("openLoginModalBtn");
const closeModalBtn = document.getElementsByClassName("close")[0];
const loginBtn = document.getElementById("loginBtn");
const loginusername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loader = document.querySelector(".loader");

var closeButton = document.querySelector("#loginModal .close");

closeButton.addEventListener("click", function () {
  loginModal.style.display = "none";
});

// Event listener to open the modal when the "Login" link is clicked
openLoginModalBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

// Event listener to close the modal when the "Close" button is clicked
closeModalBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Event listener to close the modal when the user clicks outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = "none";
  }
});

loginBtn.addEventListener("click", () => {
  if (!loginusername.value.length || !loginPassword.value.length) {
    showAlert("fill all the inputs");
  } else {
    // Get the signupActionsRecord from local storage
    var signupActionsRecord = JSON.parse(
      localStorage.getItem("signupActionsRecord")
    ) || { signupActions: [] };

    console.log(signupActionsRecord);
    console.log(loginusername.value);
    console.log(loginusername.value, loginPassword.value);
    var user = signupActionsRecord.signupActions.hasOwnProperty(
      loginusername.value
    );
    console.log(user);

    // Get the signupActionsRecord from local storage
    var signupActionsRecord = JSON.parse(
      localStorage.getItem("signupActionsRecord")
    ) || { signupActions: [] };

    console.log(signupActionsRecord);
    console.log(loginusername.value);
    console.log(loginusername.value, loginPassword.value);

    var user = signupActionsRecord.signupActions.find(
      (user) => user.username === loginusername.value
    );

    if (user) {
      if (user.password === loginPassword.value) {
        console.log("Login successful!", "success");
        sampleUserID = user.username;
        console.log("Sample user id" + sampleUserID);

        sampleUserID = user.username;
        document.getElementById("userNameSpan").innerHTML = sampleUserID;

        userNameSpan.textContent = sampleUserID + "!";
        userNameSpan.style.display = "block";
        showAlert("Login successful!", "success");
        loginModal.style.display = "none";
        console.log("Sample user id" + sampleUserID);

        // Store sampleUserID in localStorage
        localStorage.setItem("sampleUserID", sampleUserID);

        console.log("Login successful!", "success");
        sampleUserID = user.username;
        console.log("Sample user id" + sampleUserID);
        logintoLogout.textContent = "Log Out";

        // Store sampleUserID in localStorage
        localStorage.setItem("sampleUserID", sampleUserID);
      } else {
        showAlert("Incorrect password. Please try again.");
        loader.style.display = "none";
      }
    } else {
      showAlert("User not found. Please sign up first.");
      loader.style.display = "none";
    }
  }
});

const showAlert = (msg, type = "error") => {
  let alertBox = document.querySelector(".alert-box");
  let alertMsg = document.querySelector(".alert-msg");
  let alertImg = document.querySelector(".alert-img");

  alertMsg.innerHTML = msg;

  if (type == "success") {
    alertImg.src = `assets/success.png`;
    alertMsg.style.color = `#0ab50a`;
  } else {
    // means it is an err
    alertImg.src = `assets/error.png`;
    alertMsg.style.color = null;
  }

  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 1000);
  return false;
};

function showUserActionsModal(sampleUserID) {
  var userActionsModal = document.createElement("div");
  userActionsModal.classList.add("modal");

  var modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Set a fixed height for the modal content to make it scrollable
  modalContent.style.height = "350px"; // Adjust the height as needed

  // Add CSS styles to enable scrolling for the modal content
  var closeUserActionsModal = document.createElement("span");
  closeUserActionsModal.classList.add("close");
  closeUserActionsModal.textContent = "×";
  modalContent.appendChild(closeUserActionsModal);

  var header = document.createElement("h2");
  header.textContent = "User Actions Record";
  modalContent.appendChild(header);

  var table = document.createElement("table");
  modalContent.style.overflowY = "auto"; // Enable vertical scrolling

  table.classList.add("user-actions-table");

  // Create table header row
  var headerRow = table.insertRow();
  var headerCell1 = headerRow.insertCell();
  var headerCell2 = headerRow.insertCell();
  var headerCell3 = headerRow.insertCell();
  var headerCell4 = headerRow.insertCell();
  var headerCell5 = headerRow.insertCell();
  var headerCell6 = headerRow.insertCell();
  var headerCell7 = headerRow.insertCell();

  headerCell1.textContent = "Action ID";
  headerCell2.textContent = "Method Used";
  headerCell3.textContent = "CSV File Name";
  headerCell4.textContent = "Columns Used";
  headerCell5.textContent = "Results";
  headerCell6.textContent = "Timestamp";
  headerCell7.textContent = "Delete";

  var userActionsRecord = JSON.parse(localStorage.getItem("userActionsRecord"));

  console.log("User Actions Record", userActionsRecord);
  if (userActionsRecord) {
    var userActions = Object.values(userActionsRecord);

    if (userActions.length > 0) {
      userActions.forEach(function (actions) {
        actions.forEach(function (action) {
          if (action.userId === sampleUserID) {
            var row = table.insertRow();
            var cell1 = row.insertCell();
            var cell2 = row.insertCell();
            var cell3 = row.insertCell();
            var cell4 = row.insertCell();
            var cell5 = row.insertCell();
            var cell6 = row.insertCell();
            var cell7 = row.insertCell();

            cell1.textContent = action.actionId;
            cell2.textContent = action.actionType;
            cell3.textContent = action.csvName;
            cell4.textContent = action.columnsUsed;
            cell5.textContent = action.results;
            cell6.textContent = action.timestamp;
            cell7.textContent = deleteButton;

            // Create the delete button
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("data-username", action.actionId); // Store the email in a data attribute for reference when deleting
            cell7.appendChild(deleteButton);

            // Event listener for the delete button
            deleteButton.addEventListener("click", function () {
              var emailToDelete = this.getAttribute("data-username");
              var signupActionsRecordJSON = localStorage.getItem(
                "userActionsRecord"
              );

              if (signupActionsRecordJSON) {
                var signupActionsRecord = JSON.parse(signupActionsRecordJSON);

                var userActions = Object.values(signupActionsRecord);
                var userFound = false;

                userActions.forEach(function (actions) {
                  var indexToDelete = actions.findIndex(
                    (action) => action.actionId === emailToDelete
                  );
                  if (indexToDelete !== -1) {
                    actions.splice(indexToDelete, 1);  
                    userFound = true;
                  }
                }); 333

                if (userFound) {
                  // Save the updated signupActionsRecord back to local storage
                  localStorage.setItem(
                    "userActionsRecord",
                    JSON.stringify(signupActionsRecord)
                  );

                  // Optional: Show a success message
                  showAlert(
                    "Successfully deleted action with ID: " + emailToDelete
                  );

                  console.log(signupActionsRecord);
                } else {
                  // Optional: Show an error message if the user with the specified username was not found
                  showAlert("Action with ID " + emailToDelete + " not found.");
                }
              }
            });
          }
        });
      });
    } else {
      var row = table.insertRow();
      var cell = row.insertCell();
      cell.colSpan = 1;
      cell.textContent = "No user actions found for the specified username.";
    }
  } else {
    var row = table.insertRow();
    var cell = row.insertCell();
    cell.colSpan = 3;
    cell.textContent = "No user actions found.";
  }

  modalContent.appendChild(table);
  userActionsModal.appendChild(modalContent);
  document.body.appendChild(userActionsModal);

  // Display the user actions modal
  userActionsModal.style.display = "block";

  // Event listener to close the modal
  closeUserActionsModal.addEventListener("click", function () {
    userActionsModal.style.display = "none";
  });
}

const openUserActionsModalBtn = document.getElementById(
  "openUserActionsModalBtn"
);

// Event listener to show the user actions modal
openUserActionsModalBtn.addEventListener("click", function () {
  showUserActionsModal(sampleUserID);
});

function showAdminActionsModal() {
  var userActionsModal = document.createElement("div");
  userActionsModal.classList.add("modal");

  var modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Set a fixed height for the modal content to make it scrollable
  modalContent.style.height = "350px"; // Adjust the height as needed

  // Add CSS styles to enable scrolling for the modal content
  var closeUserActionsModal = document.createElement("span");
  closeUserActionsModal.classList.add("close");
  closeUserActionsModal.textContent = "×";
  modalContent.appendChild(closeUserActionsModal);

  var header = document.createElement("h2");
  header.textContent = "User Users Record";
  modalContent.appendChild(header);

  var table = document.createElement("table");
  modalContent.style.overflowY = "auto"; // Enable vertical scrolling

  table.classList.add("user-actions-table");

  // Create table header row
  var headerRow = table.insertRow();
  var headerCell1 = headerRow.insertCell();
  var headerCell2 = headerRow.insertCell();
  var headerCell3 = headerRow.insertCell();
  var headerCell4 = headerRow.insertCell();
  headerCell1.textContent = "Username";
  headerCell2.textContent = "Password";
  headerCell3.textContent = "Number";
  headerCell4.textContent = "Email";

  var signupActionsRecord = JSON.parse(
    localStorage.getItem("signupActionsRecord")
  );

  console.log("All Users: ", signupActionsRecord);
  if (signupActionsRecord) {
    var userActions = Object.values(signupActionsRecord);

    if (userActions.length > 0) {
      userActions.forEach(function (actions) {
        actions.forEach(function (action) {
          var row = table.insertRow();
          var cell1 = row.insertCell();
          var cell2 = row.insertCell();
          var cell3 = row.insertCell();
          var cell4 = row.insertCell();
          var cell5 = row.insertCell(); // New cell for the delete button

          cell1.textContent = action.username;
          cell2.textContent = action.password;
          cell3.textContent = action.number;
          cell4.textContent = action.email;

          // Create the delete button
          var deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.setAttribute("data-username", action.username); // Store the email in a data attribute for reference when deleting
          cell5.appendChild(deleteButton);

          // Event listener for the delete button
          deleteButton.addEventListener("click", function () {
            var emailToDelete = this.getAttribute("data-username");
            var signupActionsRecordJSON = localStorage.getItem(
              "signupActionsRecord"
            );

            if (signupActionsRecordJSON) {
              var signupActionsRecord = JSON.parse(signupActionsRecordJSON);

              var userActions = Object.values(signupActionsRecord);
              var userFound = false;

              userActions.forEach(function (actions) {
                var indexToDelete = actions.findIndex(
                  (action) => action.username === emailToDelete
                );
                if (indexToDelete !== -1) {
                  actions.splice(indexToDelete, 1);
                  userFound = true;
                }
              });

              if (userFound) {
                // Save the updated signupActionsRecord back to local storage
                localStorage.setItem(
                  "signupActionsRecord",
                  JSON.stringify(signupActionsRecord)
                );

                // Optional: Show a success message
                showAlert(
                  "Successfully deleted user with username: " + emailToDelete
                  
                );
                console.log(signupActionsRecord);
              } else {
                // Optional: Show an error message if the user with the specified username was not found
                showAlert(
                  "User with username " + emailToDelete + " not found."
                );
              }
            }});
        });
      });
    } else {
      var row = table.insertRow();
      var cell = row.insertCell();
      cell.colSpan = 3;
      cell.textContent = "No user actions found for the specified username.";
    }
  } else {
    var row = table.insertRow();
    var cell = row.insertCell();
    cell.colSpan = 3;
    cell.textContent = "No user actions found.";
  }

  modalContent.appendChild(table);
  userActionsModal.appendChild(modalContent);
  document.body.appendChild(userActionsModal);

  // Display the user actions modal
  userActionsModal.style.display = "block";

  // Event listener to close the modal
  closeUserActionsModal.addEventListener("click", function () {
    userActionsModal.style.display = "none";
  });
}

const openUserAccountsModalBtn = document.getElementById(
  "openUserAccountsModalBtn"
);

openUserAccountsModalBtn.addEventListener("click", function () {
  // Check if the sampleUserID is "Admin"
  if (sampleUserID === "Admin") {
    showAdminActionsModal();
  } else {
    // Perform a different action or show a message for non-admin users
    showAlert("You do not have permission to access this feature.");
  }
});

function logout() {
  sampleUserID = "User";
  logintoLogout.textContent = "Login";
  userNameSpan.textContent = "Stranger!";
}

const logintoLogout = document.getElementById("openLoginModalBtn");

logintoLogout.addEventListener("click", function (event) {
  if (logintoLogout.textContent === "Login") {
  } else {
    logout();
  }
});
