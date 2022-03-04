const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [],
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'));

    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
      });
  },

  css: {},

  // devServer: { 改到public/config.js 因为需要接口地址暴露出去
  //   // development server port 8000
  //   port: 8088,
  //   proxy: {
  //     '/api': {
  //       // target: 'http://113.57.121.225:3000/',
  //       target: 'http://192.168.2.251:3000/',
  //       ws: false,
  //       changeOrigin: true,
  //     },
  //   },
  // },

  publicPath: './',
  outputDir: 'dist',

  // disable source map in production
  productionSourceMap: false,

  lintOnSave: true,

  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],


};
module.exports = vueConfig;
