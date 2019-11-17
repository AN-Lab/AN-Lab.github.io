---
layout: default
title: Test 2
category: 类别2
author: EricMCR
date: 2019-11-17 16:48:45
tags:
- JS
- GitHub
---
```javascript
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
```