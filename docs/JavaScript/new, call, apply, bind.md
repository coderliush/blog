<!--
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-03-02 16:09:05
 * @LastEditors: liushuhao
-->
## new ##
![](/images/js/new.png)   
```js
function new() {
    let obj = {}
    let fn = [].shift.call(arguments)
    obj._proto__ = fn.prototype
    let res = fn(obj, arguments)
    return res instanceof Object ? res : obj
}
```
