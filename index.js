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
