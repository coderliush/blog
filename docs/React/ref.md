**ref 的作用**
1. 操作 dom
2. 使用子组件的方法

**类组件中使用 ref 的两种方式：**
1. React.createRef()
2. 回调函数
```
class Parent extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }
  onClick = () => {
    console.log('createRef', this.ref)
    console.log('回调的ref', this.ref)
  }
  render() {
    return (
      <>
        <Child ref={this.ref} />               // 创建 ref 的方法1
        <Child ref={(e) => this.ref = e} />    // 创建 ref 的方法2
        <button  onClick={this.onClick}>调用子组件的函数</button>
      </>
    )
  }
}

class Child extends React.Component {
  constructor() {
    super()
    this.a = 1
    this.state = {
      num: 1
    }
  }
  childFn = () => {
      console.log('this', this)
  }
  render() {
    return (
      <button>child</button>
    )
  }
}

```
![ref](/images/react/create-ref-1.png)
![ref](/images/react/create-ref-2.png)
父组件通过 ref 获得子组件的实例，可以获得子组件 state，原型链上的函数等等。
React.createRef() 创建的 ref 实例放在 current 对象中。回调获得的 ref 就是实例。

**函数组件使用 ref**
1. 操作子组件的 dom
forwardRef 将子组件的 props，ref 转发。
```
const Child = forwardRef((props, ref) => {
  return <input ref={ref}></input>
})

function Parent() {
  const ref = useRef()
  const onClick = () => {
    ref.current.focus()
  }
  return (
    <>
      <Child ref={ref} />
      <button  onClick={onClick}>操作子组件dom</button>
    </>
  )
}
```
2. 调用子组件的函数
useImperativeHandle 暴露出子组件的函数供外部使用
```
const Child = forwardRef((props, ref) => {
  const inputRef = useRef()
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    }
  }))
  return <input ref={inputRef}></input>
})

function Parent() {
  const ref = useRef()  
  const onClick = () => {
    ref.current.focus()
  }
  return (
    <>
      <Child ref={ref} />
      <button  onClick={onClick}>子组件聚焦</button>
    </>
  )
}
```
**createRef 和 useRef 的区别**    
1. createRef 每次都会创建新的 ref。 useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。类似于在 class 中使用实例字段的方式。
2. 函数组件可以使用 createRef，类组件使用 useRef 报错

**useRef 的其它使用**   
useRef 类似于 class 组件中的 this，
const usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

**源码**      
forwardRef 将组件 props，ref 做转发。
![ref](/images/react/forwardRef.png)      
createRef 创建一个包含 current 的对象。        
![ref](/images/react/createRef.png)

Q: 为什么函数组件不能直接使用 ref    
A：函数组件没有实例，class 组件的函数挂在原型链上，可以通过 this 获得各种方法和属性，而 function 组件内部定义的函数外部不能获取的到。
Q: 为什么废弃 string ref 这种用法




