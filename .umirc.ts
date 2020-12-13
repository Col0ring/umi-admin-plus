import { defineConfig } from 'umi';
import routes from './src/router';
import variables from './theme/variables';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  theme: {
    ...variables,
  },
  title: false,
  routes,
  // 跨域处理，mock 数据时暂时不需要
  // proxy: {
  //   '/api': {
  //     target: 'http://localhost:8000',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': '/',
  //     },
  //   },
  // },
});
