<template>
    <div class="page has-navbar" v-nav="{
   title: 'Test',
    showBackButton: true,
    showMenuButton: true,
  onMenuButtonClick: toggleSidebar

     }">
        <div class="page-content" id="content">
            <v-test-sidebar v-show="false" ref="testsidebar"></v-test-sidebar>

            <div v-text="msg"></div>
        </div>
    </div>
</template>
<script>
    import TestSidebar from './TestSidebar.vue'
    export default {
        data() {
            return {
                sidebar: undefined,
                msg: '默认值'
            }
        },
        components: {
            'v-test-sidebar': TestSidebar
        },
        mounted() {
            let str = this.$refs.testsidebar.$el.innerHTML
            this.sidebar = $sidebar.fromTemplate (str, {position: 'left'})

            this.getMsg()
        },
        destroyed() {
            $sidebar.destroy()
        },
        methods: {

            toggleSidebar() {
                this.sidebar.toggle()
            },
            getMsg() {
                let _this = this;
                setTimeout(function () {
                    console.log('两秒后的值')
                    _this.msg = '两秒后的值';
                }, 2000)
            }
        }
    }
</script>

<style lang="scss">

</style>