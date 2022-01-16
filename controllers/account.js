const Portfolio = require("../models/portfolios");
const Transaction = require("../models/transactions");
const User = require("../models/users");
const Balance = require("../models/balances");
const { READCOMMITTED } = require("sequelize/dist/lib/table-hints");
const { validationResult } = require("express-validator/check");
const Cryptocurrency = require("../models/cryptocurrencies");
const sequalize = require("../utils/database");

exports.getPortfolios = (req, res, next) => {
  Portfolio.findAll()
    .then((portfolios) => res.status(200).json(portfolios))
    .catch(res.status(500));
};

exports.getPortfolio = (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  Portfolio.findByPk(portfolio_id)
    .then((portfolio) => {
      if (portfolio === null) {
        return res.status(404);
      } else {
        return res.status(200).json(portfolio);
      }
    })
    .catch(res.status(500));
};

exports.getPortfoliosByUserId = (req, res, next) => {
  const owner_id = req.params.owner_id;
  Portfolio.findAll({
    where: {
      owner_id: owner_id,
    },
  })
    .then((portfolios) => {
      if (portfolios === null) {
        return res.status(404);
      } else {
        return res.status(200).json(portfolios);
      }
    })
    .catch(res.status(500));
};

exports.createPortfolio = (req, res, next) => {
  const name = req.body.name;
  const owner_id = req.body.owner_id;
  const is_main = req.body.is_main;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    //Check for validation errors from routes folder
    Portfolio.create({
      name: name,
      owner_id: owner_id,
      is_main: is_main,
    }).then((portfolio) =>
      res.status(201).json({
        message: "Portfolio created successfully!",
        portfolio: portfolio,
      })
    );
  } else {
    return res.status(422).json({
      message: "Invalid UUID",
    });
  }

  // if (errors.isEmpty()) {
  //   //Check for validation errors from routes folder
  //   User.findByPk(owner_id) //Check if UUID exists in database
  //     .then((owner) => {
  //       if (owner === null) {
  //         return res.status(422).json({
  //           message: "Invalid UUID", //Should be "UUID not in our DATABASE", but I'm unifying messages"
  //         });
  //       } else {
  //         Portfolio.create({
  //           name: name,
  //           owner_id: owner_id,
  //           is_main: is_main,
  //         }).then((portfolio) =>
  //           res.status(201).json({
  //             message: "Portfolio created successfully!",
  //             portfolio: portfolio,
  //           })
  //         );
  //       }
  //     });
  // } else {
  //   return res.status(422).json({
  //     message: "Invalid UUID",
  //   });
  // }
};

exports.deletePortfolio = (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  Portfolio.destroy({
    where: {
      portfolio_id: portfolio_id,
    },
  })
    .then((deleted_count) => {
      if (deleted_count > 0) {
        return res.status(200).json({
          message: "Portfolio deleted successfully!",
        });
      } else {
        return res.status(404).json({
          message: "There is no such a portfolio",
        });
      }
    })
    .catch(res.status(500));
};

exports.updatePortfolio = (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  const name = req.body.name;
  Portfolio.update(
    {
      name: name,
    },
    {
      where: {
        portfolio_id: portfolio_id,
      },
    }
  )
    .then((count) => {
      if (count > 0) {
        return res.status(200).json({ message: "Portfolio updated" });
      } else {
        return res.status(404).json({ message: "There's no such portfolio" });
      }
    })
    .catch(res.status(500));
};

exports.getBalances = (req, res, next) => {
  Balance.findAll()
    .then((balances) => res.status(200).json(balances))
    .catch(res.status(500));
};

exports.getBalance = (req, res, next) => {
  const balance_id = req.params.balance_id;
  Balance.findByPk(balance_id)
    .then((balance) => {
      if (balance === null) {
        return res.status(404);
      } else {
        return res.status(200).json(balance);
      }
    })
    .catch(res.status(500));
};

exports.getBalancesByPortfolioId = (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  sequalize
    .query(
      `SELECT cryptocurrencies.name, cryptocurrencies.code, balances.amount FROM balances INNER JOIN cryptocurrencies ON balances.cryptocurrency_id = cryptocurrencies.cryptocurrency_id WHERE balances.portfolio_id = '${portfolio_id}'`,
      { type: sequalize.QueryTypes.SELECT }
    )
    .then((balances) => {
      if (balances === null) {
        return res.status(404);
      } else {
        return res.status(200).json(balances);
      }
    })
    .catch(res.status(500));
};

exports.createBalance = (req, res, next) => {
  const amount = req.body.amount;
  const portfolio_id = req.body.portfolio_id;
  const currency_id = req.body.currency_id;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    Portfolio.findByPk(portfolio_id).then((portfolio) => {
      if (portfolio === null) {
        return res.status(422).json({
          message: "Invalid UUID",
        });
      } else {
        Cryptocurrency.findByPk(currency_id).then((currency) => {
          if (currency === null) {
            return res.status(422).json({
              message: "Invalid UUID",
            });
          } else {
            Balance.create({
              amount: amount,
              portfolio_id: portfolio_id,
              cryptocurrency_id: currency_id,
              cost: 0,
            }).then((balance) =>
              res.status(201).json({
                message: "Balance created successfully!",
                balance: balance,
              })
            );
          }
        });
      }
    });
  } else {
    return res.status(422).json({
      message: "Invalid UUID",
    });
  }
};

