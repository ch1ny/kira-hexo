---
title: React的组件
date: 2022-01-01 15:02:52
tags: [React, JavaScript]
categories: [编程]
cover: https://tse1-mm.cn.bing.net/th/id/R-C.bc71c1c1c50551a1d65e7b529ea29d08?rik=EU42gCFH4J%2bBZA&riu=http%3a%2f%2fwww.goodworklabs.com%2fwp-content%2fuploads%2f2016%2f10%2freactjs.png&ehk=qvQ5EVoUnJZ7k5L347zsU3f87YTckr1iQBzKdwXJd0w%3d&risl=&pid=ImgRaw&r=0
---

在上一篇关于 React 的博文中，我们对 react 的渲染和 JSX 的语法有了一个基本的认识。今天就让我们再深入一点，学习 React 组件的相关知识。

<!-- more -->

<!-- toc -->

> 组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。本指南旨在介绍组件的相关理念。

组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

# 函数组件与 class 组件

## 函数组件

定义一个 React 组件最简单的方式就是定义一个如下的 JavaScript 函数：

```js
function App(props) {
	return <h1>这个组件的名字是：{props.name}</h1>;
}
```

这个函数是一个有效的 React 组件，因为它接收唯一带有数据的 `props` （属性）对象，并且通过 JSX 返回了一个 React 元素。这类组件被称作**函数组件**，因为它本质上就是一个 JavaScript 函数。

## class 组件

你还可以使用 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes">ES6 的类</a> 来定义组件：

```js
class App extends React.Component {
	render() {
		return <h1>这个组件的名字是：{props.name}</h1>;
	}
}
```

上述两个组件在使用效果上是相等的。

# 使用组件

之前，我们遇到的 React 元素还都只是 DOM 标签：

```js
const element = <div>这是个DOM标签</div>;
```

而现在，我们可以用我们定义的 React 组件来代替这些 DOM 标签，成为 React 元素。
当 React 元素是用户自定义的 React 组件时，它会将 JSX 接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象就是我们的 **`props`** 。

比如我们下面的这段代码：

```js
function App(props) {
	return <h1>这个组件的名字是：{props.name}</h1>;
}

const element = <App name='app' />;

ReactDOM.render(element, document.getElementById('root'));
```

它会在 Id 为 root 的 DOM 中打印一段标题，呈现的效果如下：

<div style="width: 100%; background-color: #eaeaea; padding: 1rem; font-size: 1rem;">
    <div id="root">
        <h1>这个组件的名字是：app</h1>
    </div>
</div>

我们来理解一下这个例子中发生了什么：

1. 我们调用 `ReactDOM.render()` 函数，并传入 `<App name='app' />` 作为参数。
2. React 调用 `App` 组件，并将 `{ name: 'app' }` 作为 props 传入。
3. `App` 组件将 `<h1>这个组件的名字是：app</h1>` 作为返回值返回。
4. ReactDOM 将 DOM 高效地替换成 `<h1>这个组件的名字是：app</h1>` 。

> **注意：组件名称必须以大写字母开头**。
> React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`<div />` 代表 HTML 的 div 标签，而 `<App />` 则代表一个组件，并且需在作用域内使用 `App` 。

# 组合组件

组件可以在其输出中引用其他组件。这就可以使我们用同一组件抽象出任意层次细节。我们可以来看看以下代码：

