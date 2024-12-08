---
title: 【Node.js学习】简单认识express
date: 2022-04-04 20:53:00
tags: [Node.js]
categories: [编程]
---

在前面的学习中，我们已经学会使用 Node.js 的 http 模块来构建一个最基本的 Web 服务器了。今天，我们来学习一款新的框架——Express，并学习如何通过 express 来构建一个 web 服务器。

<!-- more -->

<!-- toc -->

# 初识 express

## express 简介

Express 是一款高度包容、快速而极简的 Node.js Web 框架。但是我们已经有了 http 模块用以创建 Web 服务器，那么我们为什么还要学习 express 呢？因为内置的 http 模块是最基本的模块，使用起来较为复杂，开发效率低；而 Express 是基于 http 模块进一步封装出来的，能够极大地提高开发效率。

## express 能够做什么

对于前端开发者来说，服务器一般分为两种：

-   **web 网站服务器**：专门对外提供 web 网页资源的服务器。
-   **API 接口服务器**：专门对外提供 API 接口的服务器。

使用 express，我们可以方便、快速地创建 **web 网站服务器** 或 **API 接口服务器** 。

# express 的基本使用

## express 的安装

在项目根目录下执行如下指令：

```bat
yarn add express
或
npm install express
```

## express 的基本使用

### 创建基本的 web 服务器

```js
// 1. 导入 express
const express = require('express');
// 2. 创建 web 服务器
const app = express();

// 3. 调用 app.listen()，启动服务器
app.listen(80, () => {
	console.log('服务器开始监听 80 端口');
});
```

### 监听 GET / POST 请求

在通过 express 创建好基本的服务器后，我们可以用它来监听网络中的 GET / POST 请求，并做出相应的处理。

#### 监听 GET 请求

本节我们先来学习如何监听 GET 请求。
通过 `app.get()` 方法，我们可以监听客户端的 GET 请求，具体的语法格式如下：

```js
/**
 * @param {String} url 客户端请求的 URL 地址
 * @param {Function} (req,resp)=>{} 请求对应的处理函数
 */
app.get(url, (req, resp) => {
	// do something
});
```

#### 监听 POST 请求

监听 GET 请求类似，我们通过 `app.post()` 方法可以监听客户端的 POST 请求，具体语法格式如下：

```js
/**
 * @param {String} url 客户端请求的 URL 地址
 * @param {Function} (req,resp)=>{} 请求对应的处理函数
 */
app.post(url, (req, resp) => {
	// do something
});
```

#### 将结果响应给客户端

在上面的代码中，我们看到两个方法的第二个入参都是一个回调函数，这个回调函数的第二个参数是一个响应对象（正如我们在 http 模块那一篇文章中提到的一样）。而我们可以通过调用 `res.send()` 方法，把处理好的内容发送给客户端：

```js
const getUser = () => ({
	name: '德布罗煜',
	age: new Date().getFullYear() - 2001,
});

app.get('/user', (req, resp) => {
	resp.send(getUser());
});

app.post('/user', (req, resp) => {
	resp.send(getUser());
});
```

我们通过 URL 向服务器发送一条 GET 请求，下面是服务器的返回结果：
![输出样例](https://kira.host/assets/Pictures/Others/20220404223433.png)

创建上述一个 Web 服务器的完整代码如下：

```js
const express = require('express');
const app = express();

const getUser = () => ({
	name: '德布罗煜',
	age: new Date().getFullYear() - 2001,
});

app.get('/user', (req, resp) => {
	resp.send(getUser());
});

app.post('/user', (req, resp) => {
	resp.send(getUser());
});

app.listen(80, () => {
	console.log('服务器开始监听 80 端口');
});
```

#### 获取 URL 中携带的查询参数

在上一节中，我们成功地使用 express 监听到了客户端发出的 GET 请求，本节我们将学习如何通过 express 获取 GET 请求中 URL 携带的查询参数。
通过 `req.query` **对象**，可以访问到客户端通过**查询字符串**的形式发送到服务器的参数。
示例代码如下：

```js
app.get('/', (req, resp) => {
	resp.send(req.query);
});
```

`req.query` 默认是一个**空对象（`{}`）**

#### 获取 URL 中的动态参数

通过 `req.params` 对象，可以访问到 URL 中通过 `:` 匹配到的**动态参数**：

```js
app.get('/user/:id/:name', (req, resp) => {
	// req.params 默认也是一个空对象
	// 里面存放着通过 : 动态匹配到的值
	// 像这里的实例代码就是匹配了多个参数
	resp.send(req.params);
});
```

# 托管静态资源

## express.static()

express 提供了一个非常好用的函数：`express.static()` ，通过这个函数，我们可以非常方便地创建一个**静态资源服务器**。
例如，通过如下代码，我们就可以将 `public` 目录下的图片、css、js 文件对外提供静态资源访问服务了：

```js
app.use(express.static('public'));
```

假设存在这样一个目录结构：

```
├── node.js
└── public
    ├── images
    │   └── img.png
    ├── css
    │   └── style.css
    └── js
        └── test.js
```

我们将服务器代码写在了 `node.js` 文件中，运行该脚本文件，我们便能通过如下 URL 访问到 `public` 文件夹下的静态资源：

-   <span style="color: #31aeff">`http://localhost/images/img.png`</span>
-   <span style="color: #31aeff">`http://localhost/css/style.css`</span>
-   <span style="color: #31aeff">`http://localhost/js/test.js`</span>

我们也可以用这个函数托管多个静态资源目录，但是访问静态资源文件时，express.static() 函数会根据目录的添加顺序查找所需的文件。举个例子：

```js
app.use(express.static('public'));
app.use(express.static('assets'));
```

通过这段代码我们同时添加了 `public` 文件夹和 `assets` 文件夹的静态文件资源托管。当我们请求静态资源文件时，会先去先添加的 `public` 文件夹中查找文件，如果没有查询到则会去 `assets` 文件夹中寻找。因此，当我们尝试访问 `http://localhost/index.html` 时，如果在 `public` 文件夹下和 `assets` 文件夹下都有 `index.html` 文件，最终返回给客户端的一定是 `public/index.html` 。

## 挂载路径前缀

如果我们希望在托管的**静态资源访问路径**前，**挂载路径前缀**，则可以使用如下的方式：

```js
app.use('/public', express.static('public'));
```

这样我们就可以通过 `http://localhost/public/index.html` 访问 `public` 文件夹下的 `index.html` 了。也可以避开上一小节讲的重名文件只能访问其中一个的限制。
