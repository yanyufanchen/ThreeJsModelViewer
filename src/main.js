import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
// import { Collapse, message } from 'ant-design-vue';
import Antd from 'ant-design-vue';
/* v1.1.3+ 自动注册Button下组件，如Button.Group */
Vue.use(Antd);
// Vue.prototype.$message = message;

import router from './router';
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')