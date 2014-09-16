'use strict';
// Configuring the Articles module
angular.module('teacher').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Teachers', 'teachers/step1', null, null, ['teacher']);
		Menus.addMenuItem('topbar', 'Teachers Step 2', 'teachers/step2', null, null, ['teacher']);
	}
]);