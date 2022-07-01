const express = require('express');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require('path');

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

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }));

app.use(checkJwt)

app.use('/account', accountRoutes);
app.use('/assets/', assetsRoutes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send(err.inner);
    }
    else {
        next(err)
    }
});

sync_db()

async function sync_db() {
    try {
        await sequalize.sync()
        console.log("Database synchronized successfully")
        coingecko_handler.handle_coins()
        cron.schedule('* * * * *', () => {
            coingecko_handler.handle_coins()
        });
        app.listen(process.env.PORT);
    } catch {
        console.log(err)
    }
}
