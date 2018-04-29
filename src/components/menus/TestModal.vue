<template>
  <div class="page has-navbar" v-nav="{ title: 'About', showBackButton: true }">
    <div class="page-content">
      <div v-text="showMore"></div>
    </div>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                showMore: false
            }
        },
        methods: {
        }
    }
</script>

<style lang="scss">
</style>