import { createVuePlugin } from 'vite-plugin-vue2'
// const path = require('path')
// const path = require('path')
import path from 'path'
export default {
    plugins: [createVuePlugin()],
    base: '/ThreeJsModelViewer/',
    css: {
        //* css模块化
        modules: { // css模块化 文件以.module.[css|less|scss]结尾
            generateScopedName: '[name]__[local]___[hash:base64:5]',
            hashPrefix: 'prefix',
        },
        //* 预编译支持less
        preprocessorOptions: {
            less: {
                // 支持内联 JavaScript
                javascriptEnabled: true,
            },
        },
    },
    server: {
        port: 9099,
        // 是否自动在浏览器打开
        open: true,
        outDir: 'target',
        alias: {
            // 键必须以斜线开始和结束
            '/@/': path.resolve(__dirname, './src')
            // '/@components/': path.resolve(__dirname, './src/components')
        },
        proxy: {
            // 如果是 /lsbdb 打头，则访问地址如下
            '/api': 'http://127.0.0.1:3000/',
            // 如果是 /lsbdb 打头，则访问地址如下
            // '/lsbdb': {
            //   target: 'http://10.192.195.96:8087/',
            //   changeOrigin: true,
            //   // rewrite: path => path.replace(/^\/lsbdb/, '')
            // }
        }
    },

}