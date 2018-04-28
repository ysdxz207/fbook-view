<template>
    <div class="menu-f">
      <div>哈哈哈</div>
    </div>
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
            }
        }
    }
</script>

<style scoped lang='scss'>
.menu-f {
  border: 1px solid red;
  width: 400px;
  height: 400px;
}
</style>