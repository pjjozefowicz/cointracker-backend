const Sequelize = require('sequelize')

const sequelize = new Sequelize('testing', 'alice', '1234', {
    host: 'localhost',
    dialect: 'postgres'
  });

module.exports = sequelize

// async function test() {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
// }

// test()