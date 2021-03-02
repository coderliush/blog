<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-19 11:22:52
 * @LastEditors: liushuhao
-->
## 使用 ##
```js
import { createStore } from 'redux';

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter);

// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() =>
  console.log(store.getState())
);

// 改变内部 state 惟一方法是 dispatch 一个 action。
// action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1
```
**Redux 单向数据流**
点击 <code>view</code> 视图的按钮触发一个事件，<code>dispatch</code> 一个 <code>action</code>， <code>reducer</code> 根据 <code>action</code> 的 <code>type</code> 返回一个新的 <code>state</code>，然后更新视图。

**hook 实现 Redux 功能**
```js
import React, { useContext, useReducer } from 'react'

const MyContext = React.createContext()

const initialState = {
    num: 0,
    sibNum: 1,
}

function reducer(state, action) {
    switch (action.type) {
        case 'ADD': return {
            ...state,
            num: state.num + action.add
        }
        default: return state
    }
}

function Parent() {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <MyContext.Provider value={{ state, dispatch }}>
            <Child />
            <Sibing />
        </MyContext.Provider>
    )
}

function Child() {
    const { state, dispatch } = useContext(MyContext)  // 子组件使用 context 
    return (
        <>
            <p>{state.num}</p>
            <button onClick={() => { dispatch({ type: 'ADD', add: 1 }) }}>num ++</button>
        </>
    )
}

function Sibing() {
    const { state } = useContext(MyContext)  // 子组件使用 context 
    console.log('Sibing render')
    return <>Sibing: {state.sibNum}</>
    
}

export default Parent
```
## Redux 源码 ##
redux 主要是为了解决组件之间的传值问题，所有的 state 都以一个对象树的形式储存在一个单一的 store 中，子组件可以获取 state 和 修改 state。下面是官网的一个例子：
```js
import { createStore } from 'redux'
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

// api: createStore(reducer, preloadedState, enhancer)
// return: { dispatch, getState, subscribe ... }
let store = createStore(counter)

// api: dispatch(action)
// dispatch 根据 action 更新 state， 执行 subscribe 注册的箭筒函数列表，所以 subscribe 能获得最新的 state 
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1

// api: subscribe(listener) 
// 讲回调函数 push 到一个列表中。
store.subscribe(() =>
  this.setState({
    newState: store.getState()
  })
);

```
下文代码来自 redux 源码，删除了一些验证判断，详细见 [redux](https://github.com/reduxjs/redux/tree/master/src)      
```js
export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
}
```

## createStore 
```js
export default function createStore(reducer, preloadedState, enhancer) {
  //  createStore 第二个参数初始 state 可省略。
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false
  
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
```
在 redux 中，如果 state 是全局变量，那么很容易被意外修改。所以 createStore 接收初始的 state，保存在函数内部，外部只能通过 getState 获取。
createStore 接收 reducer、initState 和 enhancer 3 个参数。 reducer 函数接收 state 和 action，根据 action.type 返回新的 state：
```js
function reducer(state, action) {
    switch(action.type) {
        case 'type1':
            return {
                ...state,
                type
            }
        default:
            return state;
    }
}

```
根据外部传来的 reducer 修改 state，initState 设置初始 state，enhancer 加强 dispatch 的功能。
createStore 导出 dispatch，subscribe 等常用的方法。             

dispatch 函数代码如下：
```js
  function dispatch(action) {
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }
```
dispatch函数接收一个 action，做了以下几件事情：
1. 执行 reducer 函数，返回新的 state。
2. 执行所有的 listener，listener 是 subscribe 添加进去的回调函数，( 见下文 subscribe )
3. 返回传入的 action。（ action 可供其它的 middleware 使用，见下文 middleware ）
在 createStore 中有这样一句：
```js
// When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT })
```
这里的意思是，没有匹配的 type，reducer 返回初始 state。 


subscribe 函数代码如下：
```js
  function subscribe(listener) {

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }
```
subscribe函数接收一个 listener 回调函数，将 listener push 到 nextListeners 中，返回 unsubscribe 函数，将这个回调函数卸载。其中 ensureCanMutateNextListeners 返回 currentListeners 浅拷贝的一个数组，操作新的数组不改变原始数组。
```js
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
```
getState 函数返回 state
```js
  function getState() {
    return currentState
  }
```
一个简易版的 createStore：
```js
function createStore(reducer) {
    let state
    let listeners = []
    const getState = () => state
    //subscribe 每次调用，都会返回一个取消订阅的方法
    const subscribe = (fn) => { 
        listeners.push(fn)
        const unsubscribe = () => {
            listeners = listeners.filter(listener => fn !== listener)
        }
        return unsubscribe
    };
    const dispatch = (action) => {
        //reducer(state, action) 返回一个新的 state
        state = reducer(state, action)
        listeners.forEach(fn => fn())
    }
    // 初始化返回默认的 state
    dispatch({ type: `不会重复的一个 key，初始化 state` })

    return {
        getState,
        dispatch,
        subscribe
    }
}
```
总结：createStore 函数接收 reducer，preloadedState， enhancer 函数，返回我们常用的 dispatch，subscribe，getState 等。    
其中 dispatch 接收一个 action，做了这几件事情：     
1. 运行了 reducer 函数，返回了新的 state。
2. 运行了 listeners 队列中所有的回调。
3. 返回 action，返回的 action 可以供下文使用。

## combineReducer
在实际项目中，随着应用的开发，我们可能有一个很大的 reducer，一般情况下我们都是对每一个模块编写对应的 reducer，最后合成一个 reducer 。combineReducer 做的就是这件事

## applyMiddleware
Middleware 作用是包装 store 的 dispatch 方法来达到想要的目的。
有时候我们需要在 dispatch 之前做一些事情，比如常见的打印一个 log：
```js
<button onClick={() => {
    ...  // middleware1 do something
    store.dispatch(action)
}}>
</botton>
```
如果很多事件都需要加，我们不可能每次地方都加。很自然的我们想到可以放在 dispatch 函数里面，所以重写 dispatch 函数：
```js
let next = store.dispatch
store.dispatch = () => {
    ...  // middleware1 do something
    next(action)
}
```
middleware 的概念就是在 dispatch 前后做一些事情，增强 dispatch 的功能。
如果我们还有其它 middleware， 比如：
```js
let next = store.dispatch
store.dispatch = () => {
    ...  // middleware2 do something
    next(action)
}
```
我们想到可以在第一个 middleware 中在 dispatch 函数加入自身的功能，返回修改后的 dispatch，传给第二个 middleware。每一个 middleware 都返回修改后的 dispatch 给下一个使用，合并之后类似于这样：
```js
let next = store.dispatch
store.dispatch = () => {
    ...  // middleware1 do something
    ...  // middleware2 do something 
    return next(action) 
}
```
applyMiddleware 的一个使用实例
```js
import { createStore, applyMiddleware } from 'redux'
import todos from './reducers'
// 中间件可以获得 store，从而获得 store 的各种方法供自己使用。 logger 返回 '增强的功能' + dispatch 
function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    let returnValue = next(action)

    console.log('state after dispatch', getState())

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue
  }
}

let store = createStore(
  todos,
  [ 'Use Redux' ],
  applyMiddleware(logger)    // enhancer === applyMiddleware( ...middlewares )，enhancer = applyMiddleware() = function
)

store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware'
})
// (将打印如下信息:)
// will dispatch: { type: 'ADD_TODO', text: 'Understand the middleware' }
// state after dispatch: [ 'Use Redux', 'Understand the middleware' ]
```

而 redux 中的 applyMiddleware 就是接收所有的 middleware，applyMiddleware( middleware1, middleware2, middleware3 )。
```js
// export default function createStore(reducer, preloadedState, applyMiddleware(...middlewares)) {
export default function createStore(reducer, preloadedState, enhancer) {
    ...
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error('Expected the enhancer to be a function.')
        }
        // 如果有 enhancer，那么 createStore 返回 enhancer()()。
        // enhancer = applyMiddleware(...middlewares)
        return enhancer(createStore)(reducer, preloadedState)  
    }
    ...
}

// 从上文得知，createStore 如果有 enhancer，则执行 enhancer(createStore)(reducer, preloadedState)，执行结果最后返回 { ...store, dispatch }
// applyMiddleware 组合了每个中间件的 dispatch，返回一个包含所有功能的 dispatch。
export default function applyMiddleware(...middlewares) {
  // 上文 createStore return 的 enhancer(createStore)(reducer, preloadedState)
  return createStore => (...args) => {
    const store = createStore(...args)
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 给每一个 middleware 传入 getState 和 dispatch 函数。执行每一个中间件的功能。
    const chain = middlewares.map(middleware => middleware(middlewareAPI))   
    // compose 第一个参数是所有的中间件函数。第二个参数是每个中间件函数执行的参数
    // 对每一个中间件，从右往左执行 fn( store.dispatch )，返回值作为下一个函数的参数
    dispatch = compose(...chain)(store.dispatch)
 
    return {
      ...store,
      dispatch
    }
  }
}
```
compose
```js
function compose(...funcs) {
    //如果没有中间件
    if (funcs.length === 0) {
        return arg => arg
    }
    //中间件长度为1
    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((prev, current) => (...args) => prev(current(...args)));
}
```

