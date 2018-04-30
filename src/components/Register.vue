<template>
    <div class="page" v-nav="{title: '注册'}">
        <div class="page-content padding-top">
            <von-input type="text" v-model="user.loginname" placeholder="用户名" label="用户名"></von-input>
            <von-input type="password" v-model="user.password" placeholder="密码" label="密码"></von-input>
            <von-input type="password" v-model="user.repassword" placeholder="重复密码" label="重复密码" style="margin-bottom: 5px;"></von-input>

            <div class="padding">
                <md-button class="button button-calm button-block" @click.native="register()">注册</md-button>
            </div>
            <label class="padding-left pull-right">已有帐号,</label>
            <router-link to="/login">
                去登录
            </router-link>
        </div>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                user: {
                    loginname: '',
                    password: '',
                    repassword: ''
                }
            }
        },
        methods: {
            register() {
                let _this = this;

                console.log(_this.user.password ,_this.user.repassword)
                //校验密码
                if (_this.user.password != _this.user.repassword) {
                    $toast.show('两次密码不相同');
                    return;
                }
                _this.ajax.post('/register', this.user)
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                localStorage.setItem('fbook_username',
                                    response.data.data.loginname);
                                localStorage.setItem('fbook_nickname',
                                    response.data.data.nickname);
                                $router.forward({path: '/'})
                                break;
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
            }
        }
    }
</script>
<style lang="scss">

</style>
