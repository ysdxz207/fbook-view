<template>
    <div class="scrollbar ion-navicon-round"
         draggable="true"
         @touchmove="onTouchmove($event)"

    >

    </div>
</template>
<script>

    /**
     * contentObj:内容对象
     * head:头部高度
     */
    export default {
        name: 'scrollbar',
        props: {
            scrollbarConfig: Object
        },
        data() {
            return {
            }
        },
        mounted() {

        },
        watch: {
            'scrollbarConfig.contentObj': function (contentObj) {
                this.scrollbarTop = this.scrollbarConfig.head + 'px'
                contentObj.addEventListener('scroll', this.onWheelScroll);
            }
        },
        destroyed() {

        },
        methods: {
            onTouchmove(e) {
                let thumb = e.target;
                let contentY = this.scrollbarConfig.contentObj.scrollHeight;
                let moveY = e.targetTouches[0].clientY;
                let windowHeight = window.innerHeight;
                let head = this.scrollbarConfig.head || 0;
//                let thumbHeight = thumb.clientHeight;
                let scrollTop = (moveY - head - thumb.clientHeight / 2) / (windowHeight - head) * contentY;
                this.scrollbarConfig.contentObj.scrollTop = scrollTop;
            },
            onWheelScroll(e) {
                let thumb = document.querySelector('.scrollbar');
                let contentObj = e.target;
                let contentY = contentObj.scrollHeight;
                let windowHeight = window.innerHeight;
                let head = this.scrollbarConfig.head || 0;
                let scrollTop = contentObj.scrollTop;
                let moveY = scrollTop / contentY * (windowHeight - head);
                thumb.style.top = moveY + head + 'px';
            }
        }
    }
</script>

<style lang="scss">
    ::-webkit-scrollbar{
        width: 0 !important;
    }
    .scrollbar {
        width: 30px;
        height: 30px;
        position: fixed;
        right: 0px;
        z-index: 99;
        font-size: 30px;
        opacity: 0.4;
    }
</style>