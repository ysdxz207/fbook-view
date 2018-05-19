<template>
    <div class="page" v-nav="{title: '登录'}">
        <div class="page-content padding-top">
            <form>
                <title>登录</title>
                <von-input type="text" v-model="user.uname" placeholder="用户名" label="用户名"></von-input>
                <von-input type="password" v-model="user.upass" placeholder="密码" label="密码" style="margin-bottom: 5px;"></von-input>
                <div class="row">
                    <von-input type="text"
                               v-model="user.captcha"
                               placeholder="验证码"
                               label="验证码"
                               class="col col-60"></von-input>

                    <img :src="captchaImg" class="col col-30" @click="refreshCaptcha()">
                </div>

                <div class="padding">
                    <md-button class="button button-calm button-block" @click.native="login()">登录</md-button>
                </div>
                <label class="padding-left pull-right">没有帐号?</label>
                <router-link to="/register">
                    去注册
                </router-link>
            </form>

        </div>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                user: {
                    uname: '',
                    upass: '',
                    captcha: ''
                },
                captchaImg: this.ajax.defaults.baseURL + '/captcha.jpg'
            }
        },
        methods: {
            login() {
                let _this = this;
                _this.ajax.post('/login', this.user)
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                localStorage.setItem('isLogin', true)
                                $router.forward({path: '/'})
                                break;
                            case 300:
                                _this.user.captcha = '';
                                if ("LOGIN_WRONG_CAPTCHA" == response.data.errorCode) {
                                    //刷新验证码
                                    _this.refreshCaptcha();
                                }
                            default:
                                $dialog.alert({
                                    content: '错误:' + response.data.message,
                                    okTheme: 'energized'
                                })
                        }
                    }).catch(function (error) {
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error),
                        okTheme: 'calm'
                    })
                });
            },
            refreshCaptcha() {
                this.captchaImg = this.ajax.defaults.baseURL + '/captcha.jpg?' + new Date().getTime();
            }
        }
    }
</script>
<style lang="scss">

</style>
