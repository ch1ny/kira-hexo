---
title: 【Node.js学习】简单认识fs文件系统模块
date: 2022-04-02 21:03:53
tags: [Node.js]
categories: [编程]
---

在本文中，我们将对 Node.js 提供的 fs 文件系统模块进行初步的认识

<!-- more -->

<!-- toc -->

# fs 文件系统模块简介

**fs 模块**是 Node.js 官方提供的、用来操作文件的模块。它提供了一系列的方法和属性，用来满足用户对文件操作的需求。
例如：

-   <span style="color: deepskyblue;">fs.readFile()</span>方法，用来**读取**指定文件中的内容
-   <span style="color: deepskyblue;">fs.writeFile()</span>方法，用来向指定的文件中**写入**内容

如果要在 JavaScript 代码中使用 fs 模块来操作文件，则需要使用如下方法将它引入：

```js
const fs = require('fs');
```

# 使用 fs 文件系统模块

## 读取指定文件中的内容

### fs.readFile()的语法格式

使用 fs.readFile()方法，可以读取指定文件中的内容，语法格式如下：

```js
/**
 * @param {String} path 必选参数，字符串，表示需要读取的文件的路径
 * @param options 可选参数，以什么编码格式来读取文件
 * @param {Function} callback 必选参数，表示读取完文件后，可以通过该回调函数拿到读取的结果
 */
fs.readFile(path[, options], callback)
```

### fs.readFile()的示例代码

以 utf-8 的编码格式，读取指定文件的内容，并打印 err 和 data 的值

```js
const fs = require('fs');
fs.readFile('./text.txt', 'utf8', function (err, data) {
	console.log(err);
	console.log('------');
	console.log(data);
});
```

![执行结果](https://assets.kira.host/Pictures/Others/20220402212450.png)

也就是当文件读取成功时，`err`的值为`null`，而`data`则是读取的内容
那么此时我们将原本的文本文件删除，让我们尝试读取的文件并不存在，会发生什么呢？
![执行结果](https://assets.kira.host/Pictures/Others/20220402212716.png)
可以看到，当发生错误时，`err`值为一个保存了错误信息的对象，`data`的值为`undefined`。

### 判断文件是否读取成功

经过上面的示例代码，我们可以发现：

-   当文件读取成功时，`err`的值为`null`
-   当文件读取失败时，`err`的值为一个对象

因此，我们可以直接通过判断`err`来判断文件是否读取成功了。代码如下：

```js
const fs = require('fs');
fs.readFile('./text.txt', 'utf8', function (err, data) {
	if (err) {
		console.log('文件读取失败: ' + err.message);
	} else {
		console.log('文件读取成功: ' + data);
	}
});
```

## 向指定文件中写入内容

### fs.writeFile()的语法格式

使用 fs.writeFile()方法，可以向指定的文件中写入内容，语法格式如下：

```js
/**
 * @param {String} path 必选参数，字符串，表示需要写入的文件的路径
 * @param data 必选参数，表示需要写入的内容
 * @param options 可选参数，以什么编码格式来写入数据，默认utf8
 * @param {Function} callback 必选参数，表示写入完成之后执行的回调函数
 */
fs.writeFile(path, data[, options], callback)
```

### fs.writeFile()的示例代码

向指定文件中写入内容：

```js
const fs = require('fs');
fs.writeFile('./HelloNode.txt', 'Hello Node.js!', function (err) {
	console.log(err);
});
```

如果文件写入成功，则`err`的值为`null`（若文件不存在会自行创建文件并写入内容）。
如果文件写入失败（比如写入不存在的盘符），则`err`的值为一个错误对象。

### 判断文件是否写入成功

同 fs.readFile()的判断方法一样，我们只需要判断`err`的值能否转换为`true`就能判断出文件是否写入成功。

```js
const fs = require('fs');
fs.writeFile('./HelloNode.txt', 'Hello Node.js!', function (err) {
	if (err) {
		console.log('文件写入失败: ' + err.message);
	} else {
		console.log('文件写入成功');
	}
});
```

# 动态路径拼接问题

在使用 fs 等依赖于文件路径的模块时，我们必然会遇到动态路径拼接的问题。
当我们过度依赖诸如 `./` 或 `../` 这类相对路径时，可能会有某些文件的相对路径指向错误的情况发生。这是因为 Node.js 的相对路径依赖于执行脚本的终端执行命令时所在的位置。

举个例子，依旧是上面给出的 `fs.writeFile()` 的示例代码，假设它所在的目录为 `D:/src`。当我们在 `D:/src` 目录下打开终端，执行该脚本文件，它会在 `D:/src/HelloNode.txt` 中写入 `Hello Node.js!`。但当我们在 `D:/xxx/yyy` 目录下打开终端，执行命令如下：

```bat
D:/xxx/yyy>node D:/src/writeFile.js
```

它实际上会在 `D:/xxx/yyy` 目录下新建文件并写入内容。

因此，为了解决动态路径的拼接问题，我们可以采用绝对路径的写法来规避。但是绝对路径依旧存在相当的问题：它的可移植性和可维护性非常差，一段代码移植到其他电脑上可能就无法运行了。因此，绝对路径依旧不是解决这个问题的最好方法。

为了解决路径依赖的问题，Node.js 中引入了一个关键字`__dirname`。
它是一个字符串变量，表示当前模块所在的目录名。像上述代码，如果我们将其改为：

```js
const fs = require('fs');
fs.writeFile(`${__dirname}/HelloNode.txt`, 'Hello Node.js!', function (err) {
	if (err) {
		console.log('文件写入失败: ' + err.message);
	} else {
		console.log('文件写入成功');
	}
});
```

这样便能保障无论在什么地方执行这段脚本，都能在该脚本所在目录下写入文件。
