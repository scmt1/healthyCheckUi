import {formartDate} from "@/api/tools/tool";
import de from "element-ui/src/locale/lang/de";
let templateJs = {};
let _thisJs  = null;

/*模板数据初始化*/
templateJs.dataInit = function (_this, tTemplateId,baseProjectId,tTemplateType,physicalType,personInfo,groupItemData,name,groupItemId,opinion,inspectResult,checkSign,departItemResults,healthCheckup,isShow){
     let templateDataJs = {};
     if(!physicalType && personInfo){
         physicalType = personInfo.physical_type;
     }
    _thisJs = _this;
    //报告判断
    if (tTemplateType && tTemplateType.trim().length > 0) {
        switch (tTemplateType) {

            case "分项报告": {
                templateDataJs = itemDataInit(personInfo,groupItemData,name,groupItemId,opinion,inspectResult,checkSign,departItemResults,isShow);
                break;
            }
            case "总检": {
                templateDataJs = inspectionDataInit(personInfo,checkSign,physicalType);
                break;
            }
            case "检查结果及处理意见": {
                templateDataJs =  inspectionDataInit(personInfo,checkSign,physicalType);
                break;
            }
            case "个人复查报告-基本信息": {
                templateDataJs =  inspectionDataInitFCJBXX(personInfo,checkSign,physicalType);
                break;
            }
            case "个人复查报告-结论": {
                templateDataJs =  inspectionDataInitFCJL(personInfo,checkSign,physicalType);
                break;
            }
            case "健康-检查结果及处理意见": {
                templateDataJs =  inspectionDataInitJL(personInfo,checkSign,physicalType);
                break;
            }
            case "职业-检查结果及处理意见": {
                templateDataJs =  inspectionDataInitJL(personInfo,checkSign,physicalType);
                break;
            }
            case "告知书": {
                templateDataJs =  gzsDataInit(personInfo,checkSign,physicalType);
                break;
            }
            case "封面": {
                templateDataJs =  fmDataInit(personInfo,checkSign,physicalType);
                break;
            }
            case "问诊科检查表": {
                templateDataJs = inquiryDataInit(personInfo,checkSign,physicalType);
                break;
            }
            case "眼科检查": {
                templateDataJs = eyeDataInit(checkSign,departItemResults,healthCheckup,groupItemData,name);
                break;
            }
            case "妇科检查": {
                templateDataJs = fkDataInit(checkSign,departItemResults,healthCheckup);
                break;
            }
            case "体格检查": {
                templateDataJs = healthCheckupDataInit(checkSign,departItemResults,healthCheckup);
                break;
            }
            case "分项汇总": {
                templateDataJs = tgfxDataInit(personInfo,checkSign,departItemResults,healthCheckup,physicalType);
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
                        templateData.sex = "-";//性别
                        templateData.age = "-";//年龄
                        templateData.workTypeText = "";//工种名称
                        templateData.unitName = "";//单位名称
                        templateData.unitPhone = "";//单位电话
                        templateData.workStateText = "-";//在岗状态
                        templateData.factors = "-";//职业危害因素
                        templateData.physicalType = "-";//体检类型
                        templateData.createTime = "-";
                        if(personInfo.work_type_text) {
                            templateData.workTypeText = personInfo.work_type_text;//工种名称
                            if(templateData.workTypeText == "其他"){
                                templateData.workTypeText = personInfo.work_name;//工种其他名称
                            }
                        }
                        if(personInfo.department) {
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
                            templateData.workStateText = personInfo.work_state_text;//在岗状态
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
    let previewData

    previewData = {
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
function itemDataInit  (personInfo,groupItemData,name,groupItemId,opinion,inspectResult,checkSign,departItemResults,isShow) {
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
        if(templateData.testNum && templateData.testNum.trim().length > 0){
            let split = templateData.testNum.split("");
            if(split && split.length >= 4){
                let length = split.length;
                templateData.codeText = split[length - 4] + split[length - 3] + split[length - 2] + split[length - 1];
            }
        }
        templateData.mobile = personInfo.mobile;
        templateData.reportNum = personInfo.test_num;
        templateData.unitName = personInfo.unit_name;//单位名称
        templateData.sex = personInfo.sex;//性别
        templateData.age = personInfo.age;//年龄
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
                    if(personInfo && personInfo.dept && personInfo.dept.indexOf("宏旭") > -1){
                        for (let i = 0; i < urlSplit.length; i++) {
                            templateData.imgList.push({img: urlSplit[i]});
                        }
                    }else{
                        for (let i = 0; i < 4; i++) {
                            if(urlSplit[i]){
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
    if(name.indexOf("心电图") > -1){
        let int = 1;
        let opinionArray = opinion.split(";");
        let opinions = "";
        opinionArray.forEach(function (e) {
            opinions += "" + int + "." + e + ";";
            int ++;
        });
        templateData.opinion = opinions;//临床诊断(心电图 加序号)
    }else{
        templateData.opinion = opinion;//临床诊断
    }
    templateData.inspectResult = inspectResult;//影像所见(诊断提醒)
    templateData.autograph = checkSign;//医生签名

    //查询分检项目检查结果
    let departItemResultArr = [];
    if(groupItemId && groupItemId.length > 0){
        departItemResultArr = departItemResults.filter(ii => groupItemId.indexOf(ii.orderGroupItemId) > -1);
    }else{
        departItemResultArr = departItemResults.filter(ii => ii.orderGroupItemId == groupItemId);
    }
    let departItemResultArrNew = [];
    for(let i = 0;i < departItemResultArr.length;i ++){
        if(departItemResultArrNew.length == 0){
            departItemResultArrNew.push(departItemResultArr[i]);
        }else{
            let flag = true;
            for(let j = 0;j < departItemResultArrNew.length;j ++){
                if(departItemResultArr[i] && departItemResultArrNew[j] && departItemResultArr[i].orderGroupItemProjectId && departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName && departItemResultArrNew[j].orderGroupItemProjectName && departItemResultArr[i].orderGroupItemProjectId == departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName == departItemResultArrNew[j].orderGroupItemProjectName){
                    flag = false;
                }
            }
            if(flag){
                departItemResultArrNew.push(departItemResultArr[i]);
            }
        }
    }
    departItemResultArr = departItemResultArrNew;

    if (departItemResultArr && departItemResultArr.length > 0) {
        let tableMonitoring = [];
        let index = 0;

        let resultInfo = departItemResultArr[0];
        templateData.sectionOffice = resultInfo.officeName;
        templateData.officeName = resultInfo.officeName;//科室名
        let officeName = resultInfo.officeName;
        templateData.inspectDoctor = resultInfo.checkDoc;//检验医生
        // templateData.doctor = resultInfo.checkDoc;//申请医生
        templateData.doctor = "王彬";//申请医生
        templateData.reportDoctor = resultInfo.checkDoc;//报告医生
        templateData.printDate = formartDate(oldTime, "yyyy-MM-dd");//打印日期

        if(name && name.indexOf("复") > -1){
            templateData.reviewName = "（复）";
            let reviewData = personInfo.reviewProjectsList.filter(item => item.name == name && item.id == groupItemId && item.isPass == 2);
            templateData.inspectTime = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd HH:mm:ss") : formartDate(new Date(), "yyyy-MM-dd HH:mm:ss");//检查时间
            templateData.inspectDate = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd") : formartDate(new Date(), "yyyy-MM-dd");//检查日期
            templateData.createTime = templateData.inspectTime;
            templateData.createDate = templateData.inspectDate;//送检日期
        }else{
            templateData.reviewName = "";
            templateData.inspectTime = personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
            templateData.inspectDate = personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
            templateData.createTime = templateData.inspectTime;
            templateData.createDate = templateData.inspectDate;//送检日期
        }

        if (officeName.indexOf("肺功能") > -1) {
            fgnDataInit(templateData, departItemResultArr);
        } else if (officeName.indexOf("电测听") > -1) {
            templateData = pureTone(departItemResultArr, templateData);
            let cyDatasTZ = [];
            let cyDatasTZGD = [];
            if(personInfo.hazard_factors_text){
                let hazardFactorsText = personInfo.hazard_factors_text;
                let hazardFactorsTextArray = [];
                if(hazardFactorsText.indexOf("|") > -1){
                    hazardFactorsTextArray = hazardFactorsText.split("|");
                    let int = 0;
                    if(hazardFactorsTextArray.indexOf("职业机动车驾驶作业") > -1){
                        int ++;
                    }
                    if(hazardFactorsTextArray.indexOf("压力容器作业") > -1){
                        int ++;
                    }
                    if(int < hazardFactorsTextArray.length){
                        if(templateData.gGFA && templateData.gGFA != 0){
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                            cyDatasTZGD.push({
                                gGFA: templateData.gGFA,
                            });
                            if(templateData.cyShowGD[0] && templateData.cyShowGD[0].cyDatasTZGD){
                                templateData.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                            }
                        }else{
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                        }
                    }else{//不显示高频
                        if(templateData.leftImgChart["gy"] && templateData.leftImgChart["gy"].length > 0 && templateData.rightImgChart["gy"] && templateData.rightImgChart["gy"].length > 0){
                            templateData.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1],templateData.leftImgChart["y"][2],null,null,null],"gy":[templateData.leftImgChart["gy"][0], templateData.leftImgChart["gy"][1],templateData.leftImgChart["gy"][2],null,null,null]};
                            templateData.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1],templateData.rightImgChart["y"][2],null,null,null],"gy":[templateData.rightImgChart["gy"][0], templateData.rightImgChart["gy"][1],templateData.rightImgChart["gy"][2],null,null,null]};
                        }else{
                            templateData.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1],templateData.leftImgChart["y"][2],null,null,null]};
                            templateData.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1],templateData.rightImgChart["y"][2],null,null,null]};
                        }
                    }
                }else{
                    if(!(personInfo.hazard_factors_text.indexOf("机动车") > -1 || personInfo.hazard_factors_text.indexOf("压力容器") > -1)){
                        if(templateData.gGFA && templateData.gGFA != 0){
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                            cyDatasTZGD.push({
                                gGFA: templateData.gGFA,
                            });
                            if(templateData.cyShowGD[0] && templateData.cyShowGD[0].cyDatasTZGD){
                                templateData.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                            }
                        }else{
                            cyDatasTZ.push({
                                GFA: templateData.GFA,
                            });
                        }
                    }else{//不显示高频
                        if(templateData.leftImgChart["gy"] && templateData.leftImgChart["gy"].length > 0 && templateData.rightImgChart["gy"] && templateData.rightImgChart["gy"].length > 0){
                            templateData.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1],templateData.leftImgChart["y"][2],null,null,null],"gy":[templateData.leftImgChart["gy"][0], templateData.leftImgChart["gy"][1],templateData.leftImgChart["gy"][2],null,null,null]};
                            templateData.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1],templateData.rightImgChart["y"][2],null,null,null],"gy":[templateData.rightImgChart["gy"][0], templateData.rightImgChart["gy"][1],templateData.rightImgChart["gy"][2],null,null,null]};
                        }else{
                            templateData.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.leftImgChart["y"][0], templateData.leftImgChart["y"][1],templateData.leftImgChart["y"][2],null,null,null]};
                            templateData.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[templateData.rightImgChart["y"][0], templateData.rightImgChart["y"][1],templateData.rightImgChart["y"][2],null,null,null]};
                        }
                    }
                }
                //加权值显示
                let cyDatasTZjqz = [];
                if(hazardFactorsText && hazardFactorsText.indexOf("噪声") > -1){
                    if(name && name.indexOf("复") > -1){
                        cyDatasTZjqz.push({
                            WVr: templateData.WVr,
                            WVl: templateData.WVl,
                        })
                    }
                }
                templateData.cyDatasTZjqz = cyDatasTZjqz;
            }
            templateData.cyDatasTZ = cyDatasTZ;
        } else if (officeName.indexOf("心电图") > -1) {
            templateData = ecgImageData(departItemResultArr, templateData);
        }else if (officeName.indexOf("口腔科") > -1) {
            templateData = kqcgImageData(departItemResultArr, templateData);
        }else {
            if (name.indexOf("幽门螺旋杆菌") > -1) {
                if (departItemResultArr && departItemResultArr.length > 0) {
                    templateData.scope = departItemResultArr[0].scope;
                    if(templateData.scope && templateData.scope.indexOf("≤") > -1){
                        templateData.scope = templateData.scope.replace("≤","");
                    }
                    templateData.result = departItemResultArr[0].result;
                    if(templateData.result){
                        if(templateData.result > 50){
                            templateData.resultText = "阳性";
                        }else if(templateData.result <= 50){
                            templateData.resultText = "阴性";
                        }
                    }
                    templateData.histogramImage = {"x":["参考值","检测结果"],"y":[templateData.scope,templateData.result]};
                }
            }
            if(officeName.indexOf("检验科") > -1 && name.indexOf("尿常规") > -1){
                if (departItemResultArr && departItemResultArr.length > 0) {
                    for(let n = 0;n < 11;n ++){
                        if(n < 9){
                            let monitorName2 = "";
                            let value2 = "";
                            let reference2 = "";
                            let unit2 = "";
                            let arrow2 = "";
                            let resultTips2 = "";
                            if(departItemResultArr[n+11]){
                                if(departItemResultArr[n+11].orderGroupItemProjectName){
                                    monitorName2 = departItemResultArr[n+11].orderGroupItemProjectName;
                                }
                                if(departItemResultArr[n+11].result){
                                    value2 = departItemResultArr[n+11].result;
                                }
                                if(departItemResultArr[n+11].scope){
                                    reference2 = departItemResultArr[n+11].scope;
                                }
                                if(departItemResultArr[n+11].unitName){
                                    unit2 = departItemResultArr[n+11].unitName.indexOf("无")>-1 ? "" : departItemResultArr[n+11].unitName;
                                }
                                if(departItemResultArr[n+11].arrow){
                                    arrow2 = departItemResultArr[n+11].arrow;
                                }
                                if(departItemResultArr[n+11].crisisDegree){
                                    resultTips2 = departItemResultArr[n+11].crisisDegree;
                                }
                            }
                            tableMonitoring.push({
                                monitorName: departItemResultArr[n].orderGroupItemProjectName,
                                value: departItemResultArr[n].result,
                                reference: departItemResultArr[n].scope,
                                unit: departItemResultArr[n].unitName ? departItemResultArr[n].unitName.indexOf("无")>-1 ? "" : departItemResultArr[n].unitName : "",
                                arrow: departItemResultArr[n].arrow,
                                resultTips: departItemResultArr[n].crisisDegree,
                                monitorName2: monitorName2,
                                value2: value2,
                                reference2: reference2,
                                unit2: unit2,
                                arrow2: arrow2,
                                resultTips2: resultTips2,
                            });
                        }else{
                            tableMonitoring.push({
                                monitorName: departItemResultArr[n].orderGroupItemProjectName,
                                value: departItemResultArr[n].result,
                                reference: departItemResultArr[n].scope,
                                unit: departItemResultArr[n].unitName ? departItemResultArr[n].unitName.indexOf("无")>-1 ? "" : departItemResultArr[n].unitName : "",
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
            }else if(officeName.indexOf("检验科") > -1 && name.indexOf("乙肝两对半") > -1){
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
                        int ++;
                    })
                }
            }else{
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
                        int ++;
                    })
                }
            }/*else if(officeName.indexOf("检验科") > -1 && name.indexOf("血常规") > -1){
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
                        int ++;
                    })
                }
            }else{
                //departItemResultArr = departItemResults.filter(ii => groupItemId.indexOf(ii.orderGroupItemId) > -1);
                if(groupItemId && groupItemId.length > 0){
                    tableMonitoring = [];
                    for(let i = 0;i < groupItemId.length;i ++){
                        let departItemResultArrNow = departItemResults.filter(ii => ii.orderGroupItemId == groupItemId[i]);
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
                            int ++;
                        })
                        tableMonitoring.push({
                            tableMon: tableMon,
                            inspectDoctor: templateData.inspectDoctor,
                            createTime: templateData.createTime,
                            inspectTime: templateData.inspectTime,
                            autograph: templateData.autograph,
                        });
                    }

                }else{
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
                            int ++;
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
            }*/
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
function eyeDataInit  (checkSign,departItemResults,healthCheckup,groupItemData,name) {
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
function fkDataInit (checkSign,departItemResults,healthCheckup) {
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

/**
 * 体格检查
 *
 */
function healthCheckupDataInit (checkSign,departItemResults,healthCheckup) {
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
function tgfxDataInit (personInfo,checkSign,departItemResults,healthCheckup,physicalType) {

    let templateData = {};
    let oldTime = (new Date()).getTime();
    let time1 = formartDate(oldTime, "yyyy-MM-dd");
    let sealImg = '';
    templateData.sealImg = sealImg;//检查单位盖章
    templateData.autograph = checkSign;//医生签名

    if (healthCheckup && healthCheckup.length > 0) {
        let dataEK = [];
        healthCheckup.forEach(ii => {
            let opinion = "";
            if(ii.opinion && ii.opinion != null){
                opinion = ii.opinion.replaceAll('\n','').replaceAll(' ','');//小结
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
            for(let i = 0;i < departItemResultArr.length;i ++){
                if(departItemResultArrNew.length == 0){
                    departItemResultArrNew.push(departItemResultArr[i]);
                }else{
                    let flag = true;
                    for(let j = 0;j < departItemResultArrNew.length;j ++){
                        /*if(groupItemId && groupItemId.length > 0){
                            if(departItemResultArr[i].orderGroupItemProjectName == departItemResultArrNew[j].orderGroupItemProjectName){
                                flag = false;
                            }
                        }else{
                            if(departItemResultArr[i].orderGroupItemProjectId == departItemResultArrNew[j].orderGroupItemProjectId){
                                flag = false;
                            }
                        }*/
                        if(departItemResultArr[i] && departItemResultArrNew[j] && departItemResultArr[i].orderGroupItemProjectId && departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName && departItemResultArrNew[j].orderGroupItemProjectName && departItemResultArr[i].orderGroupItemProjectId == departItemResultArrNew[j].orderGroupItemProjectId && departItemResultArr[i].orderGroupItemProjectName == departItemResultArrNew[j].orderGroupItemProjectName){
                            flag = false;
                        }
                    }
                    if(flag){
                        departItemResultArrNew.push(departItemResultArr[i]);
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
                if(ii.name && ii.name.indexOf("复") > -1){
                    let reviewData = personInfo.reviewProjectsList.filter(item => item.name == ii.name && item.id == ii.groupItemId && item.isPass == 2);
                    templateData.inspectTime = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd HH:mm:ss") : formartDate(new Date(), "yyyy-MM-dd HH:mm:ss");//检查时间
                    templateData.inspectDate = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd") : formartDate(new Date(), "yyyy-MM-dd");//检查日期
                    templateData.createTime = templateData.inspectTime;
                    templateData.createDate = templateData.inspectDate;//送检日期
                }else{
                    templateData.inspectTime = personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
                    templateData.inspectDate = personInfo.regist_date ? formartDate(personInfo.regist_date, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
                    templateData.createTime = templateData.inspectTime;
                    templateData.createDate = templateData.inspectDate;//送检日期
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
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
                                unit = i.unitName;
                            }
                            //获取 收缩压/舒张压
                            if (i.orderGroupItemProjectName.trim().indexOf("收缩压") > -1) {
                                if(i.result){
                                    ssyValue = i.result;
                                }else{
                                    ssyValue = 0;
                                }
                                if(szyValue && szyValue != ""){
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
                                if(i.result){
                                    szyValue = i.result;
                                }else{
                                    szyValue = 0;
                                }
                                if(ssyValue && ssyValue != ""){
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
                            if(!(monitorNameArray.indexOf(i.orderGroupItemProjectName) > -1)){
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
                        ybjcAutograph: ii.checkSign,
                        ybjcDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.ybjcDatasTZ && templateData.ybjcDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）"
                        templateData.ybjcDatasTZ.push(item);
                    }else{
                        let ybjcDatasTZ = [];
                        ybjcDatasTZ.push(item);
                        templateData.ybjcDatasTZ = ybjcDatasTZ;
                    }
                }else if (officeName.indexOf("妇科") > -1 && groupItemsName.indexOf("宫颈癌筛查") <= -1) {
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
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
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
                        int ++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "妇科";
                    let item = {dataLeft: dataLeft,
                        dataRight: dataRight,
                        fkOpinion: opinion,
                        fkAutograph: ii.checkSign,
                        fkDate: templateData.inspectDate,
                        name : name,}
                    if(templateData.fkDatasTZ && templateData.fkDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.fkDatasTZ.push(item);
                    }else{
                        let fkDatasTZ = [];
                        fkDatasTZ.push(item);
                        templateData.fkDatasTZ = fkDatasTZ;
                    }
                }else if (officeName.indexOf("妇科") > -1 && groupItemsName.indexOf("宫颈癌筛查") > -1) {
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
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
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
                        int ++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "宫颈筛查";
                    let item = {dataLeft: dataLeft,
                        dataRight: dataRight,
                        fkgjOpinion: opinion,
                        fkgjAutograph: ii.checkSign,
                        fkgjDate: templateData.inspectDate,
                        name : name,}
                    if(templateData.fkgjDatasTZ && templateData.fkgjDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.fkgjDatasTZ.push(item);
                    }else{
                        let fkgjDatasTZ = [];
                        fkgjDatasTZ.push(item);
                        templateData.fkgjDatasTZ = fkgjDatasTZ;
                    }
                } else if (officeName.indexOf("五官科") > -1 && groupItemsName.indexOf("眼") <= -1) {
                    // templateData = otolaryngologyInspection(data, templateData);
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
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
                                unit = i.unitName;
                            }
                            //单个基础项
                            if(groupItemsName.indexOf("复") > -1){
                                nowData.push({
                                    monitorName: i.orderGroupItemProjectName,
                                    value: i.result,
                                    referenceRange: i.scope,
                                    unit: unit,
                                    arrow: i.arrow,
                                    resultTips: i.crisisDegree
                                });
                            }else{
                                dataEK.push({
                                    monitorName: i.orderGroupItemProjectName,
                                    value: i.result,
                                    referenceRange: i.scope,
                                    unit: unit,
                                    arrow: i.arrow,
                                    resultTips: i.crisisDegree
                                });
                            }
                        };
                    });
                    let name = "耳鼻喉口腔常规";
                    let nowDataEK = [];
                    if(groupItemsName.indexOf("复") > -1){
                        nowDataEK = nowData;
                    }else{
                        nowDataEK = removeRepeatItem(dataEK);
                    }
                    dataLeft = arrangeItem(nowDataEK);//基础项排版整理;
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        ekOpinion: opinion,
                        ekAutograph: ii.checkSign,
                        ekDate: templateData.inspectDate,
                        name : name,
                    };
                    if(groupItemsName.indexOf("复") > -1){//复查
                        item.name = name + "（复）";
                        templateData.ekDatasTZ.push(item);
                    }else{
                        let ekDatasTZ = [];
                        ekDatasTZ.push(item);
                        templateData.ekDatasTZ = ekDatasTZ;
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
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
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
                        int ++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理
                    let name = "内科";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        nkOpinion: opinion,
                        nkAutograph: ii.checkSign,
                        nkDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.nkDatasTZ && templateData.nkDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.nkDatasTZ.push(item);
                    }else{
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
                    data.forEach(i => {
                        if (i == null) {
                            i = {};
                            i.personId = personInfo.id;
                            i.orderGroupItemProjectName = i.name;
                            i.orderGroupItemProjectId = i.id;
                        } else {
                            let unit = "";
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
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
                        int ++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "外科";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        wkOpinion: opinion,
                        wkAutograph: ii.checkSign,
                        wkDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.wkDatasTZ && templateData.wkDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.wkDatasTZ.push(item);
                    }else{
                        let wkDatasTZ = [];
                        wkDatasTZ.push(item);
                        templateData.wkDatasTZ = wkDatasTZ;
                    }
                } else if (groupItemsName.indexOf("神经")>-1) {
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
                            if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
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
                        int ++;
                    });
                    dataLeft = arrangeItem(nowData);//基础项排版整理;
                    let name = "神经系统";
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        sjOpinion: opinion,
                        sjAutograph: ii.checkSign,
                        sjDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.sjDatasTZ && templateData.sjDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.sjDatasTZ.push(item);
                    }else {
                        let sjDatasTZ = [];
                        sjDatasTZ.push(item);
                        templateData.sjDatasTZ = sjDatasTZ;
                    }
                } else if (officeName.indexOf("心电图") > -1) {
                    // templateData = ecgImageData(data, templateData);
                    let int = 1;
                    let opinionArray = opinion.split(";");
                    let opinions = "";
                    opinionArray.forEach(function (e) {
                        opinions += "" + int + "."  + e + ";";
                        int ++;
                    });
                    let name = "常规心电图";
                    let item = {
                        xdtOpinion: opinions,
                        xdtInspect: opinion,
                        xdtAutograph: ii.checkSign,
                        xdtDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.xdtDatasTZ && templateData.xdtDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.xdtDatasTZ.push(item);
                    }else{
                        let xdtDatasTZ = [];
                        xdtDatasTZ.push(item);
                        templateData.xdtDatasTZ = xdtDatasTZ;
                    }
                }else if (officeName.indexOf("肺功能") > -1) {
                    fgnDataInit(templateData, data)
                    let dataLeft = templateData.vitalCapacityFX;
                    let name = "肺功能";
                    let item = {
                        dataLeft: dataLeft,
                        fgnOpinion: opinion,
                        fgnAutograph: ii.checkSign,
                        fgnDate: templateData.inspectDate,
                        name :name
                    }
                    if(templateData.fgnDatasTZ && templateData.fgnDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.fgnDatasTZ.push(item);
                    }else{
                        let fgnDatasTZ = [];
                        fgnDatasTZ.push(item)
                        templateData.fgnDatasTZ = fgnDatasTZ;
                    }
                }else if (officeName.indexOf("电测听") > -1) {
                    // templateData = pureTone(data, templateData);
                    let name = "电测听";
                    let item = {
                        dctOpinion: opinion,
                        dctAutograph: ii.checkSign,
                        dctDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.dctDatasTZ && templateData.dctDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.dctDatasTZ.push(item);
                    }else{
                        let dctDatasTZ = [];
                        dctDatasTZ.push(item);
                        templateData.dctDatasTZ = dctDatasTZ;
                    }
                }else if (officeName.indexOf("口腔科") > -1) {
                    // templateData = kqcgImageData(data, templateData);
                    let name = "口腔定位检查";
                    let item = {
                        kqOpinion: opinion,
                        kqAutograph: ii.checkSign,
                        kqDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.kqDatasTZ && templateData.kqDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.kqDatasTZ.push(item);
                    }else{
                        let kqDatasTZ = [];
                        kqDatasTZ.push(item);
                        templateData.kqDatasTZ = kqDatasTZ;
                    }
                }else if((officeName.indexOf("五官科") > -1 && groupItemsName.indexOf("眼") > -1) || officeName.indexOf("眼科") > -1){
                    let dataLeft = [];
                    let dataRight = [];
                    if(physicalType != "放射体检"){
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
                                if(i.unitName && i.unitName.trim() != "-" && i.unitName.trim() != "无"){
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
                            int ++;
                        });
                        dataLeft = arrangeItem(nowData);//基础项排版整理;
                    }else{
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
                    let item = {
                        dataLeft: dataLeft,
                        dataRight: dataRight,
                        ykOpinion: opinion,
                        ykAutograph: ii.checkSign,
                        ykDate: templateData.inspectDate,
                        name: name,
                    };
                    if(templateData.ykDatasTZ && templateData.ykDatasTZ.length > 0 && groupItemsName.indexOf("复") > -1){
                        item.name = name + "（复）";
                        templateData.ykDatasTZ.push(item);
                    }else{
                        let ykDatasTZ = [];
                        ykDatasTZ.push(item);
                        templateData.ykDatasTZ = ykDatasTZ;
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
function inspectionDataInit (personInfo,checkSign,physicalType) {
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
    templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
    templateData.factors = "-";//职业危害因素
    templateData.workYe = "-";//总工龄年
    templateData.expYear = "-";//接害工龄年
    templateData.expYe = "-";//接触开始时间
    templateData.birth = "-";//出生日期
    templateData.unitName = "-";//单位名称
    templateData.registDate = "-";//体检日期
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
        if (personInfo.regist_date) {
            templateData.registDate = formartDate(personInfo.regist_date, 'yyyy-MM-dd');//体检日期
        }
        if (personInfo.sex) {
            templateData.sex = personInfo.sex;//性别
            if(templateData.sex == "男"){
                templateData.nameSex = "先生";//称呼
            }else{
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
        if (personInfo.birthplace_name) {
            templateData.birthplaceName = personInfo.birthplace_name;//籍贯(出生地名称)
        }
        if (personInfo.birthplace_code) {
            templateData.zipNum = personInfo.birthplace_code;//邮编(出生地编码)
        }
        if (personInfo.work_state_text) {
            templateData.workStateText = personInfo.work_state_text.replaceAll(" ","");//监护种类(在岗状态)
        }
        if (personInfo.hazard_factors_text) {
            templateData.hazardFactorsText = personInfo.hazard_factors_text.replaceAll("|","、");//监护危害(危害因素名称)
        }
        if (personInfo.work_year) {
            templateData.workYe = personInfo.work_year + "年";//总工龄年
        }
        if (personInfo.work_month) {
            if(templateData.workYe.indexOf("年") > -1){
                templateData.workYe += personInfo.work_month + "月";//总工龄月
            }else {
                templateData.workYe = personInfo.work_month + "月";//总工龄月
            }
        }
        if (personInfo.mobile) {
            templateData.mobile = personInfo.mobile;//联系电话
        }
        if (personInfo.exposure_work_year) {
            templateData.expYear = personInfo.exposure_work_year + "年";//接害工龄
        }
        if (personInfo.exposure_work_month) {
            if(templateData.expYear && templateData.expYear!= "-"){
                templateData.expYear += personInfo.exposure_work_month + "月";//接害工龄
            }else{
                templateData.expYear = personInfo.exposure_work_month + "月";//接害工龄
            }
        }
        if (personInfo.birth) {
            templateData.birth = formartDate(personInfo.birth, 'yyyy-MM-dd');//出生日期
        }
        if(personInfo.exposure_start_date && personInfo.work_state_code != '1001'){
            templateData.expYe = formartDate(personInfo.exposure_start_date, 'yyyy-MM-dd');//接触开始时间
        }
        if(personInfo.work_type_text) {
            templateData.workTypeText = personInfo.work_type_text;//工种名称
            if(templateData.workTypeText == "其他"){
                templateData.workTypeText = personInfo.work_name;//工种其他名称
            }
        }
    }
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
            if(data.otherCheckAbnormalResults && data.otherCheckAbnormalResults != "无" && data.careerIllnessName && data.careerIllnessName != "无"){
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
                            reviewTime: formartDate(arr[i].checkDate,'yyyy-MM-dd'),//复查日期
                            xmmc: "项目名称：",
                            fcsm: "复查说明：",
                        });
                    }
                    templateData.ry = dateArray[0];
                    templateData.rm = dateArray[1];
                    templateData.rd = dateArray[2];
                    templateData.reviewAutograph = data.inspectionAutograph;
                }else{
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
                if(data && data.reviewResult && data.reviewResult.trim().length > 0){
                    reviewResult.push({
                        reviewResultTitle: "复查结论及处理意见：",
                        reviewResultData: data.reviewResult,
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
                    reviewResult: reviewResult,
                })
                templateData.jgyjDatasTZ = jgyjDatasTZ;
            }
        }
    }
    return templateData;
}
/**
 * 总检报告
 *
 */
function inspectionDataInitFCJBXX (personInfo,checkSign,physicalType) {
    let templateData = {};
    templateData.autograph = checkSign;//医生签名

    templateData.name = "-";//姓名
    templateData.testNum = "-";//体检编号
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
    if (personInfo) {
        if (personInfo.unit_name) {
            templateData.unitName = personInfo.unit_name;//单位名称
        }
        if (personInfo.person_name) {
            templateData.name = personInfo.person_name;//姓名
        }
        if (personInfo.test_num) {
            templateData.testNum = personInfo.test_num;//体检编号
        }
        if (personInfo.regist_date) {
            templateData.lastRegistDate = formartDate(personInfo.regist_date, 'yyyy-MM-dd');//体检日期(上次)
        }
        if (personInfo.sex) {
            templateData.sex = personInfo.sex;//性别
            if(templateData.sex == "男"){
                templateData.nameSex = "先生";//称呼
            }else{
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
            templateData.workStateText = personInfo.work_state_text.replaceAll(" ","");//监护种类(在岗状态)
        }
        if (personInfo.hazard_factors_text) {
            templateData.hazardFactorsText = personInfo.hazard_factors_text.replaceAll("|","、");//监护危害(危害因素名称)
        }
        if (personInfo.work_year) {
            templateData.workYe = personInfo.work_year + "年";//总工龄年
        }
        if (personInfo.work_month) {
            if(templateData.workYe.indexOf("年") > -1){
                templateData.workYe += personInfo.work_month + "月";//总工龄月
            }else {
                templateData.workYe = personInfo.work_month + "月";//总工龄月
            }
        }
        if (personInfo.mobile) {
            templateData.mobile = personInfo.mobile;//联系电话
        }
        if (personInfo.exposure_work_year) {
            templateData.expYear = personInfo.exposure_work_year + "年";//接害工龄
        }
        if (personInfo.exposure_work_month) {
            if(templateData.expYear && templateData.expYear!= "-"){
                templateData.expYear += personInfo.exposure_work_month + "月";//接害工龄
            }else{
                templateData.expYear = personInfo.exposure_work_month + "月";//接害工龄
            }
        }
        //当前最新一次体检日期(复查)
        templateData.nowRegistDate = formartDate(personInfo.nowRegistDate, 'yyyy-MM-dd');
    }
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
            templateData.reviewResult = data.reviewResult;
        }
    }
    return templateData;
}

/**
 * 总检报告（仅检查结果及处理意见）
 *
 */
function inspectionDataInitFCJL (personInfo,checkSign,physicalType) {
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
            templateData.reviewResult = data.reviewResult;
        }
    }
    return templateData;
}

/**
 * 总检报告（仅检查结果及处理意见）
 *
 */
function inspectionDataInitJL (personInfo,checkSign,physicalType) {
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
            if(data.otherCheckAbnormalResults && data.otherCheckAbnormalResults != "无" && data.careerIllnessName && data.careerIllnessName != "无"){
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
                            reviewTime: formartDate(arr[i].checkDate,'yyyy-MM-dd'),//复查日期
                            xmmc: "项目名称：",
                            fcsm: "复查说明：",
                        });
                    }
                    templateData.ry = dateArray[0];
                    templateData.rm = dateArray[1];
                    templateData.rd = dateArray[2];
                    templateData.reviewAutograph = data.inspectionAutograph;
                }else{
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
function gzsDataInit (personInfo,checkSign,physicalType) {
    let templateData = {};

    templateData.name = "-";//姓名
    templateData.testNum = "-";//体检编号
    templateData.physicalType = "-";//体检类型
    templateData.idCard = "-";//身份证号
    templateData.workStateText = "-";//监护种类(在岗状态)
    templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
    templateData.factors = "-";//职业危害因素
    templateData.unitName = "";//单位名称
    templateData.registDate = "-";//登记日期
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
    }
    if (personInfo) {
        //登记日期
        let dateArray = templateData.registDate.split('-');
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
function fmDataInit (personInfo,checkSign,physicalType) {
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
function inquiryDataInit (personInfo,checkSign,physicalType) {
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
    if (personInfo) {
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
        if (personInfo.work_year) {
            templateData.workYe = personInfo.work_year + "年";//总工龄年
        }
        if (personInfo.work_month) {
            if(templateData.workYe.indexOf("年") > -1){
                templateData.workYe += personInfo.work_month + "月";//总工龄月
            }else {
                templateData.workYe = personInfo.work_month + "月";//总工龄月
            }
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
            templateData.smokeState = personInfo.smoke_state;//吸烟状态
        }
        if (personInfo.package_every_day) {
            templateData.package = personInfo.package_every_day;//包每天
        }
        if (personInfo.smoke_year) {
            templateData.smokeYear = personInfo.smoke_year;//吸烟年
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
                    if (physicalType == "职业体检") {
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
                                    if (workTypeText == "其他") {
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
                                careerHis.push({
                                    startEndDate: startEndDate,//起止日期
                                    workUnit: workUnit,//工作单位
                                    workTypeText: workTypeText,//工种
                                    hazardFactorsText: hazardFactorsText,//有害因素
                                    protectiveMeasures: protectiveMeasures//防护措施
                                });
                            }
                        } else {
                            careerHis.push({
                                startEndDate: "无",
                                workUnit: "",
                                workTypeText: "",
                                hazardFactorsText: "",
                                protectiveMeasures: ""
                            });
                        }
                        templateData.careerHis = careerHis;
                    } else if (physicalType == "放射体检") {
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
                                    if (workTypeText == "其他") {
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
                                        irradiationTypes += irradiationType + careerHisData[i].irradiationTypeCode + ";";
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
                        if (physicalType == "职业体检") {
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
                            //尿频、尿急
                            templateData.degreeNP = "-";//程度
                            templateData.timeNP = "-";//病程时间
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
                            //腹胀、腹痛
                            templateData.degreeFZFT = "-";//程度
                            templateData.timeFZFT = "-";//病程时间
                            //恶心//恶心、呕吐
                            templateData.degreeEXOT = "-";//程度
                            templateData.timeEXOT = "-";//病程时间
                            //腹泻
                            templateData.degreeFX = "-";//程度
                            templateData.timeFX = "-";//病程时间
                            //便秘
                            templateData.degreeBM = "-";//程度
                            templateData.timeBM = "-";//病程时间
                            //便血
                            templateData.degreeBX = "-";//程度
                            templateData.timeBX = "-";//病程时间
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
                                        if (symptomData[i].projectName.trim() == "尿频、尿急") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeNP = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeNP = symptomData[i].courseTime;//病程时间
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
                                        if (symptomData[i].projectName.trim() == "腹胀、腹痛") {
                                            if (symptomData[i].degree) {
                                                templateData.degreeFZFT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeFZFT = symptomData[i].courseTime;//病程时间
                                            }
                                        }
                                        if (symptomData[i].projectName.trim() == "恶心") {//恶心、呕吐
                                            if (symptomData[i].degree) {
                                                templateData.degreeEXOT = symptomData[i].degree;//程度
                                            }
                                            if (symptomData[i].courseTime) {
                                                templateData.timeEXOT = symptomData[i].courseTime;//病程时间
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
                        } else if (physicalType == "放射体检") {
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
function  fgnDataInit(tableMonitoring, data) {
    let vitalCapacity1 = [];
    let vitalCapacity2 = [];
    let vitalCapacity3 = [];
    let vitalCapacityFX = [];
    let vitalCapacityShort1=_thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort1;
    let vitalCapacityShort2=_thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort2;
    let vitalCapacityShort3=_thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort3;
    let vitalCapacityShortFX = _thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShortFX;//分项汇总，肺功能检查项：一秒率(第一秒钟用力呼气容积占预计值百分比)、第一秒用力呼气率、用力肺活量占预计值百分比一秒率(第一秒钟用力呼气容积占预计值百分比)、第一秒用力呼气率、用力肺活量占预计值百分比

    vitalCapacityShortFX.forEach(i => {
        let items = data.filter(o => o.shortName == i);
        if (items && items.length > 0) {
            let referenceRange = "";
            if(items[0].updateId && items[0].updateId != null){
                referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : 0;
            }else {
                // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                referenceRange = 0;
            }
            vitalCapacityFX.push({
                monitorName: items[0].orderGroupItemProjectName,
                value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                referenceRange: referenceRange,
                resultTips:(items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : 0,
                unit: items[0].unitName?items[0].unitName.trim():"",
                scope: items[0].scope? items[0].scope.trim():"-"
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
            if(items[0].updateId && items[0].updateId != null){
                referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : 0;
            }else {
                // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                referenceRange = 0;
            }
            vitalCapacity1.push({
                monitorName: items[0].orderGroupItemProjectName,
                value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                referenceRange: referenceRange,
                // resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                resultTips:(items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : 0,
                unit: items[0].unitName?items[0].unitName.trim():"",
                scope: items[0].scope? items[0].scope.trim():"-"
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
            if(items[0].updateId && items[0].updateId != null){
                referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : "";
            }else {
                // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                referenceRange = "";
            }
            if(referenceRange == 0){
                referenceRange = "";
            }
            vitalCapacity2.push({
                monitorName: items[0].orderGroupItemProjectName,
                value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                referenceRange: referenceRange,
                // resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                resultTips:(items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : "",
                unit: items[0].unitName?items[0].unitName.trim():"",
                scope: items[0].scope? items[0].scope.trim():"-"
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
            if(items[0].updateId && items[0].updateId != null){
                referenceRange = items[0].updateId && items[0].updateId.toString().trim().length > 0 && items[0].updateId.toString().trim() != "-" ? items[0].updateId.toString().trim() : 0;
            }else {
                // referenceRange = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                referenceRange = 0;
            }
            vitalCapacity3.push({
                monitorName: items[0].orderGroupItemProjectName,
                value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
                referenceRange: referenceRange,
                // resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                resultTips:(items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : 0,
                unit: items[0].unitName?items[0].unitName.trim():"",
                scope: items[0].scope? items[0].scope.trim():"-"
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

    tableMonitoring.vitalCapacity1 = vitalCapacity1;
    tableMonitoring.vitalCapacity2 = vitalCapacity2;
    tableMonitoring.vitalCapacity3 = vitalCapacity3;

}

/**
 *
 * 纯音
 *
 * */
function  pureTone(data, td) {
    //气体·
    let r500, r1000, r2000, r3000, r4000, r6000;
    let l500, l1000, l2000, l3000, l4000, l6000;
    //骨导
    let gr500, gr1000, gr2000, gr3000, gr4000, gr6000;
    let gl500, gl1000, gl2000, gl3000, gl4000, gl6000;
    if (data && data.length > 0) {
        data.forEach(i => {
            //单个基础项
            //气体
            if (i.orderGroupItemProjectName) {
                let result = i.result;
                if(result == null){
                    result = 0;
                }
                if (i.orderGroupItemProjectName.indexOf("6000Hz(骨导)") > -1) {
                    if(result == 0){
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
    }
    //线条区分显示 没有就不显示
    if(gr500 == 0 && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0 && gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0){
        if(r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0 && l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
        }else if(r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
        }else if(l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":['', '','', '','', '']};
        }else{
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":['', '','', '','', '']};
        }
    }else if(r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0 && l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0){
        if(gr500 == 0 && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0 && gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
        }else if(gr500 == 0 && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
        }else if(gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0){
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
        }else{
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }
    }else{
        if(gr500 == 0 && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0 && r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0){
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
        }else if(gr500 == 0 && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0 && l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":['', '','', '','', '']};
        }else if(gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0 && r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }else if(gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0 && l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }else if(gr500 == 0 && gr1000 == 0 && gr2000 == 0 && gr3000 == 0 && gr4000 == 0 && gr6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":['', '','', '','', '']};
        }else if(gl500 == 0 && gl1000 == 0 && gl2000 == 0 && gl3000 == 0 && gl4000 == 0 && gl6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":['', '','', '','', '']};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }else if(r500 == 0 && r1000 == 0 && r2000 == 0 && r3000 == 0 && r4000 == 0 && r6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }else if(l500 == 0 && l1000 == 0 && l2000 == 0 && l3000 == 0 && l4000 == 0 && l6000 == 0){
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":['', '','', '','', ''],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }else{
            td.leftImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[l500, l1000,l2000, l3000,l4000, l6000],"gy":[gl500, gl1000,gl2000, gl3000,gl4000, gl6000]};
            td.rightImgChart= {"x":["500", "1000","2000","3000","4000","6000"],"y":[r500, r1000,r2000, r3000,r4000, r6000],"gy":[gr500, gr1000,gr2000, gr3000,gr4000, gr6000]};
        }
    }
    if(gr6000 == ''){
        gr6000 = 0;
    }
    if(gl6000 == ''){
        gl6000 = 0;
    }
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
    if(td.gHLl && td.gHLl != 0){
        cyShowGD.push({
            gHLl: td.gHLl,
            gHLr: td.gHLr,
            gGFA: td.gGFA,
            SEYPG: td.SEYPG,
            cyDatasTZGD: [],
        });
    }
    td.cyShowGD = cyShowGD;
    return td;
}

/**
 *
 * 心电图
 *
 * */
function  ecgImageData(data, td) {
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
    return td;
}

/**
 *
 * 口腔定位检查(牙齿十字线)
 *
 * */
function  kqcgImageData(data, td) {
    let rightTop = [];
    let leftTop = [];
    let rightBottom = [];
    let leftBottom = [];
    data.forEach(i => {
        if (i) {
            let arrow = i.arrow.trim();
            let value = i.result.trim();
            let monitorName = i.orderGroupItemProjectName.trim();
            // if(arrow && arrow != '-'){
            if(value && value != '正常'){
                if(monitorName.indexOf("中切牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(1);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(1);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(1);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(1);
                    }
                }else if(monitorName.indexOf("侧切牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(2);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(2);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(2);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(2);
                    }
                }else if(monitorName.indexOf("尖牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(3);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(3);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(3);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(3);
                    }
                }else if(monitorName.indexOf("第一前磨牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(4);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(4);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(4);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(4);
                    }
                }else if(monitorName.indexOf("第二前磨牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(5);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(5);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(5);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(5);
                    }
                }else if(monitorName.indexOf("第一磨牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(6);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(6);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(6);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(6);
                    }
                }else if(monitorName.indexOf("第二磨牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(7);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(7);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(7);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(7);
                    }
                }else if(monitorName.indexOf("第三磨牙") > -1){
                    if(monitorName.indexOf("右上") > -1){
                        rightTop.push(8);
                    }else if(monitorName.indexOf("左上") > -1){
                        leftTop.push(8);
                    }else if(monitorName.indexOf("右下") > -1){
                        rightBottom.push(8);
                    }else if(monitorName.indexOf("左下") > -1){
                        leftBottom.push(8);
                    }
                }
            }
        }
    });

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
function  numbersAsc(numbers) {
    for(let i=0;i<numbers.length-1;i++){
        for(let j=0;j<numbers.length-1-i;j++){
            if(numbers[j]>numbers[j+1]){
                let temp = numbers[j];
                numbers[j] = numbers[j+1];
                numbers[j+1] = temp;
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
function  numbersDesc(numbers) {
    for(let i=0;i<numbers.length-1;i++){
        for(let j=0;j<numbers.length-1-i;j++){
            if(numbers[j]<numbers[j+1]){
                let temp = numbers[j];
                numbers[j] = numbers[j+1];
                numbers[j+1] = temp;
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
function  ophthalmicRoutine(data, td) {
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
            if(i.result) {
                result = i.result;
            }else{
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
                    if(result == 0){
                        td.nakedEyeRight = "-";
                    }else{
                        td.nakedEyeRight = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "裸眼视力(左)") {
                    if(result == 0){
                        td.nakedEyeLeft = "-";
                    }else{
                        td.nakedEyeLeft = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正视力(右)") {
                    if(result == 0){
                        td.correctRight = "-";
                    }else{
                        td.correctRight = result + unit;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "矫正视力(左)") {
                    if(result == 0){
                        td.correctLeft = "-";
                    }else{
                        td.correctLeft = result + unit;
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
                if (i.orderGroupItemProjectName.trim() == "晶体(左)") {
                    td.crystalLeft = result + unit;
                    if(result.indexOf("透明") > -1){
                        td.jthctNumL = 1;
                    }else if(result.indexOf("轻度") > -1){
                        td.jthctNumL = 2;
                    }else if(result.indexOf("中度") > -1){
                        td.jthctNumL = 3;
                    }else if(result.indexOf("重度") > -1){
                        td.jthctNumL = 4;
                    }
                }
                if (i.orderGroupItemProjectName.trim() == "晶体(右)") {
                    td.crystalRight = result + unit;
                    if(result.indexOf("透明") > -1){
                        td.jthctNumR = 1;
                    }else if(result.indexOf("轻度") > -1){
                        td.jthctNumR = 2;
                    }else if(result.indexOf("中度") > -1){
                        td.jthctNumR = 3;
                    }else if(result.indexOf("重度") > -1){
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
function  gynaecology(data, td) {
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
                if (i.orderGroupItemProjectName.trim() == "宫体") {
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
function  generalInspection(data, td) {
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
function  otolaryngologyInspection(data, td) {
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
function  internalMedicine(data, td) {

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
function  surgicalRoutine(data, td) {
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
function  nervousSystem(data, td) {
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
function  removeRepeat(arr) {
    return Array.from(new Set(arr));
}

/**
 *
 * 基础项结果去重
 */
function  removeRepeatItem(arr) {
    let newData = [];
    for(let i = 0;i < arr.length;i ++){
        if(newData && newData.length > 0){
            let nowData = newData.filter(item => item.monitorName == arr[i].monitorName);
            if(!(nowData && nowData.length > 0)){
                newData.push({
                    monitorName: arr[i].monitorName,
                    value: arr[i].value,
                    referenceRange: arr[i].referenceRange,
                    unit: arr[i].unit,
                    arrow: arr[i].arrow,
                    resultTips: arr[i].resultTips
                })
            }
        }else{
            newData.push({
                monitorName: arr[i].monitorName,
                value: arr[i].value,
                referenceRange: arr[i].referenceRange,
                unit: arr[i].unit,
                arrow: arr[i].arrow,
                resultTips: arr[i].resultTips
            })
        }
    }
    return newData;
}

/**
 *
 * 分项汇总排版整理
 */
function  arrangeItem(arr) {
    let dataNew = [];
    for(let i = 0;i < arr.length;i =i+2){
        if(arr[i]){
            if(arr[i+1]){
                dataNew.push({
                    monitorName: arr[i].monitorName,
                    value: arr[i].value,
                    referenceRange: arr[i].referenceRange,
                    unit: arr[i].unit,
                    arrow: arr[i].arrow,
                    resultTips: arr[i].resultTips,
                    monitorName2: arr[i+1].monitorName,
                    value2: arr[i+1].value,
                    referenceRange2: arr[i+1].referenceRange,
                    unit2: arr[i+1].unit,
                    arrow2: arr[i+1].arrow,
                    resultTips2: arr[i+1].resultTips
                })
            }else{
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
