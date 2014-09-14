'use strict';

// Configuring the Articles module
angular.module('answers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Answers', 'answers');
		Menus.addMenuItem('topbar', 'New Answer', 'answers/create');
	}
]);