<template>
  <div class="page has-navbar" v-nav="{ title: 'About', showBackButton: true }">
    <div class="page-content">
      <button @click="showModal()">显示</button>
    </div>
  </div>
</template>
<script>
  import TestModal from './menus/TestModal.vue'
    export default{
        data(){
            return {
                modal: undefined
            }
        },
        mounted() {
            $modal.fromComponent(TestModal, {
                title: '模态窗标题',
                theme: 'default'
            }).then((modal) => {
                this.modal = modal
            })
        },
        destroyed() {
            if (this.modal)
                $modal.destroy(this.modal)
        },
        methods: {
            showModal() {
                this.modal.show()
            }
        }
    }
</script>

<style lang="scss">
</style>