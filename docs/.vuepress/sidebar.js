/*
 * @Description: 
 * @Author: liushuhao
 * @Date: 2021-02-02 14:49:31
 * @LastEditors: liushuhao
 */
const JavaScript = {
    title: 'JavaScript基础',
    collapsable: true,
        children: [
            ['/JavaScript/柯里化和偏函数.md', '柯里化和偏函数']
        ]
}

const React = {
    title: 'React',
    collapsable: true,
        children: [
            ['/React/ref.md', 'ref'],
            ['/React/context.md', 'context'],
            ['/React/memo & useMemo & useCallback.md', 'memo & useMemo & useCallback']
        ]
}

const relatedReact = {
    title: 'React 相关',
    collapsable: true,
        children: [
            ['/React/Redux.md', 'Redux'],
        ]
}

module.exports = [
    JavaScript,
    React,
    relatedReact
]
