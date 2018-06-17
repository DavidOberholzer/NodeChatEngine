const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader', 'import-glob-loader'],
                include: path.resolve(__dirname, '../')
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss', '.sass', '.json'],
        modules: ['node_modules', path.resolve(__dirname, '../')]
    }
};