'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Question name',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	readTime: {
		type: Number,
		default: 0
	},
	recordTime: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Question', QuestionSchema);