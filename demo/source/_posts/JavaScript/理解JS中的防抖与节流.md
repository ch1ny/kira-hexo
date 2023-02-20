---
title: 理解 JS 中的防抖与节流
date: 2022-01-11 10:17:29
tags: [JavaScript]
categories: [编程]
cover: https://pic1.zhimg.com/v2-535e92c65ddaff1a55f11df10c680c75_720w.jpg?source=172ae18b
---

> 在前端项目开发中，在合适的地方做好**防抖**与**节流**是十分重要的。首先我们要知道，哪些地方适合采用防抖节流进行开发。一个重要的特征就是——**某个函数在短时间内被频繁持续地执行**。

<!-- more -->

下面将给大家展示一个例子，方便理解：

```html
<!DOCTYPE html>
<html lang="zh">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>防抖节流</title>
		<style>
			body {
				text-align: center;
				margin: 0%;
			}

			div {
				width: 200px;
				height: 75px;
				text-align: center;
				background-color: gray;
				color: white;
				font-size: 75px;
				line-height: 75px;
				position: relative;
				left: 50%;
				transform: translate(-50%);
				user-select: none;
			}
		</style>
	</head>

	<body>
		<h1>未采用防抖与节流，函数被频繁触发</h1>
		<div id="number">0</div>
	</body>

	<script>
		{
			let num = 0;

			function movemouse() {
				document.querySelector('#number').onmousemove = () => {
					document.querySelector('#number').innerText = ++num;
				};
			}

			movemouse();
		}
	</script>
</html>
```

通过以上代码，我们构造了一个简单的函数被频繁触发的 demo 。
![在这里插入图片描述](https://img-blog.csdnimg.cn/a9127a35ad0047789b2892135ed3bf96.png)
这是一个灰色的 `div` ，当鼠标在它里面移动时，其内容会加一，效果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/8a0a38e3a5454aafbab6062aa9263468.gif)
可以看到，当我们对这个函数不作任何处理时，我们每滑动一次鼠标，都会频繁地触发函数。当该函数执行一次的开销变得很大时（比如发送 AJAX 请求），这样的执行方式将会给用户带来地狱般的使用体验。
下面我们来看看如何通过**防抖**（**debounce**）和**节流**（**throttle**）来解决这个问题。

**防抖**
所谓防抖（debounce），是指让函数保持一定的时间间隔触发。当某函数触发过一次后，要求其等待一段时间后才能再次执行。
下面我来演示一下如何通过防抖技术解决我们上面给出的样例中出现的问题。

```html
<!-- 为节省时间，多余的部分就不写了，只关注防抖部分的代码实现 -->
<body>
	<h1>这是防抖</h1>
	<div id="debounce">0</div>
</body>

<script>
	{
		let num = 0;
		let noMove = true;
		let timeout;

		/*
		 * 防抖 debounce
		 */
		function debounce() {
			document.querySelector('#debounce').onmousemove = () => {
				if (noMove) {
					noMove = false;
					document.querySelector('#debounce').innerText = ++num;
				} else {
					if (timeout) {
						clearTimeout(timeout);
					}
				}
				timeout = setTimeout(() => {
					noMove = true;
				}, 1000);
			};
		}

		debounce();
	}
</script>
```

在**防抖**解决方案中，我们为函数添加了两个新的变量：`noMove` 和 `timeout` 。其中，`noMove` 是一个布尔值，用来记录在一定时间范围内函数是否没有被触发，一旦触发函数将会把 `noMove` 置为 `false` 。同时启动一个计时器，赋给 `timeout` 变量，它负责在指定时间过后将 `noMove` 的值再次恢复为 `true` ，以使函数能够正常执行。当然，每当函数在规定时长内再次被触发时，我们会移除上一轮函数执行中赋值给 `timeout` 的计时器，并重新计时。
以上便是**防抖**技术的基本思想。下面我们来看看实际效果。
![在这里插入图片描述](https://img-blog.csdnimg.cn/63e5779d43f743f7be350ff1ce7fcb4d.gif)
通过防抖的实现后，我们可以看见 demo 中的 `div` 依旧会因为鼠标的移动而使自身的内容加一，但是执行远没有最初那么频繁了。而且在函数执行一次后，只有当一段时间没有再次执行函数之后，该函数才会再次生效，否则，频繁地触发函数将会导致函数永远无法执行。

**节流**
防抖与节流都能解决前端页面函数触发过于频繁的问题，但两者的基本思想并不完全相同，下面我们把**防抖**的代码修改为**节流**的解决方案：

```html
<body>
	<h1>这是节流</h1>
	<div id="throttle">0</div>
</body>

<script>
	{
		let num = 0;
		let noMove = true;

		/*
		 * 节流 (throttle)
		 */
		function throttle() {
			document.getElementById('throttle').onmousemove = () => {
				if (noMove) {
					document.getElementById('throttle').innerText = ++num;
					noMove = false;
					setTimeout(() => {
						noMove = true;
					}, 1000);
				}
			};
		}

		throttle();
	}
</script>
```

**节流**的基本思想是让函数触发保持在一定的速率下，以免频繁地执行。在这个方案下，我们同样引入了变量 `noMove` 。当触发并执行相关函数后，我们让 `noMove` 置为 `false` ，并启动一个计时器，让它在一定时间后将 `noMove` 恢复为 `true` 。下面是**节流**的实现效果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/49fd57d5bbd04aa0bd3190eacb240637.gif)

现在，我们还可以对**防抖**函数与**节流**函数做进一步封装，使其更加偏向实际开发使用。封装如下：

```javascript
function debounce(func, wait) {
	let timeout;
	return function () {
		if (timeout) {
			clearTimeout(timeout);
		} else {
			func.apply(this, arguments);
		}
		timeout = setTimeout(() => {
			timeout = null;
		}, wait);
	};
}

function throttle(func, wait) {
	let timeout;
	return function () {
		if (!timeout) {
			func.apply(this, arguments);
			timeout = setTimeout(() => {
				timeout = null;
			}, wait);
		}
	};
}

document.querySelector('#debounce').onmousemove = debounce(() => {
	document.getElementById('debounce').innerText = ++document.getElementById('debounce').innerText;
}, 1000);

document.querySelector('#throttle').onmousemove = throttle(() => {
	document.getElementById('throttle').innerText = ++document.getElementById('throttle').innerText;
}, 1000);
```

以上就是**防抖**与**节流**的基本思想的介绍，读者应该根据自己开发项目中的实际需要选择不同的解决方案，同时上面给出的代码也仅供参考，真正重要的是两种解决方案的基本思想，开发者应该根据实际开发来调整具体的实现逻辑。
