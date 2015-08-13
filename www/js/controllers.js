angular.module('myhiking.controllers', [])

    .controller('MapIndexCtrl', function($scope,$ionicPopup,MapService) {
        $scope.searchKey = "";

        MapService.getAll().then(function (d) {
            $scope.maps = d;
        }, function (err) {
            navigator.notification.alert("Errore di comunicazione con il server", function () {}, "Error", "Chiudi");
        });
          
       // window.localStorage.removeItem("firstboot");
        var firstBoot = window.localStorage.getItem("firstboot");

        if (firstBoot == undefined) {

            $ionicPopup.show({
                templateUrl: "intro-popup.html",
                title: 'Benvenuto',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive'
                    }
                ]
            }
                );


            window.localStorage.setItem("firstboot", "false");
        }
    })

    .controller('MapDetailCtrl', function ($location, $scope, $stateParams, $http, routeConfig, MapService) {

    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //Do nothing
            }, function (error) {
                navigator.notification.alert("Per migliorare l'esperienza d'uso si consiglia di attivare i servizi di geolocalizzazione.", function () {}, "Info", "Chiudi");
            }, {
                timeout: 5000
            });
        }

        MapService.init($stateParams.mapId).then(function (result) {
            var jsonInit = result[0],
                jsonData = result[1];

            window.sessionStorage.setItem("jsonInit", JSON.stringify(jsonInit));
            window.sessionStorage.setItem("jsonData", JSON.stringify(jsonData));

            startMap(jsonInit.data[0], jsonData.data[0]);
        }, function (err) {
            var jsonInit = window.sessionStorage.getItem("jsonInit"),
                jsonData = window.sessionStorage.getItem("jsonData");

            if (jsonInit === undefined || jsonData === undefined) {
                navigator.notification.alert("Errore di comunicazione con il server", function () {}, "Error", "Chiudi");
            } else {
                
                var jsonInitObj = JSON.parse(jsonInit),
                    jsonDataObj = JSON.parse(jsonData);

                startMap(jsonInitObj.data[0], jsonDataObj.data[0]);

                setTimeout(function () {mapWorkOffline(); },5000);
            }
        });

        $scope.scanQrcode = function() {
            capturePhoto(function (qrmessage) {

                var mapId = $location.path().substr($location.path().lastIndexOf("/"));

                try {
                    var obj = JSON.parse(qrmessage.replace(/\\"/g, '"'));
                    obj.mId = mapId;
                } catch (err) {
                    navigator.notification.alert("Errore durante la scansione, riprovare.", function () {}, "Error", "Chiudi");
                    return;
                }

                MapService.getCheckpointData(obj).then(function (result) {
                    addGeoJSONMarker(obj.lat, obj.lng, result);
                }, function (err) {
                    addGeoJSONMarker(obj.lat,obj.lng,
                                     {title: "Checkpoint " + obj.cId,
                                      description: "Sentiero " + obj.rId,
                                      directions: "",
                                      directionsImg: ""
                                     });
                });

                MapService.updateCheckpoint({"mapId":obj.mId, "routeId" : obj.rId, "checkpointId": obj.cId, $inc: { accessNumber: 1 } }).then(function(result) {

                });

            });
        }

        $scope.cacheMap = function() {

            navigator.notification.confirm(
                "Il download della mappa consumerà parte dei dati mobili disponibili.",
                function(buttonIndex){
                    if (buttonIndex == 1) {
                        cachingBounds();
                    } else {
                        return false;
                    }
                },
                "Info",
                ["OK", "Annulla"]
            );
        }

});
