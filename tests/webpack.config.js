const path = require('path');

module.exports = {
    // devtool: "source-map",
    entry: {
        tests : 'main.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
    },
    devServer: {
        contentBase: path.join(__dirname, "./dist"),
        compress: true,
        port: 9000,
    },
    module : {
        rules : [{
            // test: require.resolve("autoComplete/jquery.auto-complete.js"),
            // test: path.resolve(__dirname, 'packages/autoComplete/jquery.auto-complete.js'),
            test: /jquery.auto-complete.js$/,
            use: "imports-loader?jQuery=jquery"
        }, {
            test: /foundation.js$/,
            use: "imports-loader?jQuery=jquery"
        }, {
            test: /select2.full.js$/,
            use: "imports-loader?jQuery=jquery"
        }, {
            test: /\.(html)$/,
            use: {
                loader: 'html-loader',
                options: {
                    attrs: [':data-src']
                }
            }
        }, {
            test: /\.(css)$/,
            use: [
                'style-loader',
                'css-loader'
            ],
        }, {
            test: /(\.png|\.gif)$/,
            // exclude: /node_modules/,
            loader: 'file-loader?name=images/[name].[ext]'
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
            }]
        }]
    },
    resolve : {
        // zdefiniowanie sciezek z ktory maja byc pobierane pliki
        modules: [
            './',
            './src',
            '../src',
            '../../../node_modules',
        ],
        // aliasy
        alias : {
            Topi : path.resolve(__dirname, '../src'),
        }
    }
};
