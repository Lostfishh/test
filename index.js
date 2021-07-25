/*
 * @Date: 2021-06-30 10:25:29
 * @LastEditors: bujiajia
 * @LastEditTime: 2021-07-25 22:57:10
 * @FilePath: /test/index.js
 */

// ///////////严格模式下的函数参数是不会随arguments数组值改变而改变
//////////////es6 proxy    能返回整个对象，defineproperty智能遍历每个键值，proxy新标准将得到持续优化。缺点是兼容性问题，无法用polyfill磨平，所以vue3才会到3.0才用proxy
let arrayProxy = function (arr) {
  let len = arr.length
  return new Proxy(arr, {
    get(arr, index) {
      // console.log("get", arr, index, qq);
      if (index > 0) return arr[index]
      let num = Math.abs(index)
      return arr[len - num]
    }
  })
}
var a = arrayProxy([1, 2, 3, 4, 5, 6, 7, 8, 9])
// console.log(a[-1]);

////////////////// js reduce的参数前两个不是当前和下一个，而是总值和当前值
////////////////// 数组转树  考的就是你对对象引用熟不熟

let cList = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 0 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 0 },
  { id: 8, name: '部门H', parentId: 4 }
]
var covertList = function (arr) {
  var map = arr.reduce((total, item) => {
    total[item.id] = item
    return total
  }, {})
  let result = []
  for (let key in map) {
    let item = map[key]
    if (item.parentId == 0) {
      result.push(item)
    } else {
      let parent = map[item.parentId]
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(item)
      }
    }
  }
  return result
}
// var qqq = covertList(cList);
// console.log(qqq);

//////////////////////////////////////////////////////////defineProperty
let obj = {
  value: 1,
  age: 2
}
watch(obj, 'value', function (nv) {
  document.getElementById('q').innerHTML = nv
})
watch(obj, 'age', function (nv) {
  document.getElementById('qq').innerHTML = nv
})
// window.addEventListener("click", function () {
//   obj.value = obj.value + 1;
//   obj.age = obj.age + 2;
// });

function watch(obj, name, fnc) {
  let value = obj[name]
  let p = new Proxy(obj, {
    get(obj, prop) {
      return value
    },
    set(obj, prop, value) {
      // console.log("set", nv);
      value = nv
      fnc(value)
    }
  })
  // Object.defineProperty(obj, name, {
  //   get() {
  //     return value;
  //   },
  //   set(nv) {
  //     console.log("set", nv);
  //     value = nv;
  //     fnc(value);
  //   },
  // });
}
//////////////////////////////////////////////////////////proxy
let proxyObj = {
  age: 2
}
var proxy = new Proxy(proxyObj, {
  get: function (obj, prop) {
    //obj prop固定写法，对象和键
    // console.log("设置 get 操作", obj, prop);
    return obj[prop]
  },
  set: function (obj, prop, value) {
    //obj prop value固定写法，对象和键，值
    // console.log("设置 set 操作", obj, prop, value);
    obj[prop] = value
  }
})
proxy.time = 35 // 设置 set 操作

///////////////////////////////// 发布订阅
///////////////
//  实现思路
// 创建一个对象
// 在该对象上创建一个缓存列表（调度中心）
// on 方法用来把函数 fn 都加到缓存列表中（订阅者注册事件到调度中心）
// emit 方法取到 arguments 里第一个当做 event，根据 event 值去执行对应缓存列表中的函数（发布者发布事件到调度中心，调度中心处理代码）
// off 方法可以根据 event 值取消订阅（取消订阅）
// once 方法只监听一次，调用完毕后删除缓存函数（订阅一次）

class EventEmeitter {
  constructor() {
    this._events = this._events || new Map() // 储存事件/回调键值对
    this._maxListeners = this._maxListeners || 10 // 设立监听上限
  }
  name = 22
}

// 触发名为type的事件
EventEmeitter.prototype.emit = function (type, ...args) {
  // console.log(55, type, args);
  let handler
  handler = this._events.get(type)
  if (Array.isArray(handler)) {
    // 如果是一个数组说明有多个监听者,需要依次此触发里面的函数
    for (let i = 0; i < handler.length; i++) {
      if (args.length > 0) {
        handler[i].apply(this, args)
      } else {
        handler[i].call(this)
      }
    }
  } else {
    // 单个函数的情况我们直接触发即可
    if (args.length > 0) {
      handler.apply(this, args)
    } else {
      handler.call(this)
    }
  }

  return true
}

