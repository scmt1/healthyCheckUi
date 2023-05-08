<template>
    <div class="templateShow">
        <Card v-if="personIds && personIds.length > 0">
            <Tabs size="small" :value="tabsClickIndex" @on-click="tabsClick" >
                <TabPane label="个人体检报告" name="0" v-if="!loading && !typeStatus && isShowReport">
                    <div class="previewIframe" >
                        <iframe  ref="previewHtmlTemplate" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>
                </TabPane>
                <TabPane label="个人报告(含首页)" name="5" v-if="!loading && (physicalType == '职业体检' || physicalType == '健康体检'|| physicalType == '放射体检') && isShowFirstPage && !typeStatus">
                    <div class="previewIframe" >
                        <iframe  ref="previewHtmlTemplateFirstFM" :src="previewHtmlUrlFirstFM" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>
                </TabPane>
                <TabPane label="复查报告" name="3" v-if="!loading && typeStatus">
                    <div class="previewIframe" >
                        <iframe  ref="previewHtmlTemplateFC" :src="previewHtmlUrlFC" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>
                </TabPane>
                <TabPane label="告知书" name="1" v-if="!loading && (physicalType == '职业体检' || physicalType == '健康体检'|| physicalType == '放射体检')">
                    <div class="previewIframe" >
                        <iframe  ref="previewHtmlTemplateGZS" :src="previewHtmlUrlGZS" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>
                </TabPane>
                <TabPane label="封面" name="2" v-if="!loading && (physicalType == '职业体检' || physicalType == '健康体检'|| physicalType == '放射体检') && isShowFirstPage && isShowReport && !typeStatus">
                    <div class="previewIframe" >
                        <iframe  ref="previewHtmlTemplateFM" :src="previewHtmlUrlFM" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>
                </TabPane>
                <TabPane label="个人体检结论" name="4" v-if="!loading && (physicalType == '职业体检'|| physicalType == '放射体检') && !typeStatus && isShowReportConclusionPage">
                    <div class="previewIframe" >
                        <iframe  ref="previewHtmlTemplateTJJL" :src="previewHtmlUrlTJJL" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    </div>
                </TabPane>
                <div v-for="(item,i) in tabPanes" :label="item.name" :key="i"  style="display: none">
                    <preview-print  v-if="item.id!='name11'"  ref="previewPrint" :preview-id="'preview'+i"
                                    :group-item-data="tabItems"
                                    :depart-item-results="departItemResults"
                                    :t-template-id="item.templateId"
                                    :base-project-id="item.baseProjectId"
                                    :depart-result-id="item.departResultId"
                                    :group-item-id="item.groupItemId"
                                    :person-id="personId"
                                    :person-info="personInfo"
                                    :t-template-type="item.type"
                                    :checkSign="item.checkSign"
                                    :healthCheckup="item.healthCheckup"
                                    :name="item.name"
                                    :isShow="item.isShow"
                                    :opinion="item.opinion"
                                    :inspectResult="item.inspectResult"
                                    v-on:closeLoading="closeLoading"></preview-print>
                </div>
            </Tabs>
        </Card>
        <Card v-else>
            <!--暂无数据-->
            <no-data width="150" style="height: calc(100vh - 83px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
        </Card>
        <Spin fix v-show="ptfLoading">
            <div class="demo-spin-icon-load">
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
    </div>
    
</template>

