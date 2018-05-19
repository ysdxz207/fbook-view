<template>
  <div class="page has-navbar" v-nav="{ title: '搜索书籍', showBackButton: true }">
    <div class="page-content">

      <search v-model="search.keywords" placeholder="输入关键字" :on-search="onSearch" :on-cancel="onCancel" cancelText="取消"></search>

      <div v-for="book in search.bookList">
        <router-link :to="{path:'/book',query: {bookId: book.id, bookIdThird: book.bookIdThird}}" class="link">
        <item class="item-icon-left row search-book-list-item">
          <div class="col col-25">
            <img  class="search-book-img":src="book.faceUrl">
          </div>
          <div class="col search-book-items">
            <p class="search-book-name">{{book.name}}|{{book.bookInfo.category}}</p>
            <h3 class="search-book-author">作者：{{book.author}}</h3>
            <h5 class="search-book-ratio">读者留存率：{{book.bookInfo.retentionRatio > 0 ? book.bookInfo.retentionRatio + '%' : '未知'}}</h5>
          </div>
        </item>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                search: {
                    keywords: '',
                    searching: false,
                    bookList: []
                }
            }
        },
        mounted() {
            let _this = this;
            //缓存
            let searchList = $storage.get("search_list");
            let keywords = $storage.get("search_keywords");

            if (searchList) {
                _this.search.bookList = JSON.parse(searchList);
            }
            if (keywords) {
                _this.search.keywords = keywords;
            }
          },
        methods: {
            onSearch() {
                $loading.show('搜索中...');
                let _this = this;
                _this.ajax.post('/search', {keywords: this.search.keywords})
                    .then(function (response) {
                        $loading.hide();
                        switch (response.data.statusCode) {
                            case 200:
                                _this.search.bookList = response.data.list;
                                $storage.set("search_list", JSON.stringify(_this.search.bookList));
                                $storage.set("search_keywords",_this.search.keywords);
                                break;
                            default:
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
            onCancel() {
                this.keywords = '';
                this.search.bookList = [];
            }
        }
    }
</script>

<style lang="scss">
  .search-book-img {
    height: 72px;
  }
  .search-book-items {
    display: block;
    float: left;
  }
  .search-book-list-item p {
    font-size: 16px;
    line-height: 30px;
  }
  .search-book-name {
    color: #777777;
    overflow: hidden;
    font-size: 16px;
  }
  .search-book-author {
    color: #999988;
  }
  .search-book-ratio {
    color: #888888;
  }
  .link {
    text-decoration: none;
  }
</style>