<template>
    <transition name="fade">
        <div class="menu-f" >
            <div class="menu-header">header</div>
            <div class="menu-footer">footer</div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'menu',
        props: {
            title: {
                type: String,
                default: '提示',
            },
            message: {
                type: String,
            },
            props: {
                menuOption: Object
            }
        },
        data() {
            return {
                isShowMenu: true
            }
        },
        methods: {
            show() {
                this.isShowMenu = true;
            },
            hide() {
                console.log('hide')
                this.isShowMenu = false;
            }
        }
    }
</script>

<style scoped lang='scss'>
    .menu-f {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }
    .menu-header {
        width: 100%;
        height: 48px;
        background-color: #101010;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 1;
    }
    .menu-footer {
        width: 100%;
        height: 56px;
        background-color: #101010;
        position: fixed;
        bottom: 40px;
        left: 0px;
        z-index: 1;
    }

    .menu-content {
        width: 100%;
        height: 100%;
        z-index: 0;
        background-color: #444;
    }




    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>