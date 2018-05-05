<template>
    <div class="scrollbar-orbit">
        <div class="scrollbar ion-navicon-round"
             draggable="true"
             @touchmove="onTouchmove($event)"

        >
    </div>

    </div>
</template>
<script>

    /**
     * contentObj:内容对象
     */
    export default {
        name: 'scrollbar',
        props: {
            scrollbarConfig: Object
        },
        data() {
            return {
                objectOrbit: undefined,
                objectThumb: undefined
            }
        },
        mounted() {
            this.objectOrbit = document.querySelector('.scrollbar-orbit');
            this.objectThumb = document.querySelector('.scrollbar');
        },
        watch: {
            'scrollbarConfig.contentObj': function (contentObj) {
                contentObj.addEventListener('mousewheel', this.onWheelScroll);
                contentObj.addEventListener('touchmove', this.onWheelScroll);
            }
        },
        destroyed() {

        },
        methods: {
            onTouchmove(e) {
                let thumb = this.objectThumb;
                let contentY = this.scrollbarConfig.contentObj.scrollHeight;
                let moveY = e.targetTouches[0].clientY;
                let orbitHeight = this.objectOrbit.clientHeight;
                let scrollTop = contentY / ((orbitHeight) / moveY);
                this.scrollbarConfig.contentObj.scrollTop = scrollTop;
                moveY = moveY - thumb.clientHeight / 2;

                if (moveY >= 0
                    && moveY <= orbitHeight) {
                    thumb.style.top = moveY + 'px';
                }
            },
            onWheelScroll(e) {
                let thumb = this.objectThumb;
                let contentObj = this.scrollbarConfig.contentObj;
                let contentY = contentObj.scrollHeight;
                let orbitHeight = this.objectOrbit.clientHeight;
                let scrollTop = contentObj.scrollTop;
                let moveY = (orbitHeight) / (contentY / scrollTop);
                thumb.style.top = moveY + 'px';
            }
        }
    }
</script>

<style lang="scss">
    ::-webkit-scrollbar{
        display: none;
    }
    .scrollbar-orbit {
        height: 94%;
        width: 0px;
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 2;
    }
    .scrollbar {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 0px;
        font-size: 30px;
        opacity: 0.4;
    }
</style>