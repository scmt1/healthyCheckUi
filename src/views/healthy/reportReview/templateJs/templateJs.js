import {formartDate} from "@/api/tools/tool";
import de from "element-ui/src/locale/lang/de";
import it from "element-ui/src/locale/lang/it";

let templateJs = {};
let _thisJs = null;
let nkDatasYK = [];
let ekDatasKQ = [];

/*模板数据初始化*/
templateJs.dataInit = function (_this, tTemplateId, baseProjectId, tTemplateType, physicalType, personInfo, groupItemData, name, groupItemId, opinion, inspectResult, checkSign, departItemResults, healthCheckup, isShow, isMergeShowJYKSH) {
    let templateDataJs = {};
    if (!physicalType && personInfo) {
        physicalType = personInfo.physical_type;
    }
    _thisJs = _this;
    //报告判断
    if (tTemplateType && tTemplateType.trim().length > 0) {
        switch (tTemplateType) {

            case "分项报告": {
                templateDataJs = itemDataInit(_this, physicalType, personInfo, groupItemData, name, groupItemId, opinion, inspectResult, checkSign, departItemResults, isShow, isMergeShowJYKSH);
                break;
            }
            case "总检": {
                templateDataJs = inspectionDataInit(_this, personInfo, checkSign, physicalType);
                break;
            }
            case "检查结果及处理意见": {
                templateDataJs = inspectionDataInit(_this, personInfo, checkSign, physicalType, name);
                break;
            }
            case "个人复查报告-基本信息": {
                templateDataJs = inspectionDataInitFCJBXX(_this, personInfo, checkSign, physicalType);
                break;
            }
            case "个人复查报告-结论": {
                templateDataJs = inspectionDataInitFCJL(personInfo, checkSign, physicalType);
                break;
            }
            case "健康-检查结果及处理意见": {
                templateDataJs = inspectionDataInitJL(_this, personInfo, checkSign, physicalType);
                break;
            }
            case "职业-检查结果及处理意见": {
                templateDataJs = inspectionDataInitJL(_this, personInfo, checkSign, physicalType);
                break;
            }
            case "告知书": {
                templateDataJs = gzsDataInit(personInfo, checkSign, physicalType);
                break;
            }
            case "封面": {
                templateDataJs = fmDataInit(personInfo, checkSign, physicalType);
                break;
            }
            case "问诊科检查表": {
                templateDataJs = inquiryDataInit(_this, personInfo, checkSign, physicalType);
                break;
            }
            case "眼科检查": {
                templateDataJs = eyeDataInit(checkSign, departItemResults, healthCheckup, groupItemData, name);
                break;
            }
            case "妇科检查": {
                templateDataJs = fkDataInit(checkSign, departItemResults, healthCheckup);
                break;
            }
            case "体格检查": {
                templateDataJs = healthCheckupDataInit(checkSign, departItemResults, healthCheckup);
                break;
            }
            case "分项汇总": {
                templateDataJs = tgfxDataInit(_this, personInfo, checkSign, departItemResults, healthCheckup, physicalType);
                break;
            }
            default: {
                let templateData = {};
                let _this = this;
                let unitData = {};
                templateData.name = "-";//姓名
                templateData.testNum = "-";//体检编号

                if (personInfo) {
                    if (personInfo.person_name) {
                        templateData.name = personInfo.person_name;//姓名
                    }
                    if (personInfo.test_num) {
                        templateData.testNum = personInfo.test_num;//体检编号
                    }

                    if (tTemplateType == "首页封面") {
                        templateData.sex = "";//性别
                        templateData.age = "";//年龄
                        templateData.workTypeText = "";//工种名称
                        templateData.unitName = "";//单位名称
                        templateData.unitPhone = "";//单位电话
                        templateData.workStateText = "";//在岗状态
                        templateData.factors = "";//职业危害因素
                        templateData.physicalType = "";//体检类型
                        templateData.createTime = "";
                        if (personInfo.work_type_text) {
                            templateData.workTypeText = personInfo.work_type_text;//工种名称
                            if (templateData.workTypeText.indexOf("其他") > -1) {
                                templateData.workTypeText = personInfo.work_name;//工种其他名称
                            }
                        }
                        if (personInfo.department) {
                            templateData.dept = personInfo.department;//所属部门
                        }
                        if (personInfo.regist_date) {
                            templateData.createTime = formartDate(personInfo.regist_date, 'yyyy-MM-dd');//检查日期(登记时间)
                        }
                        if (personInfo.sex) {
                            templateData.sex = personInfo.sex;//性别
                        }
                        if (personInfo.age) {
                            templateData.age = personInfo.age;//年龄
                        }
                        if (personInfo.work_state_text) {
                            templateData.workStateText = personInfo.work_state_text.trim();//在岗状态
                        }
                        if (personInfo.hazard_factors_text) {
                            templateData.factors = personInfo.hazard_factors_text;//监护危害(危害因素名称)
                        }
                        templateData.headImg = personInfo.avatar;//头像
                        if (personInfo.mobile) {
                            templateData.mobile = personInfo.mobile;//联系电话
                        }
                        /*if (physicalType == "职业体检") {
                            if (personInfo.orderGroupData && personInfo.orderGroupData.eiaFactors) {
                                templateData.factors = personInfo.orderGroupData.eiaFactors;//职业危害因素
                            }else if (personInfo.hazard_factors_text) {
                                templateData.factors = personInfo.hazard_factors_text;//监护危害(危害因素名称)
                            }
                        } else {
                            if (personInfo.hazard_factors_text) {
                                templateData.factors = personInfo.hazard_factors_text;//监护危害(危害因素名称)
                            }
                        }*/
                        if (personInfo.physical_type) {
                            templateData.physicalType = personInfo.physical_type;//体检类型
                        }
                        if (personInfo.testNumCode) {
                            templateData.barCodeImg = personInfo.testNumCode;
                        }
                        //单位
                        if (templateData.unitName == "" && personInfo.unit_name) {
                            templateData.unitName = personInfo.unit_name;//单位名称
                        }
                        if (templateData.unitPhone == "" && personInfo.unit_phone) {
                            templateData.unitPhone = personInfo.unit_phone;//单位电话
                        }

                        templateDataJs = templateData;

                        // 	}
                        // });
                    } else {
                        templateDataJs = templateData;
                    }
                }
                break;
            }
        }
    }

    templateDataJs.id = personInfo.id;//id
    if (templateDataJs.officeName) {
        let officeName = templateDataJs.officeName.trim();
        if (officeName.indexOf("检验科") > -1) {
            if (name.indexOf("血常规") <= -1 && name.indexOf("尿常规") <= -1) {
                if (name.indexOf("乙肝两对半") > -1) {
                    baseProjectId = "552";//乙肝两对半模板 乙肝两对半
                }else if (name.indexOf("染色体") > -1){
                    baseProjectId = "52e9f882f1f4b748eb007a0278668243";//染色体模板
                }else if (name.indexOf("微核") > -1){
                    baseProjectId = "37e5c67e5612e343bdb800d6c57b86e7";//染微核模板
                } else {
                    baseProjectId = "1213";//血清模板 血清ALT
                }
            } else if (name.indexOf("血常规") > -1) {
                baseProjectId = "130e9bd972973c03ddbbb227d94a0278";//血常规模板 血常规
            } else {
                baseProjectId = "954";//尿常规模板 尿常规
            }
        }
        if (name.indexOf("幽门螺旋杆菌") > -1 && _this.$hospitalName.isShowC14) {
            baseProjectId = "e4ab65498defd56f073206395afe90cc";
        }
        if (!_this.$hospitalName.isShowC14) {
            templateDataJs.histogramImage = {"x": ["参考值", "检测结果"], "y": [0, 0]};
        }
        if (officeName.indexOf("DR室") > -1) {
            baseProjectId = "1256";//DR模板 胸部正侧位DR（不含片）
        }
        if (officeName.indexOf("CT室") > -1) {
            baseProjectId = "755";//CT模板 胸椎椎体CT平扫（不含片）
        }
        if (officeName.indexOf("彩超室") > -1) {
            baseProjectId = "XXM0156";//彩超模板 肝肾B超
        }
        if (officeName.indexOf("肺功能") > -1) {
            baseProjectId = "1479";//肺功能模板 肺功能(职业)
        }
        if (officeName.indexOf("电测听") > -1) {
            baseProjectId = "1361";//电测听模板 纯音测听
        }
        if (officeName.indexOf("口腔科") > -1) {
            baseProjectId = "4f1a8bb758ae783a6d3c699f63b10832";//口腔科模板 口腔定位检查
        }
        if (officeName.indexOf("心电图") > -1) {
            baseProjectId = "1279";//心电图模板 频谱心电图
        }
    }
    let previewData = {
        id: tTemplateId,
        baseProjectId: baseProjectId,
        templateData: JSON.stringify(templateDataJs)
    }
    /*if(tTemplateType == "分项报告"){
        //模板替换
        let departItemResultArr = departItemResults.filter(ii => ii.groupItemId == groupItemId);
        if (departItemResultArr && departItemResultArr.length == 0) {
            departItemResultArr = departItemResults.filter(ii => ii.orderGroupItemId == groupItemId);
        }
        let officeName = "";
        let nameNow = "";
        if(name && name != ""){
            nameNow = name;
        }
        if(departItemResultArr.length > 0 && departItemResultArr[0].officeName){
            officeName = departItemResultArr[0].officeName;
        }
        let baseProjectIdNow = "";
        if(officeName.indexOf("检验科") > -1 && nameNow.indexOf("血常规") <= -1 && nameNow.indexOf("尿常规") <= -1){
            baseProjectIdNow = "1213";//血清模板 血清ALT
        }else if(officeName.indexOf("DR室") > -1){
            baseProjectIdNow = "1256";//DR模板 胸部正侧位DR（不含片）
        }else if(officeName.indexOf("CT室") > -1){
            baseProjectIdNow = "755";//CT模板 胸椎椎体CT平扫（不含片）
        }else if(officeName.indexOf("彩超室") > -1){
            baseProjectIdNow = "XXM0156";//彩超模板 肝肾B超
        }else{
            baseProjectIdNow = baseProjectId;
        }
        previewData = {
            id: tTemplateId,
            baseProjectId: baseProjectIdNow,
            templateData: JSON.stringify(templateDataJs)
        }
    }else{
        previewData = {
            id: tTemplateId,
            baseProjectId: baseProjectId,
            templateData: JSON.stringify(templateDataJs)
        }
    }*/

    return previewData;
};


/**
 * 分项报告
 *
 */
