<template>
    <div class="page has-navbar" v-nav="{
        title: '我的书架',
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-person\'></i>',
        onMenuButtonClick: userInfo}">
        <div class="page-content text-center">
            <div v-for="book in bookList" class="cells-books" @click="goBookDetail(book)">
                <img :src="book.faceUrl" class="book-img"/>
                <div class="book-title"
                     :style="(book.useApi == bookReadSetting.useApi) ? 'color:#ff9407' : 'color: #ddd'">
                    {{book.name}}
                </div>
            </div>

            <div class="btn-add-book-group">
                <md-button @click.native="goSearch()" class="button button-energized button-fab btn-add-book">
                    <i class="icon ion-plus-round"></i>
                </md-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        mounted() {
            this.loadBooks();
        },
        data() {
            return {
                bookList: [],
                bookReadSetting: {}
            }
        },
        methods: {
            loadBooks() {
                let _this = this;
                $loading.show('读取书架信息...');

                _this.ajax.get('/')
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                $loading.hide();
                                _this.bookList = response.data.data.bookList;
                                _this.bookReadSetting = response.data.data.bookReadSetting;
                                break;
                            default:
                                $toast.show(response.data.message)
                                if (response.data.errorCode == 'LOGIN_WRONG_PASSWORD') {
                                    localStorage.getItem('isLogin');
                                    $router.forward({path: '/login'});
                                }
                        }
                    }).catch(function (error) {
                    $loading.hide();
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error),
                        okTheme: 'calm'
                    })
                });
                return [];
            },
            userInfo() {
                $router.forward({path: '/user'})
            },
            goSearch() {
                if (localStorage.getItem("search_list")) {
                    localStorage.removeItem("search_list");
                }
                if (localStorage.getItem("search_keywords")) {
                    localStorage.removeItem("search_keywords");
                }
                $router.forward({path: '/search'});
            },
            goBookDetail(book) {

                let canRead = book.useApi == this.bookReadSetting.useApi;

                if (!canRead) {
                    let msg = book.useApi ? '[接口书籍]请将设置中使用接口源打开' : '[非接口书籍]请将设置中使用接口源关闭';
                    $dialog.alert({
                        content: msg,
                        okTheme: 'energized'
                    });
                    return;
                }


                $router.forward({
                    path: '/book', query: {
                        bookId: book.id,
                        bookIdThird: book.bookIdThird
                    }
                });
            }
        }
    }
</script>
<style lang="scss">

    .page.has-navbar .page-content {
        padding-top: 38px;
    }

    .cells-books {
        font-size: 12px;
        width: 30%;
        height: 110px;
        padding-top: 8px;
        float: left;
        text-decoration: none;
        color: #525252;
    }

    .cells-books .book-img {
        height: 86px;
    }

    .cells-books .book-title {
        position: relative;
        bottom: 6px;
    }

    .btn-add-book-group {
        position: fixed;
        bottom: 50px;
        text-align: center;
        width: 100%;
    }

    .btn-add-book {
        margin: 0 auto;
    }
</style>
