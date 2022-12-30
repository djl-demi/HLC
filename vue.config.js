// 控制台输入 vue inspect > output.js 可打印当前webpack配置
const path = require("path")
const theme = require("./src/common/antd-theme")
const MomentLocalesPlugin = require("moment-locales-webpack-plugin") // moment 按需加载的插件
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const CompressionPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = ["js", "css"]
module.exports = {
  lintOnSave: false,
  publicPath: "/",
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    port: 8866,
    open: true, // 启动时自动打开浏览器
    hotOnly: true,
    proxy: {
      "/api": {
        target: "https://zbapip.jsyinghuan.com", // 目标地址
        // target: 'http://10.10.94.139:8083',
        // target: "https://classify-apip.jsyinghuan.com", // 目标地址
        ws: true,
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          "^/api": "" // 路径重写
        }
      }
    }
  },
  chainWebpack: config => {
    // 配置路径别名
    config.resolve.alias
      .set("@", path.join(__dirname, "src"))
      .set("components", path.join(__dirname, "src/components"))
      .set("views", path.join(__dirname, "src/views"))
      .set("api", path.join(__dirname, "src/api"))
      .set("utils", path.join(__dirname, "src/utils"))
      .set("mixins", path.join(__dirname, "src/mixins"))
      .set("plugins", path.join(__dirname, "src/plugins"))
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // 修改它的选项...
        return options
      })
    config.plugin("html").tap(args => {
      args[0].title = "重力储能管理系统"
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: theme,
          javascriptEnabled: true
        }
      }
    }
  },
  pluginOptions: {
    // foo: {
    // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
    // }
  },

  // 链式操作  https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
  // 修改loader配置
  // 添加新的loader
  // 替换一个规则里的loader
  // 修改插件选项
  // productionSourceMap: false, // 生产环境禁用sourcemap

  // 调整webpack配置
  configureWebpack: config => {
    // config.resolve.alias["@ant-design/icons/lib/dist$"] = path.resolve(__dirname, "./src/common/icons.js") // antd icon按需引入

    config.plugins.push[("import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: "css" })] // `style: true` 会加载 less 文件

    // 高德地图引入
    config.externals = {
      AMap: "AMap",
      AMapUI: "AMapUI"
    }

    // momoent 按需加载
    config.plugins.push(
      new MomentLocalesPlugin({
        localesToKeep: ["en", "zh-cn"]
      })
    )

    if (process.env.NODE_ENV === "development") {
      // console.log(config, "webpack配置")
    } else {
      config.plugins.push(
        new CompressionPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      // config.devtool = undefined
      // 为其它环境修改配置...
      // config.plugins.push(new BundleAnalyzerPlugin()) // 打包大小查看
      // config.plugins.push(
      //   new CompressionPlugin({
      //     test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
      //     threshold: 100240 // 归档需要进行压缩的文件大小最小值
      //   })
      // )
    }
  }
}
