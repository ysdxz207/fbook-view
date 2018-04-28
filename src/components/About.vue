<template>
  <section>
    <v-menu v-show="showMenu" :menu-option="menuOption" ref="menu"></v-menu>

    <button @click="show()">显示</button>
  </section>
</template>

<script>

    import menu from './menus/Menu.vue';
    export default {
        components: {
            'v-menu': menu
        },
        mounted() {

        },
        data() {
            return {
                showMenu: false,
                menuOption: {
                    title: '哈哈',
                    text: '爱爱爱',
                    cancelButtonText: 'no',
                    confirmButtonText: 'yes'
                }
            }
        },
        methods: {
            show() {
                this.showMenu = true;
            }
        }
    }
</script>
<style lang="scss">

</style>