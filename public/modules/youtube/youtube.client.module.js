'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('youtube')


.factory('YouTube', [function() {
	return new youtube();

}]);