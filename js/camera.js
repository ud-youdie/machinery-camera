let video = document.getElementById('display');
let canvas = document.getElementById('overlay');
let context = canvas.getContext('2d');
let img = new Image();
img.src = "./image/tomoko.png";

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

video.addEventListener("loadedmetadata",function(e) {
    //canvasにカメラの映像のサイズを設定
    var ratio = window.innerWidth / video.videoWidth;
    video.width = window.innerWidth;
    video.height = video.videoHeight * ratio;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    //getContextで描画先を取得
    var ctx = canvas.getContext("2d");
    //毎フレームの実行処理
    setInterval(function(e) {
        //videoタグの描画をコンテキストに描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video,0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0);
    },33);      
});
