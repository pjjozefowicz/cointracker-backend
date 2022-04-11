const Portfolio = require("../models/portfolios");
const Transaction = require("../models/transactions");
const Balance = require("../models/balances");
const { validationResult } = require("express-validator/check");
const Cryptocurrency = require("../models/coins");
const sequalize = require("../utils/database");
const jwt_decode = require('jwt-decode');

function getTokenOwner(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return jwt_decode(req.headers.authorization.split(" ")[1]).sub;
  }
  return null;
}

function getFullBalance(balance_id) {
  return sequalize
    .query(
      `SELECT balances.balance_id, balances.amount AS balance_amount, balances.cost AS balance_cost, coins.coin_id, 
                  coins.code AS coin_code, coins.name AS coin_name, coins.current_price AS coin_current_price, coins.image_url AS coin_image_url, 
                  coins.market_cap AS coin_market_cap, coins.market_cap_rank AS coin_market_cap_rank, coins.price_change_prc_1h AS coin_price_change_prc_1h, 
                  coins.price_change_prc_24h AS coin_price_change_prc_24h, coins.price_change_prc_7d AS coin_price_change_prc_7d, coins.sparkline AS coin_sparkline 
                  FROM balances INNER JOIN coins ON balances.coin_id = coins.coin_id WHERE balances.balance_id = '${balance_id}'`,
      { type: sequalize.QueryTypes.SELECT }
    )
}

//check if balance exist and belongs to the owner of the token
async function is_balance_valid(balance_id, owner_id) {
  const balance = await Balance.findByPk(balance_id)
  if (balance === null) {
    return false
  }
  const portfolio = await Portfolio.findByPk(balance.portfolio_id)
  if (portfolio === null || portfolio.owner_id != owner_id) {
    return false
  }
  return true
}


// exports.getPortfolios = (req, res, next) => {
//   Portfolio.findAll()
//     .then((portfolios) => res.status(200).json(portfolios))
//     .catch(res.status(500));
// };

// exports.getPortfolio = (req, res, next) => {
//   const portfolio_id = req.params.portfolio_id;
//   Portfolio.findByPk(portfolio_id)
//     .then((portfolio) => {
//       if (portfolio === null) {
//         return res.status(404);
//       } else {
//         return res.status(200).json(portfolio);
//       }
//     })
//     .catch(res.status(500));
// };

