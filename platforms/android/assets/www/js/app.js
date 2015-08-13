var app = {
    initialize: function () {
        this.bindEvents();
    },
    
    // Bind Event Listeners
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        document.addEventListener('online', app.onDeviceOnline, false);
        document.addEventListener('offline', app.onDeviceOffline, false);
    },

    onDeviceOnline: function () {
        mapWorkOnline();
    },

    onDeviceOffline: function () {
       mapWorkOffline();
    }
};

angular.module('myhiking', ['ionic', 'myhiking.services', 'myhiking.controllers'])

    .constant("routeConfig", {
        //"URL": "http://192.168.1.100:3001/",
        "URL": "http://myhiking-sam82app.rhcloud.com/",
        "PORT": ""
    })
    .config(function ($stateProvider, $urlRouterProvider) {

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
