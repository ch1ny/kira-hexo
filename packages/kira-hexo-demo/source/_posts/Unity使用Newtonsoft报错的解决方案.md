---
title: Unity使用Newtonsoft报错的解决方案
date: 2021-11-26 21:12:31
tags: [Unity3D]
categories: [编程]
cover: https://tse1-mm.cn.bing.net/th/id/R-C.1c06375ca9292528fe62ed3c027090b7?rik=V9YxI7dFI9A3WA&riu=http%3a%2f%2fuploadfile.qikuedu.com%2f2019%2f0520%2f20190520104330150.jpg&ehk=cohtMwwyzbmXZI7ZW%2fQBo3NAw%2f5hkB%2fem9%2fnqDfRXDc%3d&risl=&pid=ImgRaw&r=0
---

最近在做人机交互课的实验，主要开发工具选择了 Unity3D 。把做好的项目通过 **git** 上传后，又用 `git clone` 了下来来测试项目上传是否成功。结果发现 clone 回来的项目，出现了一些问题。

<!-- more -->

<!-- toc -->

# Unity 使用 Newtonsoft 报错的解决方案

## 问题描述

在项目中，我用到了 **Newtonsoft.Json** 这个包来处理我需要的 Json 数据。

```csharp
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
```

在原项目中并没有出现什么问题（这里是因为之前设置了一些东西，具体我会在**解决方法**部分的**方法一**提到），但是在**克隆**回来的项目中 Unity3D 的控制台直接甩了个错误给我：
`The type or namespace name 'Newtonsoft' could not be found (are you missing a using directive or an assembly reference?)`
![在这里插入图片描述](https://img-blog.csdnimg.cn/481bd4a571584ed9b0222f2b59bcfd30.png)

这是因为 Json.NET 官方没有直接支持 Unity ，导致 Unity 无法找到正确的程序集。

## 解决方法

下面我将给出两种解决方案，两种方案都是可行的。

### 方法一：使用 Unity 的 Package Manager 自动导入

在 **Project** 标签页中，右键点击 **Packages**。
![在这里插入图片描述](https://img-blog.csdnimg.cn/ce4a3c81de7a4997a3141eba363f8f2b.png)
在打开的菜单栏中点击 **View in Package Manager** 。
![在这里插入图片描述](https://img-blog.csdnimg.cn/8a7f605ac9034b7986689808b6c8ab36.png)
在打开的 **Package Manager** 中，点击左上角的**加号**，选择通过名称添加。
![在这里插入图片描述](https://img-blog.csdnimg.cn/5facb010b9e34904b596fa077bb8487b.png#pic_center)
包名是 **com.unity.nuget.newtonsoft-json** ，我发这篇博客时，版本号为 **2.0.2**，各位读者也可以填该版本号，导入后 unity 会提示你进行更新。
![在这里插入图片描述](https://img-blog.csdnimg.cn/02b8e6a2adc243fa8c9ce9fee05ec5cf.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2d0ad8bec8544e28b7873d3a82ee0a0a.png)
添加成功后 Unity 的报错信息就消失了。

### 方法二：访问 GitHub 下载 unitypackage 文件手动导入

访问 GitHub 下载相应的支持 Unity 的 Newtonsoft.Json 资源包。[点我跳转](https://github.com/SaladLab/Json.Net.Unity3D/releases)
![在这里插入图片描述](https://img-blog.csdnimg.cn/3ccd69afc8ed4acbb89df49f40fdfc65.png)

选择需要的版本进行下载（由于我使用到了 `Newtonsoft.Json.Linq` ，因此我需要下载的是 `JsonNet.9.0.1.unitypackage` ）。
![在这里插入图片描述](https://img-blog.csdnimg.cn/e603d8a638d6423980fdf418d4dbdccd.png)
打开报错的 Unity 项目，双击下载好的 **unitypackage** 文件，使用 **Unity Editor** 打开。
![在这里插入图片描述](https://img-blog.csdnimg.cn/52bdfa6bef544914b123f3a9abfb96ba.png)
将所有包都勾选好点击“导入”即可。此时 Unity 会重新编译一遍脚本。
![在这里插入图片描述](https://img-blog.csdnimg.cn/9622959061f64ffd853ced64e275e3e9.png)
编译成功后你就会发现控制台里已经没有报错的信息了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/84963310156d4a0ca3b62d82dc0fd176.png)
