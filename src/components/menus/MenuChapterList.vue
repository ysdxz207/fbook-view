<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="page has-navbar" v-nav="{ title: '目录', showBackButton: true }">
        <div class="page-content"  id="content">
            <list class="list-ios" id="content_chapter_list">
                <item v-for="chapter in chapterList" @click.native="loadChapter(chapter)" class="item-chapter-list">{{chapter.title}}</item>
            </list>
            <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>
        </div>
    </div>
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