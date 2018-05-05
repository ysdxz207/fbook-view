

const Index = () => import('./components/Index.vue');
const Login = () => import('./components/Login.vue');
const Register = () => import('./components/Register.vue');
const User = () => import('./components/User.vue');
const Search = () => import('./components/Search.vue');
const Book = () => import('./components/Book.vue');
const Read = () => import('./components/Read.vue');
const Source = () => import('./components/Source.vue');
const MenuChapterList = () => import('./components/menus/MenuChapterList.vue');
const About = () => import('./components/About.vue');
const Test = () => import('./components/test/Test.vue');

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
            path: '/chapters',
            name: MenuChapterList,
            component: MenuChapterList,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/about',
            name: About,
            component: About
        },
        {
            path: '/test',
            name: Test,
            component: Test
        }
    ];


Vue.use(Vonic.app, {
    routes: routes
});


const env = process.env.NODE_ENV;

const baseURL = env == 'production' ? 'http://api.book.puyixiaowo.win' : 'http://api.book.puyixiaowo.win';



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

/**
 *
 * @param params
 *      {
 *          bookId: '',
 *          lastChapterNum: 1000,
 *          direction: '',//可选
 *          chapterNum: 3,//可选
 *          lastReadingChapterNum: 1//可选
 *      }
 * @param callback
 */
Vue.prototype.getChapterInfo = function (args, callback) {
    console.log('加载中>..')
    $loading.show('加载中...');
    let _this = this;
    args = Vue.util.extend({lastReadingChapterNum: 1}, args);

    if (args.lastReadingChapterNum == 1
        && args.direction == -1) {
        $toast.show('已经是第一章了');
        return;
    }

    if (args.lastReadingChapterNum
        == args.lastChapterNum
        && args.direction == 1) {
        $toast.show('已经是最后一章了');
        return;
    }


    let params = {};
    if (args.direction
        && args.direction != 0) {
        params.chapter = args.lastReadingChapterNum + args.direction;
    } else if (args.direction == undefined) {
        params.chapter = args.chapterNum;
    }

    params.bookId = args.bookId;

    _this.ajax({
        method: 'post',
        url: '/chapter',
        data: params

    }).then(function (response) {
        $loading.hide();
        switch (response.data.statusCode) {
            case 200:
                let data = response.data.data;
                callback(data);
                break;
            case 300:

            default:
                $dialog.alert({
                    content: '错误:' + response.data.message,
                    okTheme: 'energized'
                })
        }

    }).catch(function (error) {
        $loading.hide();

        $dialog.alert({
            content: '服务器异常:' + JSON.stringify(error),
            okTheme: 'calm'
        })
    });
};

//创建一个事件中转站，便于组件之间传递数据
Vue.prototype.bus = new Vue();
