

const Index = () => import('./components/Index.vue');
const Login = () => import('./components/Login.vue');
const Register = () => import('./components/Register.vue');
const User = () => import('./components/User.vue');
const Search = () => import('./components/Search.vue');
const Book = () => import('./components/Book.vue');
const Read = () => import('./components/Read.vue');
const Source = () => import('./components/Source.vue');
const About = () => import('./components/About.vue');

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
            path: '/user',
            name: User,
            component:User,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/search',
            name: Search,
            component:Search,
            meta: {
                requireAuth: true
            }
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
            path: '/read',
            name: Read,
            component: Read,
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
        },
        {
            path: '/about',
            name: About,
            component: About
        }
    ];


Vue.use(Vonic.app, {
    routes: routes
});


const env = process.env.NODE_ENV;

const baseURL = env == 'production' ? 'http://api.book.puyixiaowo.win' : 'http://localhost:8010';



// axios
const ajax = axios.create({
    baseURL: baseURL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        'Accept': 'application/json'
    },
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

        if (localStorage.getItem('fbook_username')) {// 判断是否登录
            next()
        } else {
            console.log('未登录')
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
            localStorage.removeItem('fbook_username');
            $router.forward({
                path: '/login',
                query: {redirect: $router.currentRoute.fullPath}
            })
        }
        return response;
    },
    error => {
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



