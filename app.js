const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');



mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/APIAuthentication', { useMongoClient: true });
// The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
mongoose.connect('mongodb://localhost/APIAuthentication');



// Middleware
app.use(morgan('dev'));
// app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))



// Routes
app.use('/users', require('./routes/users'));



// Start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening at ',port);