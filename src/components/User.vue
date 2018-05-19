<template>
    <div class="page has-navbar" v-nav="{ title: '用户信息', showBackButton: true }">
        <div class="page-content text-center">
            <div @click="showEditUser()" class="user-nickname-group">
                <span v-text="user.nickname" class="padding"></span>
                <i class="icon ion-compose"></i>
            </div>

            <div class="user-setting-group">
                <von-toggle :text="useApiText" v-model="bookReadSetting.useApi"></von-toggle>
            </div>
            <item class="item-icon-right" @click.native="cleanStorage()">
                清理缓存
                <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
            </item>

            <md-button @click.native="logout()" class="button button-assertive button-block btn-logout">退出登录</md-button>
        </div>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                user: {
                    nickname: ''
                },
                bookReadSetting: {},
                useApiText: '是否使用接口源'
            }
        },
        mounted() {
            this.loadUserAndSetting();
        },
        methods: {
            loadUserAndSetting() {
                let _this = this;
                _this.ajax.post('/getUserSetting', {})
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                _this.bookReadSetting = response.data.data.bookReadSetting;
                                _this.user = response.data.data.user;
                                //首次加载不触发保存是否使用接口
                                _this.$watch('bookReadSetting.useApi', {
                                    deep: true,
                                    handler: function () {
                                        _this.saveReadSetting(_this.bookReadSetting);
                                    }
                                })
                                break;
                            case 300:
                            default:
                                $dialog.alert({
                                    content: '加载用户信息错误:' + response.data.message,
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
            logout() {
                let _this = this;

                $dialog.confirm({
                    theme: 'ios',
                    title: '提示',
                    content: '确定退出当前帐号吗?',
                    okText: '退出'
                }).then((res) => {
                    if (!res) {
                        return;
                    }
                    _this.ajax.post('/logout', {})
                        .then(function (response) {
                            switch (response.data.statusCode) {
                                case 200:
                                    $storage.remove('isLogin')
                                    $router.forward({path: '/login'})
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
                })

            },
            showEditUser() {
                let _this = this;
                let options = {
                    effect: 'scale',
                    title: '',
                    buttons: [
                        {text: '确定'},
                        {text: '取消'}
                    ],
                    showClose: true
                }
                let template = `
                <div>修改昵称</div><input type="text" class="input-edit-username"/>
                `
                let popup = $popup.fromTemplate(template, options)
                popup.show().then((buttonIndex) => {
                    if (buttonIndex == 0) {
                        //保存
                        let nickname = document.querySelector('.input-edit-username').value;


                        if (!nickname) {
                            return;
                        }
                        _this.user.nickname = nickname;

                        _this.ajax({
                            method: 'post',
                            url: '/editUserInfo',
                            data: _this.user

                        }).then(function (response) {
                            switch (response.data.statusCode) {
                                case 200:
                                    localStorage.setItem('fbook_nickname', nickname);
                                    break;
                                case 300:

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
                })
            },
            cleanStorage() {
                $dialog.confirm({
                    theme: 'ios',
                    title: '确定清理缓存吗?',
                    cancelText: '取消',
                    okText: '确定'
                }).then((res) => {
                    if (res) {
                        $storage.clear();
                        $storage.set('isLogin', true)
                    }
                })

            }
        }
    }
</script>
<style lang="scss">

    .button.btn-logout {
        width: 100%;
        position: fixed;
        bottom: 0px;
        left: 0px;
    }
    .user-nickname-group {
        margin-top: 20px;
    }
    .user-setting-group {
        margin-top: 20px;
    }
    input[type=text].input-edit-username {
        border: 1px solid #e2e2e2;
        height: 24px;
        margin-top: 20px;
    }
</style>