exports.deleteBalance = (req, res, next) => {
  const balance_id = req.params.balance_id;
  Balance.destroy({
    where: {
      balance_id: balance_id,
    },
  })
    .then((deleted_count) => {
      if (deleted_count > 0) {
        return res.status(200).json({
          message: "balance deleted successfully!",
        });
      } else {
        return res.status(404).json({
          message: "There is no such a balance",
        });
      }
    })
    .catch(res.status(500));
};

exports.updateBalance = (req, res, next) => {
  const balance_id = req.params.balance_id;
  const amount = req.body.amount;
  Balance.update(
    {
      amount: amount,
    },
    {
      where: {
        balance_id: balance_id,
      },
    }
  )
    .then((count) => {
      if (count > 0) {
        return res.status(200).json({ message: "Balance updated" });
      } else {
        return res.status(404).json({ message: "There's no such balance" });
      }
    })
    .catch(res.status(500));
};

exports.getTransactions = (req, res, next) => {
  Transaction.findAll()
    .then((transactions) => res.status(200).json(transactions))
    .catch(res.status(500));
};

exports.getTransaction = (req, res, next) => {
  const transaction_id = req.params.tx_id;
  Transaction.findByPk(transaction_id)
    .then((transaction) => {
      if (transaction === null) {
        return res.status(404);
      } else {
        return res.status(200).json(transaction);
      }
    })
    .catch(res.status(500));
};

exports.createTransaction = (req, res, next) => {
  const rate = req.body.rate;
  const amount = req.body.amount;
  const total_spent = req.body.total_spent;
  const type = req.body.type;
  const base_id = req.body.base_id;
  const quote_id = req.body.quote_id;
  const date = req.body.date;
  const fee = req.body.fee;
  const note = req.body.note;
  const portfolio_id = req.body.portfolio_id;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    Cryptocurrency.findByPk(base_id).then((base) => {
      if (base === null) {
        return res.status(422).json({
          message: "Invalid UUID",
        });
      } else {
      //  Cryptocurrency.findByPk(quote_id).then((quote) => {
      //     if (quote === null) {
      //       return res.status(422).json({
      //         message: "Invalid UUID",
      //       });
      //     } else {
            Portfolio.findByPk(portfolio_id).then((portfolio) => {
              if (portfolio === null) {
                return res.status(422).json({
                  message: "Invalid UUID",
                });
              } else {
                Transaction.create({
                  rate: rate,
                  amount: amount,
                  total_spent: total_spent,
                  type: type,
                  base_id: base_id,
                  quote_id: quote_id,
                  date: date,
                  fee: fee,
                  note: note,
                  portfolio_id: portfolio_id,
                }).then((transaction) =>{
                  if (type = "sell"){
                    amount =  Number(amount) * Number(-1)
                  }
                  Balance.findAll({
                    limit: 1,
                    where: {
                      portfolio_id: transaction.portfolio_id
                    },
                    attributes: ['cost','amount'],
                  }).then(function(entries){
                    Balance.update({
                      amount: Number(entries[0].dataValues.amount)+(Number(transaction.amount)*Number(transaction.rate)),
                      cost: Number(entries[0].dataValues.cost)+(Number(transaction.amount)*Number(transaction.rate))},
                      {where: {
                        portfolio_id: transaction.portfolio_id
                      },
                    })          
                  }); 
                  res.status(201).json({
                    message: "transaction created successfully!",
                    transaction: transaction,                  
                  })
                }
                );
              }
            });
 //         }
 //       });
      }
    });
  } else {
    return res.status(422).json({
      message: "Invalid Validation",
    });
  }
};

exports.updateTransaction = (req, res, next) => {
  const transaction_id = req.params.tx_id;
  const rate = req.body.rate;
  const amount = req.body.amount;
  const total_spent = req.body.total_spent;
  const type = req.body.type;
  const base_id = req.body.base_id;
  const quote_id = req.body.quote_id;
  const date = req.body.date;
  const fee = req.body.fee;
  const note = req.body.note;
  const portfolio_id = req.body.portfolio_id;
  Transaction.findAll({
    limit: 1,
    where: {
      transaction_id: transaction_id
    },
    attributes: ['amount','rate'],
  }).then(function(entries){
    Balance.update({
      cost: Math.abs(
        (Number(entries[0].dataValues.amount)*Number(entries[0].dataValues.rate)) 
        - (Number(rate)*Number(amount)))},
      {where: {
        portfolio_id: portfolio_id        
      },
    })          
  });

  Transaction.update(
    {
      rate: rate,
      amount: amount,
      total_spent: total_spent,
      type: type,
      base_id: base_id,
      quote_id: quote_id,
      date: date,
      fee: fee,
      note: note,
      portfolio_id: portfolio_id,
    },
    {
      where: {
        transaction_id: transaction_id,
      },
    }).then((transaction) => {
      if (transaction > 0) {
        return res.status(200).json({ message: "transaction updated" });
      } else {
        return res.status(404).json({ message: "There's no such transaction" });
      }
    })
    .catch(res.status(500));
};

exports.deleteTransaction = (req, res, next) => {
  const transaction_id = req.params.tx_id;
  Transaction.destroy({
    where: {
      transaction_id: transaction_id,
    },
  })
    .then((deleted_count) => {
      if (deleted_count > 0) {
        return res.status(200).json({
          message: "Transaction deleted successfully!",
        });
      } else {
        return res.status(404).json({
          message: "There is no such transaction",
        });
      }
    })
    .catch(res.status(500));
};
