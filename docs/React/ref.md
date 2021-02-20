**ref 的作用**
1. 操作 dom
2. 使用子组件的方法

**类组件使用 ref 的两种方式：**
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
useRef 仅能用在函数组件，createRef 仅能用在 class 组件。    
如果在函数组件中使用 createRef，那么每次函数执行的时候，每次都会创建一个新的 { current: null } 对象。createRef 可以在 class 组件中能使用是因为 class 组件分离了生命周期， 只会创建 ref 一次。

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
forwardRef
![ref](/images/react/forwardRef.png)     
forwardRef 将 props，ref 做转发。forwardRef 只做了一件事情，返回一个 elementType 对象。render 是传入的函数，$$typeof 是 React 加的一个标识。
![ref](/images/react/createRef.png)     
useRef 和 createRef 都是返回一个包含 current  属性的对象，修改这个属性不会触发组件的更新。区别在 useRef 可以传个持久化的参数。
![ref](/images/react/useRef.png)     

Q: 为什么函数组件不能直接使用 ref    
A：函数组件没有实例，class 组件的函数挂在原型链上，可以通过 this 获得各种方法和属性，而 function 组件内部定义的函数外部不能获取的到。
Q: 为什么废弃 string ref 这种用法
1. React 需要持续的追踪当前渲染的组件，因为它无法知道 this。 这会使 React 变得有点慢
2. 实际应用中子组件无法将 ref 在传递给它的子组件。因为对子组件的内部组件来说，它的实例无法挂载一个字符串上，即 ref 不能层层传递。而对象和函数形式可以，在 React commit 阶段, React 挂载 ref。如果 ref 是一个对象且有 current 属性，则将实例挂在 current 上。如果是一个函数，将实例当做参数传进去，执行函数将实例挂载。    
Q：函数组件能不能使用 createRef，class 组件能不能使用 useRef？
A：class 组件使用 useRef 会报错。函数组件使用 createRef 会有些问题，因为每次更新组件函数会重新执行，createRef 会重新执行生成一个 { current: null }，此时之前 current 挂载的将被重置。      
};
```



