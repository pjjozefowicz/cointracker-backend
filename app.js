const { Op } = require('sequelize');
const express = require('express');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const helmet = require("helmet");

const checkJwt = require('./auth/jwt_auth')
const sequalize = require('./utils/database')
const accountRoutes = require('./routes/account')
const assetsRoutes = require('./routes/assets')
const Balance = require('./models/balances')
const Coin = require('./models/coins')
const Portfolio = require('./models/portfolios')
const Transaction = require('./models/transactions')
const coingecko_handler = require('./utils/coingecko_handler/coingecko_handler')

const app = express();
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(helmet())

app.use(checkJwt)

app.use('/account', accountRoutes);
// app.use('/admin', adminRoutes);
// app.use('/assets/:id', checkJwt, assetsRoutes => {
//     const id = Number(req.params.id)
//     const event = events.find(event => event.id ===id);
//     res.send(event);
// });
app.use('/assets/', assetsRoutes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send(err.inner);
    }
    else {
        next(err)
    }
});

// app.use('/')

//sequalize.drop() 
//sequalize.sync() // Need to declare const XXXX = require('./models/...') to work
sequalize.sync()
    .then(result => {
        // console.log(result)
        console.log('success')
        app.listen(process.env.PORT || 8085);
    })
    .catch(err => {
        console.log(err)
    })

cron.schedule('* * * * *', () => {
    coingecko_handler.handle_coins()
});
