'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    path = require('path'),
    db;


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection

mongoose.connection.on('error', function(err) {
  return console.log(err);
});


try {
    db = mongoose.connect(config.db);
} catch (err){
    console.log('sdfsdf', err)
}


// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Cam Project App started on port ' + config.port);
