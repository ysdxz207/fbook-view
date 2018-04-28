<template>
  <section @click="toggleMenu()">
    <v-menu v-show="menus.menuMain" :menu-option="menuOption" ref="menu"></v-menu>

  </section>
</template>

<script>

    import menu from './menus/Menu.vue';
    export default {
        components: {
            'v-menu': menu
        },
        mounted() {
            this.toggleMenu()
        },
        data() {
            return {
                menus: {
                    menuMain: false
                }
            }
        },
        methods: {
            toggleMenu() {
                console.log('toggle menu');
                this.menus.menuMain = !this.menus.menuMain;
            }
        }
    }
</script>
<style lang="scss">

</style>