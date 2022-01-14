const Sequalize = require('sequelize')
const Crypto = require("../models/cryptocurrencies");
const Data = require("../models/historical_data");
const { validationResult } = require('express-validator/check');
const Change = require('../models/price_changes');

exports.getCoins = (req, res, next) => {
  Crypto.findAll()

    .then((coins) => res.status(200).json(coins))
    .catch(res.status(500));
};

exports.getCoininfo = (req, res, next) => {
    const coins = req.body.coins;
    Change.findAll({
      attributes: ['coin_name','pln','market_cap','pln_1h','pln_1d','pln_7d'],
      where: {
        coin_name: coins,
      },
    })
    .then((coins) => res.status(200).json(coins))
    .catch(res.status(500));
};



exports.getHistory = (req, res, next) => {
  const coins = req.body.coins;
  Data.findAll({
    attributes: ['coin_name','timestamp','price'],
    where: {
      coin_name: coins,
    },

  })
    .then((values) => { 
      var dataArray = {}
      var price = {}
      var dataArray2 = []
      price["price"] = []
      price["timestamp"] = []
      
      for (var c = 0; c < coins.length;c++) {
        counter = 0 
      values.forEach((i) => {
        
        dataArray[coins[c]] = dataArray2        
         if (i.coin_name == coins[c]){
           counter = counter + 1      
           if (counter % 4 === 0 && counter % 3 === 0 ) {
           price["price"] = i.price
           price["timestamp"] = i.timestamp
           dataArray2.push(price) 
           console.log(counter)         
          }       
      }
         })
      }
    res.status(200).json(dataArray)
  })
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
  const errors = validationResult(req);
  if (errors.isEmpty()) {
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
  } else {
      res.status(422).json({
      message: "Invalid values, coin not created",
      })
  }
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