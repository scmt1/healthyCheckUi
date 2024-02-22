<template>

    <Modal v-model="show" title="预览" class="previewTemplateCheck" :mask-closable="false" :fullscreen="isFullscreen" :width="modalWidth" :footer-hide="true">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;cursor: pointer;">
            <p>模板预览</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <iframe id="printPdf" :src="previewHtmlUrl" frameborder="0" style="width: 100%;height: calc(100% - 10px);"
                class="pdfTemplate"></iframe>

        <!--    <div class="pdfTemplate">-->
        <!--      <pdf ref="pdf" id="printPdf" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i"></pdf>-->
        <!--    </div>-->
<!--        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            &lt;!&ndash;      <Button type="primary" :loading="loading" @click="print()">打印</Button>&ndash;&gt;
            &lt;!&ndash;      <Button type="primary" :loading="loading" @click="downloadTemplate()">下载</Button>&ndash;&gt;
        </div>-->
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
import {getTemplatePreviewData, exportTemplate} from '@/api/healthy/tTemplate'
import {formartDate} from "@/api/tools/tool";
import templateJs from "./templateJs/template";
import pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
import {getTInspectionRecordByPersonId} from "../../../api/healthy/tInspectionRecord";
import {
    queryTCareerHistoryList,
    queryTCareerHistoryAll,
    queryTPastMedicalHistoryList,
    queryTPastMedicalHistoryAll,
    queryTSymptomList,
    queryTSymptomAll
} from "../../../api/healthy/tGroupPerson";
import {queryTReviewRecordList} from "../../../api/healthy/tReviewRecord";
import {getTOrderGroup} from "@/api/healthy/tOrderGroup"

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
        physicalType: {
            type: String
        },
        personInfo: { //团检人对象
            type: Object,
            default: {}
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            isFullscreen: false,
            show: this.value,
            previewHtml: "",//预览显示
            previewHtmlUrl: "",
            numPages: null, // pdf 总页数
            loading: false,
            printName: '转图片打印',
            orderGroupData: [],//人员的 订单分组数据
            modalWidth: 800,
            height: '100%',
        }
    },
    methods: {
        init() {
            this.loading = true;
            this.previewHtmlUrl = "";
            let _this = this;

            if (!_this.TTemplateId) {//非问诊科
                let d = templateJs.joint(_this,_this.personInfo);

                let officeName = _this.personInfo.groupItems.officeName;

                //医生
                d.doctor = this.$hospitalName.legalPerson;
                //模板名称
                d.templateName = this.$hospitalName.templateName;
                //医院全称
                d.hospitalName = this.$hospitalName.name;
                //联系电话(DR、CT、B超)
                d.phone = this.$hospitalName.hospitalPhone;

                //放射科报告
                if(officeName && officeName != "" && (officeName.indexOf("DR室") > -1 || officeName.indexOf("CT室") > -1 || officeName.indexOf("彩超室") > -1)){
                    //报告医师
                    if(_this.$hospitalName.reportDoctor){
                        d.reportDoctor = _this.$hospitalName.reportDoctor;
                    }
                }
                //检验科报告
                if (officeName && officeName != "" && officeName.indexOf("检验科") > -1){
                    //检验者
                    if(_this.$hospitalName.updateCheckPersonJYK){
                        d.inspectDoctor = _this.$hospitalName.updateCheckPersonJYK;
                    }
                }
                //申请医师
                if (_this.$hospitalName.isDoctor){//是否 设定申请医师名
                    if(_this.$hospitalName.DoctorToBeExamined){//优先使用配置的名字作为申请医师名
                        d.doctor = _this.$hospitalName.DoctorToBeExamined;
                    }else if(_this.$hospitalName.legalPerson){//默认使用医院法人作为申请医师名
                        d.doctor = _this.$hospitalName.legalPerson;
                    }
                }

                //模板替换
                let baseProjectId = _this.personInfo.groupItems.portfolioProjectId
                let name = _this.personInfo.groupItems.name ? _this.personInfo.groupItems.name : _this.personInfo.groupItems.groupItemName;

                if(officeName.indexOf("检验科") > -1){
                    if(name.indexOf("血常规") <= -1 && name.indexOf("尿常规") <= -1){
                        if(name.indexOf("乙肝两对半") > -1){
                            baseProjectId = "552";//乙肝两对半模板 乙肝两对半
                        }else if (name.indexOf("染色体") > -1){
                            baseProjectId = "52e9f882f1f4b748eb007a0278668243";//染色体模板
                        }else if (name.indexOf("微核") > -1 ){
                            baseProjectId = "37e5c67e5612e343bdb800d6c57b86e7";//微核模板
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
                    d.histogramImage = {"x":["参考值","检测结果"],"y":[0,0]};
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
                if(officeName.indexOf("一般检查") > -1){
                    baseProjectId = "26493de31a5f19fef0041674aacd4982";//一般检查模板 一般检查
                }
                if(officeName.indexOf("内科") > -1){
                    baseProjectId = "26493de31a5f19fef0041674aacd4982";//内科模板 一般检查
                }
                if(officeName.indexOf("外科") > -1){
                    baseProjectId = "26493de31a5f19fef0041674aacd4982";//外科模板 一般检查
                }
                if((officeName.indexOf("五官科") > -1 || officeName.indexOf("耳鼻") > -1) && name.indexOf("眼") <= -1){
                    baseProjectId = "26493de31a5f19fef0041674aacd4982";//五官科模板 一般检查
                }
                if(officeName.indexOf("皮肤科") > -1){
                    baseProjectId = "26493de31a5f19fef0041674aacd4982";//皮肤科模板 一般检查
                }
                if(((officeName.indexOf("五官科") > -1 || officeName.indexOf("耳鼻") > -1) && name.indexOf("眼") > -1) || officeName.indexOf("眼科") > -1){
                    if(name.indexOf("放射") > -1){
                        baseProjectId = "3f2d08b3292e6a7d16316df758a85bc0";//眼科模板 眼科检查（放射）
                    }else{
                        baseProjectId = "1207";//眼科模板 眼科常规(职业)
                    }
                }
                if(officeName.indexOf("妇科") > -1){
                    baseProjectId = "1250";//妇科模板 妇科查体
                }

                //晶体环状图 base64
                let base64 = this.$hospitalName.base64;
                d.jthctImageL = base64[d.jthctNumL];
                d.jthctImageR = base64[d.jthctNumR];

                //标本替换 specimenDatas
                let specimenDatas = this.$hospitalName.specimenDatas;
                if(name.indexOf("复")){
                    name = name.replace("(复)","");
                }
                if(officeName.indexOf("检验科") > -1){
                    if(specimenDatas[name] && specimenDatas[name] != undefined){
                        d.specimen = specimenDatas[name].specimenName;
                    }else {
                        if(name.indexOf("血常规") > -1){
                            d.specimen = "全血";
                        }else if(name.indexOf("尿常规") > -1){
                            d.specimen = "尿液";
                        }else{
                            d.specimen = "血清";
                        }
                    }
                }

                let isShowArray = [];
                if(officeName.indexOf("检验科") > -1){
                    isShowArray.push({
                        name: d.name,
                        sex: d.sex,
                        age: d.age,
                        sectionOffice: d.sectionOffice,
                        doctor: d.doctor,
                        specimen: d.specimen,
                        testNum: d.testNum,
                        templateName: d.templateName,
                        reviewName: d.reviewName,
                    });
                }
                d.isShowArray = isShowArray;

                getTemplatePreviewData({
                    baseProjectId: baseProjectId,
                    templateData: JSON.stringify(d)
                }).then(res => {
                    _this.loading = false;
                    if (res && res.success) {
                        _this.previewHtml = res.data.replace("template", "div");
                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + _this.previewHtml;
                        _this.previewHtmlUrl = url;
                    } else {
                        _this.loading = false;
                        _this.$Message.error('预览请求失败');
                    }
                });
            } else {//问诊科模板
                this.height = '625px';
                let templateData = {};
                let oldTime = (new Date()).getTime();
                let time1 = formartDate(oldTime, "yyyy年MM月dd日");
                templateData.date = time1;
                templateData.name = '王伟';

                let _this = this;
                templateData.name = "/";//姓名
                templateData.testNum = "/";//体检编号
                templateData.sex = "/";//性别
                templateData.age = "/";//年龄
                templateData.unitName = "/";//单位名称
                templateData.factors = "/";//职业危害因素
                templateData.physicalType = "/";//体检类型
                templateData.education = "/";//文化程度
                templateData.familyAddress = "/";//家庭地址
                templateData.isMarry = "/";//婚姻状况
                templateData.nation = "/";//民族
                templateData.idCard = "/";//身份证号
                templateData.birthplaceName = "/";//籍贯(出生地名称)
                templateData.zipNum = "/";//邮编(出生地编码)
                templateData.workStateText = "/";//监护种类(在岗状态)
                templateData.workYe = "/";//总工龄年
                templateData.expYe = "/";//接害开始日期
                templateData.expYear = "/";//接害工龄年
                templateData.hazardFactorsText = "/";//监护危害(危害因素名称)
                templateData.menarche = "/";//初潮
                templateData.period = "/";//经期
                templateData.cycle = "/";//周期
                templateData.lastMe = "/";//停经年龄
                templateData.child = "/";//现有子女
                templateData.abort = "/";//流产
                templateData.prem = "/";//早产
                templateData.death = "/";//死产
                templateData.abnor = "/";//异常胎
                templateData.smokeState = "/";//吸烟状态
                templateData.package = "/";//包每天
                templateData.smokeYear = "/";//吸烟年
                templateData.smokeMoon = "/";//吸烟月
                templateData.drinkState = "/";//喝酒状态
                templateData.mlDay = "/";//ml每天
                templateData.drinkYear = "/";//喝酒年
                templateData.phone = "/";//联系电话
                templateData.allergies = "/";//过敏史
                templateData.allergiesInfo = "/";//过敏史异常信息
                templateData.familyHistory = "/";//家族史
                templateData.menstrualHistory = "/";//月经史
                templateData.menstrualInfo = "/";//月经史异常信息
                templateData.otherInfo = "/";//其他信息
                templateData.pastMedicalHistoryOtherInfo = "无";//既往病史其他信息
                templateData.workTypeText = "/";//工种名称
                templateData.year = "/";//年--出生日期
                templateData.month = "/";//月--出生日期
                templateData.day = "/";//日·--出生日期

                /*放射体检-问诊信息*/
                templateData.marriageDate = "/";//婚姻史-结婚日期
                templateData.spouseRadiationSituation = "/";//婚姻史-配偶接触放射线情况
                templateData.spouseHealthSituation = "/";//婚姻史-配偶职业及健康状况
                templateData.pregnancyCount = "/";//孕次
                templateData.liveBirth = "/";//活产
                templateData.abortionSmall = "/";//自然流产
                templateData.multiparous = "/";//多胎
                templateData.ectopicPregnancy = "/";//异位妊娠
                templateData.boys = "/";//现有男孩
                templateData.boysBirth = "/";//现有男孩-出生日期
                templateData.girls = "/";//现有女孩
                templateData.girlsBirth = "/";//现有女孩-出生日期
                templateData.infertilityReason = "/";//不孕不育原因
                templateData.childrensHealth = "/";//子女健康情况
                templateData.dept = "/";//所属部门
                templateData.job = "/";//职务/职称
                templateData.zipCode = "/";//邮政编码
                templateData.quitSomking = "/";//戒烟年数
                if (_this.personInfo) {
                    /*放射体检-问诊信息*/
                    if(_this.personInfo.department) {
                        templateData.dept = _this.personInfo.department;//所属部门
                    }
                    if(_this.personInfo.job) {
                        templateData.job = _this.personInfo.job;//职务/职称
                    }
                    if(_this.personInfo.zipCode) {
                        templateData.zipCode = _this.personInfo.zipCode;//邮政编码
                    }
                    if(_this.personInfo.quitSomking) {
                        templateData.quitSomking = _this.personInfo.quitSomking;//戒烟年数
                    }
                    if(_this.personInfo.marriageDate){
                        templateData.marriageDate = formartDate(_this.personInfo.marriageDate, 'yyyy年MM月dd日');
                    }
                    if(_this.personInfo.spouseRadiationSituation){
                        templateData.spouseRadiationSituation = _this.personInfo.spouseRadiationSituation;
                    }
                    if(_this.personInfo.spouseHealthSituation){
                        templateData.spouseHealthSituation = _this.personInfo.spouseHealthSituation;
                    }
                    if(_this.personInfo.pregnancyCount){
                        templateData.pregnancyCount = _this.personInfo.pregnancyCount;
                    }
                    if(_this.personInfo.liveBirth){
                        templateData.liveBirth = _this.personInfo.liveBirth;
                    }
                    if(_this.personInfo.abortionSmall){
                        templateData.abortionSmall = _this.personInfo.abortionSmall;
                    }
                    if(_this.personInfo.multiparous){
                        templateData.multiparous = _this.personInfo.multiparous;
                    }
                    if(_this.personInfo.ectopicPregnancy){
                        templateData.ectopicPregnancy = _this.personInfo.ectopicPregnancy;
                    }
                    if(_this.personInfo.boys){
                        templateData.boys = _this.personInfo.boys;
                    }
                    if(_this.personInfo.boysBirth){
                        templateData.boysBirth = _this.personInfo.boysBirth;
                    }
                    if(_this.personInfo.girls){
                        templateData.girls = _this.personInfo.girls;
                    }
                    if(_this.personInfo.girlsBirth){
                        templateData.girlsBirth = _this.personInfo.girlsBirth;
                    }
                    if(_this.personInfo.infertilityReason){
                        templateData.infertilityReason = _this.personInfo.infertilityReason;
                    }
                    if(_this.personInfo.childrensHealth){
                        templateData.childrensHealth = _this.personInfo.childrensHealth;
                    }

                    if (_this.personInfo.wzCheckAutograph) {
                        templateData.autograph = _this.personInfo.wzCheckAutograph;//问诊科签名
                    }
                    if (_this.personInfo.personName) {
                        templateData.name = _this.personInfo.personName;//姓名
                    }
                    if (_this.personInfo.testNum) {
                        templateData.testNum = _this.personInfo.testNum;//体检编号
                    }
                    if (_this.personInfo.sex) {
                        templateData.sex = _this.personInfo.sex;//性别
                    }
                    if (_this.personInfo.age) {
                        templateData.age = _this.personInfo.age + "岁";//年龄
                    }
                    if (_this.personInfo.unitName) {
                        templateData.unitName = _this.personInfo.unitName;//单位名称
                    }
                    if(_this.personInfo.hazardFactorsText) {
                        templateData.factors = _this.personInfo.hazardFactorsText;//职业危害因素
                    }
                    /*if (_this.orderGroupData) {
                        templateData.factors = this.orderGroupData.eiaFactors;//职业危害因素
                    }*/
                    if (_this.personInfo.physicalType) {
                        templateData.physicalType = _this.personInfo.physicalType;//体检类型
                    }
                    if (_this.personInfo.education) {
                        templateData.education = _this.personInfo.education;//文化程度
                    }
                    if (_this.personInfo.familyAddress) {
                        templateData.familyAddress = _this.personInfo.familyAddress;//家庭地址
                    }
                    templateData.headImg = _this.personInfo.avatar;//头像
                    if (_this.personInfo.isMarry) {
                        templateData.isMarry = _this.personInfo.isMarry;//婚姻状况
                    }
                    if (_this.personInfo.nation) {
                        templateData.nation = _this.personInfo.nation;//民族
                    }
                    if (_this.personInfo.idCard) {
                        templateData.idCard = _this.personInfo.idCard;//身份证号
                    }
                    if (_this.personInfo.birthplaceName) {
                        templateData.birthplaceName = _this.personInfo.birthplaceName;//籍贯(出生地名称)
                    }
                    if (_this.personInfo.birthplaceCode) {
                        templateData.zipNum = _this.personInfo.birthplaceCode;//邮编(出生地编码)
                    }
                    if (_this.personInfo.workStateText) {
                        templateData.workStateText = _this.personInfo.workStateText.replaceAll(" ","");//监护种类(在岗状态)
                    }
                    if (_this.personInfo.workYear && _this.personInfo.workYear!="0" && _this.personInfo.workYear!=0) {
                        templateData.workYe = _this.personInfo.workYear + "年";//总工龄年
                    }else if(_this.$hospitalName.isShowWorkingYears){
                        templateData.workYe = "0" + "年";//总工龄年
                    }
                    if (_this.personInfo.workMonth && _this.personInfo.workMonth!="0" && _this.personInfo.workMonth!=0) {
                        if(templateData.workYe.indexOf("年") > -1){
                            templateData.workYe += _this.personInfo.workMonth + "月";//总工龄月
                        }else {
                            templateData.workYe = _this.personInfo.workMonth + "月";//总工龄月
                        }
                    }else if(_this.$hospitalName.isShowWorkingYears){
                        templateData.workYe += "0" + "月";//总工龄年
                    }
                    if (_this.personInfo.exposureWorkYear && _this.personInfo.exposureWorkYear!="0" && _this.personInfo.exposureWorkYear!=0) {
                        templateData.expYear = _this.personInfo.exposureWorkYear + "年";//接害工龄
                    }else if(_this.$hospitalName.isShowWorkingYears){
                        templateData.expYear = "0" + "年";//接害工龄
                    }
                    if (_this.personInfo.exposureWorkMonth && _this.personInfo.exposureWorkMonth!="0" && _this.personInfo.exposureWorkMonth!=0) {
                        if(templateData.expYear && templateData.expYear!= "-"){
                            templateData.expYear += _this.personInfo.exposureWorkMonth + "月";//接害工龄
                        }else{
                            templateData.expYear = _this.personInfo.exposureWorkMonth + "月";//接害工龄
                        }
                    }else if(_this.$hospitalName.isShowWorkingYears){
                        templateData.expYear += "0" + "月";//接害工龄
                    }
                    if (_this.personInfo.exposureStartDate && _this.personInfo.workStateCode != '1001') {
                        templateData.expYe = formartDate(_this.personInfo.exposureStartDate, 'yyyy-MM-dd');//接触开始时间
                    }
                    /*if (_this.physicalType == "职业体检") {
                        if (_this.orderGroupData && _this.orderGroupData.eiaFactors) {
                            templateData.hazardFactorsText = _this.orderGroupData.eiaFactors;//职业危害因素
                        }else if (_this.personInfo.hazardFactorsText) {
                            templateData.hazardFactorsText = _this.personInfo.hazardFactorsText;//监护危害(危害因素名称)
                        }
                    } else {
                        if (_this.personInfo.hazardFactorsText) {
                            templateData.hazardFactorsText = _this.personInfo.hazardFactorsText;//监护危害(危害因素名称)
                        }
                    }*/
                    if (_this.personInfo.hazardFactorsText) {
                        templateData.hazardFactorsText = _this.personInfo.hazardFactorsText;//监护危害(危害因素名称)
                    }
                    if (_this.personInfo.existingChildren) {
                        templateData.child = _this.personInfo.existingChildren;//现有子女
                    }
                    if (_this.personInfo.abortion) {
                        templateData.abort = _this.personInfo.abortion;//流产
                    }
                    if (_this.personInfo.premature) {
                        templateData.prem = _this.personInfo.premature;//早产
                    }
                    if (_this.personInfo.death) {
                        templateData.death = _this.personInfo.death;//死产
                    }
                    if (_this.personInfo.abnormalFetus) {
                        templateData.abnor = _this.personInfo.abnormalFetus;//异常胎
                    }
                    if (_this.personInfo.smokeState) {
                      if (_this.$hospitalName && _this.$hospitalName.SmokingStatus){
                        let SmokingStatus = _this.$hospitalName.SmokingStatus[_this.personInfo.smokeState]
                        templateData.smokeState = SmokingStatus
                        if (SmokingStatus == null || SmokingStatus == undefined){
                          templateData.smokeState = _this.personInfo.smokeState
                        }
                      }else {
                        templateData.smokeState = _this.personInfo.smokeState
                      }
                    }
                    if (_this.personInfo.packageEveryDay) {
                        templateData.package = _this.personInfo.packageEveryDay;//包每天
                    }
                    if (_this.personInfo.smokeYear) {
                        templateData.smokeYear = _this.personInfo.smokeYear;//吸烟年
                    }
                    if (_this.personInfo.smokeMoon) {
                      templateData.smokeMoon = _this.personInfo.smokeMoon;//吸烟月
                    }
                    if (_this.personInfo.drinkState) {
                        templateData.drinkState = _this.personInfo.drinkState;//喝酒状态
                    }
                    if (_this.personInfo.mlEveryDay) {
                        templateData.mlDay = _this.personInfo.mlEveryDay;//ml每天
                    }
                    if (_this.personInfo.drinkYear) {
                        templateData.drinkYear = _this.personInfo.drinkYear;//喝酒年
                    }
                    if (_this.personInfo.mobile) {
                        templateData.phone = _this.personInfo.mobile;//联系电话
                    }
                    if (_this.personInfo.allergies) {
                        templateData.allergies = _this.personInfo.allergies;//过敏史
                    }
                    if (_this.personInfo.allergiesInfo) {
                        templateData.allergiesInfo = _this.personInfo.allergiesInfo;//过敏史异常信息
                    }
                    if (_this.personInfo.familyHistory) {
                        templateData.familyHistory = _this.personInfo.familyHistory;//家族史
                    }
                    if (_this.personInfo.sex != "男") {
                        if (_this.personInfo.menarche) {
                            templateData.menarche = _this.personInfo.menarche;//初潮
                        }
                        if (_this.personInfo.period) {
                            templateData.period = _this.personInfo.period;//经期
                        }
                        if (_this.personInfo.cycle) {
                            templateData.cycle = _this.personInfo.cycle;//周期
                        }
                        if (_this.personInfo.lastMenstruation) {
                            templateData.lastMe = _this.personInfo.lastMenstruation;//停经年龄
                        }
                        if (_this.personInfo.menstrualHistory) {
                            templateData.menstrualHistory = _this.personInfo.menstrualHistory;//月经史
                        }
                        if (_this.personInfo.menstrualInfo) {
                            templateData.menstrualInfo = _this.personInfo.menstrualInfo;//月经史异常信息
                        }
                    }
                    if (_this.personInfo.otherInfo) {
                        templateData.otherInfo = _this.personInfo.otherInfo;//其他信息
                    }
                    if (_this.personInfo.pastMedicalHistoryOtherInfo) {
                        templateData.pastMedicalHistoryOtherInfo = _this.personInfo.pastMedicalHistoryOtherInfo;//既往病史其他信息
                    }

                    if (_this.personInfo.workTypeText) {
                        templateData.workTypeText = _this.personInfo.workTypeText;//工种名称
                        if(templateData.workTypeText == "其他"){
                            templateData.workTypeText = _this.personInfo.workName;//工种其他名称
                        }
                    }
                    if (_this.personInfo.registDate) {
                        templateData.createTime = formartDate(_this.personInfo.registDate, 'yyyy-MM-dd');//送检时间(登记时间)
                    }
                    if (_this.personInfo.diagnosisDate) {
                        templateData.diagnosisDate = formartDate(_this.personInfo.diagnosisDate, 'yyyy-MM-dd');//诊断日期
                    }
                    if (_this.personInfo.birth) {
                        templateData.birth = formartDate(_this.personInfo.birth, 'yyyy-MM-dd');//出生日期
                        let dateArray = templateData.birth.split('-');
                        templateData.year = dateArray[0] + "年";//年--出生日期
                        templateData.month = dateArray[1] + "月";//月--出生日期
                        templateData.day = dateArray[2] + "日";//日·--出生日期

                    }
                }

                if (_this.personInfo) {
                    //查询人员的既往病史数据
                    queryTPastMedicalHistoryAll({
                        personId: _this.personInfo.id,
                    }).then(res => {
                        if (res.success) {
                            let pastMedicalHistoryData = [];//既往病史 数据集
                            if (res.data && res.data.length > 0) {
                                pastMedicalHistoryData = res.data;
                            }
                            /*既往病史数据 职业体检、放射体检、从业体检*/
                            let pastMedical = [];
                            if (pastMedicalHistoryData.length > 0) {
                                for (let i = 0; i < pastMedicalHistoryData.length; i++) {
                                    let diseaseDate = "-";
                                    if (pastMedicalHistoryData[i].diseaseDate) {
                                        diseaseDate = formartDate(pastMedicalHistoryData[i].diseaseDate, 'yyyy-MM-dd')
                                    }
                                    let diseaseName = "-";
                                    if (pastMedicalHistoryData[i].diseaseName) {
                                        diseaseName = pastMedicalHistoryData[i].diseaseName;
                                    }
                                    let diagnosticUnit = "-";
                                    if (pastMedicalHistoryData[i].diagnosticUnit) {
                                        diagnosticUnit = pastMedicalHistoryData[i].diagnosticUnit;
                                    }
                                    let afterTreatment = "-";
                                    if (pastMedicalHistoryData[i].afterTreatment) {
                                        afterTreatment = pastMedicalHistoryData[i].afterTreatment;
                                    }
                                    let fate = "-";
                                    if (pastMedicalHistoryData[i].fate) {
                                        fate = pastMedicalHistoryData[i].fate;
                                    }
                                    pastMedical.push({
                                        diseaseName: diseaseName,//疾病名称
                                        diseaseDate: diseaseDate,//诊断日期
                                        diseaseUnit: diagnosticUnit,//诊断单位
                                        afterTreatment: afterTreatment,//治疗经过
                                        fate: fate,//转归
                                    });
                                }
                            } else {
                                pastMedical.push({
                                    diseaseName: "无",
                                    diseaseDate: "",
                                    diseaseUnit: "",
                                    afterTreatment: "",
                                    fate: ""
                                });
                            }
                            templateData.pastMedical = pastMedical;

                            if (_this.physicalType != "从业体检") {
                                //查询人员的职业史数据
                                queryTCareerHistoryAll({
                                    personId: _this.personInfo.id,
                                }).then(res => {
                                    if (res.success) {
                                        if (_this.physicalType == "职业体检") {
                                            let careerHisData = [];//职业史 数据集
                                            if (res.data && res.data.length > 0) {
                                                careerHisData = res.data;
                                            }
                                            /*职业史数据 职业体检*/
                                            let careerHis = [];//起止日期 工作单位 部门 工种 有害因素 防护措施
                                            if (careerHisData.length > 0) {
                                                for (let i = 0; i < careerHisData.length; i++) {
                                                    let startEndDate = "-";
                                                    if (careerHisData[i].startDate) {
                                                        startEndDate = formartDate(careerHisData[i].startDate, 'yyyy/MM/dd') + '-' + formartDate(careerHisData[i].endDate, 'yyyy/MM/dd');
                                                    }
                                                    let workUnit = "-";
                                                    if (careerHisData[i].workUnit) {
                                                        workUnit = careerHisData[i].workUnit;
                                                    }
                                                    let workTypeText = "-";
                                                    if (careerHisData[i].workTypeText) {
                                                        workTypeText = careerHisData[i].workTypeText;
                                                        if (workTypeText == "其他") {
                                                            workTypeText = _this.personInfo.workName;
                                                        }
                                                    }
                                                    let hazardFactorsText = "-";
                                                    if (careerHisData[i].hazardFactorsText) {
                                                        hazardFactorsText = careerHisData[i].hazardFactorsText;
                                                    }
                                                    let protectiveMeasures = "-";
                                                    if (careerHisData[i].protectiveMeasures) {
                                                        protectiveMeasures = careerHisData[i].protectiveMeasures;
                                                    }
                                                    let department = "-";
                                                    if(careerHisData[i].department){
                                                        department = careerHisData[i].department;
                                                    }
                                                    careerHis.push({
                                                        startEndDate: startEndDate,//起止日期
                                                        workUnit: workUnit,//工作单位
                                                        workTypeText: workTypeText,//工种
                                                        hazardFactorsText: hazardFactorsText,//有害因素
                                                        protectiveMeasures: protectiveMeasures,//防护措施
                                                        department: department//车间(部门)
                                                    });
                                                }
                                            } else {
                                                careerHis.push({
                                                    startEndDate: "无",
                                                    workUnit: "",
                                                    workTypeText: "",
                                                    hazardFactorsText: "",
                                                    protectiveMeasures: "",
                                                    department: ""
                                                });
                                            }
                                            templateData.careerHis = careerHis;
                                        } else if (_this.physicalType == "放射体检") {
                                            let careerHisData = [];//职业史 数据集
                                            if (res.data && res.data.length > 0) {
                                                careerHisData = res.data;
                                            }
                                            /*职业史数据 放射体检*/
                                            let careerHis = [];//起止日期 工作单位 部门 工种 有害因素 防护措施
                                            let irradiationTypes = "";//职业照射种类(总览)
                                            if (careerHisData.length > 0) {
                                                for (let i = 0; i < careerHisData.length; i++) {
                                                    let startEndDate = "-";
                                                    if (careerHisData[i].startDate) {
                                                        startEndDate = formartDate(careerHisData[i].startDate, 'yyyy/MM/dd') + '-' + formartDate(careerHisData[i].endDate, 'yyyy/MM/dd');
                                                    }
                                                    let workUnit = "-";
                                                    if (careerHisData[i].workUnit) {
                                                        workUnit = careerHisData[i].workUnit;
                                                    }
                                                    let department = "-";
                                                    if (careerHisData[i].department) {
                                                        department = careerHisData[i].department;
                                                    }
                                                    let workTypeText = "-";
                                                    if (careerHisData[i].workTypeText) {
                                                        workTypeText = careerHisData[i].workTypeText;
                                                        if (workTypeText == "其他") {
                                                            workTypeText = _this.personInfo.workName;
                                                        }
                                                    }
                                                    let radiationType = "-";
                                                    if (careerHisData[i].radiationType) {
                                                        radiationType = careerHisData[i].radiationType;
                                                    }
                                                    let irradiationType = "-";
                                                    if (careerHisData[i].irradiationType) {
                                                        irradiationType = careerHisData[i].irradiationType;
                                                        if (irradiationType.indexOf(",") > -1) {
                                                            //职业照射种类名称
                                                            let irradiationTypeData = irradiationType.split(",");
                                                            //职业照射种类代码
                                                            let irradiationTypeCodeData = careerHisData[i].irradiationTypeCode.split(",");
                                                            for (let j = 0; j < irradiationTypeData.length; j++) {
                                                                //职业照射种类(总览)
                                                                irradiationTypes += irradiationTypeData[j] + irradiationTypeCodeData[j] + ";";
                                                            }
                                                        } else {
                                                            //职业照射种类(总览)
                                                            if (irradiationTypes.indexOf(irradiationType) > -1){
                                                                irradiationTypes += "";
                                                            }else {
                                                                irradiationTypes += irradiationType + careerHisData[i].irradiationTypeCode + ";";
                                                            }

                                                        }
                                                        // irradiationTypes += irradiationType + ";";
                                                    }
                                                    let workload = "-";
                                                    if (careerHisData[i].workload) {
                                                        workload = careerHisData[i].workload;
                                                    }
                                                    let exposureDose = "-";
                                                    if (careerHisData[i].exposureDose) {
                                                        exposureDose = careerHisData[i].exposureDose;
                                                    }
                                                    let overexposure = "-";
                                                    if (careerHisData[i].overexposure) {
                                                        overexposure = careerHisData[i].overexposure;
                                                    }
                                                    let remark = "-";
                                                    if (careerHisData[i].remark) {
                                                        remark = careerHisData[i].remark;
                                                    }
                                                    careerHis.push({
                                                        startEndDate: startEndDate,//起止日期
                                                        workUnit: workUnit,//工作单位
                                                        depart: department,//部门
                                                        workTypeText: workTypeText,//工种
                                                        rayingType: radiationType,//放射线种类
                                                        irradType: irradiationType,//职业照射种类
                                                        workinghours: workload,//每日工作时数或工作量
                                                        dose: exposureDose,//累积受照剂量
                                                        rayinghistory: overexposure,//过量照射史
                                                        repark: remark//备注
                                                    });
                                                }
                                            } else {
                                                careerHis.push({
                                                    startEndDate: "无",
                                                    workUnit: "",
                                                    depart: "",
                                                    workTypeText: "",
                                                    rayingType: "",
                                                    irradType: "",
                                                    workinghours: "",
                                                    dose: "",
                                                    rayinghistory: "",
                                                    repark: ""
                                                });
                                            }
                                            templateData.irradiationTypes = irradiationTypes;
                                            templateData.careerHis = careerHis;
                                        }
                                        //症状查询
                                        queryTSymptomAll({
                                            personId: _this.personInfo.id,
                                        }).then(res => {
                                            if (res.success) {
                                                if (_this.physicalType == "职业体检") {
                                                    //默认值 -
                                                    /*if(!templateData.autograph || templateData.autograph == ''){
                                                        templateData.autograph = '';
                                                    }*/
                                                    //头痛
                                                    templateData.degreeTT = "-";//程度
                                                    templateData.timeTT = "-";//病程时间
                                                    //头昏
                                                    templateData.degreeTH = "-";//程度
                                                    templateData.timeTH = "-"//病程时间
                                                    //眩晕
                                                    templateData.degreeXY = "-";//程度
                                                    templateData.timeXY = "-";//病程时间
                                                    //失眠
                                                    templateData.degreeSM = "-";//程度
                                                    templateData.timeSM = "-";//病程时间
                                                    //嗜睡
                                                    templateData.degreeSS = "-";//程度
                                                    templateData.timeSS = "-";//病程时间
                                                    //多梦
                                                    templateData.degreeDM = "-";//程度
                                                    templateData.timeDM = "-";//病程时间
                                                    //记忆力减退
                                                    templateData.degreeJYL = "-";//程度
                                                    templateData.timeJYL = "-";//病程时间
                                                    //易激动
                                                    templateData.degreeYJD = "-";//程度
                                                    templateData.timeYJD = "-";//病程时间
                                                    //疲乏无力
                                                    templateData.degreePF = "-";//程度
                                                    templateData.timePF = "-";//病程时间
                                                    //四肢麻木
                                                    templateData.degreeMM = "-";//程度
                                                    templateData.timeMM = "-";//病程时间
                                                    //动作不灵活
                                                    templateData.degreeBLH = "-";//程度
                                                    templateData.timeBLH = "-";//病程时间
                                                    //肌肉抽搐
                                                    templateData.degreeCC = "-";//程度
                                                    templateData.timeCC = "-";//病程时间
                                                    //消瘦
                                                    templateData.degreeXS = "-";//程度
                                                    templateData.timeXS = "-";//病程时间
                                                    //口渴
                                                    templateData.degreeKK = "-";//程度
                                                    templateData.timeKK = "-";//病程时间
                                                    //皮肤瘙痒
                                                    templateData.degreeSY = "-";//程度
                                                    templateData.timeSY = "-";//病程时间
                                                    //皮疹
                                                    templateData.degreePZ = "-";//程度
                                                    templateData.timePZ = "-";//病程时间
                                                    //低热
                                                    templateData.degreeDR = "-";//程度
                                                    templateData.timeDR = "-";//病程时间
                                                    //脱发
                                                    templateData.degreeTF = "-";//程度
                                                    templateData.timeTF = "-";//病程时间
                                                    //盗汗
                                                    templateData.degreeDH = "-";//程度
                                                    templateData.timeDH = "-";//病程时间
                                                    //气促
                                                    templateData.degreeQC = "-";//程度
                                                    templateData.timeQC = "-";//病程时间
                                                    //气短
                                                    templateData.degreeQD = "-";//程度
                                                    templateData.timeQD = "-";//病程时间
                                                    //胸闷
                                                    templateData.degreeMX = "-";//程度
                                                    templateData.timeMX = "-";//病程时间
                                                    //胸痛
                                                    templateData.degreeXT = "-";//程度
                                                    templateData.timeXT = "-";//病程时间
                                                    //咳嗽
                                                    templateData.degreeKS = "-";//程度
                                                    templateData.timeKS = "-";//病程时间
                                                    //咳痰
                                                    templateData.degreeKT = "-";//程度
                                                    templateData.timeKT = "-";//病程时间
                                                    //咯血
                                                    templateData.degreeLX = "-";//程度
                                                    templateData.timeLX = "-";//病程时间
                                                    //哮喘
                                                    templateData.degreeXC = "-";//程度
                                                    templateData.timeXC = "-";//病程时间
                                                    //尿频
                                                    templateData.degreeNP = "-";//程度
                                                    templateData.timeNP = "-";//病程时间
                                                    //尿急
                                                    templateData.degreeNJ = "-";//程度
                                                    templateData.timeNJ = "-";//病程时间
                                                    //尿痛
                                                    templateData.degreeNT = "-";//程度
                                                    templateData.timeNT = "-";//病程时间
                                                    //血尿
                                                    templateData.degreeXN = "-";//程度
                                                    templateData.timeXN = "-";//病程时间
                                                    //浮肿
                                                    templateData.degreeFZ = "-";//程度
                                                    templateData.timeFZ = "-";//病程时间
                                                    //性欲减退
                                                    templateData.degreeXYJT = "-";//程度
                                                    templateData.timeXYJT = "-";//病程时间
                                                    //全身酸痛
                                                    templateData.degreeQSST = "-";//程度
                                                    templateData.timeQSST = "-";//病程时间
                                                    //肌肉疼痛
                                                    templateData.degreeJRST = "-";//程度
                                                    templateData.timeJRST = "-";//病程时间
                                                    //肌无力及关节疼痛//肌无力
                                                    templateData.degreeJWL = "-";//程度
                                                    templateData.timeJWL = "-";//病程时间
                                                    //肌无力及关节疼痛//关节疼痛
                                                    templateData.degreeGJTT = "-";//程度
                                                    templateData.timeGJTT = "-";//病程时间
                                                    //视物模糊
                                                    templateData.degreeSJMH = "-";//程度
                                                    templateData.timeSJMH = "-";//病程时间
                                                    //视力下降
                                                    templateData.degreeSLXJ = "-";//程度
                                                    templateData.timeSLXJ = "-";//病程时间
                                                    //眼痛
                                                    templateData.degreeYT = "-";//程度
                                                    templateData.timeYT = "-";//病程时间
                                                    //羞明
                                                    templateData.degreeXM = "-";//程度
                                                    templateData.timeXM = "-";//病程时间
                                                    //流泪
                                                    templateData.degreeLL = "-";//程度
                                                    templateData.timeLL = "-";//病程时间
                                                    //嗅觉减退
                                                    templateData.degreeXJJT = "-";//程度
                                                    templateData.timeXJJT = "-";//病程时间
                                                    //鼻干
                                                    templateData.degreeBG = "-";//程度
                                                    templateData.timeBG = "-";//病程时间
                                                    //鼻塞
                                                    templateData.degreeBS = "-";//程度
                                                    templateData.timeBS = "-";//病程时间
                                                    //流鼻血
                                                    templateData.degreeLBX = "-";//程度
                                                    templateData.timeLBX = "-";//病程时间
                                                    //流涕
                                                    templateData.degreeLT = "-";//程度
                                                    templateData.timeLT = "-";//病程时间
                                                    //耳鸣
                                                    templateData.degreeEM = "-";//程度
                                                    templateData.timeEM = "-";//病程时间
                                                    //耳聋
                                                    templateData.degreeEN = "-";//程度
                                                    templateData.timeEN = "-";//病程时间
                                                    //流涎
                                                    templateData.degreeLY = "-";//程度
                                                    templateData.timeLY = "-";//病程时间
                                                    //牙痛
                                                    templateData.degreeYaT = "-";//程度
                                                    templateData.timeYaT = "-";//病程时间
                                                    //牙齿松动
                                                    templateData.degreeYCSD = "-";//程度
                                                    templateData.timeYCSD = "-";//病程时间
                                                    //刷牙出血
                                                    templateData.degreeSYCX = "-";//程度
                                                    templateData.timeSYCX = "-";//病程时间
                                                    //口腔异味
                                                    templateData.degreeKQYW = "-";//程度
                                                    templateData.timeKQYW = "-";//病程时间
                                                    //口腔溃疡
                                                    templateData.degreeKQKY = "-";//程度
                                                    templateData.timeKQKY = "-";//病程时间
                                                    //咽部疼痛
                                                    templateData.degreeYBTT = "-";//程度
                                                    templateData.timeYBTT = "-";//病程时间
                                                    //声嘶
                                                    templateData.degreeSSi = "-";//程度
                                                    templateData.timeSSi = "-";//病程时间
                                                    //心悸
                                                    templateData.degreeXJi = "-";//程度
                                                    templateData.timeXJi = "-";//病程时间
                                                    //心前区不适
                                                    templateData.degreeXQBS = "-";//程度
                                                    templateData.timeXQBS = "-";//病程时间
                                                    //心前区疼痛
                                                    templateData.degreeXQTT = "-";//程度
                                                    templateData.timeXQTT = "-";//病程时间
                                                    //食欲不振
                                                    templateData.degreeSYBZ = "-";//程度
                                                    templateData.timeSYBZ = "-";//病程时间
                                                    //肝区疼痛
                                                    templateData.degreeGQTT = "-";//程度
                                                    templateData.timeGQTT = "-";//病程时间
                                                    //腹胀
                                                    templateData.degreeFZ = "-";//程度
                                                    templateData.timeFZ = "-";//病程时间
                                                    //腹痛
                                                    templateData.degreeFT = "-";//程度
                                                    templateData.timeFT = "-";//病程时间
                                                    //恶心
                                                    templateData.degreeEX = "-";//程度
                                                    templateData.timeEX = "-";//病程时间
                                                    //呕吐
                                                    templateData.degreeOT = "-";//程度
                                                    templateData.timeOT = "-";//病程时间
                                                    //腹泻
                                                    templateData.degreeFX = "-";//程度
                                                    templateData.timeFX = "-";//病程时间
                                                    //便秘
                                                    templateData.degreeBM = "-";//程度
                                                    templateData.timeBM = "-";//病程时间
                                                    //便血
                                                    templateData.degreeBX = "-";//程度
                                                    templateData.timeBX = "-";//病程时间
                                                    //月经异常
                                                    templateData.degreeYJYC = "-";//程度
                                                    templateData.timeYJYC = "-";//病程时间
                                                    //皮下出血
                                                    templateData.degreePXCX = "-";//程度
                                                    templateData.timePXCX = "-";//病程时间
                                                    //多汗
                                                    templateData.degreeDH = "-";//程度
                                                    templateData.timeDH = "-";//病程时间
                                                    //色素脱失或沉着
                                                    templateData.degreeSSTX = "-";//程度
                                                    templateData.timeSSTX = "-";//病程时间
                                                    //赘生物
                                                    templateData.degreeZSW = "-";//程度
                                                    templateData.timeZSW = "-";//病程时间
                                                    //出血点
                                                    templateData.degreeCXD = "-";//程度
                                                    templateData.timeCXD = "-";//病程时间
                                                    //水泡
                                                    templateData.degreeSP = "-";//程度
                                                    templateData.timeSP = "-";//病程时间
                                                    //其他
                                                    templateData.prNaQT = "无";//项目名称
                                                    templateData.degreeQT = "-";//程度
                                                    templateData.timeQT = "-";//病程时间
                                                    /*症状数据 职业体检*/
                                                    //projectName项目名称 degree程度 courseTime病程时间
                                                    let symptomData = [];//症状 数据集
                                                    if (res.data && res.data.length > 0) {
                                                        symptomData = res.data;
                                                    }
                                                    if (symptomData.length > 0) {
                                                        for (let i = 0; i < symptomData.length; i++) {
                                                            /*if (!templateData.autograph || templateData.autograph == '') {
                                                                if(symptomData[i].createName){
                                                                    templateData.autograph = symptomData[i].createName;
                                                                }
                                                            }*/
                                                            if (symptomData[i].projectName) {
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "头痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeTT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeTT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "头昏") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeTH = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeTH = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "眩晕") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXY = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXY = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "失眠") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSM = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSM = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "嗜睡") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSS = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSS = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "多梦") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeDM = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeDM = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "记忆力减退") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeJYL = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeJYL = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "易激动") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeYJD = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeYJD = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "疲乏无力") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreePF = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timePF = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "四肢麻木") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeMM = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeMM = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "动作不灵活") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeBLH = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeBLH = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "肌肉抽搐") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeCC = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeCC = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "消瘦") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXS = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXS = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "口渴") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeKK = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeKK = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "皮肤瘙痒") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSY = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSY = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "皮疹") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreePZ = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timePZ = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "低热") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeDR = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeDR = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "脱发") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeTF = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeTF = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "盗汗") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeDH = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeDH = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "气促") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeQC = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeQC = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "气短") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeQD = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeQD = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "胸闷") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeMX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeMX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "胸痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "咳嗽") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeKS = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeKS = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "咳痰") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeKT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeKT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "咯血") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeLX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeLX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "哮喘") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXC = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXC = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "尿频") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeNP = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeNP = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                              if (symptomData[i].projectName.replaceAll(" ", "") == "尿急") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeNJ = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeNJ = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "尿痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeNT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeNT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "血尿") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXN = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXN = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "浮肿") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeFZ = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeFZ = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "性欲减退") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXYJT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXYJT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "全身酸痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeQSST = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeQSST = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "肌肉疼痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeJRST = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeJRST = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "肌无力及关节疼痛") {//肌无力
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeJWL = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeJWL = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "肌无力及关节疼痛") {//关节疼痛
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeGJTT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeGJTT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "视物模糊") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSJMH = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSJMH = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "视力下降") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSLXJ = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSLXJ = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "眼痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeYT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeYT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "羞明") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXM = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXM = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "流泪") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeLL = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeLL = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "嗅觉减退") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXJJT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXJJT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "鼻干") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeBG = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeBG = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "鼻塞") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeBS = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeBS = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "流鼻血") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeLBX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeLBX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "流涕") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeLT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeLT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "耳鸣") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeEM = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeEM = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "耳聋") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeEN = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeEN = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "流涎") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeLY = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeLY = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "牙痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeYaT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeYaT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "牙齿松动") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeYCSD = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeYCSD = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "刷牙出血") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSYCX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSYCX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "口腔异味") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeKQYW = symptomData[i].degree;//程度
                                                                    }
                                                                    templateData.timeKQYW = symptomData[i].courseTime;//病程时间
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "口腔溃疡") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeKQKY = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeKQKY = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "咽部疼痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeYBTT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeYBTT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "声嘶") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSSi = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSSi = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "心悸") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXJi = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXJi = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "心前区不适") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXQBS = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXQBS = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "心前区疼痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeXQTT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeXQTT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "食欲不振") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeSYBZ = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeSYBZ = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "肝区疼痛") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeGQTT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeGQTT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "腹胀") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeFZ = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeFZ = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                              if (symptomData[i].projectName.replaceAll(" ", "") == "腹痛") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeFT = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeFT = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "恶心") {//恶心、呕吐
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeEX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeEX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                              if (symptomData[i].projectName.replaceAll(" ", "") == "呕吐") {//恶心、呕吐
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeOT = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeOT = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "腹泻") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeFX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeFX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "便秘") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeBM = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeBM = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "便血") {
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeBX = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeBX = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                                if (symptomData[i].projectName.replaceAll(" ", "") == "月经异常") {
                                                                  if (symptomData[i].degree) {
                                                                    templateData.degreeYJYC = symptomData[i].degree;//程度
                                                                  }
                                                                  if (symptomData[i].courseTime) {
                                                                    templateData.timeYJYC = symptomData[i].courseTime;//病程时间
                                                                  }
                                                                }
                                                              if (symptomData[i].projectName.replaceAll(" ", "") == "皮下出血") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreePXCX = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timePXCX = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                              if (symptomData[i].projectName.replaceAll(" ", "") == "多汗") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeDH = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeDH = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                              if (symptomData[i].projectName.trim() == "色素脱失或沉着") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeSSTX = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeSSTX = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                              if (symptomData[i].projectName.trim() == "赘生物") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeZSW = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeZSW = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                              if (symptomData[i].projectName.trim() == "出血点(斑)") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeCXD = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeCXD = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                              if (symptomData[i].projectName.trim() == "水疱或大疱") {
                                                                if (symptomData[i].degree) {
                                                                  templateData.degreeSP = symptomData[i].degree;//程度
                                                                }
                                                                if (symptomData[i].courseTime) {
                                                                  templateData.timeSP = symptomData[i].courseTime;//病程时间
                                                                }
                                                              }
                                                                if (symptomData[i].type && symptomData[i].type.replaceAll(" ", "") == "其他") {
                                                                    templateData.prNaQT = symptomData[i].projectName;//项目名称
                                                                    if (symptomData[i].degree) {
                                                                        templateData.degreeQT = symptomData[i].degree;//程度
                                                                    }
                                                                    if (symptomData[i].courseTime) {
                                                                        templateData.timeQT = symptomData[i].courseTime;//病程时间
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else if (_this.physicalType == "放射体检") {
                                                    /*放射体检*/
                                                    /*症状数据 放射体检*/
                                                    //projectName项目名称 degree程度 courseTime病程时间
                                                    let symptomData = [];//症状 数据集
                                                    let consciousSymptoms = [];//自觉症状
                                                    if (res.data && res.data.length > 0) {
                                                        symptomData = res.data;
                                                    }
                                                    if (symptomData.length > 0) {
                                                        for (let i = 0; i < symptomData.length; i++) {
                                                            consciousSymptoms.push({
                                                                projectName: symptomData[i].projectName,
                                                                degree: symptomData[i].degree,
                                                                degreeTime: symptomData[i].courseTime,
                                                            })
                                                        }
                                                    } else {
                                                        consciousSymptoms.push({
                                                            projectName: "无",
                                                            degree: "",
                                                            degreeTime: "",
                                                        })
                                                    }
                                                    templateData.consciousSymptoms = consciousSymptoms;
                                                }
                                                getTemplatePreviewData({
                                                    id: _this.TTemplateId,
                                                    templateData: JSON.stringify(templateData)
                                                }).then(res => {
                                                    _this.loading = false;
                                                    if (res && res.success) {
                                                        _this.previewHtml = res.data;
                                                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + _this.previewHtml;
                                                        _this.previewHtmlUrl = url;
                                                    } else {
                                                        _this.loading = false;
                                                        _this.$Message.error('预览请求失败');
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                getTemplatePreviewData({
                                    id: _this.TTemplateId,
                                    templateData: JSON.stringify(templateData)
                                }).then(res => {
                                    _this.loading = false;
                                    if (res && res.success) {
                                        _this.previewHtml = res.data;
                                        let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + _this.previewHtml;
                                        _this.previewHtmlUrl = url;
                                    } else {
                                        _this.loading = false;
                                        _this.$Message.error('预览请求失败');
                                    }
                                });
                            }
                        }
                    });
                } else {
                    getTemplatePreviewData({
                        id: _this.TTemplateId,
                        templateData: JSON.stringify(templateData)
                    }).then(res => {
                        _this.loading = false;
                        if (res && res.success) {
                            _this.previewHtml = res.data;
                            let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + _this.previewHtml;
                            _this.previewHtmlUrl = url;
                        } else {
                            _this.loading = false;
                            _this.$Message.error('预览请求失败');
                        }
                    });
                }
            }


        },
        closeModal(val) {
            this.$emit('input', val);
        },
        changeFull() {
            this.isFullscreen = !this.isFullscreen;
            /*let height = document.documentElement.clientHeight;
            let element = document.querySelector(".previewTemplateCheck").querySelector(".ivu-modal-body");
            if (this.isFullscreen) {
                element.style.height = (height - 110) + "px";
            } else {
                element.style.height = (height - 300) + "px";
            }*/
        }
    },
    watch: {
        value(val) {
            this.show = val;
        },
        show(val) {
            if (val) {
                let _this = this;
				_this.isFullscreen = false;
                _this.changeFull();
                //查询人员的 订单分组数据
                let groupId
                if (_this.personInfo.group_id) {
                    groupId = _this.personInfo.group_id;
                }
                if (_this.personInfo.groupId) {
                    groupId = _this.personInfo.groupId;
                }
                _this.init();

                // 计算高度
                /*let height = document.documentElement.clientHeight;
                let element = document.querySelector(".previewTemplateCheck").querySelector(".ivu-modal-body");
                element.style.height = (height - 300) + "px";
                this.modalWidth = (document.documentElement.clientWidth - 400);
                window.onresize = () => {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    element.style.height = (height - 300) + "px";
                    this.modalWidth = (document.documentElement.clientWidth - 400);
                };*/
            } else {
                this.closeModal(false)
            }
        }
    }
}
</script>

<style lang="less">
.previewTemplateCheck {
    position: relative;

    .ivu-modal-body {
        overflow-y: auto;
        position: relative;
        background-color: #e8eaec;
        top: 0 !important;
        bottom: 0 !important;
        height: calc(100% - 60px) !important;
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
