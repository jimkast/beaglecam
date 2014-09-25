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
    config = require('../../config/config'),
    fs = require('fs');



var google = require('googleapis');
var youtube = google.youtube('v3');
var ResumableUpload = require('node-youtube-resumable-upload');
var OAuth2Client = google.auth.OAuth2;





/* 
 * GOOGLE EXAMPLE ====> GET TOKENS ==============
 *

var plus = google.plus('v1');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = 'YOUR CLIENT ID HERE';
var CLIENT_SECRET = 'YOUR CLIENT SECRET HERE';
var REDIRECT_URL = 'YOUR REDIRECT URL HERE';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
    console.log(profile.displayName, ':', profile.tagline);
  });
});


 * 
 * GOOGLE EXAMPLE ====> GET TOKENS ======== END ==========
 */








module.exports = function(app) {


    app.route('/youtube').get(function(request, response, next) {

        var tokens = {
            // access_token: request.user.providerData.accessToken,
            access_token: 'ya29.iwCk32-xGtnCfkeJCRBnhzzyqzwCL35XtEJXT41Wl8-8qJuvNs4n5msn',
            refresh_token: request.user.providerData.refreshToken
        };

        var googleConfig = config.google;

        var oauth2Client = new OAuth2Client(googleConfig.clientID, googleConfig.clientSecret, googleConfig.callbackURL);

        oauth2Client.setCredentials(tokens);


        console.log(tokens, 'tokenssss');


        var metadata = {
            snippet: {
                title: 'cam-proj titleeeeeedfg 2222',
                description: 'Uploaded with ResumableUpload'
            },
            status: {
                privacyStatus: 'private'
            }
        };



        // google.options({
        //     auth: oauth2Client
        // });

        // youtube.videos.insert({
        //     part: 'status,snippet',
        //     resource: {
        //         snippet: {
        //             title: 'cam-proj titleeee',
        //             description: 'Uploaded with ResumableUpload'
        //         },
        //         status: {
        //             privacyStatus: 'private' //if you want the video to be private
        //         }
        //     },
        //     media: {
        //         body: fs.createReadStream('./uploads/testvid.mp4')
        //     }
        // }, function(error, data) {
        //     if (error) {
        //        console.log(error, data, 'errorrrr');
        //     } else {
        //        console.log(error, data.id, data, 'success');
        //     }
        // });

        // return;



        

        var resumableUpload = new ResumableUpload(); //create new ResumableUpload
        resumableUpload.tokens = tokens;
        resumableUpload.filepath = './uploads/testvid.mp4';
        resumableUpload.metadata = metadata;
        resumableUpload.monitor = true;
        resumableUpload.eventEmitter.on('progress', function(progress) {
            console.log(progress);
        });
        resumableUpload.initUpload(function(result) {
            console.log(result);
            return;
        });

        response.writeHead(200, {
            'content-type': 'application/json'
        });
        // res.end(util.inspect(fields));
        response.end(JSON.stringify({
            test: 'aaaaaaa',
            tokens: resumableUpload.tokens
        }));


    });


    app.route('/upload').post(function(request, response, next) {

        var fileName = '';
        var size = '';
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            if (err) {
                response.writeHead(400, {
                    'content-type': 'application/json'
                });
                response.end({
                    message: err.message
                });

            } else {
                response.writeHead(200, {
                    'content-type': 'application/json'
                });
                // res.end(util.inspect(fields));
                response.end(util.inspect(files));
            }

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
            // response.redirect('/uploads/' + fileName);
        });
    })


    .get(function(request, response, next) {
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(
            JSON.stringify({
                test: 'test sl;gkfjsd',
                message: req.query
            })
        );
    });
};
