'use strict';

// Answers controller
angular.module('teacher').controller('TeacherController', ['$scope', '$sce', '$stateParams', '$location', 'Authentication', 'Grades', 'Answers', 'Questions',
    function($scope, $sce, $stateParams, $location, Authentication, Grades, Answers, Questions) {
        $scope.authentication = Authentication;

        // Find a list of Answers
        $scope.fetchAnswers = function(questionId) {
            $scope.answers = Answers.query();
        };

        // $scope.answers = Answers.query({
        //     question: $scope.question
        // }, function(a) {
        //     if ($scope.answers.length) {
        //         $scope.grade.answer = $scope.grade.answer && $scope.grade.answer._id || $scope.answers[0]._id;
        //     }
        // });

        // Find existing Answer
        $scope.findOne = function() {
            $scope.answer = Answers.get({
                answerId: $stateParams.answerId
            }, function() {
                $scope.answer.video2 = $sce.trustAsResourceUrl($scope.answer.video.replace('watch?v=', 'embed/'));

            });

        };

        $scope.answer = {};

        $scope.fetchQuestions = function() {
            $scope.questions = Questions.query();
        };


    }
]);
