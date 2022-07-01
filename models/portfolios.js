const Sequalize = require('sequelize')
const sequalize = require('../utils/database')
const Balance = require('./balances')

const Portfolio = sequalize.define('portfolios', {
    portfolio_id: {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequalize.STRING(32),
        allowNull: false,
    },
    owner_id: {
        type: Sequalize.STRING(32),
        allowNull: true, // PAMIETAC ZEBY ZMIENIC NA FALSE
    },
    is_main: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
    },
})

Portfolio.hasMany(Balance, {
    foreignKey: {
        name: 'portfolio_id',
        allowNull: false,
    }
})

module.exports = Portfolio