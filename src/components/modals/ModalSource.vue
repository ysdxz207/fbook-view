<template>
    <div class="page-content padding-top">

        <list class="" v-for="source in list">
            <item class="item-icon-right" @click.native="changeSource(source)">
                <h2>{{source.name}}&nbsp;<badge num="当前书源" v-if="source.currentSource"></badge></h2>
                <h4>{{source.lastChapter}}</h4>
                <h4 style="font-size: 12px;color: #8d8d8d;">{{source.updated}}</h4>
                <i class="icon ion-ios-arrow-right"></i>
            </item>
        </list>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                book: {},
                list: []
            }
        },
        created() {
            let _this = this;
            _this.bus.$on('bookSource', function (book) {
                _this.book = book;
                _this.loadBookSources();
            })
        },
        mounted() {
        },
        methods: {
            loadBookSources() {
                let _this = this;
                if (_this.list.length > 0) {
                    return;
                }
                _this.ajax.post('/source', {bookIdThird: this.book.bookIdThird})
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                _this.list = response.data.data.list;
                                break;
                            default:
                                $dialog.alert({
                                    content: '[加载书源信息]错误:' + response.data.message,
                                    okTheme: 'energized'
                                })
                        }
                    }).catch(function (error) {
                    $dialog.alert({
                        content: '[加载书源信息]服务器异常:' + JSON.stringify(error ),
                        okTheme: 'calm'
                    })
                });
            },
            changeSource(source) {
                $loading.show('切换中...');
                let _this = this;
                _this.ajax.post('/source/change', {
                    bookIdThird: _this.book.bookIdThird,
                    sourceId: source.id,
                    bookId: _this.book.id
                })
                    .then(function (response) {
                        switch (response.data.statusCode) {
                            case 200:
                                $loading.hide();
                                _this.bus.$emit('hideModalSource');
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
            }
        }
    }
</script>