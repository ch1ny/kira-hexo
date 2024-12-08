---
title: 使用Vue和Electron开发一款简单的Markdown编辑器
date: 2021-12-16 21:13:21
tags: [Vue, electron]
categories: [编程]
---

> 本文并不涉及自己设计一套 Markdown 渲染组件的部分，Markdown 渲染组件可通过 **marked** 和 **highlight.js** 自行实现。但本文重点在于如何使用 Electron 和 Vue 打造一款桌面应用，因此 Markdown 渲染组件便不再重复造轮子，而是直接采用了 **mavon-editor**。
> **因此，如果是想要学习如何自己写一个 Markdown 文本渲染组件的读者不必在本文浪费过多时间。**

<!-- more -->

<!-- toc -->

# Electron

## 简介

**Electron** 是一款利用 JavaScript、HTML 和 CSS 开发跨平台桌面应用的开源框架。它内置了**Chromium** 内核和 **Node**，使得我们写的单页应用程序能够运行在桌面端的类浏览器平台中。因此，我们可以通过书写 Web 代码来实现桌面应用的 GUI 布局，也可以通过 JavaScript 调用 Node.js 提供的丰富的原生 API。
目前已经有非常多的应用使用 Electron 进行开发，其中最出名的莫过于几乎每个前端程序员都必定接触过的 **Visual Studio Code**。

## 安装

刚才我们也提到了，Electron 是基于 Node.js 运行的，首先你需要先在你的 PC 上安装好 Node。
在安装好 Node.js 后，我们打开终端，在终端中输入：

```bash
npm install -g electron # 全局安装 electron
```

安装完毕后，查看 Electron 的版本号检查是否安装成功：

```bash
electron -v
v16.0.4
```

当然你也可以不进行全局安装，只针对某一项目进行安装。接下来，我就将讲解如何使用 Electron 开发一款简单的 基于 Vue 的 Markdown 编辑器。

# 创建 Vue/Electron 项目

> 本文默认读者此时已具备 vue 基础，并且在开发环境中全局安装了 vue-cli 工具

打开终端，输入创建 Vue 项目的指令：

```bash
vue create typark # 创建名为 Typark 的 Vue 项目

cd typark # 进入 Typark 文件夹中
```

进入 Typark 文件夹后，我们可以通过输入 `yarn serve` 来启动 Vue 项目，我们便能通过浏览器进行访问。但我们的目的是要得到一份能够独立运行于桌面端的应用，那么自然不能通过这种方式实现。因此，我们需要给这个项目添加上 Electron 依赖。我们打开终端，在终端中敲入命令：

```bash
vue add electron-builder
```

在安装完毕后，我们可以在项目的 `package.json` 文件中看到安装的所有依赖了。并且在 `scripts` 字段下多出了几条启动项：

```json
scripts: {
	// ... ,
    "elect": "electron .",
    "electron:build": "vue-cli-service electron:build",
    "electron:serve": "vue-cli-service electron:serve",
    "postinstall": "electron-builder install-app-deps",
    "postuninstall": "electron-builder install-app-deps"
}
```

