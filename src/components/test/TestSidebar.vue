<template>
    <div class="page">
        <div class="page-content" id="content">
            <h1 v-text="msg"></h1>
            <button @click="showToast()">吸纳时</button>
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
            showToast() {
                $toast.show('heihei')
            }
        }
    }
</script>

<style lang="scss">

</style>