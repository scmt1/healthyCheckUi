import {formartDate} from "@/api/tools/tool";
import util from "@/libs/util";
let templateJs = {};
let _thisJs = null;
/**
 * 血常规检验报告单
 * @param info 人员
 */
templateJs.joint = function (_this,data) {
    _thisJs = _this;
    let isFile = data.groupItems.isFile;
    let groupItemsName = data.groupItems.name ? data.groupItems.name : data.groupItems.groupItemName;
    let officeName = data.groupItems.officeName;
    //影像所见(诊断提醒)
    let diagnoseTip = "";
    if((data.groupItems && data.groupItems.departResult && data.groupItems.departResult.diagnoseTip) || data.groupItems && data.groupItems.diagnoseTip){
        diagnoseTip = data.groupItems.departResult ? data.groupItems.departResult.diagnoseTip.replaceAll('\n','').replaceAll(' ','') : data.groupItems.diagnoseTip.replaceAll('\n','').replaceAll(' ','');
    }
    //诊断意见(诊断小结)
    let diagnoseSum = "";
    if((data.groupItems && data.groupItems.departResult && data.groupItems.departResult.diagnoseSum) || data.groupItems && data.groupItems.diagnoseSum){
        diagnoseSum = data.groupItems.departResult ? data.groupItems.departResult.diagnoseSum.replaceAll('\n','').replaceAll(' ','') : data.groupItems.diagnoseSum.replaceAll('\n','').replaceAll(' ','');
    }

    let td = {};
    if (isFile != "是") {
        td = {
            name: data.person_name,
            sex: data.sex,
            age: data.age,
            reportNum: data.test_num,
            testNum: data.test_num,
            unitName:data.unit_name,
            autograph:data.groupItems.departResult ? data.groupItems.departResult.checkSign : data.groupItems.checkSign,//医生签名
            sectionOffice: data.groupItems.officeName,//科室名称
            /*createTime: formartDate(data.groupItems.departResult.checkDate || new Date(), "yyyy-MM-dd HH:mm:ss"),//送检时间
            createDate: formartDate(data.groupItems.departResult.checkDate || new Date(), "yyyy-MM-dd"),//送检日期
            inspectTime: formartDate(data.groupItems.departResult.checkDate || new Date(), "yyyy-MM-dd HH:mm:ss"),//检验时间
            inspectDate: formartDate(data.groupItems.departResult.checkDate || new Date(), "yyyy-MM-dd"),//检查日期*/
            createTime: formartDate(data.regist_date || new Date(), "yyyy-MM-dd HH:mm:ss"),//送检时间
            createDate: formartDate(data.regist_date || new Date(), "yyyy-MM-dd"),//送检日期
            inspectTime: formartDate(data.regist_date || new Date(), "yyyy-MM-dd HH:mm:ss"),//检验时间
            inspectDate: formartDate(data.regist_date || new Date(), "yyyy-MM-dd"),//检查日期
            printDate: formartDate(new Date(), "yyyy-MM-dd"),//打印日期
            phone: "0831-3782999",//医院-联系电话
            inspectDoctor: data.groupItems.departResult ? data.groupItems.departResult.checkDoc : data.groupItems.checkDoc,//检验医生
            // doctor: data.groupItems.departResult ? data.groupItems.departResult.checkDoc : data.groupItems.checkDoc,//申请医生
            doctor: "王彬",//申请医生
            reportDoctor: data.groupItems.departResult ? data.groupItems.departResult.checkDoc : data.groupItems.checkDoc,//报告医生
            specimen: data.groupItems.specimen&& data.groupItems.specimen.length>=10?"":data.groupItems.specimen,
            clinicalDiagnosis: data.groupItems.departResult ? data.groupItems.departResult.diagnoseTip : data.groupItems.diagnoseTip,
            diagnoseSum: data.groupItems.departResult ? data.groupItems.departResult.diagnoseSum : data.groupItems.diagnoseSum,//临床诊断
            tableMonitoring: [],//所有基础检查项目
            inspectResult: diagnoseTip,//影像所见(诊断提醒)
            opinion: diagnoseSum,//诊断意见(诊断小结)
            imgList: [],//图片
        };
        if(td.testNum && td.testNum.trim().length > 0){
            let split = td.testNum.split("");
            if(split && split.length >= 4){
                let length = split.length;
                td.codeText = split[length - 4] + split[length - 3] + split[length - 2] + split[length - 1];
            }
        }
        td.mobile = data.mobile;
        //血常规图像获取
        let url = "";
        let groupItemName = data.groupItems.departResult ? data.groupItems.departResult.groupItemName : data.groupItems.groupItemName;
        let groupItemid = data.groupItems.departResult ? data.groupItems.departResult.groupItemId : data.groupItems.groupItemId;
        let nowUrl = data.groupItems.departResult ? data.groupItems.departResult.url : data.groupItems.url
        if(nowUrl && (groupItemName.indexOf("血常规") > -1 || groupItemName.indexOf("眼科") > -1)){
            url = nowUrl;
            if(url.indexOf(",") > -1){
                let urlSplit = url.split(",")
                if(data && data.dept && data.dept.indexOf("宏旭") > -1){
                    for(let i = 0;i < urlSplit.length;i ++){
                        td.imgList.push({img:urlSplit[i]});
                    }
                }else{
                    for(let i = 0;i < 4;i ++){
                        if(urlSplit[i]){
                            td.imgList.push({img:urlSplit[i]});
                        }
                    }
                }
            }else{
                td.imgList.push({img:url});
            }
        }else{
            td.imgList.push({img:"base64"});
        }

        if(groupItemName && groupItemName.indexOf("复") > -1){
            td.reviewName = "（复）";
            let reviewData = data.baseProject[0].treviewProjects;
            reviewData = reviewData.filter(item => item.name == groupItemName && item.id == groupItemid);
            td.inspectTime = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd HH:mm:ss") : formartDate(new Date(), "yyyy-MM-dd HH:mm:ss");//检查时间
            td.inspectDate = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd") : formartDate(new Date(), "yyyy-MM-dd");//检查日期
            td.createTime = td.inspectTime;
            td.createDate = td.inspectDate;//送检日期
        }

        /*体格检查表*/
        //头像
        td.headImg = "";
        if(data.avatar){
            td.headImg = data.avatar;
        }
        //出生日期
        td.birthDate = "-";
        if(data.birth){
            td.birthDate = formartDate(data.birth, 'yyyy-MM-dd');
        }
        //文化程度
        td.education = "-";
        if(data.education){
            td.education = data.education;
        }
        //民族
        td.nation = "-";
        if(data.nation){
            td.nation = data.nation;
        }
        //籍贯
        td.birthPlace = "-";
        if(data.birthplace_name){
            td.birthPlace = data.birthplace_name;
        }
        //初潮
        td.menarche = " ";
        if(data.menarche){
            td.menarche = data.menarche;
        }
        //经期
        td.period = " ";
        if(data.period){
            td.period = data.period;
        }
        //周期
        td.cycle = " ";
        if(data.cycle){
            td.cycle = data.cycle;
        }
        //末次月经/停经年龄
        td.lastMe = " ";
        if(data.last_menstruation){
            td.lastMe = data.last_menstruation;
        }
        //妇科检查
        td.vulva = "-";
        td.vagina = "-";
        td.cervix = "-";
        td.uterineBody = "-";
        td.enclosure = "-";
        //一般检查(职业)
        td.nutrition = "-";
        td.height = "-";
        td.weight = "-";
        td.bloodPressure = "-";
        //耳鼻喉口腔常规（职业）
        td.externalEar = "-";
        td.middleEar = "-";
        td.leftHearing = "-";
        td.rightHearing = "-";
        td.nose = "-";
        td.mucosa = "-";
        td.tooth = "-";
        td.throat = "-";
        td.facialOthers = "-";
        //内科常规(职业)/内科常规(从业)
        td.kidney = "-";
        td.lungs = "-";
        td.spleen = "-";
        td.liver = "-";
        td.rightHearing = "-";
        td.heartMoss = "-";
        td.heartRate = "-";
        td.otherInternal = "-";
        td.rhythm = "-";
        //外科检查(职业)
        td.thyroid = "-";
        td.lymphNode = "-";
        td.limbJoints = "-";
        td.surgicalOthers = "-";
        td.spine = "-";
        td.skinColor = "-";
        td.rash = "-";
        td.petechiae = "-";
        td.vegetations = "-";
        td.blister = "-";
        //神经系统
        td.senseOfPain = "-";
        td.positionPerception = "-";
        td.abdominalWallReflex = "-";
        td.kneeReflex = "-";
        td.achillestendonreflex = "-";
        td.muscleStrength = "-";
        td.muscleTension = "-";
        td.masonicMovement = "-";
        td.tripleTremor = "-";
        td.pathologicalReflex = "-";
        //眼科常规
        td.crystal = "-";
        td.glass = "-";
        td.colorVisionRight = "-";
        td.colorVisionLeft = "-";
        td.darkAdaptationRight = "-";
        td.darkAdaptationLeft = "-";
        td.suitableFieldRight = "-";
        td.suitableFieldLeft = "-";
        td.nakedEyeRight = "-";
        td.nakedEyeLeft = "-";
        td.correctRight = "-";
        td.correctLeft = "-";
        td.conjunctivaRight = "-";
        td.conjunctivaLeft = "-";
        td.cornealRight = "-";
        td.cornealLeft = "-";
        td.anteriorChamberRight = "-";
        td.anteriorChamberLeft = "-";
        td.irisRight = "-";
        td.irisLeft = "-";
        td.lensRight = "-";
        td.lensLeft = "-";
        td.fundusRight = "-";
        td.fundusLeft = "-";
        td.ophthalmologyOthers = "-";//眼科其他
        td.crystalLeft = "-";
        td.glassRight = "-";
        td.crystalRight = "-";
        td.glassLeft = "-";
        td.anteriorPartRight = "-";
        td.anteriorPartLeft = "-";
        td.remarks = "";//备注
        td.jthctNumL = 1;
        td.jthctNumR = 1;
        //皮肤科常规
        td.skinScratch = "-";//皮肤划痕症
        td.skinColorPfk = "-";//皮肤颜色
        td.handSkin = "-";//手部皮肤
        td.wholeBodySkin = "-";//全身皮肤
        td.tineaManus = "-";//手痹
        td.rashPfk = "-";//皮疹
        td.nail = "-";//指甲
        td.dermatologyOthers = "-";//皮肤科其他

        if(officeName.indexOf("一般检查") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = generalInspection(data,td);
                td.sjAutograph = td.autograph;
            }
        }else if(officeName.indexOf("五官科") > -1 && groupItemsName.indexOf("眼") <= -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = otolaryngologyInspection(data,td);
                td.ebhkAutograph = td.autograph;
            }
        }else if(officeName.indexOf("内科") > -1 && groupItemsName.indexOf("神经") <= -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = internalMedicine(data,td);
                td.sjAutograph = td.autograph;
            }
        }else if(officeName.indexOf("外科") > -1 || officeName.indexOf("皮肤科") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = surgicalRoutine(data,td);
                td.nAutograph = td.autograph;
            }
        }else if(groupItemsName.indexOf("神经")>-1 ){
            if (data.baseProject && data.baseProject.length > 0) {
                td = nervousSystem(data,td);
                td.sjAutograph = td.autograph;
            }
        }else if(officeName.indexOf("肺功能") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = pulmonaryFunction(data,td);
            }
        }else if(officeName.indexOf("妇科") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = gynaecology(data,td);
            }
        }else if(officeName.indexOf("电测听") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = pureTone(data,td)
                let cyDatasTZ = [];
                let cyDatasTZGD = [];
                if(data.hazard_factors_text){
                    let hazardFactorsText = data.hazard_factors_text;
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
                            if(td.gGFA && td.gGFA != 0){
                                cyDatasTZ.push({
                                    GFA: td.GFA,
                                });
                                cyDatasTZGD.push({
                                    gGFA: td.gGFA,
                                });
                                if(td.cyShowGD[0] && td.cyShowGD[0].cyDatasTZGD){
                                    td.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                                }
                            }else{
                                cyDatasTZ.push({
                                    GFA: td.GFA,
                                });
                            }
                        }else{//不显示高频
                            if(td.leftImgChart["gy"] && td.leftImgChart["gy"].length > 0 && td.rightImgChart["gy"] && td.rightImgChart["gy"].length > 0){
                                td.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.leftImgChart["y"][0], td.leftImgChart["y"][1],td.leftImgChart["y"][2],null,null,null],"gy":[td.leftImgChart["gy"][0], td.leftImgChart["gy"][1],td.leftImgChart["gy"][2],null,null,null]};
                                td.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.rightImgChart["y"][0], td.rightImgChart["y"][1],td.rightImgChart["y"][2],null,null,null],"gy":[td.rightImgChart["gy"][0], td.rightImgChart["gy"][1],td.rightImgChart["gy"][2],null,null,null]};
                            }else{
                                td.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.leftImgChart["y"][0], td.leftImgChart["y"][1],td.leftImgChart["y"][2],null,null,null]};
                                td.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.rightImgChart["y"][0], td.rightImgChart["y"][1],td.rightImgChart["y"][2],null,null,null]};
                            }
                        }
                    }else{
                        if(!(data.hazard_factors_text.indexOf("机动车") > -1 || data.hazard_factors_text.indexOf("压力容器") > -1)){
                            if(td.gGFA && td.gGFA != 0){
                                cyDatasTZ.push({
                                    GFA: td.GFA,
                                });
                                cyDatasTZGD.push({
                                    gGFA: td.gGFA,
                                });
                                if(td.cyShowGD[0] && td.cyShowGD[0].cyDatasTZGD){
                                    td.cyShowGD[0].cyDatasTZGD = cyDatasTZGD;
                                }
                            }else{
                                cyDatasTZ.push({
                                    GFA: td.GFA,
                                });
                            }
                        }else{//不显示高频
                            if(td.leftImgChart["gy"] && td.leftImgChart["gy"].length > 0 && td.rightImgChart["gy"] && td.rightImgChart["gy"].length > 0){
                                td.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.leftImgChart["y"][0], td.leftImgChart["y"][1],td.leftImgChart["y"][2],null,null,null],"gy":[td.leftImgChart["gy"][0], td.leftImgChart["gy"][1],td.leftImgChart["gy"][2],null,null,null]};
                                td.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.rightImgChart["y"][0], td.rightImgChart["y"][1],td.rightImgChart["y"][2],null,null,null],"gy":[td.rightImgChart["gy"][0], td.rightImgChart["gy"][1],td.rightImgChart["gy"][2],null,null,null]};
                            }else{
                                td.leftImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.leftImgChart["y"][0], td.leftImgChart["y"][1],td.leftImgChart["y"][2],null,null,null]};
                                td.rightImgChart = {"x":["500", "1000","2000","3000","4000","6000"],"y":[td.rightImgChart["y"][0], td.rightImgChart["y"][1],td.rightImgChart["y"][2],null,null,null]};
                            }
                        }
                    }
                    //加权值显示
                    let cyDatasTZjqz = [];
                    if(hazardFactorsText && hazardFactorsText.indexOf("噪声") > -1){
                        if(groupItemName && groupItemName.indexOf("复") > -1){
                            cyDatasTZjqz.push({
                                WVr: td.WVr,
                                WVl: td.WVl,
                            })
                        }
                    }
                    td.cyDatasTZjqz = cyDatasTZjqz;
                }
                td.cyDatasTZ = cyDatasTZ;
            }
        }else if(officeName.indexOf("口腔科") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = kqcgImageData(data,td);
            }
        }else if((officeName.indexOf("五官科") > -1 && groupItemsName.indexOf("眼") > -1) || officeName.indexOf("眼科") > -1){
            if (data.baseProject && data.baseProject.length > 0) {
                td = ophthalmicRoutine(data,td);
            }
        }else {
            if(groupItemsName.indexOf("幽门螺旋杆菌") > -1){
                if (data.baseProject && data.baseProject.length > 0) {
                    td.scope = data.baseProject[0].departItemResults.scope;
                    if(td.scope && td.scope.indexOf("≤") > -1){
                        td.scope = td.scope.replace("≤","");
                    }
                    td.result = data.baseProject[0].departItemResults.result;
                    if(td.result){
                        if(td.result > 50){
                            td.resultText = "阳性";
                        }else if(td.result <= 50){
                            td.resultText = "阴性";
                        }
                    }
                    td.histogramImage = {"x":["参考值","检测结果"],"y":[td.scope,td.result]};
                }
            }
            if(officeName.indexOf("检验科") > -1 && groupItemsName.indexOf("尿常规") > -1){
                if (data.baseProject && data.baseProject.length > 0) {
                    for(let n = 0;n < 11;n ++){
                        if(n < 9){
                            let monitorName2 = "";
                            let value2 = "";
                            let reference2 = "";
                            let unit2 = "";
                            let arrow2 = "";
                            let resultTips2 = "";
                            if(data.baseProject[n+11] && data.baseProject[n+11].departItemResults){
                                if(data.baseProject[n+11].departItemResults.orderGroupItemProjectName){
                                    monitorName2 = data.baseProject[n+11].departItemResults.orderGroupItemProjectName;
                                }
                                if(data.baseProject[n+11].departItemResults.result){
                                    value2 = data.baseProject[n+11].departItemResults.result;
                                }
                                if(data.baseProject[n+11].departItemResults.scope){
                                    reference2 = data.baseProject[n+11].departItemResults.scope;
                                }
                                if(data.baseProject[n+11].departItemResults.unitName){
                                    unit2 = data.baseProject[n+11].departItemResults.unitName.indexOf("无")>-1 ? "" : data.baseProject[n+11].departItemResults.unitName;
                                }
                                if(data.baseProject[n+11].departItemResults.arrow){
                                    arrow2 = data.baseProject[n+11].departItemResults.arrow;
                                }
                                if(data.baseProject[n+11].departItemResults.crisisDegree){
                                    resultTips2 = data.baseProject[n+11].departItemResults.crisisDegree;
                                }
                            }

                            td.tableMonitoring.push({
                                monitorName: data.baseProject[n].departItemResults.orderGroupItemProjectName,
                                value: data.baseProject[n].departItemResults.result,
                                reference: data.baseProject[n].departItemResults.scope,
                                unit: data.baseProject[n].departItemResults.unitName ? data.baseProject[n].departItemResults.unitName.indexOf("无")>-1 ? "" : data.baseProject[n].departItemResults.unitName : "",
                                arrow: data.baseProject[n].departItemResults.arrow,
                                resultTips: data.baseProject[n].departItemResults.crisisDegree,
                                monitorName2: monitorName2,
                                value2: value2,
                                reference2: reference2,
                                unit2: unit2,
                                arrow2: arrow2,
                                resultTips2: resultTips2,
                            });
                        }else{
                            td.tableMonitoring.push({
                                monitorName: data.baseProject[n].departItemResults.orderGroupItemProjectName,
                                value: data.baseProject[n].departItemResults.result,
                                reference: data.baseProject[n].departItemResults.scope,
                                unit: data.baseProject[n].departItemResults.unitName ? data.baseProject[n].departItemResults.unitName.indexOf("无")>-1 ? "" : data.baseProject[n].departItemResults.unitName : "",
                                arrow: data.baseProject[n].departItemResults.arrow,
                                resultTips: data.baseProject[n].departItemResults.crisisDegree,
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
            }else if(officeName.indexOf("检验科") > -1 && groupItemsName.indexOf("乙肝两对半") > -1){
                if (data.baseProject && data.baseProject.length > 0) {
                    let int = 1;
                    data.baseProject.forEach(i => {
                        //单个基础项
                        td.tableMonitoring.push({
                            num: int,
                            shortName: i.shortName ? i.shortName : "",
                            monitorName: i.departItemResults.orderGroupItemProjectName,
                            value: i.departItemResults.result,
                            referenceRange: i.departItemResults.scope,
                            unit: i.departItemResults.unitName,
                            arrow: i.departItemResults.arrow,
                            resultTips: i.departItemResults.crisisDegree
                        });
                        int ++;
                    })
                }
            }else{
                if (data.baseProject && data.baseProject.length > 0) {
                    let int = 1;
                    data.baseProject.forEach(i => {
                        //单个基础项
                        td.tableMonitoring.push({
                            num: int,
                            monitorName: i.departItemResults.orderGroupItemProjectName,
                            value: i.departItemResults.result,
                            referenceRange: i.departItemResults.scope,
                            unit: i.departItemResults.unitName,
                            arrow: i.departItemResults.arrow,
                            resultTips: i.departItemResults.crisisDegree
                        });
                        int ++;
                    })
                }
            }
        }
    } else {
        td = {
            name: data.person_name,
            sex: data.sex,
            age: data.age,
            reportNum: data.test_num,
            testNum: data.test_num,
            sectionOffice: data.groupItems.officeName,//科室名称
            createTime: formartDate(data.regist_date, "yyyy-MM-dd HH:mm:ss"),//送检时间
            createDate: formartDate(data.regist_date, "yyyy-MM-dd"),//送检日期
            /*inspectTime: formartDate(data.groupItems.departResult.checkDate || new Date(), "yyyy-MM-dd HH:mm:ss"),//检验时间
            inspectDate: formartDate(data.groupItems.departResult.checkDate || new Date(), "yyyy-MM-dd"),//检查日期*/
            inspectTime: formartDate(data.regist_date || new Date(), "yyyy-MM-dd HH:mm:ss"),//检验时间
            inspectDate: formartDate(data.regist_date || new Date(), "yyyy-MM-dd"),//检查日期
            printDate: formartDate(new Date(), "yyyy-MM-dd"),//打印日期
            phone: "0831-3782999",//医院-联系电话
            inspectDoctor: data.groupItems.departResult ? data.groupItems.departResult.checkDoc : data.groupItems.checkDoc,//检验医生
            doctor: data.groupItems.departResult ? data.groupItems.departResult.checkDoc : data.groupItems.checkDoc,//申请医生
            reportDoctor: data.groupItems.departResult ? data.groupItems.departResult.checkDoc : data.groupItems.checkDoc,//报告医生
            specimen: data.groupItems.specimen,
            autograph:data.groupItems.departResult ? data.groupItems.departResult.checkSign : data.groupItems.checkSign,//医生签名
            zoncareImg:data.pacsData&&data.pacsData.length>0?data.pacsData[0].replace(util.nginxUrl ,""):"",
            gpImg:data.pacsData&&data.pacsData.length>0?data.pacsData[0].replace(util.nginxUrl ,""):"",
            zoncareResult:data.groupItems.departResult ? data.groupItems.departResult.diagnoseSum : data.groupItems.diagnoseSum,
            clinicalDiagnosis: data.groupItems.departResult ? data.groupItems.departResult.diagnoseTip : data.groupItems.diagnoseTip,
            diagnoseSum: data.groupItems.departResult ? data.groupItems.departResult.diagnoseSum : data.groupItems.diagnoseSum,//临床诊断
            imgList: [],//拍片图片 diagnose_tip
            inspectResult: diagnoseTip,//影像所见(诊断提醒)
            opinion: diagnoseSum,//诊断意见(诊断小结)
        };
        td.imgList.push({img:"base64"})
        let groupItemName = data.groupItems.departResult ? data.groupItems.departResult.groupItemName : data.groupItems.groupItemName;
        let groupItemid = data.groupItems.departResult ? data.groupItems.departResult.groupItemId : data.groupItems.groupItemId;
        if(groupItemName && groupItemName.indexOf("复") > -1){
            td.reviewName = "（复）";
            let reviewData = data.baseProject[0].treviewProjects;
            reviewData = reviewData.filter(item => item.name == groupItemName && item.id == groupItemid);
            td.inspectTime = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd HH:mm:ss") : formartDate(new Date(), "yyyy-MM-dd HH:mm:ss");//检查时间
            td.inspectDate = reviewData[0].registDate ? formartDate(reviewData[0].registDate, "yyyy-MM-dd") : formartDate(new Date(), "yyyy-MM-dd");//检查日期
            td.createTime = td.inspectTime;
            td.createDate = td.inspectDate;//送检日期
        }
    }
    return td;
}

/**
 *
 * 一般检查
 *
 * */
function generalInspection(data,td) {
    let shrink = '';
    let diastole = '';
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        let result = "";
        if(i.departItemResults.result){
            result = i.departItemResults.result;
        }else{
            result = 0;
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "营养") {
                td.nutrition = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "身高") {
                td.height = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "体重") {
                td.weight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "心率" || i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "心") {
                td.heartRate = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "舒张压") {
                diastole = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "收缩压") {
                shrink = result + unit;
            }
        }
        td.bloodPressure = shrink + "/" + diastole;
    })
    return td;
}

