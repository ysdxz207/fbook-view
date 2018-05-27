<template>
    <div class="page-content">
        <von-radio :options="bookSourceListPickNames" v-model="index"></von-radio>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                index: 0,
                bookSourceListPickNames: [],
                bookReadSetting: {},
                bookSourceListPick: []

            }
        },
        created() {
            let _this = this;
            _this.bus.$on('bookSourcePick', function (bookReadSetting,
                                                      bookSourceListPick) {
                _this.bookSourceListPickNames = [];
                _this.bookReadSetting = bookReadSetting;
                _this.bookSourceListPick = bookSourceListPick;
                bookSourceListPick.forEach(function (source, index) {
                    _this.bookSourceListPickNames.push(source.name);
                    if (source.currentSource) {
                        _this.index = index;
                    }
                });

                //首次加载不触发保存是否使用接口
                _this.$watch('index', {
                    deep: true,
                    handler: function () {
                        _this.bookReadSetting.searchSource = bookSourceListPick[_this.index].source;
                        _this.saveReadSetting(_this.bookReadSetting, function () {
                        });
                    }
                });
            })
        }
    }
</script>