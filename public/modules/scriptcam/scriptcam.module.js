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



.controller('ScriptcamController', ['$scope', '$http',

    function($scope, $http) {

        var Webcam = {};
        $scope.Webcam = Webcam;
        window.Webcam = Webcam;



        Webcam.init = function() {
            $scope.webcamConfig = {
                fileReady: Webcam.fileReady,
                // path: '/uploads/',
                onError: Webcam.onError,
                // promptWillShow: promptWillShow,
                showMicrophoneErrors: false,
                // showDebug: true,
                onWebcamReady: Webcam.onWebcamReady,
                setVolume: Webcam.setVolume,
                timeLeft: Webcam.getTimeLeft,
                fileName: 'beaglecam_record_001',
                connected: Webcam.onConnect,
                maximumTime: 30
            };

            $scope.loadWebcam = true;
        }

        Webcam.onConnect = function() {
            Webcam.connected = true;
        }

        Webcam.startRecording = function() {
            $.scriptcam.startRecording();

            Webcam.recording = true;
        }

        Webcam.closeCamera = function() {
            $.scriptcam.closeCamera();

            Webcam.recording = false;
            Webcam.message = 'Please wait for the file conversion to finish...';
        }

        Webcam.pauseResumeCamera = function() {

            if (Webcam.paused) {
                $.scriptcam.resumeRecording();
            } else {
                $.scriptcam.pauseRecording();
            }

            Webcam.paused = !Webcam.paused;
        }

        Webcam.fileReady = function(fileName) {
            Webcam.fileReady = true;
            Webcam.fileName = fileName;


            $http({
                url: 'upload',
                method: 'GET',
                params: {
                    action: 'record',
                    path: fileName
                }
            })
            .success(function(data, status, headers, config) {
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        }

        Webcam.onError = function(errorId, errorMsg) {
            alert(errorMsg);
        }

        Webcam.onWebcamReady = function(cameraNames, camera, microphoneNames, microphone, volume) {
            $scope.$apply(function() {
                Webcam.cameraNames = cameraNames;
                Webcam.camera = camera;
                Webcam.microphoneNames = microphoneNames;
                Webcam.microphone = microphone;
                Webcam.volume = volume;
            });
        }

        Webcam.promptWillShow = function() {
            alert('A security dialog will be shown. Please click on ALLOW.');
        }

        Webcam.setVolume = function(value) {
            Webcam.volume = value;
        }

        Webcam.getTimeLeft = function(value) {
            $scope.$apply(function() {
                Webcam.timeLeft = value;
            });
        }

        Webcam.changeCamera = function() {
            $.scriptcam.changeCamera(Webcam.camera);
        }

        Webcam.changeMicrophone = function(microphoneValue) {
            $.scriptcam.changeMicrophone(Webcam.microphone);
        }







        Webcam.init();

    }
]);
