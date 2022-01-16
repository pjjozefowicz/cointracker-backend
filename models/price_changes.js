const Sequalize = require('sequelize')
const Cryptocurrency = require('./cryptocurrencies')
const sequalize = require('../utils/database')


const Change = sequalize.define('change', {
    data_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    coin_name: {
        type: Sequalize.STRING(16),
        allowNull: true,
    },
    pln: {
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
    pln_1h: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    pln_1d: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
    pln_7d: {
        type: Sequalize.DECIMAL(),
        allowNull: true,
    },
})

module.exports = Change
