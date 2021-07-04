// aa promise 的题目
// 包括三个状态 pending fulfilled rejected
class Pro {
  constructor(fn) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = (value) => {
      if (this.state === "pending") {
        this.value = value;
        this.state = "fulfilled";
      }
    };
    let reject = (reason) => {
      if (this.state === "pending") {
        this.reason = reason;
        this.state = "reject";
      }
    };
    try {
      fn(resolve, reject);
    } catch (err) {
      reject(err);
    }
    return this;
  }
  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "reject") {
      onRejected(this.reason);
    }
    if (this.state === "pending") {
      onRejected(this.reason);
    }
  }
}
var b = new Promise((resolve, reject) => {
  resolve(111);
  //   reject(222);
  //   setTimeout(() => {
  //     resolve(111);
  //   }, 1000);
  //   console.log("拿到了什么", resolve, reject);
  //   var num = 1;
  //   setTimeout(() => {
  //     num++;
  //     if (num === 2) {
  //       console.log("是的");
  //       resolve("是相等的");
  //     } else {
  //       console.log("不是的");
  //       reject("不相等");
  //     }
  //   }, 1500);
});
// Promise.resolve(b).then((res) => {
//   console.log(11, res);
// });
// b.then((res, err) => {
//   console.log("我是结果", res, err);
// });

// ///////////严格模式下的函数参数是不会随arguments数组值改变而改变
//////////////es6 proxy
let arrayProxy = function (arr) {
  let len = arr.length;
  return new Proxy(arr, {
    get(arr, index) {
      // console.log("get", arr, index, qq);
      if (index > 0) return arr[index];
      let num = Math.abs(index);
      return arr[len - num];
    },
  });
};
var a = arrayProxy([1, 2, 3, 4, 5, 6, 7, 8, 9]);
// console.log(a[-1]);

////////////////// js reduce的参数前两个不是当前和下一个，而是总值和当前值
////////////////// 数组转树  考的就是你对对象引用熟不熟

let cList = [
  { id: 1, name: "部门A", parentId: 0 },
  { id: 3, name: "部门C", parentId: 1 },
  { id: 4, name: "部门D", parentId: 1 },
  { id: 5, name: "部门E", parentId: 0 },
  { id: 6, name: "部门F", parentId: 3 },
  { id: 7, name: "部门G", parentId: 0 },
  { id: 8, name: "部门H", parentId: 4 },
];
var covertList = function (arr) {
  var map = arr.reduce((total, item) => {
    total[item.id] = item;
    return total;
  }, {});
  let result = [];
  for (let key in map) {
    let item = map[key];
    if (item.parentId == 0) {
      result.push(item);
    } else {
      let parent = map[item.parentId];
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(item);
      }
    }
  }
  return result;
};
// var qqq = covertList(cList);
// console.log(qqq);

//////////////////////////////////////////////////////////defineProperty
let obj = {
  value: 1,
  age: 2,
};
watch(obj, "value", function (nv) {
  document.getElementById("q").innerHTML = nv;
});
watch(obj, "age", function (nv) {
  document.getElementById("qq").innerHTML = nv;
});
// window.addEventListener("click", function () {
//   obj.value = obj.value + 1;
//   obj.age = obj.age + 2;
// });

function watch(obj, name, fnc) {
  let value = obj[name];
  let p = new Proxy(obj, {
    get(obj, prop) {
      return value;
    },
    set(obj, prop, value) {
      console.log("set", nv);
      value = nv;
      fnc(value);
    },
  });
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
  age: 2,
};
var proxy = new Proxy(proxyObj, {
  get: function (obj, prop) {
    //obj prop固定写法，对象和键
    // console.log("设置 get 操作", obj, prop);
    return obj[prop];
  },
  set: function (obj, prop, value) {
    //obj prop value固定写法，对象和键，值
    // console.log("设置 set 操作", obj, prop, value);
    obj[prop] = value;
  },
});
proxy.time = 35; // 设置 set 操作

// 发布订阅
class EventEmeitter {
  constructor() {
    this._events = this._events || new Map(); // 储存事件/回调键值对
    this._maxListeners = this._maxListeners || 10; // 设立监听上限
  }
  name = 22;
}

// 触发名为type的事件
EventEmeitter.prototype.emit = function (type, ...args) {
  console.log(55, type, args);
  let handler;
  handler = this._events.get(type);
  if (Array.isArray(handler)) {
    // 如果是一个数组说明有多个监听者,需要依次此触发里面的函数
    for (let i = 0; i < handler.length; i++) {
      if (args.length > 0) {
        handler[i].apply(this, args);
      } else {
        handler[i].call(this);
      }
    }
  } else {
    // 单个函数的情况我们直接触发即可
    if (args.length > 0) {
      handler.apply(this, args);
    } else {
      handler.call(this);
    }
  }

  return true;
};

// 监听名为type的事件
EventEmeitter.prototype.addListener = function (type, fn) {
  const handler = this._events.get(type); // 获取对应事件名称的函数清单
  if (!handler) {
    this._events.set(type, fn);
  } else if (handler && typeof handler === "function") {
    // 如果handler是函数说明只有一个监听者
    this._events.set(type, [handler, fn]); // 多个监听者我们需要用数组储存
  } else {
    handler.push(fn); // 已经有多个监听者,那么直接往数组里push函数即可
  }
};

EventEmeitter.prototype.removeListener = function (type, fn) {
  const handler = this._events.get(type); // 获取对应事件名称的函数清单
  // 如果是函数,说明只被监听了一次
  if (handler && typeof handler === "function") {
    this._events.delete(type, fn);
  } else {
    let postion;
    // 如果handler是数组,说明被监听多次要找到对应的函数
    for (let i = 0; i < handler.length; i++) {
      if (handler[i] === fn) {
        postion = i;
      } else {
        postion = -1;
      }
    }
    // 如果找到匹配的函数,从数组中清除
    if (postion !== -1) {
      // 找到数组对应的位置,直接清除此回调
      handler.splice(postion, 1);
      // 如果清除后只有一个函数,那么取消数组,以函数形式保存
      if (handler.length === 1) {
        this._events.set(type, handler[0]);
      }
    } else {
      return this;
    }
  }
};
var bus = new EventEmeitter();
bus.addListener("qq", function (name) {
  this.name = "哈哈哈";
  console.log(this.name);
});
bus.addListener("qq", function (name, age) {
  console.log(name, age);
});
bus.emit("qq", "小明", 32);
