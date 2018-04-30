<template>
  <div class="page has-navbar" v-nav="{ title: 'About', showBackButton: true }">
    <div class="page-content"  id="content">
        <list v-for="n in 200">
            <item v-text="n"></item>
        </list>
      <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>
    </div>
  </div>
</template>
<script>
    import Scrollbar from './utils/Scrollbar.vue'
    export default{
        data(){
            return {
                scrollbarConfig: {
                    contentObj: undefined,
                    head: 0
                }
            }
        },
        components: {
            'scrollbar': Scrollbar
        },
        mounted() {
            this.scrollbarConfig.contentObj = document.querySelector('#content')
            this.scrollbarConfig.head = document.querySelector('.navbar').clientHeight
        },
        destroyed() {

        },
        methods: {

        }
    }
</script>

<style lang="scss">

</style>