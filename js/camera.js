let video = document.getElementById('display');
let canvas = document.getElementById('overlay');
let context = canvas.getContext('2d');

let tomoko = new Image();
tomoko.src = "./image/tomoko.png?" + new Date().getTime();
let tomokoWidth;
let tomokoHeight;
let tomokoRatio;
tomoko.onload = () => {
    tomokoRatio = tomoko.height / tomoko.width;
    tomokoWidth = tomoko.width;
    tomokoHeight = tomoko.height;
}

var constraints = {
    video: {
        facingMode : {exact:"environment"}
    },
    audio: false
};

navigator.mediaDevices.getUserMedia(constraints)
.then(function (stream) { // success
    video.src = window.URL.createObjectURL(stream);
}).catch(function (error) { // error
    alert("カメラが使えないよ");
    return;
});

function adjustDisplay(){
    //canvasにカメラの映像のサイズを設定
    var ratio = window.innerWidth / video.videoWidth;
    video.width = window.innerWidth;
    video.height = video.videoHeight * ratio;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

video.addEventListener("loadedmetadata",function(e) {

    adjustDisplay();

    setInterval(function(e) {
        //videoタグの描画をコンテキストに描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video,0,0,canvas.width,canvas.height);

        tomokoWidth = canvas.width / 4;
        tomokoHeight = tomokoWidth * tomokoRatio;
        context.drawImage(tomoko,canvas.width - tomokoWidth - 20,canvas.height - tomokoHeight,tomokoWidth,tomokoHeight);
        },33);      
});