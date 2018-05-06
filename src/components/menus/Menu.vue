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
                        <button class="button-icon btn-font" @click="showSetFont()">
                            <span style="color: #DDDDDD;font-size: 24px;">Aa</span>
                        </button>
                    </section>
                </template>
            </div>
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
                    pageMethod: '⇄'
                }
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
            });

        },
        mounted() {
            let _this = this;
        },
        destroyed() {
            $sidebar.destroy()
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
                if (this.bookReadSetting.pageMethod == '⇄') {
                    this.bookReadSetting.pageMethod = '⇅';
                } else {
                    this.bookReadSetting.pageMethod = '⇄';
                }

                this.bus.$emit('readConfigFeedback', this.bookReadSetting);
            },
            toggleMenu() {
                this.menuOption.isShowMenu = !this.menuOption.isShowMenu;
            }

        }
    }
</script>

<style scoped lang='scss'>
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

    .icon {
        color: #DDDDDD;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
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
</style>