---
title: 【VSCODE插件推荐】TODO Highlight
date: 2022-04-09 14:22:07
tags: [VSCODE]
categories: [编程]
cover: https://wayou.gallerycdn.vsassets.io/extensions/wayou/vscode-todo-highlight/1.0.5/1635478170130/Microsoft.VisualStudio.Services.Icons.Default
---

当你在使用 VSCode 编写代码时，突然发现了一个小 bug，但是又不想停下手上的活来解决这个 bug，应该怎么办呢？在这篇文章中，我将为你们推荐一款 VSCode 的插件，帮你在代码中添加醒目的 `TODO` 注释。

<!-- more -->

<!-- toc -->

**插件名称**：TODO Highlight
**插件作者**：Wayou Liu
**下载量**：2,451,400+ （统计于 2022 年 4 月 9 日 14:25:37）

# 基本使用方法

在编写代码时，遇到突然发现的小 bug 时，根据代码编写规范，一般来说应该在代码中加一个 TODO 注释，就像下面这样：

```js
// TODO: 这个地方需要进行修改，我确信我有一种绝妙的写法，可惜这里地方太小，我的代码放不下
```

或者

```js
// FIXME: 这谁写的阴间代码？你牛び啊！
```

但是这些 TODO 标记随着时间和项目的增长，会逐渐散布在项目的每一个角落，而且总是用着模糊不清的描述让开发者摸不着头脑。
今天我就来推荐一款 VSCode 可用的插件——TODO Highlight 。
_安装插件的方法就不用我来介绍了吧_
安装好插件后，来到你的项目代码中，试试看写一段 TODO 标记吧！
![默认样式](https://kira.host/assets/Pictures/Others/20220409143727.png)
这就是 TODO Highlight 的默认样式，它会自动匹配代码中的 `TODO:` 和 `FIXME:` ，并显示不同的颜色。

# 自定义关键字及样式

当然，你也可以通过 settings.json 自行配置该插件。下面我们来尝试修改一下 settings.json 匹配的关键字及样式。
打开 settings.json ，找到 `todohighlight.defaultStyle` 字段，这里是 TODOHighlight 的默认样式定义。我的配置是这样的：

```json
"todohighlight.defaultStyle": {
	"cursor": "pointer",
	"border": "1px solid #eee",
	"borderRadius": "2px",
	"isWholeLine": false
},
```

表示当鼠标指向这些 TODO 标记时，鼠标光标会呈现 `pointer` 的状态，同时为标记外围设置边缘，`isWholeLine` 则是说明高亮提示是否要覆盖一整行。
在设置好默认样式后，我们在 settings.json 中新增一条字段 `todohighlight.keywords` ，它接收一个 json 数组，用来定义插件匹配的关键字。
比如我们将它修改为如下的代码：

```json
"todohighlight.keywords": [
	{
		"text": "TODO:",
		"color": "#000",
		"backgroundColor": "#ffab00",
		"overviewRulerColor": "#ffab00"
	},
	{
		"text": "FIXME:",
		"color": "#fff",
		"backgroundColor": "#f00",
		"overviewRulerColor": "#f00",
		"isWholeLine": true
	},
	{
		"text": "DEBUG:",
		"color": "#000",
		"backgroundColor": "#0f0",
		"overviewRulerColor": "#0f0",
		"isWholeLine": true,
		"fontWeight": "bold"
	},
	{
		"text": "NOTE:",
		"color": "#fff",
		"backgroundColor": "#00a0ff",
		"overviewRulerColor": "#00a0ff",
		"isWholeLine": true
	},
	{
	    "text": "INFO:",
		"color": "#000",
		"backgroundColor": "#a0a0a0",
		"overviewRulerColor": "#a0a0a0"
	}
],
```

每个 json 对应了一种匹配形式。

-   其中 `text` 字段表示需要匹配的具体关键字，这个插件默认只匹配了 `TODO:` 和 `FIXME:` 两条，我们可以通过这个字段新增匹配的关键字，比如最下方的 `DEBUG:`；
-   `color` 字段表示匹配后文本的颜色；
-   `backgroundColor` 字段表示匹配的文本的背景底色；
-   `overviewRulerColor` 字段表示该行在 Vscode 右侧的滚动条上显示的颜色；
-   `isWholeLine` 表示是否覆盖整行；
-   可以根据在 JSX 中书写 css 的格式自行定义样式字段

而在上面这样配置后，你的 VSCode 就会变成这种风格：

```js
// INFO: 这里是示例
// NOTE: 做个笔记
// TODO: 这是个TODO标记
// FIXME: 这里有个 Bug 需要解决
// DEBUG: 下面的代码是调试用的，调试完了记得删除
```

![自定义样式](https://kira.host/assets/Pictures/Others/20220409150024.png)
