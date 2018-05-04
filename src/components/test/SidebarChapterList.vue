<template>
    <button @click="showToast()">显示</button>
</template>
<script>
    export default {
        name: 'sidebar-chapter-list',
        data() {
            return {

            }
        },
        mounted() {
        },
        updated() {

        },
        methods: {

            showToast() {
                console.log('click child component')
            }
        }
    }
</script>

<style lang="scss">

</style>