function itemDataInit(_this, physicalType, personInfo, groupItemData, name, groupItemId, opinion, inspectResult, checkSign, departItemResults, isShow, isMergeShowJYKSH) {
    let templateData = {};
    let oldTime = (new Date()).getTime();
    let time1 = formartDate(oldTime, "yyyy年MM月dd日");
    templateData.date = time1;
    templateData.name = '王伟';
    templateData.phone = '0831-3782999';//医院-联系电话
    /*其他信息*/
    templateData.specimen = '血清';//标本
    templateData.reportNum = '01';//报告编号、标本编号
    let sealImg = '';
    templateData.sealImg = sealImg;//检查单位盖章
    /*体检人信息*/
    if (personInfo) {
        templateData.name = personInfo.person_name;//姓名
        templateData.testNum = personInfo.test_num;//体检编号(等同 条码编号、检查号)
        if (templateData.testNum && templateData.testNum.trim().length > 0) {
            let split = templateData.testNum.split("");
            if (split && split.length >= 4) {
                let length = split.length;
                templateData.codeText = split[length - 4] + split[length - 3] + split[length - 2] + split[length - 1];
            }
        }
        templateData.mobile = personInfo.mobile;
        templateData.reportNum = personInfo.test_num;
        templateData.unitName = personInfo.unit_name;//单位名称
        templateData.sex = personInfo.sex;//性别
        templateData.age = personInfo.age;//年龄

        if (departItemResults) {
            let ybjcData = departItemResults.filter(ii => ii.officeName && ii.officeName.indexOf("一般检查") > -1);
            if (ybjcData && ybjcData.length > 0) {
                let heightData = ybjcData.filter(ii => ii.orderGroupItemProjectName && ii.orderGroupItemProjectName.indexOf("身高") > -1);
                let weightData = ybjcData.filter(ii => ii.orderGroupItemProjectName && ii.orderGroupItemProjectName.indexOf("体重") > -1);
                if (heightData && heightData.length > 0 && heightData[0].result) {
                    templateData.height = heightData[0].result + "cm";//身高
                }
                if (weightData && weightData.length > 0 && weightData[0].result) {
                    templateData.weight = weightData[0].result + "kg";//体重
                }
            }
        }
    }

    templateData.isShow = isShow;

    if (name == "血常规") {

        let groupItemRusts = groupItemData.filter(ii => ii.groupItemName == name);
        if (groupItemRusts && groupItemRusts.length > 0) {
            //组合项目图像获取
            templateData.imgList = [];
            let url = "";
            if (groupItemRusts[0].url) {
                url = groupItemRusts[0].url;
                if (url.indexOf(",") > -1) {
                    let urlSplit = url.split(",")
                    if (personInfo && personInfo.dept && personInfo.dept.indexOf("宏旭") > -1) {
                        for (let i = 0; i < urlSplit.length; i++) {
                            templateData.imgList.push({img: urlSplit[i]});
                        }
                    } else {
                        for (let i = 0; i < 4; i++) {
                            if (urlSplit[i]) {
                                templateData.imgList.push({img: urlSplit[i]});
                            }
                        }
                    }

                } else {
                    templateData.imgList.push({img: url});
                }
            } else {
                templateData.imgList.push({img: "base64"});
            }
        }
    }

    if (name.indexOf("肺功能") > -1) {
        templateData.imgUrlList = [];

        let dataFGC = departItemResults.filter(ii => ii.officeName && ii.officeName.indexOf("肺功能") > -1);
        let imgUrlList = "";
        if (dataFGC != undefined && dataFGC && dataFGC.length > 0) {
            imgUrlList = dataFGC[0].imgUrl
        }
        if (imgUrlList) {
            if (imgUrlList.indexOf(",") > -1) {
                let urlSplit = imgUrlList.split(",")
                /*for(let i = 0;i < urlSplit.length;i ++){
                    td.imgUrlList.push({img:urlSplit[i].replaceAll("/tempFileUrl","")});
                }*/
                let imgData0 = urlSplit.filter(item => item && item.indexOf("-T") > -1);
                if (imgData0 && imgData0.length > 0){
                    templateData.imgUrlList.push({img: imgData0[0].replaceAll("/tempFileUrl", "")});
                }
                let imgData1 = urlSplit.filter(item => item && item.indexOf("-V") > -1);
                if (imgData1 && imgData1.length > 0){
                    templateData.imgUrlList.push({img: imgData1[0].replaceAll("/tempFileUrl", "")});
                }
            } else {
                templateData.imgUrlList.push({img: imgUrlList.replaceAll("/tempFileUrl", "")});
            }
        }
        //肺功能测试曲线展示
        templateData.showImgUrl = [];
        if (templateData.imgUrlList && templateData.imgUrlList.length > 0) {
            templateData.showImgUrl.push({
                imgUrlList: templateData.imgUrlList
            })
        }
    }

    if (name.indexOf("心电图") > -1) {
        let int = 1;
        let opinionArray = opinion.split(";");
        let opinions = "";
        opinionArray.forEach(function (e) {
            opinions += "" + int + "." + e + ";";
            int++;
        });
        templateData.opinion = opinions;//临床诊断(心电图 加序号)
    } else {
        templateData.opinion = opinion;//临床诊断
    }
    templateData.inspectResult = inspectResult;//影像所见(诊断提醒)
    templateData.autograph = checkSign;//医生签名
    templateData.projectNameTemplate = name;//项目名称
    templateData.projectTypeName = name?.includes("B超") ? "B超" : "彩超"

    //查询分检项目检查结果
    let departItemResultArr = [];
    if (groupItemId && groupItemId.length > 0) {
        // departItemResultArr = departItemResults.filter(ii => groupItemId.indexOf(ii.orderGroupItemId) > -1&& ii.result && ii.result.trim().length!=0);
        departItemResultArr = departItemResults.filter(ii => groupItemId.indexOf(ii.orderGroupItemId) > -1);
    } else {
        // departItemResultArr = departItemResults.filter(ii => ii.orderGroupItemId == groupItemId && ii.result && ii.result.trim().length!=0);
        departItemResultArr = departItemResults.filter(ii => ii.orderGroupItemId == groupItemId);
    }
    let departItemResultArrNew = [];
    for (let i = 0; i < departItemResultArr.length; i++) {
        if (departItemResultArrNew.length == 0) {
            departItemResultArrNew.push(departItemResultArr[i]);
        } else {
            let flag = true;
            for (let j = 0; j < departItemResultArrNew.length; j++) {
                if (departItemResultArr[i] && departItemResultArrNew[j] && departItemResultArr[i].orderGroupItemProjectId && departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName && departItemResultArrNew[j].orderGroupItemProjectName && departItemResultArr[i].orderGroupItemProjectId == departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName == departItemResultArrNew[j].orderGroupItemProjectName) {
                    flag = false;
                }
            }
            if (flag) {
                departItemResultArrNew.push(departItemResultArr[i]);
            }
        }
    }
    departItemResultArr = departItemResultArrNew;

    // if (departItemResultArr && departItemResultArr.length > 0) {
    if (departItemResultArr && departItemResultArr.length > 0) {
        let tableMonitoring = [];
        let index = 0;

        let resultInfo = departItemResultArr[0];
        templateData.sectionOffice = resultInfo.officeName;
        templateData.officeName = resultInfo.officeName;//科室名
        let officeName = resultInfo.officeName;
        templateData.inspectDoctor = resultInfo.checkDoc;//检验医生
        templateData.doctor = resultInfo.checkDoc;//申请医生
        // templateData.doctor = "王彬";//申请医生
        templateData.reportDoctor = resultInfo.checkDoc;//报告医生
        templateData.printDate = formartDate(oldTime, "yyyy-MM-dd");//打印日期

        if (name && name.indexOf("复") > -1) {
            templateData.reviewName = "（复）";
            if(personInfo.reviewProjectsList){
                let reviewData = personInfo.reviewProjectsList.filter(item => item.name == name && item.id == groupItemId && item.isPass == 2);
                templateData.inspectTime = reviewData && reviewData.length>0 && reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd HH:mm:ss") : formartDate(new Date(), "yyyy-MM-dd HH:mm:ss");//检查时间
                templateData.inspectDate = reviewData && reviewData.length>0 && reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd") : formartDate(new Date(), "yyyy-MM-dd");//检查日期
            }
            templateData.createTime = templateData.inspectTime;
            templateData.createDate = templateData.inspectDate;//送检日期
        } else {
            templateData.reviewName = "";
            templateData.inspectTime = personInfo && personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
            templateData.inspectDate = personInfo && personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
            templateData.createTime = templateData.inspectTime;
            templateData.createDate = templateData.inspectDate;//送检日期
        }

        //不使用登记日期作为报告上的检查日期
        if (!(_this.$hospitalName && _this.$hospitalName.isUserRegisterTimeReport)) {
            templateData.inspectTime = resultInfo.checkDate ? formartDate(resultInfo.checkDate, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
            templateData.inspectDate = resultInfo.checkDate ? formartDate(resultInfo.checkDate, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
            templateData.createTime = templateData.inspectTime;
            templateData.createDate = templateData.inspectDate;//送检日期
        }

        //检验科报告
        if (officeName && officeName != "" && officeName.indexOf("检验科") > -1) {
            //检验者
            if (_this.$hospitalName.updateCheckPersonJYK) {
                templateData.inspectDoctor = _this.$hospitalName.updateCheckPersonJYK;
            }
            if (physicalType && physicalType.indexOf("放射体检") > -1) {
                if (_this.$hospitalName && _this.$hospitalName.isHideCheckNameAndSignFSTJ) {
                    templateData.inspectDoctor = "";//检查医师(检验者)
                    templateData.autograph = "";//医生签名
                }
            }
        }

        if (officeName.indexOf("肺功能") > -1) {
            fgnDataInit(templateData, departItemResultArr);
        } else if (officeName.indexOf("电测听") > -1) {
            templateData = pureTone(departItemResultArr, templateData, _this);
            let cyDatasTZ = [];
            let cyDatasTZGD = [];
            if (personInfo.hazardFactorsText ?? personInfo.hazard_factors_text) {
                let hazardFactorsText = personInfo.hazardFactorsText ?? personInfo.hazard_factors_text;
                let hazardFactorsTextArray = [];
                if (hazardFactorsText.indexOf("|") > -1 || hazardFactorsText.indexOf("、") > -1) {
                    hazardFactorsTextArray = hazardFactorsText.split("|");
                    if (hazardFactorsTextArray.length == 0) {
                        hazardFactorsTextArray = hazardFactorsText.split("、");
                    }
                    let int = 0;
                    if (hazardFactorsTextArray.indexOf("职业机动车驾驶作业") > -1) {
                        int++;
                    }
                    if (hazardFactorsTextArray.indexOf("压力容器作业") > -1) {
                        int++;
                    }
                    if ((int < hazardFactorsTextArray.length && templateData.GFA != 0) || (_this.$hospitalName && _this.$hospitalName.isShowHighFrequency)) {
                        if (templateData.gGFA && templateData.gGFA != 0) {
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                            cyDatasTZGD.push({
                                gGFA: templateData.gGFA,
                            });
                            if (templateData.cyShowGD[0] && templateData.cyShowGD[0].cyDatasTZGD) {
                                templateData.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                            }
                        } else {
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                        }
                    } else {//不显示高频
                        if (templateData.leftImgChart["gy"] && templateData.leftImgChart["gy"].length > 0 && templateData.rightImgChart["gy"] && templateData.rightImgChart["gy"].length > 0) {
                            templateData.leftImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1], templateData.leftImgChart["y"][2], null, null, null],
                                "gy": [templateData.leftImgChart["gy"][0], templateData.leftImgChart["gy"][1], templateData.leftImgChart["gy"][2], null, null, null]
                            };
                            templateData.rightImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1], templateData.rightImgChart["y"][2], null, null, null],
                                "gy": [templateData.rightImgChart["gy"][0], templateData.rightImgChart["gy"][1], templateData.rightImgChart["gy"][2], null, null, null]
                            };
                        } else {
                            templateData.leftImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1], templateData.leftImgChart["y"][2], null, null, null]
                            };
                            templateData.rightImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1], templateData.rightImgChart["y"][2], null, null, null]
                            };
                        }
                        templateData.tGFA = '—';
                        templateData.tgGFA = '—';
                        //气体
                        templateData.r3000 = '—';
                        templateData.r4000 = '—';
                        templateData.r6000 = '—';
                        templateData.l3000 = '—';
                        templateData.l4000 = '—';
                        templateData.l6000 = '—';
                        //骨导
                        templateData.gr3000 = '—';
                        templateData.gr4000 = '—';
                        templateData.gr6000 = '—';
                        templateData.gl3000 = '—';
                        templateData.gl4000 = '—';
                        templateData.gl6000 = '—';
                    }
                } else {
                    if (!(hazardFactorsText.indexOf("机动车") > -1 || hazardFactorsText.indexOf("压力容器") > -1) || (_this.$hospitalName && _this.$hospitalName.isShowHighFrequency)) {
                        if (templateData.gGFA && templateData.gGFA != 0) {
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                            cyDatasTZGD.push({
                                gGFA: templateData.gGFA,
                            });
                            if (templateData.cyShowGD[0] && templateData.cyShowGD[0].cyDatasTZGD) {
                                templateData.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                            }
                        } else {
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                        }
                    } else {//不显示高频
                        if (templateData.leftImgChart["gy"] && templateData.leftImgChart["gy"].length > 0 && templateData.rightImgChart["gy"] && templateData.rightImgChart["gy"].length > 0) {
                            templateData.leftImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1], templateData.leftImgChart["y"][2], null, null, null],
                                "gy": [templateData.leftImgChart["gy"][0], templateData.leftImgChart["gy"][1], templateData.leftImgChart["gy"][2], null, null, null]
                            };
                            templateData.rightImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1], templateData.rightImgChart["y"][2], null, null, null],
                                "gy": [templateData.rightImgChart["gy"][0], templateData.rightImgChart["gy"][1], templateData.rightImgChart["gy"][2], null, null, null]
                            };
                        } else {
                            templateData.leftImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1], templateData.leftImgChart["y"][2], null, null, null]
                            };
                            templateData.rightImgChart = {
                                "x": ["500", "1000", "2000", "3000", "4000", "6000"],
                                "y": [templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1], templateData.rightImgChart["y"][2], null, null, null]
                            };
                        }
                        templateData.tGFA = '—';
                        templateData.tgGFA = '—';
                        //气体
                        templateData.r3000 = '—';
                        templateData.r4000 = '—';
                        templateData.r6000 = '—';
                        templateData.l3000 = '—';
                        templateData.l4000 = '—';
                        templateData.l6000 = '—';
                        //骨导
                        templateData.gr3000 = '—';
                        templateData.gr4000 = '—';
                        templateData.gr6000 = '—';
                        templateData.gl3000 = '—';
                        templateData.gl4000 = '—';
                        templateData.gl6000 = '—';
                    }
                }
                //加权值显示
                let cyDatasTZjqz = [];
                if (_this.$hospitalName.isNoise && hazardFactorsText && hazardFactorsText.indexOf("噪声") > -1) {
                    if (name ) {
                        /*cyDatasTZjqz.push({
                            WVr: templateData.WVr,
                            WVl: templateData.WVl,
                        })*/
                        let WVTEXTL = "";
                        let WVL = 0;
                        let WVTEXTR = "";
                        let WVR = 0;
                        if (templateData.WVr && templateData.WVl) {
                            WVTEXTR = "右耳语频加权值为  "
                            WVR = templateData.WVr
                            WVTEXTL = "左耳语频加权值为  "
                            WVL = templateData.WVl
                            cyDatasTZjqz.push({
                                WVTEXT: WVTEXTR,
                                WV: WVR,
                            },
                                {
                                    WVTEXT: WVTEXTL,
                                    WV: WVL,
                                })
                        }
                    }
                }else {
                    if (name && name.indexOf("复") > -1) {
                        /*cyDatasTZjqz.push({
                            WVr: templateData.WVr,
                            WVl: templateData.WVl,
                        })*/
                        let WVTEXT = "";
                        let WV = 0;
                        if (templateData.WVr && templateData.WVl) {
                                if (templateData.WVr < templateData.WVl) {
                                    // WVTEXT = "右耳语频加权值为  ";
                                    WVTEXT = "较好耳语频加权值为";
                                    WV = templateData.WVr;
                                } else if (templateData.WVr > templateData.WVl) {
                                    // WVTEXT = "左耳语频加权值为  ";
                                    WVTEXT = "较好耳语频加权值为";
                                    WV = templateData.WVl;
                                } else {
                                    // WVTEXT = "左右耳语频加权值为";
                                    WVTEXT = "较好耳语频加权值为";
                                    WV = templateData.WVr;
                                }
                            cyDatasTZjqz.push({
                                    WVTEXT: WVTEXT,
                                    WV: WV,
                                })
                        }
                    }
                }
                templateData.cyDatasTZjqz = cyDatasTZjqz;
            } else {
                if (templateData.gGFA && templateData.gGFA != 0) {
                    cyDatasTZ.push({
                        GFA: templateData.GFA,
                    });
                    cyDatasTZGD.push({
                        gGFA: templateData.gGFA,
                    });
                    if (templateData.cyShowGD[0] && templateData.cyShowGD[0].cyDatasTZGD) {
                        templateData.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                    }
                } else {
                    cyDatasTZ.push({
                        GFA: templateData.GFA,
                    });
                }
            }
            templateData.cyDatasTZ = cyDatasTZ;
        } else if (officeName.indexOf("心电图") > -1) {
            templateData = ecgImageData(departItemResultArr, templateData);
        } else if (officeName.indexOf("口腔科") > -1) {
            templateData = kqcgImageData(departItemResultArr, templateData);
        } else {
            if (name.indexOf("幽门螺旋杆菌") > -1) {
                if (departItemResultArr && departItemResultArr.length > 0) {
                    templateData.scope = departItemResultArr[0].scope;
                    if (templateData.scope && templateData.scope.indexOf("≤") > -1) {
                        templateData.scope = templateData.scope.replace("≤", "");
                    }
                    templateData.result = departItemResultArr[0].result;
                    if (templateData.result) {
                        if (templateData.result > 50) {
                            templateData.resultText = "阳性";
                        } else if (templateData.result <= 50) {
                            templateData.resultText = "阴性";
                        }
                    }
                    templateData.histogramImage = {
                        "x": ["参考值", "检测结果"],
                        "y": [templateData.scope, templateData.result]
                    };
                }
            }
            if (officeName.indexOf("检验科") > -1 && name.indexOf("尿常规") > -1) {
                if (departItemResultArr && departItemResultArr.length > 0) {
                    if (_this.$hospitalName && _this.$hospitalName.urinalysis && _this.$hospitalName.urinalysis.dryChemistry && _this.$hospitalName.urinalysis.dryChemistry) {
                        //筛选干化学项目
                        let dryChemistry = departItemResultArr.filter(i => _this.$hospitalName.urinalysis.dryChemistry.indexOf(i.shortName) > -1)
                        //筛选镜检项目
                        let microscope = departItemResultArr.filter(i => _this.$hospitalName.urinalysis.microscope.indexOf(i.shortName) > -1)

                        let baseProject = [];
                        if (dryChemistry && microscope) {
                            if (dryChemistry.length > microscope.length) {
                                baseProject = dryChemistry;
                            } else {
                                baseProject = microscope
                            }
                        }
                        //循环长度更长的项目
                        if (baseProject && baseProject.length) {
                            for (let i = 0; i < baseProject.length; i++) {
                                let monitorName = "";
                                let value = "";
                                let reference = "";
                                let unit = "";
                                let arrow = "";
                                let resultTips = "";
                                let monitorName2 = "";
                                let value2 = "";
                                let reference2 = "";
                                let unit2 = "";
                                let arrow2 = "";
                                let resultTips2 = "";
                                if (dryChemistry[i] && dryChemistry[i].orderGroupItemProjectName) {
                                    if (dryChemistry[i].orderGroupItemProjectName) {
                                        monitorName = dryChemistry[i].orderGroupItemProjectName;
                                    }
                                    if (dryChemistry[i].result) {
                                        value = dryChemistry[i].result;
                                    }
                                    if (dryChemistry[i].scope) {
                                        reference = dryChemistry[i].scope;
                                    }
                                    if (dryChemistry[i].unitName) {
                                        unit = dryChemistry[i].unitName.indexOf("无") > -1 ? "" : dryChemistry[i].unitName;
                                    }
                                    if (dryChemistry[i].arrow) {
                                        arrow = dryChemistry[i].arrow;
                                    }
                                    if (dryChemistry[i].crisisDegree) {
                                        resultTips = dryChemistry[i].crisisDegree;
                                    }
                                }
                                if (microscope[i] && microscope[i].orderGroupItemProjectName) {
                                    if (microscope[i].orderGroupItemProjectName) {
                                        monitorName2 = microscope[i].orderGroupItemProjectName;
                                    }
                                    if (microscope[i].result) {
                                        value2 = microscope[i].result;
                                    }
                                    if (microscope[i].scope) {
                                        reference2 = microscope[i].scope;
                                    }
                                    if (microscope[i].unitName) {
                                        unit2 = microscope[i].unitName.indexOf("无") > -1 ? "" : microscope[i].unitName;
                                    }
                                    if (microscope[i].arrow) {
                                        arrow2 = microscope[i].arrow;
                                    }
                                    if (microscope[i].crisisDegree) {
                                        resultTips2 = microscope[i].crisisDegree;
                                    }
                                }
                                tableMonitoring.push({
                                    monitorName: monitorName,
                                    value: value,
                                    reference: reference,
                                    unit: unit,
                                    arrow: arrow,
                                    resultTips: resultTips,
                                    monitorName2: monitorName2,
                                    value2: value2,
                                    reference2: reference2,
                                    unit2: unit2,
                                    arrow2: arrow2,
                                    resultTips2: resultTips2,
                                })
                            }
                        }
                    } else {
                        for (let n = 0; n < 11; n++) {
                            if (n < 9) {
                                let monitorName2 = "";
                                let value2 = "";
                                let reference2 = "";
                                let unit2 = "";
                                let arrow2 = "";
                                let resultTips2 = "";
                                if (departItemResultArr[n + 11] && departItemResultArr[n + 11].orderGroupItemProjectName) {
                                    if (departItemResultArr[n + 11].orderGroupItemProjectName) {
                                        monitorName2 = departItemResultArr[n + 11].orderGroupItemProjectName;
                                    }
                                    if (departItemResultArr[n + 11].result) {
                                        value2 = departItemResultArr[n + 11].result;
                                    }
                                    if (departItemResultArr[n + 11].scope) {
                                        reference2 = departItemResultArr[n + 11].scope;
                                    }
                                    if (departItemResultArr[n + 11].unitName) {
                                        unit2 = departItemResultArr[n + 11].unitName.indexOf("无") > -1 ? "" : departItemResultArr[n + 11].unitName;
                                    }
                                    if (departItemResultArr[n + 11].arrow) {
                                        arrow2 = departItemResultArr[n + 11].arrow;
                                    }
                                    if (departItemResultArr[n + 11].crisisDegree) {
                                        resultTips2 = departItemResultArr[n + 11].crisisDegree;
                                    }
                                }
                                tableMonitoring.push({
                                    monitorName: departItemResultArr[n].orderGroupItemProjectName,
                                    value: departItemResultArr[n].result,
                                    reference: departItemResultArr[n].scope,
                                    unit: departItemResultArr[n].unitName ? departItemResultArr[n].unitName.indexOf("无") > -1 ? "" : departItemResultArr[n].unitName : "",
                                    arrow: departItemResultArr[n].arrow,
                                    resultTips: departItemResultArr[n].crisisDegree,
                                    monitorName2: monitorName2,
                                    value2: value2,
                                    reference2: reference2,
                                    unit2: unit2,
                                    arrow2: arrow2,
                                    resultTips2: resultTips2,
                                });
                            } else {
                                tableMonitoring.push({
                                    monitorName: departItemResultArr[n].orderGroupItemProjectName,
                                    value: departItemResultArr[n].result,
                                    reference: departItemResultArr[n].scope,
                                    unit: departItemResultArr[n].unitName ? departItemResultArr[n].unitName.indexOf("无") > -1 ? "" : departItemResultArr[n].unitName : "",
                                    arrow: departItemResultArr[n].arrow,
                                    resultTips: departItemResultArr[n].crisisDegree,
                                    monitorName2: "",
                                    value2: "",
                                    reference2: "",
                                    unit2: "",
                                    arrow2: "",
                                    resultTips2: "",
                                });
                            }
                        }
                    }

                }
            } else if (officeName.indexOf("检验科") > -1 && name.indexOf("乙肝两对半") > -1) {
                if (departItemResultArr && departItemResultArr.length > 0) {
                    let int = 1;
                    departItemResultArr.forEach(i => {
                        //单个基础项
                        tableMonitoring.push({
                            num: int,
                            shortName: i.shortName ? i.shortName : "",
                            monitorName: i.orderGroupItemProjectName,
                            value: i.result,
                            referenceRange: i.scope,
                            unit: i.unitName,
                            arrow: i.arrow,
                            resultTips: i.crisisDegree
                        });
                        int++;
                    })
                }
            }else if (officeName.indexOf("检验科") > -1 && name.indexOf("外周血") > -1){
                if (departItemResultArr && departItemResultArr.length > 0) {
                    let int = 1;
                    departItemResultArr.forEach(i => {
                        //单个基础项
                        tableMonitoring.push({
                            num: int,
                            shortName: i.shortName ? i.shortName : "",
                            monitorName: i.orderGroupItemProjectName,
                            value: i.result,
                            referenceRange: i.scope,
                            unit: i.unitName,
                            arrow: i.arrow,
                            resultTips: i.crisisDegree
                        });
                        int++;
                    })
                }
            } else if (officeName.indexOf("检验科") > -1 && name.indexOf("血常规") > -1) {
                if (departItemResultArr && departItemResultArr.length > 0) {
                    let int = 1;
                    departItemResultArr.forEach(i => {
                        //单个基础项
                        tableMonitoring.push({
                            num: int,
                            monitorName: i.orderGroupItemProjectName,
                            value: i.result,
                            referenceRange: i.scope,
                            unit: i.unitName,
                            arrow: i.arrow,
                            resultTips: i.crisisDegree
                        });
                        int++;
                    })
                }
            } else if (officeName.indexOf("检验科") > -1 && isMergeShowJYKSH) {
                //departItemResultArr = departItemResults.filter(ii => groupItemId.indexOf(ii.orderGroupItemId) > -1);
                if (groupItemId && groupItemId.length > 0) {
                    tableMonitoring = [];
                    let departItemResultArrNow = departItemResults.filter(ii => ii.orderGroupItemId && groupItemId.indexOf(ii.orderGroupItemId) > -1);
                    let int = 1;
                    let tableMon = [];
                    departItemResultArrNow.forEach(i => {
                        //单个基础项
                        tableMon.push({
                            num: int,
                            monitorName: i.orderGroupItemProjectName,
                            value: i.result,
                            referenceRange: i.scope,
                            unit: i.unitName,
                            arrow: i.arrow,
                            resultTips: i.crisisDegree
                        });
                        int++;
                    })
                    //去重
                    tableMon = removeRepeatItem(tableMon);
                    //添入数据集
                    tableMonitoring.push({
                        tableMon: tableMon,
                        inspectDoctor: templateData.inspectDoctor,
                        createTime: templateData.createTime,
                        inspectTime: templateData.inspectTime,
                        autograph: templateData.autograph,
                    });

                } else {
                    tableMonitoring = [];
                    if (departItemResultArr && departItemResultArr.length > 0) {
                        let int = 1;
                        let tableMon = [];
                        departItemResultArr.forEach(i => {
                            //单个基础项
                            tableMon.push({
                                num: int,
                                monitorName: i.orderGroupItemProjectName,
                                value: i.result,
                                referenceRange: i.scope,
                                unit: i.unitName,
                                arrow: i.arrow,
                                resultTips: i.crisisDegree
                            });
                            int++;
                        })
                        tableMonitoring.push({
                            tableMon: tableMon,
                            inspectDoctor: templateData.inspectDoctor,
                            createTime: templateData.createTime,
                            inspectTime: templateData.inspectTime,
                            autograph: templateData.autograph,
                        });
                    }
                }
            } else {
                if (departItemResultArr && departItemResultArr.length > 0) {
                    let int = 1;
                    departItemResultArr.forEach(i => {
                        //单个基础项
                        tableMonitoring.push({
                            num: int,
                            monitorName: i.orderGroupItemProjectName,
                            value: i.result,
                            referenceRange: i.scope,
                            unit: i.unitName,
                            arrow: i.arrow,
                            resultTips: i.crisisDegree
                        });
                        int++;
                    })
                }
            }
            /*departItemResultArr.forEach(i => {
                if (i == null) {
                    i = {};
                    i.personId = personInfo.id;
                    i.orderGroupItemProjectName = i.name;
                    i.orderGroupItemProjectId = i.id;
                } else {
                    //单个基础项
                    tableMonitoring.push({
                        monitorName: i.orderGroupItemProjectName,
                        value: i.result,
                        referenceRange: i.scope,
                        unit: i.unitName,
                        arrow: i.arrow,
                        resultTips: i.crisisDegree
                    });

                }
                index++;
            });*/
        }
        templateData.tableMonitoring = tableMonitoring;
    }

    return templateData;
}

/**
 * 眼科检查
 *
 */
