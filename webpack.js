/*
 * @Date: 2021-07-14 17:07:44
 * @LastEditors: bujiajia
 * @LastEditTime: 2021-07-15 18:21:12
 * @FilePath: /test/webpack.js
 */
//常用loader  plugin
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true, modules: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
        exclude: /node_modules/
      }
    ]
  }
}

// webpack允许我们使用loader来处理文件，loader是一个导出为function的node模块。可以将匹配到的文件进行一次转换，同时loader可以链式传递。
// 样式：style-loader、css-loader、less-loader、sass-loader等
// 文件：raw-loader、file-loader 、url-loader等
// 编译：babel-loader、coffee-loader 、ts-loader等
// 校验测试：mocha-loader、jshint-loader 、eslint-loader等

//webpack基本配置。
const path = require('path')
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'output-file.js',
    publicPath: '/'
  },
  module: {}, // 文件的解析 loader 配置
  plugins: [ new HtmlWebpackPlugin({
            template: "index.html",  // 要打包输出哪个文件，可以使用相对路径
            filename: "index.html"   // 打包输出后该html文件的名称
        })], // 插件，根据需要配置各种插件
  devServer: {} // 配置 dev 服务功能
}

//常用plugin
// UglifyJsPlugin  压缩混淆代码,会将打包后的文件压缩。
// webpack内置CommonsChunkPlugin，提高打包效率，将第三方库和业务代码分开打包。
// html-webpack-plugin可以根据模板自动生成html代码，并自动引用css和js文件，，，，在我们打包项目的时候，一些Html文件也是需要打包的，就用这个。
// HotModuleReplacementPlugin 热更新
// optimize-css-assets-webpack-plugin 不同组件中重复的css可以快速去重
// imagemin - webpack - plugin  图片压缩
//取出css无用样式
//optimization.splitChunks 提取公共引用的模块。避免在多入口重复打包。
//mini-css-extract-plugin 将CSS从JS中提取出来，不然不利于缓存。
//weboack-dashboard  更好的显示相关打包信息,
//webpack-merge  提取公共配置，尖山重复代码

//loader和plugin的区别，Loader只是一个函数，会找对对应的文件进行转换，返回转换后的结果。因为webpack只认识js,所以loader就成了翻译官。在module.rules里面配置，包含test,loader.options参数
//plugin是一些在webpack运行时的插件，可以拓展webpack的功能，，在plugin里面单独配置。类型为数组，每一项就是一个plugin实例。webpack运行时会向外广播出去一些事件，plugin可以监听这些事件，通过webpack提供的api改变输出结果
//webpack构建流程，读取webpack参数 =》 启动webpack 创建compiler对象并开始解析项目 =》从入口文件开始解析，找到其依赖的模块递归遍历分析形成依赖关系树 =》 对不同类型的文件用Loader进行编译最终形成js代码 =》根据入口文件和模块之间的依赖关系。组成一个个包含多个模块的chunk，把每个chunk转换成一个单独的文件加入到输出列表
//以上的整个过程中webpack会通过发布订阅模式向外抛出一些hooks，而webpack的plugin会监听到这些事件，执行插件任务处理输出结果。
//source-map  是干嘛的？是用来将打包后的代码映射回原来代码的，方便调试。
//webpack文件监听   在开发命令中加入--watch  原理就是判断文件的最后编辑时间。
//webpack热更新hot moduler eplacement  浏览器不用刷新就能替换旧的模块。其实就是与浏览器维护了一个websocket。每当文件变化时，wds会向浏览器推送更新并且带上构建的hash，让客户端与上一次资源进行对比，有差异的话，客户端会向wds用ajax请求来获取更改内容（文件列表，hash），这样客户端就能用这些信息继续向wds发起jsonp请求来获取更新。
//babel 原理：将代码转换成ast，把代码转成一些词法单元流，就是词法单元数组， 分析这个词法单元数组，生成新的ast，用新的AST生成代码。
// 静态资源最终访问路径 = output.publicpath + loader等配置路径

//webpack多入口配置是，多个main.js app.vue，配置
entry = {
  entry1: './src/main.js',
  entry2: './src/main.js'
}
output:{
  filename:'[name].js',  //会根据入口文件名字输出
  publicpath:'/'
}

//然后用HtmlWebpackPlugin 
plugins: [
    new HtmlWebpackPlugin({
      filename: 'entry.html',  // 要打包输出的文件名
      template: 'index.html',  // 打包输出后该html文件的名称
      chunks: ['manifest', 'vendor', 'entry']  // 输出的html文件引入的入口chunk
      // 还有一些其他配置比如minify、chunksSortMode和本文无关就省略，详见github
    }),
    new HtmlWebpackPlugin({
      filename: 'entry2.html',
      template: 'index.html',
      chunks: ['manifest', 'vendor', 'entry2']  //这里制定这个html要引用哪个js
    })
  ]
