'use strict';

//Setting up route
angular.module('teacher').config(['$stateProvider',
    function($stateProvider) {
        // Answers state routing
        $stateProvider
            .state('teacher1', {
                url: '/teachers/step1',
                templateUrl: 'modules/teacher/views/teacher-step-1.client.view.html'
            })
            .state('teacher2', {
                url: '/teachers/step2',
                templateUrl: 'modules/teacher/views/teacher-step-2.client.view.html'
            });
    }
]);
