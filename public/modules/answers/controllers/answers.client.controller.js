'use strict';

// Answers controller
angular.module('answers').controller('AnswersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Answers', 'Questions',
    function($scope, $stateParams, $location, Authentication, Answers, Questions) {
        $scope.authentication = Authentication;

        // Create new Answer
        $scope.create = function() {
            // Create new Answer object
            var answer = new Answers($scope.answer);

            // Redirect after save
            answer.$save(function(response) {
                $location.path('answers/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            angular.copy({}, $scope.answer);
        };

        // Remove existing Answer
        $scope.remove = function(answer) {
            if (answer) {
                answer.$remove();

                for (var i in $scope.answers) {
                    if ($scope.answers[i] === answer) {
                        $scope.answers.splice(i, 1);
                    }
                }
            } else {
                $scope.answer.$remove(function() {
                    $location.path('answers');
                });
            }
        };

        // Update existing Answer
        $scope.update = function() {
            var answer = $scope.answer;

            answer.$update(function() {
                $location.path('answers/' + answer._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Answers
        $scope.find = function() {
            $scope.answers = Answers.query();
        };

        // Find existing Answer
        $scope.findOne = function() {
            $scope.answer = Answers.get({
                answerId: $stateParams.answerId
            });
        };

        $scope.answer = {};

        $scope.fetchQuestions = function(){
            $scope.questions = Questions.query(function(){
                $scope.answer.question = $scope.questions[0]._id;
            });
        };


    }
]);
