---
title: 浅谈JS中的闭包
date: 2021-09-28 10:36:15
tags: JavaScript
categories: [编程]
cover: https://pic1.zhimg.com/v2-535e92c65ddaff1a55f11df10c680c75_720w.jpg?source=172ae18b
---

对于 JavaScript 初学者来说，JavaScript 有着这样一个概念十分重要，几乎是每个前端工程师面试时必然会遇到的一个问题，JS 的**闭包（closure）**。今天我们就来浅谈一下 JS 中的闭包究竟是怎样的东西。

<!-- more -->

<!-- toc -->

# 闭包的定义

要弄懂什么是闭包，我们需要先给闭包下一个定义。
根据 MDN 文档上的定义：

> 一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**（**closure**）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

可以看到，在这个定义中，我们引入了一些特殊的概念——**作用域**。已经有过编程基础的同学应该不会对这个词感到陌生，在其他的语言中也同样存在作用域的概念，那么接下来，我们将先介绍什么是 JavaScript 中的词法作用域。

# 词法作用域

首先，我们来考虑这样一个例子：

```js
function func() {
	let num = 1;
	const plus = function () {
		console.log(++num);
	};
	plus();
}
func();
```

在这个例子中，我们通过调用 `func` 函数，创建了一个局部变量 `num` 和一个叫做 `plus` 的函数。由于`plus`是在`func`内部创建的，因此也只能在`func`内部被调用。对于`plus`函数来说，它没有自己的局部变量，但它能够调用其父函数`func`中的局部变量`num`。
我们把这段代码执行一下就能发现，在控制台中打印了数字 <span style="color: blue;">2</span> 。这个 _词法作用域_ 的例子描述了分析器如何在函数嵌套的情况下解析变量名。词法（lexical）一词指的是，词法作用域根据源代码中声明变量的位置来确定该变量在何处可用。嵌套函数可访问声明于它们外部作用域的变量。

# 理解闭包

有了上面的例子，我们就能理解闭包究竟是什么样的东西了。
继承我们上面的例子，虽然我们已经能够在外部访问到`num`变量，但是每次执行`func`函数实际上都创建了新的`num`变量，我们想让`num`持续地自加，应当如何实现？其实只需要对上方的代码做一点小小的修改即可：

```js
function func() {
	let num = 1;
	const plus = function () {
		console.log(++num);
	};
	return plus;
}

const add = func();
add(); // 2
add(); // 3
```

经过修改后的`func`函数，直接返回了`plus`方法，其后我们可以直接通过调用这个方法来实现`num`的持续自加。

看到这里，相信大家其实都很明白了：

> 所谓闭包，就是通过一个函数包裹局部变量，并返回一个嵌套函数，外部环境通过调用返回的嵌套函数来达到访问并操作函数内部的局部变量。

最后给大家看一个稍微复杂一点的闭包例子：

```js
function Closure(step) {
	let num = 0;
	return function () {
		/**
		 * 由于返回的函数中使用到了变量 step ，
		 * 因此即使 step 作为形参传入父函数也不会被当做垃圾回收
		 */
		console.log((num += step));
	};
}
const c5 = Closure(5); // 一步自加 5
const c10 = Closure(10); // 一步自加 10
c5(); // 5
c10(); // 10
c5(); // 10
c10(); // 20
```

相信大家也能轻松地理解上述代码的执行过程。

# 闭包的实际使用

在前端开发中，闭包的使用是非常灵活的，比如说对于**防抖**（**debounce**）和**节流**（**throttle**）函数的封装：

```js
/**
 * @description 防抖函数的封装
 * @param func {Function} 被封装的函数
 * @param delay {Number} 间隔时长（单位：ms）
 * @param instant {Boolean} 是否立即执行，默认为 true
 */
function debounce(func, delay, instant = true) {
	let timeout;
	if (instant)
		return function () {
			// 立即执行版防抖
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				func.apply(this, arguments);
				timeout = null;
			}, delay);
		};
	else
		return function () {
			// 非立即执行版防抖
			if (timeout) {
				clearTimeout(timeout);
			} else {
				func.apply(this, arguments);
			}
			timeout = setTimeout(() => {
				timeout = null;
			}, delay);
		};
}

/**
 * @description 节流函数的封装
 * @param func {Function} 被封装的函数
 * @param delay {Number} 间隔时长（单位：ms）
 * @param instant {Boolean} 是否立即执行，默认为 true
 */
function throttle(func, delay, instant = true) {
	let timeout;
	if (instant)
		return function () {
			// 立即执行版节流
			if (!timeout) {
				func.apply(this, arguments);
				timeout = setTimeout(() => {
					timeout = null;
				}, delay);
			}
		};
	else
		return function () {
			// 非立即执行版节流
			if (!timeout) {
				timeout = setTimeout(() => {
					func.apply(this, arguments);
					timeout = null;
				}, delay);
			}
		};
}
```

# 注意事项

## 性能考量

如果不是出于某些特殊目的不得不使用闭包，在其他函数中创建新的函数是不推荐的做法。因为闭包在**处理速度**和**内存消耗**方面对 JS 的性能具有负面影响。

## 内存泄漏

如果很不幸，您的代码中必须大量使用闭包，请务必注意是否有**内存泄漏**的风险。如果可能，请务必在不需要闭包后将闭包中的引用变量置为 **null** ，以便 JS 能将它们视为不再需要的垃圾回收。
