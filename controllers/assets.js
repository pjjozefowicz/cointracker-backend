const Crypto = require("../models/cryptocurrencies");

exports.getCoins = (req, res, next) => {
  Crypto.findAll()
    .then((coins) => res.status(200).json(coins))
    .catch(res.status(500));
};

exports.getCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  Crypto.findByPk(coin_id)
    .then((coin) => {
      if (coin === null) {
        return res.status(404);
      } else {
        return res.status(200).json(coin);
      }
    })
    .catch(res.status(500));
};

exports.createCoin = (req, res, next) => {
  const name = req.body.name;
  const code = req.body.code;
  const coingecko_id = req.body.coingecko_id;
  Crypto.create({
    name: name,
    code: code,
    coingecko_id: coingecko_id,
  })
    .then((coin) =>
      res.status(201).json({
        message: "Coin created successfully!",
        coin: coin,
      })
    )
    .catch(res.status(500));
};

exports.deleteCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  Crypto.destroy({
    where: {
      cryptocurrency_id: coin_id,
    },
  })
    .then((deleted_count) => {
      if (deleted_count > 0) {
        return res.status(200).json({
          message: "Coin deleted successfully!",
        });
      } else {
        return res.status(404).json({
          message: "There is no such a coin",
        });
      }
    })
    .catch(res.status(500));
};

exports.updateCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  const name = req.body.name;
  const code = req.body.code;
  const coingecko_id = req.body.coingecko_id;
  Crypto.update(
    {
      name: name,
      code: code,
      coingecko_id: coingecko_id,
    },
    {
      where: {
        cryptocurrency_id: coin_id,
      },
    }
  )
    .then((count) => {
      if (count > 0) {
        return res.status(200).json({ message: "Coin updated" });
      } else {
        return res.status(404).json({ message: "There's no such a coin" });
      }
    })
    .catch(res.status(500));
};



