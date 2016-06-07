const webpack = require('webpack');
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ROOT_PATH = path.resolve(__dirname);

module.exports = {
    devtool: 'source-map',
    entry: [path.resolve(ROOT_PATH, 'app/src/index')],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['babel?presets[]=react']
            //loaders: ['react-hot', 'babel?presets[]=react']
        }, {
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.resolve(ROOT_PATH, 'app/build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(ROOT_PATH, 'app/build'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new HtmlwebpackPlugin({
        title: 'Valencer'
    })]
};

//# sourceMappingURL=webpack.config-compiled.js.map