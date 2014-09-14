'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Grade = mongoose.model('Grade'),
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
				message = 'Grade already exists';
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
 * Create a Grade
 */
exports.create = function(req, res) {
	var grade = new Grade(req.body);
	grade.user = req.user;

	grade.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(grade);
		}
	});
};

/**
 * Show the current Grade
 */
exports.read = function(req, res) {
	res.jsonp(req.grade);
};

/**
 * Update a Grade
 */
exports.update = function(req, res) {
	var grade = req.grade;

	grade = _.extend(grade, req.body);

	grade.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(grade);
		}
	});
};

/**
 * Delete an Grade
 */
exports.delete = function(req, res) {
	var grade = req.grade;

	grade.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(grade);
		}
	});
};

/**
 * List of Grades
 */
exports.list = function(req, res) {
	Grade.find().sort('-created').populate('user', 'displayName').populate('answer').exec(function(err, grades) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(grades);
		}
	});
};

/**
 * Grade middleware
 */
exports.gradeByID = function(req, res, next, id) {
	Grade.findById(id).populate('user', 'displayName').populate('answer').exec(function(err, grade) {
		if (err) return next(err);
		if (!grade) return next(new Error('Failed to load Grade ' + id));
		req.grade = grade;
		next();
	});
};

/**
 * Grade authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.grade.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};