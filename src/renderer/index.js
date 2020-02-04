
var $ = require("jquery");
var config = require("../model/config");
var ipc = require('electron').ipcRenderer;
var timer,player;

//程序初始化
window.onload = function(){
    timer = undefined;
    player = document.getElementById("player");
    initClipboard();
}

function initClipboard(){
    var clipboard = new ClipboardJS('.copy');
    clipboard.on('success', ()=>{
        alert("复制成功");
    });
}

//生成guid（api需求参数）
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

//生成input参数 （api需求参数）
function getInput(q){
    if(q.length > 20){
        var front = q.substring(0,10);
        var behind = q.substring( q.length-10,q.length);
        return front+q.length+behind;
    }
    else{
        return q;
    }
}

//生成sign参数（api需求参数）
function getSign(){
    var secretKey = "z8c9jbN9hG3fNK0T2lokQMrqW9Z6CsJU";
    var signStr = config.appKey + getInput(config.q) + config.salt + config.curtime + secretKey;
    return require("js-sha256").sha256(signStr);
}

//初始化api基本参数
function initConfiig(){
    config.q = document.getElementById("q").value;
    config.from = document.getElementById("from").value;
    config.to = document.getElementById("to").value;
    config.appKey = "06d45f7b4c5c73d3";
    config.salt = guid();
    config.curtime = Math.round(new Date().getTime()/1000);
    config.sign = getSign();
}

//请求api
function getResult(){
    $.ajax({
        url: 'http://openapi.youdao.com/api',
        type: 'post',
        dataType: 'json',
        data: config,
        success: function (data) {
            console.log(data);
            showData(data);
        } ,
        error:error=>console.log(error)
    });
}

//展示数据
function showData(data){

    //查询单词 : text
    try {
        document.getElementById("query").innerText = data.query.length<20 ? data.query : data.query.substring(0,10)+"......";
    } catch (error) {}

    //单词读音 : text
    try {
        document.getElementById("querySpeech").onclick = ()=>{
            player.src = data.speakUrl;
    }} catch (error) {}

    //翻译结果 : collection
    try {
        document.getElementById("translation").innerText = "";
        data.translation.forEach(ele => {
            document.getElementById("translation").innerText += ele+" ";
        });
    } catch (error) {}

    //翻译读音 : text
    try {
        document.getElementById("translationSpeech").onclick = ()=>{
            player.src = data.tSpeakUrl;
        }
    } catch (error) {}
    
    //英式音标 : text
    try {
        document.getElementById("ukPhonetic").innerText =  data.basic["uk-phonetic"] == undefined ? "" : "UK："+data.basic["uk-phonetic"];
    } catch (error) {}

    //英式读音 : text
    try {
        var speech = document.getElementById("ukSpeech");

        //无音标则不显示read按钮
        if(document.getElementById("ukPhonetic").innerText != ""){
            speech.removeAttribute("hidden");
            speech.onclick = ()=>{
                player.src = data.basic["uk-speech"];
            }
        }
        else{
            speech.setAttribute("hidden","");
        }
        
    } catch (error) {}

    //美式音标 : text
    try {
        document.getElementById("usPhonetic").innerText = data.basic["us-phonetic"] == undefined ? "" : "US："+data.basic["us-phonetic"];
    } catch (error) {}

    //美式读音 : text
    try {
        var speech = document.getElementById("usSpeech");

        //无音标则不显示read按钮
        if(document.getElementById("usPhonetic").innerText != ""){
            speech.removeAttribute("hidden");
            speech.onclick = ()=>{
                player.src = data.basic["us-speech"];
            }
        }
        else{
            speech.setAttribute("hidden","");
        }
    } catch (error) {}

    //词性 : collection
    try {
        document.getElementById("explains").innerHTML  = "";
        data.basic.explains.forEach(ele=>{
            document.getElementById("explains").innerHTML += ele+"<br/>";
        });
    } catch (error) {}

    //语法 : collection
    try {
        document.getElementById("wfs").innerHTML = "";
        data.basic.wfs.forEach(ele=>{
            document.getElementById("wfs").innerHTML += ele.wf.name+" "+ele.wf.value +"<br/>";
        })
    } catch (error) {}

    //网络释义 : collection (key:text,value:collection)
    try {
        document.getElementById("web").innerHTML = "";
        data.web.forEach(ele=>{
            var values = "";
            ele.value.forEach(value=>{
                values += value + "  ";
            });
            document.getElementById("web").innerHTML += ele.key +"<br/>" + values + "<br/>";
        });
    } catch (error) {}

}

//确认api所需的基本数据
function comfire(){
    //初始化api参数
    initConfiig();
    getResult();
}

//验证用户翻译内容是否为空
function verifyData(){
    return document.getElementById("q").value.trim()!="";
}

//界面状态改变（有无翻译内容）
function changeState(flag){
    //有翻译内容
    if(flag==true){
        //显示状态文本和详细信息
        document.getElementById("translation").innerText = "翻译中...";
        document.getElementById("detail").removeAttribute("hidden");
    }
    //无翻译内容
    else{
        //清空翻译文本并隐藏详细信息
        document.getElementById("translation").innerText = "";
        document.getElementById("detail").setAttribute("hidden","");
    }
}

//显示或隐藏标准读音
function showStandSpeech(flag){
    var standspeechs = document.getElementsByClassName("standspeech");
    if(flag){
        for(var i=0;i<standspeechs.length;i++){
            standspeechs[i].removeAttribute("hidden");
        }
    }
    else{
        for(var i=0;i<standspeechs.length;i++){
            standspeechs[i].setAttribute("hidden","");
        }
    }
}

//提交查询（用户）
function submit(){
    //清除计时器
    clearTimeout(timer);

    //获取翻译内容并切换状态
    var flag = verifyData();
    changeState(flag);
    showStandSpeech(flag);

    //延迟查询
    if(flag){
        timer = setTimeout(comfire,1000);
    }
    //无查询内容
    else{
        console.log("q is empty");
    }
}

//清空用户输入
function clean(){
    document.getElementById("q").value = "";
    submit();
}

//退出
function exit(){
    ipc.send("window-close");
}

//最小化
function min(){
    ipc.send("window-min");
}

module.exports={
    submit,
    clean,
    exit,
    min
}
