const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
let staticPath = path.join(__dirname, "");

app.use(express.static(staticPath));
app.use(express.json());

const users = [];

//assign signup into signup.html
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

//assign signup into signup.html
app.get("/signup", (req, res) => {
  res.sendFile(path.join(staticPath, "signup.html"));
});
app.post("/signup", async (req, res) => {
  let { name, email, password, number, tac, notification } = req.body;

  // form validations
  if (name.length < 3) {
    return res.json({ alert: "name must be 3 letters long" });
  } else if (!email.length) {
    return res.json({ alert: "enter your email" });
  } else if (password.length < 8) {
    return res.json({ alert: "password should be 8 letters long" });
  } else if (!number.length) {
    return res.json({ alert: "enter your phone number" });
  } else if (!Number(number) || number.length < 10) {
    return res.json({ alert: "invalid number, please enter valid one" });
  } else if (!tac) {
    return res.json({ alert: "you must agree to our terms and conditions" });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt); // Fix: hash the password

    const user = {
      name: name,
      email: email,
      password: hashPassword,
      number: number,
      tac: tac,
      notification: notification,
    };
    users.push(user);

    console.log(users); // Print the values received from the signup form

    res.status(201).json({
      name: name,
      email: email,
      password: hashPassword,
      number: number,
      tac: tac,
      notification: notification,
    }); // Send a response with the name and email data
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(staticPath, "login.html"));
});

// app.post("/login", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt();

//     const user = {
//       name: req.body.name,
//       password: hashPassword,
//     };
//     users.push(user);
//     res.status(201).send();
//   } catch {
//     res.status(500).send();
//   }
// });

const portNumber = 5000;

app.listen(5000, () => {
  console.log("Port connected to " + portNumber);
});
