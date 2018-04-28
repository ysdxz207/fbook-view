<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="page" v-nav="{hideNavbar: true}">
        <div v-text="data.book.bookId"></div>
        <div class="page-content">
            <p class="title" v-text="data.chapter.title" v-bind:style="readConfig.readTitleStyle"></p>
            <div class="text-center read-content"
                 v-bind:style="readConfig.readContentStyle"
                 v-html="data.chapter.content"
                @click="toggleMenu()">

            </div>
        </div>
        <v-menu v-show="menus.menuMain" :menu-option="menuOption" ref="menu"></v-menu>

    </div>
</template>

<script>
    import menu from './menus/Menu.vue';

    export default {
        components: {
            'v-menu': menu
        },
        mounted() {
            this.loadChapter();

        },
        data() {
            return {
                data: {
                    book: {
                        bookId: this.$route.query.bookId,
                        chapterName: '',
                        chapter: 1,
                        content: '',
                        bookInfo: {}
                    },
                    chapter: {},
                    bookRead: {},
                    bookReadSetting: {},
                    bookChapters: []
                },
                readConfig: {
                    readTitleStyle: {
                        fontSize: '14px',
                        paddingLeft: '8px',
                        backgroundColor: '#6d816f',
                        margin: '0px'
                    },
                    readContentStyle: {
                        fontSize: '20px',
                        lineHeight: '24px',
                        backgroundColor: '#6d816f',
                        padding: '0px'
                    }
                },
                menus: {
                    menuMain: false
                }
            }
        },
        methods: {
            loadChapter() {
                let _this = this;
                $loading.show('加载中...');


                _this.ajax({
                    method: 'post',
                    url: '/chapter',
                    data: {
                        bookId: _this.data.book.bookId
                    }

                }).then(function (response) {
                    $loading.hide();
                    switch (response.data.statusCode) {
                        case 200:
                            let data = response.data.data;
                            _this.data = data;
                            break;
                        case 300:

                        default:
                            $toast.show(response.data.message)
                    }

                }).catch(function (error) {
                    $loading.hide();

                    $dialog.alert({
                        content: '服务器异常:' + JSON.stringify(error),
                        okTheme: 'calm'
                    })
                });
            },
            refreshConfig() {

            },
            toggleMenu() {
                console.log('toggle menu');
                this.menus.menuMain = !this.menus.menuMain;
            }
        }
    }
</script>
<style lang="scss">

</style>
