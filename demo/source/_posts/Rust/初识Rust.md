---
title: 初识Rust
date: 2023-02-18 23:08:26
tags: [Rust]
categories: [编程]
cover: https://pic2.zhimg.com/v2-839798432500b3aec901cba0efb93bf7_720w.jpg?source=172ae18b
---

Rust 是目前一门较为热门的系统级编程语言，其具备着无GC、高性能、强工程性以及从语法保证的内存安全性等优势是一门非常值得学习的编程语言。我将通过这篇文章带着各位与 Rust 初次见面并学习如何通过 Rust 写出一个简单的 Hello World 程序。

<!-- more -->

<!-- toc -->

# 为什么要学习 Rust

Rust 是一种新的编程语言，它可以让每个人编写高效且可靠的软件。它被视作 C/C++ 的替代品，因为 Rust 具有同它们一样的性能，而且很多常见 bug 在编译时即可被解决。

Rust 是一种通用的编程语言，但是它更善于应付以下几种场景：

- 需要运行时的速度
- 需要内存安全
- Rust 可以更好地利用多处理器

## 与其他热门语言比较

我们这里可以将 Rust 与其他几门热门的编程语言相比：

- <b>C/C++</b>：它们的性能非常好，但是类型系统和内存都不太安全。
- <b>Java/C#</b>：它们拥有GC，可以保证内存安全，但是性能相对弱。

相比来说，Rust 的优势就非常大：

- 安全
- 无需GC，提高性能
- 易于维护、调试，代码安全高效

而 Rust 唯一的缺点就是 —— **“难学”**。
Rust 有很多独有的概念，它们和大部分主流语言不同，学习阶段需要注意。

## Rust 特别擅长的领域

- 高性能 Web Service
- WebAssembly
- 命令行工具
- 网络编程
- 嵌入式设备
- 系统编程

# 安装 Rust

首先，我们来到 [Rust 的官方网站](https://rust-lang.org/) 。

Windows 用户可以根据官网的指示完成 Rust 的安装。

如果是 Linux 或是 MacOS 的用户可以直接在终端中输入 `curl https://sh.rustup.rs -sSf| sh` 安装 `rustup` 。

如果是 Windows Linux 子系统的用户可以执行 `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` 完成安装。

> Rust 的更新与卸载：
> ```bash
> rustup update # 更新
> rustup self uninstall # 卸载
> ```

安装完毕后，可以在终端执行 `rustc --version` 指令打印安装的 rust 版本号来检查是否安装成功。

> 博主采用的开发工具是 VS Code，需要安装 Rust 插件以提升 Rust 开发体验。插件名为：`rust-analyzer`。

# 编写 Hello World

## 创建项目

当我们安装好 rust 后，来到我们的工作目录下。创建一个 `hello_world` 文件夹作为我们的 Hello World 程序的根目录，并创建好 `.rs` 文件。注意 rust 语言规范中文件及文件夹名应当采用**蛇形命名法**，即用**下划线（ _ ）**分割开来。

```bash
mkdir hello_world
cd hello_world
touch hello_world.rs
```

## 编写代码

Hello World 程序的代码非常简单，如下所示：

```rust
fn main() {
  println!("Hello World!");
}

```

在 rust 中，程序的入口函数名为 `main` 函数，定义函数则使用 `fn` 关键字。
这里打印字符串我们使用了 `println!` 方法。这里需要注意方法名后跟了一个**感叹号**，在 rust 中这种写法被称为 **宏（macro）** 。它提供了类似函数的功能，但是没有运行时开销。我们这里不去过多解读它，未来我们将对**宏**展开进行详细的介绍。

## 编译运行

下面我们对 Hello World 进行编译并执行。
首先，在根目录下执行如下指令：

```bash
rustc .\hello_world.rs
```

在 windows 平台下，该指令会将我们的 `hello_world.rs` 文件进行编译，并在根目录下生成可执行文件 `hello_world.exe` 和一个包含调试信息的 `hello_world.pdb` 文件。

> 如果是 Linux 或 MacOS，则会生成一个叫做 `hello_world` 的无后缀可执行文件。

接下来我们在终端中执行指令 `.\hello_world.exe` ，即可在控制台中输出 `Hello World!` 了。

# 使用 Cargo

恭喜你！你现在已经又熟练掌握了一门语言的 Hello World 了！（bushi

但是你是否觉得这样的开发步骤较为繁琐。`rustc` 只适合较为简单的 Rust 程序，而对一些较大的项目我们必须使用一些其他的工具，比如 `Cargo`。

## 认识 Cargo

Cargo 是 Rust 的构建系统以及包管理工具，它能够：
- 构建代码
- 下载依赖的库
- 构建这些库
- **...**

在安装 Rust 的时候会自动安装 Cargo 。要验证 Cargo 是否安装，可以执行 `cargo --version` 查看是否打印了 cargo 的版本号。

## 使用 Cargo 创建项目

下面，我们通过 Cargo 开发一个 **Hello Cargo** 应用。

首先执行下面的指令来创建名为 `hello_cargo` 的项目：

```bash
cargo new hello_cargo
```

上述指令将生成如下的项目目录结构：

```
hello_cargo  
└───src
    └───main.rs
└───.gitignore
└───Cargo.toml
```

其中 `src` 存放着我们的源代码，默认生成的 `main.rs` 中的代码如下：

```rust
fn main () {
  println!("Hello, world!");
}

```

## Cargo.toml

TOML(Tom's Obvious, Minimal Language) 是 Cargo 的配置格式。
`[package]` 是一个区域标题，表示下方的配置是用来配置包(package)的：
- name: 项目名
- version: 项目版本
- authors: 项目作者
- edition: 使用的 Rust 版本

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
authors = ["HanshinKira <1056317718@qq.com>"]
edition = "2021"
```

`[dependencies]` 是另一个区域的开始，它会列出项目的依赖项。在 Rust 中，代码的**包**（或者说**库**）被称为 **crate** 。

## 修改代码并编译执行

下面我们对 `src/main.rs` 内的代码做一点调整：

```rust
fn main () {
  println!("Hello, cargo!");
}

```

下面我们执行 `cargo build` 创建一个可执行文件。可执行文件将会位于 `hello_cargo/target/debug/hello_cargo.exe` 。

首次运行 `cargo build` 会在顶层目录生成一个 `cargo.lock` 文件。
- 该文件负责精确追踪项目依赖的具体版本
- 不要手动修改该文件

运行项目则只需要执行 `cargo run` 命令，该命令会执行**构建和运行**的操作。如果之前成功编译过，且源码未发生改变，则会直接运行之前的二进制文件。

## 开发时检查

假设我们开发了一个非常复杂的 Rust 应用，我们想要查看我们开发的源码中是否存在潜在的错误，我们可能会通过执行 `cargo build` 来查看能否通过编译。但是 `cargo build` 的时间可能会非常漫长。

这个时候我们就可以执行 `cargo check` 来检查我们的代码，确认是否能通过编译，但同时不会生成可执行文件。因此它要比 `cargo build` 快得多。

在我们编写代码时可以反复使用 `cargo check` 来检查代码，提高效率。

## 构建 release 版本

上面的编译指令是用于编译 debug 版本的，如果要投入发布使用，则需要在编译时加上 flag ，完整的指令为 `cargo build --release`，也可以简写为 `cargo build -r`。

它在编译时会进行优化，代码运行速度更快，但是编译时间也会更长。

它生成的可执行文件位于 `target/release/hello_cargo.exe`。
