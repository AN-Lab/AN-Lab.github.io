var editor;
var username = getCookie("username");

$(function () {
  var height = document.documentElement.clientHeight - 50; //编辑器和左侧目录的高度

  $("#catalog-container").css("height", height + "px");

  var catalog = document.getElementsByClassName("catalog-author");
  for (var i = 0; i < catalog.length; i++){
    if (catalog[i].innerHTML != username){
      catalog[i].parentNode.remove();
    }
  }
  $(".catalog.hidden").attr("class","catalog");

  editor = editormd("editor", {
    placeholder: '本编辑器支持Markdown编辑，左边编写，右边预览',  //默认显示的文字
    width: "100%",
    height: height - 2,
    theme: "light",//工具栏主题
    previewTheme: "light",//预览主题
    editorTheme: "xq-light",//编辑主题
    emoji: false,
    //markdown: "",     // dynamic set Markdown text
    path: "editor.md/lib/",  // Autoload modules mode, codemirror, marked... dependents libs path
    tocm: true,         // Using [TOCM]
    tex: true,                   // 开启科学公式TeX语言支持，默认关闭
    flowChart: true,             // 开启流程图支持，默认关闭
    sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
    toolbarIcons: function () {  //自定义工具栏，后面有详细介绍
      //return editormd.toolbarModes['full']; // full, simple, mini 三种默认模式
      return ["undo", "redo", "|", "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|", "h1", "h2", "h3", "h4", "h5", "h6", "|", "list-ul", "list-ol", "hr", "|", "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "pagebreak", "|", "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|", "help"]; //自定义工具栏
    }
  });

  //加载头像
  var avatar_url = getCookie("avatar");
  if (avatar_url != "" && avatar_url != null) {
    $("#avatar-container img").attr("src", avatar_url);
  }

  // $("input.tag").bind('input propertychange',function(){
  //   $(this).width(getTagWidth($(this).val()));
  // });

  // $(".tag-box .deleteButton").click(function(){
  //   alert("sa");
  //   $(this).remove;
  // })
  changeDot();
})

function openDetails() {
  $("#details").css("display", "block");
}

function closeDetails() {
  $("#details").css("display", "none");
}

function getMd() {
  console.log(editor.getMarkdown());
}

function insertText() {
  editor.insertValue("(这是插入的一段文字)");
}

//发布文章
function submit() {
  $("#wait_box1").css("display","block");
  var title = $("#title").val();
  var content = editor.getMarkdown();
  var tag_box = document.getElementsByClassName("tag");
  var tags = new Array(tag_box.length);
  for (let i = 0; i < tag_box.length; i++) {
    tags[i] = tag_box[i].value;
  }
  var category = $("#category-container option:selected").val();
  console.log("title:" + title + "\ncontent:\n" + content + "\ntags:" + tags + "\ncategory:" + category);
  creatFile(title,category,content,username,tags);
}

//获取cookie信息
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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

//获取字符串在前端中的宽度
function getTagWidth(text) {
  var sensor = $("<pre>" + text + "</pre>").css({ display: 'none' });
  $('body').append(sensor);
  var width = sensor.width();
  sensor.remove();
  return width;
}

//在location元素前方添加标签,并绑定事件
function addTag(location) {
  var tagBox = $("input.tag");
  if (tagBox.length != 0 && $("input.tag").eq(tagBox.length - 1).val() == "") return;
  if (tagBox.length >= 5) {
    alert("当前标签数量已达上限！");
    return;
  }
  $(location).before("<div class='tag-box'><input type='text' class='tag' onblur='checkTag()'><div class='delete-button'>&times</div></div>");
  $("input.tag:last").focus();
  $("input.tag").bind('input propertychange', function () {
    $(this).width(getTagWidth($(this).val())+3);
  });
  $(".tag-box .delete-button").click(function () {
    $(this).parent().remove();
  })
}

//删除标签
function deleteTag(thisTag) {
  thisTag.remove;
}

//检查当前标签是否存在重复或空标签，若存在则删除其中靠后的一个标签
function checkTag() {
  var tags = document.getElementsByClassName("tag");
  for (let i = 0; i < tags.length; i++){
    if (tags[i].value == ""){
      tags[i].parentNode.remove();
      return;
    }
  }
  for (let i = 0; i < tags.length - 1; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      if (tags[i].value == tags[j].value) {
        tags[j].parentNode.remove();
        return;
      }
    }
  }
}

//动态改变登录提示框中的省略号个数
function changeDot() {
  var s = $("#dot").text();
  if (s != "...") {
    s = s + ".";
  } else {
    s = "";
  }
  $("#dot").text(s);
  setTimeout("changeDot()", 500);
}

//在GitHub库中创建文件
function creatFile(file_name, category, file_content, author, tags) {
  var token = "RXJpY01DUjpNYTFDaGFvMlJhbjM=";

  //获取当前时间并将其格式化：YEAR-MONTH-DAY HH:MM:SS
  var now = new Date();
  var time = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + " " + ("0" + (now.getHours())).slice(-2) + ":" + ("0" + (now.getMinutes())).slice(-2) + ":" + ("0" + (now.getSeconds())).slice(-2);

  //构建格式化的文件名：YEAR-MONTH-DAY-TITLE-AUTHOR.md
  var name = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "-" + file_name + "-" + author + ".md";

  //构建格式化的标签
  var tagsToString = "\ntags:";
  for (let i = 0; i < tags.length; i++) {
    tagsToString += "\n- " + tags[i];
  }

  //将头信息构建并连接进文章内容
  file_content = "---\nlayout: default\ntitle: " + file_name + "\ncategory: " + category + "\nauthor: " + author + "\ndate: " + time + tagsToString + "\n---\n" + file_content;

  //将文件内容转码
  var content = window.btoa(unescape(encodeURIComponent(file_content)));
  console.log("name:" + name);
  console.log("content:\n" + file_content);
  var url = "https://api.github.com/repos/AN-Lab/AN-Lab.github.io/contents/_posts/" + name;
  var json = {
    "message": "new post by " + author,
    "content": content
  }
  $.ajax({
    url: url,
    type: "PUT",
    headers: {
      'Authorization': "Basic " + token
    },
    data: JSON.stringify(json),
    success: function (data) {
      $("#wait_box1 p").html("创建成功！3秒后自动<a href='../knowledge-base/'>跳转</a>至知识库...");
      setTimeout(function () { window.location.href = "../knowledge-base/" }, 3000);
    },
    error: function (err) {
      $("#wait_box1 p").html("创建失败！" + err);
      setTimeout(function () { location.reload() }, 3000);
    }
  })
}

//切换到指定的文章进行编辑
function changePost(file_name){
  var title = file_name.slice(getCharLocation(file_name,"-",3)+1,getCharLocation(file_name,"-",4));
  $(".catalog").attr("class","catalog");
  var a = document.getElementsByClassName("catalog-title");
  for (var i = 0; i < a.length; i++){
    if (a[i].innerHTML == title){
      a[i].parentNode.className = "catalog selected";
    }
  }
  
  console.log(title);
}

//查找一个字符char在字符串str中第n次出现的位置
function getCharLocation(str,char,n){
  var x = -1;
  for (var i = 0; i < n; i++){
    x = str.indexOf(char,x+1);
  }
  return x;
}