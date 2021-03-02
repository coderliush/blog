<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-19 13:30:16
 * @LastEditors: liushuhao
-->
### 使用 
```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './components/App'

const reducer = (state = { num: 0 }, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        num: state.num + action.payload
      }
    default:
      return state
  }
}
let store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
-----------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'

function App(props) {
  const { num, addNum } = props
  return (
    <div className="App">
      <p>{num}</p>
      <button onClick={() => addNum(1)}>button</button>
    </div>
  )
}

const mapStateToProps = state => ({ num: state.num })
const mapDispatchToProps = dispatch => ({
  addNum: payload => dispatch({ type: 'ADD', payload })
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
```
mapStateToProps 从 store 中获取 state。mapDispatchToProps 修改 store 中的 state
