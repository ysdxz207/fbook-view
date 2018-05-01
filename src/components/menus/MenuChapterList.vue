<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <transition v-bind:name="modalOptions.transition">
        <div class="modal" v-show="isShowModal">
            <div class="modal-header">
                <div class="left-button icon" v-bind:class="modalOptions.leftIcon" @click="closeModal()"></div>
                <div class="modal-title" v-text="modalOptions.title"></div>
                <div class="right-button icon" v-bind:class="modalOptions.rightIcon" @click="customRightButton()"></div>
            </div>
            <list class="list-ios" id="content_chapter_list">
                <item v-for="chapter in chapterList" @click.native="loadChapter(chapter)" class="item-chapter-list">{{chapter.title}}</item>
            </list>
            <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>
        </div>
    </transition>
</template>
<script>
    import Scrollbar from '../utils/Scrollbar.vue'

    export default{
        props: {
            modalOptions: Object,
            rightBtnCallback: Function,
            chapterList: []
        },
        components: {
            'scrollbar': Scrollbar
        },
        created() {
            let _this = this;
            _this.$on('show', function () {
                _this.isShowModal = true;
            });
            _this.bus.$on('hide', function (hides) {
                if (hides.hideChapterList) {
                    _this.isShowModal = false;
                }
            });

        },
        mounted() {
            this.scrollbarConfig.contentObj = document.querySelector('#content_chapter_list')
            this.scrollbarConfig.head = 44;

            Vue.util.extend(this.modalOptions, {
                transition: 'slide-right',
                title: '目录',
                leftIcon: 'ion-ios-arrow-back',
                rightIcon: 'ion-ios-arrow-down'
            });
        },
        data() {
            return {
                scrollbarConfig: {
                    contentObj: undefined,
                    head: 0
                },
                isShowModal: false
            }
        },
        watch: {
            chapterList: function (value) {
                this.chapterList = value;
            }
        },
        methods: {
            closeModal() {
                this.isShowModal = false;
            },
            loadChapterList() {
                let _this = this;

                _this.ajax.post('/chapterList', {bookId: _this.modalOptions.bookId}).then(function (response) {
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
                        hideMenu: true,
                        hideChapterList: true
                    });
                    //更新内容
                    _this.bus.$emit('reloadChapterInfo', chapterInfo)
                });
            },
            customRightButton() {
                if (this.rightBtnCallback) {
                    this.rightBtnCallback()
                } else {
                    console.log('default right btn click')
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    /* slide left*/
    /* slide right*/
    .slide-left-enter-active, .slide-left-leave-active {
        transform: translateX(0);
        transition: all .4s;
    }

    .slide-left-enter-to, .slide-left-leave-to {
        transform: translateX(-100%)
    }
    /* slide right*/
    .slide-right-enter {
        transform: translateX(100%);
        opacity: 0.8;
        z-index: 1;
        transition: all .4s;

    }
    .slide-right-enter-to {
        transform: translateX(0);
        opacity: 1;
        z-index: 1;
        transition: all .4s;

    }
    .slide-right-leave {
        transform: translateX(0);
        opacity: 1;
        z-index: 2;
    }
    .slide-right-leave-active {
        box-shadow: 0 0 10px rgba(0,0,0,.15);
    }
    .slide-right-leave-to {
        transform: translateX(100%);
        opacity: 1;
        z-index: 2;
        transition: all .4s;

    }

    .modal {
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 1;
        width: 100%;
        height: 100%;
    }
    .modal-header {
        height: 44px;
        width: 100%;
        border-bottom: 1px solid #DDDDDD;
        text-align: center;
        line-height: 44px;
        font-size: 17px;
        font-weight: bold;
        position: fixed;
        top: 0px;
        left: 0px;
        box-shadow: 0 0 10px rgba(0,0,0,.15);
        z-index: 2;
    }

    .left-button {
        position: fixed;
        left: 0px;
        padding-left: 8px;
        width: 44px;
        font-size: 32px;
        top: 0px;
    }
    .right-button {
        position: fixed;
        right: 0px;
        padding-right: 8px;
        width: 44px;
        font-size: 32px;
        top: 0px;
    }
    .list-ios {
        height: 100%;
        overflow-y: scroll;
    }
    .list-ios>.item-chapter-list {
        min-height: 30px;
        padding-top: 8px;
        padding-bottom: 8px;
    }
</style>