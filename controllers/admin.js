const User = require("../models/users");

exports.getUsers = (req, res, next) => {
  User.findAll().then(users => console.log(users)).catch()
};

exports.getUser = (req, res, next) => {
  const user_id = req.body.user_id;
  res.status(200).json({
    user: {},
  });
};

exports.createUser = (req, res, next) => {
  const auth0_id = req.body.auth0_id;
  res.status(201).json({
    message: "User created successfully!",
    post: { user_id: id, auth0_id: auth0_id },
  });
};

exports.deleteUser = (req, res, next) => {
  const user_id = req.body.user_id;
  res.status(200).json({
    message: "User deleted successfully!",
    user: { user_id: id, auth0_id: auth0_id },
  });
};

exports.updateUser = (req, res, next) => {
  const auth0_id = req.body.auth0_id;
  res.status(200).json({
    message: "User auth0_id changed successfully!",
    user: { user_id: id, auth0_id: auth0_id },
  });
};
