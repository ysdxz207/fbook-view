<template>
    <div class="page">
        <div class="page-content" id="content">
            <h1 v-text="msg"></h1>
            <button @click="showToast()" class="btn-show-toast">吸纳时</button>
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
            let _this = this;
            this.$nextTick().then(() => {
                document.querySelector(".btn-show-toast").addEventListener('click', function () {
                    _this.showToast()
                })
            })
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