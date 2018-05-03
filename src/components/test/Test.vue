<template>
    <div class="page has-navbar" v-nav="{
   title: 'Test',
    showBackButton: true,
    showMenuButton: true,
  onMenuButtonClick: toggleSidebar

     }">
        <div class="page-content" id="content">
            <v-sidebar :isShowSidebar="isShowSidebar" :chapterList="chapterList" ref="sidebar"></v-sidebar>
        </div>
    </div>
</template>
<script>
    import Sidebar from './Sidebar.vue'

    export default {
        data() {
            return {
                isShowSidebar: false,
                chapterList: []
            }
        },
        components: {
            'v-sidebar': Sidebar
        },
        mounted() {
        },
        updated() {

        },
        methods: {

            toggleSidebar() {
                this.isShowSidebar = !this.isShowSidebar;
            }
        }
    }
</script>

<style lang="scss">

</style>