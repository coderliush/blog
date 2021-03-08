<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-03 11:07:32
 * @LastEditors: liushuhao
-->
## context 的作用 ##     
Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。简单来说就是不用层层传递，直接从根组件获取和修改 state。     
## context 的使用 ##
1. 创建一个 context： <code>const MyContext = React.createContext()</code>
2. 父组件提供共享的数据：<code>&lt;MyContext.Provider value= \{ \{ num, setNum \} \}&gt;</code>
3. 子组件是函数组件：通过 useContext 获取数据：<code>const { num, setNum } = useContext(MyContext)</code>
子组件是类组件：在生命周期内通过 this.context 获得
```js
import React, { useContext, useState } from 'react'

const MyContext = React.createContext()

function Parent() {
  const [num, setNum] = useState(0)

  return (
    <MyContext.Provider value={{ num, setNum }}>
      <Child />
    </MyContext.Provider>
  )
}

// 函数组件使用 useContext 获取全局状态
function Child() {
  const { num, setNum } = useContext(MyContext)
  
  return (
    <>
      <p>{num}</p>
      <button onClick={() => { setNum(num + 1) }}>num ++</button>
    </>
  )
}
// 类组件使用 this.context 获取全局状态（仅示例，class Child 应该先于 Parent 组件）
class Child extends React.Component {
    constructor() {
        super()
        console.log('constructor', this.context)
    }

    componentDidMount() {
        console.log('componentDidMount', this.context)
    }

    render() {
      return <>this.context</>
    }
}
Child.contextType = MyContext

export default Parent
```
## context性能问题 ##     
这里有个问题，一个子组件修改了 state, 父组件会重新渲染，那么父组件下的所有子组件都会重新渲染，即使它的 state 不变。 
```js
import React, { useContext, useState, useMemo } from 'react'

const MyContext = React.createContext()

function Parent() {
  const [num, setNum] = useState(0)
  const [sibNum, setSibNum] = useState(0)

  return (
    <MyContext.Provider value={{ num, setNum, sibNum, setSibNum }}>
      <Child />
      <Sib />
    </MyContext.Provider>
  )
}

// 函数组件使用 useContext 获取全局状态
function Child() {
  const { num, setNum } = useContext(MyContext)
  
  return (
    <>
      <p>{num}</p>
      <p>{sibNum}</p>
      <button onClick={() => { setNum(num + 1) }}>num ++</button>
    </>
  )
}

function Sib() {
  console.log('sib1')
  return <>{ sibNum }</>
}


export default Parent
```
当点击 num++ 时，调用父组件的 setNum，父组件重新渲染，导致 Sib 也会重新渲染。这种情况也不能用 React.memo 优化。React.memo 仅检查 props 变更，当 context 发生变化时，它仍会重新渲染。  
这里使用 useMemo 优化，传入依赖的 state。当依赖改变时才重新渲染。     

```js
import React, { useContext, useState, useMemo } from 'react'

const MyContext = React.createContext()

function Parent() {
  const [num, setNum] = useState(0)
  const [sibNum, setSibNum] = useState(0)

  const Sib = useMemo(() => {
    return <>sib</>
  }, [sibNum])

  return (
    <MyContext.Provider value={{ num, setNum, sibNum, setSibNum }}>
      <Child />
      {Sib}
    </MyContext.Provider>
  )
}

// 函数组件使用 useContext 获取全局状态
function Child() {
  const { num, setNum, sibNum, setSibNum } = useContext(MyContext)
  
  return (
    <>
      <p>{num}</p>
      <p>{sibNum}</p>
      <button onClick={() => { setNum(num + 1) }}>num ++</button>
      <button onClick={() => { setSibNum(sibNum + 1) }}>sibNum ++</button>
    </>
  )
}


export default Parent
```
