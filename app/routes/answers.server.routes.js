'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var answers = require('../../app/controllers/answers');

	// Answers Routes
	app.route('/answers')
		.get(answers.list)
		.post(users.requiresLogin, answers.create);
	
	app.route('/answers/:answerId')
		.get(answers.read)
		.put(users.requiresLogin, answers.hasAuthorization, answers.update)
	    .delete(users.requiresLogin, answers.hasAuthorization, answers.delete);

	// Finish by binding the Answer middleware
	app.param('answerId', answers.answerByID);
};