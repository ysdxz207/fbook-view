import Vue from 'vue'
import VueRouter from 'vue-router'
import Vonic from 'vonic/src/index.js'
import axios from 'axios'


const Index = () => import('./components/Index.vue');
const Login = () => import('./components/Login.vue');
const About = () => import('./components/About.vue');
const Book = () => import('./components/Book.vue');
const Source = () => import('./components/Source.vue');

// Routes

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: Index,
            component: Index,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/login',
            name: Login,
            component:Login
        },
        {
            path: '/about',
            name: About,
            component: About
        },
        {
            path: '/book',
            name: Book,
            component: Book,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/source',
            name: Source,
            component: Source,
            meta: {
                requireAuth: true
            }
        }
    ]
});

// axios
const ajax = axios.create({
    baseURL: 'http://localhost:8010',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

Vue.prototype.ajax = ajax;


// http request 拦截器
ajax.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
ajax.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });


router.beforeEach((to, from, next) => {
        console.log('=================')
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限

        if (localStorage.getItem('username')) {// 判断是否登录
            next()
        } else {// 没登录则跳转到登录界面
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next()
    }
});




Vue.use(Vonic.app, {
    router,
    defaultRouteUrl: '/'
});