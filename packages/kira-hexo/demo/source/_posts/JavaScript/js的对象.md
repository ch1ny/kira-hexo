---
title: js的对象
date: 2022-01-07 18:31:13
tags: JavaScript
categories: [编程]
cover: https://pic1.zhimg.com/v2-535e92c65ddaff1a55f11df10c680c75_720w.jpg?source=172ae18b
---

从事 web 前端开发的你，在学习 js 的过程中一定听说过这样一句话：

> 在 JavaScript 中，万物皆对象。

在这篇文章中，我们将会介绍一下 JS 中的对象。

<!-- more -->

<!-- toc -->

# 理解对象

ECMA-262 将对象定义为一组属性的**无序**集合。这些属性在一个对象中不存在特定的顺序，每个属性及函数都由一个名称进行标识，每个名称都会映射到对应的值。我们可以将 JS 的对象想象成一张散列表，散列表的键就是对象的属性名称，每个键都对应了该属性名称到具体内容的映射。

如其他面向对象设计的高级程序语言一样，JS 的对象所代表的的也是一个指向该对象在内存空间中的地址的指针，而对象中的具体数据存放在内存空间中的其他位置。因此，我们可以使用 **const** 来定义一个对象，并在不改变指向该对象的变量的值的情况下，改变对象内部的数据。

## 简单对象的创建

在 JavaScript 中，创建自定义对象的方式非常简单，比如通过下面这段代码，你就能够创建一个 JS 对象。

```js
const obj = {};
```

而正规的做法一般是通过创建一个 **Object** 实例来创建对象，并给它添加一些属性和方法。正如下面的代码所示：

```js
const mySelf = new Object();
mySelf.name = '德布罗煜';
mySelf.getAge = function () {
	console.log(`${this.name}现在是${new Date().getFullYear() - 2001}周岁。`);
};
```

上面这段代码声明了一个叫做 `mySelf` 的对象，并且具有一个 `name` 属性和一个 `getAge` 方法。
调用 `mySelf.getAge()` 方法会打印出**德布罗煜**现在的年龄。
我们也可以根据上面更简洁的代码定义一个相同的对象：

```js
const mySelf = {
	name: '德布罗煜',
	getAge() {
		console.log(`${this.name}现在是${new Date().getFullYear() - 2001}周岁。`);
	},
};
```

这种使用**对象字面量**来创建对象的方式因其简洁而备受推崇，上面两种创建方式创建的对象在行为上是等价的。

# 创建对象

通过上面的学习，我们已经学会通过实例化 Object 以及对象字面量的方式创建简单对象了。但是这些方法仍有一个非常明显的不足：**无法复用**。
也就是说，当我们想创建多个拥有相同属性名称的对象，我们不得不重复书写代码。因此，接下来我们将介绍新的对象创建方式。

我们先来简单了解一下 JS 的面向对象的历史。时至今日，ECMAScript 规范已经发布了诸多个版本，每次版本更新都为 JS 带来的新的特性和新的活力。在 ECMAScript5.1 中，我们已经可以实现面向对象的操作了，但是 ES5.1 仍然没有正式地支持面向对象的结构，比如**类（class）**或**继承（extends）**，但是在 ES5.1 中，我们仍可以通过**原型式继承**等巧妙的手段来模拟类似的行为。
到了 ES6 的正式发布，JS 首次引入了类和继承。ES6 的类旨在完全覆盖之前的规范设计的基于原型的继承模式。但实际上，ES6 的类其实仅仅是封装了 ES5.1 构造函数加原型继承的语法糖而已。

> 当然，我并不是指 ES6 的类不好。相反，我认为想要采用面向对象的模式编写 JavaScript 代码，其实更应该使用 ES6 的类。这里只是指出 ES6 的类其实是在原有结构上的进一步封装。

## 工厂模式

学习了面向对象开发技术的同学对**工厂模式**这个词一定不会陌生，这种设计模式被广泛用于软件工程领域，这是一种通过抽象结构创建具体对象的设计模式。我们同样可以将这种模式运用在创建 JS 对象的过程中，就像下面这段代码展示的一样：

```js
function motorFactory(type, color) {
	const obj = new Object();
	obj.type = type;
	obj.color = color;
	obj.self = function () {
		console.log(`这是一辆${this.color}色的${this.type}`);
	};
	return obj;
}

const motorBike = motorFactory('摩托车', '橙');
motorBike.self(); // 这是一辆橙色的摩托车
const car = motorFactory('轿车', '白');
car.self(); // 这是一辆白色的轿车
```

这段代码中的 `motorFactory` 函数接收两个参数，并根据这几个参数构建了一个车辆对象。我们可以传入不同的参数多次构建不同的对象，但是每个对象都具有两个属性 `type`、`color` 和一个 `self` 函数用以打印自身信息。
通过工厂模式的这种方式，我们实现了创建对象代码复用的问题，但是仍有一个问题我们还未解决，那就是我们仍不知道创建出来的对象是什么类型。

