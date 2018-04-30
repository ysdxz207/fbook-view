<template>
    <div class="page-content" id="content_chapter_list">
        <list class="list-ios">
            <item v-for="chapter in chapterList" @click.native="loadChapter(chapter)" class="item-chapter-list">{{chapter.title}}</item>
        </list>
        <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>

    </div>
</template>
<script>
    import Scrollbar from '../utils/Scrollbar.vue'

    export default{
        props: {
            bookId: String,
            chapterList: Array
        },
        components: {
            'scrollbar': Scrollbar
        },
        mounted() {
            this.loadChapterList();
            this.scrollbarConfig.contentObj = document.querySelector('#content_chapter_list')
            this.scrollbarConfig.head = 44;
        },
        data() {
            return {
                scrollbarConfig: {
                    contentObj: undefined,
                    head: 0
                }
            }
        },
        methods: {
            loadChapterList() {
                let _this = this;
                _this.ajax.post('/chapterList', {bookId: this.bookId}).then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                _this.chapterList = response.data.data;
                                break;
                            default:
                                $toast.show('目录加载失败：' + response.data.message)
                                if (response.data.errorCode == 'LOGIN_WRONG_PASSWORD') {
                                    localStorage.removeItem('fbook_username');
                                    $router.forward({path: '/login'});
                                }
                        }
                }).catch(function (error) {
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error ),
                        okTheme: 'calm'
                    })
                });
            },
            loadChapter(chapter) {
                let _this = this;
                _this.getChapterInfo({
                    bookId: chapter.bookId,
                    chapterNum: chapter.chapterNum,
                    lastChapterNum: _this.chapterList.length
                }, function(chapterInfo) {
                    //关闭目录
                    _this.bus.$emit('hide', {
                        menu: true,
                        chapterList: true
                    });
                    //更新内容
                    _this.bus.$emit('reloadChapterInfo', chapterInfo)
                });
            }
        }
    }
</script>

<style scoped lang="scss">

    .list-ios>.item-chapter-list {
        min-height: 30px;
        padding-top: 8px;
        padding-bottom: 8px;
    }
</style>