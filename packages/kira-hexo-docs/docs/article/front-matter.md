# Front Matter

## 关于 Front Matter

在 Hexo 中，Front Matter 就是文章最上方使用 `---` 隔开的区域，用于声明单个文件的变量，比如：

```markdown
---
title: 这是一篇文章
date: 2022/09/04 21:14:56 
---
```

关于 Front Matter 的更多信息可以参考 Hexo 的[官方文档](https://hexo.io/zh-cn/docs/front-matter)。

## 扩展 Front Matter

在 Kira-Hexo 当中，我们也为各位保留了如下几个 Front Matter 用于对文章进行部分定制：
| 参数 | 默认值 | 描述 |
| --- | --- | --- |
| cover | theme.background.path | 文章封面 |
| reprinted | false | 是否为转载文章（转载文章不会标记版权信息） |