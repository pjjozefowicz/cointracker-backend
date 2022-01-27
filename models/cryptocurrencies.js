const Sequalize = require('sequelize')

const sequalize = require('../utils/database')
const Balance = require('./balances')
const Transaction = require('./transactions')
const Data = require('./historical_data')
const Change = require('./price_changes')

const Cryptocurrency = sequalize.define('cryptocurrencies', {
    cryptocurrency_id: {
        type: Sequalize.STRING(32),
        allowNull: false,
        primaryKey: true        
    },
    name: {
        type: Sequalize.STRING(32),
        allowNull: false,
    },
    code: {
        type: Sequalize.STRING(16),
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

Cryptocurrency.hasMany(Change, {
    foreignKey:{
        name: 'coin_name',
        allowNull: false,
    }
})

module.exports = Cryptocurrency