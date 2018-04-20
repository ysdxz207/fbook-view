<template>
    <div class="page has-navbar" v-nav="{
        title: 'Home',
        showBackButton: true,
        onBackButtonClick: $router.back({path:'/'})>
        <div class="page-content text-center">
            <div class="padding">
                登录
            </div>
        </div>
    </div>
</template>
<script>
    export default {

        method: {
        }
    }
</script>
<style lang="scss">

</style>
