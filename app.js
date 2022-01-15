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
app.use('/assets', assetsRoutes);
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
// app.listen(8085)


function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
  }

var funcImportCoinsFromCoingecko = async() => {
    await wait(1000)
    coinsNumber = 10 //DECLARE VALUE OF COINS 1..250 WHEN > 100 THEN CHANGE PAGES DOWN BELOW
    tableSize = await Cryptocurrency.count()
    
    if (tableSize < coinsNumber) {
    let data = await CoinGeckoClient.coins.markets({
        vs_currency: 'pln',
        order: 'market_cap_desc',
        per_page: coinsNumber, 
        page: '1',    // MAX 100 PER PAGE
        //price_change_percentage: ["1h","24h","7d"]
    });
    data.data.forEach((i) =>{
        coingecko_id = i.id
        code = i.symbol  
    Cryptocurrency.create({
        name: i.name,
        code: i.symbol,
        coingecko_id: i.id,
      })
        .then((coin) =>
        console.log("Coin created successfully!"),
        )
    })
} else {
    console.log("TABLE REACHED MINIMAL COINS NUMBER")
}}

//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
const { SequelizeScopeError } = require('sequelize/dist');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

//3. Make calls
var func = async() => {
    await wait(2000)
    namesTable = []
    coinidsTable = []
    names = await Cryptocurrency.findAll()
    names.forEach((i) => {
        namesTable.push(i.coingecko_id)
        coinidsTable.push(i.cryptocurrency_id)        
    })
    console.log(coinidsTable)
    for (var i = 0; i < namesTable.length; i++) {
    await wait(1000)
    coin_id = coinidsTable[i]
    coin_name = namesTable[i]
    
    coin = await Cryptocurrency.findByPk(coin_id)
    let data = await CoinGeckoClient.coins.fetchMarketChart(namesTable[i], {
        vs_currency: 'pln',
        days: '7',
        interval: 'hourly'
    })
    data.data.prices.forEach((i) =>{
        timestamp = i[0]
        price = i[1]
        Data.create({
            coin_name: coin_name,
            coin_id: coin_id,
            timestamp: timestamp,
            price: price,
          })
            .then(() =>
            console.log("historical data fetched")
            )  
    })
    }
};

//
//
//
// first start project then uncomment those 2 functions

//
//
//
//
//
//
//
//


var frontend7d = async () => {
    await wait(3000)
    Change.sync({ force: true });
    namesTable = []
    coinidsTable = []
    names = await Cryptocurrency.findAll()
    names.forEach((i) => {
        namesTable.push(i.coingecko_id)
        coinidsTable.push(i.cryptocurrency_id)
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
            i.price_change_percentage_7d_in_currency )
            Change.create({
                coin_name: i.id,
                pln: i.current_price,
                market_cap: i.market_cap,
                pln_1h: i.price_change_percentage_1h_in_currency,
                pln_1d: i.price_change_percentage_24h_in_currency,
                pln_7d: i.price_change_percentage_7d_in_currency
              })
                .then(() =>
                console.log("historical data fetched")
                )  
            }
    )
    
};
//wait(1000)
//funcImportCoinsFromCoingecko() //IMPORTING COINS FROM COINGECKO
//wait(1000)
//func()
//wait(1000)
frontend7d()