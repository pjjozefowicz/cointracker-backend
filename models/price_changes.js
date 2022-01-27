const Sequalize = require('sequelize')
const Cryptocurrency = require('./cryptocurrencies')
const sequalize = require('../utils/database')


const Change = sequalize.define('change', {
    coin_name: {
        type: Sequalize.STRING(32),
        allowNull: true,
        primaryKey:true,
    },
    rate: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    market_cap: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    image_url: {
        type: Sequalize.STRING(),
        allowNull: true,
    },
    pln_1h_change: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    pln_1d_change: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    pln_7d_change: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
})

module.exports = Change
