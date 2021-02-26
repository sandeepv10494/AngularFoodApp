const functions = require("firebase-functions");
var cors = require("cors");
const app = require("express")();

const {
  loginUser,
  signUpUser,
  addUser,
  getUser,
  updateUser,
} = require("./APIs/users");

app.use(cors());

// Users
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/addnew", addUser);
app.get("/user/:id", getUser);
app.put("/user/:id", updateUser);

exports.api = functions.https.onRequest(app);
