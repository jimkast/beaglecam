'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('teacher')


.config(['$stateProvider',
    function($stateProvider) {
        // Answers state routing
        $stateProvider
            .state('teacher1', {
                url: '/teachers/step1',
                templateUrl: 'modules/teacher/teacher-step-1.client.view.html'
            })
            .state('teacher2', {
                url: '/teachers/step2',
                templateUrl: 'modules/teacher/teacher-step-2.client.view.html'
            });
    }
])



.run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Teachers', 'teachers/step1', null, null, ['teacher']);
        Menus.addMenuItem('topbar', 'Teachers Step 2', 'teachers/step2', null, null, ['teacher']);
    }
])



.controller('TeacherController', ['$scope', '$sce', '$stateParams', '$location', 'Authentication', 'Grades', 'Answers', 'Questions',
    function($scope, $sce, $stateParams, $location, Authentication, Grades, Answers, Questions) {
        $scope.authentication = Authentication;

        $scope.yt = new youtube();

        $scope.Questions = Questions.init();
        $scope.question = Questions.single;
        $scope.questions = Questions.list;


        $scope.Answers = Answers.init();
        $scope.answer = Answers.single;
        $scope.answers = Answers.list;


        // Find a list of Answers
        $scope.fetchAnswers = function(questionId) {
            $scope.answers = Answers.query();
        };

    }
]);
