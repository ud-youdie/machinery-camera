let localVideo = document.getElementById('display');
let localStream;

// start local video
function startVideo() {
    var medias = {video: true, audio: false};
    medias.video.facingMode = {exact:"environment"};
    navigator.mediaDevices.getUserMedia(medias)
    .then(function (stream) { // success
        localStream = stream;
        localVideo.src = window.URL.createObjectURL(localStream);
    }).catch(function (error) { // error
        alert("カメラが使えないよ");
        return;
    });
}

startVideo();