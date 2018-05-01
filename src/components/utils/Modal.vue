<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <transition v-bind:name="options.transition">
    <div class="modal" v-show="showModal">
        <div class="modal-header">
            <div class="left-button icon" v-bind:class="options.leftIcon" @click="closeModal()"></div>
            <div class="modal-title" v-text="options.title"></div>
            <div class="right-button icon" v-bind:class="options.rightIcon" @click="customRightButton()"></div>
        </div>
        <div class="modal-body">
            <v-modal-body ref="v-modalBody"></v-modal-body>
        </div>
    </div>
    </transition>
</template>

<script>

    let ModalBodyComponent = undefined;
    export default {
        name: 'modal',
        props: {
            modalOptions: Object
        },
        components: {
            'v-modal-body': ModalBodyComponent
        },
        created() {
            let _this = this;
            _this.$on('show', function () {
                _this.showModal = true;
            });
            //创建内容组件
            ModalBodyComponent = Vue.extend(this.options.modalBodyFromTemplate);
        },
        mounted() {
            this.options = Vue.util.extend(this.options, this.modalOptions)
        },
        data() {
            return {
                showModal: false,
                ModalBodyComponent: undefined,
                options: {
                    transition: 'slide-left',
                    title: '',
                    leftIcon: 'ion-ios-arrow-back',
                    rightIcon: 'ion-navicon-round',
                    rightBtnCallback: undefined,
                    modalBodyFromTemplate: undefined
                }
            }
        },
        methods: {
            closeModal() {
                this.showModal = false;
            },
            customRightButton() {
                if (this.options.rightBtnCallback) {
                    this.options.rightBtnCallback()
                } else {
                    console.log('default right btn click')
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    /* slide right*/
    .slide-right-enter-active{
        transform: translateX(0);
        transition: all .4s;
    }
    .slide-right-leave-active {
        transition: all .4s;
    }

    .slide-right-enter, .slide-right-leave-to {
        transform: translateX(-100%)
    }
    /* slide left*/
    .slide-left-enter-active{
        transition: all .4s;
        transform: translateX(0);
    }

    .slide-left-leave-active {
        transform: translateX(-100%);
        transition: all .4s;
    }

    .slide-left-enter, .slide-left-leave-to {
        transform: translateX(100%)
    }

    .modal {
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 100;
    }
    .modal-header {
        height: 44px;
        width: 100%;
        border-bottom: 1px solid #DDDDDD;
        text-align: center;
        line-height: 44px;
        font-size: 17px;
        font-weight: bold;
        position: fixed;
        top: 0px;
        left: 0px;
        box-shadow: 0 0 10px rgba(0,0,0,.15);
        z-index: 2;
    }

    .left-button {
        position: fixed;
        left: 0px;
        padding-left: 8px;
        width: 44px;
        font-size: 32px;
        top: 0px;
    }
    .right-button {
        position: fixed;
        right: 0px;
        padding-right: 8px;
        width: 44px;
        font-size: 32px;
        top: 0px;
    }
</style>