angular.module('myhiking.services', [])
.factory('MapService', function($http, $q, routeConfig) {
         
    var MapService = {
        asyncAll: function() {
          // $http returns a promise, which has a then function, which also returns a promise
            alert(routeConfig.url);
            var url = routeConfig.url+"map/all";
            var promise = $http.get(url).then(function (response) {
            // The then function here is an opportunity to modify the response
            console.log(response);
            // The return value gets picked up by the then in the controller.
            return response.data;
          });
    
      // Return the promise to the controller
      return promise;
    },
        asyncInit: function(mapId){
            var firstCall = $http.get(routeConfig.url+"map/"+mapId+"/base");
            var secondCall = $http.get(routeConfig.url+"map/"+mapId+"/decorations");
            
            var promise = $q.all([firstCall, secondCall]).then(function(values) {  
                return values;
            });
           
            return promise;
        }
  };
  return MapService;
});
    
        //var maps = [{"key": "http://192.168.1.100:3001/map/samueleferrari.mpao2mk0/base", "description" : "Landurns" }];
 //   var maps = [{"key": "samueleferrari.mpao2mk0", "description" : "Landurns" },{"key": "samueleferrari.mpao2mk0", //"description" : "Test" }];
    
   /* var maps = [];
    
    var url = "http://192.168.1.100:3001/map/all";
                $http.get(url).
                    success(function(data, status, headers, config) {    
                        maps = JSON.stringify(data);
                    }).error(function(data, status, headers, config) {
           
                    });
    
      return {
            findAll: function() {
                var deferred = $q.defer();
                alert(maps);
                deferred.resolve(maps);
                return deferred.promise;
            }
      }
    });*/


  