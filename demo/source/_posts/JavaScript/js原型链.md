---
title: js原型链
date: 2022-01-08 18:24:04
tags: JavaScript
categories: [编程]
cover: https://pic1.zhimg.com/v2-535e92c65ddaff1a55f11df10c680c75_720w.jpg?source=172ae18b
---

在前端的面试中，JS 的原型链可谓是一个经久不衰的问题了，翻看各大厂的前端面经你几乎都能看到原型链的身影。这篇文章中我就来归纳一下这个知识点。

<!-- more -->

<!-- toc -->

# 认识原型链

其实在前面的文章中，我们也已经多次提到了**原型链**这个名词，所谓**原型链**其实就是一条由 JavaScript 实例向原型不断延伸从而构成的一条链状结构。
让我们来复习一下我们前两篇文章中提到的**构造函数**、**原型**和**实例**之间的关系：
每个**构造函数**都会自动地创建一个**原型对象**，这个对象有一个叫做**constructor**的属性指回**构造函数**。我们可以使用**new**操作符通过**构造函数**创建一个**实例对象**，每个**实例**内部都有一个指针（主流浏览器中可以使用 **\_\_proto\_\_** 获取这个指针）指向**原型对象**。而此时，如果**原型对象**本身也是另一种类型的实例，那么这个原型对象的 **\_\_proto\_\_** 又指向了**另一个原型对象**，而这**另一个原型对象**也有一个**constructor**指针指向**另一个构造函数**。
就这样依次不断地向上溯源，最终能构成一条链状结构，这就是**原型链**的基本思想。
光看上面的文字似乎会非常得绕，所以下面我们来通过一段代码让大家更好地感受一下什么是原型链：

```js
// 构建一个父类
function Father() {}
Father.prototype.father = true;

/**
 * 构建一个子类构造函数
 * 子类的原型对象定义为一个父类的实例
 */
function Son() {}
Son.prototype = new Father();

// 子类实例化
const instance = new Son();
```

在上面这个例子中，`instance` 是 `Son` 的实例，因此它们之间具有这样的关系：

```js
instance.__proto__ === Son.prototype;
```

我们看到，`Son.prototype` 是一个 `Father` 的实例，因此它们之间又具有这样的关系：

```js
Son.prototype.__proto__ === Father.prototype;
Son.prototype.__proto__.constructor === Father;
```

我们把这两组关系结合起来，就能得到 `instance` 实例到我们写在代码中的最高类 `Father` 之间的关系：

```js
instance.__proto__.__proto__ === Father.prototype;
```

像这样，从**实例（instance）**向上，通过若干个 **\_\_proto\_\_** 组成的一条链，我们可以逐步建立起它到其所有父类之间的联系，这就是**原型链**。

# 默认原型

实际上，原型链中还存在一环。默认情况下，所有的引用类型都继承自 Object ，这也是通过原型链实现的。所有函数的默认原型都是一个 Object 实例，这意味着这个实例的一个内部指针指向了 Object.prototype ，而 Object.prototype 的 \_\_proto\_\_ 指针最终指向了 **null** 。因此，上面的例子中，还存在了一层额外的隐式的继承关系，我们来尝试将这条原型链补全：

```js
Father.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;
instance.__proto__.__proto__.__proto__.constructor === Object;
```

# 原型链的问题

通过上面的介绍，我们发现我们可以通过原型链来实现简单的继承，但是这样实现的继承也存在着问题。
首要问题就是当原型包含引用类型的时候，引用值会在所有实例之间共享，正如我们上一篇文章中提到的那样，因此我们通常在构造函数中为属性赋值，原型中只定义函数。
而且，在我们使用原型实现继承时，原型实际上是另一个类型的实例，这意味着其他类型中原本应该是实例的属性变成了原型的属性，就像我们下面给出的这个例子一样：

```js
function SuperClass() {
	this.arr = [0, 1, 2];
}

function SubClass() {}
SubClass.prototype = new SuperClass();

const instance1 = new SubClass();
console.log(instance1.arr); // [0,1,2]

const instance2 = new SubClass();
instance2.arr.push(3);

console.log(instance1.arr); // [0,1,2,3]
console.log(instance2.arr); // [0,1,2,3]
```

原型链的另一个问题是，子类在实例化时无法向父类的构造函数传参。即使非要传参，我们也不可能做到对不同的实例传递不同的参数。

结合上述两种问题，我们一般不会单独使用原型链来实现继承。
