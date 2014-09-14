'use strict';

// Configuring the Articles module
angular.module('questions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Questions', 'questions');
		Menus.addMenuItem('topbar', 'New Question', 'questions/create');
	}
]);