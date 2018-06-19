const express = require('express');
const path    = require('path');
const morgan  = require('morgan');
const bodyParser = require('body-parser');
require('./global_functions');
global.__rootdir = path.resolve(__dirname);
console.log(global.__rootdir);
const app = express();
const port = 3000;

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
const imageRouter = require('./routes/images');
app.use('/images',express.static('src/images'));
app.use('/previews', express.static('src/images/previews'))
app.use('/images', imageRouter);

app.post('/', (req, res) => {
    console.log(req.body);
    res.json({
        code: '200'
    })
})
app.listen(port, () => {
    console.log('Hello epta');
} )