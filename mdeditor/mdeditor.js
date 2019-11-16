var editor;

$(function () {
  var height = document.documentElement.clientHeight - 50; //编辑器和左侧目录的高度

  $("#catalog-container").css("height", height + "px");

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
  var title = $("#title").val();
  var content = editor.getMarkdown();
  var tag_box = document.getElementsByClassName("tag");
  var tags = "";
  for (let i = 0; i < tag_box.length; i++) {
    tags += tag_box[i].value + ", ";
  }
  var category = $("#category-container option:selected");
  console.log("title:" + title + "\ncontent:" + content + "\ntags:" + tags + "\ncategory:" + category);
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
  console.log(tagBox.length + "----" + $("input.tag").eq(tagBox.length - 1).val());
  if (tagBox.length != 0 && $("input.tag").eq(tagBox.length - 1).val() == "") return;
  if (tagBox.length >= 5) {
    alert("当前标签数量已达上限！");
    return;
  }
  $(location).before("<div class='tag-box'><input type='text' class='tag' onblur='checkTagRepe()'><div class='delete-button'>&times</div></div>");
  $("input.tag").bind('input propertychange', function () {
    $(this).width(getTagWidth($(this).val() + 3));
  });
  $(".tag-box .delete-button").click(function () {
    $(this).parent().remove();
  })
}

//删除标签
function deleteTag(thisTag) {
  thisTag.remove;
}

//检查当前标签是否存在重复，若存在则删除其中靠后的一个标签
function checkTagRepe() {
  var tags = document.getElementsByClassName("tag");
  for (let i = 0; i < tags.length - 1; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      if (tags[i].value == tags[j].value) {
        tags[j].parentNode.remove();
        return;
      }
    }
  }
}