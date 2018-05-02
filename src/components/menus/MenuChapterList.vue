<template>
    <div>
        <list class="list-ios" id="content_chapter_list">
            <item v-for="chapter in chapterList" @click="loadChapter(chapter)" class="item-chapter-list">{{chapter.title}}</item>
        </list>
        <scrollbar :scrollbarConfig="scrollbarConfig" ref="scrollbar"></scrollbar>
    </div>
</template>
<script>
    import Scrollbar from '../utils/Scrollbar.vue'

    export default{
        name: 'menuChapterList',
        props: {
            modalOptions: Object,
            rightBtnCallback: Function,
            chapterList: Array
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
            let _this = this;
            _this.scrollbarConfig.contentObj = document.querySelector('#content_chapter_list')
            _this.scrollbarConfig.head = 44;

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
                isShowModal: false,
                chapterList: []
            }
        },
        methods: {
            closeModal() {
                this.isShowModal = false;
            },
            loadChapter(chapter) {
                console.log('load chapter')
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
            },
            toggleChapterListSort() {
                //反转章节
                this.chapterList.reverse();
                //设置图标
                this.modalOptions.rightIcon = this.chapterList[0].chapterNum
                < this.chapterList[this.chapterList.length - 1].chapterNum ? 'ion-ios-arrow-down' : 'ion-ios-arrow-up'
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