'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grade Schema
 */
var GradeSchema = new Schema({
	value: {
		type: Number,
		default: 0,
		required: 'Please fill Grade value',
		trim: true
	},
	answer: {
		type: Schema.ObjectId,
		ref: 'Answer',
		required: 'Please fill the Answer reference',
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

mongoose.model('Grade', GradeSchema);