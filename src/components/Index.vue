<template>
    <div class="page has-navbar" v-nav="{
        title: '我的书架',
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-person\'></i>',
        onMenuButtonClick: userInfo}">
        <div class="page-content text-center">
            <div class="padding">
                <router-link :to="{path:'/book',params: {bookId:' + bookId + '}}" class="cells-books" v-for="book in books">
                    <img :src="book.faceUrl" class="book-img"/>
                    <div class="book-title">{{book.name}}</div>
                </router-link>
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

                _this.ajax.post('/', this.user)
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                $loading.hide();
                                _this.books = response.data.list;
                                break;
                            default:
                                $toast.show(response.data.message)
                        }
                    }).catch(function (error) {
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error ),
                        okTheme: 'calm'
                    })
                });
                return [];
            },
            userInfo() {
                $router.forward({path: '/user'})
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
</style>
