<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="page" v-nav="{hideNavbar: true}">
        <div class="page-content" v-bind:style="readConfig.readContentStyle">
            <p class="title" v-text="bookData.chapter.title"></p>
            <div class="text-center read-content"
                 v-bind:style="readConfig.lineHeight"
                 v-html="bookData.chapter.content"
                @click="touchReadContent($event)">

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
            });
            _this.bus.$on('readScrollTop', function () {
                _this.readContentObject = document.querySelector('.page-content');
                _this.readContentObject.scrollTop = 0;
            });
            _this.bus.$on('readConfigFeedback', function (bookReadSetting) {
                _this.bookData.bookReadSetting = bookReadSetting;
                //更新内容样式
                _this.readConfig.readContentStyle.backgroundColor = bookReadSetting.bgColor;
                _this.readConfig.readContentStyle.color = bookReadSetting.color;
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
                        backgroundColor: '#6d816f',
                        color: '#dddddd',
                        padding: '0px'
                    },
                    lineHeight: '28px'
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
                chapterList: [],
                readContentObject: undefined
            }
        },
        methods: {
            loadReadSetting(chapterInfo) {
                let _this = this;
                _this.bookData = chapterInfo;
                //设置样式
                console.log(chapterInfo.bookReadSetting)
                _this.readConfig.readContentStyle.backgroundColor = chapterInfo.bookReadSetting.bgColor;
                _this.readConfig.readContentStyle.fontSize = chapterInfo.bookReadSetting.fontSize;
                _this.readConfig.readContentStyle.color = chapterInfo.bookReadSetting.color;
                _this.readConfig.lineHeight = chapterInfo.bookReadSetting.lineHeight;
            },
            loadChapter(direction) {
                let _this = this;
                _this.getChapterInfo({
                    bookId: _this.bookData.book.id,
                    lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
                    direction: direction
                }, function(chapterInfo) {
//                    chapterInfo.chapter.content = '';
                    _this.loadReadSetting(chapterInfo);
                    _this.bus.$emit('chapterList', chapterInfo.bookChapters);
                    _this.bus.$emit('readConfig', chapterInfo.bookReadSetting);
                    //滚动到顶部
                    _this.bus.$emit('readScrollTop');

                    //关闭目录
                    _this.bus.$emit('hide', {
                        hideMenu: true,
                        hideChapterList: true
                    });
                });
            },
            toggleMenu() {
                this.$refs.menu.$emit('toggle');
            },
            touchReadContent(e) {
                let _this = this;
                let readConfig = _this.bookData.bookReadSetting;
                let scrollTop = _this.readContentObject.scrollTop;
                let windowHeight = window.innerHeight;
                let documentHeight = document.innerHeight;

                var lineHeight = parseInt(_this.readConfig.readContentStyle.lineHeight);
                var isTop = scrollTop < 10;
                var isBottom = (documentHeight -
                    (windowHeight + scrollTop)) == 0;

                var tapX = e.clientX;
                var tapY = e.clientY;
                var tap = readConfig.pageMethod == "⇄" ? tapX : tapY;

                var width = screen.width;
                var height = screen.height;
                var widthOrHeight = readConfig.pageMethod == "⇄" ? width : height;

                //点击屏幕中央唤起菜单
                if (tap < (widthOrHeight / 3 * 2) && tap > (widthOrHeight / 3 * 1)) {
                    _this.toggleMenu();
                    return;
                }

//                if (bookMenu.isShow()) {
//                    return;
//                }

                if ((tap > (widthOrHeight / 3 * 2))
                    && !isBottom) {
                    //向下滚动
                    _this.scrollTo(_this.readContentObject, scrollTop + height - lineHeight, 100);
                    return;
                }

                if (tap < (widthOrHeight / 3 * 1)
                    && !isTop) {
                    //向上滚动
                    _this.scrollTo(_this.readContentObject, scrollTop - height + lineHeight, 100);
                    return;
                }

            }
        }
    }
</script>
<style lang="scss">

    .read-content {
        min-height: 100%;
    }
    .read-content p {
        padding: 0px;
        margin: 0px;
    }
</style>
