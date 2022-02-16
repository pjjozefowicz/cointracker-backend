const Sequalize = require('sequelize')
const sequalize = require('../utils/database')

const Transaction = sequalize.define('transactions', {
    transaction_id: {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
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
        type: Sequalize.STRING(4), //buy or sell or exchange, max 8 chars
        allowNull: false,
    },
    base_id: {
        type: Sequalize.STRING(32), //Used only when exchanging, null allowed
        allowNull: true,
    },
    quote_id: {
        type: Sequalize.STRING(32), //Used when exchanging, null allowed
        allowNull: true,
    },
    date: {
        type: Sequalize.DATE, //Timestamp for transaction
        allowNull: false,
    },
    fee: {
        type: Sequalize.DECIMAL(), //User inputs the fee value, we need .1234 numbers
        allowNull: true,
    },
    note: {
        type: Sequalize.STRING(256), //Users note about transaction
        allowNull: true,
    },
    balance_id: {
        type: Sequalize.INTEGER,
        allowNull: false,
    },
})

module.exports = Transaction