function eyeDataInit(checkSign, departItemResults, healthCheckup, groupItemData, name) {
    let templateData = {};
    let oldTime = (new Date()).getTime();
    let time1 = formartDate(oldTime, "yyyy-MM-dd");
    let sealImg = '';
    templateData.sealImg = sealImg;//检查单位盖章
    templateData.autograph = checkSign;//医生签名
    //眼科常规
    templateData.colorVisionRight = "-";
    templateData.colorVisionLeft = "-";
    templateData.darkAdaptationRight = "-";
    templateData.darkAdaptationLeft = "-";
    templateData.suitableFieldRight = "-";
    templateData.suitableFieldLeft = "-";
    templateData.nakedEyeRight = "-";
    templateData.nakedEyeLeft = "-";
    templateData.correctRight = "-";
    templateData.correctLeft = "-";
    templateData.conjunctivaRight = "-";
    templateData.conjunctivaLeft = "-";
    templateData.cornealRight = "-";
    templateData.cornealLeft = "-";

    templateData.nakedEyeRightY = "-";
    templateData.nakedEyeLeftY = "-";
    templateData.correctRightY = "-";
    templateData.correctLeftY = "-";
    templateData.nakedEyeRightJ = "-";
    templateData.nakedEyeLeftJ = "-";
    templateData.correctRightJ = "-";
    templateData.correctLeftJ = "-";
    templateData.nakedEyeRightS = "-";
    templateData.nakedEyeLeftS = "-";
    templateData.correctRightS = "-";
    templateData.correctLeftS = "-";

    templateData.anteriorChamberRight = "-";
    templateData.anteriorChamberLeft = "-";
    templateData.irisRight = "-";
    templateData.irisLeft = "-";
    templateData.lensRight = "-";
    templateData.lensLeft = "-";
    templateData.fundusRight = "-";
    templateData.fundusLeft = "-";
    templateData.ophthalmologyOthers = "-";//眼科其他
    templateData.crystalLeft = "-";
    templateData.glassRight = "-";
    templateData.crystalRight = "-";
    templateData.glassLeft = "-";
    templateData.anteriorPartRight = "-";
    templateData.anteriorPartLeft = "-";
    templateData.remarks = "";//备注
    templateData.jthctNumL = 1;
    templateData.jthctNumR = 1;

    if (name.indexOf("眼科") > -1) {

        let groupItemRusts = groupItemData.filter(ii => ii.groupItemName == name);
        if (groupItemRusts && groupItemRusts.length > 0) {
            //组合项目图像获取
            templateData.imgList = [];
            let url = "";
            if (groupItemRusts[0].url) {
                url = groupItemRusts[0].url;
                if (url.indexOf(",") > -1) {
                    let urlSplit = url.split(",")
                    for (let i = 0; i < urlSplit.length; i++) {
                        templateData.imgList.push({img: urlSplit[i]});
                    }
                } else {
                    templateData.imgList.push({img: url});
                }
            } else {
                templateData.imgList.push({img: "base64"});
            }
        }
    }

    if (healthCheckup && healthCheckup.length > 0) {
        let j = 0;
        healthCheckup.forEach(ii => {
            //查询分检项目检查结果
            let departItemResultArr = departItemResults.filter(ii => ii.groupItemId == ii.groupItemId);
            if (departItemResultArr && departItemResultArr.length > 0) {
                let groupItemsName = ii.name;
                let data = departItemResultArr;

                if (groupItemsName.indexOf("眼科") > -1) {
                    templateData = ophthalmicRoutine(data, templateData);
                    templateData.autograph = ii.checkSign;
                }
            }
            j++;

        });
    }

    return templateData;
}

/**
 * 妇科检查
 *
 */
function fkDataInit(checkSign, departItemResults, healthCheckup) {
    let templateData = {};
    let oldTime = (new Date()).getTime();
    let time1 = formartDate(oldTime, "yyyy-MM-dd");
    let sealImg = '';
    templateData.sealImg = sealImg;//检查单位盖章
    templateData.autograph = checkSign;//医生签名
    //妇科检查项
    templateData.vulva = "-";
    templateData.vagina = "-";
    templateData.cervix = "-";
    templateData.uterineBody = "-";
    templateData.enclosure = "-";
    if (healthCheckup && healthCheckup.length > 0) {
        let j = 0;
        healthCheckup.forEach(ii => {
            //查询分检项目检查结果
            let departItemResultArr = departItemResults.filter(ii => ii.groupItemId == ii.groupItemId);
            if (departItemResultArr && departItemResultArr.length > 0) {
                let groupItemsName = ii.name;
                let data = departItemResultArr;
                if (groupItemsName.indexOf("妇科") > -1 || groupItemsName.indexOf("常规妇检") > -1) {
                    templateData = gynaecology(data, templateData);
                    templateData.autograph = ii.checkSign;
                }
            }
            j++;
        });
    }

    return templateData;
}

function splitProject(opinion,iCheckSign,iCheckDoc,groupItemsName,templateData) {
    let dataLeft = [];
    let dataRight = [];
    let int = 0;
    let nowData = [];
    data.forEach(i => {
        if (i == null) {
            i = {};
            i.personId = personInfo.id;
            i.orderGroupItemProjectName = i.name;
            i.orderGroupItemProjectId = i.id;
        } else {
            let unit = "";
            if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                unit = i.unitName;
            }
            //单个基础项
            nowData.push({
                monitorName: i.orderGroupItemProjectName,
                value: i.result,
                referenceRange: i.scope,
                unit: unit,
                arrow: i.arrow,
                resultTips: i.crisisDegree
            });
        }
        int++;
    });
    dataLeft = arrangeItem(nowData);//基础项排版整理
    let name = groupItemsName;
    let item = {
        dataLeft: dataLeft,
        dataRight: dataRight,
        nkOpinion: opinion,
        nkAutograph: iCheckSign,
        nkExaminer: iCheckDoc,
        nkDate: templateData.inspectDate,
        name: name,
    };
    if (groupItemsName.indexOf("复") > -1) {
        item.name = name + "（复）";
        if (templateData) {
            templateData.push(item);
        } else {
            let nkDatasTZ = [];
            nkDatasTZ.push(item);
            templateData = nkDatasTZ;
        }
    } else {
        let nkDatasTZ = [];
        nkDatasTZ.push(item);
        templateData = nkDatasTZ;
    }
    return templateData;
}

/**
 * 体格检查
 *
 */
function healthCheckupDataInit(checkSign, departItemResults, healthCheckup) {
    let templateData = {};
    let oldTime = (new Date()).getTime();
    let time1 = formartDate(oldTime, "yyyy-MM-dd");
    let sealImg = '';
    templateData.sealImg = sealImg;//检查单位盖章
    templateData.autograph = checkSign;//医生签名
    if (healthCheckup && healthCheckup.length > 0) {
        let j = 0;
        //一般检查(职业)
        templateData.nutrition = "-";
        templateData.height = "-";
        templateData.weight = "-";
        templateData.bloodPressure = "-";
        //耳鼻喉口腔常规（职业）
        templateData.externalEar = "-";
        templateData.middleEar = "-";
        templateData.leftHearing = "-";
        templateData.rightHearing = "-";
        templateData.nose = "-";
        templateData.mucosa = "-";
        templateData.tooth = "-";
        templateData.throat = "-";
        templateData.facialOthers = "-";
        //内科常规(职业)
        templateData.kidney = "-";
        templateData.lungs = "-";
        templateData.spleen = "-";
        templateData.liver = "-";
        templateData.rightHearing = "-";
        templateData.heartMoss = "-";
        templateData.heartRate = "-";
        templateData.otherInternal = "-";
        templateData.rhythm = "-";
        //外科检查(职业)
        templateData.thyroid = "-";
        templateData.lymphNode = "-";
        templateData.limbJoints = "-";
        templateData.surgicalOthers = "-";
        templateData.spine = "-";
        templateData.skinColor = "-";
        templateData.rash = "-";
        templateData.petechiae = "-";
        templateData.vegetations = "-";
        templateData.blister = "-";
        //神经系统
        templateData.senseOfPain = "-";
        templateData.positionPerception = "-";
        templateData.abdominalWallReflex = "-";
        templateData.kneeReflex = "-";
        templateData.achillestendonreflex = "-";
        templateData.muscleStrength = "-";
        templateData.muscleTension = "-";
        templateData.masonicMovement = "-";
        templateData.tripleTremor = "-";
        templateData.pathologicalReflex = "-";
        healthCheckup.forEach(ii => {
            //查询分检项目检查结果
            let departItemResultArr = departItemResults.filter(i => i.groupItemId == ii.groupItemId);
            if (departItemResultArr && departItemResultArr.length > 0) {
                let groupItemsName = ii.name;
                let data = departItemResultArr;

                if (j == 0) {
                    templateData.sectionOffice = data[0].officeName;
                    templateData.officeName = data[0].officeName;//科室名
                    templateData.inspectDoctor = data[0].checkDoc;//检验医生
                    templateData.inspectTime = data[0].checkDate ? data[0].checkDate.substring(0, 10) : time1;//检查时间
                    templateData.createTime = data[0].createDate ? data[0].createDate.substring(0, 10) : time1;//送检时间(登记时间)
                    let time1 = formartDate(oldTime, "yyyy年MM月dd日");
                }
                if (groupItemsName.indexOf("一般检查") > -1 || groupItemsName.indexOf("血压") > -1) {
                    templateData = generalInspection(data, templateData);
                    // templateData.ybAutograph = ii.checkSign;
                    templateData.sjAutograph = ii.checkSign;

                } else if (groupItemsName.indexOf("耳鼻喉口腔常规") > -1 || groupItemsName.indexOf("耳科") > -1 || groupItemsName.indexOf("口腔常规") > -1) {
                    templateData = otolaryngologyInspection(data, templateData);
                    templateData.ebhkAutograph = ii.checkSign;
                } else if (groupItemsName.indexOf("内科常规") > -1) {
                    templateData = internalMedicine(data, templateData);
                    templateData.sjAutograph = ii.checkSign;
                } else if (groupItemsName.indexOf("外科检查") > -1 || groupItemsName.indexOf("外科常规") > -1 || groupItemsName.indexOf("皮肤科常规") > -1) {
                    templateData = surgicalRoutine(data, templateData);
                    templateData.nAutograph = ii.checkSign;
                } else if (groupItemsName.indexOf("神经系统") > -1) {
                    templateData = nervousSystem(data, templateData);
                    templateData.sjAutograph = ii.checkSign;
                }
            }
            j++;
        });

    }

    return templateData;
}

/**
 * 分项汇总
 *
 */
