exports.getCoins = (req, res, next) => {
  res.status(200).json({
    coins: [{ title: "First Post", content: "This is the first post!" }],
  });
};

exports.getCoin = (req, res, next) => {
const title = req.body.title;
  res.status(200).json({
    coins: [{ title: "First Post", content: "This is the first post!" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
