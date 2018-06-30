$(()=>{

    let video = document.getElementById('display');
    let canvas = document.getElementById('overlay');
    let context = canvas.getContext('2d');

    let tomoko = new Image();
    let tomokoWidth;
    let tomokoHeight;
    let tomokoRatio;
    tomoko.src = "./image/tomoko.png?" + new Date().getTime();
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

    let timer;
    let isCapturing = false;

    setCamera();
    adjustControls();

    video.addEventListener("loadedmetadata",(e) => {
        adjustDisplay();
        isCapturing = true;
        timer = setInterval(()=>{
            startCapture();
        },33);
    });

    $("#torear").hide();
    $("#tofront").hide(); //☆機能停止中

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

    $("#menucover").hide();

    $("#menu").on("click",()=>{
        $("#menucover").show();
        $("#sidemenu").addClass("show");
    });

    $("#menucover").on("click",()=>{
        $("#sidemenu").removeClass("show");
        $("#menucover").hide();
    })

    $("#sidemenu").find("li").on("click",(e)=>{

        let src = $(e.currentTarget).attr("id");
        tomoko = new Image();
        tomoko.src = "./image/" + src + ".png?" + new Date().getTime();
        tomoko.onload = () => {
            tomokoRatio = tomoko.height / tomoko.width;
            tomokoWidth = tomoko.width;
            tomokoHeight = tomoko.height;
            drawTomoko();
        }
        $("#sidemenu").removeClass("show");
        $("#menucover").hide();
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
                adjustControls();
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

    function adjustControls(){
        let ort = getOrientation();
        let w;
        let h;
        if(ort == Orientation_Landscape){
            h = window.innerHeight * 0.15;
            w = h;
            $("#shutter").css({
                "bottom": (window.innerHeight / 2) - (h/ 2),
                "left": "15px"
            });
        }else{
            w = window.innerWidth * 0.15;
            h = w;
            $("#shutter").css({
                "bottom": "15px",
                "left": (window.innerWidth / 2) - (w/ 2)
            });
        }
        $("#controls").find("button").css({
            "width": w + "px",
            "height": h + "px"
        });
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

});