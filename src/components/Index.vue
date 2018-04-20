<template>
    <div class="page has-navbar" v-nav="{ title: 'Home' }">
        <div class="page-content text-center">
            <div class="padding">
                <cells class="cells-44" :items="getItems(16)" :on-cell-click="onCellClick" row="4" col="4"></cells>
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
                    'ion-android-arrow-forward',
                ]
            }
        },
        methods: {
            onCellClick(cellIndex) {
                console.log('cell ' + cellIndex + ' clicked');
                $router.
            },

            getIcon(iconName, color) {
                return '<i class="' + iconName + '"></i>'
            },

            getItems(n) {
                let items = []
                for (let i = 0; i < n; i++) {
                    items.push(this.getIcon(this.icons[i]))
                }
                return items
            }
        }
    }
</script>
<style lang="scss">
    .page.has-navbar .page-content {
        padding-top: 38px;
    }

    .cells.cells-44 > .row > .col {
        height: 94px;
        padding: 10px 0;
        border: 4px solid #f5f5f5;
    }
</style>