```js
function Student(props) {
	return (
		<h2>
			{props.name}是位{props.male ? '男' : '女'}同学
		</h2>
	);
}

function Classroom(props) {
	return (
		<>
			<h1>{props.classroom}班花名册如下：</h1>
			<div>
				{props.students.map((student) => (
					<Student name={student.name} male={student.male} />
				))}
			</div>
		</>
	);
}

const classroom = (
	<Classroom
		classroom={2}
		students={[
			{ name: '小明', male: true },
			{ name: '小红', male: false },
			{ name: '小亮', male: true },
		]}
	/>
);

ReactDOM.render(classroom, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/MWrrKQE?editors=0010 %}

在这个例子中，我们构造了一个简单的花名册组件。通常来说，每个新的 React 应用程序的顶层组件都是 `App` 组件。但是，在一个实际项目中，你还会需要一些其他的小组件，并且自下而上地将这类组件逐步应用到视图层的每一处。

# props 的只读性

组件无论是使用函数式声明还是通过 class 声明，都绝对不能修改自身的 props ，这叫做 props 的只读性。
在了解只读性之前让我们先来认识一种函数：**纯函数**。
我们来看看下面这段代码：

```js
function add(a, b) {
	return a + b;
}
```

像上面这段代码，我们只是使用了传入函数的参数，而没有修改入参的值，这样的函数叫做纯函数。
而下面这段代码中的函数就不是纯函数，因为它修改了自己的入参：

```js
function arrayPush(arr, num) {
	arr.push(num);
}
```

React 是一门非常灵活的 JS 框架，但它也有个严格的规则：

**所有 React 组件都必须像纯函数一样保护它们的 props 不被自身更改。**

当然，一个 Web 应用的视图层是动态的，并且会随着时间的推移发生变化。下面，我们将介绍一种新的概念—— **state** 。在不违背上述规则的情况下，state 允许 React 组件随用户的操作、网络响应或者其他的变化而动态地更改渲染内容。

# State 与生命周期

## State

在 <a href="/React/React入门/">React 入门</a> 这篇文章中，我们曾经写了一个时钟的代码用例。

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

在这个用例中，我们通过 `setInterval()` 方法，每隔一秒钟调用一次 `ReactDOM.render()` 方法更新视图层。但是这样的更新方式未免太过繁琐，下面我们将介绍一种新的更新视图的方法，我们将学习如何正确地封装一个 `Clock` 组件，它将设置自己的计时器并按秒实现更新。

```js
class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			time: new Date(),
		};
	}

	render() {
		return (
			<div>
				<h1>这是一个 React 的时钟用例</h1>
				<h2>现在的时间是：{this.state.time.toLocaleTimeString()}</h2>
			</div>
		);
	}
}

ReactDOM.render(<Clock />, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/zYppqdQ?editors=0010 %}

在这里我们构造了一个简单的时钟的外观，我们在渲染函数里获取到组件自身的 `state.time` ，并将其转换成时间字符串展示在视图中。但是我们还缺少一个关键功能，那就是让时钟每秒钟更新一次。接下来，我们将通过这个 class 组件，来认识 React 的 class 组件中的**生命周期**。

## 初步了解生命周期

在具有许多组件的应用程序中，当组件被销毁时释放所占用的资源是非常重要的。
在我们的 `Clock` 组件第一次渲染到 DOM 中时，我们就要为其设置一个计时器，让它自动更新 `Clock` 的时间。这个阶段我们称之为 **“挂载（Mount）”** 。
当我们的 `Clock` 组件从 DOM 中移除时，我们应该清除这个计时器所占据的资源，防止内存泄露。这个阶段被称为 **“卸载（Unmount）”** 。
在 React 中，为 class 组件保留了一些特殊的方法，这些方法会在一个组件的特定阶段被调用，这些方法叫做**生命周期函数**。

以我们的 `Clock` 组件举例，我们来通过**生命周期函数**实现更新时钟状态。

`componentDidMount()` 方法会在组件已经被渲染到 DOM 后运行，因此，我们最好在这里设置计时器。

```js
componentDidMount() {
	this.tickInterval = setInterval(() => {
		this.setState({
			time: new Date(),
		});
	}, 1000);
}
```

我们将计时器保存在 `this` 当中（`this.tickInterval`）。
而我们将在 `componentWillUnmount()` 方法中清除这个计时器：

```js
componentWillUnmount() {
	clearInterval(this.tickInterval);
}
```

完整代码如下：

```js
class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			time: new Date(),
		};
	}

	componentDidMount() {
		this.tickInterval = setInterval(() => {
			this.setState({
				time: new Date(),
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.tickInterval);
	}

	render() {
		return (
			<div>
				<h1>这是一个 React 的时钟用例</h1>
				<h2>现在的时间是：{this.state.time.toLocaleTimeString()}</h2>
			</div>
		);
	}
}

ReactDOM.render(<Clock />, document.getElementById('root'));
```

