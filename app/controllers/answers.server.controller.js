'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Answer = mongoose.model('Answer'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Answer already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Answer
 */
exports.create = function(req, res) {
	var answer = new Answer(req.body);
	answer.user = req.user;

	answer.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * Show the current Answer
 */
exports.read = function(req, res) {
	res.jsonp(req.answer);
};

/**
 * Update a Answer
 */
exports.update = function(req, res) {
	var answer = req.answer;

	answer = _.extend(answer, req.body);

	answer.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * Delete an Answer
 */
exports.delete = function(req, res) {
	var answer = req.answer;

	answer.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * List of Answers
 */
exports.list = function(req, res) {
	Answer.find().sort('-created').populate('user', 'displayName').populate('question', 'name').exec(function(err, answers) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(answers);
		}
	});
};

/**
 * Answer middleware
 */
exports.answerByID = function(req, res, next, id) {
	Answer.findById(id).populate('user', 'displayName').populate('question', 'name').exec(function(err, answer) {
		if (err) return next(err);
		if (!answer) return next(new Error('Failed to load Answer ' + id));
		req.answer = answer;
		next();
	});
};

/**
 * Answer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.answer.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};