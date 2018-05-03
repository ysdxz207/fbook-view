<template>
    <div class="page has-navbar" v-nav="{
        title: 'Test',
        showBackButton: true,
        showMenuButton: true,
        onMenuButtonClick: toggleSidebar

     }">
        <div class="page-content" id="content">
            <v-sidebar :options="sidebarOptions" :chapterList="chapterList" ref="sidebar"></v-sidebar>
        </div>
    </div>
</template>
<script>
    import Sidebar from './Sidebar.vue'

    export default {
        data() {
            return {
                sidebarOptions: {
                    isShowSidebar: false,
                    side: 'right'
                },
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
                this.sidebarOptions.isShowSidebar = !this.sidebarOptions.isShowSidebar;
            }
        }
    }
</script>

<style lang="scss">

</style>