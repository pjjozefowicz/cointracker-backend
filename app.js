const express = require('express');
const bodyParser = require('body-parser');
const sequalize = require('./utils/database')
const Balance = require('./models/balances')
const Cryptocurrency = require('./models/cryptocurrencies')
const Portfolio = require('./models/portfolios')
const Transaction = require('./models/transactions')
const User = require('./models/users')

const feedRoutes = require('./routes/feed');
const accountRoutes = require('./routes/account')
const assetsRoutes = require('./routes/assets')
const adminRoutes = require('./routes/admin')

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRoutes);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);
app.use('/assets', assetsRoutes);
// app.use('/')

//sequalize.drop() // DATABASE DROP
//sequalize.sync() // Need to declare const XXXX = require('./models/...') to work
// sequalize.sync()
// .then(result => {
//     console.log(result)
//     app.listen(8080);
// })
// .catch(err => {
//     console.log(err)
// })
app.listen(8080)