// 监听名为type的事件
EventEmeitter.prototype.addListener = function (type, fn) {
  const handler = this._events.get(type) // 获取对应事件名称的函数清单
  if (!handler) {
    this._events.set(type, fn)
  } else if (handler && typeof handler === 'function') {
    // 如果handler是函数说明只有一个监听者
    this._events.set(type, [handler, fn]) // 多个监听者我们需要用数组储存
  } else {
    handler.push(fn) // 已经有多个监听者,那么直接往数组里push函数即可
  }
}

EventEmeitter.prototype.removeListener = function (type, fn) {
  const handler = this._events.get(type) // 获取对应事件名称的函数清单
  // 如果是函数,说明只被监听了一次
  if (handler && typeof handler === 'function') {
    this._events.delete(type, fn)
  } else {
    let postion
    // 如果handler是数组,说明被监听多次要找到对应的函数
    for (let i = 0; i < handler.length; i++) {
      if (handler[i] === fn) {
        postion = i
      } else {
        postion = -1
      }
    }
    // 如果找到匹配的函数,从数组中清除
    if (postion !== -1) {
      // 找到数组对应的位置,直接清除此回调
      handler.splice(postion, 1)
      // 如果清除后只有一个函数,那么取消数组,以函数形式保存
      if (handler.length === 1) {
        this._events.set(type, handler[0])
      }
    } else {
      return this
    }
  }
}
var bus = new EventEmeitter()
bus.addListener('qq', function (name) {
  this.name = '哈哈哈'
  // console.log(this.name);
})
bus.addListener('qq', function (name, age) {
  // console.log(name, age);
})
bus.emit('qq', '小明', 32)

////////////////////////////vue的computed和watch，标识就是会有一个lazy:true表示为computed,变化的时候会让dirty编程true

/////////////////////////////ast语法树 {tga:'div',type:1,attrs:[{name:1},childern:[],parent:null} virtual

/////////////////////// dom 是虚拟dom ,vue初始化的时候 template => ast树 => codegen方法 => render函数 => 内部调用_c方法=> 虚拟dom 然后转换成虚拟dom ，这个过程就是在编译的时候。我们就是监听虚拟dom,虚拟dom变化的时候触发响应的watcher,做一个diff，然后重新渲染.dom diff用的是双指针（同时在新老dom树上比较），vue做了四种优化策略（开头比开头，结尾比结尾，开头比结尾，结尾比开头），每次比对都会执行这个优化策略。所以vfor的时候key要用唯一值，不能用index,因为dom diff的时候会看key和标签名来决定要不要复用。

/////////////////////////nextTick实际上就是将回调函数放入一个异步方法数组，通过promise->mutationObserver->setimmediate->settimeout依次尝试运行，然后返回promise(如果支持的话)

////////////////////// with(obj){console.log(a);}就相当于是从obj这个作用于里面取值,相当于 console.log(obj.a);

/////////////////////虚拟dom vNode{tga:'p',data:{},key:'',childern:[],text:''} , 通过Vue原型上的_updtae转化为真实dom。这个过程用__patch__函数完成的

//////////////vue.extend  用来指令花调用组件的，先传建一个组件，然后用vue.extend把他变成一个构造函数，然后把他实例化得到真实dom,然后document.body.appendChild(newInstance.$mount().$el); 把他手动挂载后添加到真实dom上,暴露出这个组件的显示方法，这个方法会return 一个promise,好让用户点击确定或者取消。隐藏这个组建的时候要手动去除这个dom,手动this.$destroy销毁。

/////////////////////////////eventloop  js中任务分为两种，同步任务和异步任务，更精确分为宏任务和微任务，script里面所有代码为宏任务，setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O、UI Rendering。 微任务有Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver，。
// 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
// 当指定的事情完成时，Event Table会将这个函数移入Event Queue。
// 主线程内的任务执行完毕为空，栈为空，会去Event Queue读取对应的函数，进入主线程执行。
// 上述过程会不断重复，也就是常说的Event Loop(事件循环)。
// 1 7 6 8 2 4  9 11 3 5 10 12

/////////////////////////////////////////////////////网站重构
//重复代码，过长函数，代码耦合度，可读性，架构以来复杂度。

/////////////////////////////////////////////////////前端优化
//减少http请求， DNS 查找，TCP 握手，浏览器发出 HTTP 请求，服务器接收请求，服务器处理请求并发回响应，浏览器接收响应

//服务端渲染客户端渲染: 获取 HTML 文件，根据需要下载 JavaScript 文件，运行文件，生成 DOM，再渲染。服务端渲染：服务端返回 HTML 文件，客户端只需解析 HTML。
//cdn加速，客户端向dns服务器获取全局负载均衡系统（gslb）的地址，获取离用户最近的本地负载均衡系统，浏览器向本地负载均衡系统请求，如果有缓存就取出来，没有的话就向服务器请求，并且缓存在本地。

