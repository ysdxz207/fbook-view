<template>
    <div class="chapter-list">
        <list class="list-ios" id="content_chapter_list">
            <item v-for="chapter in chapterList" @click.native="loadChapter(chapter)" class="item-chapter-list">{{chapter.title}}</item>
        </list>
        <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>
    </div>
</template>
<script>
    import Scrollbar from '../utils/Scrollbar.vue'

    export default{
        name: 'menuChapterList',
        props: {
            rightBtnCallback: Function,
            sidebarOptions: {
                default: function () {
                    return {
                        chapterList: []
                    }
                }
            }
        },
        components: {
            'scrollbar': Scrollbar
        },
        created() {
            let _this = this;
            _this.bus.$on('chapterList', function (chapterList) {
                _this.chapterList = chapterList;
            });
        },
        mounted() {
            let _this = this;
            _this.scrollbarConfig.contentObj = document.querySelector('#content_chapter_list')

        },
        updated() {
        },
        data() {
            return {
                scrollbarConfig: {
                    contentObj: undefined
                },
                isShowModal: false,
                chapterList: []
            }
        },
        methods: {
            closeModal() {
                this.isShowModal = false;
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
                    _this.bus.$emit('reloadChapterInfo', chapterInfo);
                    //滚动到顶部
                    _this.bus.$emit('readScrollTop');
                });
            },
            customRightButton() {
                if (this.rightBtnCallback) {
                    this.rightBtnCallback()
                } else {
                    console.log('default right btn click')
                }
            },
            toggleChapterListSort() {
                //反转章节
                this.sidebarOptions.chapterList.reverse();
                //设置图标
//                this.modalOptions.rightIcon = this.chapterList[0].chapterNum
//                < this.chapterList[this.chapterList.length - 1].chapterNum ? 'ion-ios-arrow-down' : 'ion-ios-arrow-up'
            }
        }
    }
</script>

<style scoped lang="scss">

    .chapter-list {
        height: 100%;
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