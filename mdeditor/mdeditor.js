$(function () {
  var height = document.documentElement.clientHeight - 50; //编辑器和左侧目录的高度

  $("#catalog-container").css("height", height + "px");

  var editor = editormd("editor", {
    placeholder: '本编辑器支持Markdown编辑，左边编写，右边预览',  //默认显示的文字
    width: "100%",
    height: height - 2,
    theme: "light",//工具栏主题
    previewTheme: "light",//预览主题
    editorTheme: "solarized",//编辑主题
    emoji: false,
    //markdown: "",     // dynamic set Markdown text
    path: "editor.md/lib/",  // Autoload modules mode, codemirror, marked... dependents libs path
    tocm: true,         // Using [TOCM]
    tex: true,                   // 开启科学公式TeX语言支持，默认关闭
    flowChart: true,             // 开启流程图支持，默认关闭
    sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
    toolbarIcons: function () {  //自定义工具栏，后面有详细介绍
      //return editormd.toolbarModes['full']; // full, simple, mini 三种默认模式
      return ["undo", "redo", "|", "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|", "h1", "h2", "h3", "h4", "h5", "h6", "|", "list-ul", "list-ol", "hr", "|", "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "pagebreak", "|", "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|", "help", "info"]; //自定义工具栏
    }
  });

  //加载头像
  var avatar_url = getCookie("avatar");
  if (avatar_url != "" && avatar_url != null) {
    $("#avatar-container img").attr("src", avatar_url);
  }
})

function getMd() {
  console.log(editor.getMarkdown());
}

function insertText() {
  editor.insertValue("(这是插入的一段文字)");
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