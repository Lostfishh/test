/*
 * @Date: 2021-07-13 09:26:22
 * @LastEditors: bujiajia
 * @LastEditTime: 2021-07-14 16:42:44
 * @FilePath: /test/css.js
 */
/////////////display:none 的元素都已经不再页面存在了，因此肯定也无法触发它上面绑定的事件；

// visibility:hidden 元素上绑定的事件也无法触发；

// opacity: 0元素上面绑定的事件是可以触发的。  ss 

// margin塌陷 父子嵌套的元素垂直方向的margin取最大值。用bfc 块级格式上下文。可以设置float,position absolute fixed  ,overflow:hidden来避免
