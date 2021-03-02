<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-19 16:40:47
 * @LastEditors: liushuhao
-->
### 使用 
```js
const axiosFn = (dispatch) => {
  setTimeout(() => {
    dispatch({ action: 'test'})
  })
}

store.dispatch(axiosFn)
```
redux-thunk 只做了 1 件事：如果 action 是个函数，传入参数 dispatch, getState，执行这个函数。
```js
action(dispatch, getState, extraArgument)
```
1. axiosFn 是一个函数，执行这个函数。
2. 给 axiosFn 函数传参数：dispatch，getState。

redux-thunk 代码如下：
```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```    
**中间件是对 <code>dispatch</code> 做了改造，在不影响之前 <code>dispatch</code> 功能的前提下，加入新的功能。**    
比如 <code>logger</code> 中间件：
```js
let next = store.dispatch
store.dispatch = (action) => {
    console.log(action)
    next(action)     
    console.log(store.getState())
}
```
<code>logger</code> 中间件重写了 <code>dispatch</code>，<code>next(action)</code> 是原来 <code>dispatch</code> 的功能，在它的基础上加入 <code>logger</code> 需要的功能。