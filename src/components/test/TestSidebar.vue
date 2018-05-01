<template>
    <div class="page">
        <div class="page-content" id="content">
            <h1 v-text="msg"></h1>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: '旧值'
            }
        },
        mounted() {
            this.getMsg()
        },
        destroyed() {
        },
        methods: {
            getMsg() {
                let _this = this;
                setTimeout(function () {
                    _this.msg = '新值';
                    console.log('新值')
                }, 3000)
            }
        }
    }
</script>

<style lang="scss">

</style>