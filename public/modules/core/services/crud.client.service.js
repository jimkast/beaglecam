'use strict';

//Questions service used to communicate Questions REST endpoints
angular.module('core').factory('baseCRUD', ['$resource', '$stateParams', '$location',
    function($resource, $stateParams, $location) {



        var baseCRUD = function(path, singleTarget, listTarget) {

            var that = this;

            that.list = listTarget || [];
            that.single = singleTarget || {};
            that.error;


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
                    success: function(response) {
                        angular.copy({}, that.single);
                        $location.path(path + '/' + response._id);
                    },
                    error: function(response) {
                        that.error = response.data.message;
                    }
                },

                remove: {
                    success: function() {
                        $location.path(path);
                    },
                    error: function(response) {
                        that.error = response.data.message;
                    }
                },

                update: {
                    success: function() {
                        $location.path(path) + '/' + $stateParams.id;
                    },
                    error: function(response) {
                        that.error = response.data.message;
                    }
                }


            };




            that.create = function(successCallback, errorCallback) {

                console.log(that.single)
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



            that.find = function(queryParams) {
                Resource.query(queryParams, function(data) {
                    angular.extend(that.list, data);
                });

            };



            that.findOne = function(id) {
                var id = id || $stateParams.id;

                if (id) {
                    Resource.get({
                        pathId: id
                    }, function(data) {
                        angular.extend(that.single, data);
                    });
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
