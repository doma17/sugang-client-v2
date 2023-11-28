// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.html',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://sugang.inu.ac.kr:8885',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: false, // Use only if your server is not using https
        onProxyRes: function (proxyRes, req, res) {
          // Optional: You can modify the response from the target server
          // For example, you can set additional headers
          proxyRes.headers['X-Added-Header'] = 'proxy server';
        }
      }
    }
  }
};
