<template>
  <div class="page">
    <div v-text="book.bookId"></div>
    <div class="page-content text-center" v-html="chapter.content">

    </div>
  </div>
</template>

<script>
    export default {

        mounted() {
            this.loadChapter();
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
                },
                chapter: {}
            }
        },
        methods: {
            loadChapter() {
                let _this = this;

                _this.ajax({
                    method: 'post',
                    url: '/chapter',
                    data: {
                        bookId: _this.book.bookId
                    }

                }).then(function (response) {
                    switch (response.data.statusCode) {
                        case 200:
                            _this.chapter = response.data.data.chapter
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
