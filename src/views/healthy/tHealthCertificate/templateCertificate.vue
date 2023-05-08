<template>
    <div class="templateCertificate">
        <Card v-if="personIds && personIds.length > 0" class="iCard">
            <iframe :src="previewHtmlUrl" frameborder="0" class="iFame"></iframe>
        </Card>
        <Card v-else>
            <!--暂无数据height: 100vh;overflow:hidden;-->
<!--            <no-data width="150" style="height: calc(100vh - 83px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>-->
            <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
        </Card>
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
    </div>
    
</template>

<script>
    import noData from "../../../components/no-data"
    import {getItemByGroupId} from "../../../api/healthy/tDepartResult";
    import {
        queryExamineFinishPersonList,
        queryTPastMedicalHistoryAll,
        testNumGeneratorBarcode
    } from "../../../api/healthy/tGroupPerson";
    import {queryAllTDepartItemResultList} from "../../../api/healthy/tDepartItemResult";
    import {formartDate} from "../../../api/tools/tool";
    import {getTInspectionRecordByPersonId} from "../../../api/healthy/tInspectionRecord";
    import {exportTemplate, getTemplatePreviewData} from '@/api/healthy/tTemplate'

    export default {
        name: "templateCertificate",
        components: {
        },
        props: {
            personIds: {
                type: Array,
                default: () => []
            },
            personInfo: {
                type: Object,
                default: {}
            },
        },
        data() {
            return {
                loading: false,
                previewHtmlUrl: "",
                TTemplateId: '9e3099965becfd67321de4729619f33f',//模板id
                queryFrom:{
                    testNum:"",//体检编号
                    orderId: "",//订单id
                    orderIdList:[],//订单列
                    personName:"",//姓名
                    sex:"",//性别
                    age: "",//年龄
                    idCard:"",//身份证号
                    id: "",
                },
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        methods: {
            /**
             * 关闭loading
             */
            closeLoading() {
                this.$emit('closeLoadingCertificate');
                this.loading = false;
            },
            init(){
                this.queryFrom.id = this.personInfo.id;
                queryExamineFinishPersonList(this.queryFrom).then(res =>{
                    if(res.success && res.data.records.length > 0){
                        this.personInfo = res.data.records[0];
                        //体检信息查询 并 获取pdf地址
                        this.getReport();
                    }
                })
            },
            /**
             * 体检信息查询 并 获取pdf地址
             */
            getReport() {
                this.loading = true;
                let _this = this;
                let templateData = {};

                let inspectionDoctor = '';//总检医生
                let conclusion = '';//结论
                let handleOpinion = '';//处理意见
                //查询组合项结果
                getItemByGroupId({groupId: _this.personInfo.groupId, personId: _this.personInfo.id,isReview: false}).then(res => {
                    if (res.success) {
                        //重新赋值，满足检查结果表字段
                        if (res.data.length > 0) {
                            let dataItem = res.data;
                            //DR胸片检查
                            let dataItemDR = dataItem.filter(item => item.officeId && item.officeId=="173" && item.name && item.name.indexOf("胸")>-1);
                            if(dataItemDR && dataItemDR.length > 0 && dataItemDR[0] && dataItemDR[0].departResult){
                                let resultDR = dataItemDR[0].departResult;
                                if(resultDR && resultDR.checkSignPath){
                                    templateData.drAutograph = resultDR.checkSignPath;//医生签名
                                    templateData.drConclusion = resultDR.diagnoseSum;//项目小结
                                }
                            }
                            //内科检查
                            let dataItemNK = dataItem.filter(item => item.name && item.name.indexOf("内科")>-1);
                            if(dataItemNK && dataItemNK.length > 0 && dataItemNK[0] && dataItemNK[0].departResult){
                                let resultNK = dataItemNK[0].departResult;
                                if(resultNK && resultNK.checkSignPath){
                                    templateData.nkAutograph = resultNK.checkSignPath;//医生签名
                                    templateData.nkConclusion = resultNK.diagnoseSum;//项目小结
                                }
                            }
                            //皮肤科检查
                            let dataItemPFK = dataItem.filter(item => item.name && item.name.indexOf("皮肤科")>-1);
                            if(dataItemPFK && dataItemPFK.length > 0 && dataItemPFK[0] && dataItemPFK[0].departResult){
                                let resultPFK = dataItemPFK[0].departResult;
                                if(resultPFK && resultPFK.checkSignPath){
                                    templateData.pfkAutograph = resultPFK.checkSignPath;//医生签名
                                    templateData.pfkConclusion = resultPFK.diagnoseSum;//项目小结
                                }
                            }
                            //大便培养
                            let dataItemDBPY = dataItem.filter(item => item.officeId && item.officeId=="186" && item.name && item.name.indexOf("大便培养")>-1);
                            if(dataItemDBPY && dataItemDBPY.length > 0 && dataItemDBPY[0] && dataItemDBPY[0].departResult){
                                let resultDBPY = dataItemDBPY[0].departResult;
                                if(resultDBPY && resultDBPY.checkSignPath){
                                    templateData.dbpyAutograph = resultDBPY.checkSignPath;//医生签名
                                    templateData.dbpyConclusion = resultDBPY.diagnoseSum;//项目小结
                                }
                            }
                            //肝功能
                            let dataItemGGN = dataItem.filter(item => item.officeId && item.officeId=="186" && item.name && item.name.indexOf("肝功能")>-1);
                            if(dataItemGGN && dataItemGGN.length > 0 && dataItemGGN[0] && dataItemGGN[0].departResult){
                                let resultGGN = dataItemGGN[0].departResult;
                                if(resultGGN && resultGGN.checkSignPath){
                                    templateData.ggnAutograph = resultGGN.checkSignPath;//医生签名
                                    templateData.jgigmAutograph = resultGGN.checkSignPath;//医生签名
                                    templateData.wgigmAutograph = resultGGN.checkSignPath;//医生签名
                                    templateData.ggnConclusion = resultGGN.diagnoseSum;//项目小结
                                }
                            }
                            //甲肝
                            let dataItemJGIGM = dataItem.filter(item => item.officeId && item.officeId=="186" && item.name && item.name.indexOf("甲肝Igm")>-1);
                            if(dataItemJGIGM && dataItemJGIGM.length > 0 && dataItemJGIGM[0] && dataItemJGIGM[0].departResult){
                                let resultJGIGM = dataItemJGIGM[0].departResult;
                                if(resultJGIGM && resultJGIGM.checkSignPath){
                                    templateData.jgigmAutograph = resultJGIGM.checkSignPath;//医生签名
                                    templateData.jgigmConclusion = resultJGIGM.diagnoseSum;//项目小结
                                }
                            }
                            //戊肝
                            let dataItemWGIGM = dataItem.filter(item => item.officeId && item.officeId=="186" && item.name && item.name.indexOf("戊肝Igm")>-1);
                            if(dataItemWGIGM && dataItemWGIGM.length > 0 && dataItemWGIGM[0] && dataItemWGIGM[0].departResult){
                                let resultWGIGM = dataItemWGIGM[0].departResult;
                                if(resultWGIGM && resultWGIGM.checkSignPath){
                                    templateData.wgigmAutograph = resultWGIGM.checkSignPath;//医生签名
                                    templateData.wgigmConclusion = resultWGIGM.diagnoseSum;//项目小结
                                }
                            }
                            //获取体检编号条码
                            testNumGeneratorBarcode({personId: _this.personInfo.id, testNum: _this.personInfo.testNum,isReviewer: false}).then(res => {
                                if (res.success) {
                                    templateData.barCodeImg = res.data;
                                    //查询基础项目检查结果数据
                                    queryAllTDepartItemResultList({personId:_this.personInfo.id}).then(res =>{
                                        if(res.success){
                                            _this.resultData = res.data;
                                            templateData.skinResults = '';//皮肤科--检查结果
                                            if(_this.resultData.length > 0){
                                                templateData.innerQT = '-';//其它--结果
                                                templateData.inNaQT = '';//其它--名称
                                                templateData.innerX = '-';//心--结果
                                                templateData.innerG = '-';//肝--结果
                                                templateData.innerP = '-';//脾--结果
                                                templateData.innerF = '-';//肺--结果
                                                for(let i = 0;i < _this.resultData.length;i ++){

                                                    /*
                                                    *
                                                    * 检查医生 checkDoc
                                                    * 检查结果 result
                                                    * 危急程度 crisisDegree
                                                    *
                                                    **/

                                                    /*表格信息 实验室检查*/
                                                    //其他
                                                    templateData.nameQT = '';//其他--项目名
                                                    templateData.resultsQT = '';//其他--检查结果
                                                    templateData.doctorQT = '';//其他--检验师
                                                    //肝功能
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("戊肝")>-1){
                                                        templateData.resultsWG = _this.resultData[i].result;//肝功能--戊肝--检查结果
                                                        templateData.doctorWG = _this.resultData[i].checkDoc;//肝功能--戊肝--检验师
                                                        templateData.positiveWG = _this.resultData[i].positive
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("甲肝")>-1){
                                                        templateData.resultsJG = _this.resultData[i].result;//肝功能--甲肝--检查结果
                                                        templateData.doctorJG = _this.resultData[i].checkDoc;//肝功能--甲肝--检验师
                                                        templateData.positiveJG = _this.resultData[i].positive
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("转氨酶")>-1){
                                                        templateData.resultsZAM = _this.resultData[i].result;//肝功能--转氨酶--检查结果
                                                        templateData.doctorZAM = _this.resultData[i].checkDoc;//肝功能--转氨酶--检验师
                                                        templateData.positiveZAM = _this.resultData[i].positive
                                                    }
                                                    //大便培养
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("沙门氏菌")>-1){
                                                        templateData.resultsSM = _this.resultData[i].result;//大便培养--沙门氏菌--检查结果
                                                        templateData.doctorSM = _this.resultData[i].checkDoc;//大便培养--沙门氏菌--检验
                                                        templateData.positiveSM = _this.resultData[i].positive
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("志贺氏菌")>-1){
                                                        templateData.resultsZH = _this.resultData[i].result;//大便培养--志贺氏菌--检查结果
                                                        templateData.doctorZH = _this.resultData[i].checkDoc;//大便培养--志贺氏菌--检验师
                                                        templateData.positiveZH = _this.resultData[i].positive
                                                    }
                                                    /*表格信息 胸部X线检查*/
                                                    //胸部X线检查
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("胸")>-1){
                                                        templateData.chestResults = '胸部X线检查,' + _this.resultData[i].result;//检查结果
                                                        templateData.chestDoctor = _this.resultData[i].checkDoc;//医生签名
                                                        templateData.chestpositiveZH = _this.resultData[i].positive
                                                    }
                                                    /*表格信息 皮肤科*/
                                                    //皮肤科
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("手癣")>-1){
                                                        if(templateData.skinResults && templateData.skinResults != ''){
                                                            templateData.skinResults += ';手癣,' + _this.resultData[i].result;///检查结果
                                                        }else{
                                                            templateData.skinResults = '手癣,' + _this.resultData[i].result;//检查结果
                                                        }
                                                        templateData.skinPositive = _this.resultData[i].positive;//是否阳性
                                                        templateData.skinDoctor = _this.resultData[i].checkDoc;//医生签名
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("皮疹")>-1){
                                                        if(templateData.skinResults && templateData.skinResults != ''){
                                                            templateData.skinResults += ';皮疹,' + _this.resultData[i].result;///检查结果
                                                        }else{
                                                            templateData.skinResults = '皮疹,' + _this.resultData[i].result;//检查结果
                                                        }
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("全身皮肤")>-1){
                                                        if(templateData.skinResults && templateData.skinResults != ''){
                                                            templateData.skinResults += ';全身皮肤,' + _this.resultData[i].result;///检查结果
                                                        }else{
                                                            templateData.skinResults = '全身皮肤,' + _this.resultData[i].result;//检查结果
                                                        }
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("指甲")>-1){
                                                        if(templateData.skinResults && templateData.skinResults != ''){
                                                            templateData.skinResults += ';指甲,' + _this.resultData[i].result;///检查结果
                                                        }else{
                                                            templateData.skinResults = '指甲,' + _this.resultData[i].result;//检查结果
                                                        }
                                                    }
                                                    /*表格信息 内科*/
                                                    //内科
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("心")>-1){
                                                        templateData.innerX = _this.resultData[i].result;//心--结果
                                                        templateData.innerDoctor = _this.resultData[i].checkDoc;//医生签名
                                                        templateData.innerXPositive = _this.resultData[i].positive;//是否阳性
                                                    }

                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("肝")>-1){
                                                        templateData.innerG = _this.resultData[i].result;//肝--结果
                                                        templateData.innerGPositive = _this.resultData[i].positive;//是否阳性
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("脾")>-1){
                                                        templateData.innerP = _this.resultData[i].result;//脾--结果
                                                        templateData.innerPositive = _this.resultData[i].positive;//是否阳性
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("肺")>-1){
                                                        templateData.innerF = _this.resultData[i].result;//肺--结果
                                                        templateData.innerFPositive = _this.resultData[i].positive;//是否阳性
                                                    }
                                                    if(_this.resultData[i].orderGroupItemProjectName && _this.resultData[i].orderGroupItemProjectName.indexOf("内科其他")>-1){
                                                        templateData.innerQT = _this.resultData[i].result;//内科其他--结果
                                                    }
                                                }
                                            }

                                            /*头像数据*/
                                            let avatar= _this.personInfo.avatarSignPath;
                                            templateData.headImg = avatar;
                                            //从业类别
                                            templateData.certificateType = _this.personInfo.certificateType;
                                            templateData.certA = "□";
                                            templateData.certB = "□";
                                            templateData.certC = "□";
                                            templateData.certD = "□";
                                            if(templateData.certificateType){
                                                if(templateData.certificateType == 1){
                                                    templateData.certA = "☑";
                                                }else if(templateData.certificateType == 2){
                                                    templateData.certB = "☑"
                                                }else if(templateData.certificateType == 3){
                                                    templateData.certC = "☑"
                                                }else if(templateData.certificateType == 4){
                                                    templateData.certD = "☑"
                                                }
                                            }
                                            /*基本信息*/
                                            templateData.dept = "-";//工作单位
                                            templateData.addressUnit = "-";//单位地址
                                            templateData.xm = "-";//姓名
                                            templateData.xb = "-";//性别
                                            templateData.nl = "-";//年龄
                                            templateData.nat = "-";//民族
                                            templateData.edu = "-";//文化程度
                                            templateData.typeW = "-";//工种
                                            templateData.yearW = "-";//工龄
                                            templateData.idCard = "-";//身份证号
                                            templateData.mobile = "-";//电话号码
                                            if(_this.personInfo.dept){
                                                templateData.dept = _this.personInfo.dept;//工作单位
                                            }
                                            if(_this.personInfo.groupUnit && _this.personInfo.groupUnit.address) {
                                                templateData.addressUnit = _this.personInfo.groupUnit.address;//单位地址
                                            }
                                            if(_this.personInfo.personName) {
                                                templateData.xm = _this.personInfo.personName;//姓名
                                            }
                                            if(_this.personInfo.age) {
                                                templateData.nl = _this.personInfo.age;//年龄
                                            }
                                            if(_this.personInfo.sex) {
                                                templateData.xb = _this.personInfo.sex;//性别
                                            }
                                            if(_this.personInfo.nation) {
                                                templateData.nat = _this.personInfo.nation;//民族
                                            }
                                            if(_this.personInfo.education) {
                                                templateData.edu = _this.personInfo.education;//文化程度
                                            }
                                            if(_this.personInfo.workTypeText) {
                                                templateData.typeW = _this.personInfo.workTypeText;//工种
                                            }
                                            if(_this.personInfo.workYear) {
                                                templateData.yearW = _this.personInfo.workYear;//工龄
                                            }
                                            if(_this.personInfo.idCard) {
                                                templateData.idCard = _this.personInfo.idCard;//身份证号
                                            }
                                            if(_this.personInfo.mobile) {
                                                templateData.mobile = _this.personInfo.mobile;//电话号码
                                            }
                                            templateData.testNum = _this.personInfo.testNum;//体检编号

                                            /*表格信息*/
                                            templateData.registDate = _this.personInfo.registDate;//体检日期
                                            let date = formartDate(_this.personInfo.registDate,'yyyy-MM-dd');
                                            let dateArray = date.split('-');
                                            templateData.year = dateArray[0];//年(体检日期)
                                            templateData.month = dateArray[1];//月(体检日期)
                                            templateData.day = dateArray[2];//日(体检日期)
                                            //查询人员的既往病史数据
                                            queryTPastMedicalHistoryAll({
                                                personId: _this.personInfo.id,
                                            }).then(res =>{
                                                if(res.success){
                                                    /*表格信息 既往病史*/
                                                    let pastMedicalHistoryData = [];//既往病史 数据集
                                                    if(res.data && res.data.length > 0){
                                                        pastMedicalHistoryData = res.data;
                                                    }
                                                    if(pastMedicalHistoryData.length > 0){
                                                        for(let i = 0;i < pastMedicalHistoryData.length;i ++){
                                                            if(pastMedicalHistoryData[i].diseaseName == "肝炎"){
                                                                if(pastMedicalHistoryData[i].diseaseDate){
                                                                    templateData.dateGY = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//肝炎--患病时间
                                                                }else{
                                                                    templateData.dateGY = "-"
                                                                }
                                                            }
                                                            if(pastMedicalHistoryData[i].diseaseName == "眼疾"){
                                                                if(pastMedicalHistoryData[i].diseaseDate){
                                                                    templateData.dateYJ = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//眼疾--患病时间
                                                                }else{
                                                                    templateData.dateYJ = "-"
                                                                }
                                                            }
                                                            if(pastMedicalHistoryData[i].diseaseName == "伤寒"){
                                                                if(pastMedicalHistoryData[i].diseaseDate){
                                                                    templateData.dateSH = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//伤寒--患病时间
                                                                }else{
                                                                    templateData.dateSH = "-"
                                                                }
                                                            }
                                                            if(pastMedicalHistoryData[i].diseaseName == "肺结核"){
                                                                if(pastMedicalHistoryData[i].diseaseDate){
                                                                    templateData.dateFJH = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//肺结核--患病时间
                                                                }else{
                                                                    templateData.dateFJH = "-"
                                                                }
                                                            }
                                                            if(pastMedicalHistoryData[i].diseaseName == "皮肤病"){
                                                                if(pastMedicalHistoryData[i].diseaseDate){
                                                                    templateData.datePFB = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//皮肤病--患病时间
                                                                }else{
                                                                    templateData.datePFB = "-"
                                                                }
                                                            }
                                                        }
                                                    }else{
                                                        templateData.dateGY = formartDate(new Date(),'yyyy-MM-dd');//肝炎--患病时间
                                                        templateData.dateYJ = formartDate(new Date(),'yyyy-MM-dd');//眼疾--患病时间
                                                        templateData.dateSH = formartDate(new Date(),'yyyy-MM-dd');//伤寒--患病时间
                                                        templateData.dateFJH = formartDate(new Date(),'yyyy-MM-dd');//肺结核--患病时间
                                                        templateData.datePFB = formartDate(new Date(),'yyyy-MM-dd');//皮肤病--患病时间
                                                    }
                                                    templateData.dateQT = '无';//其它--患病时间
                                                    templateData.contentQT = '';//其它--患病内容

                                                    //查询人员总检记录数据
                                                    getTInspectionRecordByPersonId({personId: _this.personInfo.id}).then(res => {
                                                        if (res.success) {
                                                            if (res.data) {
                                                                templateData.doctor = res.data.inspectionDoctor;//主检医生
                                                                //总检医生签名
                                                                inspectionDoctor = res.data.inspectionAutograph;
                                                                //结论
                                                                conclusion = res.data.conclusion;
                                                                handleOpinion = res.data.handleOpinion + "。";
                                                                //是否合格
                                                                let healthCertificateConditions = res.data.healthCertificateConditions;
                                                                if(healthCertificateConditions == "合格"){
                                                                    handleOpinion = healthCertificateConditions + "。";
                                                                }
                                                                if(res.data.tdiseaseDiagnosis){
                                                                    templateData.isDiseaseOne  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseOne);
                                                                    templateData.isDiseaseTwo  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseTwo);
                                                                    templateData.isDiseaseThree  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseThree);
                                                                    templateData.isDiseaseFour  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseFour);
                                                                    templateData.isDiseaseFive  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseFive);
                                                                    templateData.isDiseaseSix  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseSix);
                                                                    templateData.isDiseaseSeven  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseSeven);
                                                                    templateData.isDiseaseEight  = _this.isNot1(res.data.tdiseaseDiagnosis.isDiseaseEight);
                                                                }else{
                                                                    templateData.isDiseaseOne  = "□无   □有";
                                                                    templateData.isDiseaseTwo  = "□无   □有";
                                                                    templateData.isDiseaseThree  = "□无   □有";
                                                                    templateData.isDiseaseFour  = "□无   □有";
                                                                    templateData.isDiseaseFive  = "□无   □有";
                                                                    templateData.isDiseaseSix  = "□无   □有";
                                                                    templateData.isDiseaseSeven  = "□无   □有";
                                                                    templateData.isDiseaseEight  = "□无   □有";
                                                                }

                                                                templateData.inspectResult =  handleOpinion;//检查结果
                                                                if (conclusion.toString().trim().length>0){
                                                                    templateData.conclusion = "主检建议：" + conclusion + "。";
                                                                }
                                                                templateData.autograph = inspectionDoctor;//主检医师

                                                                //获取pdf地址
                                                                getTemplatePreviewData({id: _this.TTemplateId, templateData: JSON.stringify(templateData)}).then(res => {
                                                                    _this.loading = false;
                                                                    if (res && res.success) {
                                                                        let previewHtml = res.data.replace("template", "div");
                                                                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + previewHtml;
                                                                        _this.previewHtmlUrl = url;
                                                                    } else {
                                                                        _this.loading = false;
                                                                        _this.$Message.error('请求失败');
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            },
            //无 有
            isNot1(number){
                if(number || number==0){
                    if(number == 0){
                        return "☑无   □有"
                    }else if(number == 1){
                        return "□无   ☑有"
                    }else{
                        return "□无   □有"
                    }
                }else{
                    return "□无   □有"
                }
            },
        },
        mounted() {
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

    .templateCertificate{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        /*overflow: hidden;*/
        overflow-y: auto;

        /* 隐藏滚轮 */
        &::-webkit-scrollbar {
            width: 0;
            /*隐藏滚轮*/
            display: none;
        }

        .iCard{
            height: 100vh;
            overflow-y: auto;
            /* 隐藏滚轮 */
            &::-webkit-scrollbar {
                width: 0;
                /*隐藏滚轮*/
                display: none;
            }
        }

        .iFame{
            width: 100%;
            height: 100vh;
            overflow-y: auto;
            /* 隐藏滚轮 */
            &::-webkit-scrollbar {
                width: 0;
                /*隐藏滚轮*/
                display: none;
            }
        }

        .previewIframe{
            overflow-y: auto;
            width: 100%;
            height: calc(100vh - 120px);

            &::-webkit-scrollbar {
                width: 0;
                /*隐藏滚轮*/
                display: none;
            }
        }
    }

</style>