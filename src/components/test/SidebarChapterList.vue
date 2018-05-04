<template>
    <div>
        <list class="list-ios">
            <item v-for="chapter in chapterList" @click="loadChapter(chapter)" class="item-chapter-list">{{chapter}}</item>
        </list>
        <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>
    </div>
</template>
<script>
    export default {
        name: 'sidebar-chapter-list',
        props: {

        },
        data() {
            return {

            }
        },
        created() {
            let _this = this;
            _this.bus.$on('testChapterList', function (arr) {
                _this.chapterList = arr;
            })
        },
        mounted() {
        },
        updated() {

        },
        methods: {

            loadChapter(chapter) {
                console.log('load chapter:' + chapter)
            }
        }
    }
</script>

<style lang="scss">

</style>