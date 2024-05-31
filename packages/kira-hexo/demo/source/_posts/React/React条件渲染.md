---
title: React条件渲染
date: 2022-01-03 13:23:51
tags: [React, JavaScript]
categories: [编程]
cover: https://tse1-mm.cn.bing.net/th/id/R-C.bc71c1c1c50551a1d65e7b529ea29d08?rik=EU42gCFH4J%2bBZA&riu=http%3a%2f%2fwww.goodworklabs.com%2fwp-content%2fuploads%2f2016%2f10%2freactjs.png&ehk=qvQ5EVoUnJZ7k5L347zsU3f87YTckr1iQBzKdwXJd0w%3d&risl=&pid=ImgRaw&r=0
---

有时候我们需要根据一些状态来选择性地显示/隐藏部分组件，在这篇文章中我们将来简单了解一下 React 中的条件渲染

<!-- more -->

<!-- toc -->

# Vue 中的条件渲染

> 由于我只使用过 Vue2.0 ，因此不对 3.0 做讨论

对使用过 Vue 框架的开发者来说，Vue 为我们提供了两个语法糖供我们实现条件渲染。

-   **v-show**
-   **v-if**

我们可以在这两个 Vue 语法糖中添加一段 JS 表达式，用来很方便地切换对应组件的渲染状态。两种语法糖分别对应了两种渲染模式，我们来简单介绍一下：

```html
<template>
	<div id="app">
		<h1 v-if="vif">V-IF</h1>
		<button @click="exchangeIf">切换_if</button>

		<h1 v-show="vshow">V-SHOW</h1>
		<button @click="exchangeShow">切换_show</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				vif: true,
				vshow: true,
			};
		},
		methods: {
			exchangeIf() {
				this.vif = !this.vif;
			},
			exchangeShow() {
				this.vshow = !this.vshow;
			},
		},
	};
</script>

<style>
	#app {
		text-align: center;
		color: #2c3e50;
	}

	button {
		background: none;
		border: solid 1px;
		border-radius: 2em;
		font: inherit;
		padding: 0.75em 2em;
	}
</style>
```

