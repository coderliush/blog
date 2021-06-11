<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-25 10:06:37
 * @LastEditors: liushuhao
-->
## promise 使用 ##
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
![](/images/js/promise1.png)    
![](/images/js/promise2.png)   

Promise 是一个构造函数   
**原型链上的方法有：**     
Promise.prototype.catch(onRejected)    
Promise.prototype.then(onFulfilled, onRejected)  
Promise.prototype.finally(onFinally)  
**静态方法有：**    
Promise.resolve()      
Promise.reject()   
Promise.all()   
Promise.race()  
new Promise 生成的实例对象 p 有两个属性，PromiseState 表示当前 promise 的状态，PromiseResult 表示当前 promise 的值。 
```js
let p = new Promise()
p = {
    PromiseState,
    PromiseResult
}
```

## Promise 构造函数 ##          
当调用 Promise resolve 函数时，Promise state 设置为 resolved，同时保存 resolve 函数传入的 value。执行 resolvedCallbacks 成功的回调队列。
```js
const pending = 'pending'
const resolved = 'resolved'
const rejected = 'reject'
function Promise(executor) {
    var self = this
    self = PENDING
    self.resolvedCallbacks = []
    self.rejectedCallbacks = []

    function resolve(value) {
        if (self.status === pending) {
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
        if (self.status === pending) {
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
## Promise.prototype.then() ##
then() 方法返回一个 Promise。接收两个参数：Promise 的成功和失败情况的回调函数。
当调用 then(onFulfilled, onRejected) 方法时:    
1. 如果 Promise state 为 pending，那么把 onFulfilled，onRejected 函数传入 resolvedCallbacks，rejectedCallbacks 队列，等到执行。    
2. 如果 Promise state 为 resolved，value 作为参数传给 onFulfilled 回调函数，并执行。    
3. 如果 Promise state 为 rejected，reson 作为参数传给 onRejected 回调函数，并执行。    
```js
Promise.prototype.then = function (onResolved, onRejected) {
    var self = this
    // then 的两个参数必须是函数，不然忽略
    if (typeof onResolved !== 'function') {
        onResolved = function () { }
    }
    if (typeof onRejected !== 'function') {
        onRejected = function () { }
    }

    if (self.status === 'resolved') {
        return new Promise((resolve, reject) => {
            // 如果 onResolved 函数失败，则直接抛出异常
            try {
                // 执行 then 成功的回调
                let x = onResolved(self.value)
                // 如果返回值 x 不是 promise：
                    比如：promise2 = promise.then(value => return 1 )，promise2 就由 1 确定它的状态
                    promise.then(value => { return 1 }).then(value => { // value = 1 })

                // 如果返回值 x 是一个 promise：   
                    比如：promise2 = promise.then(value => return promise1 )，promise2 就取 promise1 的状态

                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    // 将 onResolved 回调执行的结果传给下一个 promise
                    resolve(x) 
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    if (self.status === 'rejected') {
        return new Promise((resolve, reject) => {
            try {
                let x = onRejected(self.value)

                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    // 将 promise rejected 返回的值传入下一个 then 成功的回调
                    // promise.then(null, reason => { return 'reason'} ).then(value => { // value = 'reason' }) 
                    resolve(x)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    // 当还是 pending 状态，等待 promise 状态确定（等待执行 resolve, reject）。resolve，reject 会执行成功或者失败的回调函数队列。所以 pending 状态传一个函数 (value) => onResolved(value) 进入回调函数队列，等待执行 onResolved(value)。
    if (self.status === 'pending') {
        return new Promise((resolve, reject) => {
            self.resolvedCallbacks.push(value => {
                try {
                    let x = onResolved(self.value)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x)
                    }
                } catch(e) {
                    reject(e)
                }
            })

            self.rejectedCallbacks.push(reason => {
                try {
                    let x = onRejected(self.value)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x)
                    }
                } catch(e) {
                    reject(e)
                }
            })
        })
    }   

}
```
## Promise.prototype.catch() ##
catch() 方法返回一个Promise，并且处理拒绝的情况。它的行为与调用 Promise.prototype.then(undefined, onRejected) 相同。 (事实上, calling obj.catch(onRejected) 内部calls obj.then(undefined, onRejected))。     
简单来说，Promise.prototype.catch() === Promise.prototype.then(undefined, onRejected)
```js
Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected)
}
```
## Promise.prototype.finally ##   
在当前事件循环结束之后才执行。
```js
p.then(f) 
p.finally(f) = p.then(setTimeout(f))
p.then(f)
```

```js
Promise.prototype.finally = function(f) {
    return this.then(()=> {
        setTimeout(f)
    }, ()=> {
        setTimeout(f)
    })
}
```

## Promise.resolve() ##   
Promise.resolve(value) 方法返回一个以 value 解析后，含有 then 方法的 Promise 对象。
```js
const promise1 = Promise.resolve(123)

promise1.then((value) => {
  console.log(value)   // 123
})
```
```
Promise.resolve = value => new Promise(resolve => resolve(value))
```
## Promise.all() ##
Promise.all() 方法接收一个 promise 的 iterable 类型（注：Array，Map，Set 都属于ES6的 iterable 类型）的输入，返回一个数组。当有一个 promise 失败，Promise.all 返回失败的结果。     
使用
```js
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
```js
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
```js
Promise.all = function (promiseList) {
    return new Promise((resolve, reject) => {
        let length = 0
        let res = []
        if (promiseList.length === 0) {
            resolve(res)
        } else {
            for (let i = 0; i < promiseList.length; i++) {
                Promise.resolve(promiseList[i]).then(value => {
                    res[i] = value
                    length ++
                    if (length === promiseList.length) {
                        resolve(res)
                    }
                }, (reason) => {
                    reject(reason)   // 拿到第一个 reject
                })
            }
        }
    })
}
```
## Promise.race() ##     
Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。
```js
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
实现
```js
Promise.race = function (promiseList) {
    return new Promise((resolve, reject) => {
        for (let promise of promiseList) {
            promise.then(value => {
                resolve(value)
            }, reson => {
                reject(reson)
            })
        }
    })
}
```
## Promise.allSettled() ##
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
![Promise.allSettled](/images/js/allSettled.png)          

## Promise的其它使用 ##
1. 实现一个可超时中断的 promise    
```js
function timeoutPromise(promise, ms) {
  return new Promise((resolve, reject) => {
    promise.then(value => resolve(value))
    // 超过一定的时间就 reject
    setTimeout(() => reject('timeout'), ms)
  })
}
```
2. 延时的 promise
```js
function delayPromise(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
```