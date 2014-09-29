'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('scriptcam')


.directive('scriptcamera', [

    function() {
        return {
            restrict: 'AE',
            link: function(scope, element, attrs) {
                var initialized = false;
                scope.$watch(attrs['scriptcameraInit'], function(value) {
                    if (value && !initialized) {
                        element.scriptcam(scope[attrs['scriptcamera']]);
                    }
                })

            }
        }
    }
])



.controller('ScriptcamController', ['$scope', '$rootScope',

    function($scope, $rootScope) {

        var Webcam = {};
        $scope.Webcam = Webcam;
        // window.Webcam = Webcam;


        $scope.$on('record:init', function(event, recordTime) {
            Webcam.init(recordTime);
        });

        $scope.$on('record:start', function() {
            Webcam.startRecording();

            Webcam.thumbnail = Webcam.captureImage();

        });

        Webcam.init = function(timeLeft) {

            Webcam.setRecordTime(timeLeft);

            $scope.webcamConfig = {
                fileReady: Webcam.fileReady,
                // path: '/uploads/',
                onError: Webcam.onError,
                // promptWillShow: Webcam.promptWillShow,
                showMicrophoneErrors: false,
                // showDebug: true,
                onWebcamReady: Webcam.onWebcamReady,
                // canvasWidth: 640,
                // canvasHeight: 480,
                cornerRadius: 0,
                setVolume: Webcam.setVolume,
                timeLeft: Webcam.getTimeLeft,
                fileName: 'camproj_rec_01',
                connected: Webcam.onConnect,
                maximumTime: Webcam.timeLeft || 30
            };

            $scope.loadWebcam = true;
        };

        Webcam.setRecordTime = function(seconds) {
            if (seconds === parseInt(seconds, 10)) {
                Webcam.timeLeft = seconds;
            }
        };


        Webcam.onConnect = function() {
            Webcam.connected = true;
        };

        Webcam.captureImage = function() {
            return jQuery.scriptcam.getFrameAsBase64();
        }

        Webcam.startRecording = function() {
            jQuery.scriptcam.startRecording();

            Webcam.recording = true;
        };

        Webcam.closeCamera = function() {
            jQuery.scriptcam.closeCamera();

            Webcam.recording = false;
            $rootScope.$broadcast('record:end');
        };

        Webcam.pauseResumeCamera = function() {

            if (Webcam.paused) {
                jQuery.scriptcam.resumeRecording();
            } else {
                jQuery.scriptcam.pauseRecording();
            }

            Webcam.paused = !Webcam.paused;
        };

        Webcam.fileReady = function(fileName) {
            Webcam.fileReady = true;
            Webcam.fileName = fileName;

            $rootScope.$broadcast('record:fileready', fileName, Webcam.thumbnail);
        };

        Webcam.onError = function(errorId, errorMsg) {

            // You have reached the maximum time
            // console.log(errorId, errorMsg)
            if (errorId == 11) {
                Webcam.recording = false;
                $rootScope.$broadcast('record:end', 'timeout');
            } else {
                $rootScope.$broadcast('record:error', {
                    id: errorId,
                    msg: errorMsg
                });
            }
        };

        Webcam.onWebcamReady = function(cameraNames, camera, microphoneNames, microphone, volume) {

            $rootScope.$broadcast('record:ready', cameraNames);

            $scope.$apply(function() {
                Webcam.cameraNames = cameraNames;
                Webcam.camera = camera;
                Webcam.microphoneNames = microphoneNames;
                Webcam.microphone = microphone;
                Webcam.volume = volume;
            });
        };

        Webcam.promptWillShow = function() {
            console.log('A security dialog will be shown. Please click on ALLOW.');
        }

        Webcam.setVolume = function(value) {
            Webcam.volume = value;
        };

        Webcam.getTimeLeft = function(value) {
            $scope.$apply(function() {
                Webcam.timeLeft = value;
            });
        };

        Webcam.changeCamera = function() {
            jQuery.scriptcam.changeCamera(Webcam.camera);
        };

        Webcam.changeMicrophone = function(microphoneValue) {
            jQuery.scriptcam.changeMicrophone(Webcam.microphone);
        };

    }
]);