{% pen https://codepen.io/ch1ny/pen/rNpoMrd %}

在上面我们给出了一个简单的 Vue2 的条件渲染的例子。可以看到切换 v-if/v-show 能够让组件在页面上显示/隐藏。乍一看似乎没什么区别，但实际上，v-if 控制了组件是否需要被渲染在页面上，当你将 v-if 的值置为 `false` 时，你会发现在浏览器的开发者工具中，该元素占据的 DOM 位置被改成了一段注释 `<!---->`，原来的组件被直接移除了。而 v-show 被置为 `false` 时，我们仍旧能在开发者工具中看到该 DOM，但是区别是它的 style 被加上了一条 `display: none` ，以此来隐藏组件，但组件依旧存在。
同时，v-if 还能够与 v-else 以及 v-else-if 组成多种多样的条件渲染模式，但由于本文主要是为了介绍 React，因此便不再过多阐述。

# React 的条件渲染

接着我们把目光重新放到 React 上来。
React 并没有为开发者实现类似 **v-if** 或是 **v-show** 这样的语法糖，一切条件渲染的行为还都需要我们开发者自己编写。但是我们可以通过简单了解 Vue2 的语法糖实现来理解如何实现我们自己的条件渲染。

## React 中简单的 v-if 实现

在 React 中，你可以创建不同的组件来封装各种你需要的行为。然后，依据应用的不同状态，你可以只渲染对应状态下的部分内容。React 中的条件渲染和 JavaScript 中的一样，使用 JavaScript 运算符 `if` 或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI。
我们来通过 if 实现一个简单的条件渲染，看看下面的例子：
我们先定义两个组件

```js
function ShouldRender(props) {
	return <h1>父组件拿到的value是true</h1>;
}

function DontRender(props) {
	return <h1>父组件拿到的value是false</h1>;
}
```

接着再创建一个父组件，由父组件完成条件渲染：

```js
function App(props) {
	const { value } = props;
	if (value) {
		return <ShouldRender />;
	} else {
		return <DontRender />;
	}
}

ReactDOM.render(<App value={false} />, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/LYeMRav?editors=0010 %}

这个示例根据传入的 `value` 不同渲染不同的内部组件。

## 元素变量

我们也可以用变量来储存元素，并通过它来有条件地渲染组件的一部分，而其他的渲染部分并不会因此而发生改变。
我们来创建两个组件，分别对应了**登录**和**注销**按钮：

```js
function LoginButton(props) {
	return <button onClick={props.onClick}>登录</button>;
}

function LogoutButton(props) {
	return <button onClick={props.onClick}>注销</button>;
}
```

接下来我们再创建一个有状态组件，由它来管理登录状态：

```js
class LoginPanel extends React.Component {
	constructor(props) {
		super();
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.state = {
			isLoggedIn: false,
		};
	}

	handleLogin() {
		this.setState({
			isLoggedIn: true,
		});
	}

	handleLogout() {
		this.setState({
			isLoggedIn: false,
		});
	}

	render() {
		let logButton;
		const { isLoggedIn } = this.state;
		if (isLoggedIn) {
			logButton = <LogoutButton onClick={this.handleLogout} />;
		} else {
			logButton = <LoginButton onClick={this.handleLogin} />;
		}
		return <div>{logButton}</div>;
	}
}

ReactDOM.render(<LoginPanel />, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/yLpGVYj?editors=0010 %}

使用这种方法，我们通过提前声明一个变量，并利用 if 语句为其赋值，可以很方便地进行条件渲染。但是我们仍觉得这样的写法不够简洁，接下来，我们将介绍几种嵌入于 JSX 中的内联条件渲染语法。

## 在 JSX 中内联条件渲染

还记得我们之前讲的 JSX 语法吗？它可以被理解为是一种 JavaScript 的语法扩展，允许我们在 JavaScript 中编写 HTML 代码，而我们也能在 JSX 中添加一些 JavaScript 表达式。因此，我们也可以直接在 JSX 中添加条件表达式进行条件渲染。

### 与运算符 &&

使用花括号包裹代码，可以在 JSX 中嵌入合法的表达式。因此我们也能嵌入 JavaScript 中的逻辑与运算符，它能够很方便地进行元素的条件渲染。

```js
function Table(props) {
	const items = props.data;
	return (
		<div>
			<h1>数据表单</h1>
			{items.length > 0 && (
				<table border='1'>
					<thead>
						<td>商品</td>
						<td>单价</td>
					</thead>
					{items.map((item) => (
						<tr>
							<td>{item.name}</td>
							<td>{item.price}</td>
						</tr>
					))}
				</table>
			)}
		</div>
	);
}

const goods = [
	{ name: '笔记本', price: 10 },
	{ name: '草稿纸', price: 3 },
];
ReactDOM.render(<Table data={goods} />, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/PoEXbWp?editors=0010 %}

之所以能使用这种写法，是因为在 JavaScript 中，`true && expressions` 总会返回 `expresions`，而 `false && expressions` 总会返回 `false`。
因此，如果条件为 `true` ，那么 `&&` 右侧的元素将会被渲染，如果是 `false` ，React 将会忽略并跳过它。

### 三目运算符

另外一种比较常用的内联条件渲染方式是使用三目运算符的形式，就像下面这个组件展示的一样：

```js
render() {
    const { isLoggedIn } = this.state
    return (
		<div>
            {
                isLoggedIn
                ? <LogoutButton onClick={this.handleLogout} />
                : <LoginButton onClick={this.handleLogin} />
            }
        </div>
    )
}
```

## 模拟 v-show 进行条件渲染

在上面我们已经介绍了多种 React 的条件渲染方式，但是上述的条件渲染都会导致一个组件被不断地被**卸载**/**挂载**，那么有没有办法能让 React 的组件不要频繁地销毁重建，只是单纯地隐藏起来呢？当然是存在这种条件渲染方式的，其实现方法也很简单，我们只需要对条件渲染的位置做个改动就行。
就像 Vue 中对 v-show 的处理，我们只需要根据不同的条件修改元素的 `CSSProperties` 中的 `display` 的值就可以了。

```js
class ReactShow extends React.Component {
	constructor(props) {
		super();
		this.state = {
			show: true,
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState((state) => ({
			show: !state.show,
		}));
	}

	render() {
		return (
			<>
				<h1 style={{ display: this.state.show ? '' : 'none' }}>
					点击下方按钮改变我的状态吧
				</h1>
				<button onClick={this.handleClick}>
					{this.state.show ? '隐藏标题' : '显示标题'}
				</button>
			</>
		);
	}
}

ReactDOM.render(<ReactShow />, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/MWrZbEz?editors=0010 %}
