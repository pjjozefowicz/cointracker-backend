const Sequalize = require('sequelize')

const sequalize = require('../utils/database')
const Cryptocurrency = require('./cryptocurrencies')

const Transaction = sequalize.define('transactions', {
    transaction_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    rate: {
        type: Sequalize.DECIMAL(), //User inputs the rate value, we need .1234 numbers
        allowNull: false,
    },
    amount: {
        type: Sequalize.DECIMAL(), //User inputs the amount value, we need .12345678 numbers similar to Revoult
        allowNull: false,
    },
    total_spent: {
        type: Sequalize.DECIMAL(), //User inputs the total_spent value, we need .1234 numbers
        allowNull: false,
    },
    type: {
        type: Sequalize.STRING(8), //buy or sell or exchange, max 8 chars
        allowNull: false,
    },
    base_id: {
        type: Sequalize.UUID, //Used only when exchanging, null allowed
        allowNull: true,
    },
    // quote_id: {
    //     type: Sequalize.UUID, //Used when exchanging, null allowed
    //     allowNull: true,
    //},
    date: {
        type: Sequalize.DATE  , //Timestamp for transaction
        allowNull: true,
    },
    fee: {
        type: Sequalize.DECIMAL(), //User inputs the fee value, we need .1234 numbers
        allowNull: false,
    },
    note: {
        type: Sequalize.STRING(256), //Users note about transaction
        allowNull: false,
    },
    portfolio_id: {
        type: Sequalize.UUID,
        allowNull: true,
    },
})


module.exports = Transaction

// CREATE TABLE IF NOT EXISTS public."Transactions"
// (
//     transaction_id uuid NOT NULL,
//     rate numeric NOT NULL,
//     amount numeric NOT NULL,
//     total_spent numeric NOT NULL,
//     type character varying(16) NOT NULL,
//     base_id uuid NOT NULL,
//     quote_id uuid NOT NULL,
//     data time without time zone NOT NULL,
//     fee numeric,
//     notes character varying(256),
//     portfolio_id uuid NOT NULL,
//     PRIMARY KEY (transaction_id)
// );