function tgfxDataInit(_this, personInfo, checkSign, departItemResults, healthCheckup, physicalType) {
    let nkDatasYK = [];
    let ekDatasKQ = [];
    let templateData = {};
    let oldTime = (new Date()).getTime();
    let time1 = formartDate(oldTime, "yyyy-MM-dd");
    let sealImg = '';
    templateData.sealImg = sealImg;//检查单位盖章
    templateData.autograph = checkSign;//医生签名

    if (healthCheckup && healthCheckup.length > 0) {
        let dataEK = [];
        let dataYK = [];
        let dataWK = [];
        let dataEKOp = "";
        let dataYKOp = "";
        let dataWKOp = "";
        healthCheckup.forEach(ii => {
            let opinion = "";
            if (ii.opinion && ii.opinion != null) {
                opinion = ii.opinion.replaceAll('\n', '').replaceAll(' ', '');//小结
            }
            // let opinion = ii.inspectResult.replaceAll('\n','').replaceAll(' ','');//影像所见(诊断提醒)
            //查询分检项目检查结果
            let departItemResultArr = [];
            /*if(ii.name && ii.name.indexOf("复") > -1){
                departItemResultArr = departItemResults.filter(i => i.orderGroupItemId == ii.groupItemId);
            }else{
                departItemResultArr = departItemResults.filter(i => i.groupItemId == ii.groupItemId);
            }*/
            departItemResultArr = departItemResults.filter(i => i.orderGroupItemId == ii.groupItemId);
            let departItemResultArrNew = [];
            if (departItemResultArr.length > 0){
                for (let i = 0; i < departItemResultArr.length; i++) {
                    if (departItemResultArrNew.length == 0) {
                        //空结果不展示
                        if (departItemResultArr[i] && departItemResultArr[i].result && departItemResultArr[i].result.trim().length != 0) {
                            departItemResultArrNew.push(departItemResultArr[i]);
                        } else if (personInfo && personInfo.abandonInspectionIdData && personInfo.abandonInspectionIdData.length > 0) {
                            //弃检项目 明细结果以"/"展示
                            if (ii.groupItemId && personInfo.abandonInspectionIdData.indexOf(ii.groupItemId) > -1) {
                                if (ii.name.indexOf("电测听") <= -1 && ii.name.indexOf("纯音") <= -1 && ii.name.indexOf("肺功能") <= -1) {
                                    departItemResultArr[i].result = "/";
                                } else if (ii.name.indexOf("电测听") > -1 || ii.name.indexOf("纯音") > -1) {
                                    departItemResultArr[i].result = "";
                                } else if (ii.name.indexOf("肺功能") > -1) {
                                    departItemResultArr[i].result = "/";
                                    // departItemResultArr[i].scope = "/";
                                    departItemResultArr[i].updateId = "/";
                                }
                                departItemResultArrNew.push(departItemResultArr[i]);
                            }
                        }
                    } else {
                        let flag = true;
                        for (let j = 0; j < departItemResultArrNew.length; j++) {
                            /*if(groupItemId && groupItemId.length > 0){
                                if(departItemResultArr[i].orderGroupItemProjectName == departItemResultArrNew[j].orderGroupItemProjectName){
                                    flag = false;
                                }
                            }else{
                                if(departItemResultArr[i].orderGroupItemProjectId == departItemResultArrNew[j].orderGroupItemProjectId){
                                    flag = false;
                                }
                            }*/
                            //去重(按订单基础项id和检查项名称)
                            if (departItemResultArr[i] && departItemResultArrNew[j] && departItemResultArr[i].orderGroupItemProjectId && departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName && departItemResultArrNew[j].orderGroupItemProjectName && departItemResultArr[i].orderGroupItemProjectId == departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName == departItemResultArrNew[j].orderGroupItemProjectName) {
                                flag = false;
                            }
                        }
                        //空结果不展示
                        if (departItemResultArr[i] && ((departItemResultArr[i].result && departItemResultArr[i].result.trim().length == 0) || !departItemResultArr[i].result)) {
                            //弃检项目 明细结果以"/"展示
                            if (ii.groupItemId && personInfo.abandonInspectionIdData.indexOf(ii.groupItemId) > -1) {
                                if (ii.name.indexOf("电测听") <= -1 && ii.name.indexOf("纯音") <= -1 && ii.name.indexOf("肺功能") <= -1) {
                                    departItemResultArr[i].result = "/";
                                } else if (ii.name.indexOf("电测听") > -1 || ii.name.indexOf("纯音") > -1) {
                                    departItemResultArr[i].result = "";
                                } else if (ii.name.indexOf("肺功能") > -1) {
                                    departItemResultArr[i].result = "/";
                                    // departItemResultArr[i].scope = "/";
                                    departItemResultArr[i].updateId = "/";
                                }

                            } else {
                                flag = false;
                            }
                        }
                        if (flag) {
                            departItemResultArrNew.push(departItemResultArr[i]);
                        }
                    }
                }
            }

            departItemResultArr = departItemResultArrNew;
            if (departItemResultArr && departItemResultArr.length > 0) {
                let groupItemsName = ii.name;
                let data = departItemResultArr;
                templateData.sectionOffice = data[0].officeName;
                templateData.officeName = data[0].officeName;//科室名
                let officeName = data[0].officeName;
                templateData.inspectDoctor = data[0].checkDoc;//检验医生
                if (ii.name && ii.name.indexOf("复") > -1) {
                    if(personInfo.reviewProjectsList){
                        let reviewData = personInfo.reviewProjectsList.filter(item => item.name == ii.name && item.id == ii.groupItemId && item.isPass == 2);
                        templateData.inspectTime = reviewData && reviewData.length > 0 && reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd HH:mm:ss") : formartDate(new Date(), "yyyy-MM-dd HH:mm:ss");//检查时间
                        templateData.inspectDate = reviewData && reviewData.length > 0 && reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd") : formartDate(new Date(), "yyyy-MM-dd");//检查日期
                    }
                    templateData.createTime = templateData.inspectTime;
                    templateData.createDate = templateData.inspectDate;//送检日期
                } else {
                    templateData.inspectTime = personInfo && personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
                    templateData.inspectDate = personInfo && personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
                    templateData.createTime = templateData.inspectTime;
                    templateData.createDate = templateData.inspectDate;//送检日期
                }

                //不使用登记日期作为报告上的检查日期
                if (!(_this.$hospitalName && _this.$hospitalName.isUserRegisterTimeReport)) {
                    templateData.inspectTime = data[0].checkDate ? formartDate(data[0].checkDate, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
                    templateData.inspectDate = data[0].checkDate ? formartDate(data[0].checkDate, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
                    templateData.createTime = templateData.inspectTime;
                    templateData.createDate = templateData.inspectDate;//送检日期
                }

                let physicalSummary = ["未见明显异常"];

                if (_thisJs.$hospitalName && _thisJs.$hospitalName.physicalSummary) {//获取正常小结 集合
                    physicalSummary = _thisJs.$hospitalName.physicalSummary;
                }

                if ((officeName.indexOf("五官科") > -1 || officeName.indexOf("耳鼻") > -1) && groupItemsName.indexOf("眼") <= -1) {
                    if (opinion && physicalSummary.indexOf(opinion) <= -1) {
                        dataEKOp += opinion + " ";
                    }
                }
                if (((officeName.indexOf("五官科") > -1 || officeName.indexOf("耳鼻") > -1) && groupItemsName.indexOf("眼") > -1) || officeName.indexOf("眼科") > -1) {
                    if (opinion && physicalSummary.indexOf(opinion) <= -1) {
                        dataYKOp += opinion + " ";
                    }
                }
                let isSplitPFK = false;
                if (_thisJs.$hospitalName && _thisJs.$hospitalName.isSplitPFK) {
                    isSplitPFK = true;
                }
                if (groupItemsName.indexOf("皮肤科") > -1 || groupItemsName.indexOf("外科") > -1) {
                    if (opinion && physicalSummary.indexOf(opinion) <= -1) {
                        if (isSplitPFK && groupItemsName.indexOf("皮肤科") > -1) {
                            //这里不将皮肤科与外科合并
                        } else {
                            dataWKOp += opinion + " ";
                        }
                    }
                }

                let iCheckDoc = templateData.inspectDoctor;//当前项目 检查者名称
                let iCheckSign = ii.checkSign;//当前项目 检查医生签名

                if (physicalType && physicalType.indexOf("放射体检") > -1) {
                    if (_this.$hospitalName && _this.$hospitalName.isHideCheckNameAndSignFSTJ) {
                        templateData.doctor = "";//申请医师
                        templateData.reportDoctor = "";//报告医师
                        templateData.inspectDoctor = "";//检查医师(检验者)
                        templateData.autograph = "";//医生签名
                        iCheckDoc = "";//当前项目 检查者名称
                        iCheckSign = "";//当前项目 检查医生签名
                    }
                }

                if (officeName.indexOf("一般检查") > -1) {
                    // templateData = generalInspection(data, templateData);
                    let ssyValue = "";
                    let szyValue = "";
                    let dataLeft = [];
                    let dataRight = [];
                    let monitorNameArray = [];
                    let nowData = [];
                    data.forEach(i => {
                        if (i == null) {
                            i = {};
                            i.personId = personInfo.id;
                            i.orderGroupItemProjectName = i.name;
                            i.orderGroupItemProjectId = i.id;
                        } else {
                            let unit = "";
                            if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                unit = i.unitName;
                            }
                            //获取 收缩压/舒张压
                            if (i.orderGroupItemProjectName.trim().indexOf("收缩压") > -1) {
                                if (i.result) {
                                    ssyValue = i.result;
                                } else {
                                    ssyValue = 0;
                                }
                                if (szyValue && szyValue != "") {
                                    nowData.push({
                                        monitorName: "血压",
                                        value: ssyValue + "/" + szyValue,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                }
                                monitorNameArray.push(i.orderGroupItemProjectName);
                                return;
                            }
                            if (i.orderGroupItemProjectName.trim().indexOf("舒张压") > -1) {
                                if (i.result) {
                                    szyValue = i.result;
                                } else {
                                    szyValue = 0;
                                }
                                if (ssyValue && ssyValue != "") {
                                    nowData.push({
                                        monitorName: "血压",
                                        value: ssyValue + "/" + szyValue,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                }
                                monitorNameArray.push(i.orderGroupItemProjectName);
                                return;
                            }
                            if (!(monitorNameArray.indexOf(i.orderGroupItemProjectName) > -1)) {
                                //单个基础项
                                nowData.push({
                                    monitorName: i.orderGroupItemProjectName,
                                    value: i.result,
                                    referenceRange: i.scope,
                                    unit: unit,
                                    arrow: i.arrow,
                                    resultTips: i.crisisDegree
                                });
                                monitorNameArray.push(i.orderGroupItemProjectName);
                            }
                        }
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "一般检查";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        ybjcOpinion: opinion,
                        ybjcAutograph: iCheckSign,
                        ybjcExaminer: iCheckDoc,
                        ybjcDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.ybjcDatasTZ) {
                            templateData.ybjcDatasTZ.push(item);
                        } else {
                            let ybjcDatasTZ = [];
                            ybjcDatasTZ.push(item);
                            templateData.ybjcDatasTZ = ybjcDatasTZ;
                        }
                    } else {
                        let ybjcDatasTZ = [];
                        ybjcDatasTZ.push(item);
                        templateData.ybjcDatasTZ = ybjcDatasTZ;
                    }
                } else if (officeName.indexOf("妇科") > -1 && groupItemsName.indexOf("宫颈癌筛查") <= -1) {
                    // templateData = gynaecology(data, templateData);
                    let dataLeft = [];
                    let dataRight = [];
                    let int = 0;
                    let nowData = [];
                    data.forEach(i => {
                        if (i == null) {
                            i = {};
                            i.personId = personInfo.id;
                            i.orderGroupItemProjectName = i.name;
                            i.orderGroupItemProjectId = i.id;
                        } else {
                            let unit = "";
                            if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                unit = i.unitName;
                            }
                            //单个基础项
                            nowData.push({
                                monitorName: i.orderGroupItemProjectName,
                                value: i.result,
                                referenceRange: i.scope,
                                unit: unit,
                                arrow: i.arrow,
                                resultTips: i.crisisDegree
                            });
                        }
                        int++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "妇科";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        fkOpinion: opinion,
                        fkAutograph: iCheckSign,
                        fkExaminer: iCheckDoc,
                        fkDate: templateData.inspectDate,
                        name: name,
                    }
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.fkDatasTZ) {
                            templateData.fkDatasTZ.push(item);
                        } else {
                            let fkDatasTZ = [];
                            fkDatasTZ.push(item);
                            templateData.fkDatasTZ = fkDatasTZ;
                        }
                    } else {
                        let fkDatasTZ = [];
                        fkDatasTZ.push(item);
                        templateData.fkDatasTZ = fkDatasTZ;
                    }
                } else if (officeName.indexOf("妇科") > -1 && groupItemsName.indexOf("宫颈癌筛查") > -1) {
                    // templateData = gynaecology(data, templateData);
                    let dataLeft = [];
                    let dataRight = [];
                    let int = 0;
                    let nowData = [];
                    data.forEach(i => {
                        if (i == null) {
                            i = {};
                            i.personId = personInfo.id;
                            i.orderGroupItemProjectName = i.name;
                            i.orderGroupItemProjectId = i.id;
                        } else {
                            let unit = "";
                            if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                unit = i.unitName;
                            }
                            //单个基础项
                            nowData.push({
                                monitorName: i.orderGroupItemProjectName,
                                value: i.result,
                                referenceRange: i.scope,
                                unit: unit,
                                arrow: i.arrow,
                                resultTips: i.crisisDegree
                            });
                        }
                        int++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "宫颈筛查";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        fkgjOpinion: opinion,
                        fkgjAutograph: iCheckSign,
                        fkgjExaminer: iCheckDoc,
                        fkgjDate: templateData.inspectDate,
                        name: name,
                    }
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.fkgjDatasTZ) {
                            templateData.fkgjDatasTZ.push(item);
                        } else {
                            let fkgjDatasTZ = [];
                            fkgjDatasTZ.push(item);
                            templateData.fkgjDatasTZ = fkgjDatasTZ;
                        }
                    } else {
                        let fkgjDatasTZ = [];
                        fkgjDatasTZ.push(item);
                        templateData.fkgjDatasTZ = fkgjDatasTZ;
                    }
                } else if ((officeName.indexOf("五官科") > -1 || officeName.indexOf("耳鼻") > -1) && groupItemsName.indexOf("眼") <= -1) {
                    // templateData = otolaryngologyInspection(data, templateData);
                    if (_this.$hospitalName && _this.$hospitalName.projectSplitting) {
                        let dataLeft = [];
                        let dataRight = [];
                        let nowData = [];
                        data.forEach(i => {
                            if (i == null) {
                                i = {};
                                i.personId = personInfo.id;
                                i.orderGroupItemProjectName = i.name;
                                i.orderGroupItemProjectId = i.id;
                            } else {
                                let unit = "";
                                if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                    unit = i.unitName;
                                }
                                //单个基础项
                                if (groupItemsName.indexOf("复") > -1) {
                                    nowData.push({
                                        monitorName: i.orderGroupItemProjectName,
                                        value: i.result,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                } else {
                                    dataEK.push({
                                        monitorName: i.orderGroupItemProjectName,
                                        value: i.result,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                }
                            }
                            ;
                        });
                        let name = "耳鼻喉咽喉科";
                        let nowDataEK = [];
                        if (groupItemsName.indexOf("复") > -1) {
                            nowDataEK = nowData;
                        } else {
                            nowDataEK = removeRepeatItem(dataEK);
                        }
                        dataLeft = arrangeItem(nowDataEK);//基础项排版整理;
                        if (dataEKOp && dataEKOp.trim().length > 0) {
                            opinion = dataEKOp;
                        }
                        let item = {
                            dataLeft: dataLeft,
                            dataRight: dataRight,
                            ekOpinion: opinion,
                            ekAutograph: iCheckSign,
                            ekExaminer: iCheckDoc,
                            ekDate: templateData.inspectDate,
                            name: name,
                        };
                        if (groupItemsName.indexOf("复") > -1) {//复查
                            item.name = name + "（复）";
                            if (templateData.ekDatasTZ) {
                                templateData.ekDatasTZ.push(item);
                            } else {
                                let ekDatasTZ = [];
                                ekDatasTZ.push(item);
                                templateData.ekDatasTZ = ekDatasTZ;
                            }
                        } else {
                            let ekDatasTZ = [];
                            ekDatasTZ.push(item);
                            templateData.ekDatasTZ = ekDatasTZ;
                        }
                    } else {
                            let dataLeft = [];
                            let dataRight = [];
                            let int = 0;
                            let nowData = [];
                            data.forEach(i => {
                                if (i == null) {
                                    i = {};
                                    i.personId = personInfo.id;
                                    i.orderGroupItemProjectName = i.name;
                                    i.orderGroupItemProjectId = i.id;
                                } else {
                                    let unit = "";
                                    if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                        unit = i.unitName;
                                    }
                                    //单个基础项
                                    nowData.push({
                                        monitorName: i.orderGroupItemProjectName,
                                        value: i.result,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                }
                                int++;
                            });
                            dataLeft = arrangeItem(nowData);//基础项排版整理
                            let name = groupItemsName;
                            let item = {
                                dataLeft: dataLeft,
                                dataRight: dataRight,
                                ekOpinionEK: opinion,
                                nkAutograph: iCheckSign,
                                nkExaminer: iCheckDoc,
                                nkDate: templateData.inspectDate,
                                name: name,
                            };
                            if (groupItemsName.indexOf("复") > -1) {
                                item.name = name + "（复）";
                                if (templateData.ekDatasTZ) {
                                    templateData.ekDatasTZ.push(item);
                                } else {
                                    ekDatasKQ.push(item);
                                    templateData.ekDatasTZ = ekDatasKQ;
                                }
                            } else {
                                ekDatasKQ.push(item);
                                templateData.ekDatasTZ = ekDatasKQ;
                            }
                    }
                } else if (officeName.indexOf("内科") > -1 && groupItemsName.indexOf("神经") <= -1) {
                    // templateData = internalMedicine(data, templateData);
                    let dataLeft = [];
                    let dataRight = [];
                    let int = 0;
                    let nowData = [];
                    data.forEach(i => {
                        if (i == null) {
                            i = {};
                            i.personId = personInfo.id;
                            i.orderGroupItemProjectName = i.name;
                            i.orderGroupItemProjectId = i.id;
                        } else {
                            let unit = "";
                            if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                unit = i.unitName;
                            }
                            //单个基础项
                            nowData.push({
                                monitorName: i.orderGroupItemProjectName,
                                value: i.result,
                                referenceRange: i.scope,
                                unit: unit,
                                arrow: i.arrow,
                                resultTips: i.crisisDegree
                            });
                        }
                        int++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理
                    let name = "内科";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        nkOpinion: opinion,
                        nkAutograph: iCheckSign,
                        nkExaminer: iCheckDoc,
                        nkDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.nkDatasTZ) {
                            templateData.nkDatasTZ.push(item);
                        } else {
                            let nkDatasTZ = [];
                            nkDatasTZ.push(item);
                            templateData.nkDatasTZ = nkDatasTZ;
                        }
                    } else {
                        let nkDatasTZ = [];
                        nkDatasTZ.push(item);
                        templateData.nkDatasTZ = nkDatasTZ;
                    }
                } else if (officeName.indexOf("外科") > -1 || officeName.indexOf("皮肤科") > -1) {
                    // templateData = surgicalRoutine(data, templateData);
                    let dataLeft = [];
                    let dataRight = [];
                    let int = 0;
                    let nowData = [];
                    if (isSplitPFK && groupItemsName.indexOf("皮肤科") > -1) {
                        //这里不将皮肤科与外科合并
                        data.forEach(i => {
                            if (i == null) {
                                i = {};
                                i.personId = personInfo.id;
                                i.orderGroupItemProjectName = i.name;
                                i.orderGroupItemProjectId = i.id;
                            } else {
                                let unit = "";
                                if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                    unit = i.unitName;
                                }
                                //单个基础项
                                nowData.push({
                                    monitorName: i.orderGroupItemProjectName,
                                    value: i.result,
                                    referenceRange: i.scope,
                                    unit: unit,
                                    arrow: i.arrow,
                                    resultTips: i.crisisDegree
                                });
                            }
                            int++;
                        });
                        dataLeft = arrangeItem(nowData);//基础项排版整理
                        let name = "皮肤科";
                        let item = {
                            dataLeft: dataLeft,
                            dataRight: dataRight,
                            pfkOpinion: opinion,
                            pfkAutograph: iCheckSign,
                            pfkExaminer: iCheckDoc,
                            pfkDate: templateData.inspectDate,
                            name: name,
                        };
                        if (groupItemsName.indexOf("复") > -1) {
                            item.name = name + "（复）";
                            if (templateData.pfkDatasTZ) {
                                templateData.pfkDatasTZ.push(item);
                            } else {
                                let pfkDatasTZ = [];
                                pfkDatasTZ.push(item);
                                templateData.pfkDatasTZ = pfkDatasTZ;
                            }
                        } else {
                            let pfkDatasTZ = [];
                            pfkDatasTZ.push(item);
                            templateData.pfkDatasTZ = pfkDatasTZ;
                        }
                    } else {
                        data.forEach(i => {
                            if (i == null) {
                                i = {};
                                i.personId = personInfo.id;
                                i.orderGroupItemProjectName = i.name;
                                i.orderGroupItemProjectId = i.id;
                            } else {
                                let unit = "";
                                if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                    unit = i.unitName;
                                }
                                //单个基础项
                                if (groupItemsName.indexOf("复") > -1) {
                                    nowData.push({
                                        monitorName: i.orderGroupItemProjectName,
                                        value: i.result,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                } else {
                                    dataWK.push({
                                        monitorName: i.orderGroupItemProjectName,
                                        value: i.result,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                }
                            }
                            int++;
                        });
                        let nowDataWK = [];
                        if (groupItemsName.indexOf("复") > -1) {
                            nowDataWK = nowData;
                        } else {
                            nowDataWK = removeRepeatItem(dataWK);
                        }
                        dataLeft = arrangeItem(nowDataWK);//基础项排版整理;
                        let name = "外科";
                        if (dataWKOp && dataWKOp.trim().length > 0) {
                            opinion = dataWKOp;
                        }
                        let item = {
                            dataLeft: dataLeft,
                            dataRight: dataRight,
                            wkOpinion: opinion,
                            wkAutograph: iCheckSign,
                            wkExaminer: iCheckDoc,
                            wkDate: templateData.inspectDate,
                            name: name,
                        };
                        if (groupItemsName.indexOf("复") > -1) {
                            item.name = name + "（复）";
                            if (templateData.wkDatasTZ) {
                                templateData.wkDatasTZ.push(item);
                            } else {
                                let wkDatasTZ = [];
                                wkDatasTZ.push(item);
                                templateData.wkDatasTZ = wkDatasTZ;
                            }
                        } else {
                            let wkDatasTZ = [];
                            wkDatasTZ.push(item);
                            templateData.wkDatasTZ = wkDatasTZ;
                        }
                    }
                } else if (groupItemsName.indexOf("神经") > -1) {
                    // templateData = nervousSystem(data, templateData);
                    let dataLeft = [];
                    let dataRight = [];
                    let int = 0;
                    let nowData = [];
                    data.forEach(i => {
                        if (i == null) {
                            i = {};
                            i.personId = personInfo.id;
                            i.orderGroupItemProjectName = i.name;
                            i.orderGroupItemProjectId = i.id;
                        } else {
                            let unit = "";
                            if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                unit = i.unitName;
                            }
                            //单个基础项
                            nowData.push({
                                monitorName: i.orderGroupItemProjectName,
                                value: i.result,
                                referenceRange: i.scope,
                                unit: unit,
                                arrow: i.arrow,
                                resultTips: i.crisisDegree
                            });
                        }
                        int++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "神经系统";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        sjOpinion: opinion,
                        sjAutograph: iCheckSign,
                        sjExaminer: iCheckDoc,
                        sjDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.sjDatasTZ) {
                            templateData.sjDatasTZ.push(item);
                        } else {
                            let sjDatasTZ = [];
                            sjDatasTZ.push(item);
                            templateData.sjDatasTZ = sjDatasTZ;
                        }
                    } else {
                        let sjDatasTZ = [];
                        sjDatasTZ.push(item);
                        templateData.sjDatasTZ = sjDatasTZ;
                    }
                } else if (officeName.indexOf("检验科") > -1 || officeName.indexOf("DR室") > -1 || officeName.indexOf("CT室") > -1 || officeName.indexOf("彩超室") > -1) {
                    //"检验科","DR室","CT室","彩超室"

                    //检验科报告
                    let checkDocNow = iCheckDoc;
                    if (officeName && officeName != "" && officeName.indexOf("检验科") > -1) {
                        //检验者
                        if (_this.$hospitalName.updateCheckPersonJYK) {
                            checkDocNow = _this.$hospitalName.updateCheckPersonJYK;
                        }
                    }
                    //放射科报告
                    if (officeName && officeName != "" && (officeName.indexOf("DR室") > -1 || officeName.indexOf("CT室") > -1 || officeName.indexOf("彩超室") > -1)) {
                        //报告医师
                        if (_this.$hospitalName.reportDoctor) {
                            checkDocNow = _this.$hospitalName.reportDoctor;
                        }
                    }
                    if (!iCheckDoc) {//检查者名称为空
                        checkDocNow = "";
                    }

                    let name = groupItemsName;
                    let item = {
                        xcgOpinion: opinion,
                        xcgAutograph: iCheckSign,
                        xcgExaminer: checkDocNow,
                        xcgDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name ? name.replace("(复)", "（复）") : "";
                        if (templateData.xcgDatasTZ) {
                            templateData.xcgDatasTZ.push(item);
                        } else {
                            let xcgDatasTZ = [];
                            xcgDatasTZ.push(item);
                            templateData.xcgDatasTZ = xcgDatasTZ;
                        }
                    } else if (templateData.xcgDatasTZ && templateData.xcgDatasTZ.length > 0) {
                        templateData.xcgDatasTZ.push(item);
                    } else {
                        let xcgDatasTZ = [];
                        xcgDatasTZ.push(item);
                        templateData.xcgDatasTZ = xcgDatasTZ;
                    }
                } else if (officeName.indexOf("心电图") > -1) {
                    // templateData = ecgImageData(data, templateData);
                    let int = 1;
                    let opinionArray = opinion.split(";");
                    let opinions = "";
                    opinionArray.forEach(function (e) {
                        opinions += "" + int + "." + e + ";";
                        int++;
                    });
                    let name = "常规心电图";
                    let item = {
                        xdtOpinion: opinions,
                        xdtInspect: opinion,
                        xdtAutograph: iCheckSign,
                        xdtExaminer: iCheckDoc,
                        xdtDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.xdtDatasTZ) {
                            templateData.xdtDatasTZ.push(item);
                        } else {
                            let xdtDatasTZ = [];
                            xdtDatasTZ.push(item);
                            templateData.xdtDatasTZ = xdtDatasTZ;
                        }
                    } else {
                        let xdtDatasTZ = [];
                        xdtDatasTZ.push(item);
                        templateData.xdtDatasTZ = xdtDatasTZ;
                    }
                } else if (officeName.indexOf("肺功能") > -1) {
                    fgnDataInit(templateData, data)
                    let dataLeft = templateData.vitalCapacityFX;
                    let name = "肺功能";
                    let item = {
                        dataLeft: dataLeft,
                        fgnOpinion: opinion,
                        fgnAutograph: iCheckSign,
                        fgnExaminer: iCheckDoc,
                        fgnDate: templateData.inspectDate,
                        name: name
                    }
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.fgnDatasTZ) {
                            templateData.fgnDatasTZ.push(item);
                        } else {
                            let fgnDatasTZ = [];
                            fgnDatasTZ.push(item)
                            templateData.fgnDatasTZ = fgnDatasTZ;
                        }
                    } else {
                        let fgnDatasTZ = [];
                        fgnDatasTZ.push(item)
                        templateData.fgnDatasTZ = fgnDatasTZ;
                    }
                } else if (officeName.indexOf("电测听") > -1) {
                    // templateData = pureTone(data, templateData);
                    let name = "电测听";
                    let item = {
                        dctOpinion: opinion,
                        dctAutograph: iCheckSign,
                        dctExaminer: iCheckDoc,
                        dctDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.dctDatasTZ) {
                            templateData.dctDatasTZ.push(item);
                        } else {
                            let dctDatasTZ = [];
                            dctDatasTZ.push(item);
                            templateData.dctDatasTZ = dctDatasTZ;
                        }
                    } else {
                        let dctDatasTZ = [];
                        dctDatasTZ.push(item);
                        templateData.dctDatasTZ = dctDatasTZ;
                    }
                } else if (officeName.indexOf("口腔科") > -1) {
                    // templateData = kqcgImageData(data, templateData);
                    let name = "口腔定位检查";
                    let item = {
                        kqOpinion: opinion,
                        kqAutograph: iCheckSign,
                        kqExaminer: iCheckDoc,
                        kqDate: templateData.inspectDate,
                        name: name,
                    };
                    if (groupItemsName.indexOf("复") > -1) {
                        item.name = name + "（复）";
                        if (templateData.kqDatasTZ) {
                            templateData.kqDatasTZ.push(item);
                        } else {
                            let kqDatasTZ = [];
                            kqDatasTZ.push(item);
                            templateData.kqDatasTZ = kqDatasTZ;
                        }
                    } else {
                        let kqDatasTZ = [];
                        kqDatasTZ.push(item);
                        templateData.kqDatasTZ = kqDatasTZ;
                    }
                } else if (((officeName.indexOf("五官科") > -1 || officeName.indexOf("耳鼻") > -1) && groupItemsName.indexOf("眼") > -1) || officeName.indexOf("眼科") > -1) {
                    if (_this.$hospitalName && _this.$hospitalName.projectSplitting) {
                        let dataLeft = [];
                        let dataRight = [];
                        if (physicalType != "放射体检") {
                            let int = 0;
                            let nowData = [];
                            data.forEach(i => {
                                if (i == null) {
                                    i = {};
                                    i.personId = personInfo.id;
                                    i.orderGroupItemProjectName = i.name;
                                    i.orderGroupItemProjectId = i.id;
                                } else {
                                    let unit = "";
                                    if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                        unit = i.unitName;
                                    }
                                    //单个基础项
                                    let result = 0;
                                    if (i.result && i.result.trim().length > 0) {
                                        result = i.result;
                                    } else {
                                        result = "-"
                                    }
                                    if (result != "-") {
                                        if (groupItemsName.indexOf("复") > -1) {
                                            nowData.push({
                                                monitorName: i.orderGroupItemProjectName,
                                                value: i.result,
                                                referenceRange: i.scope,
                                                unit: unit,
                                                arrow: i.arrow,
                                                resultTips: i.crisisDegree
                                            });
                                        } else {
                                            dataYK.push({
                                                monitorName: i.orderGroupItemProjectName,
                                                value: i.result,
                                                referenceRange: i.scope,
                                                unit: unit,
                                                arrow: i.arrow,
                                                resultTips: i.crisisDegree
                                            });
                                        }
                                    }
                                }
                                int++;
                            });
                            // dataLeft = arrangeItem(nowData);//基础项排版整理;

                            let nowDataYK = [];
                            if (groupItemsName.indexOf("复") > -1) {
                                nowDataYK = nowData;
                            } else {
                                nowDataYK = removeRepeatItem(dataYK);
                            }
                            dataLeft = arrangeItem(nowDataYK);//基础项排版整理;
                        } else {
                            dataLeft.push({
                                monitorName: "眼科检查",
                                value: ii.inspectResult,
                                referenceRange: "",
                                unit: "",
                                arrow: "",
                                resultTips: ""
                            });
                        }
                        let name = "眼科";
                        if (dataYKOp && dataYKOp.trim().length > 0) {
                            opinion = dataYKOp;
                        }
                        let item = {
                            dataLeft: dataLeft,
                            dataRight: dataRight,
                            ykOpinion: opinion,
                            ykAutograph: iCheckSign,
                            ykExaminer: iCheckDoc,
                            ykDate: templateData.inspectDate,
                            name: name,
                        };
                        if (groupItemsName.indexOf("复") > -1) {
                            item.name = name + "（复）";
                            if (templateData.ykDatasTZ) {
                                templateData.ykDatasTZ.push(item);
                            } else {
                                let ykDatasTZ = [];
                                ykDatasTZ.push(item);
                                ykDatasTZ.push();
                                templateData.ykDatasTZ = ykDatasTZ;
                            }
                        } else {
                            let ykDatasTZ = [];
                            ykDatasTZ.push(item);
                            templateData.ykDatasTZ = ykDatasTZ;
                        }
                    } else {
                            let dataLeft = [];
                            let dataRight = [];
                            let int = 0;
                            let nowData = [];
                            data.forEach(i => {
                                if (i == null) {
                                    i = {};
                                    i.personId = personInfo.id;
                                    i.orderGroupItemProjectName = i.name;
                                    i.orderGroupItemProjectId = i.id;
                                } else {
                                    let unit = "";
                                    if (i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无") {
                                        unit = i.unitName;
                                    }
                                    //单个基础项
                                    nowData.push({
                                        monitorName: i.orderGroupItemProjectName,
                                        value: i.result,
                                        referenceRange: i.scope,
                                        unit: unit,
                                        arrow: i.arrow,
                                        resultTips: i.crisisDegree
                                    });
                                }
                                int++;
                            });
                            dataLeft = arrangeItem(nowData);//基础项排版整理
                            let name = groupItemsName;
                           let item = {
                                dataLeft: dataLeft,
                                dataRight: dataRight,
                                ykOpinionYD: opinion,
                                nkAutograph: iCheckSign,
                                nkExaminer: iCheckDoc,
                                nkDate: templateData.inspectDate,
                                name: name,
                            };
                            if (groupItemsName.indexOf("复") > -1) {
                                item.name = name + "（复）";
                                if (templateData.ykDatasTZ) {
                                    templateData.ykDatasTZ.push(item);
                                } else {
                                    nkDatasYK.push(item);
                                    templateData.ykDatasTZ = nkDatasYK;
                                }
                            } else {
                                nkDatasYK.push(item);
                                templateData.ykDatasTZ = nkDatasYK;
                            }
                    }
                }
            }
        });
    }
    return templateData;
}

