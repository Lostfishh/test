/*
 * @Date: 2021-07-14 17:07:44
 * @LastEditors: bujiajia
 * @LastEditTime: 2021-07-14 17:12:53
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

//常用plugin
// UglifyJsPlugin  压缩混淆代码
// webpack内置CommonsChunkPlugin，提高打包效率，将第三方库和业务代码分开打包。
// html-webpack-plugin可以根据模板自动生成html代码，并自动引用css和js文件
// HotModuleReplacementPlugin 热更新
// babili-webpack-plugin、transform-runtime 、transform-object-rest-spread
// optimize-css-assets-webpack-plugin 不同组件中重复的css可以快速去重
// imagemin - webpack - plugin  图片压缩
//取出css无用样式
