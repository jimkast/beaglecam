'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication', function($scope, $state, Authentication) {
    $scope.authentication = Authentication;


    $scope.checkAuth = function(state) {
        if (Authentication.user) {
            $state.go(state);
        } else {
            $scope.errorMsg = true;
        }
    }

}]);
