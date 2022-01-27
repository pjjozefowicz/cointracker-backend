const Sequalize = require('sequelize')
const Cryptocurrency = require('./cryptocurrencies')
const sequalize = require('../utils/database')


const Data = sequalize.define('data', {
    data_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    timestamp: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    price: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    coin_name: {
        type: Sequalize.STRING(16),
        allowNull: true,
    }
})

module.exports = Data
