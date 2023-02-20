---
title: 正确区分var、let和const
date: 2021-09-12 12:35:47
tags: JavaScript
categories: [编程]
cover: https://pic1.zhimg.com/v2-535e92c65ddaff1a55f11df10c680c75_720w.jpg?source=172ae18b
---

var、let 和 const 都是 JavaScript 中用来声明变量的关键字，并且 let 和 const 关键字是在 ES6 中才新增的。既然都是用来声明变量的，那它们之间有什么区别呢？

<!-- more -->

<!-- toc -->

# var 和 let/const 的区别

## 作用域

对于 **var** 来说，它声明的变量的作用域是它当前的执行上下文。具体来说就是，当 **var**处于函数内部，则是该函数执行上下文；如果在函数外部，则是全局执行上下文。换句话说，对于使用**var**声明的变量，其作用域只能是函数块的或是全局的。

而使用**let、const**声明的变量，在除去全局作用域以及函数块作用域外，还新增了新的作用域限定范围，即使用 `{}` 包裹起来的代码块（被称作**块作用域**，可以是 if、while、switch 等关键字形成的代码块，也可以是单独使用`{}`形成的代码块）。

```js
var varStr = 'outside';
function testVar() {
	var varStr = 'inside';
	{
		var varStr = 'var不具有块作用域，我会把上面的inside覆盖掉';
		console.log(varStr); // var不具有块作用域，我会把上面的inside覆盖掉
	}
	console.log(varStr); // var不具有块作用域，我会把上面的inside覆盖掉
}
console.log(varStr); // outside
```

```js
let letStr = 'outside';
function testLet() {
	let letStr = 'inside';
	{
		let letStr = 'let存在块作用域，我只在块作用域里有效';
		console.log(letStr); // let存在块作用域，我只在块作用域里有效
	}
	console.log(letStr); // inside
}
console.log(letStr); // outside
```

## 重复声明

对于 **var**声明的变量可以重复声明，而**let**重复声明已存在的变量则会报错。

```js
var v = 0;
var v = 'str';
console.log(v); // str
let l = 1;
let l = 'l'; // ERROR: Identifier 'l' has already been declared
console.log(l);
```

至于为什么**var**能够重复声明变量则要提到**var**的变量提升机制了。

## 变量提升与暂时性死区

要讨论 var 和 let 的区别，这两个概念是无法绕过的。我们首先来看看什么叫做**变量提升(hoist)**。

### 变量提升

让我们先看一段代码：

```js
function testVar() {
	console.log(v);
	var v = 0;
}
testVar(); // undefined
```

有没有觉得很奇怪？在函数中，我们明明在`var v = 0;` 之前就访问了变量 `v`，但是这段代码并没有报错，而是打印了 `undefined`。
这是因为在 JavaScript 中，使用**var**声明变量时，会自动将声明提升到作用域的顶部。因此，在**ECMAScript**运行上面的这段代码时，它会被等价为如下代码：

```js
function testVar() {
	var v; // 默认值为 undefined
	console.log(v);
	v = 0;
}
testVar(); // undefined
```

同时，如果在作用域内某个变量被重复声明，也会把所有的声明都统一提升到顶部：

```js
function func() {
	var a = 0;
	var a = 1;
	console.log(a);
}
// 其实等价于
function _func() {
	var a;
	a = 0;
	a = 1;
	console.log(a);
}
```

因此，使用**var**重复声明变量也就不会造成报错。

### 暂时性死区

而对于**let**来说，是不存在所谓的“变量提升”的。那么，当我们尝试在使用**let**声明变量之前去访问变量会发生什么呢？

```js
console.log(l); // ReferenceError: a is not defined
let l = 5;
```

这种情况下，毋庸置疑会甩出未定义变量的异常，因为 let 不具有变量提升的特性。那么接下来，我们再来看看另一段代码：

```js
let i = 0;
{
	console.log(i); // ReferenceError: Cannot access 'i' before initialization
	let i = 5;
}
console.log(i);
```

在上面这段代码中，我们通过块作用域将代码分为内外两部分。当执行至第三行时，因为我们已经声明了变量 `i`，理论上是不会报错的，如果此时又没有新的用 let 声明的 i ，因此，它应该会向上寻找上一个作用域中的变量 i 。然而，在这个例子中，我们在块作用域的调用代码后面重新声明了变量`i`，JavaScript 引擎也发现了这个新的声明，因此在这个块作用域中将不会再使用上一层作用域的变量，此时第三行的这个调用就显得有点尴尬了。于是，JavaScript 引擎甩出异常：<span style="color: red;">`ReferenceError: Cannot access 'i' before initialization`</span>
提示我们不要在这个变量初始化之前去访问它。
而所谓的**暂时性死区**（**temporal dead zone**）就是指在使用**let**声明变量之前的整个执行瞬间。

## var/let 小结

在讲述了上述几个不同之后，我们来看一段代码：

```js
function varLoop() {
	for (var i = 0; i < 5; i++) {
		setTimeout(() => {
			console.log(i);
		}, i * 1000);
	}
}
```

我们想用这段代码每隔 1s 打印一个递增的数字，但是记住我们上面说的变量提升，这段代码在**ECMAScript**看来实际上是这样的：

```js
function varLoop() {
	var i;
	for (i = 0; i < 5; i++) {
		setTimeout(() => {
			console.log(i);
		}, i * 1000);
	}
}
```

它实际上做到的，是每隔 1s 打印一个<span style="color: blue;">5</span>。
要进行修改，我们可以选择使用**let**来声明变量：

```js
function letLoop() {
	for (let i = 0; i < 5; i++) {
		setTimeout(() => {
			console.log(i);
		}, i * 1000);
	}
}
```

之所以**let**能起作用是因为**let**具有块作用域，变量`i`被限制在了`for`的循环体内，同时也涉及到了一些闭包的特性。
如果用闭包理解上述两种代码，可以理解为使用**var**是创建了一个闭包被调用了 5 次，而**let**是创建了 5 个独立的闭包各自被调用一次。
最后给大家提供一个使用**var**的纯闭包解法，很多公司面试的时候可能会问到：

```js
function varLoop() {
	for (var i = 0; i < 5; i++) {
		(function (i) {
			setTimeout(() => {
				console.log(i);
			}, i * 1000);
		})(i);
	}
}
```

至于**闭包**，以后再和大家介绍吧。

# const

最后来讲讲 const。
const 的行为其实和 let 是基本一致的，唯一一个重要区别是用 const 声明变量时必须同时赋值，且 const 声明的是一个常量，任何尝试修改 const 声明的变量的行为都会报错。

但是，如果 const 声明的变量指向的是一个对象的话，对象内部的属性依旧是可以修改的，这是因为此时的 const 指向的是对象的指针的地址，而对象内部的数据存在于内存的其他地方。

```js
const obj = {
	name: '德布罗煜',
	age: 20,
};
obj.age += 1;
console.log(obj); // { name: '德布罗煜', age: 21 }
obj = {}; // TypeError: Assignment to constant variable.
```

# 声明风格及最佳实践

## 不使用 var

有了 let 和 const 之后。其实很多开发者会发现不再需要 var 了。同时，由于 let 和 const 拥有了明确的、新的作用域、声明位置以及常量的不变值，限制自己在代码中只使用 let 和 const 可以显著提高代码的质量。

## const 优先

使用 const 声明变量可以让浏览器强制要求变量在运行时保持不变，也可以让静态代码分析工具提前发现非法的赋值操作。因此建议只对明确了未来会存在改变值的变量使用 let。
