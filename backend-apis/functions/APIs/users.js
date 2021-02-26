const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require("../util/validators");
const { request, response } = require("express");

exports.loginUser = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);
  let token;
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user;
    })
    .then((user) => {
      return response.json({ user });
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(403)
        .json({ general: "wrong credentials, please try again" });
    });
};

exports.signUpUser = (request, response) => {
  const newUser = {
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  };

  let token, userId;
  db.doc(`/users/${newUser.email}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ email: "this username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user;
    })
    .then((idtoken) => {
      token = idtoken;
      const userCredentials = {
        name: newUser.name,
        email: newUser.email,
        gender: "",
        phoneNumber: "",
        homeAddress: "",
        workAddress: "",
        wishlistedRecipes: [],
        cartItems: [],
        orders: [],
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${userId}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email already in use" });
      } else {
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.addUser = (request, response) => {
  db.doc(`/users/${request.body.userId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ email: "this username is already taken" });
      } else {
        const userCredentials = {
          userId: request.body.userId,
          name: request.body.name,
          email: request.body.email,
          gender: "",
          phoneNumber: "",
          homeAddress: "",
          workAddress: "",
          wishlistedRecipes: [],
          cartItems: [],
          orders: [],
          createdAt: new Date().toISOString(),
        };
        return db.doc(`/users/${userCredentials.userId}`).set(userCredentials);
      }
    })
    .then(() => {
      return response.status(201).json("User Created");
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email already in use" });
      } else {
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.getUser = (request, response) => {
  const id = request.params.id;
  let userData = {};
  db.doc(`/users/${id}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return response.json(userData);
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

exports.updateUser = (request, response) => {
  const id = request.params.id;
  let document = db.collection("users").doc(`${id}`);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        message: "Cannot Update the value",
      });
    });
};
