<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <transition v-bind:name="menuOption.transition">
        <div class="menu-f" v-show="menuOption.isShowMenu">
            <div class="menu-mask" @click="toggleMenu()"></div>
            <div class="menu-bar menu-header">
                <template>
                    <button class="button button-icon" @click="onBackClick()">
                        <span><i class="icon ion-ios-arrow-back"></i></span>
                    </button>
                    <button class="button button-icon pull-right" @click="bookSource()">
                        <span><i class="icon ion-ios-gear"></i></span>
                    </button>
                </template>
            </div>
            <div class="menu-bar menu-footer">
                <template>
                    <section>
                        <div>
                            <div class="btn-prev-chapter" @click="menuOption.prevChapter">上一章</div>
                            <div class="btn-next-chapter" @click="menuOption.nextChapter">下一章</div>
                        </div>
                        <button class="button-icon btn-toggle" @click="showToggleOperate()">
                            <span style="font-size: 24px;color: #FFFFFF;font-weight: bold" v-text="bookReadSetting.pageMethod">⇄</span>
                        </button>
                        <button class="button-icon btn-chapters" @click="toggleMenuChapterList()">
                            <span><i class="icon ion-navicon-round"></i></span>
                        </button>
                        <button class="button-icon btn-font" @click="toggleSetFontMenu()">
                            <span style="color: #DDDDDD;font-size: 24px;">Aa</span>
                        </button>
                    </section>
                </template>
            </div>
            <transition name="fade">
                <div class="menu-bar menu-font-setting"
                    v-show="isShowFontSetting">
                    <template>
                        <section>
                            <div class="btn-color-group">
                                <button class="btn btn-color-1" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-2" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-3" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-4" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-5" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-6" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-7" @click="changeBGColor($event)"></button>
                                <button class="btn btn-color-8" @click="changeBGColor($event)"></button>
                            </div>

                            <von-range
                                    v-model="bookReadSetting.fontSize"
                                    :min="minFontSize"
                                    :max="maxFontSize"
                            >
                                <i slot="text-left" style="font-size: 12px">A</i>
                                <i slot="text-right" style="font-size: 28px">A</i>
                            </von-range>
                            <von-range
                                    v-model="bookReadSetting.lineHeight"
                                    :min="minLineHeight"
                                    :max="maxLineHeight"
                            >
                                <i slot="text-left" class="icon ion-navicon" style="font-size: 12px"></i>
                                <i slot="text-right" class="icon ion-navicon" style="font-size: 28px"></i>
                            </von-range>
                        </section>
                    </template>
                </div>
            </transition>
            <v-sidebar :options="sidebarOptions" :chapterList="chapterList" ref="sidebar"></v-sidebar>

        </div>
    </transition>
