---
title: 【Fira Code】一款为程序员量身打造的字体
date: 2022-09-18 12:17:22
tags: [VSCODE]
categories: [编程]
cover: https://assets.kira.host/Pictures/Others/FiraCodeLogo.svg
---

今天给大家介绍一款非常炫酷的等宽字体—— **Fira Code**。

<!-- more -->

<!-- toc -->

# 什么是 Fira Code

Fira 是由 Mozilla 公司（也就是火狐浏览器的母公司）主推的字体系列，主打的就是具有 **等宽** 的属性。而 Fira Code 则在这一基础上加入了 **编程连字特性**，也就是 `Ligatures`。
Fira Code 利用这一特性，对编程人员常用的一些编程符号做了连字处理，将我们经常用到的诸如 `=>`、`<=`、`!=` 等超过一个字符的操作符渲染为对应的数学符号，使得我们能够更快地阅读理解代码。

## 预览

我们可以先来看一下在 VSCode 中使用 Fira Code 书写代码的效果。来看下面这一段代码：
```ts
/**
 * 这段 TypeScript 代码本身不具有任何意义
 * 只是为了展示 Fira Code 连字渲染的效果
 */
const func = (arr: Array<any>) => {
	for (let i = 0; i <= arr.length; i++) {
		let item = arr[i];
		if (typeof item === 'number') {
			while (item >= 10) {
				item /= 10; // 只是为了演示效果，别在意代码效率了...
			}
			console.log(`${arr[i]} ${item % 1 != 0 ? '不能' : '可以'} 被 10 整除`);
		}
	}
};

const arr = [1, 30, 24, 'afaa', undefined, 50];
func(arr);

```
下面是这段代码在 VSCode 中的效果图：
![TypeScript Fira Code 预览](https://assets.kira.host/Pictures/Others/20220918125944.png)

# 如何使用 Fira Code

本文下面将介绍如何在 VSCode 当中使用 Fira Code。

## 下载字体

首先，我们进入到 [Fira Code 官方仓库](https://github.com/tonsky/FiraCode) 中，找到 Releases，点击进入[最新的一次发布](https://github.com/tonsky/FiraCode/releases/latest)。
![FiraCode官方仓库](https://assets.kira.host/Pictures/Others/20220918123410.png)

## 安装字体

下载最新发布的 **Assets** 中的 **Fira_Code_v\*.\*.zip** ，这个是字体的压缩包。下载下来解压后，我们进入到其中的 `ttf` 文件夹，我们右键选中所有字体然后右键点击**安装**。
![安装字体](https://assets.kira.host/Pictures/Others/20220918124037.png)

## 设置字体

安装完毕后，我们就可以在 VSCode 中使用该字体了。我们进入到 `settings.json` 当中，在文件中加入这两行设置：
```json
{
    // ...
    "editor.fontFamily": "Fira Code",
    "editor.fontLigatures": true,
    // ...
}
```
这两行设置分别是设置编辑区字体以及是否开启连字符，添加这两行配置后就能够愉快地使用 Fira Code 进行编程了！