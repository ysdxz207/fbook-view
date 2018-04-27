<template>
  <transition name='fade'>
    <div class="menu-f" v-if="show">
      <div class="">
        <slot>
        {{title}}
        </slot>
      </div>
      <div class="">

      </div>
      <div class="">

      </div>
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
            }
        },
        data() {
            return {
                show: false
            }
        },
        methods: {
            show() {
              this.show = true;
            }
        }
    }
</script>

<style scoped lang='scss'>
.menu-f {
  border: 1px solid red;
}
</style>