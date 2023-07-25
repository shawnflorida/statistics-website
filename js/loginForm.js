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

        userNameSpan.textContent = sampleUserID;
        userNameSpan.style.display = "block";
        showAlert("Login successful!", "success");

        loginModal.style.display = "none";

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

function assignuse() {
  return sampleUserID;
}
function showUserActionsModal(sampleUserID) {
  var userActionsModal = document.createElement("div");
  userActionsModal.classList.add("modal");

  var modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  var closeUserActionsModal = document.createElement("span");
  closeUserActionsModal.classList.add("close");
  closeUserActionsModal.textContent = "×";
  modalContent.appendChild(closeUserActionsModal);

  var header = document.createElement("h2");
  header.textContent = "User Actions Record";
  modalContent.appendChild(header);

  var table = document.createElement("table");
  table.classList.add("user-actions-table");

  // Create table header row
  var headerRow = table.insertRow();
  var headerCell1 = headerRow.insertCell();
  var headerCell2 = headerRow.insertCell();
  var headerCell3 = headerRow.insertCell();
  var headerCell4 = headerRow.insertCell();
  var headerCell5 = headerRow.insertCell();
  var headerCell6 = headerRow.insertCell();
  headerCell1.textContent = "Action ID";
  headerCell2.textContent = "Method Used";
  headerCell3.textContent = "CSV File Name";
  headerCell4.textContent = "Columns Used";
  headerCell5.textContent = "Results";
  headerCell6.textContent = "Timestamp";


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
            cell1.textContent = action.actionId;
            cell2.textContent = action.actionType;
            cell3.textContent = action.csvName;
            cell4.textContent = action.columnsUsed;
            cell5.textContent = action.results;
            cell6.textContent = action.timestamp;
          }
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
// Event listener to show the user actions modal
openUserActionsModalBtn.addEventListener("click", function () {
  showUserActionsModal(sampleUserID);
});