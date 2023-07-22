const { composePlugins, withNx, withWeb } = require('@nx/webpack');
const { merge } = require('webpack-merge');
const path = require("path");

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withWeb(), (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
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
});
