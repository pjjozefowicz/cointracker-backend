const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.POSTGRES_DB_NAME, process.env.POSTGRES_DB_USER, process.env.POSTGRES_DB_PASSW, {
    host: process.env.NODE_ENV == "production" ? "postgresdb": "localhost",
    dialect: 'postgres',
    logging: false
  });

module.exports = sequelize

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

test()