angular.module('myhiking.services', [])
.factory('MapService', function($http, $q, routeConfig) {
         
    var MapService = {
        getAll: function() {
          // $http returns a promise, which has a then function, which also returns a promise
            var url = routeConfig.URL+"map/all";
            var promise = $http.get(url).then(function (response) {
                return response.data;
            });
    
      // Return the promise to the controller
      return promise;
    },
        init: function(mapId){
            var firstCall = $http.get(routeConfig.URL+"map/"+mapId+"/base");
            var secondCall = $http.get(routeConfig.URL+"map/"+mapId+"/decorations");
            
            var promise = $q.all([firstCall, secondCall]).then(function(values) {  
                return values;
            });
           
            return promise;
        }, 
        getCheckpointData: function(mapData){
            var url = routeConfig.URL+"map/"+mapData.mId+"/"+mapData.rId+"/"+mapData.cId+"/data";

            var promise = $http.get(url).then(
              function(values){
                    return values.data[0];
              }
          );
          return promise;
        },
        updateCheckpoint: function(mapData){
          var promise = $http.post(routeConfig.URL+'map/createCheckpoint', mapData).then(
              function(values){
                  return values;
              }
          );
          return promise;
        }
  };
  return MapService;
});

  