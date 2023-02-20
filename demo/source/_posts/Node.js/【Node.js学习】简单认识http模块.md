---
title: 【Node.js学习】简单认识http模块
date: 2022-04-03 15:02:50
tags: [Node.js]
categories: [编程]
---

这里我们回顾一下我们学习 Node.js 的目的：是为了将 Node.js 作为后端开发的工具才去学习它的，那么要使它能够代替传统的后端开发语言，Node.js 必须要具备基本的 HTTP 通信的功能。要实现 HTTP 通信，就要用到我们今天介绍的这个模块—— **http 模块**了。

<!-- more -->

<!-- toc -->

# http 模块简介

在介绍 http 模块之前，我们先来回顾一下**客户端**和**服务器端**的概念。

-   **客户端**：在网络节点中，负责消费资源的计算机，叫做客户端。
-   **服务器端**：**负责对外提供网络资源**的计算机，叫做服务器。

**http 模块**是 Node.js 官方提供的、用来**创建 web 服务器**的模块。通过 http 模块提供的 `http.createServer()` 方法，就能方便地把一台普通的计算机，变为一台 Web 服务器，从而对外提供 Web 资源服务。

如果要使用 http 模块创建 Web 服务器，首先需要导入它：

```js
const http = require('http');
```

# 进一步理解 http 模块的作用

服务器与普通计算机的**区别**在于，服务器上安装了 **web 服务器软件**，如：IIS、Apache 等。通过安装这些服务器软件，就能把一台普通的电脑变成一台 web 服务器。

而有了 Node.js，我们便不再需要 IIS、Apache 这些第三方 web 服务器软件。因为我们可以基于 Node.js 提供的 http 模块自行搭建一个 Web 服务器，对外提供 Web 服务。

# 创建基本的 web 服务器

## 创建 web 服务器的基本步骤

1. <a href="#步骤一-导入-http-模块">导入 http 模块</a>
2. <a href="#步骤二-创建-web-服务器实例">创建 web 服务器实例</a>
3. <a href="#步骤三-为服务器实例绑定-request-事件">为服务器实例绑定 **request** 事件，监听客户端的请求</a>
4. <a href="#步骤四-启动服务器">启动服务器</a>

### 步骤一 - 导入 http 模块

如果希望在计算机上创建一个 web 服务器，从而对外提供 web 服务，首先需要导入 http 模块。

```js
const http = require('http');
```

### 步骤二 - 创建 web 服务器实例

调用 `http.createServer()` 方法，即可快速创建一个 web 服务器实例。

```js
const server = http.createServer();
```

### 步骤三 - 为服务器实例绑定 request 事件

为服务器实例绑定 request 事件，即可监听客户端发来的网络请求。

```js
server.on('request', (req, resp) => {
	console.log('接到客户端发送请求');
	console.log(req);
});
```

我们通过 `server.on()` 绑定监听事件，监听 `request` 事件，并给第二个参数传入一个回调函数。该回调函数接收请求对象和响应对象作为形参，用于在监听到 `request` 请求后执行回调。

### 步骤四 - 启动服务器

调用服务器实例的 `listen()` 方法，即可启动当前的 web 服务器实例。

```js
server.listen(80, () => {
	console.log('服务器开始监听 80 端口');
});
```

### 完整代码

创建一个基本的 web 服务器的完整代码如下：

```js
// 步骤一 - 导入 http 模块
const http = require('http');

// 步骤二 - 创建 web 服务器实例
const server = http.createServer();

// 步骤三 - 为服务器实例绑定 request 事件
server.on('request', (req, resp) => {
	console.log('接到客户端发送请求');
	console.log(req);
});

// 步骤四 - 启动服务器
server.listen(80, () => {
	console.log('服务器开始监听 80 端口');
});
```

## req 对象<http.IncomingMessage>

我们可以通过 request 请求对象提取出客户端发送的请求中的信息，示例代码：

```js
const http = require('http');
const server = http.createServer();
server.on('request', (req, resp) => {
	const url = req.url;
	const method = req.method;
	console.log(`请求的url是${url}，请求的方法是${method}`);
});
```

## resp 对象<http.ServerResponse>

在服务器的 request 事件处理函数中，如果想访问与服务器相关的属性或数据可以使用 response 响应对象。

```js
server.on('request', (req, resp) => {
	// resp.writeHead()方法介绍：
	// 向响应头写入内容
	/**
	 * @param {Number} statusCode 三位数字，表示3位的HTTP状态码
	 * @param {String} statusMessage 可选参数，可以输入一段人类可读的状态信息
	 * @param {Object|Array} headers 可选参数，表示响应标头
	 */
	resp.writeHead(200, {
		'content-type': 'text/html; charset=utf8', // 这里给响应设置UTF8字符集，防止中文乱码
	});
	const res = `请求的url是${req.url}，请求的方法是${req.method}`;
	// 这里介绍 resp.end()方法
	// 向客户端发送指定内容，并终止本次请求的处理过程
	resp.end(res);
});
```

# 根据不同的 URL 响应不同的内容

通过上面的步骤，我们已经实现了基本的 web 服务器搭建。但是这样一个简单的服务器还存在一个问题，那就是它只能监听发送到某个端口的所有请求，而不能区分发向不同地址的请求。接下来，我们将实现根据不同的 URL 返回不同的响应。

示例代码：

```js
const http = require('http');
const server = http.createServer();

server.on('request', (req, resp) => {
	// 这里给响应设置UTF8字符集，防止中文乱码
	resp.setHeader('content-type', 'text/html; charset=utf8');
	switch (req.url) {
		case '/':
			resp.write(`<h1>欢迎来到首页</h1>`);
			resp.end();
			break;
		case '/about':
			resp.write(`<h1>这里是简介</h1>`);
			resp.end();
			break;
		default:
			// 默认返回 404
			resp.writeHead(404);
			resp.end(`<h1>404 NOT FOUND</h1>`);
			break;
	}
});

server.listen(80, () => {
	console.log('服务器开始运行');
});
```