/**
 *
 * 耳鼻喉口腔常规
 *
 * */
function otolaryngologyInspection(data,td) {
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "外耳道") {
                td.externalEar = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "中耳") {
                td.middleEar = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "听力(左)") {
                td.leftHearing = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "听力(右)") {
                td.rightHearing = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "鼻部") {
                td.nose = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "口腔黏膜") {
                td.mucosa = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "牙齿") {
                td.tooth = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "咽部") {
                td.throat = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "五官科其他") {
                td.facialOthers = i.departItemResults.result + unit;
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
function  internalMedicine(data,td) {
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "肾") {
                td.kidney = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "肺部") {
                td.lungs = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "脾") {
                td.spleen = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "肝") {
                td.liver = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "心率") {
                td.heartRate = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "心音") {
                td.heartMoss = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "心律") {
                td.rhythm = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "内科其他") {
                td.otherInternal = i.departItemResults.result + unit;
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
function  surgicalRoutine(data,td) {
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "甲状腺(外科)") {
                td.thyroid = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "浅表淋巴结") {
                td.lymphNode = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "四肢关节") {
                td.limbJoints = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "外科其他") {
                td.surgicalOthers = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "脊柱") {
                td.spine = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "皮肤颜色") {
                td.skinColor = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "皮疹") {
                td.rash = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "瘀斑、瘀点") {
                td.petechiae = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "赘生物") {
                td.vegetations = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "水疱或大疱") {
                td.blister = i.departItemResults.result + unit;
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
function  nervousSystem(data,td) {
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "痛觉、触觉") {
                td.senseOfPain = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "位置觉") {
                td.positionPerception = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "腹壁反射") {
                td.abdominalWallReflex = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "膝反射") {
                td.kneeReflex = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "跟腱反射") {
                td.achillestendonreflex = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "肌力") {
                td.muscleStrength = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "肌张力") {
                td.muscleTension = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "共济运动") {
                td.masonicMovement = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "三颤") {
                td.tripleTremor = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "病理反射") {
                td.pathologicalReflex = i.departItemResults.result + unit;
            }
        }
    })
    return td;
}

