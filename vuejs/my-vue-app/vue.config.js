module.exports = {
  devServer: {
    port: 8080, // 프론트엔드 포트
    proxy: {
      '/auth': {
        target: 'http://localhost:3000', // 백엔드 주소
        changeOrigin: true
      }
    }
  }
};
