/*
 * @Author: liushuhao
 * @Date: 2021-02-27 10:04:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-07 20:51:22
 */
const blog = {
    text: '博客',
    link: '/blog/'
}

const algorithm = {
    text: '算法结构',
    link: '/algorithm/'
}

const react = {
    text: 'React源码解析',
    link: '/react/'
}

module.exports = [
    blog,
    algorithm,
    react
]
function dounce(fn, wait) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, wait)
    }
}


function throttle(fn, wait) {
    let timer = null;
    return function () {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, wait)
    }
}