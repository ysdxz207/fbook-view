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
        <v-menu :menuOption="menuOption" ref="menu"></v-menu>

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
                    bookId: _this.$route.query.bookId,
                    transition: 'fade',
                    prevChapter: function() {
                        _this.loadChapter(-1);
                    },
                    nextChapter: function() {
                        _this.loadChapter(1)
                    },
                    isShowMenu: false
                }
            }
        },
        methods: {
            loadChapter(direction) {
                let _this = this;
                _this.getChapterInfo({
                    bookId: _this.bookData.book.id,
                    lastChapterNum: _this.bookData.bookChapters.length,
                    direction: direction
                }, function(chapterInfo) {
                    _this.bookData = chapterInfo;
                });
            },
            toggleMenu() {
                this.$refs.menu.$emit('toggle');
            }
        }
    }
</script>
<style lang="scss">

</style>
