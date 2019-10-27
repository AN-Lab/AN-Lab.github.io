window.onload=function(){
  var username = getCookie("username");
  if (username != "" && username != null){
   $("#login").css("display","none");
   $("#status_username").html(username);
   $("#login_status").css("display","flex");
 }

  //加载头像
  var avatar_url = getCookie("avatar");
  console.log(avatar_url);
  if (avatar_url != "" && avatar_url != null){
  	$("#avatar_small").attr("src",avatar_url);
  }

  var oldname = getCookie("oldname");
  if (oldname != "" && oldname != null){
  	$("#input_id").val(oldname);
  }

  var oldpw = getCookie("oldpw");
  if (oldpw != "" && oldpw != null){
  	$("#input_password").val(oldpw);
  }

  if (getCookie("remember_status") == "true"){
  	$("#rememberpw").prop("checked",true);
  }

  onload2();
}

//获取cookie信息
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//设置cookie信息
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//显示/关闭 登陆窗口
function openLoginBox(){
 $("#login_box").slideToggle("slow");
 $("#id_warn").css("display","none");
 $("#pw_warn").css("display","none");
 $("#login_warn").css("display","none");
}

//注销(清除用户cookie)
function signOut(){
	setCookie("username",getCookie("username"),-1);
  setCookie("avatar",getCookie("username"),-1);
  location.reload();
}

//检查输入是否合法
function checkInput(){
	//先清除可能存在的上一次失败登陆所显示的错误提示信息
  $("#id_warn").css("display","none");
  $("#pw_warn").css("display","none");
  $("#login_warn").css("display","none");

   //获取输入值
   var userName = $("#input_id").val();
   var password = $("#input_password").val();

   //检查是否存在非法输入,若合法，首先显示等待提示，再通过GitHubAPI进行信息验证
   if (checkIfNull(userName,password)){
     $("#wait_box").css("display","block");
     checkPassword(userName,password);
   }
 }

//检查用户名密码是否正确，正确的话先存储用户信息后，再显示当前用户信息
function checkPassword(userName,password){
	var btoa = window.btoa(userName + ":" + password);//用户信息编码
	$.ajax({
		url: "https://api.github.com/users/"+userName,
		type: "GET",
		headers: {
			'Authorization': "Basic " + btoa
		},
          //登录成功
          success: function (data) {
            var json = JSON.stringify(data);
            var obj = eval ("(" + json + ")");
            setCookie("username",userName,7);
            setCookie("avatar",obj.avatar_url,7);
            setCookie("oldname",userName,30);
            if ($("#rememberpw").prop("checked")){
              setCookie("oldpw",password,7);
              setCookie("remember_status","true",7);
            }else{
              setCookie("oldpw",password,-1);
              setCookie("remember_status","false",7);
            }
            $("#wait_box").css("display","none");
            $("#login_box").css("display","none");
            $("#login").css("display","none");
            $("#avatar_small").attr("src",obj.avatar_url);
            $("#status_username").html(userName);
            $("#login_status").css("display","flex");
          },

          //登录失败
          error: function (err) {
            $("#wait_box").css("display","none");
            $("#login_warn").css("display","block");
          }

        })
}

//检查输入账号和密码是否为空,返回true-正确、false-存在空
function checkIfNull(userName,password){
  if (userName.length == 0){
   $("#id_warn").css("display","block");
   return false;
 }else if (password.length == 0){
   $("#pw_warn").css("display","block");
   return false;
 }else{
   return true;
 }
}