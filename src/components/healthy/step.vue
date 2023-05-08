<style lang="less">
    .step {

        ul {
            list-style: none;
            display: flex;
            padding: 0;
            margin: 0;

            li {
                position: relative;
                width: 100px;
                height: 30px;
                margin-right: -10px;

                span {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    white-space: nowrap;
                    color: #fff;
                    font-size: 13px;
                    font-weight: 600;
                }
            }
        }
    }
</style>
<template>
    <div class="step">
        <ul>
            <li v-for="(item,index) in data" :key="index">
                <div v-if="index == 0">
                    <img src="../../assets/images/healthy/start_check.png" v-if="type>0">
                    <img src="../../assets/images/healthy/start_nomal.png" v-else>
                </div>
                <div v-if="index>0 && index <data.length-1">
                    <img src="../../assets/images/healthy/mid_check.png" v-if="type > 1  && index < type">
                    <img src="../../assets/images/healthy/mid_nomal.png" v-else>
                </div>
                <div v-if="index == data.length-1">
                    <img src="../../assets/images/healthy/end_check.png" v-if="type == data.length">
                    <img src="../../assets/images/healthy/end_nomal.png" v-else>
                </div>
                <span>{{item}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: {
            index: {
                type: Number,
                default: 0
            },
            arr: {
                type: Array,
                default:()=>{
                    return ['登记', '在检', '总检','已完成']
                }
            }
        },
        data() {
            return {
                data: this.arr,
                type: this.index
            }
        },
        watch: {
            index(val) {
                this.type = val;
            },
        }
    }
</script>