/**
 *
 * 肺功能
 *
 * */
function  pulmonaryFunction(data,td) {
    let vitalCapacity1=[];
    let vitalCapacity2=[];
    let vitalCapacity3=[];
    let vitalCapacityShort1=_thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort1;
    let vitalCapacityShort2=_thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort2;
    let vitalCapacityShort3=_thisJs.$hospitalName.fgnTemplate.vitalCapacity.vitalCapacityShort3;
    vitalCapacityShort1.forEach(i => {
        let items = data.baseProject.filter(o=>o.shortName == i);
        if (items && items.length > 0) {
            let referenceRange = "";
            if(items[0].departItemResults.updateId && items[0].departItemResults.updateId != null){
                referenceRange = items[0].departItemResults.updateId && items[0].departItemResults.updateId.toString().trim().length > 0 && items[0].departItemResults.updateId.toString().trim() != "-" ? items[0].departItemResults.updateId.toString().trim() : 0;
            }else {
                // referenceRange = items[0].departItemResults.scope && items[0].departItemResults.scope.toString().trim().length > 0 && items[0].departItemResults.scope.toString().trim() != "-" ? items[0].departItemResults.scope.toString().trim() : 0;
                referenceRange = 0;
            }
            vitalCapacity1.push({
                monitorName: items[0].name,
                value: items[0].departItemResults.result && items[0].departItemResults.result.toString().trim().length > 0 && items[0].departItemResults.result.toString().trim() != "-" ? items[0].departItemResults.result.toString().trim() : 0,
                referenceRange: referenceRange,
                resultTips:(items[0].departItemResults.result && items[0].departItemResults.result.toString().trim() != 0 && items[0].departItemResults.result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].departItemResults.result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : 0,
                unit: items[0].departItemResults.unitName.replace(" ",""),
            });
        } else {
            if (items && items.length > 0) {
                vitalCapacity1.push({
                    monitorName: i,
                    value: "-",
                    resultTips: '-',
                    referenceRange: "-",
                    unit: "-"
                });
            }
        }
    });
    vitalCapacityShort2.forEach(i => {
        let items = data.baseProject.filter(o=>o.shortName == i);
        if (items && items.length > 0) {
            let referenceRange = "";
            if(items[0].departItemResults.updateId && items[0].departItemResults.updateId != null){
                referenceRange = items[0].departItemResults.updateId && items[0].departItemResults.updateId.toString().trim().length > 0 && items[0].departItemResults.updateId.toString().trim() != "-" ? items[0].departItemResults.updateId.toString().trim() : "";
            }else {
                // referenceRange = items[0].departItemResults.scope && items[0].departItemResults.scope.toString().trim().length > 0 && items[0].departItemResults.scope.toString().trim() != "-" ? items[0].departItemResults.scope.toString().trim() : 0;
                referenceRange = "";
            }
            if(referenceRange == 0){
                referenceRange = "";
            }
            vitalCapacity2.push({
                monitorName: items[0].name,
                value: items[0].departItemResults.result && items[0].departItemResults.result.toString().trim().length > 0 && items[0].departItemResults.result.toString().trim() != "-" ? items[0].departItemResults.result.toString().trim() : 0,
                referenceRange: referenceRange,
                resultTips:(items[0].departItemResults.result && items[0].departItemResults.result.toString().trim() != 0 && items[0].departItemResults.result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].departItemResults.result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : "",
                unit: items[0].departItemResults.unitName.replace(" ",""),
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
        let items = data.baseProject.filter(o=>o.shortName == i);
        if (items && items.length > 0) {
            let referenceRange = "";
            if(items[0].departItemResults.updateId && items[0].departItemResults.updateId != null){
                referenceRange = items[0].departItemResults.updateId && items[0].departItemResults.updateId.toString().trim().length > 0 && items[0].departItemResults.updateId.toString().trim() != "-" ? items[0].departItemResults.updateId.toString().trim() : 0;
            }else {
                // referenceRange = items[0].departItemResults.scope && items[0].departItemResults.scope.toString().trim().length > 0 && items[0].departItemResults.scope.toString().trim() != "-" ? items[0].departItemResults.scope.toString().trim() : 0;
                referenceRange = 0;
            }
            vitalCapacity3.push({
                monitorName: items[0].name,
                value: items[0].departItemResults.result && items[0].departItemResults.result.toString().trim().length > 0 && items[0].departItemResults.result.toString().trim() != "-" ? items[0].departItemResults.result.toString().trim() : 0,
                referenceRange: referenceRange,
                resultTips:(items[0].departItemResults.result && items[0].departItemResults.result.toString().trim() != 0 && items[0].departItemResults.result.toString().trim() != "-" && referenceRange && referenceRange != 0 && referenceRange != "-") ? (((items[0].departItemResults.result.toString().trim()/referenceRange).toFixed(2))*100).toFixed(0) : 0,
                unit: items[0].departItemResults.unitName.replace(" ",""),
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

    td.opinion= data.groupItems.departResult ? data.groupItems.departResult.diagnoseSum : data.groupItems.diagnoseSum;//临床诊断
    td.vitalCapacity1 = vitalCapacity1;
    td.vitalCapacity2 = vitalCapacity2;
    td.vitalCapacity3 = vitalCapacity3;
    return td;
}
/**
 *
 * 妇科检查
 *
 * */
function  gynaecology(data,td) {
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "外阴") {
                td.vulva = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "阴道") {
                td.vagina = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "宫颈") {
                td.cervix = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "宫体") {
                td.uterineBody = i.departItemResults.result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "附件") {
                td.enclosure = i.departItemResults.result + unit;
            }
        }
    })
    return td;
}

/**
 *
 * 纯音
 *
 * */
function  pureTone(data,td) {
    //气体·
    let r500, r1000, r2000, r3000, r4000, r6000;
    let l500, l1000, l2000, l3000, l4000, l6000;
    //骨导
    let gr500, gr1000, gr2000, gr3000, gr4000, gr6000;
    let gl500, gl1000, gl2000, gl3000, gl4000, gl6000;
    if (data.baseProject && data.baseProject.length > 0) {
        data.baseProject.forEach(i => {
            //单个基础项
            //气体
            if(i.departItemResults.orderGroupItemProjectName) {
                let result = i.departItemResults.result;
                if(result == null){
                    result = 0;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "").indexOf("6000Hz(骨导)") > -1) {
                    if(result == 0){
                        result = '';
                    }
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳500Hz") {
                    l500 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳1000Hz") {
                    l1000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳2000Hz") {
                    l2000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳3000Hz") {
                    l3000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳4000Hz") {
                    l4000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳6000Hz") {
                    l6000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳500Hz") {
                    r500 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳1000Hz") {
                    r1000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳2000Hz") {
                    r2000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳3000Hz") {
                    r3000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳4000Hz") {
                    r4000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳6000Hz") {
                    r6000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳语频平均听阈") {
                    td.HLl = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳语频平均听阈") {
                    td.HLr = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "双耳高频平均听阈") {
                    td.GFA = result;
                }
                //骨导
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳500Hz(骨导)") {
                    gl500 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳1000Hz(骨导)") {
                    gl1000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳2000Hz(骨导)") {
                    gl2000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳3000Hz(骨导)") {
                    gl3000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳4000Hz(骨导)") {
                    gl4000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳6000Hz(骨导)") {
                    gl6000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳500Hz(骨导)") {
                    gr500 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳1000Hz(骨导)") {
                    gr1000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳2000Hz(骨导)") {
                    gr2000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳3000Hz(骨导)") {
                    gr3000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳4000Hz(骨导)") {
                    gr4000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳6000Hz(骨导)") {
                    gr6000 = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "左耳语频平均听阈(骨导)") {
                    td.gHLl = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "右耳语频平均听阈(骨导)") {
                    td.gHLr = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "双耳高频平均听阈(骨导)") {
                    td.gGFA = result;
                }
                //双耳语频平均值
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "双耳高频平均听阈") {
                    td.seyp = result;
                }
                if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "双耳高频平均听阈(骨导)") {
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
    td.opinion= data.groupItems.departResult ? data.groupItems.departResult.diagnoseSum : data.groupItems.diagnoseSum;//临床诊断
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
    data.baseProject.forEach(i => {
        if (i && i.departItemResults) {
            let arrow = i.departItemResults.arrow.replaceAll(" ", "");
            let value = i.departItemResults.result.replaceAll(" ", "");
            let monitorName = i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "");
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

    td.rightTop = rightTopPX.join().replaceAll(",", "");
    td.leftTop = leftTopPX.join().replaceAll(",", "");
    td.rightBottom = rightBottomPX.join().replaceAll(",", "");
    td.leftBottom = leftBottomPX.join().replaceAll(",", "");

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
function  ophthalmicRoutine(data,td) {
    data.baseProject.forEach(i => {
        //单个基础项
        let unit = '';
        let unitName = i.departItemResults.unitName;
        if(unitName && unitName.length > 0) {
            if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
                unit = unitName;
            }
        }
        let result = "";
        if(i.departItemResults && i.departItemResults.result) {
            result = i.departItemResults.result;
        }else{
            result = 0;
        }
        if(i.departItemResults.orderGroupItemProjectName) {
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "色觉(右)") {
                td.colorVisionRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "色觉(左)") {
                td.colorVisionLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "暗适应(右)") {
                td.darkAdaptationRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "暗适应(左)") {
                td.darkAdaptationLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "视野(右)") {
                td.suitableFieldRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "视野(左)") {
                td.suitableFieldLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "裸眼视力(右)") {
                if(result == 0){
                    td.nakedEyeRight = "-";
                }else{
                    td.nakedEyeRight = result + unit;
                }
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "裸眼视力(左)") {
                if(result == 0){
                    td.nakedEyeLeft = "-";
                }else{
                    td.nakedEyeLeft = result + unit;
                }
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "矫正视力(右)") {
                if(result == 0){
                    td.correctRight = "-";
                }else{
                    td.correctRight = result + unit;
                }
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "矫正视力(左)") {
                if(result == 0){
                    td.correctLeft = "-";
                }else{
                    td.correctLeft = result + unit;
                }
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "结膜(右)") {
                td.conjunctivaRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "结膜(左)") {
                td.conjunctivaLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "角膜(右)") {
                td.cornealRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "角膜(左)") {
                td.cornealLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "前房(右)") {
                td.anteriorChamberRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "前房(左)") {
                td.anteriorChamberLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "虹膜(右)") {
                td.irisRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "虹膜(左)") {
                td.irisLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "晶状体(右)") {
                td.lensRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "晶状体(左)") {
                td.lensLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "眼底(右)") {
                td.fundusRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "眼底(左)") {
                td.fundusLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "眼科其他") {
                td.ophthalmologyOthers = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "晶体(左)") {
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
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "晶体(右)") {
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
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "玻璃体(左)") {
                td.glassLeft = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "玻璃体(右)") {
                td.glassRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "眼前部(右)") {
                td.anteriorPartRight = result + unit;
            }
            if (i.departItemResults.orderGroupItemProjectName.replaceAll(" ", "") == "眼前部(左)") {
                td.anteriorPartLeft = result + unit;
            }
        }
    })
    return td;
}

export default templateJs;
