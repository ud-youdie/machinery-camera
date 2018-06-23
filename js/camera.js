let localVideo = document.getElementById('display');
let localStream;

// start local video
function startVideo() {
navigator.mediaDevices.getUserMedia({video: true, audio: false})
.then(function (stream) { // success
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(localStream);
}).catch(function (error) { // error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});
}