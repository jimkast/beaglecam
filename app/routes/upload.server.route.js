'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    articles = require('../../app/controllers/articles'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    multiparty = require('multiparty');

/*

var google = require('googleapis');
var ResumableUpload = require('node-youtube-resumable-upload');
var authClient = new google.auth.JWT(
    'Service account client email address', #You will get "Email address" in developer console
    for Service Account:
    'youtube.pem',
    null, ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.upload'],
    null
);
authClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
    var metadata = {
        snippet: {
            title: 'title',
            description: 'Uploaded with ResumableUpload'
        },
        status: {
            privacyStatus: 'private'
        }
    };
    var resumableUpload = new ResumableUpload(); //create new ResumableUpload
    resumableUpload.tokens = tokens;
    resumableUpload.filepath = 'youtube.3gp';
    resumableUpload.metadata = metadata;
    resumableUpload.monitor = true;
    resumableUpload.eventEmitter.on('progress', function(progress) {
        console.log(progress);
    });
    resumableUpload.initUpload(function(result) {
        console.log(result);
        return;
    });

});




var getTokens = function(callback) {
    googleauth({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube.upload' //can do just 'youtube', but 'youtube.upload' is more restrictive
        }, {
            client_id: CLIENT_ID, //replace with your client_id and _secret
            client_secret: CLIENT_SECRET,
            port: 3000
        },
        function(err, authClient, tokens) {
            console.log(tokens);
            callback(tokens);
        });
};

// getTokens(function(result) {
//     tokens = result;
//     upload();
// });


var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var youtube = google.youtube('v3');

// Retrieve tokens via token exchange explained above or set them:
oauth2Client.setCredentials({
    access_token: 'ACCESS TOKEN HERE',
    refresh_token: 'REFRESH TOKEN HERE'
});

googleapis.discover('youtube', 'v3').execute(function(err, client) {

    var metadata = {
        snippet: {
            title: 'title',
            description: 'description'
        },
        status: {
            privacyStatus: 'private'
        }
    };

    client
        .youtube.videos.insert({
            part: 'snippet,status'
        }, metadata)
        .withMedia('video/mp4', fs.readFileSync('user.flv'))
        .withAuthClient(auth)
        .execute(function(err, result) {
            if (err) console.log(err);
            else console.log(JSON.stringify(result, null, '  '));
        });
});



*/












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
};
