<template>
    <div class="page has-navbar" v-nav="{
        title: '书籍详情',
        showBackButton: true,
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-ios-gear\'></i>',
        onMenuButtonClick: showSourceList
        }">
        <div class="page-content text-center" v-show="isShow">
            <div class="padding row">
                <div class="col col-33 text-left">
                    <img  class="book-detail-img":src="book.faceUrl">
                </div>
                <div class="col book-detail-items text-left">
                    <h4 class="book-detail-item book-detail-name" v-text="book.name"></h4>
                    <p class="book-detail-item book-detail-author"><strong v-text="book.author"></strong>
                        | <span class="book-detail-category" v-text="book.bookInfo.category"></span>
                    </p>
                    <h3 class="book-detail-item book-detail-updated">更新：{{book.bookInfo.updated}}</h3>
                    <h5 class="book-detail-item book-detail-new">最新章：{{book.bookInfo.lastUpdateChapter}}</h5>
                </div>
            </div>
            <div class="padding row">
                <div class="col">
                    <h4 class="text-left book-detail-ratio">读者留存率：{{book.bookInfo.retentionRatio ? book.bookInfo.retentionRatio + '%' : '未知'}}</h4>
                </div>
            </div>
            <div class="padding row book-detail-btn-group">
                <div class="col col-50">
                    <md-button :class="book.onShelf ? 'button button-energized button-smal' : 'button button-assertive button-smal'"
                    @click.native="addOrDelBook()">
                        {{book.onShelf ? '- 不追了' : '+ 追书'}}
                    </md-button>
                </div>
                <div class="col col-50">
                    <md-button class="button button-dark button-smal"
                               @click.native="startRead()">
                        <i class="icon ion-ios-book-outline"></i>
                        开始阅读
                    </md-button>
                </div>
            </div>
            <div class="padding row">
                <div class="col">
                    <p v-text="book.bookInfo.description" class="book-detail-description"></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import ModalSourceApi from './modals/ModalSourceApi.vue'
    export default {
        created() {
            let _this = this;
            _this.bus.$on('hideModalSource', function () {
                _this.modalSource.hide();
                _this.loadBookDetail();
            });
        },
        mounted() {
            let _this = this;
            _this.loadBookDetail();

            $modal.fromComponent(ModalSourceApi, {
                title: '切换书源',
                theme: 'energized'
            }).then((modal) => {
                _this.modalSource = modal;
            })
        },
        data() {
            return {
                isShow: false,
                book: {
                    id: this.$route.query.bookId,
                    bookIdThird: this.$route.query.bookIdThird,
                    faceUrl: '',
                    bookInfo: {
                    }
                },
                modalSource: undefined
            }
        },
        destroyed() {
            if (this.modalSource)
                $modal.destroy(this.modalSource)
        },
        methods: {
            loadBookDetail() {
                let _this = this;
                $loading.show('读取书籍信息...');

                _this.ajax.post('/detail', {bookId: this.book.id, bookIdThird: this.book.bookIdThird})
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                $loading.hide();
                                _this.isShow = true;
                                _this.book = response.data.data;
                                //传递参数并加载书源信息
                                _this.bus.$emit('bookSourceApi', _this.book)
                                break;
                            default:
                                $loading.hide();
                                $dialog.alert({
                                    content: '错误:' + response.data.message,
                                    okTheme: 'energized'
                                })
                        }
                    }).catch(function (error) {
                    $loading.hide();
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error ),
                        okTheme: 'calm'
                    })
                });
            },
            addOrDelBook() {
                let _this = this;
                $loading.show();
                _this.ajax.post('/addOrDel', {bookIdThird: this.book.bookIdThird})
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                _this.book.onShelf = response.data.data;
                                break;
                            default:
                                $dialog.alert({
                                    content: '错误:' + response.data.message,
                                    okTheme: 'energized'
                                })

                        }
                        $loading.hide();
                    }).catch(function (error) {
                    $loading.hide();
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error ),
                        okTheme: 'calm'
                    })
                });
            },
            startRead() {
                $router.forward({path: '/read', query: {
                    bookId: this.book.id
                }});
            },
            showSourceList() {
                if (this.book.useApi) {
                    this.modalSource.show();
                } else {
                    $toast.show('非接口书籍请到设置中切换书源');
                }
            }
        }
    }
</script>
<style lang="scss">

    .book-detail-img {
        height: 100px;
    }
    .book-detail-items {
        padding-top: 4px;
    }
    .book-detail-item {
        margin-top: 4px;
        margin-bottom: 0px;
    }
    .book-detail-name {
        color: #333333;
        font-size: 14px;
        font-weight:bold;
    }
    .book-detail-author {
        color: #333333;
    }
    .book-detail-category {
        color: #333333;
    }
    .book-detail-updated {
        font-size: 12px;
        color: #333333;
    }
    .book-detail-new {
        font-size: 13px;
        color: #333333;
    }
    .book-detail-ratio {
        color: #525252;
        margin: 0px;
    }
    .book-detail-btn-group .button{
        width: 90%;
        height: 34px;
        min-height: 34px;
        line-height: 34px;
        padding: 0px;
    }
    .book-detail-description {
        color: #333333;
    }
</style>
