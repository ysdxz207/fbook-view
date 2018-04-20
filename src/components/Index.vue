<template>
    <div class="page has-navbar" v-nav="{
        title: '我的书架',
        showMenuButton: true,
        menuButtonText: '<i class=\'icon ion-navicon\'></i>',
        onMenuButtonClick: userInfo}">
        <div class="page-content text-center">
            <div class="padding">
                <cells class="cells-books" :items="getItems(16)" :on-cell-click="onCellClick" row="4" col="4"></cells>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                icons: [
                    'ion-android-arrow-up',
                    'ion-android-arrow-down',
                    'ion-android-arrow-back',
                    'ion-android-arrow-forward',

                    'ion-ios-arrow-up',
                    'ion-ios-arrow-down',
                    'ion-ios-arrow-left',
                    'ion-ios-arrow-right',

                    'ion-ios-arrow-thin-up',
                    'ion-ios-arrow-thin-down',
                    'ion-ios-arrow-thin-left',
                    'ion-ios-arrow-thin-right',

                    'ion-android-arrow-up',
                    'ion-android-arrow-down',
                    'ion-android-arrow-back',
                    'ion-android-arrow-forward'
                ]
            }
        },
        methods: {
            onCellClick(cellIndex) {
//                console.log('cell ' + cellIndex + ' clicked');
                $router.forward({ path: '/book' })
            },

            getIcon(iconName, color) {
                return '<i class="' + iconName + '"></i>'
            },

            getItems(n) {
                let items = []
                for (let i = 0; i < n; i++) {
                    items.push(this.getIcon(this.icons[i]))
                }

//                this.ajax({
//                    method: 'post',
//                    url: '/user/12345',
//                    data: {
//                        firstName: 'Fred',
//                        lastName: 'Flintstone'
//                    }
//                });
                return items
            },
            userInfo() {

            }
        }
    }
</script>
<style lang="scss">
    .page.has-navbar .page-content {
        padding-top: 38px;
    }

    .cells.cells-books> .row > .col {
        height: 98px;
        padding: 10px 0;
        border: 4px solid #f5f5f5;
    }
</style>
