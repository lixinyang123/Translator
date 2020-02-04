
//由于bing壁纸可能存在与文字颜色相似，所以暂时先放弃使用bing壁纸
var $ = require("jquery");

//bing当日图片api
var api = "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";

//获取结果
function getResult(){
    $.ajax({
        url: api,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            getUrl(data);
        } ,
        error:error=>console.log(error)
    });
}

//获取图片url
function getUrl(data){
    var url = "https://cn.bing.com"+data.images[0].url;
    console.log(url);
    document.body.style.backgroundImage = "url('"+url+"')";
}

getResult();