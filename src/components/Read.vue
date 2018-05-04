<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="page" v-nav="{hideNavbar: true}">
        <div class="page-content">
            <p class="title" v-text="bookData.chapter.title" v-bind:style="readConfig.readTitleStyle"></p>
            <div class="text-center read-content"
                 v-bind:style="readConfig.readContentStyle"
                 v-html="bookData.chapter.content"
                @click="toggleMenu()">

            </div>
        </div>
        <v-menu :menuOption="menuOption"
                ref="menu"></v-menu>

    </div>
</template>

<script>
    import menu from './menus/Menu.vue';

    export default {
        components: {
            'v-menu': menu
        },
        mounted() {
            this.loadChapter(0);
        },
        created() {
            let _this = this;
            _this.bus.$on('reloadChapterInfo', function (chapterInfo) {
                _this.bookData = chapterInfo;
            })
        },
        data() {
            let _this = this;
            return {
                bookData: {
                    book: {
                        id: _this.$route.query.bookId,
                        chapterName: '',
                        chapter: 1,
                        content: '',
                        bookInfo: {}
                    },
                    chapter: {},
                    bookRead: {
                        lastReadingChapterNum: 1
                    },
                    bookReadSetting: {},
                    bookChapters: []
                },
                readConfig: {
                    readTitleStyle: {
                        fontSize: '14px',
                        paddingLeft: '8px',
                        backgroundColor: '#6d816f',
                        margin: '0px'
                    },
                    readContentStyle: {
                        fontSize: '20px',
                        lineHeight: '24px',
                        backgroundColor: '#6d816f',
                        padding: '0px'
                    }
                },
                menuOption: {
                    transition: 'fade',
                    prevChapter: function() {
                        _this.loadChapter(-1);
                    },
                    nextChapter: function() {
                        _this.loadChapter(1)
                    },
                    isShowMenu: false
                },
                chapterList: []
            }
        },
        methods: {
            loadChapter(direction) {
                let _this = this;
                _this.getChapterInfo({
                    bookId: _this.bookData.book.id,
                    lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
                    direction: direction
                }, function(chapterInfo) {
//                    chapterInfo.chapter.content = '';
                    _this.bookData = chapterInfo;
                    _this.bus.$emit('chapterList', chapterInfo.bookChapters);
                    //滚动到顶部
                    document.querySelector('body').scrollTop = 0;
                    //关闭目录
                    _this.bus.$emit('hide', {
                        hideMenu: true,
                        hideChapterList: true
                    });
                });
            },
            toggleMenu() {
                this.$refs.menu.$emit('toggle');
            }
        }
    }
</script>
<style lang="scss">

    .read-content {
        height: 100%;
    }
</style>
