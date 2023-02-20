---
title: 了解js的原型
date: 2022-01-08 10:15:37
tags: JavaScript
categories: [编程]
cover: https://pic1.zhimg.com/v2-535e92c65ddaff1a55f11df10c680c75_720w.jpg?source=172ae18b
---

在上一篇文章中，我们介绍了 JS 的对象设计。文章的最后我们留下了一个问题，而我们能在这篇文章中找到解决这个问题的方法。

<!-- more -->

<!-- toc -->

# 理解原型

在 js 中，当我们创建一个函数时，就会按照特定的规则给这个函数创建一个 **prototype** 属性（指向原型对象）。通常情况下，所有的原型对象都会自动获得一个名为 constructor 的属性，指回与之关联的构造函数。
我们拿上一篇文章中的 **Person** 举例， `Person.prototype.constructor` 指向 `Person` 。由于构造函数不同，原型对象也可能会拥有其他的属性和方法。换个角度，当我们向 **prototype** 属性指向的原型对象上挂载新的方法时，该原型对象也会具有新的方法。
因此，我们可以通过**原型模式**来解决我们上一篇文章中的遗留问题：

```js
function Person(name, age, sex) {
	this.name = name;
	this.age = age;
	this.sex = sex;
}

Person.prototype.introduceSelf = function () {
	console.log(`我叫${this.name}，是个${this.age}岁的${this.sex}生。`);
};

const 小明 = new Person('小明', 16, '男');
const 小红 = new Person('小红', 15, '女');

小明.introduceSelf(); // 我叫小明，是个16岁的男生。
小红.introduceSelf(); // 我叫小红，是个15岁的女生。
console.log(小明.introduceSelf === 小红.introduceSelf); // true
```

通过原型对象，我们将 `introduceSelf` 函数成功挂载到了 `Person` 的 `prototype` 属性上。而且通过这种方式挂载的属性和方法，是所有实例都能共享的。因此我们可以看到 `小明.introduceSelf` 和 `小红.introduceSelf` 指向的是相同的 Function 实例。
如此一来，我们便解决了重复创建 Function 实例以及破坏全局作用域的问题了。

在自定义构造函数时，原型对象默认只有一个 constructor 属性，其他方法都继承自 Object。每次调用构造函数创建一个新实例，这个实例的 `__proto__` 属性就会被赋值为构造函数的原型对象。通过这种联系，我们可以明白实例和其构造函数的原型之间存在着直接的联系，而与其构造函数没有直接的联系。
我们可以通过下面这段代码来体会一下这种关系：

```js
// 声明一个构造函数
function Person() {}

/**
 * 构造函数声明之后，
 * 就有了一个与之关联的原型对象
 */
console.log(Person.prototype);
/**
 * {
 *      constructor: {Function} Person(),
 *      __proto__: Object
 * }
 */
console.log(typeof Person.prototype); // Object

/**
 * 构造函数的原型对象拥有一个 constructor 属性
 * constructor 属性指向该构造函数
 */
console.log(Person.prototype.constructor === Person); // true

/**
 * 大多数原型链都会终止于 Object 的原型对象
 * Object 原型的原型是 null
 */
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Person.prototype.__proto__.constructor === Object); // true
console.log(Person.prototype.__proto__.__proto__ === null); // true

const person = new Person();
/**
 * 实例通过 __proto__ 链接到原型对象
 * 构造函数通过 prototype 链接到原型对象
 * 实例与构造函数之间没有直接联系
 * 但都与原型对象存在联系
 */
console.log(person.__proto__ === Person.prototype); // true
console.log(person.__proto__.constructor === Person); // true

/**
 * 使用 instanceof 操作符可以检查实例的原型链中
 * 是否包含指定的构造函数的实例
 */
console.log(person instanceof Person); // true
console.log(person instanceof Object); // true
console.log(Person.prototype instanceof Object); // true
```

# 原型层级

在通过实例对象访问属性时，会按照这个属性的名称开始搜索，搜索起始于对象实例本身。如果在这个实例上发现了给定的属性名称，则返回该属性名称对应的值。如果没有找到这个属性，则会沿着指针进入原型对象，然后在原型对象上找到该属性后返回对应的值。

我们可以在原型对象上设定一个默认值，在我们创建实例对象时，可以给实例添加一个与原型对象中同名的属性。但这么做不会修改原型对象的默认值，而是在实例中添加了这个属性，这个属性会把原型对象上的属性“遮”住，从而获得优先的访问：

