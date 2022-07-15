<template>

    <Modal v-model="show" title="预览" class="previewTemplate" :mask-closable="false" :fullscreen="isFullscreen">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;cursor: pointer;">
            <p>模板预览</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <iframe id="printPdf" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"
                class="pdfTemplate"></iframe>

        <!--    <div class="pdfTemplate">-->
        <!--      <pdf ref="pdf" id="printPdf" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i"></pdf>-->
        <!--    </div>-->
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <!--      <Button type="primary" :loading="loading" @click="print()">打印</Button>-->
            <!--      <Button type="primary" :loading="loading" @click="downloadTemplate()">下载</Button>-->
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
    import {exportTemplate, getTemplatePreviewData} from '@/api/healthy/tTemplate'
    import {formartDate} from "@/api/tools/tool";
    import {queryTReviewRecordList,queryTReviewRecordAll} from "../../../api/healthy/tReviewRecord"
    import pdf from 'vue-pdf'
    import html2canvas from 'html2canvas'
    import printJS from 'print-js'
    import {queryAllTDepartItemResultList} from "../../../api/healthy/tDepartItemResult";
    import {getTInspectionRecordByPersonId} from "../../../api/healthy/tInspectionRecord";
    import {getTGroupPersonWithLink, queryTPastMedicalHistoryList} from "../../../api/healthy/tGroupPerson";
    import {queryTDepartResultList} from "../../../api/healthy/tDepartResult";

    export default {
        name: "previewTemplate",
        components: {
            pdf
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            TTemplateId: {
                type: Object,
                default: {}
            },
            data: {
                type: Object
            },
            status: {
                type: String
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
                param:{
                    personId:'',
                },
                templateData:{},
				isFullscreen : false,

            }
        },
        methods: {
            init() {
                this.getInspectReport();
            },
			changeFull() {
				this.isFullscreen = !this.isFullscreen;
				let height = document.documentElement.clientHeight;
				let element = document.querySelector(".previewTemplateCheck").querySelector(".ivu-modal-body");
				if (this.isFullscreen) {
					element.style.height = (height - 110) + "px";
				} else {
					element.style.height = (height - 300) + "px";
				}
			},
            getInspectReport(){
                this.loading = true;
                this.previewHtmlUrl = "";
                let _this = this;
                if(this.status == "已总检"){
                    //查询人员信息
                    let personId = "";
                    if(_this.TTemplateId.personInfo && _this.TTemplateId.personInfo.id){
                        personId = _this.TTemplateId.personInfo.id;
                    }else if(_this.TTemplateId.personId){
                        personId = _this.TTemplateId.personId;
                    }
                    getTGroupPersonWithLink({id:personId}).then(res => {
                        if (res.success) {
                            _this.personInfo = res.data;
                            _this.templateData.name = _this.personInfo.person_name;//姓名
                            _this.templateData.testNum = _this.personInfo.test_num;//体检编号
                            _this.templateData.sex = _this.personInfo.sex;//性别
                            _this.templateData.age = _this.personInfo.age;//年龄
                            _this.templateData.unitName = _this.personInfo.unit_name;//单位名称
                            _this.templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;
                            _this.templateData.workStateText = _this.personInfo.work_state_text;
                            _this.templateData.isMarry = _this.personInfo.is_marry;
                            _this.templateData.expYe = _this.personInfo.exposure_work_year;
                            _this.templateData.workYe = _this.personInfo.work_year;
                            _this.templateData.idCard = _this.personInfo.id_card;
                            _this.templateData.nation = _this.personInfo.nation;//民族
                            _this.templateData.headImg = _this.personInfo.avatar.replace("data:image/png;base64,", "");
                            _this.templateData.birthplaceName = _this.personInfo.birthplace_name;

                            //查询总检信息
                            getTInspectionRecordByPersonId({personId: _this.TTemplateId.personInfo.id}).then(res1 => {
                                if (res1.success) {
                                    if (res1.data) {
                                        _this.templateData.createTime = formartDate(res1.data.inspectionDate,'yyyy-MM-dd');
                                        let dateArray = _this.templateData.createTime.split('-');
                                        _this.templateData.ye = dateArray[0];
                                        _this.templateData.mo = dateArray[1];
                                        _this.templateData.da = dateArray[2];
                                        _this.templateData.autograph = res1.data.inspectionAutograph;//主检医生
                                        // if (res1.data.handleOpinion == res1.data.medicalAdvice) {
                                        //     _this.templateData.handleOpinion = res1.data.handleOpinion
                                        // } else {
                                        //     if (res1.data.handleOpinion != "无" && res1.data.medicalAdvice == "无") {
                                        //         _this.templateData.handleOpinion = res1.data.handleOpinion;
                                        //     } else if (res1.data.handleOpinion == "无" && res1.data.medicalAdvice != "无") {
                                        //         _this.templateData.handleOpinion = res1.data.medicalAdvice;
                                        //     } else {
                                        //         _this.templateData.handleOpinion = res1.data.handleOpinion + res1.data.medicalAdvice;
                                        //     }
                                        // }
                                        /*if (res1.data.careerCheckAbnormalResults == res1.data.otherCheckAbnormalResults) {
                                            _this.templateData.physicalResult = res1.data.careerCheckAbnormalResults
                                        } else {
                                            if (res1.data.careerCheckAbnormalResults != "无异常" && res1.data.otherCheckAbnormalResults == "无异常") {
                                                _this.templateData.physicalResult = res1.data.careerCheckAbnormalResults;
                                            } else if (res1.data.careerCheckAbnormalResults == "无异常" && res1.data.otherCheckAbnormalResults != "无异常") {
                                                _this.templateData.physicalResult = res1.data.otherCheckAbnormalResults;
                                            } else {
                                                _this.templateData.physicalResult = res1.data.careerCheckAbnormalResults + res1.data.otherCheckAbnormalResults;
                                            }
                                        }*/
                                        _this.templateData.conclusion = res1.data.conclusion;//体检结论
                                        _this.templateData.handleOpinion = res1.data.handleOpinion;//处理意见
                                        _this.templateData.otherResults = res1.data.otherCheckAbnormalResults;//其他异常描述
                                        _this.templateData.otherOpinion = res1.data.careerIllnessName;//其他异常处理意见
                                        _this.templateData.reviewResult = _this.TTemplateId.reviewResult;//复查结论
                                        _this.getTemplatePreviewData();
                                    }
                                }
                            })
                        }
                    })
                }else{
                    //查询人员信息
                    getTGroupPersonWithLink({id:_this.TTemplateId.personInfo.id}).then(res => {
                        if (res.success) {
                            _this.personInfo = res.data;
                            _this.templateData.name = _this.personInfo.person_name;//姓名
                            _this.templateData.testNum = _this.personInfo.test_num;//体检编号
                            _this.templateData.sex = _this.personInfo.sex;//性别
                            _this.templateData.age = _this.personInfo.age;//年龄
                            _this.templateData.autograph = _this.TTemplateId.doctor;//主检医生
                            _this.templateData.unitName = _this.personInfo.unit_name;//单位名称
                            _this.templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;
                            _this.templateData.workStateText = _this.personInfo.work_state_text;
                            _this.templateData.createTime = formartDate(new Date(), 'yyyy-MM-dd');
                            _this.templateData.physicalResult = _this.TTemplateId.physicalResult;
                            _this.templateData.isMarry = _this.personInfo.is_marry;
                            _this.templateData.expYe = _this.personInfo.exposure_work_year;
                            _this.templateData.workYe = _this.personInfo.work_year;
                            _this.templateData.idCard = _this.personInfo.id_card;
                            _this.templateData.birthplaceName = _this.personInfo.birthplace_name;
                            _this.templateData.headImg = _this.personInfo.avatar.replace("data:image/png;base64,", "");

                            _this.templateData.conclusion = _this.TTemplateId.conclusion;//体检结论
                            _this.templateData.handleOpinion = _this.TTemplateId.handleOpinion;//处理意见
                            _this.templateData.otherResults = _this.TTemplateId.otherCheckAbnormalResults;//其他异常描述
                            _this.templateData.otherOpinion = _this.TTemplateId.careerIllnessName;//其他异常处理意见
                            _this.templateData.reviewResult = _this.TTemplateId.reviewResult;//复查结论

                            _this.getTemplatePreviewData();
                        }
                    });
                }

            },
            getTemplatePreviewData(){
                let _this = this;
                let goods = [];
                let arr = [];
                this.param.personId = this.TTemplateId.personInfo.id;
                // queryTReviewRecordAll(this.param).then(res =>{
                queryTDepartResultList({
                    personId: this.TTemplateId.personInfo.id,
                    groupItemName: "(复)",
                }).then(res =>{
                    if(res.success){
                        arr = res.data;
                        if(arr.length > 0){
                            for (let i = 0; i < arr.length; i++) {
                                let groupItemName = arr[i].groupItemName.split("(复)");
                                goods.push({
                                    projectName: groupItemName[0],//复查项目名
                                    reviewResult: arr[i].diagnoseTip,//检查结果(诊断提醒)
                                    reviewExplain: arr[i].diagnoseSum,//处理意见(诊断小结)
                                    reviewTime: formartDate(arr[i].checkDate,'yyyy-MM-dd'),//复查日期
                                });
                            }
                            let dateArray = _this.templateData.createTime.split('-');
                            _this.templateData.ry = dateArray[0];
                            _this.templateData.rm = dateArray[1];
                            _this.templateData.rd = dateArray[2];
                            _this.templateData.reviewAutograph = _this.templateData.autograph;
                        }else{
                            goods.push({
                                projectName: "-",//检查项目名
                                reviewResult: "-",//检查结果(诊断提醒)
                                reviewExplain: "-",//处理意见(诊断小结)
                                reviewTime: "-",//复查日期
                            });
                            _this.templateData.ry = '';
                            _this.templateData.rm = '';
                            _this.templateData.rd = '';
                            _this.templateData.reviewAutograph = '';
                        }
                        _this.templateData.goods = goods;

                        getTemplatePreviewData({id: this.TTemplateId.id, templateData: JSON.stringify(_this.templateData)}).then(res => {
                            _this.loading = false;
                            if (res && res.success) {
                                this.previewHtml = res.data.replace("template", "div");
                                let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                                this.previewHtmlUrl = url;
                            } else {
                                _this.loading = false;
                                this.$Message.error('预览请求失败');
                            }
                        });
                    }
                })
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            downloadTemplate() {
                let fileName = "模板文件.docx";
                exportTemplate({id: this.TTemplateId}).then(res => {
                    let content = res;
                    let blob = new Blob([content], {type: 'application/ms-excel'});
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
            //vue-pdf 自带打印
            print() {
                this.$refs.pdf[0].print()
            },
            // 转图片打印
            toImg() {
                html2canvas(this.$refs.printContent[0], {
                    backgroundColor: null,
                    useCORS: true,
                    windowHeight: document.body.scrollHeight
                }).then((canvas) => {
                    let url = canvas.toDataURL()
                    printJS({
                        printable: url,
                        type: 'image',
                        documentTitle: this.printName
                    })
                    // console.log(url)
                })
            },
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
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
    .previewTemplate {
        .ivu-modal {
            min-width: 60vw !important;
        }

        .ivu-modal-body {
            position: relative;
            height: 70vh;
            /*overflow-y: auto;*/
            background-color: #e8eaec;
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
