<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-19 11:22:52
 * @LastEditors: liushuhao
-->
**usage**
```
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

**hook 实现 Redux 部分功能**