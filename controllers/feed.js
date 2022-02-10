const Data = require("../models/historical_data");

exports.getPosts = (req, res, next) => {
    Data.findAll({
        where: {
            coin_name: 'bitcoin'
      }}).then((coins) => res.status(200).json(coins))
        .catch(res.status(500))
};

exports.createPost = (req, res, next) => {
  const title = req.cody.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};
