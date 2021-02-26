<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-25 10:06:37
 * @LastEditors: liushuhao
-->
**usage**
```
let p = new Promise((resolve) => {
    setTimeout(() => {
        resolve('hello')
    }, 2000)
})

let p1 = p.then((value) => {
    console.log(value)
})

console.log(p1)  
```
输出：
![结果1](/images/JavaScript and ES6/promise1.png)    
![结果2](/images/JavaScript and ES6/promise2.png)   

Promise 是构造函数，原型链上的方法有：Promise.prototype.catch(onRejected)， Promise.prototype.then(onFulfilled, onRejected), Promise.prototype.finally(onFinally)。 静态方法有 Promise.resolve()，Promise.reject()，Promise.all()，Promise.race()。new Promise 生成的实例对象 p 有两个属性，PromiseState 表示当前 promise 的状态，PromiseResult 表示当前 promise 的值。

**Promise**
当调用 Promise resolve 函数时，Promise state 设置为 RESOLVED，同时保存 resolve 函数传入的 value。执行 resolvedCallbacks 成功的回调队列。
当调用 then(onFulfilled, onRejected) 方法时，
如果 Pormise state 为 pending，那么把 onFulfilled 函数传入 resolvedCallbacks 队列。
如果 Pormise state 为 resolved，value 作为参数传入 onFulfilled 回调函数，并执行。
```
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'reject'
function Promise(executor) {
    var self = this
    self = PENDING
    self.resolvedCallbacks = []
    self.rejectedCallbacks = []

    function resolve(value) {
        if (self.status === PENDING) {
            self.status = RESOLVED
            self.value = value
            for (var i = 0; i < self.rejectedCallbacks.length; i++) {
                // self.rejectedCallbacks[i] 是个函数。函数调用的时候指向 点 前面的。这里 this 指向点前面的self
                // promise 规范 onFulfilled must be called as funtions（ with no this value） 严格模式下是 undefined，非严格模式下是 window
                // self.rejectedCallbacks[i](value)   
                var f
                f = self.rejectedCallbacks[i]
                f(value)
            }
        }
    }

    function reject(reson) {
        if (self.status === PENDING) {
            self.status = REJECTED
            self.value = value
            for (var i = 0; i < self.rejectedCallbacks.length; i++) {
                // self.rejectedCallbacks[i] 是个函数。函数调用的时候指向 点 前面的。这里 this 指向点前面的self
                // promise 规范 onFulfilled must be called as funtions（ with no this value） 严格模式下是 undefined，非严格模式下是 window
                // self.rejectedCallbacks[i](value)   
                var f
                f = self.rejectedCallbacks[i]
                f(value)
            }
        }
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}
```
**Promise.prototype.then()**
then() 方法返回一个 Promise。它最多需要有两个参数：Promise 的成功和失败情况的回调函数。
```
Promise.prototype.then = function (onResolved, onRejected) {
    var self = this
    // then 的两个参数必须是函数，不然忽略
    if (typeof onResolved !== 'function') {
        onResolved = function () { }
    }
    if (typeof onRejected !== 'function') {
        onRejected = function () { }
    }
}
```
**Promise.prototype.catch()**
catch() 方法返回一个Promise，并且处理拒绝的情况。它的行为与调用 Promise.prototype.then(undefined, onRejected) 相同。 (事实上, calling obj.catch(onRejected) 内部calls obj.then(undefined, onRejected))。     
简单来说，Promise.prototype.catch() === Promise.prototype.then(undefined, onRejected)
```
Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected)
}
```
**Promise.resolve()**
Promise.resolve(value) 方法返回一个以 value 解析后，含有 then 方法的 Promise 对象。
```
const promise1 = Promise.resolve(123)

promise1.then((value) => {
  console.log(value)   // 123
})
```
```
Promise.resolve = value => new Promise(resolve => resolve(value))
```
**Promise.all()**
Promise.all() 方法接收一个 promise 的 iterable 类型（注：Array，Map，Set 都属于ES6的 iterable 类型）的输入，返回一个数组。当有一个 promise 失败，Promise.all 返回失败的结果。     
使用
```
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise((resolve, reject) => {
    // setTimeout(function, milliseconds, param1, param2, ...)
    // param1, param2, ...	可选。 传给执行函数的其他参数
    setTimeout(resolve, 100, 'foo')  
})

Promise.all([promise1, promise2, promise3]).then((values) => {
    console.log(values)  // [3, 42, 'foo']
})
```
当有一个失败时,
```
    const promise1 = Promise.reject(3)
    const promise2 = 42
    const promise3 = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, 'foo')
    })

    Promise.all([promise1, promise2, promise3]).then((values) => {
        console.log(values)  
    })
```
返回 Uncaught (in promise) 3。为了得到预期的数组结果，可以：    
1. catch 失败的 promise，return 一个默认值。
2. 使用 Promise.allSettled()
实现
```
Promise.all = function (promiseList) {
    return new Promise((resolve, reject) => {
        let res = []
        if (promiseList.length === 0) {
            resolve(res)
        } else {
            for (let i = 0; i < promiseList.length; i++) {
                Promise.resolve(promiseList[i]).then(value => {
                    res[i] = value
                    if (res.length === promiseList.length) {
                        resolve(res)
                    }
                }, (err) => {
                    reject(err)   // 有一个 promise 失败，Promise.all() rejected
                })
            }
        }
    })
}
**Promise.race()**
Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。
```
const promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one')
})

const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'two')
})

Promise.race([promise1, promise2]).then((value) => {
    console.log(value)   // two
})
```
```
**Promise.allSettled()**
Promise.allSettled() 方法返回一个对象数组，每个对象表示对应的 promise 结果。
使用：
```
const promise1 = Promise.reject(3)
const promise2 = 42
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo')
})

Promise.allSettled([promise1, promise2, promise3]).then(res => {
    console.log(res)
})
```
输出：
![Promise.allSettled](/images/JavaScript and ES6/allSettled.png)   

**Promise的其它使用**
1. 实现一个可超时的 promise    
```
function timeoutPromise(promise, ms) {
  return new Promise((resolve, reject) => {
    fetch().then(value => resolve(value))  
    // 超过一定的时间就 reject
    setTimeout(() => reject('timeout'), ms)
  })
}
```
2. 延时的 promise
```
function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms)
    })
}
```