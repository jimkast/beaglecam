'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    articles = require('../../app/controllers/articles'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    multiparty = require('multiparty'),
    googleapis = require('googleapis');


module.exports = function(app) {
    // Article Routes
    app.route('/upload').post(function(req, res, next) {

    	var fileName = '';
        var size = '';
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            if (err) {
                res.writeHead(400, {
                    'content-type': 'application/json'
                });
                res.end({
                    message: err.message
                });

                return;
            }
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            // res.end(util.inspect(fields));
            res.end(util.inspect(files));
        });


        form.on('part', function(part) {
            if (!part.filename) return;
            size = part.byteCount;
            fileName = part.filename;
        });

        form.on('file', function(name, file) {

            var target_path = './uploads/' + fileName;
            fs.renameSync(file.path, target_path, function(err) {
                if (err) console.error(err.stack);
            });
            // res.redirect('/uploads/' + fileName);
        });
    });
}
