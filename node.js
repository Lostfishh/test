const http = require("http");

const server = http.createServer();
server.listen(3000, () => {
  process.title = "程序员成长指北测试进程";
  console.log("进程id", process.pid);
});

//node知识点：js是单线程的是指js代码跑起来是单线程的，但是js跑起来后不是单线程的，不管是浏览器还是node都是多线程的，libuv有线程池的概念，会通过这个来模拟不同操作系统的异步调用。
//一个进程由多个线程组成。以Chrome浏览器中为例，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程（下文会详细介绍），比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。
//nodejs的运行机制  v8解析js代码 => 解析后的代码调用node api  => libuv库负责node api的执行，将不同的任务分配给不同的线程，形成一个event loop，以异步的形式将执行结果返回给v8  => v8再将结果返回给用户。
//其中libuv引擎中的事件分为六个阶段  timers (settimeout,setinterval) => i/o callbacks(处理上一轮循环中未处理的一些i/o回调) => idle prepare仅node内部使用 => poll(获取新的i/o事件)，适当条件下node将阻塞在这里 => check 执行setimmediate的回调 => close callbacks 执行socket的close回调。

//node的中间件。
var setHeader = function () {
  return function (req, res, next) {
    res.statusCode = 200;
    res.header = { "Content-Type": "text/html" };
    res.head = '<head><meta charset="utf-8"/></head>';
    next();
  }; //这是一个设置头部信息的中间件
};
exports.setHeader = setHeader;

app.use(middleware.setHeader());
app.get("/", middleware.setHeader(), function (req, res) {
  res.writeHead(res.statusCode, res.header);
  res.write(res.head);
  res.end("你好");
}); //中间可以设置多个中间件。
