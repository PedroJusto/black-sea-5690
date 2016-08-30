
(function () {
    'use strict';

    angular
        .module('twitchApiModule', [])

        .factory('twitchApiService', function ($http, $q) {

            var urlApi = "https://api.twitch.tv/kraken/";

            return {
                getStreams: function (text) {
                    return $http.jsonp(urlApi + "search/streams?q=" + text + "&callback=JSON_CALLBACK");
                },

                getViewersCount: function (channel) {
                    var deferred = $q.defer();

                    $http.jsonp(urlApi + "streams?channel=" + channel + "&callback=JSON_CALLBACK")
                        .success(function (data) {
                            if(data.streams.length){
                            deferred.resolve(data.streams[0].viewers);
                            }else{
                               deferred.resolve("without stream"); 
                            }

                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                }
            }
        })

})();