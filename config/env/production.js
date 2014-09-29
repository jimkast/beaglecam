'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    db: 'mongodb://beagle:b3agl3@ds039010.mongolab.com:39010/cam-project' || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/cam-project',
    assets: {
        lib: {
            css: [],
            js: []
        },
        css: [
            'public/dist/vendor.min.css',
            'public/dist/application.min.css'
        ],
        js: [
            'public/dist/vendor.min.js',
            'public/dist/application.min.js'
        ]
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'APP_ID',
        clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '359513100602-9jup6gctlodi0qqfhf60qap56is98h3u.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'ACJsqD8rDAASYVDZ5_-zREVV',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
