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
    get(arr, index, qq) {
      console.log("get", arr, index, qq);
      if (index > 0) return arr[index];
      let num = Math.abs(index);
      return arr[len - num];
    },
  });
};
var a = arrayProxy([1, 2, 3, 4, 5, 6, 7, 8, 9]);
console.log(a[-1]);

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
var qqq = covertList(cList);
console.log(qqq);
