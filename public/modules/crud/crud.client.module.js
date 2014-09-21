'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('crud')



// .controller('CRUDController', ['$scope', 'Authentication', 'baseCRUD',
//     function($scope, Authentication, baseCRUD) {

//     	$scope.authentication = Authentication;

//         $scope.makeCRUD = function(path) {
//             return $scope.CRUD = new baseCRUD(path);
//         }

//     }
// ])



.factory('baseCRUD', ['$resource', '$stateParams', '$location',
    function($resource, $stateParams, $location) {



        var baseCRUD = function(path) {

            var that = this;


            that.init = function() {
                that.list = [];
                that.single = {};

                return that;
            }

            var createResource = function(path) {
                return $resource(path, {
                    pathId: '@_id'
                }, {
                    update: {
                        method: 'PUT'
                    }
                });
            }

            var Resource = createResource(path + '/:pathId');




            var callbacks = {
                create: {
                    before: function(request) {},
                    after: function(response) {},
                    success: function(response) {
                        angular.copy({}, that.single);
                        $location.path(path + '/' + response._id);
                    },
                    error: function(response) {
                        that.error = response.data.message;
                    }
                },

                remove: {
                    before: function(request) {},
                    after: function(response) {},
                    success: function() {
                        $location.path(path);
                    },
                    error: function(response) {
                        that.error = response.data.message;
                    }
                },

                update: {
                    before: function(request) {},
                    after: function(response) {},
                    success: function(response) {
                        $location.path(path + '/' + response._id);
                    },
                    error: function(response) {
                        that.error = response.data.message;
                    }
                },

                find: {
                    before: function(request) {},
                    after: function(response) {},
                    success: function(response) {},
                    error: function(response) {},
                },


                findOne: {
                    before: function(request) {},
                    after: function(response) {},
                    success: function(response) {},
                    error: function(response) {},
                }

            };


            that.callbacks = callbacks;




            that.create = function(successCallback, errorCallback) {

                var newResource = new Resource(that.single);

                var successCallback = successCallback || callbacks.create.success;
                var errorCallback = errorCallback || callbacks.create.error;

                newResource.$save(successCallback, errorCallback);

                return newResource;
            };


            that.remove = function(itemFromList, successCallback, errorCallback) {

                var successCallback = successCallback || callbacks.remove.success;
                var errorCallback = errorCallback || callbacks.remove.error;

                if (itemFromList) {
                    itemFromList.$remove(function() {
                        for (var i in that.list) {
                            if (that.list[i] === object) {
                                that.list.splice(i, 1);
                            }
                        }
                    }, errorCallback);

                } else {
                    var newResource = new Resource(that.single);
                    newResource.$remove(successCallback, errorCallback);
                }
            };



            that.update = function(itemFromList, successCallback, errorCallback) {

                var successCallback = successCallback || callbacks.update.success;
                var errorCallback = errorCallback || callbacks.update.error;

                var newResource = new Resource(that.single);

                newResource.$update(successCallback, errorCallback);
            };



            that.find = function(queryParams, successCallback, errorCallback) {


            	var successCallback = successCallback || callbacks.findOne.success;
                var errorCallback = errorCallback || callbacks.findOne.error;


                callbacks.find.before(queryParams);

                Resource.query(queryParams, function(data) {
                    angular.extend(that.list, data);
                    callbacks.find.after(data);
                    successCallback(data);
                }, errorCallback);

            };

            that.query = that.find;



            that.findOne = function(id, successCallback, errorCallback) {
                var id = id || $stateParams.id;

                var successCallback = successCallback || callbacks.findOne.success;
                var errorCallback = errorCallback || callbacks.findOne.error;

                callbacks.findOne.before(id);
                if (id) {
                    Resource.get({
                        pathId: id
                    }, function(data) {
                        angular.extend(that.single, data);
                        callbacks.findOne.after(that.single);
                        successCallback(data);
                    }, errorCallback);
                }
            };



            that.urls = {
                create: function() {
                    return '/#!/' + path + '/create';
                },

                list: function() {
                    return '/#!/' + path;
                },

                view: function(id) {
                    var id = id || $stateParams.id;
                    return '/#!/' + path + '/' + id;
                },

                edit: function(id) {
                    var id = id || $stateParams.id;
                    return '/#!/' + path + '/' + id + '/edit';
                }
            }

        }


        return baseCRUD;


    }
]);
