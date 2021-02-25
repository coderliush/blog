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

**Promise代码**
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
**Promise.all**
Promise.all() 方法接收一个 promise 的 iterable 类型（注：Array，Map，Set 都属于ES6的 iterable 类型）的输入，返回一个数组。当有一个 promise 失败，Promise.all 返回失败的结果。     
处理 promise 失败的情况，可以 

当传入的可迭代对象为空，则是同步的。否则是异步的。    
```
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let index = 0
        let result = []
        if (promises.length === 0) {
            resolve(result)
        } else {
            for (let i = 0; i < promises.length; i++) {
                //promises[i] 可能是普通值
                Promise.resolve(promises[i]).then((data) => {
                    result[i] = data
                    if (++index === promises.length) {
                        resolve(result)
                    }
                }, (err) => {
                    reject(err)
                    return
                })
            }
            function processValue(i, data) {
            }
        }
    })
}
```
Promise.all() 返回一个数组，循环传入的可迭代类型，执行每一个 promise 拿到返回的结果。将结果按顺序传入输出的数组