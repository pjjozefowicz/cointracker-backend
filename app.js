const express = require('express');
const bodyParser = require('body-parser');
const sequalize = require('./utils/database')

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

// sequalize.sync()
// .then(result => {
//     console.log(result)
//     app.listen(8080);
// })
// .catch(err => {
//     console.log(err)
// })
app.listen(8080)

