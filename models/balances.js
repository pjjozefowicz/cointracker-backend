const Sequalize = require('sequelize')

const sequalize = require('../utils/database')

const Balance = sequalize.define('balances', {
    balance_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    amount: {
        type: Sequalize.DECIMAL(),
        allowNull: false,
    },
    portfolio_id: {
        type: Sequalize.UUID(),
        allowNull: false,
    }
})

module.exports = Balance