</template>
<script>
    import Sidebar from '../utils/Sidebar.vue'
    import MenuChapterList from '../menus/MenuChapterList.vue'

    export default {
        name: 'menu',
        props: {
            menuOption: {
                default: {
                    transition: 'fade',
                    bookId: undefined,
                    prevChapter: function () {
                        console.log('上一章')
                    },
                    nextChapter: function () {
                        console.log('下一章')
                    },
                    isShowMenu: false
                }
            }
        },
        components: {
            'v-sidebar': Sidebar,
            'modal-chapter-list': MenuChapterList
        },
        updated() {
            this.minLineHeight = this.bookReadSetting.fontSize;
            this.bookReadSetting.lineHeight = this.bookReadSetting.lineHeight < this.minLineHeight ? this.minLineHeight : this.bookReadSetting.lineHeight;
        },
        data() {
            let _this = this;
            return {
                sidebarOptions: {
                    isShowSidebar: false,
                    side: 'right',
                    sidebarComponent: MenuChapterList

                },
                bookReadSetting: {
                    pageMethod: '⇄',
                    lineHeight: 20,
                    fontSize: 20,
                    bgColor: '#6d816f',
                    color: '#131313'
                },
                isShowFontSetting: false,
                minLineHeight: 20,
                maxLineHeight: 40,
                minFontSize: 14,
                maxFontSize: 40
            }
        },
        created() {
            let _this = this;
            _this.bus.$on('hide', function (hides) {
                if (hides.hideMenu) {
                    _this.menuOption.isShowMenu = false;
                }
            });

            _this.$on('toggle', function () {
                _this.menuOption.isShowMenu = !_this.menuOption.isShowMenu;
            });

            _this.bus.$on('readConfig', function (bookReadSetting) {
                _this.bookReadSetting = bookReadSetting;
                //初始化数据不监听变化(第一次加载到后台配置不保存)
                _this.$watch('bookReadSetting', {
                    deep: true,
                    handler: function () {
                        _this.feedBackAndSaveReadSetting()
                    }
                })
            });

        },
        mounted() {
            let _this = this;
        },
        methods: {
            onBackClick() {
                if (this.onBack) {
                    this.onBack()
                    return
                }

                if (window.__push_method__ === 'push') {
                    let root = document.querySelector('[von-app]')
                    if (root) root.setAttribute('transition-direction', 'back');
                    history.go(-1)
                }
            },
            bookSource() {
                $router.forward({path: '/source'})
            },
            toggleMenuChapterList() {
                this.sidebarOptions.isShowSidebar = !this.sidebarOptions.isShowSidebar;
            },
            showToggleOperate() {
                this.bookReadSetting.pageMethod = this.bookReadSetting.pageMethod == '⇄' ?
                    '⇅' : '⇄';
            },
            toggleMenu() {
                if (this.isShowFontSetting) {
                    this.toggleSetFontMenu();
                    return;
                }
                this.menuOption.isShowMenu = !this.menuOption.isShowMenu;
            },
            toggleSetFontMenu() {
                this.isShowFontSetting = !this.isShowFontSetting;
            },
            changeBGColor(e) {
                let backgroundColor = window.getComputedStyle(e.currentTarget,null).getPropertyValue('background-color');
                backgroundColor = backgroundColor.colorHex();
                let color = window.getComputedStyle(e.currentTarget,null).getPropertyValue('color');
                color = color.colorHex();
                this.bookReadSetting.bgColor = backgroundColor;
                this.bookReadSetting.color = color;

            },
            feedBackAndSaveReadSetting() {
                this.bus.$emit('readConfigFeedback', this.bookReadSetting);
                this.saveReadSetting(this.bookReadSetting);
            }

        }
    }
</script>

<style lang='scss'>
    @import '../../assets/scss/transition.scss';
    .menu-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        opacity: 0;
    }
    .menu-f {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    .menu-bar {
        width: 100%;
        background-color: #101010;
        position: fixed;
        left: 0px;
        color: #FAFAFA;
    }

    .menu-header {
        height: 48px;
        top: 0px;
    }

    .menu-footer {
        height: 80px;
        bottom: 0px;
    }
    .menu-font-setting {
        height: 136px;
        bottom: 0px;
        z-index: 1;
    }

    .icon {
        color: #DDDDDD;
    }



    .pull-right {
        float: right;
    }

    .btn-prev-chapter {
        position: absolute;
        top: 0px;
        left: 8px;
        line-height: 30px;
        height: 30px;
    }

    .btn-next-chapter {
        position: absolute;
        top: 0px;
        right: 8px;
        line-height: 30px;
        height: 30px;
    }

    .btn-font {
        position: absolute;
        bottom: 2px;
        left: 45%;
    }

    .btn-toggle {
        position: absolute;
        bottom: 2px;
        left: 8px;
    }

    .btn-chapters {
        position: absolute;
        bottom: 2px;
        right: 8px;
    }

    /*背景色*/
    .btn-color-group{
        padding-top: 10px;
        text-align: center;
    }
    .btn {
        border-radius: 50%;
        height:  24px;
        width: 24px;
        border: 0px;
        margin: 0px 3px;
    }

    .btn-color-group .btn-color-1 {
        background-color: #6d816f;
        color: #131313;

    }
    .btn-color-group .btn-color-2 {
        background-color: #7d7567;
        color: #DDDDDD;
    }
    .btn-color-group .btn-color-3 {
        background-color: #7a7f6f;
        color: #DDDDDD;
    }
    .btn-color-group .btn-color-4 {
        background-color: #817f79;
        color: #ffffff;
    }
    .btn-color-group .btn-color-5 {
        background-color: #1d2c29;
        color: #DDDDDD;
    }

    .btn-color-group .btn-color-6 {
        background-color: #16211c;
        color: #aeaeae;

    }

    .btn-color-group .btn-color-7 {
        background-color: #161c27;
        color: #838383;
    }

    .btn-color-group .btn-color-8 {
        background-color: #322319;
        color: #949494;
    }

    /*滑块*/
    .range.range-assertive {
        background-color: #101010;
        color: #FFFFFF;
        height: 40px;
    }
    .range .hairline-bottom:after, .range .hairline-top:before {
        height: 0px;
    }
</style>