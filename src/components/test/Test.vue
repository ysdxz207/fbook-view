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
    import SidebarChapterList from './SidebarChapterList.vue'

    export default {
        data() {
            return {
                sidebarOptions: {
                    isShowSidebar: false,
                    side: 'right',
                    sidebarComponent: SidebarChapterList
                }
            }
        },
        components: {
            'v-sidebar': Sidebar,
            'v-sidebar-chapter-component': SidebarChapterList
        },
        mounted() {
            let self = this;
            setTimeout(function () {
                let arr = [];
                for (let i = 0; i < 200; i++) {
                    arr.push('item - ' + i)
                }
                self.bus.$emit('testChapterList', arr)
            }, 500)
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