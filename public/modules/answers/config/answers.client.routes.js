'use strict';

//Setting up route
angular.module('answers').config(['$stateProvider',
	function($stateProvider) {
		// Answers state routing
		$stateProvider.
		state('listAnswers', {
			url: '/answers',
			templateUrl: 'modules/answers/views/list-answers.client.view.html'
		}).
		state('createAnswer', {
			url: '/answers/create',
			templateUrl: 'modules/answers/views/create-answer.client.view.html'
		}).
		state('viewAnswer', {
			url: '/answers/:answerId',
			templateUrl: 'modules/answers/views/view-answer.client.view.html'
		}).
		state('editAnswer', {
			url: '/answers/:answerId/edit',
			templateUrl: 'modules/answers/views/edit-answer.client.view.html'
		});
	}
]);