//css放在文件上面，js放在下面，不然可能看到的页面是没有样式的，很丑。

//使用iconfont代替图片图表

//压缩文件。avaScript：UglifyPlugin，CSS ：MiniCssExtractPlugin，HTML：HtmlWebpackPlugin。更好的是用gzip,后端也要开启，用compression

//图片懒加载,压缩图片

//webpack按需加载，通过配置 output 的 filename 属性可以实现这个需求。filename 属性的值选项中有一个 [contenthash]，它将根据文件内容创建出唯一 hash。当文件内容发生变化时，[contenthash] 也会发生变化。

//减少重绘和重排，重排： DOM 元素位置或大小时，会导致浏览器重新生成渲染树，这个过程叫重排。    重绘：当重新生成渲染树后，就要将渲染树每个节点绘制到屏幕，这个过程叫重绘。不是所有的动作都会导致重排，例如改变字体颜色，只会导致重绘。记住，重排会导致重绘，重绘不会导致重排 。   用 JavaScript 修改样式时，最好不要直接写样式，而是替换 class 来改变样式。如果要对 DOM 元素执行一系列操作，可以将 DOM 元素脱离文档流，修改完成后，再将它带回文档。推荐使用隐藏元素（display:none）

//flexbox的性能比原始布局要好

////////////////////////////////////////////////websocket是通过心跳机制来保持长连接的，客户端就像心跳一样每隔固定的时间发送一次ping，来告诉服务器，我还活着，而服务器也会返回pong，来告诉客户端，服务器还活着。 每次收到消息的时候会把连接状态变成true,在第一次连接的时候调用信条函数，有一个等待函数，等待函数判断的时候如果状态是false,那么就说明连接断了。

/////////////////////////////////////////////////////输入url到页面出来过程
//url解析，根据dns系统查询ip。网络标准规定url只能是utf-8的规则，用encodeURIComponent保证是这个规则，比encodeURI编码范围更广。
//dns查找，本地hosts文件查找 => 本地dns解析器查看缓存 => 计算机配置的dns服务器上找 => 全球dns服务器找。 前端的dns优化，可以在html页面头部写入dns缓存地址
//然后就是tco的三次握手，请求HTML文件，如果本地浏览器缓存有就拿，没有就去后端拿。拿到后看respose的结构,cache-control优先级最高，cache-control:maxage=123123123啥的。然后看expires，这是强缓存。 协商缓存有if-no-match和if-modifiles-since,etag,协商缓存返回304。强缓存获取顺序：内存=》硬盘
//然后就是解析html文档生成dom树，解析css生成cssdom树，执行js，根据dom和cssdom生成渲染树render tree,根据大小啥的生成布局，最后gpu把他绘制出来。
//通过chrome浏览器的工具，比如看网络请求情况的network，还有看页面渲染情况的perfermance

//////////////////////////////////////////////js的数据类型,string,object,number,boolean,undefind,null,symbol,bigint,其中function是object的一个子类型，可以用typeof来区分函数和对象。
// instanceof 用来比较一个对象是否为某一个构造函数的实例。cdn通过文件名来判断是否有更新。打包文件加上hash。

//////////////////////////////////////////// cdn原理：用户请求资源，先查浏览器本地缓存，是否是有效缓存，然后dns解析到ip地址，获得李用户最近的边缘节点，边缘节点查自己有没有缓存，没有就向中心服务器查询缓存，中心也没有就向源地址请求。源地址是客户配置的。

////数组扁平化
//1，利用tostring,2,利用递归  3,利用[].concat(...arr)  每次...都会解构一层数组，利用arr.some来判断有就执行这个
let flat = function (arr) {
  return arr.toString().split(',').join('')
}
let flat2 = function (arr) {
  let res = []
  arr.map(item => {
    if (Array.isArray(item)) {
      res = res.concat(flat2(item)) //把数组每一项为数组的一次递归下去，return 的res就是全部concat就能拿到。
    } else {
      res.push(item)
    }
  })
  return res
}
let aaa = flat2([1, [2, 3, [4, 6]]])

/////////////手写call,apply,bind
Function.prototype.call2 = function (ctx, ...args) {
  ctx.fn = this
  ctx.fn(...args)
  delete ctx.fn
}
Function.prototype.bind2 = function (ctx, arg) {
  let fn = this
  console.log('canshu ', arg)
  return function () {
    return fn.apply2(ctx, arg)
  }
}
Function.prototype.apply2 = function (ctx, arg) {
  ctx.fn = this
  ctx.fn(...arg)
  delete ctx.fn
}
let foo = {
  name: 'xiaohong'
}
let call2text = function (q, w, e) {
  console.log(222, this.name, q, w, e)
}
// call2text.call2(foo, 555);
// call2text.apply(foo, [1, 2, 3]);
// let re = call2text.bind2(foo, [1, 2, 3]);
// re();

