// redirect to home page if user logged in
window.onload = () => {
  if (sessionStorage.user) {
    user = JSON.parse(sessionStorage.user);
    if (compareToken(user.authToken, user.email)) {
      location.replace("/");
    }
  }
};

const loader = document.querySelector(".loader");

// select inputs
const submitBtn = document.querySelector(".submit-btn");
const username = document.querySelector("#username") || null;
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const number = document.querySelector("#number") || null;
const tac = document.querySelector("#terms-and-cond") || null;
const notification = document.querySelectorAll("#notification") || null;
const loginusername = document.querySelector("#loginUsername");
const loginPassword = document.querySelector("#loginPassword");

submitBtn.addEventListener("click", () => {
  if (username != null) {
    // sign up page
    if (username.value.length < 3) {
      showAlert("username must be 3 letters long");
    } else if (!email.value.length) {
      showAlert("enter your email");
    } else if (password.value.length < 8) {
      showAlert("password should be 8 letters long");
    } else if (!number.value.length) {
      showAlert("enter your phone number");
    } else if (!Number(number.value) || number.value.length < 10) {
      showAlert("invalid number, please enter valid one");
    } else if (!tac.checked) {
      showAlert("you must agree to our terms and conditions");
    } else {
      // submit form
      loader.style.display = "block";
      var signupAction = {
        username: username.value,
        loginusername: username.value,

        email: email.value,
        password: password.value,
        loginPassword: password.value,

        number: number.value,
        notification: notification.checked,
      };

      console.log(signupAction);

      var signupActionsRecord = JSON.parse(
        localStorage.getItem("signupActionsRecord")
      ) || { signupActions: [] };

      signupActionsRecord.signupActions.push(signupAction);
      console.log(signupActionsRecord);

      localStorage.setItem(
        "signupActionsRecord",
        JSON.stringify(signupActionsRecord)
      );

      setTimeout(() => {
        loader.style.display = "none";
        showAlert("Success");

        window.location.href = "index.html";
        
      }, 1000);
    }
  } else {
    // login page
    if (!username.value.length || !password.value.length) {
      showAlert("fill all the inputs");
    } else {
      setTimeout(() => {
        // Get the signupActionsRecord from local storage
        var signupActionsRecord = JSON.parse(
          localStorage.getItem("signupActionsRecord")
        ) || { signupActions: [] };
    
        console.log(signupActionsRecord);
    
        if (signupActionsRecord.hasOwnProperty(username.value)) {
          var user = signupActionsRecord[username.value];
          console.log(user, user.username);
          console.log(password.value, user.password);
    
          if (user.password === password.value) {
            console.log("Login successful!", "success");
            // Set the sampleUserID for later use (assuming email is used as the userID)
            sampleUserID = user.username;
            setTimeout(() => {
              loader.style.display = "none";
              window.location.href = "index.html";
            }, 1000);
          } else {
            showAlert("Incorrect password. Please try again.");
            loader.style.display = "none";
          }
        } else {
          showAlert("User not found. Please sign up first.");
          loader.style.display = "none";
        }
      }, 1000);
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

let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^_${"`"}{|}~`;
const generateToken = (key) => {
  let token = "";
  for (let i = 0; i < key.length; i++) {
    let index = char.indexOf(key[i]) || char.length / 2;
    let randomIndex = Math.floor(Math.random() * index);
    token += char[randomIndex] + char[index - randomIndex];
  }
  return token;
};

const processData = (data) => {
  loader.style.display = null;
  if (data.alert) {
    if (data.type) {
      showAlert(data.alert, "success");
    } else {
      showAlert(data.alert);
    }
  } else if (data.name) {
    // create authToken
    data.authToken = generateToken(data.email);
    sessionStorage.user = JSON.stringify(data);
    location.replace("/");
  } else if (data == true) {
    // seller page
    let user = JSON.parse(sessionStorage.user);
    user.seller = true;
    sessionStorage.user = JSON.stringify(user);
  }
};

const compareToken = (token, key) => {
  let string = "";
  for (let i = 0; i < token.length; i = i + 2) {
    let index1 = char.indexOf(token[i]);
    let index2 = char.indexOf(token[i + 1]);
    string += char[index1 + index2];
  }
  if (string === key) {
    return true;
  }
  return false;
};
