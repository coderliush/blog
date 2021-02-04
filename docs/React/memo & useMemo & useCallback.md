<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-04 15:20:04
 * @LastEditors: liushuhao
-->
memo 和 useMemo 作用是性能优化
memo 作用类似于 class 组件的 pureComponent，对组件 props 进行浅比较。memo 第二个参数可以传个函数，返回 true 不更新，false 更新，作用类似于 class 组件的 shouldComponentUpdate。
```
const Memoed = React.memo(Com, isEqual)

function isEqual(prevProps, nextProps) {}
```
useMemo 作用是可以对一个组件部分 pure. useMemoe 接受一个回调函数和依赖数组，返回一个 memoized 值（不是返回一个组件）。如果不传依赖项，每次都会更新。传空数组只更新一次。
```
function Parent() {
    const [num, setNum] = useState(0)
    const onClick = () => setNum(1)
    const useMemoed = useMemo(() => <B />, []) 
    return (
        <A onClick={onClick}>+++</A>
        <B ><B/>
    )
}
```
当点击组件 A 时，Parent 会重新渲染，B 组件也会重新渲染