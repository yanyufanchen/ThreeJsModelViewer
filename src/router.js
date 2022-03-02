import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Home from './views/home/home.vue';
const routes = [
    {
        path: '/',
        // component: Home,
        // hidden: true,
        redirect: '/home',
    }, {
        path: '/home',
        component: Home,
        name: 'Home',
        children: []
    }
]
const router = new VueRouter({
    mode: 'hash',
    //   base: process.env.BASE_URL,
    routes,
});

export default router;