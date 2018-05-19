<template>
    <div class="page has-navbar" v-nav="{
        title: '我的书架',
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-person\'></i>',
        onMenuButtonClick: userInfo}">
        <div class="page-content text-center">
            <div v-for="book in books">
                <router-link :to="{path:'/book',query: {bookId: book.id, bookIdThird: book.bookIdThird}}" class="cells-books">
                    <img :src="book.faceUrl" class="book-img"/>
                    <div class="book-title">{{book.name}}</div>
                </router-link>
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
                books: []
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
                                _this.books = response.data.list;
                                break;
                            default:
                                $toast.show(response.data.message)
                                if (response.data.errorCode == 'LOGIN_WRONG_PASSWORD') {
                                    $storage.get('isLogin');
                                    $router.forward({path: '/login'});
                                }
                        }
                    }).catch(function (error) {
                        $loading.hide();
                        $dialog.alert({
                            content: '服务器异常:' + JSON.stringify(error ),
                            okTheme: 'calm'
                        })
                });
                return [];
            },
            userInfo() {
                $router.forward({path: '/user'})
            },
            goSearch() {
                if ($storage.get("search_list")) {
                    $storage.remove("search_list");
                }
                if ($storage.get("search_keywords")) {
                    $storage.remove("search_keywords");
                }
                $router.forward({path: '/search'});
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
