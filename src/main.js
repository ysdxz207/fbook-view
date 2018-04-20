import Vue from 'vue'
import Vonic from 'vonic/src/index.js'
import axios from 'axios'


const Index = () => import('./components/Index.vue');
const Login = () => import('./components/Login.vue');
const About = () => import('./components/About.vue');
const Book = () => import('./components/Book.vue');
const Source = () => import('./components/Source.vue');

// Routes
const routes = [
    {
        path: '/',
        name: Index,
        component: Index
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
        component: Book
    },
    {
        path: '/source',
        name: Source,
        component: Source
    }
]

// axios
const ajax = axios.create({
    baseURL: '/',
    timeout: 1000,
    headers: {}
});

Vue.prototype.ajax = ajax;


Vue.use(Vonic.app, {
    routes: routes
});
