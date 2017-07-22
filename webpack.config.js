const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const merge = require("webpack-merge");
const etp = require("extract-text-webpack-plugin");

const common = {
    context: path.resolve(__dirname, "src"),

    entry: "./index",

    output: {
        filename: "js/app.js",
        path: path.resolve(__dirname, "public")
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new etp("css/style.css")
    ],

    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["react", "es2015"]
                    }
                }]
            },
            {
                test: /\.(css|pcss)$/,
                use: etp.extract(
                    {
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    modules: true,
                                    importLoaders: 1,
                                    localIdentName: "[local]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [autoprefixer({browsers: ["last 2 versions"]}), precss]
                                }
                            }
                        ]
                    })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: {
                    name: "img/[name].[ext]"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader"
                ]
            }
        ]

    },
    resolve: {
        modules: [
            "node_modules",
            "src/components/"
        ]
    }
};

const development = {

    devServer: {
        stats: "errors-only",
        historyApiFallback: true,
        contentBase: "public/",
        port: 9000,
        hot: true
    },

    devtool: "source-map"

};

module.exports = (env) => {
    if (env === "production") {
        return common;
    }
    if (env === "development") {
        return merge([
            common,
            development
        ]);
    }
};
