const Sequalize = require('sequelize')

const sequalize = require('../utils/database')
const Portfolio = require('./portfolios')

const User = sequalize.define('users', {
    user_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    auth0_id: {
        type: Sequalize.DECIMAL,
        allowNull: false,
    }
})

User.hasOne(Portfolio, {
    foreignKey:{
        name: 'owner_id',
        allowNull: false,
    }
}),
module.exports = User