```js
function Person() {}
Person.prototype.name = '无名氏';

const a = new Person();
const b = new Person();

a.name = 'A';
console.log(a.name); // A
console.log(b.name); // 无名氏
```

我们实例化了一个名叫 'A' 的 Person 对象，并为它添加了 `name` 属性。当我们试图取出 `a.name` 时，首先在对象实例 `a` 上发现了 `name` 属性，也就不会再进一步前往 `a` 的原型对象上获取 `name` 了。而访问 `b.name` 时，由于没有在 `b` 上发现 `name` 属性，于是沿着原型链向上找到它的原型对象，并使用定义在原型对象上的 `name` 属性。

一旦我们给对象实例添加了一个属性，那么这个属性将**一直覆盖**其原型对象中的同名属性，即使我们将其重新赋值为 **null** 也无法从它的原型对象中获取该属性。不过我们可以使用 **delete** 操作符完全删除实例上的该属性，从而能够继续搜索原型对象：

```js
function Person() {}
Person.prototype.name = '无名氏';

const person = new Person();
person.name = '梅铭恣';

console.log(person.name); // 梅铭恣
delete person.name;
console.log(person.name); // 无名氏
```

# 使用原型的一些小技巧

## 其他原型语法

我们来看看这样一个例子：

```js
function Person() {}

Person.prototype.name = '无名氏';
Person.prototype.getName = function () {
	return this.name;
};
Person.prototype.age = 18;
Person.prototype.getAge = function () {
	return this.age;
};
Person.prototype.introduce = function () {
	console.log(`我叫${this.getName()}，今年${this.getAge()}岁。`);
};
```

在这个例子中，我们为 `Person.prototype` 定义了许多属性和方法，但是每一次定义我们都写了一遍 `Person.prototype` 。为了减少代码冗余，我们可以直接通过一个包含这些属性和方法的对象字面量来重写原型，就像下面这样：

```js
function Person() {}

Person.prototype = {
	name: '无名氏',
	age: 18,
	getName() {
		return this.name;
	},
	getAge() {
		return this.age;
	},
	introduce() {
		console.log(`我叫${this.getName()}，今年${this.getAge()}岁。`);
	},
};
```

通过这种写法，我们可以只书写一次 `Person.prototype` 而绑定所有需要的属性与函数。但这样写仍有一个问题：这样重写原型后， `Person.prototype.constructor` 不再指向原来的 `Person` 了。在创建函数时，也会创建它的 `prototype` 对象，同时也会自动给这个原型对象的 constructor 属性赋值。
但上面这种写法相当于创建了一个新的原型对象赋值给了 `Person.prototype` ，因此其 `constructor` 属性也指向了完全不同的新对象（Object 的构造函数），不再指向原来的构造函数。

```js
const person = new Person();

console.log(person instanceof Object); // true
console.log(person instanceof Person); // true

console.log(person.constructor === Person); // false
console.log(person.constructor === Object); // true
```

可以看到，通过 `instanceof` 操作符我们还能保持实例对象与原构造函数之间的对应关系，但是我们已经无法通过 `constructor` 属性来判断实例对象的类型了。
如果我们很需要保证 `constructor` 属性的值，那么我们需要在重写原型对象的时候手动设置一个 `constructor` ，就像下面这样：

```js
function Person() {}

Person.prototype = {
	constructor: Person,
	name: '无名氏',
	age: 18,
	getName() {
		return this.name;
	},
	getAge() {
		return this.age;
	},
	introduce() {
		console.log(`我叫${this.getName()}，今年${this.getAge()}岁。`);
	},
};
```

但要注意，以这种方式恢复的 `constructor` 属性会创建一个 `[[Enumerable]]` 为 `true` 的属性，但是原生的 `constructor` 属性时不可枚举的。因此，使用 `Object.defineProperty()` 方法来定义 `constructor` 属性是更为规范的做法：

```js
Object.defineProperty(Person.prototype, 'constructor', {
	enumerable: false,
	value: Person,
});
```

## 原型的动态性

当我们尝试获取实例的某个属性或方法时，我们会沿着它的原型进行搜索，这一过程是动态的。因此即使在实例化后修改了原型，对原型的修改依旧可以反映在先前的实例对象上。我们来举个简单的例子：

```js
function Person() {}

const person = new Person();

Person.prototype.whoami = function () {
	console.log('我是人');
};

person.whoami(); // 我是人
```

