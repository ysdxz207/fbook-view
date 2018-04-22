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
            <div class="padding">
                <img :src="book.faceUrl" class="book-detail-img">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        mounted() {
            this.loadBookDetail()
        },
        data() {
            return {
                book: {
                    bookId: this.$route.query.bookId,
                    aId: this.$route.query.aId,
                    faceUrl: ''
                }
            }
        },
        methods: {
            loadBookDetail() {
                let _this = this;
                $loading.show('读取书籍信息...');

                _this.ajax.post('/detail', this.book)
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
            }
        }
    }
</script>
<style lang="scss">

    .book-detail-img {

    }
</style>
