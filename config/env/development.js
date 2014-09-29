'use strict';

module.exports = {
    port: process.env.PORT || 3001,
	db: 'mongodb://localhost/cam-project-dev',
	rootPath: 'public/',
	app: {
		title: 'Cam Project - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3001/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3001/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '359513100602-9jup6gctlodi0qqfhf60qap56is98h3u.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'ACJsqD8rDAASYVDZ5_-zREVV',
		callbackURL: 'http://localhost:3001/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3001/auth/linkedin/callback'
	}
};