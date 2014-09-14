'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var grades = require('../../app/controllers/grades');

	// Grades Routes
	app.route('/grades')
		.get(grades.list)
		.post(users.requiresLogin, grades.create);
	
	app.route('/grades/:gradeId')
		.get(grades.read)
		.put(users.requiresLogin, grades.hasAuthorization, grades.update)
	    .delete(users.requiresLogin, grades.hasAuthorization, grades.delete);

	// Finish by binding the Grade middleware
	app.param('gradeId', grades.gradeByID);
};