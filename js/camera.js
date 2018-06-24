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
//0:横,1:縦
const Orientation_Landscape = 0;
const Orientation_Portrait = 1;

const Dir_Front = 0;
const Dir_Rear = 1;
var dir = Dir_Rear;

setCamera();

let timer;
let isCapturing = false;

video.addEventListener("loadedmetadata",(e) => {
    adjustDisplay();
    isCapturing = true;
    timer = setInterval(()=>{
        startCapture();
    },33);
});

$("#torear").hide();

$("#tofront").on("click",()=>{
    clearInterval(timer);
    dir = Dir_Front;
    setCamera();
    $("#tofront").hide();
    $("#torear").show();
});

$("#torear").on("click",()=>{
    clearInterval(timer);
    dir = Dir_Rear;
    setCamera();
    $("#torear").hide();
    $("#tofront").show();
});


$("#shutter").on("click",(e) => {
    isCapturing = false;
    clearInterval(timer);
    $("#controls").hide();
});

canvas.addEventListener("click",(e) => {
    if(!isCapturing){
        $("#controls").show();
        isCapturing = true;
        timer = setInterval(()=>{
            startCapture();
        },33);
        $("#controls").show();
    }
});

window.addEventListener("orientationchange",(e) => {
    if(isCapturing){
        setTimeout(()=>{
            clearInterval(timer);
            setCamera();
            adjustDisplay();
            drawTomoko();
        },100);
    }
});

function getOrientation(){
    return (window.innerWidth > window.innerHeight) ? Orientation_Landscape : Orientation_Portrait;
}

function setCamera(){

    let ort = getOrientation();
    let aspectRatio;
    if(ort == Orientation_Landscape){
        aspectRatio = window.innerWidth / window.innerHeight;
    }else{
        aspectRatio = window.innerHeight / window.innerWidth;
    }

    let constraints = {
        video: {
            facingMode : (dir == Dir_Rear) ? "environment" : "user",
            width: (dir == Dir_Rear) ? 4000 : {min: 960, ideal: 1280,max: 1980}, //目指せ4K画質
            aspectRatio: aspectRatio
        },
        audio: false
    };
    if(dir == Dir_Rear){}
    constraints.video.width
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
    }).catch((err) => {
        alert("カメラが使えないよ\n" + err.name + ":" + err.message);
        return;
    });
}

function adjustDisplay(){
    var ratio = window.innerWidth / video.videoWidth;
    video.width = window.innerWidth;
    video.height = video.videoHeight * ratio;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

function startCapture(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video,0,0,canvas.width,canvas.height);
    drawTomoko();
}

function drawTomoko(){
    let ort = getOrientation();
    let ratio = ort == Orientation_Landscape ? 3 : 2;
    tomokoWidth = canvas.width / ratio;
    tomokoHeight = tomokoWidth * tomokoRatio;
    context.drawImage(tomoko,canvas.width - tomokoWidth - 10,canvas.height - tomokoHeight,tomokoWidth,tomokoHeight);
}
