'use strict';

//Setting up route
angular.module('student').config(['$stateProvider',
    function($stateProvider) {
        // Answers state routing
        $stateProvider
            .state('student1', {
                url: '/students/step1',
                templateUrl: 'modules/student/views/student-step-1.client.view.html'
            })
            .state('student2', {
                url: '/students/step2',
                templateUrl: 'modules/student/views/student-step-2.client.view.html'
            });
    }
]);
