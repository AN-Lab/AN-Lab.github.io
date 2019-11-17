---
layout: default
title: Test 3
category: 类别4
author: EricMCR
date: 2019-11-17 17:01:17
tags:
- JS
- Test
---
## Code

```javascript
var avatar_url = getCookie("avatar");
  if (avatar_url != "" && avatar_url != null) {
    $("#avatar-container img").attr("src", avatar_url);
  }
```