exports.setPortfolioAsMain = async (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  const owner_id = getTokenOwner(req)
  try {
    const portfolio = await Portfolio.findOne({
      where: {
        portfolio_id: portfolio_id,
        owner_id: owner_id
      }
    })
    if (portfolio === null) {
      return res.status(404).json({
        message: "There is no such a portfolio",
      })
    }
    await Portfolio.update(
      { is_main: false },
      {
        where: {
          is_main: true,
          owner_id: owner_id
        },
      }
    )
    portfolio.set({
      is_main: true,
    })
    await portfolio.save()
    return res.status(200).json(portfolio);
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

// check if user_id in the token fits to the owner_id in params
exports.getPortfoliosByUserId = async (req, res, next) => {
  const owner_id = getTokenOwner(req)
  try {
    const portfolios = Portfolio.findAll({
      where: {
        owner_id: owner_id,
      },
    })
    if (portfolios === null) {
      return res.status(404);
    } else if (portfolios.length == 0) {
      const portfolio = Portfolio.create({
        name: 'Your portfolio',
        owner_id: owner_id,
        is_main: true,
      })
      res.status(200).json([portfolio])
    }
    else {
      return res.status(200).json(portfolios);
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

exports.createPortfolio = async (req, res, next) => {
  const name = req.body.name;
  const owner_id = getTokenOwner(req);
  const errors = validationResult(req);
  try {
    if (errors.isEmpty()) {
      //Check for validation errors from routes folder
      const portfolio = await Portfolio.create({
        name: name,
        owner_id: owner_id
      })
      res.status(201).json({
        message: "Portfolio created successfully!",
        portfolio: portfolio,
      })
    } else {
      return res.status(422).json({
        message: "Invalid data",
      });
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

exports.deletePortfolio = async (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  const owner_id = getTokenOwner(req);
  try {
    const deleted_count = await Portfolio.destroy({
      where: {
        portfolio_id: portfolio_id,
        owner_id: owner_id
      },
    })
    if (deleted_count > 0) {
      return res.status(200).json({
        message: "Portfolio deleted successfully!",
      })
    } else {
      return res.status(404).json({
        message: "There is no such a portfolio",
      })
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

exports.updatePortfolio = async (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  const owner_id = getTokenOwner(req);
  const name = req.body.name;
  try {
    const count = Portfolio.update(
      {
        name: name,
      },
      {
        where: {
          portfolio_id: portfolio_id,
          owner_id: owner_id
        },
      }
    )
    if (count > 0) {
      return res.status(200).json({ message: "Portfolio updated" });
    } else {
      return res.status(404).json({ message: "There's no such portfolio" });
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

// exports.getBalances = async (req, res, next) => {
//   try {
//     const balances = Balance.findAll()
//     res.status(200).json(balances)
//   } catch (e) {
//     console.error(e)
//     return res.status(500).json({ message: "Something went wrong" })
//   }
// };

// exports.getBalance = (req, res, next) => {
//   const balance_id = req.params.balance_id;
//   try {

//   } catch (e) {
//     console.error(e)
//     return res.status(500).json({ message: "Something went wrong" })
//   }
//   Balance.findByPk(balance_id)
//     .then((balance) => {
//       if (balance === null) {
//         return res.status(404);
//       } else {
//         return res.status(200).json(balance);
//       }
//     })
//     .catch(res.status(500));
// };

// check if user_id in the token fits to the owner of this portfolio
exports.getBalancesByPortfolioId = async (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  const owner_id = getTokenOwner(req)
  try {
    // check if user actually has this portfolio
    const portfolio = await Portfolio.findByPk(portfolio_id)
    if (portfolio === null || portfolio.owner_id != owner_id) {
      return res.status(404).json({ message: "There's no such portfolio" });
    } else {
      const balances = await sequalize
        .query(
          `SELECT balances.balance_id, balances.amount AS balance_amount, balances.cost AS balance_cost, coins.coin_id, 
      coins.code AS coin_code, coins.name AS coin_name, coins.current_price AS coin_current_price, coins.image_url AS coin_image_url, 
      coins.market_cap AS coin_market_cap, coins.market_cap_rank AS coin_market_cap_rank, coins.price_change_prc_1h AS coin_price_change_prc_1h, 
      coins.price_change_prc_24h AS coin_price_change_prc_24h, coins.price_change_prc_7d AS coin_price_change_prc_7d, coins.sparkline AS coin_sparkline  
      FROM balances INNER JOIN coins ON balances.coin_id = coins.coin_id WHERE balances.portfolio_id = '${portfolio_id}'`,
          { type: sequalize.QueryTypes.SELECT }
        )
      if (balances === null) {
        return res.status(404);
      } else {
        return res.status(200).json(balances);
      }
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

// check if user_id in the token fits to the owner of this portfolio
exports.createBalance = async (req, res, next) => {
  const portfolio_id = req.body.portfolio_id
  const coin_id = req.body.coin_id
  const errors = validationResult(req)
  const owner_id = getTokenOwner(req)
  try {
    if (errors.isEmpty()) {
      // check if user actually has this portfolio
      const portfolio = await Portfolio.findByPk(portfolio_id)
      if (portfolio === null || portfolio.owner_id != owner_id) {
        return res.status(404).json({ message: "There's no such portfolio" })
      } else {
        const currency = await Cryptocurrency.findByPk(coin_id)
        if (currency === null) {
          return res.status(422).json({
            message: "Invalid currency",
          });
        } else {
          const balance = await Balance.create({
            amount: 0,
            portfolio_id: portfolio_id,
            coin_id: coin_id,
            cost: 0,
          })
          const full_balance = await getFullBalance(balance.balance_id)
          if (full_balance === null) {
            return res.status(404);
          } else {
            full_balance = full_balance[0]
            return res.status(201).json(full_balance);
          }
        }
      }
    } else {
      return res.status(422).json({
        message: "Parameters are not correct",
      });
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

// check if user_id in the token fits to the owner of this balance (portfolio)
exports.deleteBalance = async (req, res, next) => {
  const balance_id = req.params.balance_id
  const owner_id = getTokenOwner(req)
  try {
    const balance = await Balance.findByPk(balance_id)
    if (balance === null) {
      return res.status(404).json({ message: "Balance doesn't exist" })
    }
    const portfolio = await Portfolio.findByPk(balance.portfolio_id)
    if (portfolio === null || portfolio.owner_id != owner_id) {
      return res.status(404).json({ message: "Balance doesn't exist" })
    }
    const full_balance = await getFullBalance(balance_id)
    await balance.destroy()
    // do I need it?
    // await Transaction.destroy({
    //   where: {
    //     balance_id: balance_id,
    //   },
    // })
    return res.status(200).json({
      message: "Balance deleted successfully!",
      balance: full_balance[0]
    });
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// // check if user_id in the token fits to the owner of this balance (portfolio)
// exports.updateBalance = async (req, res, next) => {
//   const balance_id = req.params.balance_id;
//   const amount = req.body.amount;
//   const owner_id = getTokenOwner(req)
//   try {
//     if (!await is_balance_valid(balance_id, owner_id)) {
//       return res.status(404).json({ message: "Balance doesn't exist" })
//     }
//     const count = await Balance.update(
//       {
//         amount: amount,
//       },
//       {
//         where: {
//           balance_id: balance_id,
//         },
//       }
//     )
//     if (count > 0) {
//       return res.status(200).json({ message: "Balance updated" });
//     } else {
//       return res.status(404).json({ message: "There's no such balance" });
//     }
//   } catch (e) {
//     console.error(e)
//     return res.status(500).json({ message: "Something went wrong" })
//   }
// };

// exports.getTransactions = (req, res, next) => {
//   Transaction.findAll()
//     .then((transactions) => res.status(200).json(transactions))
//     .catch(res.status(500));
// };

// exports.getTransaction = (req, res, next) => {
//   const transaction_id = req.params.tx_id;
//   Transaction.findByPk(transaction_id)
//     .then((transaction) => {
//       if (transaction === null) {
//         return res.status(404);
//       } else {
//         return res.status(200).json(transaction);
//       }
//     })
//     .catch(res.status(500));
// };

// exports.getTransactionsByPortfolio = (req, res, next) => {
//   const portfolio_id = req.params.portfolio_id;
//   const crypto_id = req.params.coin_id;
//   Transaction.findAll({
//     where: {
//       portfolio_id: portfolio_id,
//       base_id: crypto_id,
//     },
//   })
//     .then((transactions) => {
//       if (transactions === null) {
//         return res.status(404);
//       } else {
//         return res.status(200).json(transactions);
//       }
//     })
//     .catch(res.status(500));
// };

// check if user_id in the token fits to the owner of this balance (portfolio)
exports.getTransactionsByBalance = async (req, res, next) => {
  const balance_id = req.params.balance_id;
  const owner_id = getTokenOwner(req)
  try {
    if (!await is_balance_valid(balance_id, owner_id)) {
      return res.status(404).json({ message: "Balance doesn't exist" })
    }
    const transactions = await Transaction.findAll({
      where: {
        balance_id: balance_id
      },
    })
    if (transactions === null) {
      return res.status(404);
    } else {
      return res.status(200).json(transactions);
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
};

// check if user_id in the token fits to the owner of this balance (portfolio)
exports.createTransaction = async (req, res, next) => {
  console.log(req.body)
  const rate = req.body.rate;
  const amount = req.body.amount;
  const total_spent = req.body.total_spent;
  const type = req.body.type;
  // const base_id = req.body.base_id;
  // const quote_id = req.body.quote_id;
  const date = req.body.date;
  const fee = req.body.fee;
  const note = req.body.note;
  const balance_id = req.body.balance_id;
  const errors = validationResult(req);
  const owner_id = getTokenOwner(req)
  try {
    const balance = await Balance.findByPk(balance_id)
    if (balance === null) {
      return res.status(400).json({ message: "Balance invalid" })
    }
    const portfolio = await Portfolio.findByPk(balance.portfolio_id)
    if (portfolio === null || portfolio.owner_id != owner_id) {
      return res.status(400).json({ message: "Balance invalid" })
    }
    const tx = await Transaction.create({
      rate: rate,
      amount: amount,
      total_spent: total_spent,
      type: type,
      date: date,
      fee: fee,
      note: note,
      balance_id: balance_id,
    })
    if (tx.type.toLowerCase() == "buy") {
      balance.set({
        amount: Number(balance.amount) + Number(tx.amount),
        cost: Number(balance.cost) + Number(tx.total_spent),
      })
    }
    else {
      balance.set({
        amount: Number(balance.amount) - Number(tx.amount),
        cost: Number(balance.cost) - Number(tx.total_spent),
      })
    }
    await balance.save()
    const full_balance = await getFullBalance(balance.balance_id)
    return res.status(200).json({
      message: "Transaction created successfully!",
      transaction: tx,
      balance: full_balance[0]
    })
  }
  catch (e) {
    console.error(e)
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
};

// check if user_id in the token fits to the owner of this balance (portfolio)
exports.updateTransaction = async (req, res, next) => {
  const transaction_id = req.params.tx_id;
  const rate = req.body.rate;
  const amount = req.body.amount;
  const total_spent = req.body.total_spent;
  const type = req.body.type;
  // const base_id = req.body.base_id;
  // const quote_id = req.body.quote_id;
  const date = req.body.date;
  const fee = req.body.fee;
  const note = req.body.note;
  const balance_id = req.body.balance_id;
  const owner_id = getTokenOwner(req)
  try {
    const tx = await Transaction.findByPk(transaction_id)
    if (tx === null) {
      return res.status(400).json({ message: "Transaction invalid" })
    }
    const balance = await Balance.findByPk(tx.balance_id)
    if (balance === null) {
      return res.status(400).json({ message: "Balance invalid" })
    }
    const portfolio = await Portfolio.findByPk(balance.portfolio_id)
    if (portfolio === null || portfolio.owner_id != owner_id) {
      return res.status(400).json({ message: "Balance invalid" })
    }
    if (tx.type.toLowerCase() === "sell") {
      balance.set({
        amount: Number(balance.amount) + Number(tx.amount),
        cost: Number(balance.cost) + Number(tx.total_spent),
      })
      balance.set({
        amount: Number(balance.amount) - Number(amount),
        cost: Number(balance.cost) - Number(total_spent),
      })
    }
    else {
      balance.set({
        amount: Number(balance.amount) - Number(tx.amount),
        cost: Number(balance.cost) - Number(tx.total_spent),
      })
      balance.set({
        amount: Number(balance.amount) + Number(amount),
        cost: Number(balance.cost) + Number(total_spent),
      })
    }
    await balance.save()
    tx.set({
      rate: rate,
      amount: amount,
      total_spent: total_spent,
      date: date,
      fee: fee,
      note: note
    })
    updatedTx = await tx.save()
    const full_balance = await getFullBalance(balance.balance_id)
    return res.status(200).json({ message: "Transaction updated", transaction: updatedTx, balance: full_balance[0] });
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// check if user_id in the token fits to the owner of this balance (portfolio)
exports.deleteTransaction = async (req, res, next) => {
  const transaction_id = req.params.tx_id;
  const owner_id = getTokenOwner(req)
  try {
    const tx = await Transaction.findByPk(transaction_id)
    if (tx === null) {
      return res.status(400).json({ message: "Transaction invalid" })
    }
    const balance = await Balance.findByPk(tx.balance_id)
    if (balance === null) {
      return res.status(400).json({ message: "Balance invalid" })
    }
    const portfolio = await Portfolio.findByPk(balance.portfolio_id)
    if (portfolio === null || portfolio.owner_id != owner_id) {
      return res.status(400).json({ message: "Balance invalid" })
    }
    if (tx.type.toLowerCase() == "buy") {
      balance.set({
        amount: Number(balance.amount) - Number(tx.amount),
        cost: Number(balance.cost) - Number(tx.total_spent),
      })
    }
    else {
      balance.set({
        amount: Number(balance.amount) + Number(tx.amount),
        cost: Number(balance.cost) + Number(tx.total_spent),
      })
    }
    await balance.save()
    await tx.destroy()
    const full_balance = await getFullBalance(balance.balance_id)
    return res.status(200).json({
      message: "Transaction deleted successfully!",
      transaction: tx,
      balance: full_balance[0]
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Something went wrong" })
  }
}