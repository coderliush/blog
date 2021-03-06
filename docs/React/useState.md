<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-25 10:03:33
 * @LastEditors: liushuhao
-->
## 使用 ##
```
const [state, setState] = useState(initialState)
```
与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。
```js
function App() {
  const [count, setCount] = useState(1)
  const onClick = () => {
    setCount(prevCount => prevCount + 1)
    setCount(prevCount => prevCount + 1)
    setCount(prevCount => prevCount + 1)
  }
  return (
    <>
      Count: {count}
      <button onClick={onClick}>-</button>
    </>
  );
}
```
每一次 setCount 都会产生一次更新，输出 3.
```js
let isMount = false
let workInProgressHook = null  // 当前正在执行的 hook


const fiber = {
    memoizedState: null,  // 组件的第一个 hook
    stateNode: App
}

function run() {
    workInProgressHook = fiber.memoizedState
    const app = fiber.stateNode()
    isMount = false
    return app
}

function useState(initialState) {
    let hook

    if (isMount) {
        hook = {
            memoizedState: initialState,
            next: null,
            queue: {
                pending: null
            },
        }

        if (!fiber.memoizedState) {
            fiber.memoizedState = hook
        } else {
            workInProgressHook.next = hook
        }
        workInProgressHook = hook
    } else {
        hook = workInProgressHook
        workInProgressHook = workInProgressHook.next

    }

    let baseState = hook.memoizedState
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next
        do {
            const action = firstUpdate.action // setState() 传入的参数
            baseState = action(baseState)
            firstUpdate = firstUpdate.next
        } while (firstUpdate !== hook.queue.pending.next) {
            hook.queue.pending = null
        }
        hook.memoizedState = baseState

        return [baseState, dispatch]
    }
}



```