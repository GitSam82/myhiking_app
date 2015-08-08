var MAP, BASE;
var CACHE_ZOOM_MAX;
var MAX_BOUNDS;

//Initialize the choosen map with the mandatory data and with the additional GeoJSON markers.
function startMap(initObj, initGeoJSON) {

    MAP = L.map('map', {
        minZoom: initObj.minZoom,
        maxZoom: initObj.maxZoom
    });

    try {
        CACHE_ZOOM_MAX = initObj.maxZoom;
        ACCESS_TOKEN = initObj.accessToken;
        MAP_ID = initObj.mapId;
        FOLDER_NAME = initObj.folderName;
        MAP_NAME = initObj.name;

        LAT = initObj.center[0];
        LNG = initObj.center[1];
        ZOOM = initObj.minZoom;

        var southWest = L.latLng(initObj.southWestBound[0], initObj.southWestBound[1]);
        northEast = L.latLng(initObj.northEastBound[0], initObj.northEastBound[1])
        bounds = L.latLngBounds(southWest, northEast);

        MAX_BOUNDS = bounds;
        MAP.fitBounds(bounds);

        L.mapbox.accessToken = ACCESS_TOKEN;

        BASE = L.mapbox.tileLayerCordova('https://api.tiles.mapbox.com/v4/' + MAP_ID + '/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            folder: FOLDER_NAME,
            name: MAP_NAME,
            debug: true
        }, function () {
            updateStatus();
        });

        BASE.addTo(MAP);

        //Add GeoJSON fearture.
        L.mapbox.featureLayer(initGeoJSON).addTo(MAP);

        L.control.locate().addTo(MAP);
    } catch (e) {
        alert(e);
    }

    MAP.setView([LAT, LNG], ZOOM);
    MAP.setMaxBounds(bounds);

}

//Use a fixed position readed from qrcode, to adjust the coord readed by the geolocation API
//It's for make a better 
function addGeoJSONMarker(lat, lng, additionalData) {
    var finalLat, finalLng, userLat, userLng;

    if (navigator.geolocation) {
        var fixedPosition = L.latLng(lat, lng);

        var userPosition = undefined;

        navigator.geolocation.getCurrentPosition(function (position) {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            userPosition = L.latLng(userLat, userLng);

            var distance = (fixedPosition.distanceTo(userPosition)).toFixed(0);

            if (distance <= 3) {
                finalLat = userLat;
                finalLng = userLng;
            } else if (distance > 3) {
                finalLat = lat;
                finalLng = lng;
            }
            addMarker(finalLat, finalLng, additionalData);

        }, function (error) {
            if (error.code == 1) {
                navigator.notification.alert("L'utente ha negato la geolocalizzazione. Per localizzare la posizione saranno usate le coordinate del checkpoint.", function () {}, "Info", "Chiudi");
            } else if (error.code == 2) {
                navigator.notification.alert("Posizione non disponibile. Per localizzare la posizione saranno usate le coordinate del checkpoint.", function () {}, "Info", "Chiudi");
            } else if (error.code == 3) {
                navigator.notification.alert("Non è stato possibile acquisire la posizione nel tempo previsto. Per localizzare la posizione saranno usate le coordinate del checkpoint.", function () {}, "Info", "Chiudi");
            } else {
                navigator.notification.alert("Generic Error:" + error.message + ". Per localizzare la posizione saranno usate le coordinate del checkpoint.", function () {}, "Info", "Chiudi");
            }
            addMarker(lat, lng, additionalData);

        }, {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        });

    } else {
        addMarker(lat, lng, additionalData);
    }
}

