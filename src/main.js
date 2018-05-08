

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
    params.preLoad = args.preLoad;

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

Vue.prototype.scrollTo = function(element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function(){
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
};
//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

//保存配置
Vue.prototype.saveReadSetting = function (bookReadSetting) {
    let _this = this;
    _this.ajax({
        method: 'post',
        url: '/saveReadingSetting',
        data: bookReadSetting

    }).then(function (response) {
        switch (response.data.statusCode) {
            case 200:

                break;
            case 300:

            default:
                $toast.show('保存读书配置错误:' + response.data.message);
        }

    }).catch(function (error) {
        $toast.show('保存读书配置错误(服务器):' + JSON.stringify(error));
    });
};


//十六进制颜色值的正则表达式
var reg
    = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex
    = function(){
    var that
        = this;
    if(/^(rgb|RGB)/.test(that)){
        var aColor
            = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        var strHex
            = "#";
        for(var i=0;
            i<aColor.length; i++){
            var hex
                = Number(aColor[i]).toString(16);
            if(hex
                === "0"){
                hex
                    += hex;
            }
            strHex
                += hex;
        }
        if(strHex.length
            !== 7){
            strHex
                = that;
        }
        return strHex;
    }else if(reg.test(that)){
        var aNum
            = that.replace(/#/,"").split("");
        if(aNum.length
            === 6){
            return that;
        }else if(aNum.length
            === 3){
            var numHex
                = "#";
            for(var i=0;
                i<aNum.length; i+=1){
                numHex
                    += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;
    }
};

//创建一个事件中转站，便于组件之间传递数据
Vue.prototype.bus = new Vue();
