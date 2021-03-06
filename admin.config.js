module.exports = {
    entry: './reactadmin/index.js',
    output: {
        path: __dirname + '/static/admin/',
        filename: 'admin.js',
        publicPath: '/static/admin/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'es2015', 'stage-0'],
                            plugins: ['add-module-exports']
                        }
                    }
                ]
            },
            {
                test: /\.s[c|a]ss$/,
                enforce: 'pre',
                loader: 'import-glob-loader'
            }
        ]
    },
    target: 'web'
};
