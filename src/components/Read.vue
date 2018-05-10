<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="page" v-nav="{hideNavbar: true}">
        <div class="page-content" v-bind:style="readConfig.readMainStyle">
            <p class="title" v-text="bookData.chapter.title" :style="'height: ' + readConfig.readContentStyle.lineHeight"></p>
            <div class="text-center read-content-main"
                 v-bind:style="readConfig.readContentStyle"
                 @click="touchReadContent($event)"
                 @touchstart="touchEndPrevent($event)">
                <article class="read-content"
                         v-html="bookData.chapter.content"
                         v-show="currentPage == 1"
                >

                </article>
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
            let _this = this;
            _this.loadChapter(0, false);

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
                _this.readConfig.readMainStyle.backgroundColor = bookReadSetting.bgColor;
                _this.readConfig.readMainStyle.color = bookReadSetting.color;
                _this.readConfig.readContentStyle.lineHeight = parseInt(bookReadSetting.lineHeight) + 'px';
                _this.readConfig.readContentStyle.fontSize = parseInt(bookReadSetting.fontSize) + 'px';

            });
            _this.$on('assemblePages', function () {
                _this.assemblePages();
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
                    readMainStyle: {
                        backgroundColor: '#6d816f',
                        color: '#dddddd',
                    },
                    readContentStyle: {
                        fontSize: '20px',
                        lineHeight: '28px'
                    }
                },
                menuOption: {
                    transition: 'fade',
                    prevChapter: function() {
                        _this.loadChapter(-1, false);
                    },
                    nextChapter: function() {
                        _this.loadChapter(1, false)
                    },
                    isShowMenu: false
                },
                chapterList: [],
                readContentObject: undefined,
                currentPage: 1,
                splitPages: []
            }
        },
        methods: {
            loadReadContentAndSetting(chapterInfo) {
                let _this = this;
                //设置内容信息
                _this.bookData = chapterInfo;
                //拆分页面
                _this.$emit('assemblePages');
                //设置样式
                _this.readConfig.readMainStyle.backgroundColor = chapterInfo.bookReadSetting.bgColor;
                _this.readConfig.readMainStyle.color = chapterInfo.bookReadSetting.color;
                _this.readConfig.readContentStyle.fontSize = parseInt(chapterInfo.bookReadSetting.fontSize) + 'px';
                _this.readConfig.readContentStyle.lineHeight = parseInt(chapterInfo.bookReadSetting.lineHeight) + 'px';
            },
            loadChapter(direction, preload) {
                let _this = this;
                _this.getChapterInfo({
                    bookId: _this.bookData.book.id,
                    lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
                    direction: direction,
                    preLoad: preload
                }, function(chapterInfo) {
//                    chapterInfo.chapter.content = '';
                    _this.loadReadContentAndSetting(chapterInfo);
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
                let documentHeight = _this.readContentObject.scrollHeight;

                let lineHeight = parseInt(_this.readConfig.readContentStyle.lineHeight);
                let isTop = scrollTop < 10;
                let isBottom = (documentHeight -
                    (windowHeight + scrollTop)) == 0;

                let tapX = e.clientX;
                let tapY = e.clientY;
                let tap = readConfig.pageMethod == "⇄" ? tapX : tapY;

                let width = screen.width;
                let height = screen.height;
                let widthOrHeight = readConfig.pageMethod == "⇄" ? width : height;

                //点击屏幕中央唤起菜单
                if (tap < (widthOrHeight / 3 * 2) && tap > (widthOrHeight / 3 * 1)) {
                    _this.toggleMenu();
                    return;
                }

                if ((tap > (widthOrHeight / 3 * 2))
                    && !isBottom) {
                    //下一页
                    _this.currentPage += 1;
                    return;
                }

                if (tap < (widthOrHeight / 3 * 1)
                    && !isTop) {
                    //上一页
                    _this.currentPage -= 1;
                    return;
                }

            },
            touchEndPrevent(e) {
                e.preventDefault();
            },
            assembleText(textContentText,
                         textContentTextLast,
                         textContent,
                         textContentAppend) {
                let windowHeight = screen.height;
                let isOverFlow = textContent.offsetHeight > windowHeight;
                let loop = true;
                let char = '';
                let textContentTemp = '';
                let textContentAppendText = [];

                console.log('是否溢出：',isOverFlow)

                while (loop) {
                    if (isOverFlow) {
                        //移除最后一个字符
                        char = textContentText.pop();
                        //准备把最后一个字符赋值给新元素
                        textContentAppendText.unshift(char);
                    } else {
                        //移除剩余内容的第一个字符
                        char = textContentTextLast.shift();
                        //剩余内容的第一个字符赋值给原元素
                        textContentText.push(char);
                    }

                    //重新组装新原元素内容
                    textContentTemp = textContentText.join('');
                    //组装后内容赋值给第一个元素
                    textContent.innerText = textContentTemp;
                    //更新溢出状态
                    if (isOverFlow) {
                        loop = textContent.offsetHeight > windowHeight;
                    } else {
                        loop = textContent.offsetHeight < windowHeight;
                    }
                    console.log(textContent.offsetHeight)
                }

                if (isOverFlow) {
                    textContentAppend.innerText = textContentAppendText.join('') + textContentTextLast.join('');
                } else {
                    //因为多加了一个字符，所以要减掉
                    textContentText = textContent.innerText.split('');
                    let overChar = textContentText.pop();
                    textContent.innerText = textContentText.join('');
                    textContentTextLast.unshift(overChar);
                    //刚好满框或大于框了就把剩余内容赋值给新元素
                    textContentAppend.innerText = textContentTextLast.join('');
                }


                return textContentAppend;
            },
            splitScreenPage(textContent) {
                let _this = this;
                let windowWidth = screen.width;
                let windowHeight = screen.height;
                console.log(windowWidth,windowHeight)
                let lineHeight = parseInt(_this.readConfig.readContentStyle.lineHeight);
                let fontSize = parseInt(_this.readConfig.readContentStyle.fontSize);

                let textContentText = textContent.innerText;

                //计算一页大概多少字
                let wordsNum = parseInt((windowWidth * windowHeight) / (lineHeight * fontSize)) - 30;

                //剩余内容
                let textContentTextLast = textContentText.substring(wordsNum);

                //截取相对第一页大概的内容并赋值给原元素
                textContentText = textContentText.substring(0,wordsNum);
                textContent.innerText = textContentText;
                //拆分原元素内容为数组
                textContentText = textContentText.split('');
                //拆分剩下元素内容为数组
                textContentTextLast = textContentTextLast.split('');


                //创建新元素
                let textContentAppend = document.createElement('div');
                //新元素添加class
                textContentAppend.classList.add('read-content');

                //判断是否超出或没满框
                return _this.assembleText(textContentText,
                    textContentTextLast,
                    textContent,
                    textContentAppend);

            },
            assemblePages() {
                let _this = this;
                //内容分页
                let newContent = _this.splitScreenPage(document.querySelector('.read-content'));
                while (newContent.offsetHeight > screen.height) {
                    newContent = splitScreenPage(newContent);
                    _this.splitPages.push(newContent.innerText);
                }
            }
        }
    }
</script>
<style lang="scss">

    .read-content-main {
        height: 100%;
    }
    .read-content {
        height: 100%;
        border: 1px solid #FF3333;
        margin-bottom: 30px;
    }
    .read-content p {
        padding: 0px;
        margin: 0px;
    }
</style>
