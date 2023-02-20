---
title: 关于React18中ReactDOM.render报错的解决方法
date: 2022-04-08 19:00:52
tags: [React]
categories: [编程]
cover: https://tse1-mm.cn.bing.net/th/id/R-C.bc71c1c1c50551a1d65e7b529ea29d08?rik=EU42gCFH4J%2bBZA&riu=http%3a%2f%2fwww.goodworklabs.com%2fwp-content%2fuploads%2f2016%2f10%2freactjs.png&ehk=qvQ5EVoUnJZ7k5L347zsU3f87YTckr1iQBzKdwXJd0w%3d&risl=&pid=ImgRaw&r=0
---

近日 React.js 由 React17 升级到了 React18，很多升级了项目依赖的开发者可能会遇到刚进入项目控制台就打印了这样一段错误的情况：

> Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17.

我将在这篇文章中指出解决这个问题的办法。

<!-- more -->

<!-- toc -->

在 React18 之前，我们渲染元素都是通过函数 `ReactDOM.render()` 来实现将 React 元素渲染到 DOM 上的。就像下面这样：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

但是到了 React18，已不再支持通过这样的方式渲染 React 元素了。但是 React 还是会为开发者保留余地，在开发者没有将项目源码改为最新的 API 时，项目依旧会以 React17 的表现运行。
所以即使不做改动也不会有任何问题，但是对于强迫症选手来说，控制台里一直有个错还是看着很不舒服。所以这里我就讲讲新的 API 究竟应该怎么使用。

# 太长不看版

其实解决方法很简单，更换新的 API 即可。新的 API 是 `createRoot` ，我们通过下面的方式修改我们的代码：

```jsx
import React from 'react';
// import ReactDOM from 'react-dom'; 原来的代码
import { createRoot } from 'react-dom/client'; // 新的 API 引入方式
import App from './App';

// <!-- new code -->
const root = createRoot(document.getElementById('root'));
root.render(<App />);
// <!-- end new code -->

// 原来的代码
// ReactDOM.render(<App />, document.getElementById('root'));
```
