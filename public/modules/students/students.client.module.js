'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('students')


.config(['$stateProvider',
    function($stateProvider) {
        // Answers state routing
        $stateProvider
            .state('students1', {
                url: '/students',
                templateUrl: 'modules/students/students.client.view.html'
            })
            .state('students2', {
                url: '/questions/:id/record',
                templateUrl: 'modules/students/students-record.client.view.html'
            })
            .state('students3', {
                url: '/answers/:id/confirm',
                templateUrl: 'modules/students/students-confirm.client.view.html'
            });
    }
])



.run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Students Area', 'students', null, null, ['student', 'teacher']);
        // Menus.addMenuItem('topbar', 'Students Step 2', 'students/step2', null, null, ['student', 'teacher']);
    }
])



.controller('StudentsController', ['$scope', '$upload', '$sce', '$stateParams', 'Authentication', 'Grades', 'Answers', 'Questions',
    function($scope, $upload, $sce, $stateParams, Authentication, Grades, Answers, Questions) {
        $scope.authentication = Authentication;

        $scope.yt = new youtube();

        $scope.Questions = Questions.init();
        $scope.question = Questions.single;
        $scope.questions = Questions.list;


        $scope.Answers = Answers.init();
        $scope.answer = Answers.single;
        $scope.answers = Answers.list;


        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'upload', //upload.php script, node.js route, or servlet url
                    //method: 'POST' or 'PUT',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {
                        myObj: $scope.myModelObj
                    },
                    file: file, // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name. 
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
                //.error(...)
                //.then(success, error, progress); 
                // access or attach event listeners to the underlying XMLHttpRequest.
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };


    }
])









.controller('StudentsController2', ['$scope', '$upload', '$http', '$timeout', '$sce', '$stateParams', 'Authentication', 'Grades', 'Answers', 'Questions',
    function($scope, $upload, $http, $timeout, $sce, $stateParams, Authentication, Grades, Answers, Questions) {
        $scope.authentication = Authentication;

        $scope.yt = new youtube();

        $scope.Questions = Questions.init();
        $scope.question = Questions.single;
        $scope.questions = Questions.list;


        $scope.Answers = Answers.init();
        $scope.answer = Answers.single;
        $scope.answers = Answers.list;




        var uploadUrl = 'upload';


        $scope.usingFlash = window.FileAPI && window.FileAPI.upload != null;
        $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || window.FileAPI.html5 != false);
        $scope.uploadRightAway = true;

        $scope.hasUploader = function(index) {
            return $scope.upload[index] != null;
        };
        $scope.abort = function(index) {
            $scope.upload[index].abort();
            $scope.upload[index] = null;
        };

        $scope.onFileSelect = function($files) {
            $scope.selectedFiles = [];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] != null) {
                        $scope.upload[i].abort();
                    }
                }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function(fileReader, index) {
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                $scope.dataUrls[index] = e.target.result;
                            });
                        }
                    }(fileReader, i);
                }
                $scope.progress[i] = -1;
                if ($scope.uploadRightAway) {
                    $scope.start(i);
                }
            }
        };

        $scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.errorMsg = null;
            if ($scope.howToSend == 1) {
                $scope.upload[index] = $upload.upload({
                    url: uploadUrl,
                    method: $scope.httpMethod,
                    // headers: {
                    //     'my-header': 'my-header-value'
                    // },
                    data: {
                        myModel: $scope.myModel,
                        errorCode: $scope.generateErrorOnServer && $scope.serverErrorCode,
                        errorMessage: $scope.generateErrorOnServer && $scope.serverErrorMsg
                    },
                    /* formDataAppender: function(fd, key, val) {
                    if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
                }, */
                    /* transformRequest: [function(val, h) {
                    console.log(val, h('my-header')); return val + '-modified';
                }], */
                    file: $scope.selectedFiles[index],
                    fileFormDataName: 'myFile'
                });
                $scope.upload[index].then(function(response) {
                    $timeout(function() {
                        $scope.uploadResult.push(response.data);
                    });
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
                $scope.upload[index].xhr(function(xhr) {
                    //              xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                });
            } else {
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    $scope.upload[index] = $upload.http({
                        url: uploadUrl,
                        headers: {
                            'Content-Type': $scope.selectedFiles[index].type
                        },
                        data: e.target.result
                    }).then(function(response) {
                        $scope.uploadResult.push(response.data);
                    }, function(response) {
                        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                    }, function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
                fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
            }
        };

        $scope.dragOverClass = function($event) {
            var items = $event.dataTransfer.items;
            var hasFile = false;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind == 'file') {
                        hasFile = true;
                        break;
                    }
                }
            } else {
                hasFile = true;
            }
            return hasFile ? "dragover" : "dragover-err";
        };
    }

]);
