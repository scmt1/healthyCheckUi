<style lang="less">
    .empty-com {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-top: 15px;

        img {
            user-select: none;
        }

        span {
            color: #C1C1C1;
            font-size: 15px;
            user-select: none;
        }
    }
</style>
<template>
    <div class="empty-com">
        <img src="@/assets/empty.png" :style="{'width':width+'px','height':height+'px'}">
        <span>暂无数据</span>
    </div>
</template>
<script>
    export default {
        props: {
            width: {
                type: String,
                default: '100'
            },
            height: {
                type: String,
                default: '100'
            }
        }
    }
</script>