package 的 `main` 字段也变成了 `background.js`。我们前往项目的 `src` 文件夹下，就能看见该文件，它将作为 Electron 应用的入口文件。
此时我们的依赖已经安装成功了，其中当我们在控制台中敲入 `yarn electron:serve` 时，就会使用 Electron 自动开启项目。
![electron](https://img-blog.csdnimg.cn/c14c38ecaa704c81bf8a7997a21fa942.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP5qCX5bi95LuK5aSp5ZCD5LuA5LmI,size_20,color_FFFFFF,t_70,g_se,x_16)

致此，我们已经成功建立起了一个基于 vue 的 electron 项目，我们可以进入到下一阶段了。

> 在启动项目时，很有可能会遇到这样的问题：控制台中一直在打印如下的字符串：
>
> ```bash
> Launching Electron...
> Failed to fetch extension, trying 4 more times
> Failed to fetch extension, trying 3 more times
> Failed to fetch extension, trying 2 more times
> Failed to fetch extension, trying 1 more times
> ```
>
> 虽然就结果而言，项目终究还是成功启动了，但是每次这样启动都会花费很长的时间。
> 这是由于我们处于开发模式下，electron 在启动的时候会安装一遍 `Vue Devtools` ，而我们因为网络中一些不可明说的原因连接不上。不过这个工具并不是很重要，因此我这里给出一个解决方案：
> 进入 `background.js` 文件中，找到 `// Install Vue Devtools` 注释，将它下面的安装代码全部注释掉，就像这样：
>
> ```js
> if (isDevelopment && !process.env.IS_TEST) {
> 	// Install Vue Devtools
> 	// try {
> 	//   await installExtension(VUEJS_DEVTOOLS)
> 	// } catch (e) {
> 	//   console.error('Vue Devtools failed to install:', e.toString())
> 	// }
> }
> ```
>
> 这样一来，我们就可以跳过安装环节，快速启动应用了。

# background.js

位于 **src** 文件夹下的 **background.js** 是 electron 应用的入口文件，我们可以在这里书写一些 Node 代码来调控整个 electron 应用的窗口。
先让我们将注意力聚焦在其中的 `async function createWindow()` 上吧，在这个异步方法中，书写了 electron 创建一个窗口时所作的工作。

```js
async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
		},
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		win.loadURL('app://./index.html');
	}
}
```

首先通过 `new BrowserWindow` 实例化一个浏览器窗口类，在实例化时向窗口类中传递一个写有窗口参数的 json 对象。创建完毕后，判断当前是否处在开发模式下，并根据不同状态向 `BrowserWindow.loadURL` 中传入不同的 url ，让之前初始化的浏览器窗口加载不同的页面。
接下来，我们回到 **background.js** 的顶部，我们看到，除了在 `createWindow` 中使用过的 `BrowserWindow`，我们还从 `electron` 中引入了 `app` 模块，我们可以通过这个模块监听和控制整个 electron 应用。我们向下滑动代码，在 `createWindow` 方法下，有几个形如 `app.on('',()=>{})` 的代码块。这里的 `app.on` 则是为 electron 应用注册事件监听。举个例子：

```js
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
```

这一段代码，是在监听 `window-all-closed` 这个事件，当应用的所有窗口都被关闭后，如果程序运行的平台不是在 MacOS 上，那么就调用 `app.quit()` 终止程序的运行。

> MacOS 中，即使关闭所有窗口，程序一般还是会继续运行，直到用户通过 Cmd + Q 的组合键明确终止应用运行

一个基础的 background.js 就是这些内容，后续我还将在开发这款应用时继续介绍一些新的内容。

# 无窗口应用

有没有觉得之前给大家展示的 electron 的截图中，这个窗口很弱？
![在这里插入图片描述](https://img-blog.csdnimg.cn/c7b37ec1cfb745d6af58a65ba65af523.png)
有没有觉得这种默认窗口很单调，完全没有新鲜感？想不想自己设计一个窗口来替代这个原本的窗口？如果你觉得是，那么好的，我将教会你如何使用 electron 打造一款 “无窗口应用” 。
让我们前往 **background.js** 中，来到之前我们讨论过的 `createWindow` 方法下。我们来手动为 BrowserWindow 添加一些配置，以使其达到消除边框的效果。我们给它添加一行代码 `frame: false` ，表示我们不想使用系统的默认窗口。添加完后，我们再次启动项目，就会发现原来的窗口边框已经消失不见了。
![无边框窗口](https://img-blog.csdnimg.cn/e27c71d9923b4b078ff106352bd954ca.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP5qCX5bi95LuK5aSp5ZCD5LuA5LmI,size_20,color_FFFFFF,t_70,g_se,x_16)
接下来我们就可以自己设计一个独特的窗口和菜单栏了。
为了加快开发进度，我们不再重复造轮子，直接向项目中引入 **ElementUI**，引入方法可参见 **ElementUI** 的[官方文档-安装](https://element.eleme.cn/#/zh-CN/component/installation)。
我们先将 App.vue 中的内容清空，呈现一个空白页面。下面我们就可以开始书写我们的顶部边栏了。

```html
<template>
	<div id="app">
		<header class="head">
			<img src="./assets/logo.png" alt=" " id="windowLogo" />
			<span>Typark</span>
			<button class="windowBtn" id="closeWindowBtn">
				<i class="el-icon-close" />
			</button>
			<button class="windowBtn" id="resizeBtn">
				<i :class="maxSize?'el-icon-copy-document':'el-icon-full-screen'" />
			</button>
			<button class="windowBtn" id="miniSizeBtn">
				<i class="el-icon-minus" />
			</button>
		</header>
	</div>
</template>

<script>
	export default {
		name: 'App',
		data() {
			return {
				maxSize: false, // 当前窗口是否最大化
			};
		},
	};
</script>

<style>
	* {
		margin: 0%;
	}

	#app {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	/* 应用图标 */
	#windowLogo {
		width: 2.5em;
		height: 2.5em;
		vertical-align: top; /* 这里只要不是 baseline 就行，防止 img 与 span 垂直方向不在同一水平线上 */
	}

	/* 绘制一个好看一点的滚动条 */
	::-webkit-scrollbar {
		width: 6px;
	}

	::-webkit-scrollbar-thumb {
		background-color: #a8a8a8;
		border-radius: 3px;
	}

	.head {
		width: 100vw;
		font-size: 12px;
		height: 2.5em;
		line-height: 2.5em;
		background-image: linear-gradient(to right, #b9b9b9 0%, #ffffff 75%); /* 绘制渐变 */
		position: relative;
		z-index: 9999; /* 防止其他 dom 元素覆盖在顶部边栏上方 */
	}

	.windowBtn {
		float: right;
		height: 2.25em;
		width: 3em;
		line-height: 2.5em;
		border: none;
		background: rgba(0, 0, 0, 0);
		outline: none;
	}

	.windowBtn:hover {
		cursor: pointer;
	}

	#miniSizeBtn:hover {
		background-color: #e0e0e0;
	}

	#resizeBtn:hover {
		background-color: #00a2ff;
		color: white;
	}

	#closeWindowBtn:hover {
		background-color: red;
		color: white;
	}
</style>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a2abaf13e9654c9d9642a9d75ea4e454.png)

这样一来我们就为我们的应用创建了一个顶部边栏。但是但是但是！我们现在惊讶地发现一件事情：我们没有办法拖动这个窗口，而且还会莫名其妙的选中顶部边栏的文字，甚至连 logo 的 img 都可以被拖拽！
![在这里插入图片描述](https://img-blog.csdnimg.cn/5a9988631b3440a29d0b54eaddea7252.png)
这么看起来，这似乎是个愚蠢到极致的顶部边栏，但其实我们只需要添加几行 css 代码，就可以完美解决上述问题：

-   **顶部边栏的文字会被选中**：为 `.head` 添加 `user-select: none`
-   **窗口无法被拖动**：为 `.head` 添加 `-webkit-app-region: drag` ，同时，为了防止用户通过右上角三个按钮也能拖拽窗口，我们还需要为 `.windowBtn` 添加 `-webkit-app-region: no-drag`
-   **应用 logo 会被拖拽出来**：为 `.head img` 添加 `-webkit-user-drag: none`

添加完上述 css 代码后，我们就将这个 “愚蠢的顶部边栏” 修改成了 “没那么愚蠢的顶部边栏”。
我们还要让这个顶部边栏负起它需要承担的责任：控制窗口的缩放和关闭。这里我们就需要引入一个新的 electron 模块了—— **electron.ipcRenderer**。

## contextIsolation

接下来，我们需要前往 **background.js** 中，继续为 BrowserWindow 添加新的属性。在 BrowserWindow 中，我们有这样一条字段：`webPreferences`。我们直接将其修改为下面的形式：

```json
webPreferences: {
	webSecurity: false, // 禁用同源政策
	nodeIntegration: true, // 启用 Node 集成
	contextIsolation: false, // 禁用上下文隔离
}
```

**contextIsolation** 这个属性是为了确保我们的 `预加载脚本` 和 Electron 的内部逻辑在一个单独的上下文中运行到我们加载的网页，这样一来我们加载的网页页面就无法直接调用 Node 相关的 API。
我们将这条属性设置为 `false`，表示不需要进行上下文隔离，这样一来，我们就可以在 vue 页面中，调用 electron 模块了。

## ipcRenderer 通信

因为 electron 应用的窗口是由 **background.js** 控制的，我们要通过 vue 实现控制窗口必须要想办法与 **background.js** 进行通信，那么 **electron.ipcRenderer** 就成为了我们的首选。我们先为 **background.js** 书写几个接收器。

```js
async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({...});
	//接收渲染进程的信息
	const ipc = require('electron').ipcMain;

	// 接到 'min' 信息
	ipc.on('min', function () {
		win.minimize(); // 窗口最小化
	});

	// 接到 'max' 信息
	ipc.on('max', function () {
		if (win.isMaximized()) { // 判断窗口是否最大化
			win.unmaximize(); // 窗口取消最大化
		} else {
			win.maximize(); // 窗口最大化
		}
	});
	ipc.on('close', function () {
		win.destroy(); // 摧毁窗口
	})
}
```

接下来，我们给 vue 页面中的按钮添加几个方法：

```html
<template>
	<div id="app">
		<header class="head">
			/* ... */
			<button class="windowBtn" id="closeWindowBtn" @click="closeWindow">
				<i class="el-icon-close" />
			</button>
			<button class="windowBtn" id="resizeBtn" @click="resizeWindow">
				<i :class="maxSize?'el-icon-copy-document':'el-icon-full-screen'" />
			</button>
			<button class="windowBtn" id="miniSizeBtn" @click="minWindow">
				<i class="el-icon-minus" />
			</button>
		</header>
	</div>
</template>

<script>
	const electron = window.require('electron'); // 导入 electron

	export default {
		// ... ,
		methods: {
			closeWindow() {
				electron.ipcRenderer.send('close');
			},
			minWindow() {
				electron.ipcRenderer.send('min'); // 通过 ipcRenderer 发送 min 消息
			},
			resizeWindow() {
				electron.ipcRenderer.send('max'); // 通过 ipcRenderer 发送 max 消息
			},
		},
	};
</script>
```

现在，我们的窗口就能成功实现最小化最大化以及关闭窗口的功能了。
接下来，我们还需要让 vue 能够知道每一次的窗口变化，以及时更新 `data` 中的 `maxSize`。
还记得我们之前讨论过的 `win.on` 吗？实际上，窗口大小的改变它也是能够监听的：

```js
async function createWindow() {
	const win = new BrowserWindow({ ... });
	// ...
	win.on('resize', () => {
		win.webContents.send('resize', win.isMaximized())
	})
}
```

这里我们让窗口监听 **resize** 事件，每当发生大小改变时，就将窗口是否最大化作为载荷，使用 `win.webContents.send` 发送 resize 事件给 **win** 窗口所加载的 **SPA**。
这样一来，我们还需要在 vue 页面中接收这条 resize 消息。

```js
created() {
	// 当 vue 页面创建完成后直接进行事件监听
	electron.ipcRenderer.on("resize", (event, params) => {
		if (this.maxSize !== params) {
			this.maxSize = params;
			localStorage.setItem("maxSize", params);
		}
	})
}
```

这样一来，我们的 vue 页面就可以随时获取窗口大小的变化，并根据当前窗口是否最大化来切换右上角的按钮图标了。

# 引入 Mavon-editor

虽然自己通过 **marked** 和 **highlight.js** 也能实现一个简单的 Markdown 文本渲染组件，但效果终究比不过其他较为成熟的开源组件。因此，我们这里直接使用一款基于 **Vue** 的强大的开源 Markdown 编辑器 —— **mavon-editor** 。

```bash
yarn add mavon-editor # 为项目添加 mavon-editor 依赖
```

接下来我们修改 Vue 项目的 main.js ：

```js
// ...
import mavonEditor from 'mavon-editor'; // 引入 mavon-editor 组件
import 'mavon-editor/dist/css/index.css'; // 引入 mavon-editor 需要的样式文件

Vue.use(mavonEditor); // Vue 全局注册组件
```

现在我们就可以在项目中使用该组件了。我们现在来修改一下项目的 GUI。
我们为 App 添加一个身体分区，里面放置菜单栏和我们的 mavon-editor 组件。

```html
<template>
	<div id="app">
		<header class="head">
			<img src="./assets/logo.png" alt=" " id="windowLogo" />
			<span
				>Typark{{filePath?' - ' + filePath.split("/")[filePath.split("/").length -
				1]:''}}</span
			>
			<button class="windowBtn" id="closeWindowBtn" @click="closeWindow">
				<i class="el-icon-close" />
			</button>
			<button class="windowBtn" id="resizeBtn" @click="resizeWindow">
				<i :class="maxSize?'el-icon-copy-document':'el-icon-full-screen'" />
			</button>
			<button class="windowBtn" id="miniSizeBtn" @click="minWindow">
				<i class="el-icon-minus" />
			</button>
		</header>
		<div class="body">
			<!-- 菜单工具栏，现在先不添加功能 -->
			<div class="toolbars">
				<el-dropdown size="mini" trigger="click" placement="bottom-start">
					<button>文件(F)</button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="open">打开</el-dropdown-item>
						<el-dropdown-item command="save" :disabled="rawText===''" :divided="true"
							>另存为</el-dropdown-item
						>
						<el-dropdown-item command="html" :disabled="rawText===''" :divided="true"
							>导出为HTML</el-dropdown-item
						>
					</el-dropdown-menu>
				</el-dropdown>
			</div>

			<!-- 主体部分，放置 mavon-editor 组件 -->
			<div
				class="main"
				v-loading="outputing"
				element-loading-text="拼命导出中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			>
				<mavon-editor
					style="height: 100%; width: 100%;"
					:toolbars="markdownOption"
					v-model="rawText"
					ref="md"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		// ... ,
		data() {
			return {
				// ... ,
				rawText: '', // markdown 源码
				outputing: false, // 正在导出
				markdownOption: {
					// mavon-editor 配置
					bold: true, // 粗体
					italic: true, // 斜体
					header: true, // 标题
					underline: true, // 下划线
					strikethrough: true, // 中划线
					mark: true, // 标记
					superscript: true, // 上角标
					subscript: true, // 下角标
					quote: true, // 引用
					ol: true, // 有序列表
					ul: true, // 无序列表
					link: true, // 链接
					imagelink: true, // 图片链接
					code: true, // code
					table: true, // 表格
					fullscreen: false, // 全屏编辑
					readmodel: false, // 沉浸式阅读
					htmlcode: false, // 展示html源码
					help: true, // 帮助
					/* 1.3.5 */
					undo: true, // 上一步
					redo: true, // 下一步
					trash: true, // 清空
					save: true, // 保存（触发events中的save事件）
					/* 1.4.2 */
					navigation: true, // 导航目录
					/* 2.1.8 */
					alignleft: true, // 左对齐
					aligncenter: true, // 居中
					alignright: true, // 右对齐
					/* 2.2.1 */
					subfield: false, // 单双栏模式
					preview: false, // 预览
				},
			};
		},
	};
</script>

<style>
	/* ... */
	.body {
		width: 100%;
		height: calc(100% - 2.5em);
		overflow: hidden;
	}

	.toolbars {
		height: 1.5em;
		user-select: none;
	}

	.toolbars button {
		height: 1.5em;
		border: none;
	}

	.toolbars button:hover {
		background: #e0e0e0;
	}

	.el-dropdown-menu {
		user-select: none;
	}

	.main {
		-webkit-app-region: no-drag;
		width: 100vw;
		height: calc(100vh - 4em);
		overflow-x: hidden;
		overflow-y: overlay;
	}

	.markdown-body img {
		max-height: 100%;
	}
</style>
```

这么一来，我们的应用的界面就绘制完成了。让我们来看看效果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/863ea2ec7aae44349d02c6c0ca85264c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP5qCX5bi95LuK5aSp5ZCD5LuA5LmI,size_20,color_FFFFFF,t_70,g_se,x_16)
嗯，显示效果不错，现在让我们为它添加一些功能，让它能够更加贴近实用吧。

# electron 操作本地文件

我们首先来为应用的菜单栏添加一些功能接口。
我们先修改一下菜单栏的代码：

```html
<template>
	<!-- ... -->
	<el-dropdown size="mini" trigger="click" placement="bottom-start" @command="fileCommand">
		<button>文件(F)</button>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item command="open">打开</el-dropdown-item>
			<el-dropdown-item command="save" :disabled="rawText===''" :divided="true"
				>另存为</el-dropdown-item
			>
			<el-dropdown-item command="html" :disabled="rawText===''" :divided="true"
				>导出为HTML</el-dropdown-item
			>
		</el-dropdown-menu>
	</el-dropdown>
	<!-- ... -->
</template>

<script>
	export default {
		// ... ,
		methods: {
			// ... ,
			fileCommand(command) {
				switch (command) {
					case 'open': {
						// 打开 markdown 文件
						electron.ipcRenderer.send('openFile');
						break;
					}
					case 'save': {
						// 另存为
						if (this.rawText) {
							electron.ipcRenderer.send('saveNewFile', this.rawText);
						}
						break;
					}
					case 'html': {
						// 导出 html 文件
						this.outputing = true;
						let filename = '';
						if (this.filePath) {
							filename =
								this.filePath.split('\\')[this.filePath.split('\\').length - 1];
							filename = filename.substring(0, filename.lastIndexOf('.'));
						}
						electron.ipcRenderer.send('saveAsHtml', filename, this.$refs.md.d_render);
						break;
					}
				}
			},
		},
	};
</script>
```

接下来我们将为 electron 应用书写监听方法。在这之前我们需要先为项目添加一些依赖：

```bash
yarn add fs-extra
```

## 打开 markdown 文件

该功能用于选择本地的 markdown 文件，并将文件的文件名以及内容发送给 vue 页面，将数据展示在页面中。我们在 **background.js** 中，为 **ipc** 添加一个打开文件的监听事件：

```js
import { app, protocol, BrowserWindow, dialog } from 'electron';
import fs from 'fs-extra'; // 使用fs模块
import path from 'path';

async function createMainWindow() {
	// ...
	const ipc = require('electron').ipcMain;
	// ...
	ipc.on('openFile', () => {
		dialog
			.showOpenDialog({
				// 通过 dialog 模块显示 “打开文件” 对话框
				properties: ['openFile'], // 参数选择打开文件
				filters: [
					{
						name: 'Markdown File',
						extensions: [
							'md',
							'markdown',
							'mmd',
							'mkd',
							'mdwn',
							'mdown',
							'mdx',
							'mdtxt',
							'apib',
							'rmarkdown',
							'rmd',
							'txt',
							'text',
						],
					},
				], // 文件类型过滤器，只留下 markdown 文件
			})
			.then((res) => {
				if (res && res.filePaths && res.filePaths.length > 0) {
					// 如果选择了文件
					fs.readFile(res.filePaths[0], 'utf8', (err, data) => {
						// 通过 fs-extra 读取文件内容
						if (err) {
							// 读取失败
							win.webContents.send('openedFile', -1);
						} else {
							// 读取成功，将内容发送给 vue 项目
							win.webContents.send('openedFile', 0, res.filePaths[0], data);
						}
					});
				}
			});
	});
}
```

现在我们需要在 vue 页面中添加对应的监听。由于后续我们还需要添加更多的监听事件，因此，为了维护方便，我们不再将创建监听的函数写在 `created` 中，而是单独为他们创建一个方法：

```js
export default {
	// ... ,
	methods: {
		// ... ,
		initIpcRenderers() {
			electron.ipcRenderer.on('resize', (event, params) => {
				if (this.maxSize !== params) {
					this.maxSize = params;
					localStorage.setItem('maxSize', params);
				}
			});
			electron.ipcRenderer.on('openedFile', (e, status, path, data) => {
				if (status === 0) {
					this.filePath = path;
					this.rawText = data;
					this.initRawText = data;
				} else {
					console.log('读取失败');
				}
			});
		},
	},
	created() {
		this.initIpcRenderers();
	},
};
```

现在，我们就可以通过点击 **文件 - 打开** 按钮，打开本地的 markdown 文件了。同时，打开后的文件名也将呈现在标题栏中。

## 另存为新文件

有了打开文件，那么我们还需要一个写入本地文件的 API。

```js
ipc.on('saveNewFile', (event, data) => {
	dialog
		.showSaveDialog({
			// 通过 dialog 模块打开 保存文件 对话框
			title: '文件另存为',
			defaultPath: path.join(
				__dirname,
				`${data
					.replace(
						/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g,
						''
					)
					.substring(0, 10)}.md`
			), // 默认文件保存路径
			filters: [
				{
					name: 'Markdown File',
					extensions: [
						'md',
						'markdown',
						'mmd',
						'mkd',
						'mdwn',
						'mdown',
						'mdx',
						'mdtxt',
						'apib',
						'rmarkdown',
						'rmd',
						'txt',
						'text',
					],
				},
			], // 文件类型过滤器，只保留为 markdown 文件
		})
		.then((res) => {
			if (res && res.filePath) {
				fs.writeFile(res.filePath, data, 'utf8', (err) => {
					if (err) {
						win.webContents.send('savedNewFile', -1);
					} else {
						// 写入成功，返回保存路径
						win.webContents.send('savedNewFile', 0, res.filePath);
					}
				});
			}
		});
});
```

## 导出为 HTML

```js
ipc.on('saveAsHtml', (event, filename, data) => {
	let htmlpath;
	if (filename) {
		// 如果当前文件存在，直接用文件名作为 html 的文件名
		htmlpath = path.join(__dirname, filename);
	} else {
		// 否则从渲染的 html 文本中提取
		htmlpath = path.join(
			__dirname,
			`${data
				.replace(
					/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g,
					''
				)
				.substring(0, 10)}.html`
		);
	}
	dialog
		.showSaveDialog({
			title: '导出为HTML',
			defaultPath: htmlpath,
			filters: [{ name: 'HTML', extensions: ['html'] }],
		})
		.then((res) => {
			if (res) {
				if (res.canceled) {
					mainWindow.webContents.send('savedAsHtml', -1);
				} else if (res.filePath) {
					const title = res.filePath.split('\\')[res.filePath.split('\\').length - 1];
					// 此处写入基本的 html 代码，其中包含了需要的 css 样式文件
					let html = `<!doctype html>\n<html>\n<head>\n<meta charset='UTF-8'><meta name='viewport' content='width=device-width initial-scale=1'>\n<link href="https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css" rel="stylesheet">\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/github.min.css" id="md-code-style">\n<title>${title}</title>\n</head>\n<body>\n<div class="markdown-body">\n${data}\n</div>\n</body>\n</html>`;
					fs.writeFile(res.filePath, html, 'utf8', (err) => {
						if (err) {
							mainWindow.webContents.send('savedAsHtml', 1, err);
						} else {
							mainWindow.webContents.send('savedAsHtml', 0);
						}
					});
				}
			}
		});
});
```

## 编辑时保存文件

**mavon-editor** 为我们保留了一个保存文件的接口，可以通过快捷键 `Ctrl + S` 触发（也可以通过按钮触发，但是我们在 `markdownOptions` 中将它隐藏了），但是具体的逻辑需要我们自己来实现。
首先，我们为 mavon-editor 添加上保存方法的钩子：

```html
<mavon-editor @save="save" />
```

```js
save() {
	if (this.filePath) { // 如果此时打开的是本地文件，则进行保存操作
		window.electron.ipcRenderer.send(
			"saveFile",
			this.filePath,
			this.rawText
		);
	} else if (this.rawText) { // 否则进行另存为操作
		window.electron.ipcRenderer.send("saveNewFile", this.rawText);
	}
},
```

我们已经写好了另存为操作的 ipc 监听，现在我们再加上一个保存已有文件的监听：

```js
ipc.on('saveFile', (event, path, data) => {
	fs.writeFile(path, data, 'utf8', (err) => {
		if (err) {
			win.webContents.send('savedFile', -1);
		} else {
			win.webContents.send('savedFile', 0);
		}
	});
});
```

这样，我们就完成了一个基本的能够实现读写 markdown 文件的编辑器。

## 导入本地图片

这里需要特别注意这个功能！各位读者如果有耐心阅读到了这里，不妨尝试一下利用 **mavon-editor** 向你的 markdown 源码中添加一张本地的图片试试，你会发现本地的图片是无法解析的。这里我不做过多赘述，简单说明一下解决方法：这个问题是因为 XSS 防御过滤掉了高危属性，你可以为 **mavon-editor** 标签添加 `:xssOptions="false"` 属性关闭 XSS 来解决这个问题。
同时，当通过粘贴的方式添加本地图片时，由于图片本身不存在本地，我建议为图片做一份备份，放置在 electron 应用的安装目录下。接下来我们来实现这一功能。

```html
<mavon-editor @imgAdd="imgAdd" />
```

```js
export default {
	// ... ,
	methods: {
		// ... ,
		imgAdd(filename, imgfile) {
			if (imgfile.path !== '') {
				this.rawText = this.rawText.replace(
					`![${imgfile._name}](${filename})`,
					`![${imgfile._name}](${imgfile.path.replace(/\\/g, '/')})`
				);
			} else {
				electron.ipcRenderer.send(
					'pastePicture',
					imgfile.miniurl.split(',')[1],
					imgfile.type.split('/')[1],
					new Date().valueOf(),
					filename,
					imgfile._name
				);
			}
		},
	},
};
```

```js
// background.js
ipc.on('pastePicture', (event, imgdata, imgtype, timestamp, filename, tagname) => {
	let destpath; // 定义 目标路径 变量
	if (process.env.NODE_ENV === 'development') {
		// 处于开发模式下
		destpath = path.join(__dirname, 'user-images');
	} else {
		destpath = path.join(__dirname, '../user-images');
	}
	const dirExists = fs.pathExistsSync(destpath); // 判断文件夹是否存在
	if (!dirExists) {
		fs.mkdirSync(destpath); // 若不存在则创建该文件夹
	}
	let exists = fs.existsSync(path.join(destpath, `typark${timestamp}.${imgtype}`));
	while (exists) {
		exists = fs.existsSync(path.join(destpath, `typark${++timestamp}.${imgtype}`)); // 如果文件重名，时间戳加一，直到不出现重名为止
	}
	fs.writeFile(
		path.join(destpath, `typark${timestamp}.${imgtype}`),
		Buffer.from(imgdata, 'base64'),
		(err) => {
			if (err) {
				mainWindow.webContents.send('pastedPicture', -1);
			} else {
				// 写入成功后返回 markdown 源码中的图片信息以及保存后的图片路径用于替换
				mainWindow.webContents.send(
					'pastedPicture',
					0,
					path.join(destpath, `typark${timestamp}.${imgtype}`),
					filename,
					tagname
				);
			}
		}
	);
});
```

# 结尾

致此，我们已完成了一个简单的 markdown 文本编辑器的搭建。如果各位读者觉得对你有帮助的话，不妨来访问一下我对于这个应用的正式仓库：

-   **github**： [Typark](https://github.com/AioliaRegulus/Typark)
-   **gitee**： [Typark](https://gitee.com/ch1ny/typark)

这里有更加完善的功能，如果喜欢请帮忙点一颗小星星吧 ^ \_ ^ ，感谢您的阅读！
