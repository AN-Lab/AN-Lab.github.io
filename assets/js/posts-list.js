function onload2(){

}

function getCategory(){
  var url = document.location.toString();//获取url地址
  var urlParmStr = url.slice(url.indexOf('?')+1);//获取问号后所有的字符串
  return urlParmStr;
}