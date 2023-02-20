---
title: React的事件处理
date: 2022-01-02 12:54:07
tags: [React, JavaScript]
categories: [编程]
cover: https://tse1-mm.cn.bing.net/th/id/R-C.bc71c1c1c50551a1d65e7b529ea29d08?rik=EU42gCFH4J%2bBZA&riu=http%3a%2f%2fwww.goodworklabs.com%2fwp-content%2fuploads%2f2016%2f10%2freactjs.png&ehk=qvQ5EVoUnJZ7k5L347zsU3f87YTckr1iQBzKdwXJd0w%3d&risl=&pid=ImgRaw&r=0
---

在这篇文章中，我们将会了解在 React 中如何进行事件处理。

<!-- more -->

<!-- toc -->

# React 中的事件处理

> React 元素的事件处理和 DOM 元素的很相似，但是有一点语法上的不同：
>
> -   React 事件命名采用驼峰写法（camelCase），而不是全部小写；
> -   使用 JSX 语法时需要传入一个函数作为事件处理函数，而非字符串。

举个例子，在传统的 HTML 中，我们通常是这样给标签添加事件处理函数的：

```html
<button onclick="handleClick()">按钮</button>
```

而在 React 中，我们的写法则是这样的：

```js
// 因为 hexo 自带的 markdown 解析器无法解析 JSX 语法
// 所以这一段代码写的比较长
// 重点关注其中的 <button /> 标签即可
function Button(props) {
	return <button onClick={handleClick}>按钮</button>;
}
```

在 React 中另一个不同点是我们不能通过 `return false` 的方法来阻止默认行为，我们必须显式调用 `preventDefault()` 。
举个例子，在传统的 HTML 中，我们想要阻止链接默认打开一个新页面，可以采用这种写法：

```html
<a href="#" onclick="console.log('onclick'); return false;">点击链接</a>
```

但在 React 中，则要通过这样的写法来阻止默认行为：

```js
function Link(props) {
	const clickLink = (e) => {
		e.preventDefault();
		console.log('onClick');
	};
	return (
		<a href='#' onClick={clickLink}>
			点击链接
		</a>
	);
}
```

在使用 React 时，开发者无需通过 `addEventListener` 为已创建的 DOM 元素添加监听器，只需要在该元素首次渲染时添加监听即可。

# 事件处理示例

下面，我们通过 ES6 的 class 定义一个有状态组件，并给它添加一个点击事件调整自身状态。

```js
class Switcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enabled: true,
		};
		// 由于 handleClick 中使用了 `this` ，因此必须先为它绑定好 `this`
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState((state) => ({
			enabled: !state.enabled,
		}));
	}

	render() {
		return (
			<>
				<div>
					<button onClick={this.handleClick}>切换状态</button>
				</div>
				<div>
					<span>当前状态：{this.state.enabled ? '开' : '关'}</span>
				</div>
			</>
		);
	}
}
```

{% pen https://codepen.io/ch1ny/pen/OJzzYrx?editors=0010 %}

## 谨慎对待 this

**注意**：开发者需要谨慎对待 JSX 回调函数中的 `this` ，在 JavaScript 中，class 的方法默认是不会绑定 `this` 的。如果你忘记绑定 `this.handleClick` 并把它传入了 `onClick`，当你调用这个函数的时候 `this` 的值为 `undefined`。
如果你觉得绑定 `bind` 很麻烦，那么还有另外两种解决办法可以使用。

如果你的项目中，有使用 `public class fields` 语法，那么可以使用 `class fields` 绑定回调函数：

```js
class Switcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enabled: true,
		};
	}

	// 注意：这是 实验性 语法
	handleClick = () => {
		this.setState((state) => ({
			enabled: !state.enabled,
		}));
	};

	render() {
		return (
			<>
				<div>
					<button onClick={this.handleClick}>切换状态</button>
				</div>
				<div>
					<span>当前状态：{this.state.enabled ? '开' : '关'}</span>
				</div>
			</>
		);
	}
}
```

如果您的项目是通过 `create-react-app` 脚手架创建的，那么默认启动此语法。
如果您的项目没有使用此语法，那么你可以在回调中填入一个**箭头函数**：

```js
class Switcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enabled: true,
		};
	}

	handleClick() {
		this.setState((state) => ({
			enabled: !state.enabled,
		}));
	}

	render() {
		return (
			<>
				<div>
					<button
						onClick={() => {
							this.handleClick();
						}}>
						切换状态
					</button>
				</div>
				<div>
					<span>当前状态：{this.state.enabled ? '开' : '关'}</span>
				</div>
			</>
		);
	}
}
```

但是这样的写法也存在问题，每渲染一次该组件都会创建一个不同的回调函数对象。在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。React 官方建议在构造器中绑定或使用 class fields 语法来避免这类性能问题。