/**
 * 总检报告
 *
 */
function inspectionDataInit(_this, personInfo, checkSign, physicalType, name) {
    let templateData = {};
    templateData.autograph = checkSign;//医生签名

    templateData.name = "-";//姓名
    templateData.testNum = "-";//体检编号
    templateData.sex = "-";//性别
    templateData.age = "-";//年龄
    templateData.physicalType = "-";//体检类型
    templateData.education = "-";//文化程度
    templateData.familyAddress = "-";//家庭地址
    templateData.isMarry = "-";//婚姻状况
    templateData.nation = "-";//民族
    templateData.idCard = "-";//身份证号
    templateData.birthplaceName = "-";//籍贯(出生地名称)
    templateData.zipNum = "-";//邮编(出生地编码)
    templateData.workStateText = "-";//监护种类(在岗状态)
    templateData.mobile = "-";//联系电话
    templateData.workTypeText = "-";//工种名称
    templateData.workTypeTextOld = "-";//工种名称
    templateData.workName = "-";//其他工种名称
    templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
    templateData.factors = "-";//职业危害因素
    templateData.workYe = "-";//总工龄年
    templateData.expYear = "-";//接害工龄年
    templateData.expYe = "-";//接触开始时间
    templateData.birth = "-";//出生日期
    templateData.unitName = "-";//单位名称
    templateData.registDate = "-";//体检日期
    templateData.dept = "-";//所属部门
    templateData.job = "-";//职务/职称
    templateData.zipCode = "-";//邮政编码
    if (personInfo) {
        if (personInfo.unit_name) {
            templateData.unitName = personInfo.unit_name;//单位名称
        }
        /*if (templateData.unitName == "-" && personInfo.dept) {
            templateData.unitName = personInfo.dept;//单位名称
        }*/
        if (personInfo.person_name) {
            templateData.name = personInfo.person_name;//姓名
        }
        if (personInfo.test_num) {
            templateData.testNum = personInfo.test_num;//体检编号
        }
        if (personInfo.department) {
            templateData.dept = personInfo.department;//所属部门
        }
        if (personInfo.regist_date) {
            templateData.registDate = formartDate(personInfo.regist_date, 'yyyy-MM-dd');//体检日期
        }
        if (personInfo.sex) {
            templateData.sex = personInfo.sex;//性别
            if (templateData.sex == "男") {
                templateData.nameSex = "先生";//称呼
            } else {
                templateData.nameSex = "女士";//称呼
            }
        }
        if (personInfo.age) {
            templateData.age = personInfo.age + "岁";//年龄
        }
        if (personInfo.hazard_factors_text) {
            templateData.factors = personInfo.hazard_factors_text;//职业危害因素
        }
        if (personInfo.physical_type) {
            templateData.physicalType = personInfo.physical_type;//体检类型
        }
        if (personInfo.education) {
            templateData.education = personInfo.education;//文化程度
        }
        if (personInfo.family_address) {
            templateData.familyAddress = personInfo.family_address;//家庭地址
        }
        templateData.headImg = personInfo.avatar;//头像
        if (personInfo.is_marry) {
            templateData.isMarry = personInfo.is_marry;//婚姻状况
        }
        if (personInfo.nation) {
            templateData.nation = personInfo.nation;//民族
        }
        if (personInfo.id_card) {
            templateData.idCard = personInfo.id_card;//身份证号
        }
        if (personInfo.job) {
            templateData.job = personInfo.job;//职务/职称
        }
        if (personInfo.zip_code) {
            templateData.zipCode = personInfo.zip_code;//邮政编码
        }
        if (personInfo.birthplace_name) {
            templateData.birthplaceName = personInfo.birthplace_name;//籍贯(出生地名称)
        }
        if (personInfo.birthplace_code) {
            templateData.zipNum = personInfo.birthplace_code;//邮编(出生地编码)
        }
        if (personInfo.work_state_text) {
            templateData.workStateText = personInfo.work_state_text.replaceAll(" ", "");//监护种类(在岗状态)
        }
        if (personInfo.hazard_factors_text) {
            if (personInfo.other_hazard_factors && _this.$hospitalName && _this.$hospitalName.isOtherHazards){
                templateData.hazardFactorsText = personInfo.other_hazard_factors.replaceAll("|", "、");
            }else {
                templateData.hazardFactorsText = personInfo.hazard_factors_text.replaceAll("|", "、");//监护危害(危害因素名称)
            }
        }
        if (personInfo.mobile) {
            templateData.mobile = personInfo.mobile;//联系电话
        }

        if (personInfo.work_year && personInfo.work_year != "0" && personInfo.work_year != 0) {
            templateData.workYe = personInfo.work_year + "年";//总工龄年
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.workYe = "0" + "年";//总工龄年
        }
        if (personInfo.work_month && personInfo.work_month != "0" && personInfo.work_month != 0) {
            if (templateData.workYe.indexOf("年") > -1) {
                templateData.workYe += personInfo.work_month + "月";//总工龄月
            } else {
                templateData.workYe = personInfo.work_month + "月";//总工龄月
            }
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.workYe += "0" + "月";//总工龄年
        }
        if (personInfo.exposure_work_year && personInfo.exposure_work_year != "0" && personInfo.exposure_work_year != 0) {
            templateData.expYear = personInfo.exposure_work_year + "年";//接害工龄
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.expYear = "0" + "年";//接害工龄
        }
        if (personInfo.exposure_work_month && personInfo.exposure_work_month != "0" && personInfo.exposure_work_month != 0) {
            if (templateData.expYear && templateData.expYear != "-") {
                templateData.expYear += personInfo.exposure_work_month + "月";//接害工龄
            } else {
                templateData.expYear = personInfo.exposure_work_month + "月";//接害工龄
            }
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.expYear += "0" + "月";//接害工龄
        }

        if (personInfo.birth) {
            templateData.birth = formartDate(personInfo.birth, 'yyyy-MM-dd');//出生日期
        }
        if (personInfo.exposure_start_date && personInfo.work_state_code != '1001') {
            templateData.expYe = formartDate(personInfo.exposure_start_date, 'yyyy-MM-dd');//接触开始时间
        }
        if (personInfo.work_type_text) {
            templateData.workTypeText = personInfo.work_type_text;//工种名称
            templateData.workTypeTextOld = personInfo.work_type_text;//工种名称
            if (templateData.workTypeText.indexOf("其他") > -1) {
                templateData.workTypeText = personInfo.work_name;//工种其他名称
                templateData.workName = personInfo.work_name;//工种其他名称
            }
        }
    }
    if (personInfo) {
        //查询总检信息
        if (personInfo.inspectionRecord) {
            let data = personInfo.inspectionRecord;
            //总检日期
            templateData.createTime = formartDate(data.inspectionDate, 'yyyy-MM-dd');
            let dateArray = templateData.createTime.split('-');
            templateData.ye = dateArray[0];
            templateData.mo = dateArray[1];
            templateData.da = dateArray[2];
            //复查总检日期
            templateData.reviewInspectDate = formartDate(data.reviewInspectDate, 'yyyy-MM-dd');
            let dateReviewArray = templateData.reviewInspectDate.split('-');
            templateData.rye = dateReviewArray[0];
            templateData.rmo = dateReviewArray[1];
            templateData.rda = dateReviewArray[2];
            templateData.autograph = data.inspectionAutograph;//主检医生

            //为true的时候，仅钟国富出的报告展示主检医师签名
            if (_this.$hospitalName && _this.$hospitalName.isShowCheckSigOnlyZGF && (name && name != "检查结果及处理意见(结论)")) {
                if (data.inspectionDoctor && data.inspectionDoctor.indexOf("钟国富") > -1) {
                    templateData.autograph = data.inspectionAutograph;//主检医生
                } else {
                    templateData.autograph = "";//主检医生
                }
            } else {
                templateData.autograph = data.inspectionAutograph;//主检医生
            }

            let conclusion = data.conclusion;
            let handleOpinion = "";
            if (personInfo.tPositiveResult) {
                handleOpinion = personInfo.tPositiveResult;
            } else {
                handleOpinion = data.handleOpinion;
            }
            let tdTjBadrsnsResult = "";
            if (personInfo.tdTjBadrsnsResult) {
                tdTjBadrsnsResult = personInfo.tdTjBadrsnsResult;
            }
            let jgyjDatasTZ = [];
            let qtjbyc = "";
            let clyj = "";
            let otherCheckAbnormalResults = "";
            let careerIllnessName = "";
            let others = [];
            if (data.otherCheckAbnormalResults && data.otherCheckAbnormalResults != "无" && data.careerIllnessName && data.careerIllnessName != "无") {
                qtjbyc = "其他疾病或异常描述：";
                clyj = "其他疾病异常处理意见：";
                otherCheckAbnormalResults = data.otherCheckAbnormalResults;
                careerIllnessName = data.careerIllnessName;
                others.push({
                    qtjbyc: qtjbyc,
                    clyj: clyj,
                    otherCheckAbnormalResults: otherCheckAbnormalResults,
                    careerIllnessName: careerIllnessName
                })
            }
            let goods = [];
            let arr = [];
            //复查项目
            let review = "";
            if (personInfo.reviewProjectsList) {
                arr = personInfo.reviewProjectsList.filter(ii => ii.isPass == 1);
            }
            if (arr.length > 0) {
                review = "【复查】"
                for (let i = 0; i < arr.length; i++) {
                    let groupItemName = arr[i].name.split("(复)");
                    goods.push({
                        projectName: groupItemName[0],//复查项目名
                        reviewExplain: arr[i].reason,//复查原因说明
                        reviewTime: formartDate(arr[i].checkDate, 'yyyy-MM-dd'),//复查日期
                        xmmc: "项目名称：",
                        fcsm: "复查说明：",
                    });
                }
                templateData.ry = dateArray[0];
                templateData.rm = dateArray[1];
                templateData.rd = dateArray[2];
                templateData.reviewAutograph = data.inspectionAutograph;
            } else {
                templateData.review = ""
                goods.push({
                    projectName: "",//复查项目名
                    reviewExplain: "",//复查原因说明
                    reviewTime: "",//复查日期
                    xmmc: "",
                    fcsm: "",
                });
            }
            let reviewResult = [];
            if (data && data.reviewResult && data.reviewResult.trim().length > 0) {
                reviewResult.push({
                    reviewResultTitle: "复查结论及处理意见：",
                    reviewResultData: data.reviewResult,
                });
            }
            jgyjDatasTZ.push({
                //结论和意见
                tdTjBadrsnsResult: tdTjBadrsnsResult,
                conclusion: conclusion,
                handleOpinion: handleOpinion,
                //其他结论和意见
                others: others,
                //复查
                review: review,
                goods: goods,
                reviewResult: reviewResult,
            })
            templateData.jgyjDatasTZ = jgyjDatasTZ;
        }
        //职业史信息
        templateData.irradiationType = "-";
        if (personInfo.careerHistory) {
            let careerHisData = personInfo.careerHistory;
            /*if(careerHistory && careerHistory.length > 0 && careerHistory[0].irradiationType){
                templateData.irradiationType = "" + careerHistory[0].irradiationType;
            }*/
            let irradiationTypes = "";
            for (let i = 0; i < careerHisData.length; i++) {
                let irradiationType = "";
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
                }
            }
            if (irradiationTypes && irradiationTypes.trim().length > 0) {
                templateData.irradiationType = "" + irradiationTypes;
            }
        }
    }
    return templateData;
}

/**
 * 总检报告
 *
 */
function inspectionDataInitFCJBXX(_this, personInfo, checkSign, physicalType) {
    let templateData = {};
    templateData.autograph = checkSign;//医生签名

    templateData.name = "-";//姓名
    templateData.testNum = "-";//体检编号conclusion
    templateData.sex = "-";//性别
    templateData.age = "-";//年龄
    templateData.isMarry = "-";//婚姻状况
    templateData.nation = "-";//民族
    templateData.idCard = "-";//身份证号
    templateData.workStateText = "-";//监护种类(在岗状态)
    templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
    templateData.workYe = "-";//总工龄年
    templateData.expYear = "-";//接害工龄年
    templateData.expYe = "-";//接触开始时间
    templateData.birth = "-";//出生日期
    templateData.unitName = "-";//单位名称
    templateData.registDate = "-";//体检日期
    templateData.dept = "-";//所属部门
    templateData.firstConclusion = "";
    templateData.firstzytjjl = "";
    templateData.firstzytjjg = "";
    templateData.firstzytjjy = "";
    templateData.firstzyqitc = "";
    templateData.firstzytjjls = "";
    templateData.firstzytjjgs = "";
    templateData.firstzytjjys = "";
    templateData.firstzyqitcs = "";
    if (personInfo) {
        if (personInfo.department) {
            templateData.dept = personInfo.department;//所属部门
        }
        if (personInfo.unit_name) {
            templateData.unitName = personInfo.unit_name;//单位名称
        }
        if (personInfo.person_name) {
            templateData.name = personInfo.person_name;//姓名
        }
        if (personInfo.test_num) {
            templateData.testNum = personInfo.test_num;//体检编号
        }
        if (personInfo.last_test_num) {
            templateData.lastTestNum = personInfo.last_test_num;//体检编号(上次)
        }
        if (personInfo.last_regist_date) {
            templateData.lastRegistDate = formartDate(personInfo.last_regist_date, 'yyyy-MM-dd');//体检日期(上次)
        }
        if (personInfo.sex) {
            templateData.sex = personInfo.sex;//性别
            if (templateData.sex == "男") {
                templateData.nameSex = "先生";//称呼
            } else {
                templateData.nameSex = "女士";//称呼
            }
        }
        if (personInfo.age) {
            templateData.age = personInfo.age + "岁";//年龄
        }
        templateData.headImg = personInfo.avatar;//头像
        if (personInfo.is_marry) {
            templateData.isMarry = personInfo.is_marry;//婚姻状况
        }
        if (personInfo.nation) {
            templateData.nation = personInfo.nation;//民族
        }
        if (personInfo.id_card) {
            templateData.idCard = personInfo.id_card;//身份证号
        }
        if (personInfo.work_state_text) {
            templateData.workStateText = personInfo.work_state_text.replaceAll(" ", "");//监护种类(在岗状态)
        }
        if (personInfo.hazard_factors_text) {
            templateData.hazardFactorsText = personInfo.hazard_factors_text.replaceAll("|", "、");//监护危害(危害因素名称)
        }
        if (personInfo.mobile) {
            templateData.mobile = personInfo.mobile;//联系电话
        }
        if (personInfo.work_year && personInfo.work_year != "0" && personInfo.work_year != 0) {
            templateData.workYe = personInfo.work_year + "年";//总工龄年
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.workYe = "0" + "年";//总工龄年
        }
        if (personInfo.work_month && personInfo.work_month != "0" && personInfo.work_month != 0) {
            if (templateData.workYe.indexOf("年") > -1) {
                templateData.workYe += personInfo.work_month + "月";//总工龄月
            } else {
                templateData.workYe = personInfo.work_month + "月";//总工龄月
            }
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.workYe += "0" + "月";//总工龄年
        }
        if (personInfo.exposure_work_year && personInfo.exposure_work_year != "0" && personInfo.exposure_work_year != 0) {
            templateData.expYear = personInfo.exposure_work_year + "年";//接害工龄
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.expYear = "0" + "年";//接害工龄
        }
        if (personInfo.exposure_work_month && personInfo.exposure_work_month != "0" && personInfo.exposure_work_month != 0) {
            if (templateData.expYear && templateData.expYear != "-") {
                templateData.expYear += personInfo.exposure_work_month + "月";//接害工龄
            } else {
                templateData.expYear = personInfo.exposure_work_month + "月";//接害工龄
            }
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.expYear += "0" + "月";//接害工龄
        }
        //当前最新一次体检日期(复查)
        templateData.nowRegistDate = formartDate(personInfo.nowRegistDate, 'yyyy-MM-dd');
        // templateData.nowRegistDate = formartDate(personInfo.registDate, 'yyyy-MM-dd');
    }
    if (personInfo) {
        let tdTjBadrsnsResult = "";
        if (personInfo.tdTjBadrsnsResult) {
            tdTjBadrsnsResult = personInfo.tdTjBadrsnsResult;
        }
        //查询总检信息
        if (personInfo.inspectionRecord) {
            let data = personInfo.inspectionRecord;
            //总检日期
            templateData.createTime = formartDate(data.inspectionDate, 'yyyy-MM-dd');
            let dateArray = templateData.createTime.split('-');
            templateData.ye = dateArray[0];
            templateData.mo = dateArray[1];
            templateData.da = dateArray[2];
            //复查总检日期
            // templateData.reviewInspectDate = formartDate(data.reviewInspectDate, 'yyyy-MM-dd');
            templateData.reviewInspectDate = formartDate(data.inspectionDate, 'yyyy-MM-dd');
            let dateReviewArray = templateData.reviewInspectDate.split('-');
            templateData.rye = dateReviewArray[0];
            templateData.rmo = dateReviewArray[1];
            templateData.rda = dateReviewArray[2];
            templateData.autograph = data.inspectionAutograph;//主检医生
            templateData.reviewResult = data.reviewResult;
            templateData.reviewOpinion = data.reviewOpinion;


            if (!templateData.reviewResult || (templateData.reviewResult && templateData.reviewResult.trim().length == 0)) {
                let conclusion = data.conclusion;
                let handleOpinion = data.handleOpinion;
                templateData.tdTjBadrsnsResult = tdTjBadrsnsResult;
                templateData.conclusion = conclusion;
                templateData.handleOpinion = handleOpinion;
                templateData.reviewResult = "" + conclusion + handleOpinion;
                if (_this.$hospitalName && _this.$hospitalName.suggestSplitting){
                    templateData.reviewResult = conclusion;
                    templateData.reviewOpinion = handleOpinion;
                }

                templateData.firstConclusion = "第一次体检结论";
                if (personInfo.inspectionRecordFirst){
                    if (personInfo.inspectionRecordFirst.conclusion){
                        templateData.firstzyjjl = "职业健康检查结论";
                        templateData.firstConclusion = "第一次体检结论";
                        templateData.firstconclusion = personInfo.inspectionRecordFirst.conclusion;
                    }
                    if (personInfo.inspectionRecordFirst.handleOpinion){
                        templateData.firstzyjjy = "职业健康体检建议";
                        templateData.firsthandleOpinion = personInfo.inspectionRecordFirst.handleOpinion;
                    }
                    templateData.firsttdTjBadrsnsResult = personInfo.tdTjBadrsnsResultFirst;
                }
            }
        }
    }
    return templateData;
}