## 构造函数

在 JavaScript 中，构造函数是一个创建特定类型对象的函数。像 Object、Array 这些 JavaScript 自身的类都有自己的构造函数，可以直接在运行环境中调用。而我们也可以定义自己的构造函数，以函数形式为自己的对象类型定义属性和方法。
比如我们可以将上方的汽车工厂改成构造函数的写法：

```js
function Motor(type, color) {
	this.type = type;
	this.color = color;
	this.self = function () {
		console.log(`这是一辆${this.color}色的${this.type}`);
	};
}

const motorBike = new Motor('摩托车', '橙');
motorBike.self(); // 这是一辆橙色的摩托车
const car = new Motor('轿车', '白');
car.self(); // 这是一辆白色的轿车
```

我们使用 Motor() 构造函数代替了原来的 motorFactory() 汽车工厂函数，这两个函数内部的构造基本上是一样的，但它们仍具有许多不同之处：

1. Motor 函数并没有显式地创建对象；
2. 属性和方法直接传递给了 **this** 。
3. 没有返回值。

而在使用 Motor 函数时，我们也和使用工厂函数略有不同：我们多加了一个 **new** 操作符。通过这种方式调用函数会执行如下操作：

1. 在内存中开辟了一块新空间用以存放新创建的对象。
2. 这个新对象的\_\_proto\_\_被赋值为构造函数的 prototype。
3. 构造函数内部的 **this** 指向新创建的对象。
4. 执行构造函数内部的代码。
5. 如果构造函数显式返回了其他对象，则返回 **return** 关键字后的对象，否则将该对象返回。

> 关于上述的第五条，如果构造函数显式返回了一个非对象的变量，则依旧返回新创建的对象。如下方代码所示：

```js
function Obj() {
	return 123;
}

const obj = new Obj();
console.log(obj); // Obj {}
```

通过构造函数创建出的对象都有一个 constructor 属性指向它们的构造函数：

```js
function Obj() {}

const obj = new Obj();
console.log(obj.constructor === Obj); // true
```

通过判断实例化后对象的**constructor**属性，我们就可以得知该对象的类型。但是一般情况下，我们还是认为使用 **instanceof** 操作符来确定对象类型更为可靠。比如上面的例子中，`obj` 是一个 `Obj` 的实例，但因为它是一个对象，因此它也是 `Object` 的实例：

```js
console.log(obj instanceof Obj); // true
console.log(obj instanceof Object); // true
```

不知道各位读者有没有注意到构造函数存在的一个问题。我们先来看看下面这段代码：

```js
const Person = function (name, age, sex) {
	this.name = name;
	this.age = age;
	this.sex = sex;
	this.introduceSelf = function () {
		console.log(`我叫${this.name}，是个${this.age}岁的${this.sex}生。`);
	};
};

const 小明 = new Person('小明', 16, '男');
const 小红 = new Person('小红', 15, '女');

小明.introduceSelf(); // 我叫小明，是个16岁的男生。
小红.introduceSelf(); // 我叫小红，是个15岁的女生。
```

我们实例化了两个人类对象，小明和小红，他们都有 `introduceSelf` 方法，但这两个方法并不一样，是两个不同的 Function 实例。上面的构造函数实际上是这样的：

```js
const Person = function (name, age, sex) {
	this.name = name;
	this.age = age;
	this.sex = sex;
	this.introduceSelf = new Function(
		'console.log(`我叫${this.name}，是个${this.age}岁的${this.sex}生。`);'
	);
};
```

这样我们就能清楚地发现每创建一个 Person 对象时，我们都创建了一个新的 introduceSelf 函数对象。但实际上，因为两个函数执行的是相同的动作，我们没有必要创建两个不同的 Function 实例。而且对于 JavaScript 来说，非箭头函数的 **this** 是在其被调用时绑定的，因此，我们完全可以将共用的方法提取到构造函数之外：

```js
const personIntroduceSelf = function () {
	console.log(`我叫${this.name}，是个${this.age}岁的${this.sex}生。`);
};

function Person(name, age, sex) {
	this.name = name;
	this.age = age;
	this.sex = sex;
	this.introduceSelf = personIntroduceSelf;
}
```

这样一来我们每次创建 Person 实例时，只会将 introduceSelf 指向一个早已被定义好的函数，我们就解决了相同逻辑的函数被重复创建的问题。但是这么做会让代码整体的作用域变得更加混乱，一旦我们需要为 Person 对象添加更多的方法，那么我们就要在构造函数外部添加更多的函数。这会导致自定义类型引用的代码不能很好地聚在一起，代码会变得更加的混乱。

而这个问题，我们可以通过[**原型模式**](/JavaScript/了解js的原型)来解决。
