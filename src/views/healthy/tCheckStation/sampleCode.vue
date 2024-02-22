<template>
    <Modal v-model="show" title="样本条码" :mask-closable="false" :draggable="false" class="review" width="900">
        <div style="margin-top: 20px;max-height: 68vh; overflow-y: auto;" v-if="barcodeList.length > 0">
            <img :src="item" v-for="(item, index) in barcodeList" :key="index">
        </div>
        <no-data v-else></no-data>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div slot="footer">
            <Button type="default" @click="show=false">取消</Button>
        </div>
    </Modal>
</template>

<script>
    import {getAllGeneratorBarcode} from "../../../api/healthy/tGroupPerson";
    import noData from "@/components/no-data";

    export default {
        name: "sampleCode",
        components:{
            noData
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            data: {
                type: Array,
                default: []
            },
            personInfo: {
                type: Object
            },
        },
        data(){
            return{
                show: this.value,//是否显示
                barcodeList: [],
                spinShow: false,
            }
        },
        methods:{
            //获取样本条码
            generatorCode() {
                this.spinShow = true;
                getAllGeneratorBarcode({personId: this.personInfo.id, testNum: this.personInfo.testNum??this.personInfo.test_num}).then(res => {
                    if (res.success) {
                        this.barcodeList = res.data;
                    }
                }).finally(() => {
                    this.spinShow = false;
                });
            },
            //关闭弹框
            closeModal(val) {
                this.$emit('input', val);
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.barcodeList = [];

                if (!val) {
                    this.closeModal(val);
                }
                else{
					//获取样本条码
					this.generatorCode();
                }
            }
        }
    }
</script>

<style scoped>

</style>
