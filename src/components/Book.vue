<template>
    <div class="page has-navbar" v-nav="{
        title: 'Home',
        showBackButton: true,
        onBackButtonClick: test,
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-navicon\'></i>',
        onMenuButtonClick: test2}">
        <div class="page-content text-center">
            <div class="padding">
            </div>
        </div>
    </div>
</template>
<script>
    export default {

    }
</script>
<style lang="scss">

</style>