///////////////////////////////AMD、CMD、CommonJS、ES6 Module
//amd 就是 requirejs,异步加载模块机制  一开始就执行  define(function(){})  require(['a],function(){})
//cmd  延迟执行，依赖就近，只有到require才执行   define require
// commonjs 是nodejs的模块加载机制，所有代码都运行在模块作用域，不会污染全局。是同步加载的，只有加载完成才会执行后面的操作，require输出的是原始值的拷贝，改变这个值不会内部模块的值。   module.exports=function(){}   require('/a')
// ex6 module   export default {}     import a from '/a'  ，上下两个区别是，commonjs是运行时加载，module是编译时输出接口，commjs是加载整个模块，module可以单独加载某一个模块。module是输出的值的引用，会改变原始值，commjs的this指向当前模块，module指向undefind。

//set和map的区别就是map可以用任何数据类型当键

///////////////////////vue router
//hash  通过坚挺hashchange,window.location.assign,window.location.replace. window.history
//history  通过坚挺popstate, window.history.pushState,window.history.replaceState
// $router是VueRouter的实例化对象，$route是当前路由，也就是说$route是$router的一个属性。
//vue的路由守卫  当前路由:beforeRouteLeave, 全局beforeEach,重用的组件beforeRouteUpdate,在路由配置里配置beforeEnter,在被要进去的beforeRouteEnter（实例还没创建， 不能使用this）；
//可以在路由配置里配置路由切换后的滚动：scrollBehavior(to,from,savePosition){if(savePosition){return savePosition}else{return {x:0,y:0}}}

//keep-alive原理。
//vue的过程 init-$mount-compile-render-vnode-patch-dom

////////////////////////////////////////////// h5的新特性
//geolocation  getcurrentlocation,离线缓存:通过设置manifest，localstorage,websocke.onopen  onmessage,onerror,onclose
//webworker  新建一个js文件，把里面的数据用postMessage(num)传出去。然后在需要用的文件 var a = new Worker('worker.js)。a.onmessage = function(event){get event.data}。需要停用的时候调用w.serminate()
resolvepromise = function (promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  // 防止多次调用
  let called
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        console.log('是儿子')
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        x.then(resolve)
        // then.call(
        //   x,
        //   (y) => {
        //     // 成功和失败只能调用一个
        //     if (called) return;
        //     called = true;
        //     // resolve的结果依旧是promise 那就继续解析
        //     resolvepromise(promise2, y, resolve, reject);
        //   },
        //   (err) => {
        //     // 成功和失败只能调用一个
        //     if (called) return;
        //     called = true;
        //     reject(err); // 失败了就失败了
        //   }
        // );
      } else {
        resolve(x) // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return
      called = true
      // 取then出错了那就不要在继续执行了
      reject(e)
    }
  } else {
    resolve(x)
  }
}

class pro {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    // 声明返回的promise2
    let promise2 = new pro((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          let x = onFulfilled(this.value)
          resolvepromise(promise2, x, resolve, reject)
        })
        // resolvepromise函数，处理自己return的promise和默认的promise2的关系
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          let x = onRejected(this.reason)
          resolvepromise(promise2, x, resolve, reject)
        })
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            let x = onFulfilled(this.value)
            resolvepromise(promise2, x, resolve, reject)
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            let x = onRejected(this.reason)
            resolvepromise(promise2, x, resolve, reject)
          })
        })
      }
    })
    // 返回promise，完成链式
    return promise2
  }
  catch(onRejected) {
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    if (this.state === 'pending') {
      this.onRejectedCallbacks.push(onRejected)
    }
  }
}
this.a = 1
// var pp = new pro((resolve, reject) => {
//   setTimeout(() => {
//     resolve(this)
//   }, 500)
// })
//   .then(res => {
//     console.log('11', res)
//     return '我是上面来的'
//   })
//   .then(res => {
//     console.log(22, res)
//     return new pro(resolve => {
//       resolve('我是中间来的')
//     })
//   })
//   .then(res => {
//     console.log(33, res)
//   })
// .catch((err) => {
//   console.log("呵呵", err);
// });

var a = {
  b: function () {
    console.log(111, this)
  },
  c: () => {
    console.log(22, this)
  }
}
a.b()
a.c()
