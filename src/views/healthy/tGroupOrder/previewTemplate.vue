<template>

    <Modal v-model="show" class="previewOrderTemplate" :fullscreen="isFullscreen" :mask-closable="false">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;    cursor: pointer;">
            <p>合同预览</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <iframe id="printPdf" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%;min-height: 55vh;"
                class="pdfTemplate"></iframe>

        <!--    <div class="pdfTemplate">-->
        <!--      <pdf ref="pdf" id="printPdf" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i"></pdf>-->
        <!--    </div>-->
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <!--      <Button type="primary" :loading="loading" @click="print()">打印</Button>-->
            <Button type="primary" :loading="btnLoading" @click="downloadTemplateWord()">下载</Button>
        </div>
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <!-- 这里用的是阿里图标库 -->
                <i class="iconfont icon-loader--line"></i>
            </div>
            <!-- <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon> -->
            <div style='font-size:16px'>Loading...</div>
        </Spin>
    </Modal>
</template>

<script>
    import {getTemplatePreviewData,exportWord,getEntrustData} from '@/api/healthy/tTemplate'
    import pdf from 'vue-pdf'
    import {formartDate} from "../../../api/tools/tool";
    export default {
        name: "checkStationPreviewTemplate",
        components: {
            pdf
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            TTemplateId: {
                type: String
            },
            groupOrderInfo: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                show: this.value,
                previewHtml: "",//预览显示
                previewHtmlUrl: "",
                numPages: null, // pdf 总页数
                loading: false,
                printName: '转图片打印',
                btnLoading:false,
                isFullscreen: false,
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.previewHtmlUrl = "";

                //获取委托协议相关数据(检查的单位、订单、人员、项目信息)
                getEntrustData({id: this.groupOrderInfo.id}).then(resp => {
                    if(resp && resp.success){
                        let unitData = resp.data.unitData;//单位信息
                        let orderData = resp.data.orderData;//订单信息
                        let personData = resp.data.personData;//人员信息
                        let goods = resp.data.goods;//检查项目信息
                        if(goods && goods.length > 0){
                            let goodsNew = [];
                            for(let i = 0;i < goods.length;i ++){
                                let name = goods[i].name;
                                if(name){
                                    name = name.split("[");
                                }
                                goodsNew.push({
                                    number: i+1,
                                    workTypeText: name[1].replace("]",""),
                                    hazardFactorsText: name[0],
                                    projects: goods[i].projects,
                                    prices: goods[i].prices,
                                })
                            }
                            goods = goodsNew;
                        }else{
                            goods = [];
                            goods.push({
                                number: '-',
                                workTypeText: '-',
                                hazardFactorsText: '-',
                                projects: '-',
                                prices: '-',
                            })
                        }
                        if(personData && personData.length > 0){
                            let personDataNew = [];
                            for(let i = 0;i < personData.length;i ++){
                                let workYear = personData[i].workYear;
                                let workMonth = personData[i].workMonth;
                                if(workYear && workYear > 0){
                                    workYear = workYear + "年";
                                    if(workMonth && workMonth > 0){
                                        workYear = workYear + workMonth + "月";
                                    }
                                }else{
                                    if(workMonth && workMonth > 0){
                                        workYear = workYear + workMonth + "月";
                                    }else{
                                        workYear = 0;
                                    }
                                }//
                                let workExYear = personData[i].exposureWorkYear;
                                let workExMonth = personData[i].exposureWorkMonth;
                                /*if(workExYear && workExYear > 0){
                                    workExYear = workExYear + "年";
                                    if(workExMonth && workExMonth > 0){
                                        workExYear = workExYear + workExMonth + "月";
                                    }
                                }else{
                                    if(workExMonth && workExMonth > 0){
                                        workExYear = workExYear + workExMonth + "月";
                                    }else{
                                        workExYear = 0;
                                    }
                                }*/
                                let workTypeText = "";
                                if(personData[i].workTypeText){
                                    if(personData[i].workTypeText!="其他"){
                                        workTypeText = personData[i].workTypeText;
                                    }else{
                                        workTypeText = personData[i].workName;
                                    }
                                }
                                personDataNew.push({
                                    number: i+1,
                                    personName: personData[i].personName,
                                    sex: personData[i].sex,
                                    age: personData[i].age,
                                    idCard: personData[i].idCard,
                                    workYear: workYear,
                                    hazardFactorsText: personData[i].hazardFactorsText,
                                    workStateText: personData[i].workStateText,
                                    workTypeText: workTypeText,
                                    depart: personData[i].depart ? personData[i].depart : '-',
                                    measures: personData[i].measures ? personData[i].measures : '-',
                                    mobile: personData[i].mobile,
                                    workExYear: workExYear,
                                })
                            }
                            personData = personDataNew;
                        }else{
                            personData = [];
                            personData.push({
                                number: '-',
                                personName: '-',
                                sex: '-',
                                age: '-',
                                idCard: '-',
                                workYear: '-',
                                hazardFactorsText: '-',
                                workStateText: '-',
                                workTypeText: '-',
                                depart: '-',
                                measures: '-',
                                mobile: '-',
                                workExYear: '-',
                            })
                        }

                        this.groupOrderInfo = orderData;
                        this.groupOrderInfo.personData = personData;
                        this.groupOrderInfo.goods = goods;
                        this.groupOrderInfo.unitAddress = unitData.address;//单位注册地址
                        this.groupOrderInfo.uscc = unitData.uscc;//机构代码
                        this.groupOrderInfo.legalPersonUnit = unitData.legalPerson;//法人代表
                        this.groupOrderInfo.linkMan2 = unitData.linkMan2;//体检联系人
                        this.groupOrderInfo.linkPhone2 = unitData.linkPhone2;//体检联系人电话
                        this.groupOrderInfo.postalCode = unitData.postalCode;//邮编
                        this.groupOrderInfo.economicTypeCode = unitData.economicTypeCode;//经济类型编码
                        this.groupOrderInfo.businessScaleName = unitData.businessScaleName;//企业规模
                        this.groupOrderInfo.industryName = unitData.industryName;//行业类型
                        this.groupOrderInfo.employeesNum = unitData.employeesNum;//职工总人数
                        this.groupOrderInfo.workmanNum = unitData.workmanNum;//生产总人数
                        this.groupOrderInfo.dangerNum = unitData.dangerNum;//接触职业病因素人数
                        this.groupOrderInfo.workmistressNum = unitData.workmistressNum;//接触职业病因素女性人数
                        this.groupOrderInfo.yearNow = formartDate(new Date(), "yyyy");//当前年份
                        this.groupOrderInfo.economicTypeName = unitData.economicTypeName;//经济类型

                        this.groupOrderInfo.signingTime = formartDate(this.groupOrderInfo.signingTime, "yyyy年MM月dd日")
                        this.groupOrderInfo.deliveryTime = formartDate(this.groupOrderInfo.deliveryTime, "yyyy年MM月dd日")

                        //医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
                        this.groupOrderInfo.hospitalAddress = this.$hospitalName.hospitalAddress;
                        this.groupOrderInfo.zipCode = this.$hospitalName.zipCode;
                        this.groupOrderInfo.hospitalPhone = this.$hospitalName.hospitalPhone;
                        this.groupOrderInfo.faxNumber = this.$hospitalName.faxNumber;
                        this.groupOrderInfo.email = this.$hospitalName.email;
                        //委托单位
                        this.groupOrderInfo.entrustUnit = this.$hospitalName.name;
                        //市区
                        this.groupOrderInfo.city = this.$hospitalName.city;
                        //乙方合同信息(法人、开户银行、账号、纳税识别号)
                        this.groupOrderInfo.legalPerson = this.$hospitalName.legalPerson;
                        this.groupOrderInfo.bankAddress = this.$hospitalName.bankAddress;
                        this.groupOrderInfo.bankCount = this.$hospitalName.bankCount;
                        this.groupOrderInfo.taxNumber = this.$hospitalName.taxNumber;
                        let sections = [];
                        //页头图片展示
                        if(this.$hospitalName.isShowIcon){
                            sections.push({
                                isShowIcon: "展示",
                            });
                        }
                        this.groupOrderInfo.sections = sections;
                    }else{
                        this.$Message.error('委托信息查询失败');
                        this.closeModal();
                    }

                    getTemplatePreviewData({id: "8ed9516bb5469e6431ec9da14494ddf9", templateData: JSON.stringify(this.groupOrderInfo)}).then(res => {
                        this.loading = false;
                        if (res && res.success) {
                            this.previewHtml = res.data.replace("template", "div");
                            let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                            this.previewHtmlUrl = url;
                        } else {
                            this.$Message.error('预览请求失败');
                            this.closeModal();
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                })
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            //word下载
            downloadTemplateWord() {
                let _this = this;
                _this.btnLoading = true;
                let url = "";
                let name = "";
                url = _this.previewHtmlUrl;//合同模板
                name = "委托协议";
                let fileName = _this.groupOrderInfo.entrustUnit+ "_"+name+".docx";
                exportWord({url: url}).then(res => {
                    let content = res;
                    let blob = new Blob([content], {type: 'application/ms-excel'});
                    _this.btnLoading = false;
                    if ('download' in document.createElement('a')) { // 非IE下载
                        let elink = document.createElement('a');
                        elink.download = fileName;
                        elink.style.display = 'none';
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink);
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName);
                    }
                }).catch(function (error) {
                    _this.$Message.error('数据导出失败');
                });

            },
            //全屏
            changeFull() {
                this.isFullscreen = !this.isFullscreen;
                let height = document.documentElement.clientHeight;
                let element = document.querySelector(".previewOrderTemplate").querySelector(".ivu-modal-body");
                if (this.isFullscreen) {
                    element.style.height = (height - 140) + "px";
                } else {
                    element.style.height = (height - 300) + "px";
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                if (val) {
                    this.init();
                } else {
                    this.closeModal(false)
                }
            }
        }
    }
</script>

<style lang="less">
    .previewOrderTemplate {
        position: relative;
        width: 100%;
        height: 100%;

        .ivu-modal {
            min-width: 60vw ;
        }

        .ivu-modal-body {
            /*height: 70vh;*/
            /*overflow-y: auto;*/
            position: relative;
            background-color: #e8eaec;
        }
        .ivu-tabs .ivu-tabs-content-animated {
            display: flex;
            flex-direction: row;
            will-change: transform;
            transition: transform .3s ease-in-out;
            height: 100%;
        }
        .ivu-modal-fullscreen .ivu-modal-body {
            width: 100%;
            /*height: 89vh;*/
            min-height: 55vh;
            overflow: auto;
            overflow-y: hidden;
            position: absolute;
            top: 53px;
            bottom: 57px;
        }

        .pdfTemplate {
            span {
                margin-bottom: 10px;
            }

            ::-webkit-scrollbar {
                width: 6px;
                background-color: #d8d8d8;
            }

            /* 滚动槽 */

            ::-webkit-scrollbar-track {
                border-radius: 10px;
            }

            ::-webkit-scrollbar-thumb {
                background-color: #bfc1c4;
            }
        }

        /* 旋转效果 */

        .demo-spin-icon-load {
            animation: ani-demo-spin 1s linear infinite;
        }

        @keyframes ani-demo-spin {
            from {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(180deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        /* 遮罩 */
        /* 假如内容过长，一屏放不下，滚动条下拉覆盖不全 */

        .ivu-spin-fix {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 8;
            width: 100%;
            height: 100%;
            background-color: hsla(0, 0%, 100%, .8);
        }
    }
</style>