/**
 * 总检报告（仅检查结果及处理意见）
 *
 */
function inspectionDataInitFCJL(personInfo, checkSign, physicalType) {
    let templateData = {};
    if (personInfo) {
        //查询总检信息
        if (personInfo.inspectionRecord) {
            let data = personInfo.inspectionRecord;
            //总检日期
            templateData.createTime = formartDate(data.inspectionDate, 'yyyy-MM-dd');
            let dateArray = templateData.createTime.split('-');
            templateData.ye = dateArray[0];
            templateData.mo = dateArray[1];
            templateData.da = dateArray[2];
            //复查总检日期
            templateData.reviewInspectDate = formartDate(data.reviewInspectDate, 'yyyy-MM-dd');
            let dateReviewArray = templateData.reviewInspectDate.split('-');
            templateData.rye = dateReviewArray[0];
            templateData.rmo = dateReviewArray[1];
            templateData.rda = dateReviewArray[2];
            templateData.autograph = data.inspectionAutograph;//主检医生
            templateData.reviewResult = data.reviewResult;
        }
    }
    return templateData;
}

/**
 * 总检报告（仅检查结果及处理意见）
 *
 */
function inspectionDataInitJL(_this, personInfo, checkSign, physicalType) {
    let templateData = {};
    if (personInfo) {
        //查询总检信息
        if (personInfo.inspectionRecord) {
            let data = personInfo.inspectionRecord;
            templateData.createTime = formartDate(data.inspectionDate, 'yyyy-MM-dd');
            let dateArray = templateData.createTime.split('-');
            templateData.ye = dateArray[0];
            templateData.mo = dateArray[1];
            templateData.da = dateArray[2];
            templateData.autograph = data.inspectionAutograph;//主检医生
            let conclusion = data.conclusion;
            let handleOpinion = data.handleOpinion;
            let jgyjDatasTZ = [];
            let qtjbyc = "";
            let clyj = "";
            let otherCheckAbnormalResults = "";
            let careerIllnessName = "";
            let others = [];
            if (data.otherCheckAbnormalResults && data.otherCheckAbnormalResults != "无" && data.careerIllnessName && data.careerIllnessName != "无") {
                qtjbyc = "其他疾病或异常：";
                clyj = "处理意见：";
                otherCheckAbnormalResults = data.otherCheckAbnormalResults;
                careerIllnessName = data.careerIllnessName;
                others.push({
                    qtjbyc: qtjbyc,
                    clyj: clyj,
                    otherCheckAbnormalResults: otherCheckAbnormalResults,
                    careerIllnessName: careerIllnessName
                })
            }
            let goods = [];
            let arr = [];
            //复查项目
            let review = "";
            if (personInfo.reviewProjectsList) {
                arr = personInfo.reviewProjectsList.filter(ii => ii.isPass == 1);
                if (arr.length > 0) {
                    review = "【复查】"
                    for (let i = 0; i < arr.length; i++) {
                        let groupItemName = arr[i].name.split("(复)");
                        goods.push({
                            projectName: groupItemName[0],//复查项目名
                            reviewExplain: arr[i].reason,//复查原因说明
                            reviewTime: formartDate(arr[i].checkDate, 'yyyy-MM-dd'),//复查日期
                            xmmc: "项目名称：",
                            fcsm: "复查说明：",
                        });
                    }
                    templateData.ry = dateArray[0];
                    templateData.rm = dateArray[1];
                    templateData.rd = dateArray[2];
                    templateData.reviewAutograph = data.inspectionAutograph;
                } else {
                    templateData.review = ""
                    goods.push({
                        projectName: "",//复查项目名
                        reviewExplain: "",//复查原因说明
                        reviewTime: "",//复查日期
                        xmmc: "",
                        fcsm: "",
                    });
                }
                jgyjDatasTZ.push({
                    //结论和意见
                    conclusion: conclusion,
                    handleOpinion: handleOpinion,
                    //其他结论和意见
                    others: others,
                    //复查
                    review: review,
                    goods: goods,
                })
                templateData.jgyjDatasTZ = jgyjDatasTZ;
            }
        }
    }
    return templateData;
}

/**
 * 告知书
 *
 */
function gzsDataInit(personInfo, checkSign, physicalType) {
    let templateData = {};
    //生成当前年份
    let date = new Date();
    let year = date.getFullYear();

    templateData.name = "-";//姓名
    templateData.testNum = "-";//体检编号
    templateData.physicalType = "-";//体检类型
    templateData.idCard = "-";//身份证号
    templateData.workStateText = "-";//监护种类(在岗状态)
    templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
    templateData.factors = "-";//职业危害因素
    templateData.unitName = "";//单位名称
    templateData.registDate = "-";//登记日期
    templateData.occupationalTaboo = "-";//职业禁忌证
    templateData.occupationalDiseases = "-";//疑是职业病
    templateData.year = "-";//今年
    templateData.number = personInfo.number;//编号
    templateData.workTypeText = "-"//工种名称;

    if (personInfo) {
        if (personInfo.regist_date) {
            templateData.registDate = formartDate(personInfo.regist_date, 'yyyy-MM-dd');//登记日期
        }
        if (personInfo.unit_name) {
            templateData.unitName = personInfo.unit_name;//单位名称
        }
        /*if (templateData.unitName == "" && personInfo.dept) {
            templateData.unitName = personInfo.dept;//单位名称
        }*/
        if (personInfo.person_name) {
            templateData.name = personInfo.person_name;//姓名
        }
        if (personInfo.test_num) {
            templateData.testNum = personInfo.test_num;//体检编号
        }
        if (personInfo.hazard_factors_text) {
            personInfo.hazard_factors_text = personInfo.hazard_factors_text.replaceAll("|", "、")
            templateData.factors = personInfo.hazard_factors_text;//职业危害因素
        }
        if (personInfo.physical_type) {
            templateData.physicalType = personInfo.physical_type;//体检类型
        }
        if (personInfo.id_card) {
            templateData.idCard = personInfo.id_card;//身份证号
        }
        if (personInfo.work_state_text) {
            templateData.workStateText = personInfo.work_state_text;//监护种类(在岗状态)
        }
        if (personInfo.hazard_factors_text) {
            templateData.hazardFactorsText = personInfo.hazard_factors_text;//监护危害(危害因素名称)
        }
        if (personInfo.occupational_taboo_now) {
            templateData.occupationalTaboo = personInfo.occupational_taboo_now;//职业禁忌证
        }
        if (personInfo.occupational_diseases_now) {
            personInfo.occupational_diseases_now = personInfo.occupational_diseases_now.replaceAll(";", "、")
            personInfo.occupational_diseases_now = personInfo.occupational_diseases_now.substr(0, personInfo.occupational_diseases_now.length - 1)
            templateData.occupationalDiseases = personInfo.occupational_diseases_now;//疑是职业病
        }
        if (personInfo.work_type_text) {
            templateData.workTypeText = personInfo.work_type_text;//工种名称
        }
        if (year) {
            templateData.year = year;//当前年份
        }
        if (personInfo.number) {
            templateData.number = Number(personInfo.number);//序号
        }
    }
    if (personInfo) {
        //登记日期
        let  dateArray = templateData.registDate.split('-');
        templateData.ye = dateArray[0];
        templateData.mo = dateArray[1];
        templateData.da = dateArray[2];
        templateData.createTime = formartDate(new Date(), 'yyyy-MM-dd');
        //当前日期
        let dateArrayNow = templateData.createTime.split('-');
        templateData.yn = dateArrayNow[0];
        templateData.mn = dateArrayNow[1];
        templateData.dn = dateArrayNow[2];
        //总检信息
        if (personInfo.inspectionRecord) {
            let data = personInfo.inspectionRecord;
            templateData.autograph = data.inspectionAutograph;//主检医生
            let conclusionNow = data.conclusion;
            let handleOpinionNow = data.handleOpinion;
            if (data.careerCheckAbnormalResults && data.careerCheckAbnormalResults != "" && data.careerCheckAbnormalResults != "无异常" && data.careerCheckAbnormalResults != "无") {
                conclusionNow = conclusionNow + data.careerCheckAbnormalResults
            }
            if (data.careerIllnessName && data.careerIllnessName != "" && data.careerIllnessName != "无异常" && data.careerIllnessName != "无") {
                handleOpinionNow = handleOpinionNow + data.careerIllnessName
            }
            templateData.conclusion = conclusionNow;
            templateData.handleOpinion = handleOpinionNow;
        }

    }
    return templateData;
}


/**
 * 封面
 *
 */
function fmDataInit(personInfo, checkSign, physicalType) {
    let templateData = {};

    if (personInfo) {
        if (personInfo.regist_date) {
            templateData.registDate = formartDate(personInfo.regist_date, 'yyyy-MM-dd');//登记日期
        }
        if (personInfo.unit_name) {
            templateData.unitName = personInfo.unit_name;//单位名称
        }
        /*if (templateData.unitName == "" && personInfo.dept) {
            templateData.unitName = personInfo.dept;//单位名称
        }*/
        if (personInfo.person_name) {
            templateData.name = personInfo.person_name;//姓名
        }
        if (personInfo.age) {
            templateData.age = personInfo.age + "岁";//年龄
        }
        if (personInfo.sex) {
            templateData.sex = personInfo.sex;//性别
        }
        if (personInfo.mobile) {
            templateData.mobile = personInfo.mobile;//联系电话
        }
        if (personInfo.test_num) {
            templateData.testNum = personInfo.test_num;//体检编号
        }
        if (personInfo.physical_type) {
            templateData.physicalType = personInfo.physical_type;//体检类型
        }
        if (personInfo.work_state_text) {
            templateData.workStateText = personInfo.work_state_text;//监护种类(在岗状态)
        }
    }
    return templateData;
}

/**
 * 问诊报告
 *
 */
function inquiryDataInit(_this, personInfo, checkSign, physicalType) {
    let templateData = {};
    templateData.name = "/";//姓名
    templateData.testNum = "/";//体检编号
    templateData.sex = "/";//性别
    templateData.age = "/";//年龄
    templateData.unitName = "/";//单位名称
    templateData.physicalType = "/";//体检类型
    templateData.education = "/";//文化程度
    templateData.familyAddress = "/";//家庭地址
    templateData.isMarry = "/";//婚姻状况
    templateData.nation = "/";//民族
    templateData.idCard = "/";//身份证号
    templateData.birthplaceName = "/";//籍贯(出生地名称)
    templateData.workStateText = "/";//监护种类(在岗状态)
    templateData.workYe = "/";//总工龄年
    templateData.expYe = "/";//接害工龄年
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
    templateData.quitSomking = "/";//戒烟年数
    if (personInfo) {
        /*放射体检-问诊信息*/
        if (personInfo.marriage_date) {
            templateData.marriageDate = formartDate(personInfo.marriage_date, 'yyyy年MM月dd日');
        }
        if (personInfo.quit_somking) {
            templateData.quitSomking = personInfo.quit_somking;
        }
        if (personInfo.spouse_radiation_situation) {
            templateData.spouseRadiationSituation = personInfo.spouse_radiation_situation;
        }
        if (personInfo.spouse_health_situation) {
            templateData.spouseHealthSituation = personInfo.spouse_health_situation;
        }
        if (personInfo.pregnancy_count) {
            templateData.pregnancyCount = personInfo.pregnancy_count;
        }
        if (personInfo.live_birth) {
            templateData.liveBirth = personInfo.live_birth;
        }
        if (personInfo.abortion_small) {
            templateData.abortionSmall = personInfo.abortion_small;
        }
        if (personInfo.multiparous) {
            templateData.multiparous = personInfo.multiparous;
        }
        if (personInfo.ectopic_pregnancy) {
            templateData.ectopicPregnancy = personInfo.ectopic_pregnancy;
        }
        if (personInfo.boys) {
            templateData.boys = personInfo.boys;
        }
        if (personInfo.boys_birth) {
            templateData.boysBirth = personInfo.boys_birth;
        }
        if (personInfo.girls) {
            templateData.girls = personInfo.girls;
        }
        if (personInfo.girls_birth) {
            templateData.girlsBirth = personInfo.girls_birth;
        }
        if (personInfo.infertility_reason) {
            templateData.infertilityReason = personInfo.infertility_reason;
        }
        if (personInfo.childrens_health) {
            templateData.childrensHealth = personInfo.childrens_health;
        }

        if (personInfo.wz_check_autograph) {
            templateData.autograph = personInfo.wz_check_autograph;//问诊科签名
        }
        if (personInfo.person_name) {
            templateData.name = personInfo.person_name;//姓名
        }
        if (personInfo.test_num) {
            templateData.testNum = personInfo.test_num;//体检编号
        }
        if (personInfo.sex) {
            templateData.sex = personInfo.sex;//性别
        }
        if (personInfo.age) {
            templateData.age = personInfo.age + "岁";//年龄
        }
        if (personInfo.unit_name) {
            templateData.unitName = personInfo.unit_name;//单位名称
        }
        if (personInfo.physical_type) {
            templateData.physicalType = personInfo.physical_type;//体检类型
        }
        if (personInfo.education) {
            templateData.education = personInfo.education;//文化程度
        }
        if (personInfo.family_address) {
            templateData.familyAddress = personInfo.family_address;//家庭地址
        }
        templateData.headImg = personInfo.avatar;//头像
        if (personInfo.is_marry) {
            templateData.isMarry = personInfo.is_marry;//婚姻状况
        }
        if (personInfo.nation) {
            templateData.nation = personInfo.nation;//民族
        }
        if (personInfo.id_card) {
            templateData.idCard = personInfo.id_card;//身份证号
        }
        if (personInfo.birthplace_name) {
            templateData.birthplaceName = personInfo.birthplace_name;//籍贯(出生地名称)
        }
        if (personInfo.work_state_text) {
            templateData.workStateText = personInfo.work_state_text;//监护种类(在岗状态)
        }

        if (personInfo.work_year && personInfo.work_year != "0" && personInfo.work_year != 0) {
            templateData.workYe = personInfo.work_year + "年";//总工龄年
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.workYe = "0" + "年";//总工龄年
        }
        if (personInfo.work_month && personInfo.work_month != "0" && personInfo.work_month != 0) {
            if (templateData.workYe.indexOf("年") > -1) {
                templateData.workYe += personInfo.work_month + "月";//总工龄月
            } else {
                templateData.workYe = personInfo.work_month + "月";//总工龄月
            }
        } else if (_this.$hospitalName.isShowWorkingYears) {
            templateData.workYe += "0" + "月";//总工龄年
        }

        if (personInfo.exposure_start_date) {
            templateData.expYe = formartDate(personInfo.exposure_start_date, 'yyyy-MM-dd');//接触开始时间
        }
        if (personInfo.existing_children) {
            templateData.child = personInfo.existing_children;//现有子女
        }
        if (personInfo.abortion) {
            templateData.abort = personInfo.abortion;//流产
        }
        if (personInfo.premature) {
            templateData.prem = personInfo.premature;//早产
        }
        if (personInfo.death) {
            templateData.death = personInfo.death;//死产
        }
        if (personInfo.abnormal_fetus) {
            templateData.abnor = personInfo.abnormal_fetus;//异常胎
        }
        if (personInfo.smoke_state) {
            if (_this.$hospitalName && _this.$hospitalName.SmokingStatus){
                let SmokingStatus = _this.$hospitalName.SmokingStatus[personInfo.smoke_state]//吸烟状态
                templateData.smokeState = SmokingStatus
                if (SmokingStatus == null || SmokingStatus == undefined){
                    templateData.smokeState = personInfo.smoke_state
                }
            }else {
                templateData.smokeState = personInfo.smoke_state
            }
        }
        if (personInfo.package_every_day) {
            templateData.package = personInfo.package_every_day;//包每天
        }
        if (personInfo.smoke_year) {
            templateData.smokeYear = personInfo.smoke_year;//吸烟年
        }
        if (personInfo.smoke_moon) {
            templateData.smokeMoon = personInfo.smoke_moon;//吸烟月
        }
        if (personInfo.drink_state) {
            templateData.drinkState = personInfo.drink_state;//喝酒状态
        }
        if (personInfo.ml_every_day) {
            templateData.mlDay = personInfo.ml_every_day;//ml每天
        }
        if (personInfo.drink_year) {
            templateData.drinkYear = personInfo.drink_year;//喝酒年
        }
        if (personInfo.mobile) {
            templateData.mobile = personInfo.mobile;//联系电话
        }
        if (personInfo.allergies) {
            templateData.allergies = personInfo.allergies;//过敏史
        }
        if (personInfo.allergies_info) {
            templateData.allergiesInfo = personInfo.allergies_info;//过敏史异常信息
        }
        if (personInfo.family_history) {
            templateData.familyHistory = personInfo.family_history;//家族史
        }
        if (personInfo.sex != "男") {
            if (personInfo.menarche) {
                templateData.menarche = personInfo.menarche;//初潮
            }
            if (personInfo.period) {
                templateData.period = personInfo.period;//经期
            }
            if (personInfo.cycle) {
                templateData.cycle = personInfo.cycle;//周期
            }
            if (personInfo.lastMe) {
                templateData.lastMe = personInfo.lastMe;//停经年龄
            }
            if (personInfo.menstrual_history) {
                templateData.menstrualHistory = personInfo.menstrual_history;//月经史
            }
            if (personInfo.menstrual_info) {
                templateData.menstrualInfo = personInfo.menstrual_info;//月经史异常信息
            }
        }
        if (personInfo.otherInfo) {
            templateData.otherInfo = personInfo.otherInfo;//其他信息
        }
        if (personInfo.past_medical_history_other_info) {
            templateData.pastMedicalHistoryOtherInfo = personInfo.past_medical_history_other_info;//既往病史其他信息
        }

        if (personInfo.work_type_text) {
            templateData.workTypeText = personInfo.work_type_text;//工种名称
        }
        if (personInfo.registDate) {
            templateData.createTime = formartDate(personInfo.registDate, 'yyyy-MM-dd');//送检时间(登记时间)
        }
        if (personInfo.diagnosisDate) {
            templateData.diagnosisDate = formartDate(personInfo.diagnosisDate, 'yyyy-MM-dd');//诊断日期
        }
        if (personInfo.birth) {
            templateData.birth = formartDate(personInfo.birth, 'yyyy-MM-dd');//出生日期
            let dateArray = templateData.birth.split('-');
            templateData.year = dateArray[0] + "年";//年--出生日期
            templateData.month = dateArray[1] + "月";//月--出生日期
            templateData.day = dateArray[2] + "日";//日·--出生日期

        }
        let hazardFactors = "";
        if (personInfo.hazard_factors) {
            hazardFactors = personInfo.hazard_factors;//危害因素编码
        }

        //查询人员的既往病史数据
        if (personInfo.pastMedicalHistory) {
            let pastMedicalHistoryData = [];//既往病史 数据集
            pastMedicalHistoryData = personInfo.pastMedicalHistory;
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

            if (physicalType != "从业体检") {
                //查询人员的职业史数据
                if (personInfo.careerHistory) {
                    if (physicalType == "职业体检" && !(hazardFactors && (hazardFactors.indexOf("160002") > -1 || hazardFactors.indexOf("160501") > -1 || hazardFactors.indexOf("160502") > -1 || hazardFactors.indexOf("160503") > -1 || hazardFactors.indexOf("160504") > -1 || hazardFactors.indexOf("160506") > -1 || hazardFactors.indexOf("160507") > -1 || hazardFactors.indexOf("160999") > -1))) {
                        let careerHisData = [];//职业史 数据集
                        careerHisData = personInfo.careerHistory;
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
                                    if (workTypeText.indexOf("其他") > -1) {
                                        workTypeText = personInfo.work_name;
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
                                if (careerHisData[i].department) {
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
                    } else if (physicalType == "放射体检" || (hazardFactors && (hazardFactors.indexOf("160002") > -1 || hazardFactors.indexOf("160501") > -1 || hazardFactors.indexOf("160502") > -1 || hazardFactors.indexOf("160503") > -1 || hazardFactors.indexOf("160504") > -1 || hazardFactors.indexOf("160506") > -1 || hazardFactors.indexOf("160507") > -1 || hazardFactors.indexOf("160999") > -1))) {
                        let careerHisData = [];//职业史 数据集
                        careerHisData = personInfo.careerHistory;
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
                                    if (workTypeText.indexOf("其他") >-1 ) {
                                        workTypeText = personInfo.work_name;
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

                    if (personInfo.symptom) {
                        if (physicalType == "职业体检" && !(hazardFactors && (hazardFactors.indexOf("160002") > -1 || hazardFactors.indexOf("160501") > -1 || hazardFactors.indexOf("160502") > -1 || hazardFactors.indexOf("160503") > -1 || hazardFactors.indexOf("160504") > -1 || hazardFactors.indexOf("160506") > -1 || hazardFactors.indexOf("160507") > -1 || hazardFactors.indexOf("160999") > -1))) {
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
                            /*症状数据symptom*/
                            //projectName项目名称 degree程度 courseTime病程时间
                            let symptomData = [];//症状 数据集
                            symptomData = personInfo.symptom;

                            //医生签名(症状)
                            // templateData.autograph = '';//检查医生
                            if (symptomData.length > 0) {
                                for (let i = 0; i < symptomData.length; i++) {
                                    /*if (!templateData.autograph || templateData.autograph == '') {
                                    if (symptomData[i].createName) {
                                        templateData.autograph = symptomData[i].createName;
                                    }
                                }*/
                                    if (symptomData[i].projectName) {
                                        if (symptomData[i].projectName.trim() == "头痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeTT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeTT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "头昏") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeTH = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeTH = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "眩晕") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXY = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXY = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "失眠") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSM = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSM = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "嗜睡") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSS = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSS = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "多梦") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeDM = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeDM = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "记忆力减退") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeJYL = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeJYL = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "易激动") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeYJD = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeYJD = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "疲乏无力") {
                                            if (symptomData[i].degree) {
                                                templateData.degreePF = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timePF = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "四肢麻木") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeMM = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeMM = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "动作不灵活") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeBLH = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeBLH = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "肌肉抽搐") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeCC = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeCC = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "消瘦") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXS = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXS = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "口渴") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeKK = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeKK = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "皮肤瘙痒") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSY = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSY = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "皮疹") {
                                            if (symptomData[i].degree) {
                                                templateData.degreePZ = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timePZ = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "低热") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeDR = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeDR = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "脱发") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeTF = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeTF = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "盗汗") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeDH = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeDH = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "气促") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeQC = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeQC = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "气短") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeQD = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeQD = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "胸闷") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeMX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeMX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "胸痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "咳嗽") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeKS = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeKS = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "咳痰") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeKT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeKT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "咯血") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeLX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeLX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "哮喘") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXC = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXC = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "尿频") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeNP = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeNP = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "尿急") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeNJ = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeNJ = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "尿痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeNT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeNT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "血尿") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXN = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXN = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "浮肿") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeFZ = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeFZ = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "性欲减退") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXYJT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXYJT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "全身酸痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeQSST = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeQSST = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "肌肉疼痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeJRST = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeJRST = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "肌无力及关节疼痛") {//肌无力
                                            if (symptomData[i].degree) {
                                                templateData.degreeJWL = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeJWL = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "肌无力及关节疼痛") {//关节疼痛
                                            if (symptomData[i].degree) {
                                                templateData.degreeGJTT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeGJTT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "视物模糊") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSJMH = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSJMH = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "视力下降") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSLXJ = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSLXJ = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "眼痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeYT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeYT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "羞明") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXM = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXM = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "流泪") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeLL = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeLL = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "嗅觉减退") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXJJT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXJJT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "鼻干") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeBG = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeBG = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "鼻塞") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeBS = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeBS = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "流鼻血") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeLBX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeLBX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "流涕") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeLT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeLT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "耳鸣") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeEM = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeEM = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "耳聋") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeEN = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeEN = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "流涎") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeLY = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeLY = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "牙痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeYaT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeYaT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "牙齿松动") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeYCSD = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeYCSD = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "刷牙出血") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSYCX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSYCX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "口腔异味") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeKQYW = symptomData[i].degree;//程度
                                            }
                                            templateData.timeKQYW = symptomData[i].courseTime;//病程时间
                                        }
                                        if (symptomData[i].projectName.trim() == "口腔溃疡") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeKQKY = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeKQKY = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "咽部疼痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeYBTT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeYBTT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "声嘶") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSSi = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSSi = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "心悸") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXJi = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXJi = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "心前区不适") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXQBS = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXQBS = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "心前区疼痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeXQTT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeXQTT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "食欲不振") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeSYBZ = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeSYBZ = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "肝区疼痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeGQTT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeGQTT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "腹胀") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeFZ = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeFZ = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "腹痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeFT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeFT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "恶心") {//恶心、呕吐
                                            if (symptomData[i].degree) {
                                                templateData.degreeEX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeEX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "呕吐") {//恶心、呕吐
                                            if (symptomData[i].degree) {
                                                templateData.degreeOT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeOT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "腹泻") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeFX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeFX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "便秘") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeBM = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeBM = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "便血") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeBX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeBX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "月经异常") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeYJYC = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeYJYC = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "皮下出血") {
                                            if (symptomData[i].degree) {
                                                templateData.degreePXCX = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timePXCX = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "多汗") {
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
                                        if (symptomData[i].type && symptomData[i].type.trim() == "其他") {
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
                        } else if (physicalType == "放射体检" || (hazardFactors && (hazardFactors.indexOf("160002") > -1 || hazardFactors.indexOf("160501") > -1 || hazardFactors.indexOf("160502") > -1 || hazardFactors.indexOf("160503") > -1 || hazardFactors.indexOf("160504") > -1 || hazardFactors.indexOf("160506") > -1 || hazardFactors.indexOf("160507") > -1 || hazardFactors.indexOf("160999") > -1))) {
                            /*症状数据 放射体检*/
                            //projectName项目名称 degree程度 courseTime病程时间
                            let symptomData = [];//症状 数据集
                            let consciousSymptoms = [];//自觉症状
                            symptomData = personInfo.symptom;
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
                    }

                }

            }
        }
    }

    return templateData;
}


