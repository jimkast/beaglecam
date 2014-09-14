'use strict';

//Setting up route
angular.module('grades').config(['$stateProvider',
	function($stateProvider) {
		// Grades state routing
		$stateProvider.
		state('listGrades', {
			url: '/grades',
			templateUrl: 'modules/grades/views/list-grades.client.view.html'
		}).
		state('createGrade', {
			url: '/grades/create',
			templateUrl: 'modules/grades/views/create-grade.client.view.html'
		}).
		state('viewGrade', {
			url: '/grades/:gradeId',
			templateUrl: 'modules/grades/views/view-grade.client.view.html'
		}).
		state('editGrade', {
			url: '/grades/:gradeId/edit',
			templateUrl: 'modules/grades/views/edit-grade.client.view.html'
		});
	}
]);