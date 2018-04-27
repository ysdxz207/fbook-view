<template>
  <div class="page">
    <div v-text="book.bookId"></div>
    <div class="page-content text-center" v-text="book.content">

    </div>
  </div>
</template>

<script>
    export default {

        mounted() {
            this.chapter();
        },
        data() {
            return {
                book: {
                    bookId: this.$route.query.bookId,
                    chapterName: '',
                    chapter: 1,
                    content: '',
                    bookInfo: {
                    }
                }
            }
        },
        methods: {
            chapter() {
                let _this = this;
                _this.ajax.post('/chapter', this.book)
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                this.book = response.data.book
                                break;
                            case 300:

                            default:
                                $toast.show(response.data.message)
                        }
                    }).catch(function (error) {
                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error),
                        okTheme: 'calm'
                    })
                });
            }
        }
    }
</script>
<style lang="scss">

</style>
