//config : model
//api配置数据
module.exports = {
    //查询内容 : text
    q:"",
    //原语种 : text
    from:"",
    //目标语种 : text
    to:"",
    //AppID : text
    appKey:"",
    //随机字符串 : text
    salt:"",
    //签名信息sha256(appKey+input+salt+curtime+密钥) : text
    sign:"",
    //翻译结果音频格式 : text
    ext:"mp3",
    //翻译结果发音选择，0为女声，1为男声 : text
    voice:"0",
    //签名类型 : text
    signType:"v3",
    //当前UTC时间戳 : text
    curtime:""
};