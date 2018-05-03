<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <transition :name="'slide-' + options.side">
        <div v-show="options.isShowSidebar"
             class="sidebar"
             v-bind:class="options.side"
             v-clickoutside="{handleClose: handleClose,getIsShowSidebar: getIsShowSidebar}">
            <div class="sidebar-header">
                世人都说神仙好，唯有功名忘不了
            </div>
        </div>
    </transition>
</template>
<script>
    const clickoutside = {
        // 初始化指令
        bind(el, binding, vnode) {
            function documentHandler(e) {
                // 这里判断点击的元素是否是本身，是本身，则返回
                if (el.contains(e.target)
                    || binding.value.getIsShowSidebar()) {
                    return false;
                }
                // 判断指令中是否绑定了函数
                if (binding.value && binding.value.handleClose) {
                    // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                    binding.value.handleClose(e);
                }
            }
            // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
            el.__vueClickOutside__ = documentHandler;
            document.addEventListener('click', documentHandler);
        },
        update() {},
        unbind(el, binding) {
            // 解除事件监听
            document.removeEventListener('click', el.__vueClickOutside__);
            delete el.__vueClickOutside__;
        },
    };

    export default {
        props: {
            options: {
                type: Object,
                default: function () {
                    return {
                        isShowSidebar: false,
                        side: 'left'
                    }
                }

            },
            chapterList: Array
        },
        data() {
            return {}
        },
        mounted() {
            let _this = this;
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            handleClose(e) {
                console.log('close')
                this.options.isShowSidebar = false;
            },
            getIsShowSidebar() {
                return this.options.isShowSidebar;
            }
        },
        directives: {clickoutside}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/transition.scss";

    .left {
        left: 0px;
    }

    .right {
        right: 0px;
    }

    .sidebar {
        width: 60%;
        height: 100%;
        position: absolute;
        top: 0px;
        background-color: #f5f5f5;
        z-index: 99;
        box-shadow: 0 0 12px rgba(0, 0, 0, .35);
    }

    .sidebar-header {
        width: 100%;
        height: 44px;
        background-color: #F9F9F9;
        box-shadow: 0 0 15px rgba(0, 0, 0, .15);
    }
</style>