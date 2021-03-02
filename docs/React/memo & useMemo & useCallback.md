<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-04 15:20:04
 * @LastEditors: liushuhao
-->
## React.memo 使用 **      
<code>const Com = React.memo(Com, isEqual)</code>   
<code>function isEqual(oldProps, newProps) {}</code>    
React.memo 作用类似于 class 组件的 pureComponent，对组件 props 进行浅比较。memo 第二个参数可以传个函数，返回 true 不更新，false 更新，作用类似于 class 组件的 shouldComponentUpdate。        

## useMemo 使用 ##   
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
useMemo 接收一个函数和依赖数组，返回一个 memoized 值。如果不传依赖项，每次都会更新。传空数组只更新一次。       
useMemo 缓存函数执行的结果。比如一个组件内部有个 antd Table，组件每次渲染 Table 都会重新渲染即使是不需要的。这里可以用 useMemo 优化。第一个参数传个函数，函数返回 Table，第二个参数传入 Table 的依赖项。这样 Table 可以避免不必要的渲染。

每次点击，Parent 重新执行，B 组件都会重新渲染    
```js
function Parent() {
    const [num, setNum] = useState(0)
    return (
        <button onClick={() => setNum(num + 1)}>increase</button>
        <B />
    )
}
```
这里使用 useMemo：B 组件无依赖，传入空数组，缓存使用 useMemo 第一个参数的执行结果，即缓存 B 组件。     
```js
function Parent() {
    const [num, setNum] = useState(0)
    const onClick = () => setNum(1)
    const useMemoed = useMemo(() => <B />, []) 
    return (
        <button onClick={onClick}>increase</button>
        {useMemoed}
    )
}
```
useMemo 也可以缓存一段 JSX，和上文类似。    
## useCallback usage ##     
<code>const memoizedCallback = useMemo(() => fn(a, b), [a, b])</code>     
useCallback 传入一个函数和依赖数组，返回一个 memoized 的函数。只有当依赖改变才会返回一个新的函数。    
一个常见的场景：   
```js
function Child() {
    console.log('child render');
    return <>Child</>
}

Child = React.memo(Child)

function Parent() {
    const [num, setNum] = useState(0)
    const fn = () => { // do something }
    return (
        <>
            <Child fn={fn} />
            <button onClick={() => { setNum(num + 1) }}>increase</button>
        </>
    )
}
```
每次点击，Parent 都会重新执行，生成一个新的 fn。每次给 Child 传入新的 fn，导致加了 React.memo 也会重新渲染。 
这里使用 useCallback    
```js
function Child() {
    console.log('child render');
    return <>Child</>
}

Child = React.memo(Child)

function Parent() {
    const [num, setNum] = useState(0)
    const fn = () => { // do something }
    const memoizedCallback = useCallback(fn, [])
    return (
        <>
            <Child fn={memoizedCallback} />
            <button onClick={() => { setNum(num + 1) }}>increase</button>
        </>
    )
}
```
fn 没有依赖，传入空数组后，useCallback 每次返回缓存的函数，这样 Child props 没有改变，就不会重新渲染。    
## React.memo 和 useMemo区别 ##
React.memo 是高阶组件，也可以用于 class 组件。useMemo 是 hook，只能用在函数组件
React.memo 功能类似于做了浅比较的 shouldComponetUpdate，。useMemo 可以对组件更细粒度的更新。当逻辑应该拆做一个组件时，对组件使用 React.memo 比对 props。当不需要拆成一个组件时，使用 useMemo，比对 state。
## useMemo 和 useCallback区别 ##     
<code>const memoizedValue = useMemo(fn, [a, b])</code>    
<code>const memoizedCallback = useMemo(fn, [a, b])</code>   
useMemo 执行 fn，缓存 fn 返回的结果。 useCallback 缓存 fn