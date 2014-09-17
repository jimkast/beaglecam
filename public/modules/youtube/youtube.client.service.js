'use strict';

// angular.module('youtube').factory('YouTube', [function() {
// 	console.log('youtube');


// }]);


var youtube = function() {

    var that = this;

    that.videoIdFromUrl = function(url) {
        var urlParts = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if (urlParts) {
            return urlParts[1];
        } else {
            return false;
        }
    };

    that.embedUrlFromID = function(videoId){
    	return 'http://www.youtube.com/embed/' + videoId;
    };

    that.getThumbnails = function(videoId){
    	var arr = [];

    	var prefix = 'http://img.youtube.com/vi/';
    	var suffix = '.jpg';

    	for(var i=0; i<4; i++){
    		arr.push(prefix + videoId + '/' + i + suffix)
    	}
    	return arr;
    };




    that.getVideoDetails = function(videoId, callback, errorCallback){
    	$http({
    		method: 'GET',
    		url: 'http://gdata.youtube.com/feeds/api/videos/' + videoId,
    		param: {
    			alt: 'json'
    		}
    	})
    	.success(callback)
    	.error(errorCallback);
    };

    that.getVideoTitle = function(videoId, callback){
    	that.getVideoDetails(videoId, function(data){
    		if(!data){
    			return false;
    		}
    		callback(data.entry.title['media$title']['$t']);
    	})
    }

}
