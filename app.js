const express = require('express');
const bodyParser = require('body-parser');
const sequalize = require('./utils/database')
const Balance = require('./models/balances')
const Cryptocurrency = require('./models/cryptocurrencies')
const Portfolio = require('./models/portfolios')
const Transaction = require('./models/transactions')
const User = require('./models/users')
const Data = require('./models/historical_data')
const Change = require('./models/price_changes')
const feedRoutes = require('./routes/feed');
const accountRoutes = require('./routes/account')
const assetsRoutes = require('./routes/assets')
const adminRoutes = require('./routes/admin')
const { Op } = require('sequelize');
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
// app.use('/assets/:id', checkJwt, assetsRoutes => {
//     const id = Number(req.params.id)
//     const event = events.find(event => event.id ===id);
//     res.send(event);
// });
app.use('/assets/', assetsRoutes);

// app.use('/')

//sequalize.drop() 
//sequalize.sync() // Need to declare const XXXX = require('./models/...') to work
sequalize.sync()
    .then(result => {
        // console.log(result)
        console.log('success')
        app.listen(8085);
    })
    .catch(err => {
        console.log(err)
    })

const coinsNumber = 10 //DECLARE VALUE OF COINS 1..250 WHEN > 100 THEN CHANGE PAGES DOWN BELOW

function CountRequests() {
    ImportCoinsRequests = 1,
        HistoricalRequests = coinsNumber,
        CoinStatsRequests = 1
    request = ImportCoinsRequests + HistoricalRequests + CoinStatsRequests
    requests = ~~(request / 45) * 60000

    return requests
}

delay = CountRequests()

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
}

var funcImportCoinsFromCoingecko = async () => {
    await wait(delay + 1000)
    tableSize = await Cryptocurrency.count()

    if (tableSize < coinsNumber) {
        Cryptocurrency.sync({ force: true });
        let data = await CoinGeckoClient.coins.markets({
            vs_currency: 'pln',
            order: 'market_cap_desc',
            per_page: coinsNumber,
            page: '1',    // MAX 100 PER PAGE
            //price_change_percentage: ["1h","24h","7d"]
        });
        data.data.forEach((i) => {
            coingecko_id = i.id
            code = i.symbol
            Cryptocurrency.create({
                name: i.name,
                code: i.symbol,
                cryptocurrency_id: i.id,
            })
                .then((coin) =>
                    console.log("Coin created successfully!"),
                )
        })
    } else {
        console.log("TABLE REACHED MINIMAL COINS NUMBER")
    }
}

//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
const { SequelizeScopeError } = require('sequelize/dist');
const res = require('express/lib/response');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

//3. Make calls
var funcImportHistoricalData = async () => {
    await wait(delay + 2000)
    var time1hour = Date.now() - 3600000;
    if (Data.length == 0) {
        lastRowTime = 0
    } else {
        lastRowTime = await Data.findAll({
            limit: 1,
            attributes: ['createdAt'],
            order: [['timestamp', 'DESC']]
        }).then(function (entries) {
            return entries[0].dataValues.createdAt
        });
    }
    if (time1hour > lastRowTime) {
        Data.sync({ force: true });
        console.log("REFRESH")
        namesTable = []
        names = await Cryptocurrency.findAll()
        names.forEach((i) => {
            namesTable.push(i.cryptocurrency_id)
        })
        for (var i = 0; i < namesTable.length; i++) {
            await wait(1000)
            coin_name = namesTable[i]
            coin = await Cryptocurrency.findByPk(coin_name)
            let data = await CoinGeckoClient.coins.fetchMarketChart(namesTable[i], {
                vs_currency: 'pln',
                days: '7',
                interval: 'hourly'
            })
            data.data.prices.forEach((i) => {
                timestamp = i[0]
                price = i[1]
                Data.create({
                    coin_name: coin_name,
                    timestamp: timestamp,
                    price: price,
                })
            })
        }
    } else {
        console.log("NIE REFRESH")
    }
    console.log("FINISH")
};

var funcImportCoinStats = async () => {
    await wait(delay + 3000)
    Change.sync({ force: true });
    namesTable = []
    names = await Cryptocurrency.findAll()
    names.forEach((i) => {
        namesTable.push(i.cryptocurrency_id)
    })
    let data = await CoinGeckoClient.coins.markets({
        ids: namesTable,
        vs_currency: 'pln',
        order: 'market_cap_desc',
        per_page: '10',
        page: '1',    // MAX 100 PER PAGE
        price_change_percentage: '1h,24h,7d'
    });

    data.data.forEach((i) => {
        console.log(i.name, i.current_price, i.market_cap,
            i.price_change_percentage_1h_in_currency, i.price_change_percentage_24h_in_currency,
            i.price_change_percentage_7d_in_currency, i.image)
        Change.create({
            coin_name: i.id,
            rate: i.current_price,
            market_cap: i.market_cap,
            image_url: i.image,
            pln_1h_change: i.price_change_percentage_1h_in_currency,
            pln_1d_change: i.price_change_percentage_24h_in_currency,
            pln_7d_change: i.price_change_percentage_7d_in_currency
        })
            .then(() =>
                console.log("historical data fetched")
            )
    }
    )

};

funcImportCoinsFromCoingecko()
funcImportCoinStats()
//funcImportHistoricalData() //USE IT ONLY ONCE WHEN DATABASE IS EMPTY
setInterval(function () { funcImportCoinStats() }, delay + 60000)
setInterval(function () { funcImportHistoricalData() }, delay + 3720000)