$(()=>{

    let video = document.getElementById('display');
    let videoRatio;
    let canvas = document.getElementById('overlay');
    let context = canvas.getContext('2d');

    let tomoko = new Image();
    let tomokoWidth;
    let tomokoHeight;
    let tomokoX;
    let tomokoY;
    let tomokoRatio;
    tomoko.src = "./image/tomoko.png?" + new Date().getTime();
    tomoko.onload = () => {
        tomokoRatio = tomoko.height / tomoko.width;
        tomokoWidth = tomoko.width;
        tomokoHeight = tomoko.height;
        adjustTomoko();
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
        adjustTomoko();
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
        $(".control").hide();

        var img = canvas.toDataURL('image/png');
        
        var date = new Date();
        var year_str = date.getFullYear();
        var month_str = 1 + date.getMonth();
        var day_str = date.getDate();
        var hour_str = date.getHours();
        var minute_str = date.getMinutes();
        var second_str = date.getSeconds();
        
        month_str = ('0' + month_str).slice(-2);
        day_str = ('0' + day_str).slice(-2);
        hour_str = ('0' + hour_str).slice(-2);
        minute_str = ('0' + minute_str).slice(-2);
        second_str = ('0' + second_str).slice(-2);
        
        format_str = 'YYYYMMDD-hhmmss';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);
        format_str = format_str.replace(/hh/g, hour_str);
        format_str = format_str.replace(/mm/g, minute_str);
        format_str = format_str.replace(/ss/g, second_str);

        download(img,format_str + ".png");
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
        tomoko.src = "./image/" + src + ".png?" + new Date().getTime();
        $("#sidemenu").removeClass("show");
        $("#menucover").hide();
    });

    canvas.addEventListener("click",(e) => {
        if(!isCapturing){
            $(".control").show();
            isCapturing = true;
            timer = setInterval(()=>{
                startCapture();
            },33);
            $(".control").show();
        }
    });

    let dragging = false;
    let x;
    let y;
    let relX;
    let relY
    canvas.addEventListener("touchstart",(e) => {

        if(!isCapturing){return;}

        // キャンバスの左上端の座標を取得
        var offsetX = canvas.getBoundingClientRect().left;
        var offsetY = canvas.getBoundingClientRect().top;

        // マウスが押された座標を取得
        x = (e.changedTouches[0].clientX - offsetX) / videoRatio;
        y = (e.changedTouches[0].clientY - offsetY) / videoRatio;

        // オブジェクト上の座標かどうかを判定
        if (tomokoX < x && (tomokoX + tomokoWidth) > x && tomokoY < y && (tomokoY + tomokoHeight) > y) {
            dragging = true; // ドラッグ開始
            relX = tomokoX - x;
            relY = tomokoY - y;
        }

    });

    canvas.addEventListener("touchmove",(e) => {

        e.preventDefault();

        // キャンバスの左上端の座標を取得
        var offsetX = canvas.getBoundingClientRect().left;
        var offsetY = canvas.getBoundingClientRect().top;
      
        // マウスが移動した先の座標を取得
        x = (e.changedTouches[0].clientX - offsetX) / videoRatio;
        y = (e.changedTouches[0].clientY - offsetY) / videoRatio;
      
        // ドラッグが開始されていればオブジェクトの座標を更新して再描画
        if (dragging) {
          tomokoX = x + relX;
          tomokoY = y + relY;
        }
    });
      
    canvas.addEventListener("touchend",(e) => {
        dragging = false; // ドラッグ終了
    });

    window.addEventListener("orientationchange",(e) => {
        if(isCapturing){
            setTimeout(()=>{
                clearInterval(timer);
                setCamera();
                adjustDisplay();
                adjustControls();
                adjustTomoko();
                drawTomoko();
            },300);
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
        videoRatio = window.innerWidth / video.videoWidth;
        video.width = window.innerWidth;
        video.height = video.videoHeight * videoRatio;
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
        $("#wrapper").find("button").css({
            "width": w + "px",
            "height": h + "px"
        });
    }

    function startCapture(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video,0,0,canvas.width,canvas.height);
        drawTomoko();
    }

    function adjustTomoko(){
        let ort = getOrientation();
        let ratio = ort == Orientation_Landscape ? 3 : 2;
        tomokoWidth = canvas.width / ratio;
        tomokoHeight = tomokoWidth * tomokoRatio;
        tomokoX = canvas.width - tomokoWidth - 10;
        tomokoY = canvas.height - tomokoHeight;
    }

    function drawTomoko(){
        context.drawImage(tomoko,tomokoX,tomokoY,tomokoWidth,tomokoHeight);
    }

    function download(blob, filename) {
        const objectURL = window.URL.createObjectURL(blob),
            a = document.createElement('a'),
            e = document.createEvent('MouseEvent');
      
        //a要素のdownload属性にファイル名を設定
        a.download = filename;
        a.href = objectURL;
      
        //clickイベントを着火
        e.initEvent("click", true, true);
        a.dispatchEvent(e);
      }

});