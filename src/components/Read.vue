<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="page" v-nav="{hideNavbar: true}">
        <div class="page-content"
             v-bind:style="readConfig.readMainStyle"
             @click="touchReadContent($event)">
            <div class="text-center read-content-main"
                 v-bind:style="readConfig.readContentStyle">
                <p class="title" v-text="bookData.chapter.title" :style="readConfig.readTitleStyle"></p>

                <transition-group tag="div" v-bind:name="pageTransition">
                    <article class="read-content"
                             v-for="page in splitPages"
                             v-show="currentPage == page.index"
                             v-html="page.content"
                             v-bind:key="page.index">
                    </article>
                </transition-group>
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
            _this.loadChapter(0);
        },
        created() {
            let _this = this;
            _this.bus.$on('reloadChapterInfo', function (chapterInfo) {
                _this.bookData = chapterInfo;
                //拆分页面
                _this.$emit('assemblePages', chapterInfo.chapter);
            });
            _this.bus.$on('readScrollTop', function () {
                _this.readContentObject = document.querySelector('.read-content-main');
                _this.readContentObject.scrollTop = 0;
            });
            _this.bus.$on('readConfigFeedback', function (bookReadSetting) {
                _this.bookData.bookReadSetting = bookReadSetting;
                //更新内容样式
                _this.readConfig.readMainStyle.backgroundColor = bookReadSetting.bgColor;
                _this.readConfig.readMainStyle.color = bookReadSetting.color;
                _this.readConfig.readContentStyle.lineHeight = parseInt(bookReadSetting.lineHeight) + 'px';
                _this.readConfig.readContentStyle.fontSize = parseInt(bookReadSetting.fontSize) + 'px';
                _this.readConfig.readTitleStyle.backgroundColor = bookReadSetting.bgColor;

                //重新分页
                _this.$emit('assemblePages', _this.bookData.chapter)
            });
            _this.$on('assemblePages', function (chapter) {
                _this.assemblePages(chapter);
            });
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
                        fontSize: '12px',
                        paddingLeft: '8px',
                        backgroundColor: '#6d816f',
                        margin: '0px',
                        height: '20px',
                        textAlign: 'left',
                        lineHeight: '20px'
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
                        _this.loadChapter(-1);
                    },
                    nextChapter: function() {
                        _this.loadChapter(1)
                    },
                    isShowMenu: false
                },
                chapterList: [],
                readContentObject: undefined,
                currentPage: 1,
                splitPages: [],
                pageTransition: 'pop-in',
                wordsNum: 0
            }
        },
        methods: {
            loadReadContentAndSetting(chapterInfo) {
                let _this = this;
                //页码设置为1
                _this.currentPage = 1;
                //设置内容信息
                _this.bookData = chapterInfo;
                //设置样式
                _this.readConfig.readMainStyle.backgroundColor = chapterInfo.bookReadSetting.bgColor;
                _this.readConfig.readMainStyle.color = chapterInfo.bookReadSetting.color;
                _this.readConfig.readContentStyle.fontSize = parseInt(chapterInfo.bookReadSetting.fontSize) + 'px';
                _this.readConfig.readContentStyle.lineHeight = parseInt(chapterInfo.bookReadSetting.lineHeight) + 'px';

                //加载章节列表
                _this.bus.$emit('chapterList', chapterInfo.bookChapters);
                //滚动到顶部
                _this.bus.$emit('readScrollTop');
                //拆分页面
                _this.$emit('assemblePages', chapterInfo.chapter);
                //预加载下一章
                _this.preFetchChapter();
            },
            loadChapter(direction) {
                let _this = this;

                //加载下一章缓存
                let localNextChapter = localStorage.getItem("fbook_next_chapter");

                if (direction == 1
                    && localNextChapter) {
                    _this.loadChapterFromLocalStorage(JSON.parse(localNextChapter));
                    return;
                }

                _this.getChapterInfo({
                    bookId: _this.bookData.book.id,
                    lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
                    direction: direction,
                    preLoad: false
                }, function(chapterInfo) {
                    //清空缓存
                    localStorage.removeItem("fbook_next_chapter");

                    //加载配置信息
                    _this.bus.$emit('readConfig', chapterInfo.bookReadSetting);

//                    chapterInfo.chapter.content = '';
                    _this.loadReadContentAndSetting(chapterInfo);
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

                if ((tap > (widthOrHeight / 3 * 2))) {
                    //下一页
                    _this.pageTransition = 'pop-in';
                    if (_this.currentPage >= _this.splitPages.length) {
                        //下一章
                        _this.loadChapter(1);
                        return;
                    }
                    _this.readContentObject.scrollTop = 0;

                    _this.currentPage += 1;
                    return;
                }

                if (tap < (widthOrHeight / 3 * 1)) {
                    //上一页
                    if (_this.currentPage == 1) {
                        return;
                    }
                    _this.readContentObject.scrollTop = 0;

                    _this.pageTransition = 'pop-out';
                    _this.currentPage -= 1;
                    return;
                }

            },
            assembleText(textContentText,
                         textContentTextLast,
                         textContent) {
                let _this = this;
                //减掉标题高度,手机多出了点，所以多减30
                let windowHeight = screen.height - parseInt(_this.readConfig.readTitleStyle.height) - 20;
                let isOverFlow = textContent.offsetHeight > windowHeight;
                let loop = true;
                let char = '';
                let textContentTemp = '';
                let textContentAppendText = [];

                //创建新元素
                let textContentAppend = document.createElement('article');
                //新元素添加class
                textContentAppend.classList.add('read-content-temp');
                //设置样式
                for (let style in _this.readConfig.readContentStyle) {
                    textContentAppend.style[style] = _this.readConfig.readContentStyle[style];
                }

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
                }

                if (isOverFlow) {
                    textContentAppend.innerText = textContentAppendText.join('') + textContentTextLast.join('');
                } else {
                    //因为多加了一个字符，所以要减掉
                    textContentText = textContent.innerText.split('');
                    let overChar = textContentText.pop();
                    textContent.innerText = textContentText.join('');
                    textContentTextLast.unshift(overChar);
                    textContentAppend.innerText = textContentTextLast.join('');
                }

                return textContentAppend;
            },
            splitScreenPage(textContent) {
                let _this = this;

                let textContentText = textContent.innerText;


                let textContentTextLast = textContentText.substring(_this.wordsNum);

                //截取相对第一页大概的内容并赋值给原元素
                textContentText = textContentText.substring(0,_this.wordsNum);
                textContent.innerText = textContentText;
                //拆分原元素内容为数组
                textContentText = textContentText.split('');
                //拆分剩下元素内容为数组
                textContentTextLast = textContentTextLast.split('');

                //判断是否超出或没满框
                return _this.assembleText(textContentText,
                    textContentTextLast,
                    textContent);

            },
            assemblePages(chapter) {
                let _this = this;
                //清空缓存
                localStorage.removeItem("fbook_next_chapter");
                _this.splitPages = [];
                let windowWidth = screen.width;
                let windowHeight = screen.height - parseInt(_this.readConfig.readTitleStyle.height);
                let lineHeight = parseInt(_this.readConfig.readContentStyle.lineHeight);
                let fontSize = parseInt(_this.readConfig.readContentStyle.fontSize);

                //计算一页大概多少字
                _this.wordsNum = parseInt((windowWidth * windowHeight) / (lineHeight * fontSize));
                //剩余内容
                //内容分页
                let readContent = document.querySelector('.read-content-main');

                let pageContent = document.createElement('article');
                //设置样式
                for (let style in _this.readConfig.readContentStyle) {
                    pageContent.style[style] = _this.readConfig.readContentStyle[style];
                }
                pageContent.innerHTML = chapter.content;
                readContent.appendChild(pageContent);

                let temps = [];
                temps.push(pageContent);

                while (pageContent.offsetHeight > windowHeight) {
                    pageContent = _this.splitScreenPage(pageContent);
                    readContent.appendChild(pageContent);
                    temps.push(pageContent);
                }

                while (temps.length > 0) {
                    let page = temps.shift();
                    readContent.removeChild(page);
                    _this.splitPages.push({index: _this.splitPages.length + 1, content: page.innerText.replace(/\n/g, '<br/>')});
                }

            },
            preFetchChapter() {
                let _this = this;
                _this.preFetchChapterInfo({
                    bookId: _this.bookData.book.id,
                    lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
                    direction: 1,
                    preLoad: true
                }, function(chapterInfo) {
                    chapterInfo.bookReadSetting = _this.bookData.bookReadSetting;
                    localStorage.setItem("fbook_next_chapter", JSON.stringify(chapterInfo))
                });
            },
            loadChapterFromLocalStorage(chapterInfo) {
                $loading.show('读取缓存...');
                let _this = this;
                //保存在读章节
                chapterInfo.bookRead.lastReadingChapterNum += 1;
                chapterInfo.bookRead.lastReadingChapter = chapterInfo.chapter.title;
                //当前页修改设置应用到下一章缓存
                chapterInfo.bookReadSetting= _this.bookData.bookReadSetting;

                _this.ajax({
                    method: 'post',
                    url: '/saveBookRead',
                    data: chapterInfo.bookRead

                }).then(function (response) {
                    switch (response.data.statusCode) {
                        case 200:
                            _this.loadReadContentAndSetting(chapterInfo);
                            break;
                        default:

                    }

                }).catch(function (error) {
                });
                $loading.hide();
            }
        }
    }
</script>
<style lang="scss">

    @import "../assets/scss/transition.scss";


    .read-content-main {
    }
    .read-content {
        text-align: left;
    }
    .read-content p {
        padding: 0px;
        margin: 0px;
    }
</style>