{% pen https://codepen.io/ch1ny/pen/YzYYqaG?editors=0010 %}

这个时钟样例每秒都会实现刷新。
让我们来快速梳理一下在这段代码中都发生了什么：

1. 当我们通过 `ReactDOM.render()` 方法尝试将 `<Clock />` 组件渲染到 DOM 中去，React 会调用 `<Clock />` 的构造函数。
2. 在构造函数中， `<Clock />` 组件将一个对象 `{ time: new Date() }` 作为了 `this.state` 的初始值。
3. 之后 React 调用组件的 `render()` 方法，更新 DOM 来匹配 `<Clock />` 渲染的输出。
4. 当 `<Clock />` 的输出被插入到 DOM 中后，React 就会调用 `componentDidMount()` 生命周期方法。在这个方法中，`<Clock />` 组件向浏览器请求设置一个计时器来每秒调用一次 `setState` 方法来更新组件状态。
5. `setState()` 方法是 React 提供的更新 class 组件的 state 的函数，通过调用这个方法，React 能够了解到 state 已经发生了改变，会重新调用 `render()` 函数来确定页面上应该显示什么。对比前后两个视图的差别对 DOM 进行最小限度的更新以匹配 React 组件的当前状态。
6. 当 `<Clock />` 组件即将被从 DOM 中移除时，React 调用该组件的 `componentWillUnmount()` 方法，将计时器移除。

## 正确地使用 State

关于 React 组件的 State，你应当注意三件事：

### 不要直接修改 State

直接修改 state 是不会让组件重新渲染的：

```js
this.state.num = 0; // 这段代码不能更新组件的 state
```

只有在构造函数中才能通过为 `this.state` 直接赋值的方法来初始化 state 。在组件被渲染后应该使用 `setState()` 来更新组件状态。

```js
this.setState({ num: 0 });
```

### State 的更新可能是异步的

出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。
由于 `this.state` 和 `this.props` 的更新可能是异步的，因此建议不要依赖它们的值来更新下一个状态。
例如，以下代码可能无法更新计数器：

```js
this.setState({
	count: this.state.count + this.props.step,
});
```

要解决这个问题，可以让 `setState()` 接收一个函数而非一个对象。这个函数使用上一个 state 作为第一个参数，将此次更新被应用时的 props 作为第二个参数：

```js
this.setState((state, props) => ({
	count: state.count + props.step,
}));
```

### State 的更新会被合并

当调用 `setState()` 的时候，React 会把你提供的对象合并到当前的 state。
例如：

```js
constructor(props) {
	super(props)
	this.state = {
		name: undefined,
		age: 0
	}
}
```

你可以分别调用 `setState()` 来更新不同的状态：

```js
componentDidMount() {
	this.setState({
		name: '德布罗煜'
	})
	this.setState({
		age: new Date().getFullYear() - 2001
	})
}
```

> **注意：这里的合并是浅合并**
> 比如一个组件的 state 是 `{ a: {}, b: {} }`，当调用 `setState({a})` 时，React 会将 `state.b` 完整保留下来，但是把 `state.a` 整个替换掉。

## 单向数据流

在 React 中，数据是**向下流动**的。
不管是父组件还是子组件，都无法知道某个组件是有状态的还是无状态的，并且它们也并不关心。因此，我们说 state 是局部的（封装的），因为除了拥有并设置了它的组件，其他组件都无法访问。
一个组件可以选择将它的 state 通过 props 传递给它的子组件：

```js
<div>
	<Child name={this.state.child} />
</div>
```

`<Child />` 组件会在其 props 中接收参数 `name` ，但是子组件本身无法知道它是来自它的父组件本身的 state，还是父组件接收的 props 亦或是直接写死在代码中人为传递的。

> 这种数据流通常被称作“自上而下的”或是“单向的”数据流。任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。
