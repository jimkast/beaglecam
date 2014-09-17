'use strict';
// Configuring the Articles module
angular.module('student').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Students', 'students/step1', null, null, ['student']);
		Menus.addMenuItem('topbar', 'Students Step 2', 'students/step2', null, null, ['student']);
	}
]);