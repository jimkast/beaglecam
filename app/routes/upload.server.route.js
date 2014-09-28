'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    articles = require('../../app/controllers/articles'),
    path = require('path'),
    util = require('util'),
    multiparty = require('multiparty'),
    config = require('../../config/config'),
    fs = require('fs'),
    http = require('http'),
    // sys = require("sys"),
    url = require("url"),
    events = require("events");





var google = require('googleapis');
var youtube = google.youtube('v3');
var ResumableUpload = require('node-youtube-resumable-upload');
var OAuth2Client = google.auth.OAuth2;


function generateUniqueFilename() {
    return Math.random().toString(36).slice(2);
}


function getFileExtension(filename) {
    var fileParts = filename.split(".");
    if (fileParts.length === 1 || (fileParts[0] === "" && fileParts.length === 2)) {
        return "";
    }
    return fileParts.pop();
}

function uploadToYoutube(video_file, tokens, callback) {
    var google = require("googleapis"),
        yt = google.youtube('v3');

    var googleConfig = config.google;

    console.log(googleConfig, 'googleConfig', tokens);

    var oauth2Client = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.callbackURL);
    oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
    });
    google.options({
        auth: oauth2Client
    });

    return yt.videos.insert({
        part: 'status,snippet',
        resource: {
            snippet: {
                title: 'Test Title...',
                description: 'Uploaded for cam project'
            },
            status: {
                privacyStatus: 'private' //if you want the video to be private
            }
        },
        media: {
            body: fs.createReadStream(video_file)
        }
    }, function(error, data) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, data.id);
        }
    });
};







module.exports = function(app) {


    app.route('/youtube').get(function(request, response, next) {

        var tokens = {
            // access_token: request.user.providerData.accessToken,
            access_token: 'ya29.iwCk32-xGtnCfkeJCRBnhzzyqzwCL35XtEJXT41Wl8-8qJuvNs4n5msn',
            refresh_token: request.user.providerData.refreshToken
        };


        var googleConfig = config.google;

        var oauth2Client = new OAuth2Client(googleConfig.clientID, googleConfig.clientSecret, googleConfig.callbackURL);

        oauth2Client.setCredentials({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
        });
        // google.options({
        //     auth: oauth2Client
        // });

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
        resumableUpload.tokens = {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
        };
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

        var destPrefix = './public/',
            destFolder = 'uploads/',
            originalFilename = '',
            newFileName = '',
            fileExtension = '',
            fileSize = '';


        var form = new multiparty.Form();

        form.parse(request, function(err, fields, files) {
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
                response.end(JSON.stringify({
                    // files: files,
                    size: fileSize,
                    original: originalFilename,
                    path: destFolder + newFileName
                }));
            }

        });


        form.on('part', function(part) {
            if (!part.filename) return;
            fileSize = part.byteCount;
            originalFilename = part.filename;
            var fileExtension = getFileExtension(originalFilename);
            fileExtension = fileExtension ? '.' + fileExtension : '';
            newFileName = generateUniqueFilename() + fileExtension;
        });

        form.on('file', function(name, file) {

            var target_path = destPrefix + destFolder + newFileName;
            fs.renameSync(file.path, target_path, function(err) {
                if (err) console.error(err.stack);
            });
            // response.redirect('/uploads/' + fileName);
        });
    });







    app.route('/record').post(function(request, response, next) {


        var downloadfile = request.body.path;
        var base64image = request.body.thumbnail;


        if (!downloadfile) {
            return;
        }

        var dlprogress = 0;
        var filename = generateUniqueFilename();
        var pathPrefix = './public/';
        var videoExtension = '.mp4';
        var imageExtension = '.jpg';
        var videoServerPath = 'uploads/' + filename + videoExtension;
        var videoLocalPath = pathPrefix + videoServerPath;
        var imageServerPath = 'uploads/' + filename + imageExtension;
        var imageLocalPath = pathPrefix + imageServerPath;

        http.get(downloadfile, function(res) {

            response.writeHead(res.statusCode, {
                'content-type': 'application/json'
            });

            if (res.statusCode !== 200) {
                response.end(
                    JSON.stringify({
                        status: res.statusCode
                    })
                );
                return;
            }


            if (base64image) {
                fs.writeFile(imageLocalPath, new Buffer(base64image, 'base64'), function(err) {
                    // console.log(err);
                });
            }

            var writeStream = fs.createWriteStream(videoLocalPath, {
                'flags': 'a'
            });

            res.on('data', function(chunk) {
                dlprogress += chunk.length;
                writeStream.write(chunk);
            });
            res.on('end', function() {
                writeStream.end();
            });


            writeStream.on('finish', function() {

                response.end(
                    JSON.stringify({
                        status: res.statusCode,
                        path: videoServerPath,
                        thumbnail: imageServerPath
                    })
                );

            });



        });


    });


};
