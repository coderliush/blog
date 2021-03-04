/*
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-02 14:49:31
 * @LastEditors: Do not edit
 */
const JavaScript = {
    title: 'JavaScript基础',
    collapsable: true,
        children: [
            ['/JavaScript/柯里化和偏函数.md', '柯里化和偏函数'],
            ['/JavaScript/事件循环.md', '事件循环'],
            ['/JavaScript/new, call, apply, bind.md', 'new, call, apply, bind']
        ]
}

const ES6 = {
    title: 'ES6',
    collapsable: true,
        children: [
            ['/ES6/promise.md', 'promise'],

        ]
}

const React = {
    title: 'React',
    collapsable: true,
        children: [
            ['/React/ref.md', 'ref'],
            ['/React/context.md', 'context'],
            ['/React/memo & useMemo & useCallback.md', 'memo & useMemo & useCallback'],
            ['/React/useState.md', 'useState'],
            ['/React/useEffect.md', 'useEffect'],
        ]
}

const relatedReact = {
    title: 'React 相关库',
    collapsable: true,
        children: [
            ['/relatedReact/Redux.md', 'Redux'],
            ['/relatedReact/react-redux.md', 'react-redux'],
            ['/relatedReact/redux-thunk.md', 'redux-thunk'],
        ]
}

module.exports = [
    JavaScript,
    React,
    relatedReact,
    ES6
]
