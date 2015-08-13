
function capturePhoto(callback) {
    qrcode.callback = callback;
   
    var destinationType = navigator.camera.DestinationType;
   
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL
    });
}

function onFail(message) {
     navigator.notification.alert("Errore durante la scansione:" + message + ". ", function () {}, "Error", "Chiudi");
}

function onPhotoDataSuccess(imageData) {
    qrcode.decode("data:image/jpeg;base64," + imageData);
}