'use strict';

module.exports = {
    app: {
        title: 'Cam Project',
        description: 'Modern camera technologies prototyp',
        keywords: 'Webcam, camera, education, interview'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEAN',
    sessionCollection: 'sessions',
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
            ],
            js: [
                'public/lib/lodash/lodash.min.js',
                'public/lib2/jquery/jquery-1.9.1.js',

                // 'public/lib2/ScriptCam-master/scriptcam.js',
                // 'public/lib2/ScriptCam-master/swfobject.js',
                // 'public/lib2/ScriptCam-master/jwplayer.js',

                'public/lib/ng-file-upload/angular-file-upload-shim.js',

                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',



                'public/lib/ng-file-upload/angular-file-upload.js',

                'public/lib/webcam-directive/app/scripts/webcam.js',
                'public/lib/videogular/videogular.js',
                'public/lib/videogular-buffering/buffering.js',
                'public/lib/videogular-controls/controls.js',
                'public/lib/videogular-overlay-play/overlay-play.js',
                'public/lib/videogular-poster/poster.js',
                'public/lib/videogular-flash/flash.js',
                


            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
