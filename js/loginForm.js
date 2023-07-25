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
