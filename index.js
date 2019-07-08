const constraints = window.constraints = {
    audio: false,
    video: true
};
//将摄像头数据返回给 video 标签进行展示
const handleSuccess = (stream) => {
    const video = document.querySelector('video');
    window.stream = stream;
    video.srcObject = stream;
}

const handleError = (error) => {
    if (error.name === 'ConstraintNotSatisfiedError') {
        let v = constraints.video;
        errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
}

const errorMsg = (msg, error) => {
    console.log(msg)
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}
//打开摄像头
const openVideo = async ()=> {
    try {
        if(navigator.mediaDevices){
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        }else{
           console.log('摄像头启动失败,请换用密码登录')
        }
    } catch (e) {
        handleError(e);
    }
}
//关闭摄像头
const closeDev = ()=>{
    if(window.stream){
        let stream = window.stream;
        let mediaStreamTrack = typeof stream.stop === 'function' ? stream :stream.getTracks()[0]
        mediaStreamTrack && mediaStreamTrack.stop()
    }
    window.__checkTimer && clearInterval(window.__checkTimer);
}
//拍照并返回 base64
const photograph = ()=> {
    const canvas = document.querySelector("canvas");
    const context =canvas ? canvas.getContext("2d"):null;
    const video = document.querySelector('video');
    //把流媒体数据画到convas画布上去
    if(canvas){
        //此处需要根据实际大小进行调整数据
        context.drawImage(video, 0, 0, 470, 300);
        let imgData = canvas.toDataURL();
        //let img = document.querySelector('img');
        //img.src=imgData
        let _imgData = 'base64://'+imgData.split("base64,")[1];//获取图片
        //console.log(imgData)
        //返回 base64
        return _imgData;
    }else{
        return ''
    }
}
