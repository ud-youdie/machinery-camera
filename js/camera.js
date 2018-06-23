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
let ort = (window.innerWidth > window.innerHeight) ? Orientation_Landscape : Orientation_Portrait;

setCamera(ort);

let timer;
let isCapturing = false;
video.addEventListener("loadedmetadata",(e) => {

    adjustDisplay();
    isCapturing = true;
    timer = setInterval(()=>{
        startCapture();
    },33);
});

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

window.addEventListener("orientationchange",(e) => {
    /*
    if(isCapturing){
        setCamera();
        adjustDisplay();
        drawTomoko();
    }
    */
   location.reload(false);
});

function setCamera(ort){

    let aspectRatio;
    if(ort == Orientation_Landscape){
        aspectRatio = window.innerWidth / window.innerHeight;
    }else{
        aspectRatio = window.innerHeight / window.innerWidth;
    }

    let constraints = {
        video: {
            facingMode : "environment",
            width: 4000, //目指せ4K画質
            aspectRatio: aspectRatio
        },
        audio: false
    };
    
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
    tomokoWidth = canvas.width / 3;
    tomokoHeight = tomokoWidth * tomokoRatio;
    context.drawImage(tomoko,canvas.width - tomokoWidth - 10,canvas.height - tomokoHeight,tomokoWidth,tomokoHeight);
}

