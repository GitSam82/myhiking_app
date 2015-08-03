
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'directory' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'directory.services' is found in services.js
// 'directory.controllers' is found in controllers.js
var app = {
initialize: function() {
    this.bindEvents();
},
// Bind Event Listeners
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
// deviceready Event Handler
onDeviceReady: function() {
    document.addEventListener('online', app.onDeviceOnline, false);
    document.addEventListener('offline', app.onDeviceOffline, false);
},

onDeviceOnline: function() {
    mapWorkOnline();
},

onDeviceOffline: function() {
   mapWorkOffline();
}
};

angular.module('myhiking', ['ionic', 'myhiking.services', 'myhiking.controllers'])

    .constant("routeConfig", {
        "url": "http://192.168.1.100:3001/"
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('map-index', {
                url: '/maps',
                templateUrl: 'templates/maps-index.html',
                controller: 'MapIndexCtrl'
            })

            .state('map', {
                url: '/map/:mapId',
                templateUrl: 'templates/map-detail.html',
                controller: 'MapDetailCtrl'
            });
    
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/maps');

    });

/*    run(function($ionicPlatform) { // instance-injector
        $ionicPlatform.ready(function() {
             document.addEventListener("online", alert("online"), false);
             document.addEventListener("offline", alert("offline"), false);
        });
    });
*/