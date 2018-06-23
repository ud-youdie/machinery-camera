let video = document.getElementById('display');
let canvas = document.getElementById('overlay');
let context = canvas.getContext('2d');

let tomoko = new Image();
tomoko.src = "./image/tomoko.png?" + new Date().getTime();
let tomokoWidth;
let tomokoHeight;
let tomokoRatio;
tomoko.onload = () => {
    tomokoRatio = tomoko.width / tomoko.height;
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

let timer;
let isCapturing = false;
video.addEventListener("loadedmetadata",(e) => {

    adjustDisplay();
    isCapturing = true;
    timer = setInterval(()=>{
        startCapture();
    },33);
});

function startCapture(){
    //videoタグの描画をコンテキストに描画
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video,0,0,canvas.width,canvas.height);
    drawTomoko();
}

function drawTomoko(){
    tomokoHeight = canvas.height * 0.7;
    tomokoWidth = tomokoHeight * tomokoRatio;
    context.drawImage(tomoko,canvas.width - tomokoWidth - 10,canvas.height - tomokoHeight,tomokoWidth,tomokoHeight);
}

canvas.addEventListener("click",(e) => {

    if(isCapturing){
        isCapturing = false;
        clearInterval(timer);
    }else{
        isCapturing = true;
        timer = setInterval(()=>{
            startCapture();
        },33);
    }

});

window.addEventListener("resize",(e) => {
    adjustDisplay();
    drawTomoko();
});