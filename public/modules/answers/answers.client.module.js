'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('answers')


.config(['$stateProvider',
    function($stateProvider) {
        // Answers state routing
        $stateProvider.
        state('listAnswers', {
            url: '/answers',
            templateUrl: 'modules/answers/list-answers.client.view.html'
        }).
        state('createAnswer', {
            url: '/answers/create',
            templateUrl: 'modules/answers/create-answer.client.view.html'
        }).
        state('viewAnswer', {
            url: '/answers/:id',
            templateUrl: 'modules/answers/view-answer.client.view.html'
        }).
        state('editAnswer', {
            url: '/answers/:id/edit',
            templateUrl: 'modules/answers/edit-answer.client.view.html'
        });
    }
])




.run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Answers', 'answers');
        Menus.addMenuItem('topbar', 'New Answer', 'answers/create');
    }
])



.factory('Answers', ['baseCRUD', 'YouTube', '$sce',
    function(baseCRUD, YouTube, $sce) {
        var Resource = new baseCRUD('answers');

        Resource.callbacks.create.success = function(answer) {};
        Resource.callbacks.findOne.after = function(answer) {
            answer.videoDetails = {
                embed: $sce.trustAsResourceUrl(
                    YouTube.embedUrlFromID(
                        YouTube.videoIdFromUrl(
                            answer.video
                        )
                    )
                )
            };

            if (answer.localVideo) {
                answer.localVideo = $sce.trustAsResourceUrl(answer.localVideo);
            }

        };

        return Resource;
    }
])

.controller('AnswersController', ['$scope', 'Authentication', 'Answers', 'Questions', 'Grades',
    function($scope, Authentication, Answers, Questions, Grades) {
        $scope.authentication = Authentication;

        $scope.Questions = Questions.init();
        $scope.question = Questions.single;
        $scope.questions = Questions.list;


        $scope.Answers = Answers.init();
        $scope.answer = Answers.single;
        $scope.answers = Answers.list;


        $scope.Grades = Grades.init();
        $scope.grade = Grades.single;
        $scope.grades = Grades.list;

        Grades.callbacks.update.success = function() {};
        Grades.callbacks.create.success = function() {};


        $scope.findWithGrade = function() {
            Answers.findOne(null, function(answer) {
                Grades.find({
                    answer: answer._id,
                    user: Authentication.user._id
                }, function(grades) {
                    if (grades instanceof Array && grades.length) {
                        angular.extend($scope.grade, grades[0]);
                    } else {
                        angular.extend($scope.grade, {
                            answer: answer._id
                        });
                    }
                })
            });
        }

        Answers.callbacks.findOne.success = function(answer) {
            $scope.aaa = [{
                scr: 'http://localhost:3000/' + answer.localVideo,
                type: 'video/mp4'
            }];

            $scope.bbb = 'lib/videogular/default.css';
        };


    }
])
