<template>
    <div class="page">
        <div class="page-content" id="content">
            <h1 v-text="msg"></h1>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            msg: '旧值'
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        destroyed() {
        },
        updated() {
            console.log(this.$el.innerHTML)
        },
        methods: {
        }
    }
</script>

<style lang="scss">

</style>