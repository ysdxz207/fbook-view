<template>
    <div class="page has-navbar" v-nav="{
        title: '书籍详情',
        showBackButton: true,
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-gear-b\'></i>',
        onMenuButtonClick: function() {
            $router.forward({path:'/source'})
        }
        }">
        <div class="page-content text-center">
            <div class="padding">
                <h1 v-text="bookId"></h1>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                bookId: $router.params.bookId
            }
        },
        methods: {

        }
    }
</script>
<style lang="scss">

</style>
