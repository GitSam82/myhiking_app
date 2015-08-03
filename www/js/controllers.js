angular.module('myhiking.controllers', [])

    .controller('MapIndexCtrl', function($scope,MapService) {
        $scope.searchKey = "";
    
        MapService.async().then(function(d) {
            $scope.maps = d;
        });
    })

    .controller('MapDetailCtrl', function ($scope, $stateParams, $http, routeConfig) {
        var url1 = routeConfig.url+"map/"+$stateParams.mapId+"/base";
        var url2 = routeConfig.url+"map/"+$stateParams.mapId+"/decorations";
    
        //Invoke the route for obtainig the resources for:
        //Map initialization
        //Map GeoJSON data
          $http.get(url1).
            success(function(data, status, headers, config) {    
                var initMapObj = data[0];    
              
                $http.get(url2).
                    success(function(data, status, headers, config) {    
                        startMap(initMapObj,data[0]);
                    }).error(function(data, status, headers, config) {
           
                    });
            }).
            error(function(data, status, headers, config) {
           
            });
           
        $scope.scanQrcode = function(){
            capturePhoto(function(qrmessage){
                //{mId: "samueleferrari.mpao2mk0",rId : "34",cId: "1",lat:"46.933553",lng:"11.367781"}
               // var test = "{\"mId\": \"samueleferrari.mpao2mk0\",\"rId\" : \"34\",\"cId\": \"1\",\"lat\":\"46.933553\",\"lng\":\"11.367781\"}";
              // alert(qrmessage);
                    
                var obj = JSON.parse(qrmessage.replace(/\\"/g, '"'));
               
                var url = routeConfig.url+"map/"+obj.mId+"/"+obj.rId+"/"+obj.cId+"/data";
                var additionalData = undefined;
                
                $http.get(url).
                    success(function(data, status, headers, config) {    
                        additionalData = data[0];
                     addGeoJSONMarker(obj.lat,obj.lng,additionalData);
                }).error(function(data, status, headers, config) {
           
                });
            });
        }
        
         $scope.cacheMap = function(){
             
             navigator.notification.confirm(
                 "Il download della mappa consumerà parte dei dati mobili disponibili.",
                 function(buttonIndex){
                     if(buttonIndex == 1){
                           cachingBounds();
                     }else{
                         return false;
                     }
                 },
                 "Info",
                 ["OK","Annulla"]
             );
         }
    
    });

    /*.controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findByManager($stateParams.employeeId).then(function(employees) {
            $scope.employees = employees;
        });
    });*/