<script>
    import {
        generatePhysicalExaminationReport,
        exportTemplatePdfBatch,
        generateReportByPersonId,
        generateReportByPersonIdsFC,
        generateReportByPersonIdsTJJL,
        generateReportByPersonIds,
        generateReportByPersonIdsNotice,
        generateReportByPersonIdsfirstPage,
        generateWordReport,
        getReportWordBatch,
        generateReportByPersonIdsTypeStatus
    } from '@/api/healthy/tTemplate'
    import previewPrint from "./previewPrint";
    import noData from "../../../components/no-data"
    import templateJs from "./templateJs/templateJs";

    export default {
        name: "templateShow",
        components: {
            previewPrint,
            noData
        },
        props: {
            personIds: {
                type: Array,
                default: () => []
            },
            isBatchPrint: {
                type: Boolean,
                default: false
            },
            isReview: {
                type: Boolean,
                default: false
            },
            taskNow: {
                type: String,
                default: ""
            },
            typeStatus: {
                type: Boolean,
                default: false
            },
            physicalType: {
                type: String,
                default: "职业体检"
            },
        },
        data() {
            return {
                ptfLoading: false,
                isShowPageLast: false,//是否展示页面(尾页)
                isNotShowFGN: false,//是否不展示肺功能详细报告 true 不展示 false 展示

                isShowReport: false,//是否展示个人报告(不含首页封面的)
                isShowFirstPage: false,//是否展示首页封面模板
                isSplitConclusion: false,//是否拆分结论页(师古需求)
                isShowGuidancePage: false,//是否展示保健指导页面(师古需求)
                isShowZoncareImg: false,//是否展示心电图图片(成都新华)
                isMergeShowJYKSH: false,//检验科生化检查项是否合并展示
                isShowReportConclusionPage: false,//个报告预览，是否打印个人体检结论页
                tabsClickIndex: "0",
                loading: false,
                previewHtmlUrl: "",//体检报告PDf
                previewHtmlUrlGZS: "",//体检报告(告知书)PDf
                previewHtmlUrlFM: "",//体检报告(封面)PDf
                previewHtmlUrlFirstFM: "",//体检报告(首页封面,夹在封皮下面)PDf
                previewHtmlUrlFC: "",//体检报告(复查报告)PDf
                previewHtmlUrlTJJL: "",//体检报告(个人体检结论)PDf
                tabPanes: [],
                tabItems: [],
                departItemResults:[],//分项结果
                personId: "",//选择的人员Id
                personInfo: {},
                isShowPage: false,//是否展示页面(首页尾页及相关说明)
                pdfPaths: [],//合成体检报告的PDf
                timer: null,//定时器
            }
        },
        computed: {
            /*physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },*/
        },
        methods: {
            /**
             * tab点击事件
             * @param name
             */
            tabsClick(name) {
                this.tabsClickIndex = name;
            },
            /**
             * 关闭loading
             */
            closeLoading() {
                this.$emit('closeLoading');
                this.loading = false;
                this.ptfLoading = false;
            },
            /**
             * 人员选择改变事件
             */
            personChange() {
                let _this = this;
                if (_this.personId) {
                    _this.previewHtmlUrl = "";
                    this.loading = true;
                    //根据人员Id查询人员信息以及检查结果
                    generateReportByPersonId({personId: _this.personId}).then(res => {
                        if (res.success && res.data && res.data.mapPerson) {
                            _this.personInfo = res.data.mapPerson;
                            _this.personInfo.orderGroupData = res.data.orderGroup ;
                            if (res.data.mapPerson.personProjectCheck) {
                                _this.abandonInspectionIdData = [];
                                for(let i = 0;i < res.data.mapPerson.personProjectCheck.length;i ++){
                                    _this.abandonInspectionIdData.push(res.data.mapPerson.personProjectCheck[i].orderGroupItemId)//弃检项目id
                                }
                            }
                            let workStateText = "";
                            if (_this.personInfo.work_state_text) {
                                workStateText = _this.personInfo.work_state_text;//监护种类(在岗状态)
                            }
                            let templateId = "";
                            let templateTGId = "";
                            let templateYKId = "";
                            let templateIdWzk = "";
                            if (_this.physicalType == "健康体检") {
                                templateId = "fe91d48556bc54ae224beebcbaece476";
                                templateTGId = "6e53c87e7d7cea49245ee99ab95dc385";
                                templateYKId = "676c51485eab4a822ff91c635a1debd8";
                            }else if (_this.physicalType == "职业体检") {
                                templateId = "6adc35bad272d6d87d802290cb103db7";
                                templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                                templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                                if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                    templateIdWzk = "5df05fdececfeca4b15a80571716a061";
                                }else{
                                    templateIdWzk = "fa087787c20db9caf85026779e7ff77c";
                                }
                            }else if(_this.physicalType == "放射体检"){
                                templateId = "9790f68f599ac47f5aa4559e818d8142";
                                templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                                // templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                                templateYKId = "7ec4ff0959974faf2eb0785fdf9f0812";
                                if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                    templateIdWzk = "840a45a8505f9d2a8b45d19a84aad90e";
                                }else{
                                    templateIdWzk = "f4f7667c1afe0fc072cfe67834faa4b2";
                                }
                            }
                            _this.tabPanes = [{
                                "name": "体检报告(汇总)",
                                "templateId": templateId,
                                "id": "name11",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }];
                            let healthy = {
                                "name": "体格检查",
                                "templateId": templateTGId,
                                "id": "",
                                "type": "体格检查",
                                "baseProjectId": "",
                                "healthCheckup": []
                            };
                            let eyeData = {
                                "name": "眼科检查",
                                "templateId": templateYKId,
                                "id": "",
                                "type": "眼科检查",
                                "baseProjectId": "",
                                "healthCheckup": []
                            };
                            let fkData = {
                                "name": "妇科检查",
                                "templateId": "82309fe7c1ff6cfc117d60dd8fca5b1d",
                                "id": "",
                                "type": "妇科检查",
                                "baseProjectId": "",
                                "healthCheckup": []
                            };
                            let tgfxData = {
                                "name": "分项汇总",
                                "templateId": "29e4fdfce7872e1e4e9b7df631d7013b",
                                "id": "",
                                "type": "分项汇总",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }
                            if (_this.physicalType && _this.physicalType == "健康体检") {
                                if(_this.isShowPage) {//首页封面及相关说明
                                    _this.tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "fe91d48556bc54ae224beebcbaece476",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                        "name": "医学申明",
                                        "templateId": "eab2a5038638c33d2f20f0c0ff5e59c1",
                                        "id": "",
                                        "type": "体检须知",
                                        "baseProjectId": ""
                                    }, {
                                        "name": "体检须知",
                                        "templateId": "5796da0621169b42f973386594605303",
                                        "id": "",
                                        "type": "体检须知",
                                        "baseProjectId": ""
                                    })
                                }
                                let conclusionTemplateId = "bbff5be6d0c0f92f63e812f843628ac0"
                                if(_this.isSplitConclusion){
                                    conclusionTemplateId = "c159055269e6b64c7f1451ad28c5b545";
                                }
                                _this.tabPanes.push({
                                    "name": "检查结果及处理意见",
                                    "templateId": conclusionTemplateId,
                                    "id": "",
                                    "type": "检查结果及处理意见",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });
                            } else if (_this.physicalType && _this.physicalType == "职业体检") {
                                if(_this.isShowPage) {//首页封面及相关说明
                                    _this.tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "6adc35bad272d6d87d802290cb103db7",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                        "name": "说明",
                                        "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                        "id": "",
                                        "type": "说明",
                                        "baseProjectId": ""
                                    })
                                }
                                let conclusionTemplateId = "8160f89d69ddb5b18f2b8f9ccd67fa28"
                                if(_this.isSplitConclusion){
                                    conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                                }
                                _this.tabPanes.push({
                                    "name": "检查结果及处理意见",
                                    "templateId": conclusionTemplateId,
                                    "id": "",
                                    "type": "检查结果及处理意见",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "问诊科检查表",
                                    "templateId": templateIdWzk,
                                    "id": "",
                                    "type": "问诊科检查表",
                                    "baseProjectId": ""
                                });
                            } else if (_this.physicalType && _this.physicalType == "放射体检") {
                                if(_this.isShowPage) {//首页封面及相关说明
                                    _this.tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "9790f68f599ac47f5aa4559e818d8142",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                        "name": "说明",
                                        "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                        "id": "",
                                        "type": "说明",
                                        "baseProjectId": ""
                                    })
                                }
                                let conclusionTemplateId = "2209519a9c327c9be267aa7d54ef2d51"
                                if(_this.isSplitConclusion){
                                    conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                                }
                                _this.tabPanes.push({
                                    "name": "检查结果及处理意见",
                                    "templateId": conclusionTemplateId,
                                    "id": "",
                                    "type": "检查结果及处理意见",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "问诊科检查表",
                                    "templateId": templateIdWzk,
                                    "id": "",
                                    "type": "问诊科检查表",
                                    "baseProjectId": ""
                                });
                            }
                            let groupItemIds = [];
                            let groupItemIdsEye = [];
                            let groupItemIdsFK = [];
                            let groupItemIdsTGFX = [];
                            let healthCheckup = ["皮肤科常规(职业)","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];
                            let healthCheckupEye = ["眼科", "眼科常规(视力)","眼科常规(职业)", "眼科常规（视力）", "眼科常规（色觉）", "眼科常规（色觉、视力）", "眼科常规(健康)"];
                            let healthCheckupFK = ["妇科", "妇科查体", "妇科常规", "妇科检查", "宫颈癌筛查", "白带常规", "宫颈刮片"];
                            let healthCheckupTGFX = ["皮肤科常规(职业)","一般检查","耳科听力常规","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];

                            /*模板 按科室 排序展示*/
                            /*let tabItemsData = [];
                            //检验科
                            let dataJYK = res.data.departResults.filter(item => item.officeName.indexOf("检验科") > -1);
                            //心电图
                            let dataXDT = res.data.departResults.filter(item => item.officeName.indexOf("心电图") > -1);
                            //电测听
                            let dataCYCT = res.data.departResults.filter(item => item.officeName.indexOf("电测听") > -1);
                            //彩超
                            let dataBC = res.data.departResults.filter(item => item.officeName.indexOf("彩超") > -1);
                            //DR
                            let dataDR = res.data.departResults.filter(item => item.officeName.indexOf("DR") > -1);
                            //CT
                            let dataCT = res.data.departResults.filter(item => item.officeName.indexOf("CT") > -1);
                            //肺功能
                            let dataFGN = res.data.departResults.filter(item => item.officeName.indexOf("肺功能") > -1);
                            //其他科室
                            let dataOthers = res.data.departResults.filter(item => item.officeName.indexOf("肺功能") <= -1 && item.officeName.indexOf("CT") <= -1 && item.officeName.indexOf("DR") <= -1 && item.officeName.indexOf("彩超") <= -1 && item.officeName.indexOf("电测听") <= -1 && item.officeName.indexOf("心电图") <= -1 && item.officeName.indexOf("检验科") <= -1);
                            //组合项目数据录入 顺序(检验科、心电图、电测听、彩超、DR、CT、肺功能、其他科室)
                            dataJYK.forEach(item => {
                                if(item.groupItemName.indexOf("血常规") > -1){
                                    tabItemsData.push(item);
                                }
                            });
                            dataJYK.forEach(item => {
                                if(item.groupItemName.indexOf("尿常规") > -1){
                                    tabItemsData.push(item);
                                }
                            });
                            dataJYK.forEach(item => {
                                if(item.groupItemName.indexOf("肝肾功") > -1){
                                    tabItemsData.push(item);
                                }
                            });
                            dataJYK.forEach(item => {
                                if(item.groupItemName.indexOf("血糖") > -1){
                                    tabItemsData.push(item);
                                }
                            });
                            dataJYK.forEach(item => {
                                if(item.groupItemName.indexOf("血常规") <= -1 && item.groupItemName.indexOf("尿常规") <= -1 && item.groupItemName.indexOf("肝肾功") <= -1 && item.groupItemName.indexOf("血糖") <= -1){
                                    tabItemsData.push(item);
                                }
                            });
                            dataXDT.forEach(item => {
                                tabItemsData.push(item);
                            });
                            dataCYCT.forEach(item => {
                                tabItemsData.push(item);
                            });
                            dataBC.forEach(item => {
                                tabItemsData.push(item);
                            });
                            dataDR.forEach(item => {
                                tabItemsData.push(item);
                            });
                            dataCT.forEach(item => {
                                tabItemsData.push(item);
                            });
                            dataFGN.forEach(item => {
                                tabItemsData.push(item);
                            });
                            dataOthers.forEach(item => {
                                tabItemsData.push(item);
                            });*/

                            _this.tabItems = res.data.departResults;
                            // _this.tabItems = tabItemsData;
                            _this.departItemResults = res.data.departItemResults;
                            let arrNew = [];
                            if (_this.tabItems && _this.tabItems.length > 0) {
                                for (let i = 0; i < _this.tabItems.length; i++) {
                                    if (_this.tabItems[i] && _this.tabItems[i].groupItemId && _this.abandonInspectionIdData.indexOf(_this.tabItems[i].groupItemId) <= -1) {
                                        //复检的先不到报告里
                                        if (_this.tabItems[i].groupItemName.indexOf("复") > -1) {
                                            let isShowReview = _this.$hospitalName.isShowReview;//是否展示复查报告
                                            if(!isShowReview){
                                                continue;
                                            }
                                        }
                                        //获取 分项汇总 检查结果数据(总览)
                                        let officeName = tabItems[i].officeName;//科室名称
                                        if(officeName){
                                            officeName = tabItems[i].officeName.trim();//科室名称
                                        }
                                        let groupItemName = tabItems[i].groupItemName;//项目名称
                                        if(groupItemName){
                                            groupItemName = tabItems[i].groupItemName.trim();
                                        }
                                        let dataOfficeFXHZ = ["一般检查", "五官科","耳鼻咽喉科","耳鼻喉科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图"];//分项汇总 科室名称集
                                        let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科","耳鼻咽喉科","耳鼻喉科", "口腔科", "眼科"];//分项汇总和后面详细报告 都有的 科室名称集
                                        let dataGroupNameYC = ["口腔定位检查"];//牙齿画十字线(五官科、口腔科) 项目名称集
                                        if (dataOfficeFXHZ.indexOf(officeName) > -1) {
                                            groupItemIdsTGFX.push({
                                                "name": _this.tabItems[i].groupItemName,
                                                "groupItemId": _this.tabItems[i].groupItemId,
                                                "checkSign": _this.tabItems[i].checkSign,
                                                "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            });
                                            if(dataOfficeBoth.indexOf(officeName) > -1 || groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                                //继续执行
                                            }else{
                                                continue;
                                            }
                                        }
                                        //获取 体格检查 检查结果数据(详细)
                                        let dataOfficeTG = ["一般检查", "五官科","耳鼻咽喉科","耳鼻喉科", "口腔科", "内科", "外科", "皮肤科"]
                                        if (dataOfficeTG.indexOf(officeName) > -1) {
                                            groupItemIds.push({
                                                "name": _this.tabItems[i].groupItemName,
                                                "groupItemId": _this.tabItems[i].groupItemId,
                                                "checkSign": _this.tabItems[i].checkSign,
                                                "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            });
                                            if(groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                                //继续执行
                                            }else{
                                                continue;
                                            }
                                        }
                                        //获取 眼科检查 检查结果数据(详细)
                                        if (groupItemName.indexOf("眼科") > -1 || officeName.indexOf("眼科") > -1) {
                                            groupItemIdsEye.push({
                                                "name": _this.tabItems[i].groupItemName,
                                                "groupItemId": _this.tabItems[i].groupItemId,
                                                "checkSign": _this.tabItems[i].checkSign,
                                                "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            });
                                            continue;
                                        }
                                        //获取 妇科检查 检查结果数据(详细)
                                        if (officeName.indexOf("妇科") > -1) {
                                            groupItemIdsFK.push({
                                                "name": _this.tabItems[i].groupItemName,
                                                "groupItemId": _this.tabItems[i].groupItemId,
                                                "checkSign": _this.tabItems[i].checkSign,
                                                "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            });
                                            continue;
                                        }
                                        //心电图图片不展示
                                        if(officeName.indexOf("心电图") > -1 && !_this.isShowZoncareImg){
                                            continue;
                                        }
                                        //其他化验项目 检查结果数据     生化合并:将需要合并的项目提出(取索引和基础项数目)
                                        _this.tabPanes.push({
                                            "name": _this.tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": _this.tabItems[i].portfolioProjectId,
                                            "departResultId": _this.tabItems[i].id,
                                            "groupItemId": _this.tabItems[i].groupItemId,
                                            "checkSign": _this.tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": _this.tabItems[i].diagnoseSum,//小结
                                            "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": true,//是否显示基本信息
                                        });
                                        /*if(officeName.indexOf("检验科") > -1 && groupItemName.indexOf("尿常规") <= -1 && groupItemName.indexOf("血常规") <= -1 && groupItemName.indexOf("复") <= -1){
                                            let departItemResultsNow = _this.departItemResults.filter(ii => ii.orderGroupItemId == _this.tabItems[i].groupItemId);
                                            departItemResultsNow = this.removeList(departItemResultsNow);
                                            let numberCount = departItemResultsNow.length
                                            if(numberCount >= 20){
                                                _this.tabPanes.push({
                                                    "name": _this.tabItems[i].groupItemName,
                                                    "templateId": "",
                                                    "id": "",
                                                    "type": "分项报告",
                                                    "baseProjectId": _this.tabItems[i].portfolioProjectId,
                                                    "departResultId": _this.tabItems[i].id,
                                                    "groupItemId": _this.tabItems[i].groupItemId,
                                                    "checkSign": _this.tabItems[i].checkSign,
                                                    "healthCheckup": [],
                                                    "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                    "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                                    "officeName": officeName,//所属科室
                                                    "isShow": false,//是否显示基本信息
                                                });
                                            }else{
                                                arrNew.push({
                                                    index: i,
                                                    count: numberCount,
                                                })
                                            }
                                        }else{
                                            _this.tabPanes.push({
                                                "name": _this.tabItems[i].groupItemName,
                                                "templateId": "",
                                                "id": "",
                                                "type": "分项报告",
                                                "baseProjectId": _this.tabItems[i].portfolioProjectId,
                                                "departResultId": _this.tabItems[i].id,
                                                "groupItemId": _this.tabItems[i].groupItemId,
                                                "checkSign": _this.tabItems[i].checkSign,
                                                "healthCheckup": [],
                                                "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                                "officeName": officeName,//所属科室
                                                "isShow": false,//是否显示基本信息
                                            });
                                        }*/
                                    }

                                }
                            }
                            let tabItemsAdd = [];
                            //若存在需要合并的生化项目 遍历合并
                            if(arrNew && arrNew.length > 0){
                                let groupItemIds = [];
                                let count = 0;
                                let intNew = 0;
                                for(let n = 0;n < arrNew.length;n ++){
                                    let countNow = count + arrNew[n].count;
                                    if(countNow < 25){
                                        count += arrNew[n].count;
                                        let int = arrNew[n].index;
                                        intNew = int;
                                        groupItemIds.push(_this.tabItems[int].groupItemId);
                                        if(n == arrNew.length - 1){
                                            tabItemsAdd.push({
                                                "name": _this.tabItems[int].groupItemName,
                                                "templateId": "",
                                                "id": "",
                                                "type": "分项报告",
                                                "baseProjectId": "",
                                                "departResultId": "",
                                                "groupItemId": groupItemIds,
                                                "checkSign": _this.tabItems[int].checkSign,
                                                "healthCheckup": [],
                                                "opinion": "",//小结
                                                "inspectResult": "",//影像所见(诊断提醒)
                                                "officeName": "检验科",//所属科室
                                                "isShow": false,//是否显示基本信息
                                            })
                                        }
                                    }else{
                                        tabItemsAdd.push({
                                            "name": _this.tabItems[intNew].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": "",
                                            "departResultId": "",
                                            "groupItemId": groupItemIds,
                                            "checkSign": _this.tabItems[intNew].checkSign,
                                            "healthCheckup": [],
                                            "opinion": "",//小结
                                            "inspectResult": "",//影像所见(诊断提醒)
                                            "officeName": "检验科",//所属科室
                                            "isShow": false,//是否显示基本信息
                                        })
                                        groupItemIds = [];
                                        count = 0;
                                        count += arrNew[n].count;
                                        let int = arrNew[n].index;
                                        intNew = int;
                                        groupItemIds.push(_this.tabItems[int].groupItemId);
                                    }
                                }
                            }
                            //合并后 加入分检项目集合
                            if(tabItemsAdd && tabItemsAdd.length > 0){
                                for(let i = 0;i < _this.tabPanes.length;i ++){
                                    if(_this.tabPanes[i].officeName && _this.tabPanes[i].officeName.indexOf("检验科") > -1 && _this.tabPanes[i+1].officeName && _this.tabPanes[i+1].officeName.indexOf("检验科") <= -1){
                                        let intNow = i + 1;
                                        for(let j = 0;j < tabItemsAdd.length;j ++){
                                            _this.tabPanes.splice(intNow, 0, tabItemsAdd[j]);
                                            intNow ++;
                                        }
                                        break;
                                    }
                                }
                            }
                            //检验科 仅保留首页基本信息
                            for(let i = 0;i < _this.tabPanes.length;i ++){
                                if(_this.tabPanes[i].officeName && _this.tabPanes[i].officeName.indexOf("检验科") > -1){
                                    _this.tabPanes[i].isShow = true;
                                    break;
                                }
                            }
                            if (_this.physicalType && _this.physicalType == "健康体检") {
                                let startPage;
                                if(_this.isShowPage){
                                    startPage = 5;
                                }else{
                                    startPage = 2;
                                }
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                _this.tabPanes.splice(startPage, 0, tgfxData);
                                let int = startPage + 1;
                                /*if(groupItemIds.length > 0){
                                    healthy.healthCheckup = groupItemIds;//体格检查
                                    // int ++;
                                    _this.tabPanes.splice(int, 0, healthy);
                                }
                                if(groupItemIdsEye.length > 0){
                                    eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                    int ++;
                                    _this.tabPanes.splice(int, 0, eyeData);
                                }*/
                                /*if(groupItemIdsFK.length > 0){
                                    fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                    int ++;
                                    _this.tabPanes.splice(int, 0, fkData);
                                }*/
                                _this.tabPanes.push({
                                    "name": "常见病保健指导",
                                    "templateId": "357fdd2cb29bd0ddcd87e2302ab75573",
                                    "id": "",
                                    "type": "常见病保健指导",
                                    "baseProjectId": ""
                                });
                                if(_this.isSplitConclusion){
                                    _this.tabPanes.push({
                                        "name": "健康-检查结果及处理意见",
                                        "templateId": "0fbb068c1790cb2e03b42943128cecab",
                                        "id": "",
                                        "type": "健康-检查结果及处理意见",
                                        "baseProjectId": ""
                                    });
                                }
                                if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                    _this.tabPanes.push({
                                        "name": "尾页封面",
                                        "templateId": "985a3cecc26f95aecba46114302f5ed3",
                                        "id": "",
                                        "type": "尾页封面",
                                        "baseProjectId": ""
                                    })
                                }
                            } else if (_this.physicalType && _this.physicalType == "职业体检") {
                                let startPage;
                                if(_this.isShowPage){
                                    startPage = 5;
                                }else{
                                    startPage = 3;
                                }
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                _this.tabPanes.splice(startPage, 0, tgfxData);
                                let int = startPage + 1;
                                /*if(groupItemIds.length > 0){
                                    healthy.healthCheckup = groupItemIds;//体格检查
                                    // int ++;
                                    _this.tabPanes.splice(int, 0, healthy);
                                }
                                if(groupItemIdsEye.length > 0){
                                    eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                    int ++;
                                    _this.tabPanes.splice(int, 0, eyeData);
                                }*/
                                /*if(groupItemIdsFK.length > 0){
                                    fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                    int ++;
                                    _this.tabPanes.splice(int, 0, fkData);
                                }*/
                                if(_this.isSplitConclusion){
                                    _this.tabPanes.push({
                                        "name": "职业-检查结果及处理意见",
                                        "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                        "id": "",
                                        "type": "职业-检查结果及处理意见",
                                        "baseProjectId": ""
                                    });
                                }
                                if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                    _this.tabPanes.push({
                                        "name": "尾页封面",
                                        "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                        "id": "",
                                        "type": "尾页封面",
                                        "baseProjectId": ""
                                    })
                                }
                            }else if (_this.physicalType && _this.physicalType == "放射体检") {
                                let startPage;
                                if(_this.isShowPage){
                                    startPage = 5;
                                }else{
                                    startPage = 3;
                                }
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                _this.tabPanes.splice(startPage, 0, tgfxData);
                                let int = startPage + 1;
                                /*if(groupItemIds.length > 0){
                                    healthy.healthCheckup = groupItemIds;//体格检查
                                    // int ++;
                                    _this.tabPanes.splice(int, 0, healthy);
                                }*/
                                if(groupItemIdsEye.length > 0){
                                    eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                    _this.tabPanes.splice(int, 0, eyeData);
                                }
                                /*if(groupItemIdsFK.length > 0){
                                    fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                    int ++;
                                    _this.tabPanes.splice(int, 0, fkData);
                                }*/
                                if(_this.isSplitConclusion){
                                    _this.tabPanes.push({
                                        "name": "职业-检查结果及处理意见",
                                        "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                        "id": "",
                                        "type": "职业-检查结果及处理意见",
                                        "baseProjectId": ""
                                    });
                                }
                                if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                    _this.tabPanes.push({
                                        "name": "尾页封面",
                                        "templateId": "55eebcf1287dee53e68d8003392a0ba3",
                                        "id": "",
                                        "type": "尾页封面",
                                        "baseProjectId": ""
                                    })
                                }
                            }
                            let wordData = [];
                            //检查分项的
                            if (this.tabItems && this.tabItems.length > 0) {
                                this.timer = setInterval(function () {
                                    let isComplete = true;
                                    _this.pdfPaths = [];
                                    wordData = [];
                                    if(!_this.loading){
                                        if(_this.timer){
                                            clearInterval(_this.timer);
                                            _this.timer = null;
                                        }
                                    }
                                    for (let i = 0; i < _this.$refs.previewPrint.length; i++) {
                                        if (_this.$refs.previewPrint[i].previewData) {
                                            wordData.push(_this.$refs.previewPrint[i].previewData)
                                        }
                                    }
                                    if (isComplete && wordData.length > 0 && _this.tabPanes.length - 1 == wordData.length) {
                                        _this.getReportWord(wordData);
                                        if(_this.timer){
                                            clearInterval(_this.timer);
                                            _this.timer = null;
                                        }
                                    }
                                }, 100);
                            }

                        }
                        else {
                            _this.$Message.error("查询结果失败！！");
                            _this.loading = false;
                        }
                    }).catch(function (error) {
                        _this.loading = false;
                    });
                }
            },
            /**
             * 集合去重
             */
            removeList(arr){
                let newArr = [];
                for(let i = 0;i < arr.length;i ++){
                    if(newArr.length == 0){
                        newArr.push(arr[i]);
                    }else{
                        let flag = true;
                        for(let j = 0;j < newArr.length;j ++){
                            if(arr[i].orderGroupItemProjectId == newArr[j].orderGroupItemProjectId){
                                flag = false;
                            }
                        }
                        if(flag){
                            newArr.push(arr[i]);
                        }
                    }
                }
                return newArr;
            },
            /**
             * 获取体检报告
             */
            getReportWord(data) {
                let _this = this;
                generateWordReport({wordData: data, personId: this.personId, personName: this.personInfo.person_name}).then(res => {
                    _this.closeLoading();
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        _this.previewHtmlUrl = url;
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            /**
             * 生成告知书
             * */
            noticeChange(id){
                let ids = [];
                if (id){
                    ids.push(id);
                }else {
                    ids.push(this.personId);
                }
                this.loading = true;
                generateReportByPersonIdsNotice(ids).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandDataNotice(res.data);
                        //获取报告
                        this.getReportWordNotice(batchData);
                    } else {
                        this.$Modal.remove();
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.$Message.error(res);
                    this.$Modal.remove();
                    this.closeLoading();
                })
            },
            /**
             * 生成封面
             * */
            firstPageChange(){
                let ids = [];
                ids.push(this.personId);
                this.loading = true;
                generateReportByPersonIdsfirstPage(ids).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandDatafirstPage(res.data);
                        //获取报告
                        this.getReportWordfirstPage(batchData);
                    } else {
                        this.$Modal.remove();
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.$Message.error(res);
                    this.$Modal.remove();
                    this.closeLoading();
                })
            },
            /**
             * 生成首页封面，夹在封皮下面
             * */
            batchPrintTemplateFisrtFM(){
                this.loading = true;
                generateReportByPersonIds( this.personIds).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandData(res.data,"个人报告(含首页)");
                        //获取报告
                        this.getReportFisrtFM(batchData);
                    } else {
                        this.$Modal.remove();
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.$Message.error(res);
                    this.$Modal.remove();
                    this.closeLoading();
                })
            },
            //处理报告数据(告知书)
            batchHandDataNotice(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let departItemResults = "";
                        let tabItems = "";
                        let tabPanes = [];
                        if (this.$hospitalName && this.$hospitalName.notificationShow){
                            let templateId = '5a92f1958c0d5acf1f74ef2db960c5a5';
                            if (personInfo && personInfo.occupational_taboo_now){
                                templateId = '0ce4d3d1da759a1e506be4338dda9bf9';
                            }else if (personInfo && personInfo.occupational_diseases_now){
                                templateId = 'b086f387abae82a3aceced07110492fd';
                            }else {
                                templateId = '5a92f1958c0d5acf1f74ef2db960c5a5';
                            }
                                tabPanes.push({
                                    "name": "告知书",
                                    "templateId": templateId,
                                    "id": "",
                                    "type": "告知书",
                                    "baseProjectId": "",
                                    "departResultId": "",
                                    "groupItemId": "",
                                    "checkSign": "",
                                    "healthCheckup": [],
                                    "opinion": "",//小结
                                    "inspectResult": "",//影像所见(诊断提醒)
                                    "isShow": true,
                                });
                        }else {
                            tabPanes.push({
                                "name": "告知书",
                                "templateId": "5a92f1958c0d5acf1f74ef2db960c5a5",
                                "id": "",
                                "type": "告知书",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });

                        }
                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;

                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id,personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据(封面)
            batchHandDatafirstPage(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let departItemResults = "";
                        let tabItems = "";

                        let tabPanes = [];
                        let templateId = "";
                        if(this.physicalType == '职业体检' || this.physicalType == '放射体检'){
                            templateId = "dec3b3e9294f1a169b891390984124e5";
                        }else{
                            templateId = "896641a6df5a731abe2e725dd12b9c6f";
                        }
                        tabPanes.push({
                            "name": "封面",
                            "templateId": templateId,
                            "id": "",
                            "type": "封面",
                            "baseProjectId": "",
                            "departResultId": "",
                            "groupItemId": "",
                            "checkSign": "",
                            "healthCheckup": [],
                            "opinion": "",//小结
                            "inspectResult": "",//影像所见(诊断提醒)
                            "isShow": true,
                        });


                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;

                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id,personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            getReportWordNotice(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "告知书"}).then(res => {
                    // _this.closeLoading();
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        // this.previewHtmlUrl = url;
                        _this.previewHtmlUrlGZS = url;
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            getReportWordfirstPage(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "封面模板"}).then(res => {
                    // _this.closeLoading();
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        _this.previewHtmlUrlFM = url;
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            getReportFisrtFM(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "首页封面"}).then(res => {
                    if(_this.isBatchPrint){
                        _this.closeLoading();
                    }
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        _this.previewHtmlUrlFirstFM = url;
                        if(_this.isBatchPrint){
                            setTimeout(function () {
                                _this.$refs.previewHtmlTemplateFirstFM.contentWindow.print();
                            }, 1000)
                        }
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            //批量打印
            batchPrintTemplate(){
                generateReportByPersonIds(this.personIds).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandData(res.data,"个人报告");
                        //获取报告
                        this.getReportWordBatch(batchData);
                    } else {
                        this.$Message.error(res.msg);
                    }
                }).catch(err => {
                    console.log(err);
                    this.$Message.error(err);
                    this.closeLoading();
                })
            },
            //批量打印(复查报告)
            batchPrintTemplateFC(){
                if(!this.typeStatus) {
                    generateReportByPersonIdsFC(this.personIds).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandData(res.data, "复查报告");
                            //获取报告
                            this.getReportWordBatchFC(batchData);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.closeLoading();
                    })
                }else{
                    generateReportByPersonIdsTypeStatus(this.personIds).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            this.noticeChange(res.data[0].mapPerson.first_person_id);
                            //组装数据
                            let batchData = this.batchHandData(res.data, "复查报告");
                            //获取报告
                            this.getReportWordBatchFC(batchData);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
						console.log(res);
                        this.closeLoading();
                    })
                }
            },
            //批量打印(个人体检结论)
            batchPrintTemplateTJJL(){
                generateReportByPersonIdsTJJL(this.personIds).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandDataTJJL(res.data);
                        //获取报告
                        this.getReportWordBatchTJJL(batchData);
                    } else {
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.$Message.error(res);
                    this.closeLoading();
                })
            },
            /**
             * 获取体检报告(复查报告)
             */
            getReportWordBatchFC(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "复查报告"}).then(res => {
                    if(this.isBatchPrint || this.typeStatus){
                        _this.closeLoading();
                    }
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        // this.previewHtmlUrl = url;
                        _this.previewHtmlUrlFC = url;
                        if(_this.isBatchPrint){
                            setTimeout(function () {
                                _this.$refs.previewHtmlTemplateFC.contentWindow.print();
                            }, 1000)
                        }
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            /**
             * 获取体检报告
             */
            getReportWordBatch(data) {
                let _this = this;
                getReportWordBatch({data: data}).then(res => {
                    _this.closeLoading();
                    if (res.success && res.data) {
                        if(res.data.length > 0){
                            if(res.data[0].trim().length > 0){
                                let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data[0];
                                _this.previewHtmlUrl = url;
                                if(this.isBatchPrint && res.data.length == 1){
                                    setTimeout(function () {
                                        _this.$refs.previewHtmlTemplate.contentWindow.print();
                                    }, 1000)
                                }
                            }else{
                                _this.previewHtmlUrl = "";
                            }
                            //打印异常提示
                            if(res.data.length > 1){
                                for(let i = 1;i < res.data.length;i ++){
                                    _this.$Message.error(res.data[i]);
                                }
                            }
                        }else{
                            let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                            _this.previewHtmlUrl = url;
                            if(this.isBatchPrint){
                                setTimeout(function () {
                                    _this.$refs.previewHtmlTemplate.contentWindow.print();
                                }, 1000)
                            }
                        }
                        /*let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        _this.previewHtmlUrl = url;
                        if(this.isBatchPrint){
                            setTimeout(function () {
                                _this.$refs.previewHtmlTemplate.contentWindow.print();
                            }, 1000)
                        }*/
                    }
                }).catch(function (error) {
                    console.log(error);
                    _this.closeLoading();
                });
            },
            //处理报告数据
            batchHandData(datas,reportName){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let abandonInspectionIdData = [];
                        if (data.mapPerson.personProjectCheck) {

                            for(let i = 0;i < data.mapPerson.personProjectCheck.length;i ++){
                                abandonInspectionIdData.push(data.mapPerson.personProjectCheck[i].orderGroupItemId)//弃检项目id
                            }
                            personInfo.abandonInspectionIdData = abandonInspectionIdData;
                        }
                        let workStateText = "";
                        if (personInfo.work_state_text) {
                            workStateText = personInfo.work_state_text;//监护种类(在岗状态)
                        }
                        let templateId = "";
                        let templateTGId = "";
                        let templateYKId = "";
                        let templateIdWzk = "";
                        let physicalType = personInfo.physical_type;
                        let hazardFactors = personInfo.hazard_factors;//危害因素编码

                        //拼接处理意见(目前仅健康和从业)
                        personInfo.tPositiveResult = "";
                        if (physicalType == "健康体检" || physicalType == "从业体检") {
                            if(personInfo && personInfo.tPositivePeople){
                                let tPositivePeople = personInfo.tPositivePeople;
                                //调取拼接方法
                                personInfo.tPositiveResult = _this.getPositiveResultData(tPositivePeople);
                            }
                        }
                        //拼接职业健康检查结论（目前仅职业和放射）
                        personInfo.tdTjBadrsnsResult = "";
                        if (physicalType == "职业体检" || physicalType == "放射体检") {
                            if(personInfo && personInfo.tdTjBadrsns){
                                let tdTjBadrsnsResult = personInfo.tdTjBadrsns;
                                //调取拼接方法
                                personInfo.tdTjBadrsnsResult = _this.getTdTjBadrsnsResultData(tdTjBadrsnsResult);
                            }
                            if(personInfo && personInfo.tdTjBadrsnsFirst){
                                let tdTjBadrsnsResult = personInfo.tdTjBadrsnsFirst;
                                //调取拼接方法
                                personInfo.tdTjBadrsnsResultFirst = _this.getTdTjBadrsnsResultData(tdTjBadrsnsResult);
                            }
                        }

                        if (physicalType == "健康体检") {
                            templateId = "fe91d48556bc54ae224beebcbaece476";
                            templateTGId = "6e53c87e7d7cea49245ee99ab95dc385";
                            templateYKId = "676c51485eab4a822ff91c635a1debd8";
                        }else if (physicalType == "职业体检" && !(hazardFactors && (hazardFactors.indexOf("160002")>-1 || hazardFactors.indexOf("160501")>-1 || hazardFactors.indexOf("160502")>-1  || hazardFactors.indexOf("160503")>-1  || hazardFactors.indexOf("160504")>-1 || hazardFactors.indexOf("160506")>-1 || hazardFactors.indexOf("160507")>-1 || hazardFactors.indexOf("160999")>-1))) {
                            templateId = "6adc35bad272d6d87d802290cb103db7";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                templateIdWzk = "5df05fdececfeca4b15a80571716a061";
                            }else{
                                templateIdWzk = "fa087787c20db9caf85026779e7ff77c";
                            }
                        }else if(physicalType == "放射体检" || (hazardFactors && (hazardFactors.indexOf("160002")>-1 || hazardFactors.indexOf("160501")>-1 || hazardFactors.indexOf("160502")>-1  || hazardFactors.indexOf("160503")>-1  || hazardFactors.indexOf("160504")>-1 || hazardFactors.indexOf("160506")>-1 || hazardFactors.indexOf("160507")>-1 || hazardFactors.indexOf("160999")>-1))){
                            templateId = "9790f68f599ac47f5aa4559e818d8142";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            // templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            templateYKId = "7ec4ff0959974faf2eb0785fdf9f0812";
                            if(workStateText && (workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1)){
                                templateIdWzk = "840a45a8505f9d2a8b45d19a84aad90e";
                            }else{
                                templateIdWzk = "f4f7667c1afe0fc072cfe67834faa4b2";
                            }
                        }
                        let tabPanes = [];
                        let healthy = {
                            "name": "体格检查",
                            "templateId": templateTGId,
                            "id": "",
                            "type": "体格检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let eyeData = {
                            "name": "眼科检查",
                            "templateId": templateYKId,
                            "id": "",
                            "type": "眼科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let fkData = {
                            "name": "妇科检查",
                            "templateId": "82309fe7c1ff6cfc117d60dd8fca5b1d",
                            "id": "",
                            "type": "妇科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let tgfxData = {
                            "name": "分项汇总",
                            "templateId": "29e4fdfce7872e1e4e9b7df631d7013b",
                            "id": "",
                            "type": "分项汇总",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        if (physicalType && physicalType == "健康体检") {
                            if(reportName == "个人报告"){
                                if(_this.isShowPage) {//首页封面及相关说明
                                    tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "fe91d48556bc54ae224beebcbaece476",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                        "name": "医学申明",
                                        "templateId": "eab2a5038638c33d2f20f0c0ff5e59c1",
                                        "id": "",
                                        "type": "体检须知",
                                        "baseProjectId": ""
                                    }, {
                                        "name": "体检须知",
                                        "templateId": "5796da0621169b42f973386594605303",
                                        "id": "",
                                        "type": "体检须知",
                                        "baseProjectId": ""
                                    })
                                }
                            }else if(reportName == "个人报告(含首页)"){
                                tabPanes.push({
                                    "name": "首页封面",
                                    "templateId": "fe91d48556bc54ae224beebcbaece476",
                                    "id": "",
                                    "type": "首页封面",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "医学申明",
                                    "templateId": "eab2a5038638c33d2f20f0c0ff5e59c1",
                                    "id": "",
                                    "type": "体检须知",
                                    "baseProjectId": ""
                                })
                            }
                            if(reportName == "复查报告"){
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger){
                                    tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "fe91d48556bc54ae224beebcbaece476",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                            "name": "说明",
                                            "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                            "id": "",
                                            "type": "说明",
                                            "baseProjectId": ""
                                        })
                                }
                                tabPanes.push({
                                    "name": "个人复查报告-基本信息",
                                    "templateId": "808295634be84067aea793ccb73a0fea",
                                    "id": "",
                                    "type": "个人复查报告-基本信息",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });
                            }else{
                                let conclusionTemplateId = "bbff5be6d0c0f92f63e812f843628ac0"
                                if(_this.isSplitConclusion){
                                    conclusionTemplateId = "c159055269e6b64c7f1451ad28c5b545";
                                }
                                tabPanes.push({
                                    "name": "检查结果及处理意见",
                                    "templateId": conclusionTemplateId,
                                    "id": "",
                                    "type": "检查结果及处理意见",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });
                            }
                        } else if (physicalType && physicalType == "职业体检") {
                            if(reportName == "个人报告"){
                                if(_this.isShowPage) {//首页封面及相关说明
                                    tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "6adc35bad272d6d87d802290cb103db7",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                        "name": "说明",
                                        "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                        "id": "",
                                        "type": "说明",
                                        "baseProjectId": ""
                                    })
                                }
                            }else if(reportName == "个人报告(含首页)"){
                                tabPanes.push({
                                    "name": "首页封面",
                                    "templateId": "6adc35bad272d6d87d802290cb103db7",
                                    "id": "",
                                    "type": "首页封面",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "说明",
                                    "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                    "id": "",
                                    "type": "说明",
                                    "baseProjectId": ""
                                })
                            }
                            if(reportName == "复查报告"){
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger){
                                    tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "6adc35bad272d6d87d802290cb103db7",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    },{
                                        "name": "说明",
                                        "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                        "id": "",
                                        "type": "说明",
                                        "baseProjectId": ""
                                    },)
                                }
                                tabPanes.push({
                                    "name": "个人复查报告-基本信息",
                                    "templateId": "808295634be84067aea793ccb73a0fea",
                                    "id": "",
                                    "type": "个人复查报告-基本信息",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });
                            }else{
                                let conclusionTemplateId = "8160f89d69ddb5b18f2b8f9ccd67fa28"
                                if(_this.isSplitConclusion){
                                    conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                                }
                                tabPanes.push({
                                    "name": "检查结果及处理意见",
                                    "templateId": conclusionTemplateId,
                                    "id": "",
                                    "type": "检查结果及处理意见",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "问诊科检查表",
                                    "templateId": templateIdWzk,
                                    "id": "",
                                    "type": "问诊科检查表",
                                    "baseProjectId": ""
                                });
                            }
                        } else if (physicalType && physicalType == "放射体检") {
                            if(reportName == "个人报告"){
                                if(_this.isShowPage) {//首页封面及相关说明
                                    tabPanes.push({
                                        "name": "首页封面",
                                        "templateId": "9790f68f599ac47f5aa4559e818d8142",
                                        "id": "",
                                        "type": "首页封面",
                                        "baseProjectId": "",
                                        "healthCheckup": []
                                    }, {
                                        "name": "说明",
                                        "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                        "id": "",
                                        "type": "说明",
                                        "baseProjectId": ""
                                    })
                                }
                            }else if(reportName == "个人报告(含首页)"){
                                tabPanes.push({
                                    "name": "首页封面",
                                    "templateId": "9790f68f599ac47f5aa4559e818d8142",
                                    "id": "",
                                    "type": "首页封面",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "说明",
                                    "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                    "id": "",
                                    "type": "说明",
                                    "baseProjectId": ""
                                })
                            }
                            if(reportName == "复查报告"){
                                tabPanes.push({
                                    "name": "个人复查报告-基本信息",
                                    "templateId": "3d02bb2d81c7b4a129706fd3b0bb18a6",
                                    "id": "",
                                    "type": "个人复查报告-基本信息",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });
                            }else {
                                let conclusionTemplateId = "2209519a9c327c9be267aa7d54ef2d51"
                                if (_this.isSplitConclusion) {
                                    conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                                }
                                tabPanes.push({
                                    "name": "检查结果及处理意见",
                                    "templateId": conclusionTemplateId,
                                    "id": "",
                                    "type": "检查结果及处理意见",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "问诊科检查表",
                                    "templateId": templateIdWzk,
                                    "id": "",
                                    "type": "问诊科检查表",
                                    "baseProjectId": ""
                                });
                            }
                        }

                        let groupItemIds = [];
                        let groupItemIdsEye = [];
                        let groupItemIdsFK = [];
                        let groupItemIdsTGFX = [];
                        let healthCheckup = ["皮肤科常规(职业)","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];
                        let healthCheckupEye = ["眼科", "眼科常规(视力)","眼科常规(职业)", "眼科常规（视力）", "眼科常规（色觉）", "眼科常规（色觉、视力）", "眼科常规(健康)"];
                        let healthCheckupFK = ["妇科", "妇科查体", "妇科常规", "妇科检查", "宫颈癌筛查", "白带常规", "宫颈刮片"];
                        let healthCheckupTGFX = ["皮肤科常规(职业)","一般检查","耳科听力常规","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];


                        let tabItems = data.departResults;
                        // let tabItems = tabItemsData;
                        let departItemResults = data.departItemResults;
                        let arrNew = [];
                        if (tabItems && tabItems.length > 0) {
                            for (let i = 0; i < tabItems.length; i++) {
                                if (tabItems[i] && tabItems[i].groupItemId && ((abandonInspectionIdData  && abandonInspectionIdData.indexOf(tabItems[i].groupItemId) <= -1) || _this.$hospitalName && _this.$hospitalName.isShowReportGiveUpItem)) {//存在弃检项目 报告中是否展示弃检项目

                                    if(tabItems[i].checkSignPath && tabItems[i].checkSignPath.indexOf("/dcm") > -1){
                                        tabItems[i].checkSign = tabItems[i].checkSignPath;
                                    }
                                    if(reportName == "复查报告"){
                                        //只展示复查的报告
                                        if ( this.$hospitalName && !this.$hospitalName.isInitialMerger){
                                            if (tabItems[i].groupItemName && tabItems[i].groupItemName.indexOf("复") <= -1) {
                                                continue;
                                            }
                                        }
                                    }else{
                                        //复检的先不到报告里
                                        if (tabItems[i].groupItemName && tabItems[i].groupItemName.indexOf("复") > -1) {
                                            let isShowReview = _this.$hospitalName.isShowReview;//是否展示复查报告
                                            if(!isShowReview){
                                            // if(!isShowReview && !this.typeStatus){
                                                continue;
                                            }
                                        }
                                    }
                                    //获取 分项汇总 检查结果数据(总览)
                                    let officeName = tabItems[i].officeName;//科室名称
                                    if(officeName){
                                        officeName = tabItems[i].officeName.trim();//科室名称
                                    }
                                    let groupItemName = tabItems[i].groupItemName;//项目名称
                                    if(groupItemName){
                                        groupItemName = groupItemName.trim();
                                    }
                                    let diagnoseTipNow = tabItems[i].diagnoseTip;//影像所见
                                    if(diagnoseTipNow){
                                        diagnoseTipNow = diagnoseTipNow.trim().replaceAll("\r","").replaceAll("\n","");
                                    }
                                    //DR、CT、彩超只展示一张报告
                                    if(officeName && tabPanes && groupItemName && groupItemName.indexOf("复") <= -1){
                                        /*if(officeName.indexOf("DR") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                let groupItemNameNow = item.name;
                                                if(officeNameNow && officeNameNow.indexOf("DR") > -1 && groupItemNameNow && groupItemNameNow.indexOf("胸") > -1 && groupItemName.indexOf("胸") > -1){
                                                    item.name += "、" + groupItemName;//DR项目名称合并
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }*/
                                        /*if(officeName.indexOf("DR") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                let groupItemNameNow = item.name;
                                                if(officeNameNow && officeNameNow.indexOf("DR") > -1){
                                                    item.name += "、" + groupItemName;//DR项目名称合并
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }*/
                                        if(officeName && officeName.indexOf("DR") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                let groupItemNameNow = item.name;
                                                let inspectResult = item.inspectResult;
                                                if(inspectResult){
                                                    inspectResult = inspectResult.trim().replaceAll("\r","").replaceAll("\n","");
                                                }
                                                if(officeNameNow && officeNameNow.indexOf("DR") > -1 && diagnoseTipNow && inspectResult && diagnoseTipNow == inspectResult){
                                                    item.name += "、" + groupItemName;//DR项目名称合并
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        /*if(officeName.indexOf("CT") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("CT") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        if(officeName.indexOf("彩超") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("彩超") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }*/
                                    }
                                    let dataOfficeFXHZ = ["一般检查", "五官科","耳鼻喉科","耳鼻咽喉科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图","检验科","DR室","CT室","彩超室"];//分项汇总 科室名称集
                                    let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科","耳鼻咽喉科","耳鼻喉科", "口腔科", "眼科","检验科","DR室","CT室","彩超室"];//分项汇总和后面详细报告 都有的 科室名称集
                                    let dataGroupNameYC = ["口腔定位检查"];//牙齿画十字线(五官科、口腔科) 项目名称集
                                    if (dataOfficeFXHZ.indexOf(officeName) > -1) {
                                        groupItemIdsTGFX.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "checkDoc": tabItems[i].checkDoc,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(dataOfficeBoth.indexOf(officeName) > -1 || groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 体格检查 检查结果数据(详细)
                                    let dataOfficeTG = ["一般检查", "五官科","耳鼻咽喉科","耳鼻喉科", "口腔科", "内科", "外科", "皮肤科"]
                                    if (dataOfficeTG.indexOf(officeName) > -1) {
                                        groupItemIds.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "checkDoc": tabItems[i].checkDoc,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 眼科检查 检查结果数据(详细)
                                    if (groupItemName.indexOf("眼科") > -1 || officeName.indexOf("眼科") > -1) {
                                        groupItemIdsEye.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "checkDoc": tabItems[i].checkDoc,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //获取 妇科检查 检查结果数据(详细)
                                    if (officeName.indexOf("妇科") > -1) {
                                        groupItemIdsFK.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "checkDoc": tabItems[i].checkDoc,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //心电图图片不展示
                                    if(officeName.indexOf("心电图") > -1 && !_this.isShowZoncareImg){
                                        continue;
                                    }
                                    //其他化验项目 检查结果数据(生化合并)
                                    if(groupItemName && groupItemName.indexOf("肺功能") > -1 && this.isNotShowFGN){
                                        continue;
                                    }
                                    //判断检验科生化检查项是否合并展示
                                    if(!_this.isMergeShowJYKSH){//不合并
                                        tabPanes.push({
                                            "name": tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": tabItems[i].portfolioProjectId,
                                            "departResultId": tabItems[i].id,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "checkDoc": tabItems[i].checkDoc,
                                            "healthCheckup": [],
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": true,//是否显示基本信息
                                        });
                                    }else{//合并
                                        if(officeName && officeName.indexOf("检验科") > -1 &&groupItemName&& groupItemName.indexOf("尿常规") <= -1 && groupItemName.indexOf("血常规") <= -1 && groupItemName.indexOf("乙肝两对半") <= -1 && groupItemName.indexOf("复") <= -1){
                                            let departItemResultsNow = departItemResults.filter(ii => ii.orderGroupItemId == tabItems[i].groupItemId);
                                            departItemResultsNow = this.removeList(departItemResultsNow);
                                            let numberCount = departItemResultsNow.length
                                            if(numberCount >= 20){
                                                tabItems.push({
                                                    "name": tabItems[i].groupItemName,
                                                    "templateId": "",
                                                    "id": "",
                                                    "type": "分项报告",
                                                    "baseProjectId": tabItems[i].portfolioProjectId,
                                                    "departResultId": tabItems[i].id,
                                                    "groupItemId": tabItems[i].groupItemId,
                                                    "checkSign": tabItems[i].checkSign,
                                                    "healthCheckup": [],
                                                    "opinion": tabItems[i].diagnoseSum,//小结
                                                    "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                                    "officeName": officeName,//所属科室
                                                    "isShow": true,//是否显示基本信息
                                                });
                                            }else{
                                                arrNew.push({
                                                    index: i,
                                                    count: numberCount,
                                                })
                                            }
                                        }else{
                                            tabPanes.push({
                                                "name": tabItems[i].groupItemName,
                                                "templateId": "",
                                                "id": "",
                                                "type": "分项报告",
                                                "baseProjectId": tabItems[i].portfolioProjectId,
                                                "departResultId": tabItems[i].id,
                                                "groupItemId": tabItems[i].groupItemId,
                                                "checkSign": tabItems[i].checkSign,
                                                "healthCheckup": [],
                                                "opinion": tabItems[i].diagnoseSum,//小结
                                                "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                                "officeName": officeName,//所属科室
                                                "isShow": true,//是否显示基本信息
                                            });
                                        }
                                    }
                                }

                            }
                        }
                        let tabItemsAdd = [];
                        if(arrNew && arrNew.length > 0){
                            let groupItemIds = [];
                            let count = 0;
                            let intNew = 0;
                            for(let n = 0;n < arrNew.length;n ++){
                                let countNow = count + arrNew[n].count;
                                if(countNow < 25){
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                    if(n == arrNew.length - 1){
                                        tabItemsAdd.push({
                                            "name": tabItems[int].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": "",
                                            "departResultId": "",
                                            "groupItemId": groupItemIds,
                                            "checkSign": tabItems[int].checkSign,
                                            "checkDoc": tabItems[int].checkDoc,
                                            "healthCheckup": [],
                                            "opinion": "",//小结
                                            "inspectResult": "",//影像所见(诊断提醒)
                                            "officeName": "检验科",//所属科室
                                            "isShow": true,//是否显示基本信息
                                        })
                                    }
                                }else{
                                    tabItemsAdd.push({
                                        "name": tabItems[intNew].groupItemName,
                                        "templateId": "",
                                        "id": "",
                                        "type": "分项报告",
                                        "baseProjectId": "",
                                        "departResultId": "",
                                        "groupItemId": groupItemIds,
                                        "checkSign": tabItems[intNew].checkSign,
                                        "checkDoc": tabItems[intNew].checkDoc,
                                        "healthCheckup": [],
                                        "opinion": "",//小结
                                        "inspectResult": "",//影像所见(诊断提醒)
                                        "officeName": "检验科",//所属科室
                                        "isShow": true,//是否显示基本信息
                                    })
                                    groupItemIds = [];
                                    count = 0;
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                }
                            }
                        }
                        if(tabItemsAdd && tabItemsAdd.length > 0){
                        	if(tabItemsAdd.length == 1){
								tabPanes.push(tabItemsAdd[0]);
                            }
                        	else{
								for(let i = 0;i < tabPanes.length;i ++){
									if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1 && tabPanes[i+1].officeName && tabPanes[i+1].officeName.indexOf("检验科") <= -1){
										let intNow = i + 1;
										for(let j = 0;j < tabItemsAdd.length;j ++){
											tabPanes.splice(intNow, 0, tabItemsAdd[j]);
											intNow ++;
										}
										break;
									}
								}
                            }

                        }
                        //检验科 仅保留首页基本信息
                        for(let i = 0;i < tabPanes.length;i ++){
                            if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1){
                                tabPanes[i].isShow = true;
                                break;
                            }
                        }
                        if (physicalType && physicalType == "健康体检") {
                            let startPage;
                            if(reportName == "个人报告"){
                                if(_this.isShowPage){
                                    startPage = 4;
                                }else{
                                    startPage = 1;
                                }
                            }else if(reportName == "个人报告(含首页)"){
                                startPage = 3;
                            }else if(reportName == "复查报告"){
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger){
                                    startPage = 3
                                }else {
                                    startPage = 1;
                                }

                            }
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            // if(groupItemIdsFK.length > 0){
                            // 	fkData.healthCheckup = groupItemIdsFK;//妇科检查
                            // 	int ++;
                            // 	tabPanes.splice(int, 0, fkData);
                            // }
                            if(reportName == "复查报告"){
                                /*tabPanes.push({
                                    "name": "个人复查报告-结论",
                                    "templateId": "3d916f7a0f88deac20635a9a02cc63fa",
                                    "id": "",
                                    "type": "个人复查报告-结论",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });*/
                            }else{
                                if(_this.isShowGuidancePage){
                                    tabPanes.push({
                                        "name": "常见病保健指导",
                                        "templateId": "357fdd2cb29bd0ddcd87e2302ab75573",
                                        "id": "",
                                        "type": "常见病保健指导",
                                        "baseProjectId": ""
                                    });
                                }
                                if(_this.isSplitConclusion){
                                    tabPanes.push({
                                        "name": "健康-检查结果及处理意见",
                                        "templateId": "0fbb068c1790cb2e03b42943128cecab",
                                        "id": "",
                                        "type": "健康-检查结果及处理意见",
                                        "baseProjectId": ""
                                    });
                                }
                            }
                            if((this.$hospitalName && this.$hospitalName.isInitialMerger && reportName =="复查报告")||reportName == "个人报告"){
                                if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                    tabPanes.push({
                                        "name": "尾页封面",
                                        "templateId": "985a3cecc26f95aecba46114302f5ed3",
                                        "id": "",
                                        "type": "尾页封面",
                                        "baseProjectId": ""
                                    })
                                }
                            }
                        } else if (physicalType && physicalType == "职业体检") {
                            let startPage;
                            if(reportName == "个人报告"){
                                if(_this.isShowPage){
                                    startPage = 4;
                                }else{
                                    startPage = 2;
                                }
                            }else if(reportName == "个人报告(含首页)"){
                                startPage = 4;
                            }else if(reportName == "复查报告"){
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger){
                                    startPage = 4;
                                }else {
                                    startPage = 1;
                                }
                            }
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }

                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                            if(reportName == "复查报告"){
                                /*tabPanes.push({
                                    "name": "个人复查报告-结论",
                                    "templateId": "3d916f7a0f88deac20635a9a02cc63fa",
                                    "id": "",
                                    "type": "个人复查报告-结论",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });*/
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger  ) {
                                    if (_this.isShowPageLast) {//尾页封面
                                        tabPanes.push({
                                            "name": "尾页封面",
                                            "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                            "id": "",
                                            "type": "尾页封面",
                                            "baseProjectId": ""
                                        })
                                    }
                                }
                            }else {
                                if (_this.isSplitConclusion) {
                                    tabPanes.push({
                                        "name": "职业-检查结果及处理意见",
                                        "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                        "id": "",
                                        "type": "职业-检查结果及处理意见",
                                        "baseProjectId": ""
                                    });
                                }
                                if (reportName == "个人报告") {
                                    if (_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                        tabPanes.push({
                                            "name": "尾页封面",
                                            "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                            "id": "",
                                            "type": "尾页封面",
                                            "baseProjectId": ""
                                        })
                                    }
                                }
                                if (reportName == "个人报告(含首页)") {
                                    if (_this.isShowPageLast) {//尾页封面
                                        tabPanes.push({
                                            "name": "尾页封面",
                                            "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                            "id": "",
                                            "type": "尾页封面",
                                            "baseProjectId": ""
                                        })
                                    }
                                }
                            }
                        }else if (physicalType && physicalType == "放射体检") {
                            let startPage;
                            if(reportName == "个人报告"){
                                if(_this.isShowPage){
                                    startPage = 4;
                                }else{
                                    startPage = 2;
                                }
                            }else if(reportName == "个人报告(含首页)"){
                                startPage = 4;
                            }else if(reportName == "复查报告"){
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger){
                                    startPage = 4;
                                }else {
                                    startPage = 1;
                                }
                            }
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            if(groupItemIdsEye && groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                tabPanes.splice(int, 0, eyeData);
                            }
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                            if(reportName == "复查报告"){
                                /*tabPanes.push({
                                    "name": "个人复查报告-结论",
                                    "templateId": "3d916f7a0f88deac20635a9a02cc63fa",
                                    "id": "",
                                    "type": "个人复查报告-结论",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                });*/
                                if (this.$hospitalName && this.$hospitalName.isInitialMerger) {
                                    if (_this.isShowPageLast) {//尾页封面
                                        tabPanes.push({
                                            "name": "尾页封面",
                                            "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                            "id": "",
                                            "type": "尾页封面",
                                            "baseProjectId": ""
                                        })
                                    }
                                }
                            }else {
                                if (_this.isSplitConclusion) {
                                    tabPanes.push({
                                        "name": "职业-检查结果及处理意见",
                                        "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                        "id": "",
                                        "type": "职业-检查结果及处理意见",
                                        "baseProjectId": ""
                                    });
                                }
                            }
                            if((this.$hospitalName && this.$hospitalName.isInitialMerger && reportName =="复查报告") ||reportName == "个人报告"){
                                if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                    tabPanes.push({
                                        "name": "尾页封面",
                                        "templateId": "55eebcf1287dee53e68d8003392a0ba3",
                                        "id": "",
                                        "type": "尾页封面",
                                        "baseProjectId": ""
                                    })
                                }
                            }
                        }

                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow,_this.isMergeShowJYKSH);
                                let templateData = JSON.parse(resData.templateData);

                                let officeName = "";
                                if(templateData.officeName){
                                    officeName = templateData.officeName;
                                }

                                //放射科报告
                                if(officeName && officeName != "" && (officeName.indexOf("DR室") > -1 || officeName.indexOf("CT室") > -1 || officeName.indexOf("彩超室") > -1)){
                                    //申请医师
                                    if (_this.$hospitalName.isDoctor){//是否 设定申请医师名
                                        if(_this.$hospitalName.DoctorToBeExamined){//优先使用配置的名字作为申请医师名
                                            templateData.doctor = _this.$hospitalName.DoctorToBeExamined;
                                        }else if(_this.$hospitalName.legalPerson){//默认使用医院法人作为申请医师名
                                            templateData.doctor = _this.$hospitalName.legalPerson;
                                        }
                                    }
                                    //报告医师
                                    if(_this.$hospitalName.reportDoctor){
                                        templateData.reportDoctor = _this.$hospitalName.reportDoctor;
                                    }
                                }
                                /*//检验科报告
                                if (officeName && officeName != "" && officeName.indexOf("检验科") > -1){
                                    //检验者
                                    if(_this.$hospitalName.updateCheckPersonJYK){
                                        templateData.inspectDoctor = _this.$hospitalName.updateCheckPersonJYK;
                                    }
                                }*/

                                //医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
                                templateData.hospitalAddress = _this.$hospitalName.hospitalAddress;
                                //templateData.zipCode = _this.$hospitalName.zipCode;
                                templateData.hospitalPhone = _this.$hospitalName.hospitalPhone;
                                templateData.faxNumber = _this.$hospitalName.faxNumber;
                                templateData.email = _this.$hospitalName.email;
                                //联系电话(DR、CT、B超)
                                templateData.phone = _this.$hospitalName.hospitalPhone;
                                //模板名称
                                templateData.templateName = _this.$hospitalName.templateName;
                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;
                                //晶体环状图 base64
                                let base64 = _this.$hospitalName.base64;
                                templateData.jthctImageL = base64[templateData.jthctNumL];
                                templateData.jthctImageR = base64[templateData.jthctNumR];
                                //标本替换
                                let specimenDatas = _this.$hospitalName.specimenDatas;
                                let name = element.name;
                                if(name.indexOf("复")){
                                    name = name.replace("(复)","");
                                }
                                if(officeName && officeName != "" && officeName.indexOf("检验科") > -1){
                                    if(specimenDatas[name] && specimenDatas[name] != undefined){
                                        templateData.specimen = specimenDatas[name].specimenName;
                                    }else {
                                        if(name.indexOf("血常规") > -1){
                                            templateData.specimen = "全血";
                                        }else if(name.indexOf("尿常规") > -1){
                                            templateData.specimen = "尿液";
                                        }else{
                                            templateData.specimen = "血清";
                                        }
                                    }
                                }
                                //项目名称
                                templateData.projectNamePath = element.name;
                                //模板替换
                                let baseProjectId = resData.baseProjectId;
                                if(officeName.indexOf("检验科") > -1){

									if(name.indexOf("血常规") <= -1 && name.indexOf("尿常规") <= -1){
                                        if(name.indexOf("乙肝两对半") > -1){
                                            baseProjectId = "552";//乙肝两对半模板 乙肝两对半
                                        }else{
                                            baseProjectId = "1213";//血清模板 血清ALT
                                        }
                                    }else if(name.indexOf("血常规") > -1){
                                        baseProjectId = "130e9bd972973c03ddbbb227d94a0278";//血常规模板 血常规
                                    }else{
                                        baseProjectId = "954";//尿常规模板 尿常规
                                    }
                                }
                                if(name.indexOf("幽门螺旋杆菌") > -1 && _this.$hospitalName.isShowC14){
                                    baseProjectId = "e4ab65498defd56f073206395afe90cc";
                                }
                                if(!_this.$hospitalName.isShowC14){
                                    templateData.histogramImage = {"x":["参考值","检测结果"],"y":[0,0]};
                                }
                                if(officeName.indexOf("DR室") > -1){
                                    baseProjectId = "1256";//DR模板 胸部正侧位DR（不含片）
                                }
                                if(officeName.indexOf("CT室") > -1){
                                    baseProjectId = "755";//CT模板 胸椎椎体CT平扫（不含片）
                                }
                                if(officeName.indexOf("彩超室") > -1){
                                    baseProjectId = "XXM0156";//彩超模板 肝肾B超
                                }
                                if(officeName.indexOf("肺功能") > -1){
                                    baseProjectId = "1479";//肺功能模板 肺功能(职业)
                                }
                                if(officeName.indexOf("电测听") > -1){
                                    baseProjectId = "1361";//电测听模板 纯音测听
                                }
                                if(officeName.indexOf("口腔科") > -1){
                                    baseProjectId = "4f1a8bb758ae783a6d3c699f63b10832";//口腔科模板 口腔定位检查
                                }
                                if(officeName.indexOf("心电图") > -1){
                                    baseProjectId = "1279";//心电图模板 频谱心电图
                                }

                                //检查类型
                                if(_this.physicalType){
                                    templateData.phyType = _this.physicalType;

                                    if(_this.physicalType.indexOf("放射体检")>-1){
                                        if(_this.$hospitalName && _this.$hospitalName.isHideCheckNameAndSignFSTJ){
                                            templateData.doctor = "";//申请医师
                                            templateData.reportDoctor = "";//报告医师
                                            templateData.inspectDoctor = "";//检查医师(检验者)
                                            templateData.autograph = "";//医生签名
                                        }
                                    }
                                }

                                let isShowArray = [];
                                if(templateData && templateData.isShow && officeName.indexOf("检验科") > -1){
                                    isShowArray.push({
                                        name: templateData.name,
                                        sex: templateData.sex,
                                        age: templateData.age,
                                        sectionOffice: templateData.sectionOffice,
                                        doctor: templateData.doctor,
                                        specimen: templateData.specimen,
                                        testNum: templateData.testNum,
                                        templateName: templateData.templateName,
                                        reviewName: templateData.reviewName,
                                    });
                                }
                                templateData.isShowArray = isShowArray;

                                resData.baseProjectId = baseProjectId;

                                if(resData.baseProjectId || resData.id){
                                    resData.templateData = JSON.stringify(templateData);
                                    wordData.push(resData);
                                }
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name,testNum:personInfo.test_num}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据(个人体检报告)
            batchHandDataTJJL(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let templateId = "";
                        let physicalType = personInfo.physical_type;
                        if (physicalType == "健康体检") {
                            templateId = "fe91d48556bc54ae224beebcbaece476";
                        }else if (physicalType == "职业体检") {
                            templateId = "6adc35bad272d6d87d802290cb103db7";
                        }else if(physicalType == "放射体检"){
                            templateId = "9790f68f599ac47f5aa4559e818d8142";
                        }
                        let tabPanes = [];
                        if (physicalType && physicalType == "健康体检") {
                            let conclusionTemplateId = "bbff5be6d0c0f92f63e812f843628ac0"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "c159055269e6b64c7f1451ad28c5b545";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见(结论)",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });
                        } else if (physicalType && physicalType == "职业体检") {
                            let conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见(结论)",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });
                        } else if (physicalType && physicalType == "放射体检") {
                            let conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见(结论)",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });
                        }



                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            let departItemResults = [];
                            let tabItems = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;

                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //批量打印(告知书)
            batchPrintTemplateGZS(){
                generateReportByPersonIdsNotice(this.personIds).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandDataNotice(res.data);
                        //获取报告
                        this.getReportWordBatchNotice(batchData);
                    } else {
                        this.$Modal.remove();
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.$Message.error(res);
                    this.$Modal.remove();
                    this.closeLoading();
                })
            },
            //批量打印(封面)
            batchPrintTemplateFM(){
                generateReportByPersonIdsfirstPage(this.personIds).then(res => {
                    if (res && res.success) {
                        this.$Modal.remove();
                        //组装数据
                        let batchData = this.batchHandDatafirstPage(res.data);
                        //获取报告
                        this.getReportWordBatchfirstPage(batchData);
                    } else {
                        this.$Modal.remove();
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.$Message.error(res);
                    this.$Modal.remove();
                    this.closeLoading();
                })
            },
            /**
             * 获取体检报告(告知书)
             */
            getReportWordBatchNotice(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "告知书"}).then(res => {
                    _this.closeLoading();
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        // this.previewHtmlUrl = url;
                        _this.previewHtmlUrlGZS = url;
                        setTimeout(function () {
                            _this.$refs.previewHtmlTemplateGZS.contentWindow.print();
                        }, 1000)
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            /**
             * 获取体检报告(封面)
             */
            getReportWordBatchfirstPage(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "封面模板"}).then(res => {
                    _this.closeLoading();
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        _this.previewHtmlUrlFM = url;
                        setTimeout(function () {
                            _this.$refs.previewHtmlTemplateFM.contentWindow.print();
                        }, 1000)
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                });
            },
            /**
             * 获取体检报告(个人体检结论)
             */
            getReportWordBatchTJJL(data) {
                let _this = this;
                getReportWordBatch({data: data,name: "个人体检结论"}).then(res => {
                    if(_this.isBatchPrint){
                        _this.closeLoading();
                    }
                    if (res.success) {
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                        _this.previewHtmlUrlTJJL = url;
                        if(_this.isBatchPrint){
                            setTimeout(function () {
                                _this.$refs.previewHtmlTemplateTJJL.contentWindow.print();
                            }, 1000)
                        }
                    }
                }).catch(function (error) {
                    _this.closeLoading();
                    _this.closeLoading();
                });
            },
            init(){
                if (this.typeStatus){
                    this.tabsClickIndex = "3"
                } else if(!this.isShowReport){
                    this.tabsClickIndex = "5";
                }
                if(this.taskNow && this.taskNow == "批量下载pdf"){
                    if(this.personIds && this.personIds.length > 0){
                        this.downloadPdfGetData(this.personIds);
                    }
                }else{
                    //报告展示
                    if(this.personIds && this.personIds.length > 0){
                        this.tabPanes = [];
                        if(this.isBatchPrint){
                            if(!this.typeStatus){
                                if(this.tabsClickIndex == 0){
                                    this.batchPrintTemplate();
                                }else if(this.tabsClickIndex == 1){
                                    this.batchPrintTemplateGZS();
                                }else if(this.tabsClickIndex == 2 && this.isShowFirstPage){
                                    this.batchPrintTemplateFM();
                                }else if(this.tabsClickIndex == 4){
                                    this.batchPrintTemplateTJJL();
                                }else if(this.tabsClickIndex == 5){
                                    this.batchPrintTemplateFisrtFM();
                                }
                            }else{
                                if (this.tabsClickIndex == 1){
                                    this.batchPrintTemplateGZS();
                                }else if (this.tabsClickIndex == 3) {
                                    this.batchPrintTemplateFC();
                                }


                                /*if(this.tabsClickIndex == 3){
                                    this.batchPrintTemplateFC();
                                }*/
                            }
                        }else{
                            this.personId = this.personIds[0];
                            // this.personChange();
                            if(!this.typeStatus){
                                this.batchPrintTemplate();
                                if(this.physicalType == "职业体检"|| this.physicalType == '放射体检'){
                                    this.noticeChange();
                                }
                                if((this.physicalType == '职业体检' || this.physicalType == '健康体检' || this.physicalType == '放射体检')){
                                    this.firstPageChange();
                                    this.batchPrintTemplateFisrtFM();
                                }
                                if(this.physicalType == "职业体检"|| this.physicalType == '放射体检'){
                                    this.batchPrintTemplateTJJL()
                                }
                            }else{
                                // if(this.isReview && (this.physicalType == "职业体检" || this.physicalType == "放射体检")){
                                /*if(this.physicalType == "职业体检" || this.physicalType == "放射体检"){
                                    this.batchPrintTemplateFC();
                                }*/
                                if ((this.physicalType == '职业体检' || this.physicalType == '健康体检' || this.physicalType == '放射体检')){
                                    this.batchPrintTemplateFC();
                                }

                            }
                        }
                    }
                }
            },
            downloadPdfGetData(ids){
                // this.loading = true;
                this.ptfLoading = true;
                let tabsClickIndex = this.tabsClickIndex;
                let name = "";
                if(tabsClickIndex == 0){
                    name = "个检报告p";
                    generateReportByPersonIds(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandData(res.data,"个人报告");
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 1){
                    name = "告知书p";
                    generateReportByPersonIdsNotice(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDataNotice(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 2  && this.isShowFirstPage){
                    name = "封面模板p";
                    generateReportByPersonIdsfirstPage(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDatafirstPage(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 3){
                    name = "复查报告p";
                    if(!this.typeStatus){
                        generateReportByPersonIdsFC(ids).then(res => {
                            if (res && res.success) {
                                this.$Modal.remove();
                                //组装数据
                                let batchData = this.batchHandData(res.data,"复查报告");
                                this.downloadPdf(batchData,name);
                            } else {
                                this.$Modal.remove();
                                this.$Message.error(res.msg);
                            }
                        }).catch(res => {
                            this.$Message.error(res);
                            this.$Modal.remove();
                            this.closeLoading();
                        })
                    }else{
                        generateReportByPersonIdsTypeStatus(ids).then(res => {
                            if (res && res.success) {
                                this.$Modal.remove();
                                //组装数据
                                let batchData = this.batchHandData(res.data,"复查报告");
                                this.downloadPdf(batchData,name);
                            } else {
                                this.$Modal.remove();
                                this.$Message.error(res.msg);
                            }
                        }).catch(res => {
                            this.$Message.error(res);
                            console.log(res);
                            this.$Modal.remove();
                            this.closeLoading();
                        })
                    }
                }else if(tabsClickIndex == 4){
                    name = "个人体检结论p";
                    generateReportByPersonIdsTJJL(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDataTJJL(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 5){
                    name = "个检报告(含首页封面)p";
                    generateReportByPersonIds(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandData(res.data,"个人报告(含首页)");
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }
            },
            downloadPdf(data,name){
                let _this = this;
                let fileName = name.replaceAll("p","") + ".zip";
                if(name && name.indexOf("封面模板")>-1){
                    fileName = "封面.zip";
                }
                exportTemplatePdfBatch({data: data,name: name}).then(res => {
                    var reader = new FileReader();
                    reader.readAsText(res,'utf-8');
                    reader.onload = function(e){
                        let resData = "";
                        if(reader.result && reader.result.indexOf("PK") <= -1){
                            resData = JSON.parse(reader.result);
                        }
                        if(resData && resData != "" && resData.success != undefined && !resData.success){
                            _this.$Message.error(resData.msg);
                        }else{
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
                        }
                        _this.loading = false;
                        _this.ptfLoading = false;
                        _this.closeLoading();
                    }
                }).catch(function (error) {
                    _this.$Message.error("批量下载Pdf报告异常！");
                    _this.loading = false;
                    _this.ptfLoading = false;
                    _this.closeLoading();
                });
            },
            //获取阳性结果建议
            getPositiveResultData(val) {
                let _this = this;
                if (val) {
                    let positiveResultData = val;
                    let handleOpinion = "";
                    if (positiveResultData){
                        for (let i=0;i<positiveResultData.length;i++){
                            let index = i+1;
                            handleOpinion += _this.numToCapital(index)+"、"+positiveResultData[i].positiveName +"\n"
                            handleOpinion += "    "+positiveResultData[i].positiveSuggestion.replaceAll("\n","\n    ") +"\n"
                        }
                        return handleOpinion;
                    }else {
                        return "";
                    }
                }else {
                    return "";
                }
            },
            //获取职业健康检查结论
            getTdTjBadrsnsResultData(val) {
                let _this = this;
                if (val) {
                    /*1.目前未见异常（汽油、噪声）；
                    2.复查（木粉尘）；
                    3.疑是职业病（木粉尘）；
                    4.职业禁忌证（电焊烟尘）；
                    5.其他疾病或异常（矽尘，血葡萄糖减少 1mmol/L）)*/
                    let tdTjBadrsnsData = val;
                    let tdTjBadrsnsResult = "";
                    let intText = 0;
                    let resultWJYC = [];//未见异常结论
                    resultWJYC = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12001")
                    if(resultWJYC && resultWJYC.length>0){
                        let badrsnTexts = "";
                        for(let i = 0;i < resultWJYC.length;i ++){
                            if(!badrsnTexts){
                                badrsnTexts = resultWJYC[i].typeName;
                            }else{
                                badrsnTexts += "、" + resultWJYC[i].typeName;
                            }
                        }
                        if(badrsnTexts){
                            intText ++;
                            tdTjBadrsnsResult += "" + intText + ".目前未见异常（" + badrsnTexts + "）"
                        }
                    }
                    let resultFC = [];//复查结论
                    resultFC = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12002")
                    if(resultFC && resultFC.length>0){
                        let badrsnTexts = "";
                        for(let i = 0;i < resultFC.length;i ++){
                            if(!badrsnTexts){
                                badrsnTexts = resultFC[i].typeName;
                            }else{
                                badrsnTexts += "、" + resultFC[i].typeName;
                            }
                        }
                        if(badrsnTexts){
                            intText ++;
                            tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".复查（" + badrsnTexts + "）"
                        }
                    }
                    let resultZYB = [];//疑是职业病结论
                    resultZYB = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12003")
                    if(resultZYB && resultZYB.length>0){
                        let badrsnTexts = "";
                        for(let i = 0;i < resultZYB.length;i ++){
                            if(!badrsnTexts){
                                badrsnTexts = resultZYB[i].typeName;
                            }else{
                                badrsnTexts += "、" + resultZYB[i].typeName;
                            }
                        }
                        if(badrsnTexts){
                            intText ++;
                            tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".疑是职业病（" + badrsnTexts + "）"
                        }
                    }
                    let resultJJZ = [];//职业禁忌证结论
                    resultJJZ = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12004")
                    if(resultJJZ && resultJJZ.length>0){
                        let badrsnTexts = "";
                        for(let i = 0;i < resultJJZ.length;i ++){
                            if(!badrsnTexts){
                                badrsnTexts = resultJJZ[i].typeName;
                            }else{
                                badrsnTexts += "、" + resultJJZ[i].typeName;
                            }
                        }
                        if(badrsnTexts){
                            intText ++;
                            tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".职业禁忌证（" + badrsnTexts + "）"
                        }
                    }
                    let resultQTYC = [];//其他异常结论
                    resultQTYC = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12005")
                    if(resultQTYC && resultQTYC.length>0){
                        let badrsnTexts = "";
                        let qtjbNames = "";
                        for(let i = 0;i < resultQTYC.length;i ++){
                            if(!badrsnTexts){
                                badrsnTexts = resultQTYC[i].typeName;
                            }else{
                                badrsnTexts += "、" + resultQTYC[i].typeName;
                            }
                            if(!qtjbNames && resultQTYC[i].qtjbName){
                                qtjbNames = "，" + resultQTYC[i].qtjbName.replace(" ","").replace(/\r|\n/ig, "");
                            }
                        }
                        if(badrsnTexts){
                            intText ++;
                            tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".其他疾病或异常（" + badrsnTexts + qtjbNames + "）"
                        }
                    }
                    if (tdTjBadrsnsData){
                        return tdTjBadrsnsResult;
                    }else {
                        return "";
                    }
                }else {
                    return "";
                }
            },
            //阿拉伯数字转大写，整数转大写
            numToCapital(num, type){
                if (!num) return 0
                const strNum = Number((num + '').replace(/[,，]*/g, '')) + '' // 记录字符
                num = parseInt(Number(strNum)) // 转为整数，
                let capitalAr = '零一二三四五六七八九十'
                let unitAr = ['十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千']
                if (type) {
                    capitalAr = '零壹贰叁肆伍陆柒捌玖拾'
                    unitAr = ['拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'] // 单位
                }
                const resultAr = [] // 记录结果，后边json.in就可
                let index = strNum.length - 1 //记录位数
                let idx = 0 // 记录单位
                let percent = 10
                const turnNum = (num, percent, index) => {
                    const unit = num / percent
                    const capital = capitalAr[Number(strNum[index])]
                    if (unit < 1) {
                        resultAr.push(capital)
                        // 出现11【一十一】这种情况
                        if (Number(strNum[index]) === 1 && (strNum.length === 2 || strNum.length === 6 || strNum.length === 10)) {
                            resultAr.pop()
                        }
                        return false //结束递归
                    } else {
                        if (capital === '零') {
                            // 万和亿单位不删除
                            if (!['万', '亿'].includes(resultAr[resultAr.length - 1])) {
                                resultAr.pop()
                            }
                            // 前面有零在删掉一个零
                            if (resultAr[resultAr.length - 1] === '零') {
                                resultAr.pop()
                            }
                        }
                        resultAr.push(capital)
                        // 过滤存在【零万】【零亿】这种情况
                        if (['万', '亿'].includes(resultAr[resultAr.length - 2]) && capital === '零') {
                            resultAr.pop()
                        }
                        // 过滤【1亿万】这种情况
                        if (resultAr[0] === '万' && resultAr[1] === '亿') {
                            resultAr.shift()
                        }
                        // 末尾【零】删掉
                        if (resultAr[0] === '零') {
                            resultAr.pop()
                        }
                        resultAr.push(unitAr[idx++])
                        turnNum(num, percent * 10, --index)
                    }
                }
                turnNum(num, percent, index)
                return resultAr.reverse().join('')
            }
        },
        mounted() {
            //是否展示尾面 false不展示 true 展示
            this.isShowPageLast = this.$hospitalName.isShowPageLast;
            //是否不展示肺功能详细报告 true 不展示 false 展示
            this.isNotShowFGN = this.$hospitalName.isNotShowFGN;

            //是否展示页面(首页尾页及相关说明) false不展示 true 展示
            this.isShowPage = this.$hospitalName.isShowPage;

            //是否展示个人报告(不含首页封面的)
            this.isShowReport = this.$hospitalName.isShowReport;

            //是否展示首页封面模板
            this.isShowFirstPage = this.$hospitalName.isShowFirstPage;
            //是否拆分结论页(师古需求)
            this.isSplitConclusion = this.$hospitalName.isSplitConclusion;
            //是否展示保健指导页面(师古需求)
            this.isShowGuidancePage = this.$hospitalName.isShowGuidancePage;
            //是否展示心电图图片(成都新华)
            this.isShowZoncareImg = this.$hospitalName.isShowZoncareImg;
            //检验科生化检查项是否合并展示
            this.isMergeShowJYKSH = this.$hospitalName.isMergeShowJYKSH;
            //个报告预览，是否打印个人体检结论页
            this.isShowReportConclusionPage = this.$hospitalName.isShowReportConclusionPage;
            this.init();
        },
        watch: {
            personIds: {
                handler(n, o) {
                    if(n){
                        this.personIds = n;
                        this.init();
                    }else {
                        this.personIds = [];
                    }
                },
                deep: true// 深度监听父组件传过来对象变化
            },
        }
    }
</script>

<style lang="less">

    .templateShow{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;

        .previewIframe{
            width: 100%;
            height: calc(100vh - 120px);
        }
    }

</style>