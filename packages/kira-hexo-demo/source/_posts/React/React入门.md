---
title: React入门
date: 2022-01-01 13:55:41
tags: [React, JavaScript]
categories: [编程]
cover: https://tse1-mm.cn.bing.net/th/id/R-C.bc71c1c1c50551a1d65e7b529ea29d08?rik=EU42gCFH4J%2bBZA&riu=http%3a%2f%2fwww.goodworklabs.com%2fwp-content%2fuploads%2f2016%2f10%2freactjs.png&ehk=qvQ5EVoUnJZ7k5L347zsU3f87YTckr1iQBzKdwXJd0w%3d&risl=&pid=ImgRaw&r=0
---

最近想开个新坑了，决定出个 React 专题。

<!-- more -->

React 作为现在前端最热门的框架之一，其设计思想极其独特，今天就让我们来对 React 进行一个初步的认识吧。

> 安装什么的我就不教了哈……

<!-- toc -->

# ReactDOM.render()

ReactDOM.render 是 ReactDOM 中最基本的方法，用于将模板转化为 HTML 语言，并将其插入指定的节点。

```js
ReactDOM.render(<h1>Hello, React!</h1>, document.getElementById('root'));
```

上面这段代码将一个 `<h1>` 标签插入了 id 值为 root 的节点。

# JSX 语法

在上面的代码中，我们在 JavaScript 代码中书写了 HTML 语言，这种写法叫做 JSX，是一种允许在 JavaScript 中书写 HTML 的语法。同时也支持在 HTML 模板中再混合上 JavaScript 语法。

```js
const items = ['苹果', '梨子', '香蕉'];
ReactDOM.render(
	<div>
		{items.map((item) => (
			<div>水果：{item}</div>
		))}
	</div>,
	document.getElementById('root')
);
```

其具体呈现为：

<div style="width: 100%; background-color: #eaeaea; padding: 1rem; font-size: 1rem;">
    <div>
        <div>水果：苹果</div>
        <div>水果：梨子</div>
        <div>水果：香蕉</div>
    </div>
</div>

## 为什么使用 JSX

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。
因此，React 没有采用**标记与逻辑进行分离至不同文件**的做法，而是将二者结合放进所谓的“**组件**”的松散耦合单元中。

## JSX 嵌入表达式

在之前的例子中，我们在 JSX 中写了一个`map`函数循环生成`<div>`元素，在这段 JS 代码外部，我们用大括号将其包裹了起来，我们的表达式就写在这样的大括号内部。
像上面写的函数表达式也能放进去、已定义好的变量、三元表达式等也能放进去，理论上你能在里面放置一切有效的表达式，并将表达式的结果嵌入至 DOM 中。

## JSX 也是一个表达式

JSX 也是一个表达式，这意味着，像下面这样的写法也是被允许的：

```js
function User(name) {
	return <h1>你好，我的名字是{name}</h1>;
}

ReactDOM.render(
	<div>
		<h1>初次见面</h1>
		{User('德布罗煜')}
	</div>,
	document.getElementById('root')
);
```

它将被渲染成：

<div style="width: 100%; background-color: #eaeaea; padding: 1rem; font-size: 1rem;">
    <div>
        <h1>初次见面</h1>
        <h1>你好，我的名字是德布罗煜</h1>
    </div>
</div>

## JSX 中指定属性

在 JSX 中，可以用引号为属性指定字符串字面量的值：

```js
const element = <a href='https://baidu.com'>百度一下</a>;
```

也可以使用大括号，为属性值赋值为 JavaScript 表达式的结果：

```js
const element = <img src={state.imgUrl} />;
```

# 元素渲染

> 元素是构成 React 应用的最小砖块

与传统的浏览器 DOM 不同，React 元素是创建开销极小的普通对象，由 ReactDOM 负责更新 DOM，来与 React 元素保持一致。

> 组件由元素构成

一般情况下，标准的 React 页面文件内部长这样：

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<!-- 设置网站标签栏上的偏爱图标，%PUBLIC_URL%指的是public路径 -->
		<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
		<!-- 移动端适配视口 -->
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!-- 在部分安卓手机浏览器的搜索栏的背景颜色主题，兼容性比较差，这段代码可要可不要 -->
		<meta name="theme-color" content="#000000" />
		<!-- SEO中TKD中的D，页面描述 -->
		<meta name="description" content="Web site created using create-react-app" />
		<!-- 在苹果手机中，将页面链接创建到手机屏幕，显示的那个图标，只有苹果手机中有 -->
		<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
		<!-- 页面套壳，安卓壳，IOS壳的配置文件 -->
		<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
		<title>React App</title>
	</head>
	<body>
		<!-- 在不支持JS脚本的浏览器或者禁用JS脚本的浏览器，肯定运行不了JS，name就运行这个标签里面的内容 -->
		<noscript>You need to enable JavaScript to run this app.</noscript>
		<div id="root"></div>
	</body>
</html>
```

在这里我们只需要关注 `<div id="root"></div>`这个节点即可，它被称为“根” DOM 节点，我们将通过 ReactDOM 管理其中的所有内容。
一般来说，我们仅使用 React 构建具有唯一根节点的应用。但不代表我们只能构建单一根节点，你也可以选择在你的应用中包含任意多个独立的根节点。
想要将一个 React 元素渲染至根节点，我们只需要使用**ReactDOM.render()**，就像我们之前做的那样。

React 元素是**不可变对象**，一旦创建，我们将无法改变其子元素或属性。一个已经创建的 React 元素就像是游戏中的某一帧——它仅代表了某个时刻的 UI。
要想更新 UI ，我们的唯一做法是创建一个新的元素，并将其传入**ReactDOM.render()**。
比如我们写一个计时器：

```js
function clock() {
	const element = (
		<div>
			<h1>现在是：{new Date().toLocaleTimeString()}</h1>
		</div>
	);
	ReactDOM.render(element, document.getElementById('root'));
}
setInterval(clock, 1000);
```

效果（此处为原生代码模拟，并非真实效果）：

<div style="width: 100%; background-color: #eaeaea; padding: 1rem; font-size: 1rem;">
	<h1 class="example clock"></h1>
</div>

<script type="text/javascript">
    const dom = document.querySelector('.example.clock')
    setInterval(()=>{
        dom.innerText = `现在是：${new Date().toLocaleTimeString()}`
    }, 1000);
</script>

## React 只更新它需要更新的部分

React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使 DOM 达到预期状态。
举个例子：上方的计时器是我通过原生的 JS 写的，你可以打开浏览器的开发者工具，检查上面的计时器元素。
如果你使用的是 Chrome 浏览器，你将发现该元素对应的源代码中，`<h1>`标签和内部的**整个文本**都在闪烁紫色的光，这就是传统的 DOM 操作带来的性能消耗，浏览器将整个`<h1>`标签进行了销毁并再次构造，插入 HTML 文档中。

<del>所以搞不好这个页面展示给您的时候性能可能会不太好</del>

如果是用我给的 React 代码写的计时器的这个例子，你会发现`<h1>`标签不再闪光了，同时内部的文本节点也只有**具体的时间部分**在闪烁，**“现在是”**三个字则不会，因为 ReactDOM 只会更新需要更新的部分。

> React 的代码示例可以看这里：
> {% pen https://codepen.io/ch1ny/pen/RwxxrON?editors=0010 %}

尽管每一秒我们都会新建一个描述整个 UI 树的元素，React DOM 只会更新实际改变了的内容，也就是计时器例子中的仅关于时间的文本节点。
