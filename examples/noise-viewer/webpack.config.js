const { merge } = require('webpack-merge');
const path = require("path");

module.exports = (config, context) => {
    return merge(config, {
        entry: {
            worker: path.resolve(__dirname, 'src/worker.ts')
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            scriptType: 'text/javascript'
        },
        devtool: 'source-map',
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                { test: /\.ts?$/, loader: "ts-loader" }
            ]
        }
    });
};
