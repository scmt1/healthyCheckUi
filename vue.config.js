const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 9120,
        proxy: {
            '/scmt': {
                target: 'https://192.168.1.147:8888',
                changeOrigin: true,
                pathRewrite: {
                    '^/scmt': 'scmt'
                },
                ws: true
            },
            '/lis': {
                target: 'http://127.0.0.1:8887',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/lis': 'lis'
                }
            },
            '/tempFileUrl': {
                target: 'http://127.0.0.1:8807',
                ws: true,
                pathRewrite: {
                    '^/tempFileUrl': ''
                }
            },
            '/foo': {
                target: '<other_url>'
            },
            '/spiderUrl':{
                target: 'http://192.168.1.88:8088',
                ws: true,
                pathRewrite: {
                    '^/spiderUrl': ''
                }
            }
        },
        // 此处开启 https
        https: true
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false,
    // 部署优化
    configureWebpack: {
        // 使用CDN
        // externals: {
        //     vue: 'Vue',
        //     'vue-i18n': 'VueI18n',
        //     axios: 'axios',
        //     'vue-router': 'VueRouter',
        //     vuex: 'Vuex',
        //     'view-design': 'iview',
        //     echarts: 'echarts',
        //     apexcharts: 'ApexCharts',
        //     'vue-apexcharts': 'VueApexCharts',
        //     dplayer: 'DPlayer',
        //     'print-js': 'printJS',
        //     html2canvas: 'html2canvas',
        //     'vue-json-pretty': 'VueJsonPretty',
        //     'vue-lazyload': 'VueLazyload',
        //     'js-cookie': 'Cookies',
        //     vuedraggable: 'vuedraggable',
        //     viewerjs: 'Viewer'
        // },
        // GZIP压缩
        plugins: [
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件
                threshold: 10240 // 对超过10k文件压缩
            })
        ]
    }
}
