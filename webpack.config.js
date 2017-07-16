module.exports = {
    devtool: 'source-map',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.glsl$/,
                use: 'raw-loader'
            },
            {
                test: /\.png$/,
                use: 'binary-loader'
            }
        ]
        },
        resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: './dist/bundle.js',
        path: __dirname
    }
};