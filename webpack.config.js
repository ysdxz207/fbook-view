var path = require('path')
var webpack = require('webpack')
var SshWebpackPlugin = require('ssh-webpack-plugin');

module.exports = {

    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js',
        chunkFilename: "[id].build.js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)|((eot|woff|ttf|svg)[\?]?.*)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: false
    },
    devtool: '#eval-source-map',
    externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'vonic': 'vonic'

    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new SshWebpackPlugin({
            host: 'puyixiaowo.win',
            port: '22',
            username: 'root',
            privateKey: require('fs').readFileSync('E:/huangfeihong/id_rsa_2048_hupubao'),
            from: 'dist',
            to: '/app/fbook/view2/dist/',//important: If the 'cover' of value is false,All files in this folder will be cleared before starting deployment.
            max_buffer: 5000 * 1024,
            before: ['rm -rf /app/fbook/view2/dist', 'mkdir /app/fbook/view2/dist'],
            // after:'mkdir afterTest'
        })
    ])
}
