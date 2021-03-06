const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

/**
 * Development configuration
 */
const browserConfig = merge(baseConfig, {
    devtool: 'source-map',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'apisearch.js',
        libraryTarget: 'umd',
        library: 'apisearch'
    }
});

const nodeConfig = merge(baseConfig, {
    devtool: 'source-map',
    node: {
        fs: 'empty'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'apisearch.node.js',
        libraryTarget: 'umd',
        library: 'apisearch'
    }
});

module.exports = [browserConfig, nodeConfig];