<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        computed: {
            mainTheme() {
                return this.$store.state.theme.theme.mainTheme;
            },
        },
        mounted() {
            this.changeMode();
        },
        beforeDestroy() {
        },
        methods: {
            changeMode() {
                let v = this.mainTheme;
                if (v == "darkMode") {
                    document.getElementsByTagName("body")[0].className = "darkMode";
                } else if (v == "weakMode") {
                    document.getElementsByTagName("body")[0].className = "weakMode";
                } else {
                    document.getElementsByTagName("body")[0].className = "";
                }
            },
        },
        watch: {
            mainTheme() {
                this.changeMode();
            },
        },
    };
</script>

<style lang="less">
    html,
    body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }

    .app-main {
        width: 100%;
        height: 100%;
    }

    .br button {
        margin-right: 8px;
    }

    .operation button {
        margin-right: 8px;
    }

    .operation .brr button {
        margin-right: 0px !important;
    }

    .ivu-btn-text:focus {
        box-shadow: none !important;
    }

    .ivu-tag {
        cursor: pointer;
    }

    .block-tool .ivu-tooltip,
    .block-tool .ivu-tooltip-rel {
        display: block;
    }

    .block-pop .ivu-poptip,
    .block-pop .ivu-poptip-rel {
        display: block;
    }

    .form-noheight {
        .ivu-form-item-content {
            line-height: unset !important;
        }
    }

    .modal-fullscreen {
        z-index: 1;
        position: absolute;
        right: 43px;
        top: 14px;
        overflow: hidden;
        cursor: pointer;

        .model-fullscreen-icon {
            font-size: 18px;
            color: #999;
            -webkit-transition: color 0.2s ease;
            transition: color 0.2s ease;
            position: relative;
            top: 1px;

            &:hover {
                color: #444;
            }
        }
    }

    .viewer-container {
        z-index: 2147483647 !important;
    }

    // 修改drawer层级 避免固定nav时遮挡
    .ivu-drawer-mask,
    .ivu-drawer-wrap {
        z-index: 1002;
    }

    .ivu-drawer-wrap-1 {
        z-index: 1003;
    }

    .ivu-drawer-wrap-2 {
        z-index: 1004;
    }

    // 修改Message层级
    .ivu-message {
        z-index: 9999 !important;
    }

    // 修改Menu层级
    .ivu-menu {
        z-index: 0;
    }

    // 暗黑
    .darkMode {
        filter: invert(1) hue-rotate(180deg);
        transition: all 300ms;

        img,
        video {
            filter: invert(1) hue-rotate(180deg);
        }
    }

    // 色弱
    .weakMode {
        touch-action: none;
        filter: invert(80%);
    }

    /*Alert框*/
    .alert {
        height: 25px;
        line-height: 25px;
        padding: 8px 0;
        box-sizing: content-box;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        margin-bottom: 0 !important;
    }

    //ul 去除默认样式
    .oUl {
        display: flex;
        list-style: none;
        padding: 0;
    }

    .ivu-table td, .ivu-table th {
        height: 34px !important;
    }

    .ivu-table-summary {
        font-weight: 600;
    }
</style>
