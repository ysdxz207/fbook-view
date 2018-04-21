import Vue from 'vue'
import Vonic from 'vonic/src/index.js'
import axios from 'axios'


const Index = () => import('./components/Index.vue');
const Login = () => import('./components/Login.vue');
const Register = () => import('./components/Register.vue');
const About = () => import('./components/About.vue');
const Book = () => import('./components/Book.vue');
const Source = () => import('./components/Source.vue');

// Routes

const routes = [
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
            path: '/register',
            name: Register,
            component:Register
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
    ];

Vue.use(Vonic.app, {
    routes: routes
});

// axios
const ajax = axios.create({
    baseURL: 'http://192.168.3.2:8010',
    timeout: 20000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    params: {},
    transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
    withCredentials: true//解决跨域session不一致问题
});

Vue.prototype.ajax = ajax;


$router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限

        if (localStorage.getItem('username')) {// 判断是否登录
            next()
        } else {
            // 没登录则跳转到登录界面
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next()
    }
});

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
        if (response.data.statusCode == 401) {
            $router.forward({
                path: '/login',
                query: {redirect: $router.currentRoute.fullPath}
            })
        }
        return response;
    },
    error => {
        console.log(error.response)
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    $router.forward({
                        path: '/login',
                        query: {redirect: $router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response)
    });



