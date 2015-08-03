
function capturePhoto(callback) {
    qrcode.callback = callback;
    //  vsr pictureSource=navigator.camera.PictureSourceType;
   var destinationType=navigator.camera.DestinationType;
   //  qrcode.callback = read;
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL
    });
}

function onFail(message){
    alert(message);
}

function onPhotoDataSuccess(imageData) {
    qrcode.decode("data:image/jpeg;base64," + imageData);
}

function JSQrcodeCallback(qrInput)
{
	alert(qrInput);

    
}	
        
function JSQrcodeInit(){
    qrcode.callback = JSQrcodeCallback;
}