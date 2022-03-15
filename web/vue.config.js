const path = require("path");
const debug = process.env.NODE_ENV !== "production";
const port = process.env.port || process.env.npm_config_port || 9528

module.exports = {
  // Base path Relative path
  publicPath: process.env.NODE_ENV === 'production'?'./':'./',
  // Output file directory
  outputDir: "dist",
  // outputDir: __dirname + '/../server/web', 
  // outputDir: process.env.outputDir,
  assetsDir: "assets", // Static Resource Catalog 
  // indexPath: "index.html",
  // eslint-loader Whether to check at the time of saving
  lintOnSave: true,
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  // compiler: false,

  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md   webpack link API for generating and modifying webapck configuration
  chainWebpack: () => {
    if (debug) {
      // Local development configuration
    } else {
      // Local development configuration
    }
  },
  configureWebpack: config => {
    // webpack configuration, merge configuration when the value is an object, overwrite configuration when it is a method
    if (debug) {
      // Development environment configuration
      config.devtool = "cheap-module-eval-source-map";
      config.mode = "development";
    } else {
      // Production environment configuration
      config.mode = "production";
    }
    Object.assign(config, {
      // Development and production of common configurations
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src") // Set path alias
          //...
        }
      }
    });
  },
  // vue-loader Configuration items
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},

  // Whether the production environment generates sourceMap files
  productionSourceMap: true,
  // css-related configuration Configure the css loader above the chainWebpack configuration
  css: {
    // Whether to use the css separation plugin ExtractTextPlugin
    extract: true,
    // Enable CSS source maps? If or not the style map is being built, false will improve the build speed
    sourceMap: false,
    // css presetter configuration items
    loaderOptions: {},
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores 
  parallel: require("os").cpus().length > 1,
  
  pwa: {},
  devServer: {
    // open: process.platform === "darwin",
    // host: "localhost",
    port: port,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    // https: false,
    // hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        // target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }, 
    // eslint-disable-next-line no-unused-vars
    before: app => {}
  },
  pluginOptions: {
    // ...
  }
};
