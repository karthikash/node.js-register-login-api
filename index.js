'use strict';

// Required libraries
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const routes = require('./routes/user')

// for parsing application/json
app.use(bodyParser.json({
    extended: false
}));

// for parsing  application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// CORS controllers
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "Authorization"); // for webgl support
    next();
})

// App routes
app.use('/auth', routes)

mongoose.connect('mongodb://localhost:27017/authDB', { useNewUrlParser: true }, (err) => {
    console.log('Database is connected');
    if (err) {
        return err;
    } else {
        mongoose.Promise = global.Promise;
        global.ObjectId = mongoose.Types.ObjectId;
    }
})

app.listen(port, () => {
    console.log('Server is running on port', port)
});