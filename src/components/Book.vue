<template>
    <div class="page has-navbar" v-nav="{
        title: '书籍详情',
        showBackButton: true,
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-gear-b\'></i>',
        onMenuButtonClick: function() {
            $router.forward({path:'/source'})
        }
        }">
        <div class="page-content text-center">
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
                    <h5 class="book-detail-item book-detail-new">最新章：{{book.lastUpdateChapter}}</h5>
                </div>
            </div>
            <div class="padding row">
                <div class="col">
                    <h4 class="text-left book-detail-ratio">读者留存率：{{book.bookInfo.retentionRatio ? book.bookInfo.retentionRatio : 0}}%</h4>
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
    export default {
        mounted() {
            this.loadBookDetail();
        },
        data() {
            return {
                book: {
                    bookId: this.$route.query.bookId,
                    aId: this.$route.query.aId,
                    faceUrl: '',
                    bookInfo: {
                    }
                }
            }
        },
        methods: {
            loadBookDetail() {
                let _this = this;
                $loading.show('读取书籍信息...');

                _this.ajax.post('/detail', {bookId: this.book.bookId, aId: this.book.aId})
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                $loading.hide();
                                _this.book = response.data.data;
                                break;
                            default:
                                $toast.show(response.data.message)
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
                $loading.show()
                _this.ajax.post('/addOrDel', {aId: this.book.aId})
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                $loading.hide();
                                _this.book.onShelf = response.data.data;
                                break;
                            default:
                                $toast.show(response.data.message)
                        }
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
                    bookId: this.$route.query.bookId
                }});
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
