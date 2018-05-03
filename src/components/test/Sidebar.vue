<template>
    <transition name="slide-left">
        <div v-show="isShowSidebar" class="sidebar">
            <div class="sidebar-header">
                世人都说神仙好，唯有功名忘不了
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        props: {
            isShowSidebar: false,
            chapterList: Array
        },
        data() {
            return {
            }
        },
        mounted() {
            let _this = this;
        },
        destroyed() {
        },
        updated() {

        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/transition";



    .sidebar {
        width: 60%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: #f5f5f5;
        z-index: 99;
        box-shadow: 0 0 12px rgba(0,0,0,.35);
    }
    .sidebar-header {
        width: 100%;
        height: 44px;
        background-color: #F9F9F9;
        box-shadow: 0 0 15px rgba(0,0,0,.15);
    }
</style>