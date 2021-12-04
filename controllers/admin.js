const User = require("../models/users");

exports.getUsers = (req, res, next) => {
  User.findAll().then(users => res.status(200).json(users)).catch(res.status(500))
};

exports.createUser = (req, res, next) => {
  const auth0_id = req.body.auth0_id;
  User.create({
    auth0_id: auth0_id
  }).then(user => res.status(201).json({
    message: "User created successfully!",
    user: user,
  })).catch(res.status(500))
};

exports.deleteUser = (req, res, next) => {
  const auth_id = req.params.auth_id;
  User.destroy({
    where: {
      auth0_id: auth_id
    }
  }).then(deleted_count => {
    if (deleted_count > 0) {
      return res.status(200).json({
        message: "User deleted successfully!",
      })
    } else {
      return res.status(404).json({
        message: "There is no such a user"
      })
    }
    
  }).catch(res.status(500))
};
