<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-04 15:20:04
 * @LastEditors: liushuhao
-->
**React.memo usage**      
<code>const Com = React.memo(Com, isEqual)</code>   
<code>function isEqual(oldProps, newProps) {}</code>    
React.memo 作用类似于 class 组件的 pureComponent，对组件 props 进行浅比较。memo 第二个参数可以传个函数，返回 true 不更新，false 更新，作用类似于 class 组件的 shouldComponentUpdate。        

**useMemo usage**   
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
useMemo 接收一个函数和依赖数组，返回一个 memoized 值。如果不传依赖项，每次都会更新。传空数组只更新一次。       
useMemo 缓存计算昂贵的值。举个例子，一个函数根据用户 id ，做一大堆判断筛选等逻辑返回一个数组。不管 id 是否相同
函数都要执行这一段昂贵且没有必要的逻辑。现在使用 useMemo 数组增加依赖项 id，当 id 相同时，直接使用上次的值。这样就省去执行昂贵逻辑的过程。   

useMemo 用来缓存函数执行后的结果      
每次点击，Parent 重新执行，B 组件都会重新渲染    
```
function Parent() {
    const [num, setNum] = useState(0)
    return (
        <button onClick={() => setNum(num + 1)}>increase</button>
        <B />
    )
}
```
这里使用 useMemo：B 组件无依赖，传入空数组，缓存使用 useMemo 第一个参数的执行结果，即 B 组件。
```
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
**useCallback usage**     
<code>const memoizedCallback = useMemo(() => fn(a, b), [a, b])</code>     
useCallback 传入一个函数和依赖数组，返回一个 memoized 的函数。只有当依赖改变才会返回一个新的函数。    
一个常见的场景：   
```
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
```
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
**useMemo 和 useCallback区别**      
<code>const memoizedValue = useMemo(fn, [a, b])</code>    
<code>const memoizedCallback = useMemo(fn, [a, b])</code>   
useMemo 执行 fn，缓存 fn 返回的结果。 useCallback 缓存 fn