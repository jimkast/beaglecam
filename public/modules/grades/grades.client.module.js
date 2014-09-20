'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('grades')





.factory('Grades', ['baseCRUD', 'YouTube', '$sce',
    function(baseCRUD, YouTube, $sce) {
        return new baseCRUD('grades');
    }
])