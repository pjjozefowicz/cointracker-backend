const Sequalize = require('sequelize')

const sequalize = require('../utils/database')
const Balance = require('./balances')
const Transaction = require('./transactions')

const Cryptocurrency = sequalize.define('cryptocurrencies', {
    cryptocurrency_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    coingecko_id: {
        type: Sequalize.CHAR(32),
        allowNull: false,
    },
    cryptocurrency_name: {
        type: Sequalize.CHAR(32),
        allowNull: false,
    }
})

Cryptocurrency.hasMany(Balance, {
    foreignKey:{
        name: 'cryptocurrency_id',
        allowNull: false,
    }
})

Cryptocurrency.hasMany(Transaction, {
    foreignKey:{
        name: 'base_id',
        allowNull: false,
    }
})

Cryptocurrency.hasMany(Transaction, {
    foreignKey:{
        name: 'quote_id',
        allowNull: false,
    }
})

module.exports = Cryptocurrency