/**
 * 肺功能
 **/
function fgnDataInit(tableMonitoring, data) {
    let vitalCapacity1 = [];
    let vitalCapacity2 = [];
    let vitalCapacity3 = [];
    let vitalCapacityFX = [];
    let vitalCapacityShort1 = _thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort1;
    let vitalCapacityShort2 = _thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort2;
    let vitalCapacityShort3 = _thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort3;
    let vitalCapacityShortFX = _thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShortFX;//分项汇总，肺功能检查项：一秒率(第一秒钟用力呼气容积占预计值百分比)、第一秒用力呼气率、用力肺活量占预计值百分比一秒率(第一秒钟用力呼气容积占预计值百分比)、第一秒用力呼气率、用力肺活量占预计值百分比

    if (data && data.length > 0) {
        vitalCapacityShortFX.forEach(i => {
            let items = data.filter(o => o.shortName == i);
            if (items && items.length > 0) {
                let referenceRange = "";
                if (items[0].updateId && items[0].updateId != null) {
                    if (items[0].updateId == "/") {
                        referenceRange = "/";
                    } else {
                        referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : 0;
                    }
                } else {
                    // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                    referenceRange = 0;
                }
                vitalCapacityFX.push({
                    monitorName: items[0].orderGroupItemProjectName,
                    value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                    referenceRange: referenceRange,
                    resultTips: (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "/" && referenceRange != "-") ? (((items[0].result.toString().trim() / referenceRange).toFixed(4)) * 100).toFixed(2) : 0,
                    unit: items[0].unitName ? items[0].unitName.trim() : "",
                    scope: items[0].scope ? items[0].scope.trim() : "-"
                });
            } else {
                if (items && items.length > 0) {
                    vitalCapacityFX.push({
                        monitorName: i,
                        value: "-",
                        resultTips: '-',
                        referenceRange: "-",
                        unit: "-",
                        scope: "-"
                    });
                }
            }
        });
        tableMonitoring.vitalCapacityFX = vitalCapacityFX;
        vitalCapacityShort1.forEach(i => {
            let items = data.filter(o => o.shortName == i);
            if (items && items.length > 0) {
                let referenceRange = "";
                if (items[0].updateId && items[0].updateId != null) {
                    if (items[0].updateId == "/") {
                        referenceRange = "/";
                    } else {
                        referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : 0;
                    }
                } else {
                    // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                    referenceRange = 0;
                }
                vitalCapacity1.push({
                    monitorName: items[0].orderGroupItemProjectName,
                    value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                    referenceRange: referenceRange,
                    // resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                    resultTips: (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "/" && referenceRange != "-") ? (((items[0].result.toString().trim() / referenceRange).toFixed(4)) * 100).toFixed(2) : 0,
                    unit: items[0].unitName ? items[0].unitName.trim() : "",
                    scope: items[0].scope ? items[0].scope.trim() : "-"
                });
            } else {
                if (items && items.length > 0) {
                    vitalCapacity1.push({
                        monitorName: i,
                        value: "-",
                        resultTips: '-',
                        referenceRange: "-",
                        unit: "-",
                    });
                }
            }
        });
        vitalCapacityShort2.forEach(i => {
            let items = data.filter(o => o.shortName == i);
            if (items && items.length > 0) {
                let referenceRange = "";
                if (items[0].updateId && items[0].updateId != null) {
                    if (items[0].updateId == "/") {
                        referenceRange = "/";
                    } else {
                        referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : "";
                    }
                } else {
                    // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                    referenceRange = "";
                }
                if (referenceRange == 0) {
                    referenceRange = "";
                }
                vitalCapacity2.push({
                    monitorName: items[0].orderGroupItemProjectName,
                    value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                    referenceRange: referenceRange,
                    // resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                    resultTips: (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "/" && referenceRange != "-") ? (((items[0].result.toString().trim() / referenceRange).toFixed(4)) * 100).toFixed(2) : "",
                    unit: items[0].unitName ? items[0].unitName.trim() : "",
                    scope: items[0].scope ? items[0].scope.trim() : "-"
                });
            } else {
                if (items && items.length > 0) {
                    vitalCapacity2.push({
                        monitorName: i,
                        value: "-",
                        resultTips: '-',
                        referenceRange: "-",
                        unit: "-"
                    });
                }
            }
        });
        vitalCapacityShort3.forEach(i => {
            let items = data.filter(o => o.shortName == i);
            if (items && items.length > 0) {
                let referenceRange = "";
                if (items[0].updateId && items[0].updateId != null) {
                    if (items[0].updateId == "/") {
                        referenceRange = "/";
                    } else {
                        referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : 0;
                    }
                } else {
                    // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                    referenceRange = 0;
                }
                vitalCapacity3.push({
                    monitorName: items[0].orderGroupItemProjectName,
                    value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                    referenceRange: referenceRange,
                    // resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                    resultTips: (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "/" && referenceRange != "-") ? (((items[0].result.toString().trim() / referenceRange).toFixed(4)) * 100).toFixed(2) : 0,
                    unit: items[0].unitName ? items[0].unitName.trim() : "",
                    scope: items[0].scope ? items[0].scope.trim() : "-"
                });
            } else {
                if (items && items.length > 0) {
                    vitalCapacity3.push({
                        monitorName: i,
                        value: "-",
                        resultTips: '-',
                        referenceRange: "-",
                        unit: "-"
                    });
                }
            }
        });
    }

    tableMonitoring.vitalCapacity1 = vitalCapacity1;
    tableMonitoring.vitalCapacity2 = vitalCapacity2;
    tableMonitoring.vitalCapacity3 = vitalCapacity3;

}

/**
 *
 * 纯音
 *
 * */
