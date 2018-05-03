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
/*
    @mixin view-right() {
        @include my-translate3d(100%, 0, 0);
    }

    @mixin view-left() {
        @include my-translate3d(-33%, 0, 0);
    }

    @mixin view-center() {
        @include my-translate3d(0, 0, 0);
    }

    @mixin my-translate3d($x, $y, $z) {
        @include my-transform( translate3d($x, $y, $z) );
    }

    @mixin my-transform($val) {
        -webkit-transform: $val;
        transform: $val;
    }

    @mixin transition-duration($transition-duration) {
        -webkit-transition-duration: $transition-duration;
        transition-duration: $transition-duration;
    }

    @mixin transition-timing-function($transition-timing) {
        -webkit-transition-timing-function: $transition-timing;
        transition-timing-function: $transition-timing;
    }

    @mixin transition-property($property) {
        -webkit-transition-property: $property;
        transition-property: $property;
    }
    $ios-transition-duration:              500ms !default;
    $ios-transition-timing-function:       cubic-bezier(.36, .66, .04, 1) !default;

    .slide-left-enter-active,
    .slide-left-leave-active {
        @include transition-duration($ios-transition-duration);
        @include transition-timing-function($ios-transition-timing-function);
        -webkit-transition-property: opacity, -webkit-transform;
        transition-property: opacity, transform;
    }
*/


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