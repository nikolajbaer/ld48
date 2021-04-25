const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
  entry: './app/src/index.jsx', 
  output: { 
    path: path.resolve(__dirname,'dist'), 
    filename: 'static/index_bundle.js?' + process.env.SOURCE_VERSION,
  }, 
  module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
          test: /\.(glsl|vert|frag)$/,
          use: [{
            loader: 'webpack-glsl-loader',
            options: { outputPath: 'static'}
          }]
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif|pdf|fbx|glb|mp3)$/,
            use: [{
                loader: 'file-loader',
                options: {
                  outputPath: 'static'
                }
            }]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Output Management',
      template: 'app/src/index.html',
      inject: true,
    }),
  ],
}
