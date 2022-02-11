const Sequalize = require('sequelize')
const Transaction = require('./transactions')
const sequalize = require('../utils/database')

const Balance = sequalize.define('balances', {
    balance_id: {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cryptocurrency_id: {
        type: Sequalize.STRING(32),
        allowNull: true,
    },
    amount: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    portfolio_id: {
        type: Sequalize.INTEGER,
        allowNull: false,
    },
    cost: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    }
})

Balance.hasMany(Transaction, {
    foreignKey: {
        name: 'balance_id',
        allowNull: false,
    }
})

module.exports = Balance
