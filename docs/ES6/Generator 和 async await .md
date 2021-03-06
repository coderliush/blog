<!--
 * @Author: liushuhao
 * @Date: 2021-03-06 16:51:08
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-06 20:35:54
-->
## Iterator 迭代器
Iterator 是一种接口，为各种不同的数据结构提供统一的访问机制。每次调用 next() 都会返回一个包含 value 和 done 属性的对象。  
含有 Iterator 的数据结构有：   
- Array
- Map
- Set
- String
- TypedArray （描述的是二进制缓存区一个类似数组的视图，也叫类型数组）
- 函数的 arguments 对象
- NodeList 对象     

```js
let arr = [1, 2, 3]
let iterator = arr[Symbol.iterator]()

iterator.next()   // {value: 1, done: false}
iterator.next()   // {value: 2, done: false}
iterator.next()   // {value: 3, done: false}
iterator.next()   // {value: undefined, done: true}
```

给对象添加 Iterator
```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        }
      }
    }
  }
}
```


## Generator 
Generator 函数是 ES6 提供的一种异步编程解决方案。执行 Generator 函数会返回一个遍历器对象。形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function 关键字与函数名之间有一个星号；二是，函数体内部使用 yield 表达式，定义不同的内部状态（yield：'产出'）。
```js
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

var hw = helloWorldGenerator()

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

## async await
async await 是 Generator 语法糖。

一个 Generator 例子
```js
const fs = require('fs')

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

const gen = function* () {
  const f1 = yield readFile('/etc/fstab')
  const f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

使用 async await
```js
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab')
  const f2 = await readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
};
```

有两个地方的改动：
1. Generator * 替换为 async。
2. yield 替换成 await。