function pureTone(datas, td, _this) {
    //气体·
    let r500, r1000, r2000, r3000, r4000, r6000;
    let l500, l1000, l2000, l3000, l4000, l6000;
    //骨导
    let gr500, gr1000, gr2000, gr3000, gr4000, gr6000;
    let gl500, gl1000, gl2000, gl3000, gl4000, gl6000;
    let data = datas.filter(i=> i.result != null && i.result != '');
    if (data && data.length > 0) {
        data.forEach(i => {
            //单个基础项
            //气体
            if (i.orderGroupItemProjectName) {
                let result = i.result;
                if (result == null && _this.$hospitalName && _this.$hospitalName.isNotShowGTc6000) {
                    result = 0;
                } else if (result == null) {
                    result = '';
                }
                if (i.orderGroupItemProjectName.indexOf("6000Hz(骨导)") > -1) {
                    if (result == 0 && _this.$hospitalName && _this.$hospitalName.isNotShowGTc6000) {
                        result = '';
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "左耳500Hz") {
                    l500 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳1000Hz") {
                    l1000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳2000Hz") {
                    l2000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳3000Hz") {
                    l3000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳4000Hz") {
                    l4000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳6000Hz") {
                    l6000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳500Hz") {
                    r500 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳1000Hz") {
                    r1000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳2000Hz") {
                    r2000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳3000Hz") {
                    r3000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳4000Hz") {
                    r4000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳6000Hz") {
                    r6000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳语频平均听阈") {
                    td.HLl = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳语频平均听阈") {
                    td.HLr = result;
                }
                if (i.orderGroupItemProjectName.trim() == "双耳高频平均听阈") {
                    td.GFA = result;
                }
                //骨导
                if (i.orderGroupItemProjectName.trim() == "左耳500Hz(骨导)") {
                    gl500 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳1000Hz(骨导)") {
                    gl1000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳2000Hz(骨导)") {
                    gl2000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳3000Hz(骨导)") {
                    gl3000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳4000Hz(骨导)") {
                    gl4000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳6000Hz(骨导)") {
                    gl6000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳500Hz(骨导)") {
                    gr500 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳1000Hz(骨导)") {
                    gr1000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳2000Hz(骨导)") {
                    gr2000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳3000Hz(骨导)") {
                    gr3000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳4000Hz(骨导)") {
                    gr4000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳6000Hz(骨导)") {
                    gr6000 = result;
                }
                if (i.orderGroupItemProjectName.trim() == "左耳语频平均听阈(骨导)") {
                    td.gHLl = result;
                }
                if (i.orderGroupItemProjectName.trim() == "右耳语频平均听阈(骨导)") {
                    td.gHLr = result;
                }
                if (i.orderGroupItemProjectName.trim() == "双耳高频平均听阈(骨导)") {
                    td.gGFA = result;
                }
                //双耳语频平均值
                if (i.orderGroupItemProjectName.trim() == "双耳高频平均听阈") {
                    td.seyp = result;
                }
                if (i.orderGroupItemProjectName.trim() == "双耳高频平均听阈(骨导)") {
                    td.SEYPG = result;
                }
            }
        })
    } else {
        l500 = '';
        l1000 = '';
        l2000 = '';
        l3000 = '';
        l4000 = '';
        l6000 = '';
        r500 = '';
        r1000 = '';
        r2000 = '';
        r3000 = '';
        r4000 = '';
        r6000 = '';
        gl500 = '';
        gl1000 = '';
        gl2000 = '';
        gl3000 = '';
        gl4000 = '';
        gl6000 = '';
        gr500 = '';
        gr1000 = '';
        gr2000 = '';
        gr3000 = '';
        gr4000 = '';
        gr6000 = '';
    }
    if (_this.$hospitalName && _this.$hospitalName.isNotShowGTc6000) {
        if (gr6000 == 0) {
            gr6000 = '';
        }
        if (gl6000 == 0) {
            gl6000 = '';
        }
    }
    //气导(修正)
    td.xr500 = r500 != '' ? r500 : '—';
    td.xr1000 = r1000 != '' ? r1000 : '—';
    td.xr2000 = r2000 != '' ? r2000 : '—';
    td.xr3000 = r3000 != '' ? r3000 : '—';
    td.xr4000 = r4000 != '' ? r4000 : '—';
    td.xr6000 = r6000 != '' ? r6000 : '—';
    td.xl500 = l500 != '' ? l500 : '—';
    td.xl1000 = l1000 != '' ? l1000 : '—';
    td.xl2000 = l2000 != '' ? l2000 : '—';
    td.xl3000 = l3000 != '' ? l3000 : '—';
    td.xl4000 = l4000 != '' ? l4000 : '—';
    td.xl6000 = l6000 != '' ? l6000 : '—';
    //骨导(修正)
    td.xgr500 = gr500 != '' ? gr500 : '—';
    td.xgr1000 = gr1000 != '' ? gr1000 : '—';
    td.xgr2000 = gr2000 != '' ? gr2000 : '—';
    td.xgr3000 = gr3000 != '' ? gr3000 : '—';
    td.xgr4000 = gr4000 != '' ? gr4000 : '—';
    td.xgr6000 = gr6000 != '' ? gr6000 : '—';
    td.xgl500 = gl500 != '' ? gl500 : '—';
    td.xgl1000 = gl1000 != '' ? gl1000 : '—';
    td.xgl2000 = gl2000 != '' ? gl2000 : '—';
    td.xgl3000 = gl3000 != '' ? gl3000 : '—';
    td.xgl4000 = gl4000 != '' ? gl4000 : '—';
    td.xgl6000 = gl6000 != '' ? gl6000 : '—';
    //骨导加权值
    let gWVr = ((Number(gr500) + Number(gr1000) + Number(gr2000)) / 3 * 0.9 + Number(gr4000) * 0.1).toFixed(0);//右耳 骨导加权值
    let gWVl = ((Number(gl500) + Number(gl1000) + Number(gl2000)) / 3 * 0.9 + Number(gl4000) * 0.1).toFixed(0);//左耳 骨导加权值
    td.gWVr = gWVr;
    td.gWVl = gWVl;
    //气导加权值
    let WVr = ((Number(r500) + Number(r1000) + Number(r2000)) / 3 * 0.9 + Number(r4000) * 0.1).toFixed(0);//右耳 气导加权值
    let WVl = ((Number(l500) + Number(l1000) + Number(l2000)) / 3 * 0.9 + Number(l4000) * 0.1).toFixed(0);//左耳 气导加权值
    td.WVr = WVr;
    td.WVl = WVl;
    let cyShowGD = [];
    if (td.gHLl && td.gHLl != 0) {
        cyShowGD.push({
            gHLl: td.gHLl,
            gHLr: td.gHLr,
            gGFA: td.gGFA,
            SEYPG: td.SEYPG,
            cyDatasTZGD: [],
        });
    }
    td.cyShowGD = cyShowGD;
    //获取未修正前的值
    if (data && data.length > 0) {
        data.forEach(i => {
            //单个基础项
            //气体
            if (i.orderGroupItemProjectName) {
                let result = i.deleteId;//未修正
                if (result == null) {
                    if (_this.$hospitalName && _this.$hospitalName.isNotShowGTc6000) {
                        result = 0;
                    } else {
                        result = '';
                    }
                } else {
                    if (i.orderGroupItemProjectName.indexOf("6000Hz(骨导)") > -1) {
                        if (result == 0 && _this.$hospitalName && _this.$hospitalName.isNotShowGTc6000) {
                            result = '';
                        }
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳500Hz") {
                        l500 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳1000Hz") {
                        l1000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳2000Hz") {
                        l2000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳3000Hz") {
                        l3000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳4000Hz") {
                        l4000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳6000Hz") {
                        l6000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳500Hz") {
                        r500 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳1000Hz") {
                        r1000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳2000Hz") {
                        r2000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳3000Hz") {
                        r3000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳4000Hz") {
                        r4000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳6000Hz") {
                        r6000 = result;
                    }
                    //骨导
                    if (i.orderGroupItemProjectName.trim() == "左耳500Hz(骨导)") {
                        gl500 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳1000Hz(骨导)") {
                        gl1000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳2000Hz(骨导)") {
                        gl2000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳3000Hz(骨导)") {
                        gl3000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳4000Hz(骨导)") {
                        gl4000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "左耳6000Hz(骨导)") {
                        gl6000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳500Hz(骨导)") {
                        gr500 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳1000Hz(骨导)") {
                        gr1000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳2000Hz(骨导)") {
                        gr2000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳3000Hz(骨导)") {
                        gr3000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳4000Hz(骨导)") {
                        gr4000 = result;
                    }
                    if (i.orderGroupItemProjectName.trim() == "右耳6000Hz(骨导)") {
                        gr6000 = result;
                    }
                }
            }
        })
    } else {
        l500 = '';
        l1000 = '';
        l2000 = '';
        l3000 = '';
        l4000 = '';
        l6000 = '';
        r500 = '';
        r1000 = '';
        r2000 = '';
        r3000 = '';
        r4000 = '';
        r6000 = '';
        gl500 = '';
        gl1000 = '';
        gl2000 = '';
        gl3000 = '';
        gl4000 = '';
        gl6000 = '';
        gr500 = '';
        gr1000 = '';
        gr2000 = '';
        gr3000 = '';
        gr4000 = '';
        gr6000 = '';
    }
    //线条区分显示 没有就不显示
    if ((gr500 == 0||gr500==null) && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0) {//骨导右耳
        //骨导
        gr500 = '';
        gr1000 = '';
        gr2000 = '';
        gr3000 = '';
        gr4000 = '';
        gr6000 = '';
    }
    if (gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0) {//骨导左耳
        //骨导
        gl500 = '';
        gl1000 = '';
        gl2000 = '';
        gl3000 = '';
        gl4000 = '';
        gl6000 = '';
    }
    if (r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0) {//气导右耳
        //气体
        r500 = '';
        r1000 = '';
        r2000 = '';
        r3000 = '';
        r4000 = '';
        r6000 = '';
    }
    if (l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0) {//气导左耳
        //气体
        l500 = '';
        l1000 = '';
        l2000 = '';
        l3000 = '';
        l4000 = '';
        l6000 = '';
    }
    //存入字符串集合
    if (_this.$hospitalName && _this.$hospitalName.isNotShowGTc6000) {
        if (gr6000 == 0) {
            gr6000 = '';
        }
        if (gl6000 == 0) {
            gl6000 = '';
        }
    }
    td.leftImgChart = {
        "x": ["500", "1000", "2000", "3000", "4000", "6000"],
        "y": [l500, l1000, l2000, l3000, l4000, l6000],
        "gy": [gl500, gl1000, gl2000, gl3000, gl4000, gl6000]
    };
    td.rightImgChart = {
        "x": ["500", "1000", "2000", "3000", "4000", "6000"],
        "y": [r500, r1000, r2000, r3000, r4000, r6000],
        "gy": [gr500, gr1000, gr2000, gr3000, gr4000, gr6000]
    };
    //明细值变量命名
    //气体
    td.r500 = r500 != '' ? r500 : '—';
    td.r1000 = r1000 != '' ? r1000 : '—';
    td.r2000 = r2000 != '' ? r2000 : '—';
    td.r3000 = r3000 != '' ? r3000 : '—';
    td.r4000 = r4000 != '' ? r4000 : '—';
    td.r6000 = r6000 != '' ? r6000 : '—';
    td.l500 = l500 != '' ? l500 : '—';
    td.l1000 = l1000 != '' ? l1000 : '—';
    td.l2000 = l2000 != '' ? l2000 : '—';
    td.l3000 = l3000 != '' ? l3000 : '—';
    td.l4000 = l4000 != '' ? l4000 : '—';
    td.l6000 = l6000 != '' ? l6000 : '—';
    //骨导
    td.gr500 = gr500 != '' ? gr500 : '—';
    td.gr1000 = gr1000 != '' ? gr1000 : '—';
    td.gr2000 = gr2000 != '' ? gr2000 : '—';
    td.gr3000 = gr3000 != '' ? gr3000 : '—';
    td.gr4000 = gr4000 != '' ? gr4000 : '—';
    td.gr6000 = gr6000 != '' ? gr6000 : '—';
    td.gl500 = gl500 != '' ? gl500 : '—';
    td.gl1000 = gl1000 != '' ? gl1000 : '—';
    td.gl2000 = gl2000 != '' ? gl2000 : '—';
    td.gl3000 = gl3000 != '' ? gl3000 : '—';
    td.gl4000 = gl4000 != '' ? gl4000 : '—';
    td.gl6000 = gl6000 != '' ? gl6000 : '—';

    td.tgHLl = td.gHLl && td.gHLl != 0 ? td.gHLl : '—';
    td.tgHLr = td.gHLr && td.gHLr != 0 ? td.gHLr : '—';
    td.tgGFA = td.gGFA && td.gGFA != 0 ? td.gGFA : '—';
    td.tHLl = td.HLl && td.HLl != 0 ? td.HLl : '—';
    td.tHLr = td.HLr && td.HLr != 0 ? td.HLr : '—';
    td.tGFA = td.GFA && td.GFA != 0 ? td.GFA : '—';
    td.tgWVr = gWVr && gWVr != 0 ? gWVr : '—';
    td.tgWVl = gWVl && gWVl != 0 ? gWVl : '—';
    td.tWVr = WVr && WVr != 0 ? WVr : '—';
    td.tWVl = WVl && WVl != 0 ? WVl : '—';
    return td;
}


/**
 *
 * 心电图
 *
 * */
function ecgImageData(data, td) {
    if (data && data.length > 0) {
        data.forEach(i => {
            if (i) {
                if (i.imgUrl) {
                    let imgUrl = i.imgUrl;
                    let array = imgUrl.split('/tempFileUrl');
                    let zoncareImg = array[1];
                    td.zoncareImg = zoncareImg;
                    td.zoncareResult = i.diagnoseSum;
                }
            }
        })
    }
    return td;
}

/**
 *
 * 口腔定位检查(牙齿十字线)
 *
 * */
function kqcgImageData(data, td) {
    let rightTop = [];
    let leftTop = [];
    let rightBottom = [];
    let leftBottom = [];
    if (data && data.length > 0) {
        data.forEach(i => {
            if (i) {
                let arrow = i.arrow.trim();
                let value = i.result.trim();
                let monitorName = i.orderGroupItemProjectName.trim();
                // if(arrow && arrow != '-'){
                if (value && value != '正常') {
                    if (monitorName.indexOf("中切牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(1);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(1);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(1);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(1);
                        }
                    } else if (monitorName.indexOf("侧切牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(2);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(2);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(2);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(2);
                        }
                    } else if (monitorName.indexOf("尖牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(3);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(3);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(3);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(3);
                        }
                    } else if (monitorName.indexOf("第一前磨牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(4);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(4);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(4);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(4);
                        }
                    } else if (monitorName.indexOf("第二前磨牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(5);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(5);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(5);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(5);
                        }
                    } else if (monitorName.indexOf("第一磨牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(6);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(6);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(6);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(6);
                        }
                    } else if (monitorName.indexOf("第二磨牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(7);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(7);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(7);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(7);
                        }
                    } else if (monitorName.indexOf("第三磨牙") > -1) {
                        if (monitorName.indexOf("右上") > -1) {
                            rightTop.push(8);
                        } else if (monitorName.indexOf("左上") > -1) {
                            leftTop.push(8);
                        } else if (monitorName.indexOf("右下") > -1) {
                            rightBottom.push(8);
                        } else if (monitorName.indexOf("左下") > -1) {
                            leftBottom.push(8);
                        }
                    }
                }
            }
        });
    }

    let rightTopPX = numbersDesc(rightTop);
    let leftTopPX = numbersAsc(leftTop);
    let rightBottomPX = numbersDesc(rightBottom);
    let leftBottomPX = numbersAsc(leftBottom);

    td.rightTop = rightTopPX.join().trim();
    td.leftTop = leftTopPX.join().trim();
    td.rightBottom = rightBottomPX.join().trim();
    td.leftBottom = leftBottomPX.join().trim();

    return td;
}

/**
 *
 * 排序 asc
 *
 * */
function numbersAsc(numbers) {
    for (let i = 0; i < numbers.length - 1; i++) {
        for (let j = 0; j < numbers.length - 1 - i; j++) {
            if (numbers[j] > numbers[j + 1]) {
                let temp = numbers[j];
                numbers[j] = numbers[j + 1];
                numbers[j + 1] = temp;
            }
        }
    }
    return numbers;
}

/**
 *
 * 排序 desc
 *
 * */
function numbersDesc(numbers) {
    for (let i = 0; i < numbers.length - 1; i++) {
        for (let j = 0; j < numbers.length - 1 - i; j++) {
            if (numbers[j] < numbers[j + 1]) {
                let temp = numbers[j];
                numbers[j] = numbers[j + 1];
                numbers[j + 1] = temp;
            }
        }
    }
    return numbers;
}

/**
 *
 * 眼科常规
 *
 * */
function ophthalmicRoutine(data, td) {
    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            let result = "";
            if (i.result) {
                result = i.result;
            } else {
                result = 0;
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "色觉(右)") {
                    td.colorVisionRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "色觉(左)") {
                    td.colorVisionLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "暗适应(右)") {
                    td.darkAdaptationRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "暗适应(左)") {
                    td.darkAdaptationLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "视野(右)") {
                    td.suitableFieldRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "视野(左)") {
                    td.suitableFieldLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼视力(右)") {
                    if (result == 0) {
                        td.nakedEyeRight = "-";
                    } else {
                        td.nakedEyeRight = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼视力(左)") {
                    if (result == 0) {
                        td.nakedEyeLeft = "-";
                    } else {
                        td.nakedEyeLeft = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正视力(右)") {
                    if (result == 0) {
                        td.correctRight = "-";
                    } else {
                        td.correctRight = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正视力(左)") {
                    if (result == 0) {
                        td.correctLeft = "-";
                    } else {
                        td.correctLeft = result + unit;
                    }
                }

                if (i.orderGroupItemProjectName.trim() == "裸眼远视力(右)") {
                    if (result == 0) {
                        td.nakedEyeRightY = "-";
                    } else {
                        td.nakedEyeRightY = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼远视力(左)") {
                    if (result == 0) {
                        td.nakedEyeLeftY = "-";
                    } else {
                        td.nakedEyeLeftY = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正远视力(右)") {
                    if (result == 0) {
                        td.correctRightY = "-";
                    } else {
                        td.correctRightY = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正远视力(左)") {
                    if (result == 0) {
                        td.correctLeftY = "-";
                    } else {
                        td.correctLeftY = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼近视力(右)") {
                    if (result == 0) {
                        td.nakedEyeRightJ = "-";
                    } else {
                        td.nakedEyeRightJ = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼近视力(左)") {
                    if (result == 0) {
                        td.nakedEyeLeftJ = "-";
                    } else {
                        td.nakedEyeLeftJ = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正近视力(右)") {
                    if (result == 0) {
                        td.correctRightJ = "-";
                    } else {
                        td.correctRightJ = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正近视力(左)") {
                    if (result == 0) {
                        td.correctLeftJ = "-";
                    } else {
                        td.correctLeftJ = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼深视力(右)") {
                    if (result == 0) {
                        td.nakedEyeRightS = "-";
                    } else {
                        td.nakedEyeRightS = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼深视力(左)") {
                    if (result == 0) {
                        td.nakedEyeLeftS = "-";
                    } else {
                        td.nakedEyeLeftS = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正深视力(右)") {
                    if (result == 0) {
                        td.correctRightS = "-";
                    } else {
                        td.correctRightS = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正深视力(左)") {
                    if (result == 0) {
                        td.correctLeftS = "-";
                    } else {
                        td.correctLeftS = result + unit;
                    }
                }

                if (i.orderGroupItemProjectName.trim() == "结膜(右)") {
                    td.conjunctivaRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "结膜(左)") {
                    td.conjunctivaLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "角膜(右)") {
                    td.cornealRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "角膜(左)") {
                    td.cornealLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "前房(右)") {
                    td.anteriorChamberRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "前房(左)") {
                    td.anteriorChamberLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "虹膜(右)") {
                    td.irisRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "虹膜(左)") {
                    td.irisLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "晶状体(右)") {
                    td.lensRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "晶状体(左)") {
                    td.lensLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "眼底(右)") {
                    td.fundusRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "眼底(左)") {
                    td.fundusLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "眼科其他") {
                    td.ophthalmologyOthers = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "晶体(左)" && result) {
                    td.crystalLeft = result + unit;
                    if (result.indexOf("透明") > -1) {
                        td.jthctNumL = 1;
                    } else if (result.indexOf("轻度") > -1) {
                        td.jthctNumL = 2;
                    } else if (result.indexOf("中度") > -1) {
                        td.jthctNumL = 3;
                    } else if (result.indexOf("重度") > -1) {
                        td.jthctNumL = 4;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "晶体(右)") {
                    td.crystalRight = result + unit;
                    if (result.indexOf("透明") > -1) {
                        td.jthctNumR = 1;
                    } else if (result.indexOf("轻度") > -1) {
                        td.jthctNumR = 2;
                    } else if (result.indexOf("中度") > -1) {
                        td.jthctNumR = 3;
                    } else if (result.indexOf("重度") > -1) {
                        td.jthctNumR = 4;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "玻璃体(左)") {
                    td.glassLeft = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "玻璃体(右)") {
                    td.glassRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "眼前部(右)") {
                    td.anteriorPartRight = result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "眼前部(左)") {
                    td.anteriorPartLeft = result + unit;
                }
            }
        }
    })
    return td;
}

/**
 *
 * 妇科检查
 *
 * */
function gynaecology(data, td) {
    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "外阴") {
                    td.vulva = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "阴道") {
                    td.vagina = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "宫颈") {
                    td.cervix = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "宫体" || i.orderGroupItemProjectName.trim() == "子宫体") {
                    td.uterineBody = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "附件") {
                    td.enclosure = i.result + unit;
                }
            }
        }
    })
    return td;
}

/**
 *
 * 一般检查
 *
 * */
function generalInspection(data, td) {
    let shrink = '';
    let diastole = '';
    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "营养") {
                    td.nutrition = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "身高") {
                    td.height = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "体重") {
                    td.weight = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "心率" || i.orderGroupItemProjectName.trim() == "心") {
                    td.heartRate = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "舒张压") {
                    diastole = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "收缩压") {
                    shrink = i.result + unit;
                }
            }
            if (shrink && diastole) {
                td.bloodPressure = shrink + "/" + diastole;
            }
        }
    })
    return td;
}

/**
 *
 * 耳鼻喉口腔常规
 *
 * */
function otolaryngologyInspection(data, td) {
    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "外耳道") {
                    td.externalEar = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "中耳") {
                    td.middleEar = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "听力(左)") {
                    td.leftHearing = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "听力(右)") {
                    td.rightHearing = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "鼻部") {
                    td.nose = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "口腔黏膜") {
                    td.mucosa = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "牙齿") {
                    td.tooth = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "咽部") {
                    td.throat = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "五官科其他") {
                    td.facialOthers = i.result + unit;
                }
            }
        }
    })

    return td;
}

/**
 *
 * 内科常规
 *
 * */
function internalMedicine(data, td) {

    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "肾") {
                    td.kidney = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "肺部") {
                    td.lungs = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "脾") {
                    td.spleen = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "肝") {
                    td.liver = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "心率") {
                    td.heartRate = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "心音") {
                    td.heartMoss = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "心律") {
                    td.rhythm = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "内科其他") {
                    td.otherInternal = i.result + unit;
                }
            }
        }
    })
    return td;
}

/**
 *
 * 外科常规
 *
 * */
function surgicalRoutine(data, td) {
    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "甲状腺(外科)") {
                    td.thyroid = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "浅表淋巴结") {
                    td.lymphNode = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "四肢关节") {
                    td.limbJoints = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "外科其他") {
                    td.surgicalOthers = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "脊柱") {
                    td.spine = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "皮肤颜色") {
                    td.skinColor = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "皮疹") {
                    td.rash = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "瘀斑、瘀点") {
                    td.petechiae = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "赘生物") {
                    td.vegetations = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "水疱或大疱") {
                    td.blister = i.result + unit;
                }
            }
        }
    })
    return td;
}

/**
 *
 * 神经系统
 *
 * */
function nervousSystem(data, td) {
    data.forEach(i => {
        if (i) {
            //单个基础项
            let unit = '';
            let unitName = i.unitName;
            if (unitName && unitName.length > 0) {
                if (unitName.trim() != '-' && unitName.trim() != '无') {
                    unit = unitName;
                }
            }
            if (i.orderGroupItemProjectName) {
                if (i.orderGroupItemProjectName.trim() == "痛觉、触觉") {
                    td.senseOfPain = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "位置觉") {
                    td.positionPerception = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "腹壁反射") {
                    td.abdominalWallReflex = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "膝反射") {
                    td.kneeReflex = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "跟腱反射") {
                    td.achillestendonreflex = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "肌力") {
                    td.muscleStrength = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "肌张力") {
                    td.muscleTension = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "共济运动") {
                    td.masonicMovement = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "三颤") {
                    td.tripleTremor = i.result + unit;
                }
                if (i.orderGroupItemProjectName.trim() == "病理反射") {
                    td.pathologicalReflex = i.result + unit;
                }
            }
        }
    })
    return td;
}

/**
 *
 * 数组去重
 *
 * */
function removeRepeat(arr) {
    return Array.from(new Set(arr));
}

/**
 *
 * 基础项结果去重
 */
function removeRepeatItem(arr) {
    let newData = [];
    let int = 1;
    for (let i = 0; i < arr.length; i++) {
        if (newData && newData.length > 0) {
            let nowData = newData.filter(item => item.monitorName == arr[i].monitorName);
            if (!(nowData && nowData.length > 0)) {
                newData.push({
                    num: int,
                    monitorName: arr[i].monitorName,
                    value: arr[i].value,
                    referenceRange: arr[i].referenceRange,
                    unit: arr[i].unit,
                    arrow: arr[i].arrow,
                    resultTips: arr[i].resultTips
                })
                int++;
            }
        } else {
            newData.push({
                num: int,
                monitorName: arr[i].monitorName,
                value: arr[i].value,
                referenceRange: arr[i].referenceRange,
                unit: arr[i].unit,
                arrow: arr[i].arrow,
                resultTips: arr[i].resultTips
            })
            int++;
        }
    }
    return newData;
}

/**
 *
 * 分项汇总排版整理
 */
function arrangeItem(arr) {
    let dataNew = [];
    for (let i = 0; i < arr.length; i = i + 2) {
        if (arr[i]) {
            if (arr[i + 1]) {
                dataNew.push({
                    monitorName: arr[i].monitorName,
                    value: arr[i].value,
                    referenceRange: arr[i].referenceRange,
                    unit: arr[i].unit,
                    arrow: arr[i].arrow,
                    resultTips: arr[i].resultTips,
                    monitorName2: arr[i + 1].monitorName,
                    value2: arr[i + 1].value,
                    referenceRange2: arr[i + 1].referenceRange,
                    unit2: arr[i + 1].unit,
                    arrow2: arr[i + 1].arrow,
                    resultTips2: arr[i + 1].resultTips
                })
            } else {
                dataNew.push({
                    monitorName: arr[i].monitorName,
                    value: arr[i].value,
                    referenceRange: arr[i].referenceRange,
                    unit: arr[i].unit,
                    arrow: arr[i].arrow,
                    resultTips: arr[i].resultTips,
                    monitorName2: "",
                    value2: "",
                    referenceRange2: "",
                    unit2: "",
                    arrow2: "",
                    resultTips2: ""
                })
            }
        }
    }
    return dataNew;
}

export default templateJs;
