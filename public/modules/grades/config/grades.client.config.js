'use strict';

// Configuring the Articles module
angular.module('grades').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Grades', 'grades');
		Menus.addMenuItem('topbar', 'New Grade', 'grades/create');
	}
]);