function addMarker(lat, lng, additionalJSONData) {
    var checkpoint = {
        "type": "Feature",
        "properties": {
            "type": "Checkpoint",
            "title": additionalJSONData.title,
            "description": additionalJSONData.description,
            "directions": additionalJSONData.directions,
            "directionsImg": additionalJSONData.directionsImg,
            "marker-size": "medium",
            "marker-color": "#a3e46b",
            "marker-symbol": "embassy"
        },
        "geometry": {
            "coordinates": [
                lng,
                lat
            ],
            "type": "Point"
        }

    };

    //Add GeoJSON fearture.
    var featureLayer = L.mapbox.featureLayer(checkpoint).addTo(MAP);

    var content = '<div >' +
        '<h1>' + featureLayer.getGeoJSON().properties.title + '</h1>' +
        '<div>' +
        '<h3>Descrizione</h3>' +
        featureLayer.getGeoJSON().properties.description +
        '</div>' +
        '<div>' +
        '<h3>Direzione</h3>' +
        featureLayer.getGeoJSON().properties.directions +
        '<img src="' + featureLayer.getGeoJSON().properties.directionsImg + '" class="popup_img"/>' +
        '</div>'
    '</div>';
    featureLayer.bindPopup(content, {
        closeButton: true,
        minWidth: 280
    });

}

function updateStatus() {
    var status_text = "";
    var cache_text = "";

    if (BASE.isOnline()) {
        status_text = "ONLINE";
    } else if (BASE.isOffline()) {
        status_text = "OFFLINE";
    }

    BASE.getCacheContents(function (cache) {
        if (cache != "" && cache != undefined) {
            cache_text = "CACHED";
        } else {
            cache_text = "NOT CACHED";
        }

        var element = angular.element(document.querySelector('ion-footer-bar'));

        if (status_text == "ONLINE") {
            element.removeClass('bar-assertive');
            element.removeClass('bar-energized');
            element.addClass('bar-balanced');
        } else if (status_text == "OFFLINE" && cache_text == "CACHED") {
            element.removeClass('bar-assertive');
            element.removeClass('bar-balanced');
            element.addClass('bar-energized');
        } else if (status_text == "OFFLINE" && cache_text == "NOT CACHED") {
            element.removeClass('bar-balanced');
            element.removeClass('bar-energized');
            element.addClass('bar-assertive');
        }

        document.getElementById('status_title').innerHTML = status_text + " " + cache_text;


    });


}

function cachingBounds() {
    var zmin = MAP.getZoom();
    var zmax = CACHE_ZOOM_MAX;
    var tile_list = BASE.calculateXYZListFromBounds(MAX_BOUNDS, zmin, zmax);

    var message = "Inizio la procedura di caching dei tiles.\n" + "Zoom level " + zmin + " through " + zmax + "\n" + tile_list.length + " tiles totali.";
    var ok = navigator.notification.confirm(message,
                                            function (buttonIndex) {
        if (buttonIndex == 1) {
            caching('bounds', tile_list);
        } else {
            return false;
        }
    },
                                            "Info", ["OK", "Annulla"]);
}

function caching(which, tile_list) {
    var zmin = MAP.getZoom();
    var zmax = CACHE_ZOOM_MAX;

    var status_block = document.getElementById('status');
    BASE.downloadXYZList(
        // 1st param: a list of XYZ objects indicating tiles to download
        tile_list,
        // 2nd param: overwrite existing tiles on disk? if no then a tile already on disk will be kept, which can be a big time saver
        false,
        // 3rd param: progress callback
        // receives the number of tiles downloaded and the number of tiles total; caller can calculate a percentage, update progress bar, etc.
        function (done, total) {
            var percent = Math.round(100 * done / total);
            status_block.innerHTML = "CACHING: " + done + " / " + total + " = " + percent + "%";
        },
        // 4th param: complete callback
        // no parameters are given, but we know we're done!
        function () {
            // for this demo, on success we use another L.TileLayer.Cordova feature and show the disk usage
            //testUsage();
            updateStatus();
        },
        // 5th param: error callback
        // parameter is the error message string
        function (error) {
            navigator.notification.alert("Errore durante il savataggio:"+error.code, function () {}, "Info", "Chiudi");
        }
    );
}

function mapWorkOffline() {
    BASE.goOffline();
    updateStatus();
}

function mapWorkOnline() {
    BASE.goOnline();
    updateStatus();
}

function testEmpty() {
    BASE.emptyCache(function (oks, fails) {
        var message = "Cleared cache.\n" + oks + " deleted OK\n" + fails + " failed";
        alert(message);
        testUsage();
    })
}
