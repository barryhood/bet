const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

const CopyWebpackPlugin = require('copy-webpack-plugin');

// const config.plugins = config.plugins.concat([
//     new CopyWebpackPlugin([
//       { from: 'client/assets', to: 'assets' }
// ]),

const config = {

  }

module.exports = {
    context: ROOT,

    entry: {
        'main': './main.ts'
    },
    
    output: {
        filename: '[name].bundle.js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js', '.css'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'tslint-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: 'awesome-typescript-loader'
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
          { from: ROOT + '/styles', to: DESTINATION + '/styles' },
          { from: ROOT + '/data', to: DESTINATION + '/data' },
          { from: ROOT + '/*.html', to: DESTINATION }
         ])
    ],

    devtool: 'cheap-module-source-map',
    devServer: {}
};

