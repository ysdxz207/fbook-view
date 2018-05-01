<template>
  <div class="page has-navbar" v-nav="{ title: 'Test', showBackButton: true }">
    <div class="page-content"  id="content">
        <button @click="showModal()">显示</button>
        <modal :modalOptions="modalOptions" ref="modal"></modal>
    </div>
  </div>
</template>
<script>
    import Modal from './utils/Modal.vue'
    export default{
        data(){
            return {
                modalOptions: {
                    title: '目录',
                    leftIcon: 'ion-ios-arrow-back',
                    rightIcon: 'ion-ios-arrow-down',
                    rightBtnCallback: function() {
                        this.toggleChapterListSort()
                    }
                }
            }
        },
        components: {
            'modal': Modal
        },
        mounted() {
        },
        destroyed() {

        },
        methods: {

            showModal() {
                this.$refs.modal.$emit('show');
            },
            toggleChapterListSort() {
                console.log('my')
            }
        }
    }
</script>

<style lang="scss">

</style>