<template>
    <div class="page" v-nav="{title: '登录'}">
        <div class="page-content padding-top">
            <form @submit.prevent="login">
                <title>登录</title>
                <von-input type="text" v-model="user.uname" placeholder="用户名" label="用户名"></von-input>
                <von-input type="password" v-model="user.upass" placeholder="密码" label="密码" style="margin-bottom: 5px;"></von-input>
                <von-input type="text" v-model="user.captcha" placeholder="验证码" label="验证码"></von-input>

                <div class="padding">
                    <button class="button button-calm button-block" type="submit">登录</button>
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
                }
            }
        },
        methods: {
            login() {
                this.ajax.post('/login', this.user)
                    .then(function (response) {
                        if (response.data.statusCode == 200) {
                            $router.back(-1)
                        } else {
                            $toast.show(response.data.message)
                        }
                    }).catch(function (error) {
                    $dialog.alert({
                        content: '服务器异常:' + error,
                        okTheme: 'calm'
                    })
                });
            }
        }
    }
</script>
<style lang="scss">

</style>
