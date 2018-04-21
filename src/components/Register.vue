<template>
    <div class="page" v-nav="{title: '注册'}">
        <div class="page-content padding-top">
            <von-input type="text" v-model="loginname" placeholder="用户名" label="用户名"></von-input>
            <von-input type="password" v-model="password" placeholder="密码" label="密码"></von-input>
            <von-input type="password" v-model="repassword" placeholder="重复密码" label="重复密码" style="margin-bottom: 5px;"></von-input>

            <div class="padding">
                <button class="button button-calm button-block" @click="login()">注册</button>
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
                loginname: '',
                password: '',
                repassword: ''
            }
        },
        methods: {
            login() {
                alert('的呢公路')
            }
        }
    }
</script>
<style lang="scss">

</style>
