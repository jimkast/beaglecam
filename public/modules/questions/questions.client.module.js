'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('questions')


.config(['$stateProvider',
    function($stateProvider) {
        // Questions state routing
        $stateProvider.
        state('listQuestions', {
            url: '/questions',
            templateUrl: 'modules/questions/list-questions.client.view.html'
        }).
        state('createQuestion', {
            url: '/questions/create',
            templateUrl: 'modules/questions/create-question.client.view.html'
        }).
        state('viewQuestion', {
            url: '/questions/:id',
            templateUrl: 'modules/questions/view-question.client.view.html'
        }).
        state('editQuestion', {
            url: '/questions/:id/edit',
            templateUrl: 'modules/questions/edit-question.client.view.html'
        });
    }
])


.run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Questions', 'questions');
        Menus.addMenuItem('topbar', 'New Question', 'questions/create');
    }
])

.factory('Questions', ['baseCRUD',
    function(baseCRUD) {
        return new baseCRUD('questions');
    }
])

.controller('QuestionsController', ['$scope', 'Authentication', 'Questions',
    function($scope, Authentication, Questions) {
        $scope.authentication = Authentication;

        $scope.Questions = Questions.init();
        $scope.question = Questions.single;
        $scope.questions = Questions.list;
    }
])
