import Vue from 'vue'
import Vonic from 'vonic/src/index.js'
import axios from 'axios'

// Page Components
import Index from './components/Index.vue'
import About from './components/About.vue'
import Book from './components/Book.vue'
import Book from './components/Login.vue'

// Routes
const routes = [
    {path: '/', component: Index},
    {path: '/about', component: About},
    {path: '/book', component: Book},
    {path: '/login', component: Login}
]

// axios
const ax = axios.create({
    baseURL: 'http://dev-gateway.lamic.cn',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

Vue.prototype.ax = ax;

Vue.use(Vonic.app, {
    routes: routes
})
