const express = require('express');
const path    = require('path');
const morgan  = require('morgan');
require('./global_functions');

const app = express();
const imageRouter = require('./routes/images');
global.__rootdir = path.resolve(__dirname);
app.use(morgan('dev'));
app.use('/images',express.static('src/images'));
app.use('/images', imageRouter);

app.listen(3000, () => {
    console.log('Hello epta');
} )