<template>
    <list class="list-ios">
    <button @click="showButton">点我</button>
        <item v-for="chapter in chapterList" @click.native="loadChapter(chapter)" class="item-chapter-list">{{chapter}}</item>
    </list>
</template>
<script>
    export default {
        name: 'sidebar-chapter-list',
        props: {

        },
        data() {
            return {
                chapterList: []
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
            showButton(){
                console.log('show')
            },
            loadChapter(chapter) {
                console.log('load chapter:' + chapter)
            }
        }
    }
</script>

<style lang="scss">

</style>