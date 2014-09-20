'use strict';

//Grades service used to communicate Grades REST endpoints
angular.module('grades').factory('GradesOLD', ['$resource', function($resource) {
    return $resource('grades/:gradeId', {
        gradeId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);