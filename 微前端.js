/*
 * @Date: 2021-07-15 11:35:07
 * @LastEditors: bujiajia
 * @LastEditTime: 2021-07-15 11:38:06
 * @FilePath: /test/微前端.js
 */
// 每个模块由一个独立的团队去开发
//集成方式1：后端模板集成，通过nginx转发不同的路由，把其他所有页面都转发到index.html。
//2:可以通过iframe来实现。 设置一个对象来映射路径和不同页面的地址。通过iframe来
//3：通过js来实现，  就是把iframe改成过了一个div，然后每个页面都是一个js文件，通过script标签引用到容器，这些js并不会马上执行，而是暴露出一个全局的方法，通过Location.pathname来调用不用的全局方法，把这个div的id传进去，
//4:webcomponent实现，和上面的差不多，就是全局方法变成了一个各自的元素。通过createelement然后appendchild到这个div下面
