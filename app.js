const express = require('express');
const bodyParser = require('body-parser');
const sequalize = require('./utils/database')
const Balance = require('./models/balances')

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.use('/')
app.use('/feed', feedRoutes);

sequalize.sync()
.then(result => {
    console.log(result)
    app.listen(8080);
})
.catch(err => {
    console.log(err)
})