在这个例子中，我们先创建了一个 `Person` 实例保存在 `person` 中，然后我们给 `Person.prototype` 添加了一个叫做 `whoami` 的方法。虽然 `person` 是在我们修改原型之前就已经存在的，但是我们在调用 `person.whoami()` 的时候，会首先在 `person` 实例上寻找这个方法。当我们没找到时，则会沿着原型，寻找并尝试调用 `person.__proto__.whoami()` 。
虽然我们能够随时给原型添加属性和方法，并能使其反映在所有对象的实例上，但当我们重写整个原型对象时，一切又都不一样了。我们来看下面这个例子：

```js
function Person() {}

const person = new Person();

Person.prototype = {
	constructor: Person,
	whoami() {
		console.log('我是人');
	},
};

person.whoami(); // 报错: Uncaught TypeError: person.whoami is not a function
```

当我们执行这段代码时，浏览器则甩出了异常，它没办法在 person 及其原型链上找到 whoami 函数。我们可以把上面这段代码细化为下面这个样子：

```js
// 我们先创建一个构造函数
function Person() {}
// 我们来保存一下此时默认创建的原型
const oldProto = Person.prototype;

/**
 * 我们实例化一个 Person 对象
 * 此时 person.__proto__ 指向 oldProto
 */
const person = new Person();
console.log(person.__proto__ === oldProto); // true

/**
 * 我们创建一个新的原型对象
 * 并把它赋值给 Person.prototype
 */
const newProto = {
	constructor: Person,
	whoami() {
		console.log('我是人');
	},
};
Person.prototype = newProto;

/**
 * 显然，oldProto !== newProto
 * 但 person.__proto__ 依旧指向 oldProto
 */
console.log(oldProto !== newProto); // true
console.log(person.__proto__ === oldProto); // true
```

因此，我们重写原型对象后，无法建立起实例到新原型对象之间的联系，也就没法在实例的原型链上寻找到 `whoami` 方法了。

## 原型的一些问题

讲了这么多这篇文章也快要收尾了，原型模式尽管很有用，但它并不是完美的，它仍存在着一些问题。
首先，它弱化了向构造函数传递初始化参数的能力，这导致所有实例默认获得取了相同值的属性。不过，这并不是原型模式的最大问题。
原型模式真正的问题在于它的共享特性，如果是像一个函数这样的具有相同逻辑表现的属性还好。除此之外，包含原始类型的数据也还好。但是，对于**引用类型**的数据来说，这样的共享就不是什么好事了。
我们来看下面这个例子：

```js
function Person(name) {
	this.name = name;
}

Person.prototype = {
	limbs: {
		upperLimbs: 2,
		lowerLimbs: 2,
	},
	amputation(isUpper = true) {
		const limb = `${isUpper ? 'upper' : 'lower'}Limbs`;
		const leftLimb = this.limbs[limb] - 1;
		this.limbs[limb] = 0 > leftLimb ? 0 : leftLimb;
	},
	howami() {
		console.log(
			`${this.name}说：我有着${this.limbs.upperLimbs}条胳膊${this.limbs.lowerLimbs}条腿。`
		);
	},
};
Object.defineProperty(Person.prototype, 'constructor', {
	enumerable: false,
	value: Person,
});

const luckyDog = new Person('幸运的家伙');
const unfortunateGuy = new Person('不幸的朋友');
luckyDog.howami(); // 幸运的家伙说：我有着2条胳膊2条腿。
unfortunateGuy.howami(); // 不幸的朋友说：我有着2条胳膊2条腿。

unfortunateGuy.amputation();
unfortunateGuy.howami(); // 不幸的朋友说：我有着1条胳膊2条腿。

luckyDog.howami(); // 幸运的家伙说：我有着1条胳膊2条腿。
```

在这个例子中，我们为 `Person` 默认设置了一对上肢和一对下肢，并设计了一个截肢函数。我们找来了两位“志愿者”，让他们分别扮演“幸运的家伙”和一位“不幸的朋友”。在刚实例化的时候，我们发现这两位“志愿者”都有着一对上肢和一对下肢。但是马上这位“不幸的朋友”遭遇了一些事故，不得不截去一条胳膊，于是此时的他便只有一条胳膊和两条腿了。但是我们却发现这位没有接受截肢手术的 `luckyDog` 居然也少了一只胳膊。这就是因为 `Person` 的原型对象中，肢体是一个引用类型的数据，虽然我们创建了两个 Person 实例，但实际上这两位朋友“共用”了同一个躯体。
因此，在使用原型模式的时候一定要注意引用类型的使用和管理，否则就会让一位健康的朋友平白无故遭受不幸了。
