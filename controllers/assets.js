const Sequalize = require("sequelize");
const Coin = require("../models/coins");
const { validationResult } = require("express-validator/check");
const Balance = require("../models/balances");
const sequalize = require("../utils/database");

exports.getDashboardData = (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  sequalize
    .query(
      `SELECT balances.Coincurrency_id, cr.name, cr.code, balances.amount, balances.cost, ch.rate, ch.market_cap, ch.pln_1h_change, ch.pln_1d_change, ch.pln_7d_change, ch.image_url
      FROM balances 
      INNER JOIN Coincurrencies AS cr
      ON balances.Coincurrency_id = cr.Coincurrency_id
      INNER JOIN changes AS ch
      ON balances.Coincurrency_id = ch.coin_name
      WHERE balances.portfolio_id = '${portfolio_id}'`,
      { type: sequalize.QueryTypes.SELECT }
    )
    .then((data) => {
      if (data === null) {
        return res.status(404);
      } else {
        return res.status(200).json(data);
      }
    })
    .catch(res.status(500));
};

exports.getCoins = (req, res, next) => {
  Coin.findAll()
    .then((coins) => {
      if (coins === null) {
        return res.status(500).send("No coins");
      } else {
        return res.status(200).json(coins);
      }
    })
    .catch(res.status(500));
};

exports.getCoinsShort = (req, res, next) => {
  Coin.findAll({attributes: ['coin_id', 'name', 'code', 'image_url']})
    .then((coins) => {
      if (coins === null) {
        return res.status(500).send("No coins");
      } else {
        return res.status(200).json(coins);
      }
    })
    .catch(res.status(500));
};

exports.getCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  Coin.findByPk(coin_id)
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
  const Coincurrency_id = req.body.coingecko_id;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    Coin.create({
      name: name,
      code: code,
      Coinccurency_id: coingecko_id,
    })
      .then((coin) =>
        res.status(201).json({
          message: "Coin created successfully!",
          coin: coin,
        })
      )
      .catch(res.status(500));
  } else {
    res.status(422).json({
      message: "Invalid values, coin not created",
    });
  }
};

exports.deleteCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  Coin.destroy({
    where: {
      Coincurrency_id: coin_id,
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
  const Coincurrency_id = req.body.coingecko_id;
  Coin.update(
    {
      name: name,
      code: code,
      Coincurrency_id: coingecko_id,
    },
    {
      where: {
        Coincurrency_id: coin_id,
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
