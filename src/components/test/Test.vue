<template>
    <div class="page has-navbar" v-nav="{
   title: 'Test',
    showBackButton: true,
    showMenuButton: true,
  onMenuButtonClick: toggleSidebar

     }">
        <div class="page-content" id="content">
            <v-test-sidebar v-show="false" :msg="msg" ref="testsidebar"></v-test-sidebar>

            <div v-text="msg" ></div>
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
            this.getMsg();
            let _this = this;
            this.$nextTick().then(() => {
                document.querySelector(".btn-show-toast").addEventListener('click', function () {
                    $toast.show('haha');
                })
            })
        },
        destroyed() {
            $sidebar.destroy()
        },
        updated() {

            this.refreshSidebar()
        },
        methods: {

            toggleSidebar() {
                this.sidebar && this.sidebar.toggle()
            },
            getMsg() {
                let _this = this;
                setTimeout(function () {
                    console.log('两秒后的值')
                    _this.msg = '2秒后的值'
                }, 2000)
            },
            refreshSidebar() {
                console.log(this.$refs.testsidebar)
                let str = this.$refs.testsidebar.$el.innerHTML
                this.sidebar = $sidebar.fromTemplate (str, {position: 'left'})

            }
        }
    }
</script>

<style lang="scss">

</style>