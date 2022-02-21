const Sequalize = require('sequelize')
const sequalize = require('../utils/database')
const Balance = require('./balances')
const Transaction = require('./transactions')

const Coin = sequalize.define('coins', {
    coin_id: {
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
    },
    image_url: {
        type: Sequalize.STRING(),
        allowNull: true,
    },
    current_price: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    market_cap: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    market_cap_rank: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    high_24h: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    low_24h: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    price_change_prc_1h: {
        type: Sequalize.DECIMAL(),
        allowNull: false, 
    },
    price_change_prc_24h: {
        type: Sequalize.DECIMAL(),
        allowNull: false, 
    },
    price_change_prc_7d: {
        type: Sequalize.DECIMAL(),
        allowNull: false, 
    },
    sparkline: {
        type: Sequalize.STRING(8192),
        allowNull: false, 
    }
})

Coin.hasMany(Balance, {
    foreignKey:{
        name: 'coin_id',
        allowNull: false,
    }
})

Coin.hasMany(Transaction, {
    foreignKey:{
        name: 'base_id',
        allowNull: false,
    }
})

Coin.hasMany(Transaction, {
    foreignKey:{
        name: 'quote_id',
        allowNull: false,
    }
})

module.exports = Coin