<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-03-02 16:09:05
 * @LastEditors: Do not edit
-->
# 手写一些函数

## call 
### Function.prototype.call() 的使用
```js
function Product(name, price) {
  this.name = name
  this.price = price

  return {c: 1}
}

function Food(name, price) {
  let obj = Product.call(this, name, price)   // obj = { c: 1 }
  this.category = 'food'
}
```
对于 bar.call(foo, 'a', 'b') 而言：
call 做了三件事：
1. 执行调用 call 的函数 bar
2. 将 bar 函数 this 指向 foo
3. return bar 函数执行的结果

**call 的实现**
```js
Function.prototype.call = function ( context, ...args ) {
    context = context ? Object(context) : window
    let fnKey = new Symbol()
    context.fnKey = this       // bar.call()， call 函数中的 this 指向其调用者 bar 
    let res = context.fnKey(...args)
    delete context.fnKey
    return res                  // return 函数返回值
}
```

## new 
### new 的使用
```js
function Car(make, model, year) {
  this.make = make
  this.model = model
  this.year = year
}

const car1 = new Car('Eagle', 'Talon TSi', 1993)
```
![](/images/js/new.png)   
### new 的实现
new 第一个参数为构造函数，之后的参数为构造函数的参数。
```js
function _new() {
    let obj = Object.create(fn.prototype)
    let fn = Array.from(arguments).shift()
    let res = fn.apply(obj, arguments)
    return res instanceof Object ? res : obj
}
```