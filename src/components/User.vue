<template>
  <div class="page has-navbar" v-nav="{ title: '用户信息', showBackButton: true }">
    <div class="page-content text-center padding">
      <div v-text="user.nickname" class="padding"></div>
        <md-button @click.native="logout()" class="button button-assertive button-block btn-logout">退出登录</md-button>
    </div>
  </div>
</template>
<script>
    export default {

        data() {
            return {
                user: {
                    nickname: localStorage.getItem('fbook_nickname') == '大帅比' ? localStorage.getItem('fbook_username') : localStorage.getItem('fbook_nickname')
                }
            }
        },
        methods: {
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
                                    localStorage.removeItem('fbook_username')
                                    $router.forward({path: '/login'})
                                    break;
                                case 300:
                                    _this.user.captcha = '';
                                    if ("LOGIN_WRONG_CAPTCHA" == response.data.errorCode) {
                                        //刷新验证码
                                        _this.refreshCaptcha();
                                    }
                                default:
                                    $toast.show(response.data.message)
                            }
                        }).catch(function (error) {
                        $dialog.alert({
                            content: '服务器异常:' + JSON.stringify(error),
                            okTheme: 'calm'
                        })
                    });
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
</style>
