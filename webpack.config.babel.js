import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
];

const filename = `redux-thunk${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
    mode: NODE_ENV,
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
            },
        ],
    },

    optimization: {
        minimize: true,
    },

    entry: ['./src/index'],

    output: {
        path: path.join(__dirname, 'dist'),
        filename,
        library: 'ReduxList',
        libraryTarget: 'umd',
    },

    plugins,
};
