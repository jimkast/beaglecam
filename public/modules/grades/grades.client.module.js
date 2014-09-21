'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('grades')


.config(['$stateProvider',
	function($stateProvider) {
		// Grades state routing
		$stateProvider.
		state('listGrades', {
			url: '/grades',
			templateUrl: 'modules/grades/list-grades.client.view.html'
		}).
		state('createGrade', {
			url: '/grades/create',
			templateUrl: 'modules/grades/create-grade.client.view.html'
		}).
		state('viewGrade', {
			url: '/grades/:gradeId',
			templateUrl: 'modules/grades/view-grade.client.view.html'
		}).
		state('editGrade', {
			url: '/grades/:gradeId/edit',
			templateUrl: 'modules/grades/edit-grade.client.view.html'
		});
	}
])


.run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Grades', 'grades');
		Menus.addMenuItem('topbar', 'New Grade', 'grades/create');
	}
])


.factory('Grades', ['baseCRUD',
    function(baseCRUD) {
        return new baseCRUD('grades');
    }
])



// ========== TO BE REMOVED ===========
.controller('GradesController', ['$scope', '$sce', '$stateParams', '$location', 'Authentication', 'Grades', 'Questions', 'Answers',
    function($scope, $sce, $stateParams, $location, Authentication, Grades, Questions, Answers) {
        $scope.authentication = Authentication;

        // Create new Grade
        $scope.create = function() {
            // Create new Grade object
            var grade = new Grades($scope.grade);

            // Redirect after save
            grade.$save(function(response) {
                $location.path('grades/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            angular.copy({}, $scope.grade);
        };

        // Remove existing Grade
        $scope.remove = function(grade) {
            if (grade) {
                grade.$remove();

                for (var i in $scope.grades) {
                    if ($scope.grades[i] === grade) {
                        $scope.grades.splice(i, 1);
                    }
                }
            } else {
                $scope.grade.$remove(function() {
                    $location.path('grades');
                });
            }
        };

        // Update existing Grade
        $scope.update = function() {
            var grade = $scope.grade;

            grade.$update(function() {
                $location.path('grades/' + grade._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Grades
        $scope.find = function() {
            $scope.grades = Grades.query();
        };

        // Find existing Grade
        $scope.findOne = function() {
            $scope.grade = Grades.get({
                gradeId: $stateParams.gradeId
            }, function() {
                $scope.grade.answer.video2 = $sce.trustAsResourceUrl($scope.grade.answer.video.replace('watch?v=', 'embed/'));
            });
        };




        $scope.findByAnswer = function(answerId) {
            var answerId = answerId || $stateParams.answerId;
            var items = Grades.query({
                answer: answerId
            }, function(grades) {
                if (grades.length) {
                    $scope.grade = grades[0];
                    $scope.grade.answer.video2 = $sce.trustAsResourceUrl($scope.grade.answer.video.replace('watch?v=', 'embed/'));
                } else {
                    $scope.grade = {
                        answer: answerId
                    }
                }
            });
        };



        $scope.grade = {};

        $scope.fetchQuestions = function() {
            $scope.questions = Questions.query(function() {
                $scope.question = $scope.grade.answer && $scope.grade.answer.question || $scope.questions[0]._id;
            });
        };


        $scope.$watch('question', function(val) {
            if (val) {
                $scope.fetchAnswers(val);
            }
        });


        $scope.fetchAnswers = function() {
            $scope.answers = Answers.query({
                question: $scope.question
            }, function(a) {
                if ($scope.answers.length) {
                    $scope.grade.answer = $scope.grade.answer && $scope.grade.answer._id || $scope.answers[0]._id;
                }
            });
        };
    }
]);
