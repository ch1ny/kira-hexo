---
title: 【Node.js学习】初识Node.js
date: 2022-04-02 19:54:30
tags: [Node.js]
categories: [编程]
cover: https://i1.wp.com/subrutin.com/wp-content/uploads/2019/01/2400%D1%851260-rw-blog-node-js.png
---

前两天接到未来在蚂蚁集团实习时的师兄的微信好友，他让我在空闲时间学习一下 Node.js，于是决定开个新坑，把我学习 Node.js 的路径记录下来。

<!-- more -->

<!-- toc -->

> 简单来说，Node.js 就是一个运行在服务器端的 JavaScript。
> Node.js 是一个基于 Chrome JavaScript 运行时建立的一个平台。
> Node.js 是一个事件驱动 I/O 服务端 JavaScript 环境，基于 Google 的 V8 引擎，V8 引擎执行 JavaScript 的速度非常快，性能非常好。

# 序言

首先，我们来简单介绍一下为什么 JavaScript 可以在浏览器中被执行。
在浏览器中，存在着一个 JavaScript 解析引擎，它会去解析我们运行在浏览器端的 JavaScript 代码，并执行操作。
不同的浏览器有着不同的 JavaScript 解析引擎，在众多引擎中，Chrome 浏览器的 V8 引擎性能最好。

既然在前端，JavaScript 有着不可替代的地位，那么请问，JavaScript 能否也用于后端开发呢？
当提到后端开发，大家可能过多了解的是 **Java**、**Python**、**C++** 等语言。
而时至今日，连 JavaScript 也能作为后端开发的主要语言了，但是在服务端运行，必然是脱离了浏览器运行环境的，那么我们又应该怎样才能让我们的 JavaScript 代码运行在服务器端呢？因此，我们就必须要引入 **Node.js** 来作为我们的运行环境。这便是 **Node.js** 的作用了。

# Node.js 简介

## 什么是 Node.js

**Node.js** 是一个基于 Chrome V8 引擎的 **JavaScript 运行环境**。

## Node.js 中的 JavaScript 运行环境

Node.js 中的 JavaScript 运行环境，由 V8 引擎及 Node 内置 API 组成。
其中，V8 引擎负责解析服务端的 JavaScript 代码并执行。
内置 API 包括

-   fs
-   path
-   http
-   JS 内置对象
-   querystring
-   etc…

后端的 JavaScript 代码可通过调用这些 API 进行业务处理。

> 在 Node.js 中是无法调用 DOM 和 BOM 等**浏览器内置 API**的。

## Node.js 可以做什么

Node.js 作为一个 JavaScript 的基础运行环境，它仅仅提供了最基础的功能和 API。然而，基于 Node.js 提供的这些基础功能，很多强大的工具和框架如雨后春笋般层出不穷。例如：

-   基于 [Express 框架](https://expressjs.com.cn/)，可以快速构建 Web 应用。
-   基于 [Electron 框架](https://electronjs.org/)，可以快速构建跨平台的桌面应用。
-   基于 [restify 框架](https://restify.com/)，可以快速构建 API 接口项目。

总之，Node.js 是**大前端时代**的利器，是辅助前端程序员提高**行业竞争力**的法宝。

# Node.js 的安装

其实对于前端程序员来说，一旦涉及到了框架就必然会接触到 Node.js，因此我的电脑上是已经装好了 Node.js 的，具体的安装步骤本文也不再过多赘述，有需要的读者可以尝试如下博客：[Node.js 安装教程](https://blog.csdn.net/Small_Yogurt/article/details/104968169)

# 在 Node 中执行 JavaScript 代码

在安装好 Node.js 后，我们就可以尝试通过 Node.js 环境来运行 JavaScript 代码了。
我们选择一个文件夹，在它的下面新建一个 js 文件，假设命名为 **HelloWorld.js** 。
在这个 js 文件中，我们写上如下的代码：

```js
console.log('Hello World!');
console.log('Welcome to Node.js');
```

之后，我们在该文件夹下打开终端（命令行），输入命令（`node 要执行的文件路径`）执行这个脚本文件：

```bat
node HelloWorld.js
```

![执行结果](https://kira.host/assets/Pictures/Others/20220402205833.png)
