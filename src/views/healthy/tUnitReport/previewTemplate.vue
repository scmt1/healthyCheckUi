<template>

    <Modal v-model="show" title="预览" class="previewTemplate" :mask-closable="false" :fullscreen="isFullscreen" :width="modalWidth">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;">
            <p>模板预览</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <iframe id="printPdf" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 99%"
                class="pdfTemplate"></iframe>

        <!--    <div class="pdfTemplate">-->
        <!--      <pdf ref="pdf" id="printPdf" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i"></pdf>-->
        <!--    </div>-->
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <!--      <Button type="primary" :loading="loading" @click="print()">打印</Button>-->
            <!--      <Button type="primary" :loading="loading" @click="downloadTemplate()">下载</Button>-->
            <Button @click="downloadTemplateWord()" type="primary">下载</Button>
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
import {exportTemplate, getTemplatePreviewData,exportWord} from '@/api/healthy/tTemplate'
import {formartDate} from "@/api/tools/tool";

import pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'

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
        previewName: {
            type: String,
            default: ""
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            isUpdateUnitPage: false,

            show: this.value,
            previewHtml: "",//预览显示
            previewHtmlUrl: "",
            numPages: null, // pdf 总页数
            loading: false,
            isFullscreen: false,
            printName: '转图片打印',
            modalWidth: 800
        }
    },
    methods: {
        //排序
        orderNumMethod(arr){
            if(arr.length > 1){
                let int = 1;
                for(let i = 0;i < arr.length;i ++){
                    arr[i].hazardFactorsName = "" + int + "、" + arr[i].hazardFactorsName;
                    int ++;
                }
                return arr;
            }else{
                return arr;
            }
        },
        init() {
            let _this = this;
            this.loading = true;
            this.previewHtmlUrl = "";
            let templateData = {};
            templateData = JSON.parse(JSON.stringify(this.TTemplateId));
            // debugger

            let sections = [];
            //页头图片展示
            if(this.$hospitalName.isShowIcon){
                sections.push({
                    isShowIcon: "展示",
                });
            }
            templateData.sections = sections;
            //是否修改单位报告
            let isUpdateUnit = _this.$hospitalName.isUpdateUnit;

            templateData.physicalRate = (templateData.filishNumber / templateData.physicalNumber * 100).toFixed(0) + "%"

            templateData.totalsTJ = 0;
            templateData.noAbnormalNumsTJ = 0;
            templateData.otherAbnormalNumsTJ = 0;
            templateData.recheckNumsTJ = 0;
            templateData.tabooNumsTJ = 0;
            templateData.diseaseNumsTJ = 0;

            templateData.totals = 0;
            templateData.noAbnormalNums = 0;
            templateData.otherAbnormalNums = 0;
            templateData.recheckNums = 0;
            templateData.tabooNums = 0;
            templateData.diseaseNums = 0;
            templateData.otherTotals = 0;

            let resultDatasGQ = [];
            let resultDatasZG = [];
            let resultDatasLGS = [];
            let resultDatasLGH = [];
            let resultDatasYJ = [];
            if (templateData.resultDatas && templateData.resultDatas != [] && templateData.resultDatas != null) {
                let resultDatasNow = templateData.resultDatas;
                let resultDatas = [];
                for (var key in resultDatasNow){
                    let workStateNameNow = key;//体检类型
                    let hazardFactorsDataNow = resultDatasNow[workStateNameNow];
                    for (var keyH in hazardFactorsDataNow){
                        let hazardFactorsNow = keyH;//危害因素
                        let valueNow = hazardFactorsDataNow[hazardFactorsNow];//详细数据(体检结果)
                        let numberAll = valueNow.length;//check_result
                        let dataYc = valueNow.filter(item => item.checkResult.indexOf("0") <= -1 && item.checkResult.indexOf("1") <= -1);
                        let numberYc = dataYc.length;
                        let numberNyc = numberAll - numberYc;
                        let personResult = "";
                        let newResults = [];
                        let newPersonNames = [];
                        for (let j = 0;j < dataYc.length;j ++){
                            let personNames = dataYc[j].personName;
                            // let results = "" + dataYc[j].otherCheckAbnormalResults + dataYc[j].handleOpinion;
                            // let results = "" + dataYc[j].conclusion + dataYc[j].handleOpinion;
                            let results = "" + dataYc[j].handleOpinion;
                            results = results.replace("undefined","");
                            results = results.replaceAll("\r","").replaceAll("\n","").replaceAll("|","、");
                            if(newPersonNames && newPersonNames.length > 0 && !(newPersonNames.indexOf(personNames) > -1)){
                                let nowDataResults = newResults.filter(item => item.results == results);
                                if(nowDataResults.length > 0){
                                    for(let m = 0;m < newResults.length;m ++){
                                        if(newResults[m].results == results){
                                            newResults[m].personNames += "、" + personNames;
                                        }
                                    }
                                }else{
                                    newResults.push({
                                        personNames: personNames,
                                        results: results,
                                    });
                                    newPersonNames.push(personNames);
                                }
                            }else{
                                newResults.push({
                                    personNames: personNames,
                                    results: results,
                                });
                                newPersonNames.push(personNames);
                            }
                        }
                        let personCount = ""
                        if(!isUpdateUnit){//不修改 是川北、大乔
                            personCount = "人员" + numberAll + "人,其中：";
                            for(let n = 0;n < newResults.length;n ++){
                                let personCountNow = newResults[n].personNames.split("、").length;
                                if(n < newResults.length - 1){
                                    personResult += "" + newResults[n].personNames + personCountNow + "人:" + newResults[n].results + '\n' + "    ";
                                }else {
                                    personResult += "" + newResults[n].personNames + personCountNow + "人:" + newResults[n].results;
                                }
                            }
                        }else{//修改 是师古
                            personCount = "人员" + numberAll + "人：";
                            for(let n = 0;n < newResults.length;n ++){
                                let personCountNow = newResults[n].personNames.split("、").length;
                                if(n < newResults.length - 1){
                                    personResult += "其中" + personCountNow + "人:" + newResults[n].results + '\n' + "    ";
                                }else {
                                    personResult += "其中" + personCountNow + "人:" + newResults[n].results;
                                }
                            }
                        }
                        //排版调整
                        let nowData = {};
                        hazardFactorsNow = hazardFactorsNow.replaceAll("|","、");
                        hazardFactorsNow = hazardFactorsNow.indexOf("作业") > -1 ? hazardFactorsNow.replace("作业","") : hazardFactorsNow;
                        if(numberYc != 0){
                            if(numberNyc == 0){
                                nowData = {
                                    hazardFactorsName: "本次体检" + hazardFactorsNow + "作业",
                                    personCount: personCount,
                                    personResults: personResult,
                                }
                            }else {
                                let otherPersonResults = "";
                                let numberNycNumber = "";
                                if(numberNyc != 1){
                                    numberNycNumber = "均";
                                }
                                if(workStateNameNow.indexOf("岗前") > -1){
                                    otherPersonResults = '\n' + "    其余"+numberNyc+"人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可从事接触"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                }else if(workStateNameNow.indexOf("在岗") > -1){
                                    otherPersonResults = '\n' + "    其余"+numberNyc+"人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可继续原接触"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                }else if(workStateNameNow.indexOf("离岗时") > -1){
                                    otherPersonResults = '\n' + "    其余"+numberNyc+"人，"+numberNycNumber+"未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                                }else if(workStateNameNow.indexOf("离岗后") > -1){
                                    otherPersonResults = '\n' + "    其余"+numberNyc+"人，"+numberNycNumber+"未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                                }else if(workStateNameNow.indexOf("应急") > -1){
                                    otherPersonResults = '\n' + "    其余"+numberNyc+"人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可继续从事"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                }
                                nowData = {
                                    hazardFactorsName: "本次体检" + hazardFactorsNow + "作业",
                                    personCount: personCount,
                                    personResults: personResult,
                                    // otherPersonResults: '\n' + "    其余"+numberNyc+"人，均正常，可继续原"+ hazardFactorsNow +"作业的工作。加强个人劳动防护，定期参加职业健康检查。",
                                    otherPersonResults: otherPersonResults,
                                }
                            }
                        }else if(numberAll !=0){
                            let otherPersonResults = "";
                            let numberNycNumber = "";
                            if(numberAll != 1){
                                numberNycNumber = "均";
                            }
                            if(workStateNameNow.indexOf("岗前") > -1){
                                otherPersonResults = "人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可从事接触"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                            }else if(workStateNameNow.indexOf("在岗") > -1){
                                otherPersonResults = "人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可继续原接触"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                            }else if(workStateNameNow.indexOf("离岗时") > -1){
                                otherPersonResults = "人，"+numberNycNumber+"未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                            }else if(workStateNameNow.indexOf("离岗后") > -1){
                                otherPersonResults = "人，"+numberNycNumber+"未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                            }else if(workStateNameNow.indexOf("应急") > -1){
                                otherPersonResults = "人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可继续从事"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                            }
                            nowData = {
                                hazardFactorsName: "本次体检" + hazardFactorsNow + "作业",
                                // personCount: "人员" + numberAll + "人,目前体检结果均无异常",
                                personCount: "人员" + numberAll + otherPersonResults,
                            }
                        }
                        resultDatas.push(nowData);
                        //体检类型筛选
                        if(workStateNameNow.indexOf("岗前") > -1){
                            resultDatasGQ.push(nowData);
                        }else if(workStateNameNow.indexOf("在岗") > -1){
                            resultDatasZG.push(nowData);
                        }else if(workStateNameNow.indexOf("离岗时") > -1){
                            resultDatasLGS.push(nowData);
                        }else if(workStateNameNow.indexOf("离岗后") > -1){
                            resultDatasLGH.push(nowData);
                        }else if(workStateNameNow.indexOf("应急") > -1){
                            resultDatasYJ.push(nowData);
                        }
                    }
                }

                resultDatasGQ = _this.orderNumMethod(resultDatasGQ);
                resultDatasZG = _this.orderNumMethod(resultDatasZG);
                resultDatasLGS = _this.orderNumMethod(resultDatasLGS);
                resultDatasLGH = _this.orderNumMethod(resultDatasLGH);
                resultDatasYJ = _this.orderNumMethod(resultDatasYJ);

                templateData.resultDatas = resultDatas;
                //不同体检类型 检查结果数据 录入
                if(resultDatasGQ && resultDatasGQ.length > 0){
                    templateData.nameGQ = "上岗前：";
                    templateData.resultDatasGQ = resultDatasGQ;
                }
                if(resultDatasZG && resultDatasZG.length > 0){
                    templateData.nameZG = "在岗期间：";
                    templateData.resultDatasZG = resultDatasZG;
                }
                if(resultDatasLGS && resultDatasLGS.length > 0){
                    templateData.nameLGS = "离岗时：";
                    templateData.resultDatasLGS = resultDatasLGS;
                }
                if(resultDatasLGH && resultDatasLGH.length > 0){
                    templateData.nameLGH = "离岗后：";
                    templateData.resultDatasLGH = resultDatasLGH;
                }
                if(resultDatasYJ && resultDatasYJ.length > 0){
                    templateData.nameYJ = "应急健康检查：";
                    templateData.resultDatasYJ = resultDatasYJ;
                }
            }

            if (templateData.groupDatas && templateData.groupDatas.length > 0) {
                let groupDatas = [];
                groupDatas = templateData.groupDatas;
                //检查项目筛选 并去重
                let newData = [];
                let hazardFactorsNameDatas = [];
                groupDatas.forEach(function (e) {
                    if(newData && newData.length > 0 && hazardFactorsNameDatas.indexOf(e.hazardFactorsName) > -1){
                        for(let i = 0;i < newData.length;i ++){
                            if(newData[i].hazardFactorsName == e.hazardFactorsName && newData[i].workStateName != e.workStateName){
                                let newDataProject = newData[i].projectDataName.split("、");
                                let eProject = e.projectDataName.split(",");
                                let allProject = [];//共有项目
                                for(let j = 0;j < newDataProject.length;j ++){
                                    for(let m = 0;m < eProject.length;m ++){
                                        if(newDataProject[j] == eProject[m]){
                                            allProject.push(newDataProject[j])
                                        }
                                    }
                                }
                                //增加项目统计
                                let addProject = [];
                                for(let j = 0;j < newDataProject.length;j ++){
                                    if(allProject.indexOf(newDataProject[j]) <= -1){
                                        addProject.push(newDataProject[j])
                                    }
                                }
                                if(addProject.length > 0){
                                    newData[i].addProject += "" + newData[i].workStateName + "增加体检项目：" + addProject.join("、") + ";";
                                }
                                addProject = [];
                                for(let j = 0;j < eProject.length;j ++){
                                    if(allProject.indexOf(eProject[j]) <= -1){
                                        addProject.push(eProject[j])
                                    }
                                }
                                if(addProject.length > 0){
                                    newData[i].addProject += "" + e.workStateName + "增加体检项目：" + addProject.join("、") + ";";
                                }
                                if(allProject.length > 0){
                                    newData[i].projectDataName = allProject.join("、");
                                }
                            }
                        }
                    }else{
                        newData.push({
                            workStateName: e.workStateName,
                            hazardFactorsName: e.hazardFactorsName,
                            projectDataName: e.projectDataName.replaceAll(",","、"),
                            addProject: "",
                        });
                        hazardFactorsNameDatas.push(e.hazardFactorsName);
                    }
                    /*let hazardFactorsNameNow  = e.hazardFactorsName.replaceAll(" ","");
                    if(hazardFactorsNameNow.indexOf("|") > -1 || hazardFactorsNameNow.indexOf("、") > -1){
                        let hazardFactorsArray = [];
                        if(hazardFactorsNameNow.indexOf("|") > -1){
                            hazardFactorsArray = hazardFactorsNameNow.replaceAll("|","、");
                            hazardFactorsArray = hazardFactorsArray.split("、");
                        }else{
                            hazardFactorsArray = hazardFactorsNameNow.split("、");
                        }
                        hazardFactorsArray.forEach(function (h) {
                            if(hazardFactorsNameDatas && hazardFactorsNameDatas.length > 0 && hazardFactorsNameDatas.indexOf(h) > -1){
                                for(let i = 0;i < newData.length;i ++){
                                    if(newData[i].hazardFactorsName == h){
                                        let newString = (newData[i].projectDataName + "," + e.projectDataName).replaceAll("(职业)","").replaceAll("（职业）","").replaceAll("(不含片)","").replaceAll("（不含片）","");
                                        let esProjects = newString.split(",");
                                        let dataQC = _this.removeRepeat(esProjects);
                                        newData[i].projectDataName = dataQC.join(",");
                                    }
                                }
                            }else{
                                let projectDataName = e.projectDataName;
                                newData.push({
                                    hazardFactorsName: h,
                                    projectDataName: projectDataName.replaceAll("(职业)","").replaceAll("（职业）","").replaceAll("(不含片)","").replaceAll("（不含片）",""),
                                });
                                hazardFactorsNameDatas.push(h);
                            }
                        });
                    }else{
                        if(hazardFactorsNameDatas && hazardFactorsNameDatas.length && hazardFactorsNameDatas.indexOf(hazardFactorsNameNow) > -1){
                            for(let i = 0;i < newData.length;i ++){
                                if(newData[i].hazardFactorsName == hazardFactorsNameNow){
                                    let newString = (newData[i].projectDataName + "," + e.projectDataName).replaceAll("(职业)","").replaceAll("（职业）","").replaceAll("(不含片)","").replaceAll("（不含片）","");
                                    let esProjects = newString.split(",");
                                    let dataQC = _this.removeRepeat(esProjects);
                                    newData[i].projectDataName = dataQC.join(",");
                                }
                            }
                        }else{
                            let projectDataName = e.projectDataName;
                            newData.push({
                                hazardFactorsName: e.hazardFactorsName,
                                projectDataName: projectDataName.replaceAll("(职业)","").replaceAll("（职业）","").replaceAll("(不含片)","").replaceAll("（不含片）",""),
                            });
                            hazardFactorsNameDatas.push(hazardFactorsNameNow);
                        }
                    }*/
                });
                templateData.groupDatas = newData;
            }else{
                templateData.groupDatas = [];
            }

            if (templateData.goodsState.length < 1) {
                templateData.goodsState.push({
                    hazardFactorsText: "-",
                    workStateText: "-",
                    total: "-",
                    noAbnormalNum: "-",
                    otherAbnormalNum: "-",
                    recheckNum: "-",
                    tabooNum: "-",
                    diseaseNum: "-",
                })
                templateData.totalsTJ = "-";
                templateData.noAbnormalNumsTJ = "-";
                templateData.otherAbnormalNumsTJ = "-";
                templateData.recheckNumsTJ = "-";
                templateData.tabooNumsTJ = "-";
                templateData.diseaseNumsTJ = "-";
            } else {
                for (let i = 0; i < templateData.goodsState.length; i++) {
                    templateData.goodsState[i].workStateText = templateData.goodsState[i].workStateText.replaceAll(" ","");
                    let good = templateData.goodsState[i];
                    templateData.totalsTJ += Number(good.total);
                    templateData.noAbnormalNumsTJ += Number(good.noAbnormalNum);
                    templateData.otherAbnormalNumsTJ += Number(good.otherAbnormalNum);
                    templateData.recheckNumsTJ += Number(good.recheckNum);
                    templateData.tabooNumsTJ += Number(good.tabooNum);
                    templateData.diseaseNumsTJ += Number(good.diseaseNum);
                }
            }

            if (templateData.goods.length < 1) {
                templateData.goods.push({
                    hazardFactorsText: "-",
                    workStateText: "-",
                    total: "-",
                    noAbnormalNum: "-",
                    otherAbnormalNum: "-",
                    recheckNum: "-",
                    recheckNums: "-",
                    tabooNum: "-",
                    diseaseNum: "-",
                })
                templateData.totals = "-";
                templateData.noAbnormalNums = "-";
                templateData.otherAbnormalNums = "-";
                templateData.recheckNums = "-";
                templateData.tabooNums = "-";
                templateData.diseaseNums = "-";
            } else {
                for (let i = 0; i < templateData.goods.length; i++) {
                    let good = templateData.goods[i];
                    templateData.totals += Number(good.total);
                    templateData.noAbnormalNums += Number(good.noAbnormalNum);
                    templateData.otherAbnormalNums += Number(good.otherAbnormalNum);
                    templateData.recheckNums += Number(good.recheckNums);
                    templateData.tabooNums += Number(good.tabooNum);
                    templateData.diseaseNums += Number(good.diseaseNum);
                    good.otherTotal = Number(good.total);
                    // good.otherTotal = Number(good.total);
                    templateData.otherTotals += Number(good.otherTotal);
                }
            }

            if (templateData.recheckData.length < 1) {
                templateData.recheckData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    diagnoseSum: "-",
                    portfolioProjectName: "-",
                    mobile: "-",
                })
            } else {
                for (let i = 0; i < templateData.recheckData.length; i++) {
                    let isRecheck = templateData.recheckData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                       /* if(templateData.recheckData[i].workTypeText && templateData.recheckData[i].workTypeText.indexOf("其他") > -1){
                            templateData.recheckData[i].workTypeText = templateData.recheckData[i].workName;
                        }
                        if((!templateData.recheckData[i].exposureWorkYear || templateData.recheckData[i].exposureWorkYear == 0) && (templateData.recheckData[i].exposureWorkMonth && templateData.recheckData[i].exposureWorkMonth != 0)){
                            templateData.recheckData[i].exposureWorkYear = templateData.recheckData[i].exposureWorkMonth + "月"
                        }else if((templateData.recheckData[i].exposureWorkYear && templateData.recheckData[i].exposureWorkYear != 0) && (!templateData.recheckData[i].exposureWorkMonth || templateData.recheckData[i].exposureWorkMonth == 0)){
                            templateData.recheckData[i].exposureWorkYear = templateData.recheckData[i].exposureWorkYear + "年"
                        }else if((!templateData.recheckData[i].exposureWorkYear || templateData.recheckData[i].exposureWorkYear == 0) && (!templateData.recheckData[i].exposureWorkMonth || templateData.recheckData[i].exposureWorkMonth == 0)){
                            templateData.recheckData[i].exposureWorkYear = 0
                        }else{
                            templateData.recheckData[i].exposureWorkYear = templateData.recheckData[i].exposureWorkYear + "年" + templateData.recheckData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.recheckData[i].checkResult.indexOf("2") > -1 || templateData.recheckData[i].checkResult.indexOf("3") > -1 || templateData.recheckData[i].checkResult.indexOf("4") > -1){
                            templateData.recheckData[i].isRecheck = "异常";
                        }else{
                            templateData.recheckData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.recheckData[i].checkResult.indexOf("2") > -1 || templateData.recheckData[i].checkResult.indexOf("3") > -1 || templateData.recheckData[i].checkResult.indexOf("4") > -1){
                            templateData.recheckData[i].isRecheck = "异常";
                        }else{
                            templateData.recheckData[i].isRecheck = "正常";
                        }
                    }
                    templateData.recheckData[i].workStateText == templateData.recheckData[i].workStateText.replace(" ","");
                }
            }

            if (templateData.tabooData.length < 1) {
                templateData.tabooData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    conclusion: "-",
                    handleOpinion: "-",
                    isRecheck: "-",
                    mobile: "-",
                })
            } else {
                for (let i = 0; i < templateData.tabooData.length; i++) {
                    let isRecheck = templateData.tabooData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                       /* if(templateData.tabooData[i].workTypeText && templateData.tabooData[i].workTypeText.indexOf("其他") > -1){
                            templateData.tabooData[i].workTypeText = templateData.tabooData[i].workName;
                        }
                        if((!templateData.tabooData[i].exposureWorkYear || templateData.tabooData[i].exposureWorkYear == 0) && (templateData.tabooData[i].exposureWorkMonth && templateData.tabooData[i].exposureWorkMonth != 0)){
                            templateData.tabooData[i].exposureWorkYear = templateData.tabooData[i].exposureWorkMonth + "月"
                        }else if((templateData.tabooData[i].exposureWorkYear && templateData.tabooData[i].exposureWorkYear != 0) && (!templateData.tabooData[i].exposureWorkMonth || templateData.tabooData[i].exposureWorkMonth == 0)){
                            templateData.tabooData[i].exposureWorkYear = templateData.tabooData[i].exposureWorkYear + "年"
                        }else if((!templateData.tabooData[i].exposureWorkYear || templateData.tabooData[i].exposureWorkYear == 0) && (!templateData.tabooData[i].exposureWorkMonth || templateData.tabooData[i].exposureWorkMonth == 0)){
                            templateData.tabooData[i].exposureWorkYear = 0
                        }else{
                            templateData.tabooData[i].exposureWorkYear = templateData.tabooData[i].exposureWorkYear + "年" + templateData.tabooData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.tabooData[i].checkResult.indexOf("2") > -1 || templateData.tabooData[i].checkResult.indexOf("3") > -1 || templateData.tabooData[i].checkResult.indexOf("4") > -1){
                            templateData.tabooData[i].isRecheck = "异常";
                        }else{
                            templateData.tabooData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.tabooData[i].checkResult.indexOf("2") > -1 || templateData.tabooData[i].checkResult.indexOf("3") > -1 || templateData.tabooData[i].checkResult.indexOf("4") > -1){
                            templateData.tabooData[i].isRecheck = "异常";
                        }else{
                            templateData.tabooData[i].isRecheck = "正常";
                        }
                    }
                    templateData.tabooData[i].workStateText == templateData.tabooData[i].workStateText.replace(" ","");
                }
            }

            if (templateData.diseaseData.length < 1) {
                templateData.diseaseData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    conclusion: "-",
                    handleOpinion: "-",
                    isRecheck: "-",
                    mobile: "-",
                })
            } else {
                for (let i = 0; i < templateData.diseaseData.length; i++) {
                    let isRecheck = templateData.diseaseData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                        /*if(templateData.diseaseData[i].workTypeText && templateData.diseaseData[i].workTypeText.indexOf("其他") > -1){
                            templateData.diseaseData[i].workTypeText = templateData.diseaseData[i].workName;
                        }
                        if((!templateData.diseaseData[i].exposureWorkYear || templateData.diseaseData[i].exposureWorkYear == 0) && (templateData.diseaseData[i].exposureWorkMonth && templateData.diseaseData[i].exposureWorkMonth != 0)){
                            templateData.diseaseData[i].exposureWorkYear = templateData.diseaseData[i].exposureWorkMonth + "月"
                        }else if((templateData.diseaseData[i].exposureWorkYear && templateData.diseaseData[i].exposureWorkYear != 0) && (!templateData.diseaseData[i].exposureWorkMonth || templateData.diseaseData[i].exposureWorkMonth == 0)){
                            templateData.diseaseData[i].exposureWorkYear = templateData.diseaseData[i].exposureWorkYear + "年"
                        }else if((!templateData.diseaseData[i].exposureWorkYear || templateData.diseaseData[i].exposureWorkYear == 0) && (!templateData.diseaseData[i].exposureWorkMonth || templateData.diseaseData[i].exposureWorkMonth == 0)){
                            templateData.diseaseData[i].exposureWorkYear = 0
                        }else{
                            templateData.diseaseData[i].exposureWorkYear = templateData.diseaseData[i].exposureWorkYear + "年" + templateData.diseaseData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.diseaseData[i].checkResult.indexOf("2") > -1 || templateData.diseaseData[i].checkResult.indexOf("3") > -1 || templateData.diseaseData[i].checkResult.indexOf("4") > -1){
                            templateData.diseaseData[i].isRecheck = "异常";
                        }else{
                            templateData.diseaseData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.diseaseData[i].checkResult.indexOf("2") > -1 || templateData.diseaseData[i].checkResult.indexOf("3") > -1 || templateData.diseaseData[i].checkResult.indexOf("4") > -1){
                            templateData.diseaseData[i].isRecheck = "异常";
                        }else{
                            templateData.diseaseData[i].isRecheck = "正常";
                        }
                    }
                    templateData.diseaseData[i].workStateText == templateData.diseaseData[i].workStateText.replace(" ","");
                }
            }
            if (templateData.otherAbnormalData.length < 1) {
                templateData.otherAbnormalData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    conclusion: "-",
                    handleOpinion: "-",
                    isRecheck: "-",
                    mobile: "-",
                })
            } else {
                for (let i = 0; i < templateData.otherAbnormalData.length; i++) {
                    let isRecheck = templateData.otherAbnormalData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                        /*if(templateData.otherAbnormalData[i].workTypeText && templateData.otherAbnormalData[i].workTypeText.indexOf("其他") > -1){
                            templateData.otherAbnormalData[i].workTypeText = templateData.otherAbnormalData[i].workName;
                        }
                        if((!templateData.otherAbnormalData[i].exposureWorkYear || templateData.otherAbnormalData[i].exposureWorkYear == 0) && (templateData.otherAbnormalData[i].exposureWorkMonth && templateData.otherAbnormalData[i].exposureWorkMonth != 0)){
                            templateData.otherAbnormalData[i].exposureWorkYear = templateData.otherAbnormalData[i].exposureWorkMonth + "月"
                        }else if((templateData.otherAbnormalData[i].exposureWorkYear && templateData.otherAbnormalData[i].exposureWorkYear != 0) && (!templateData.otherAbnormalData[i].exposureWorkMonth || templateData.otherAbnormalData[i].exposureWorkMonth == 0)){
                            templateData.otherAbnormalData[i].exposureWorkYear = templateData.otherAbnormalData[i].exposureWorkYear + "年"
                        }else if((!templateData.otherAbnormalData[i].exposureWorkYear || templateData.otherAbnormalData[i].exposureWorkYear == 0) && (!templateData.otherAbnormalData[i].exposureWorkMonth || templateData.otherAbnormalData[i].exposureWorkMonth == 0)){
                            templateData.otherAbnormalData[i].exposureWorkYear = 0
                        }else{
                            templateData.otherAbnormalData[i].exposureWorkYear = templateData.otherAbnormalData[i].exposureWorkYear + "年" + templateData.otherAbnormalData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.otherAbnormalData[i].checkResult.indexOf("2") > -1 || templateData.otherAbnormalData[i].checkResult.indexOf("3") > -1 || templateData.otherAbnormalData[i].checkResult.indexOf("4") > -1){
                            templateData.otherAbnormalData[i].isRecheck = "异常";
                        }else{
                            templateData.otherAbnormalData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.otherAbnormalData[i].checkResult.indexOf("2") > -1 || templateData.otherAbnormalData[i].checkResult.indexOf("3") > -1 || templateData.otherAbnormalData[i].checkResult.indexOf("4") > -1){
                            templateData.otherAbnormalData[i].isRecheck = "异常";
                        }else{
                            templateData.otherAbnormalData[i].isRecheck = "正常";
                        }
                    }
                    templateData.otherAbnormalData[i].workStateText == templateData.otherAbnormalData[i].workStateText.replace(" ","");
                }
            }
            if (templateData.personData.length < 1) {
                templateData.personData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    conclusion: "-",
                    handleOpinion: "-",
                    isRecheck: "-",
                    mobile: "-",
                    registDate: "-",
                })
            } else {
                for (let i = 0; i < templateData.personData.length; i++) {
                    let isRecheck = templateData.personData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                        /*if(templateData.personData[i].workTypeText && templateData.personData[i].workTypeText.indexOf("其他") > -1){
                            templateData.personData[i].workTypeText = templateData.personData[i].workName;
                        }
                        if((!templateData.personData[i].exposureWorkYear || templateData.personData[i].exposureWorkYear == 0) && (templateData.personData[i].exposureWorkMonth && templateData.personData[i].exposureWorkMonth != 0)){
                            templateData.personData[i].exposureWorkYear = templateData.personData[i].exposureWorkMonth + "月"
                        }else if((templateData.personData[i].exposureWorkYear && templateData.personData[i].exposureWorkYear != 0) && (!templateData.personData[i].exposureWorkMonth || templateData.personData[i].exposureWorkMonth == 0)){
                            templateData.personData[i].exposureWorkYear = templateData.personData[i].exposureWorkYear + "年"
                        }else if((!templateData.personData[i].exposureWorkYear || templateData.personData[i].exposureWorkYear == 0) && (!templateData.personData[i].exposureWorkMonth || templateData.personData[i].exposureWorkMonth == 0)){
                            templateData.personData[i].exposureWorkYear = 0
                        }else{
                            templateData.personData[i].exposureWorkYear = templateData.personData[i].exposureWorkYear + "年" + templateData.personData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.personData[i].checkResult.indexOf("2") > -1 || templateData.personData[i].checkResult.indexOf("3") > -1 || templateData.personData[i].checkResult.indexOf("4") > -1){
                            templateData.personData[i].isRecheck = "异常";
                        }else{
                            templateData.personData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.personData[i].checkResult.indexOf("2") > -1 || templateData.personData[i].checkResult.indexOf("3") > -1 || templateData.personData[i].checkResult.indexOf("4") > -1){
                            templateData.personData[i].isRecheck = "异常";
                        }else{
                            templateData.personData[i].isRecheck = "正常";
                        }
                    }
                    templateData.personData[i].registDate = formartDate(templateData.personData[i].registDate,"yyyy-MM-dd");
                    templateData.personData[i].workStateText == templateData.personData[i].workStateText.replace(" ","");
                }
            }
            getTemplatePreviewData({id: this.TTemplateId.id, templateData: JSON.stringify(templateData)}).then(res => {
                this.loading = false;
                if (res && res.success) {
                    this.previewHtml = res.data.replace("template", "div");
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                    this.previewHtmlUrl = url;
                } else {
                    this.loading = false;
                    this.$Message.error('预览请求失败');
                }
            });
        },
        initJKTJ() {
            let _this = this;
            this.loading = true;
            this.previewHtmlUrl = "";
            let templateData = {};
            templateData = JSON.parse(JSON.stringify(this.TTemplateId));

            let sections = [];
            //页头图片展示
            if(this.$hospitalName.isShowIcon){
                sections.push({
                    isShowIcon: "展示",
                });
            }
            templateData.sections = sections;

            templateData.physicalRate = (templateData.filishNumber / templateData.physicalNumber * 100).toFixed(0) + "%"

            templateData.totalsTJ = 0;
            templateData.noAbnormalNumsTJ = 0;
            templateData.otherAbnormalNumsTJ = 0;
            templateData.recheckNumsTJ = 0;
            templateData.tabooNumsTJ = 0;
            templateData.diseaseNumsTJ = 0;

            templateData.totals = 0;
            templateData.noAbnormalNums = 0;
            templateData.otherAbnormalNums = 0;
            templateData.recheckNums = 0;
            templateData.tabooNums = 0;
            templateData.diseaseNums = 0;
            templateData.otherTotals = 0;

            let numAll = templateData.personData.length;
            let numYc = templateData.recheckData.length;
            let numZc = numAll - numYc;
            if(numZc == numAll){
                templateData.personResults = "本次健康体检人员" + numAll + "人，均正常。";
            }else if(numYc == numAll){
                templateData.personResults = "本次健康体检人员" + numAll + "人，均异常。";
            }else{
                templateData.personResults = "本次健康体检人员" + numAll + "人，正常" + numZc + "人，异常" + numYc + "人。";
            }

            if (templateData.groupDatas && templateData.groupDatas.length > 0) {
                let groupDatas = [];
                groupDatas = templateData.groupDatas;
                //检查项目筛选 并去重
                let newData = [];
                let hazardFactorsNameDatas = [];
                groupDatas.forEach(function (e) {
                    if(newData && newData.length > 0 && hazardFactorsNameDatas && hazardFactorsNameDatas.length > 0 && hazardFactorsNameDatas.indexOf(e.hazardFactorsName) > -1){
                        for(let i = 0;i < newData.length;i ++){
                            if(newData[i].hazardFactorsName == e.hazardFactorsName && newData[i].workStateName != e.workStateName){
                                let newDataProject = newData[i].projectDataName.split("、");
                                let eProject = e.projectDataName.split(",");
                                let allProject = [];//共有项目
                                for(let j = 0;j < newDataProject.length;j ++){
                                    for(let m = 0;m < eProject.length;m ++){
                                        if(newDataProject[j] == eProject[m]){
                                            allProject.push(newDataProject[j])
                                        }
                                    }
                                }
                                //增加项目统计
                                let addProject = [];
                                for(let j = 0;j < newDataProject.length;j ++){
                                    if(allProject.indexOf(newDataProject[j]) <= -1){
                                        addProject.push(newDataProject[j])
                                    }
                                }
                                if(addProject.length > 0){
                                    newData[i].addProject += "" + newData[i].workStateName + "增加体检项目：" + addProject.join("、") + ";";
                                }
                                addProject = [];
                                for(let j = 0;j < eProject.length;j ++){
                                    if(allProject.indexOf(eProject[j]) <= -1){
                                        addProject.push(eProject[j])
                                    }
                                }
                                if(addProject.length > 0){
                                    newData[i].addProject += "" + e.workStateName + "增加体检项目：" + addProject.join("、") + ";";
                                }
                                if(allProject.length > 0){
                                    newData[i].projectDataName = allProject.join("、");
                                }
                            }
                        }
                    }else{
                        newData.push({
                            workStateName: e.workStateName,
                            hazardFactorsName: e.hazardFactorsName,
                            projectDataName: e.projectDataName.replaceAll(",","、"),
                            addProject: "",
                        });
                        if(e.hazardFactorsName){
                            hazardFactorsNameDatas.push(e.hazardFactorsName);
                        }
                    }
                    /*let hazardFactorsNameNow  = e.hazardFactorsName.replaceAll(" ","");
                    if(hazardFactorsNameNow.indexOf("|") > -1 || hazardFactorsNameNow.indexOf("、") > -1){
                        let hazardFactorsArray = [];
                        if(hazardFactorsNameNow.indexOf("|") > -1){
                            hazardFactorsArray = hazardFactorsNameNow.replaceAll("|","、");
                            hazardFactorsArray = hazardFactorsArray.split("、");
                        }else{
                            hazardFactorsArray = hazardFactorsNameNow.split("、");
                        }
                        hazardFactorsArray.forEach(function (h) {
                            if(hazardFactorsNameDatas && hazardFactorsNameDatas.length > 0 && hazardFactorsNameDatas.indexOf(h) > -1){
                                for(let i = 0;i < newData.length;i ++){
                                    if(newData[i].hazardFactorsName == h){
                                        let newString = (newData[i].projectDataName + "," + e.projectDataName).replaceAll("(健康)","").replaceAll("（健康）","").replaceAll("(不含片)","").replaceAll("（不含片）","");
                                        let esProjects = newString.split(",");
                                        let dataQC = _this.removeRepeat(esProjects);
                                        newData[i].projectDataName = dataQC.join(",");
                                    }
                                }
                            }else{
                                let projectDataName = e.projectDataName;
                                newData.push({
                                    hazardFactorsName: h,
                                    projectDataName: projectDataName.replaceAll("(健康)","").replaceAll("（健康）","").replaceAll("(不含片)","").replaceAll("（不含片）",""),
                                });
                                hazardFactorsNameDatas.push(h);
                            }
                        });
                    }else{
                        if(hazardFactorsNameDatas && hazardFactorsNameDatas.length && hazardFactorsNameDatas.indexOf(hazardFactorsNameNow) > -1){
                            for(let i = 0;i < newData.length;i ++){
                                if(newData[i].hazardFactorsName == hazardFactorsNameNow){
                                    let newString = (newData[i].projectDataName + "," + e.projectDataName).replaceAll("(健康)","").replaceAll("（健康）","").replaceAll("(不含片)","").replaceAll("（不含片）","");
                                    let esProjects = newString.split(",");
                                    let dataQC = _this.removeRepeat(esProjects);
                                    newData[i].projectDataName = dataQC.join(",");
                                }
                            }
                        }else{
                            let projectDataName = e.projectDataName;
                            newData.push({
                                hazardFactorsName: e.hazardFactorsName,
                                projectDataName: projectDataName.replaceAll("(健康)","").replaceAll("（健康）","").replaceAll("(不含片)","").replaceAll("（不含片）",""),
                            });
                            hazardFactorsNameDatas.push(hazardFactorsNameNow);
                        }
                    }*/
                });
                for(let n = 0;n < newData.length;n ++){
                    let hazardFactorsNameNow = "";
                    if(newData[n].hazardFactorsName){
                        hazardFactorsNameNow = "（" + newData[n].hazardFactorsName + "）"
                    }
                    newData[n].hazardFactorsName = hazardFactorsNameNow;
                }
                templateData.groupDatas = newData;
            }else{
                templateData.groupDatas = [];
            }

            if (templateData.goodsState.length < 1) {
                templateData.goodsState.push({
                    physicalType: "-",
                    allNum: "-",
                    normalNum: "-",
                    reviewNum: "-",
                })
                templateData.totalsTJ = "-";
                templateData.noAbnormalNumsTJ = "-";
                templateData.recheckNumsTJ = "-";
            } else {
                for (let i = 0; i < templateData.goodsState.length; i++) {
                    templateData.goodsState[i].physicalType = templateData.goodsState[i].physicalType.replaceAll(" ","");
                    let good = templateData.goodsState[i];
                    templateData.totalsTJ += Number(good.allNum);
                    templateData.noAbnormalNumsTJ += Number(good.normalNum);
                    templateData.recheckNumsTJ += Number(good.reviewNum);
                }
            }

            if (templateData.recheckData.length < 1) {
                templateData.recheckData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    diagnoseSum: "-",
                    portfolioProjectName: "-",
                    mobile: "-",
                    physicalType: "-",
                })
            } else {
                for (let i = 0; i < templateData.recheckData.length; i++) {
                    let handleOpinion = templateData.recheckData[i].handleOpinion;
                    if(handleOpinion.replaceAll('\n','').replaceAll(' ','') == "无"){
                        templateData.recheckData[i].handleOpinion = "";
                    }
                    let isRecheck = templateData.recheckData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                        /*if(templateData.recheckData[i].workTypeText && templateData.recheckData[i].workTypeText.indexOf("其他") > -1){
                            templateData.recheckData[i].workTypeText = templateData.recheckData[i].workName;
                        }
                        if((!templateData.recheckData[i].exposureWorkYear || templateData.recheckData[i].exposureWorkYear == 0) && (templateData.recheckData[i].exposureWorkMonth && templateData.recheckData[i].exposureWorkMonth != 0)){
                            templateData.recheckData[i].exposureWorkYear = templateData.recheckData[i].exposureWorkMonth + "月"
                        }else if((templateData.recheckData[i].exposureWorkYear && templateData.recheckData[i].exposureWorkYear != 0) && (!templateData.recheckData[i].exposureWorkMonth || templateData.recheckData[i].exposureWorkMonth == 0)){
                            templateData.recheckData[i].exposureWorkYear = templateData.recheckData[i].exposureWorkYear + "年"
                        }else if((!templateData.recheckData[i].exposureWorkYear || templateData.recheckData[i].exposureWorkYear == 0) && (!templateData.recheckData[i].exposureWorkMonth || templateData.recheckData[i].exposureWorkMonth == 0)){
                            templateData.recheckData[i].exposureWorkYear = 0
                        }else{
                            templateData.recheckData[i].exposureWorkYear = templateData.recheckData[i].exposureWorkYear + "年" + templateData.recheckData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.recheckData[i].checkResult.indexOf("2") > -1 || templateData.recheckData[i].checkResult.indexOf("3") > -1 || templateData.recheckData[i].checkResult.indexOf("4") > -1){
                            templateData.recheckData[i].isRecheck = "异常";
                        }else{
                            templateData.recheckData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.recheckData[i].checkResult.indexOf("2") > -1 || templateData.recheckData[i].checkResult.indexOf("3") > -1 || templateData.recheckData[i].checkResult.indexOf("4") > -1){
                            templateData.recheckData[i].isRecheck = "异常";
                        }else{
                            templateData.recheckData[i].isRecheck = "正常";
                        }
                    }
                    if(templateData.recheckData[i] && templateData.recheckData[i].workStateText){
                        templateData.recheckData[i].workStateText == templateData.recheckData[i].workStateText.replace(" ","");
                    }
                }
            }

            if (templateData.personData.length < 1) {
                templateData.personData.push({
                    testNum: "-",
                    personName: "-",
                    sex: "-",
                    age: "-",
                    idCard: "-",
                    hazardFactorsText: "-",
                    workTypeText: "-",
                    exposureWorkYear: "-",
                    workStateText: "-",
                    isNormal: "-",
                    conclusion: "-",
                    handleOpinion: "-",
                    isRecheck: "-",
                    mobile: "-",
                    registDate: "-",
                    physicalType: "-",
                })
            } else {
                for (let i = 0; i < templateData.personData.length; i++) {
                    let handleOpinion = templateData.personData[i].handleOpinion;
                    if(handleOpinion.replaceAll('\n','').replaceAll(' ','') == "无"){
                        templateData.personData[i].handleOpinion = "";
                    }
                    let isRecheck = templateData.personData[i].isRecheck;
                    if(this.isUpdateUnitPage){
                       /* if(templateData.personData[i].workTypeText && templateData.personData[i].workTypeText.indexOf("其他") > -1){
                            templateData.personData[i].workTypeText = templateData.personData[i].workName;
                        }
                        if((!templateData.personData[i].exposureWorkYear || templateData.personData[i].exposureWorkYear == 0) && (templateData.personData[i].exposureWorkMonth && templateData.personData[i].exposureWorkMonth != 0)){
                            templateData.personData[i].exposureWorkYear = templateData.personData[i].exposureWorkMonth + "月"
                        }else if((templateData.personData[i].exposureWorkYear && templateData.personData[i].exposureWorkYear != 0) && (!templateData.personData[i].exposureWorkMonth || templateData.personData[i].exposureWorkMonth == 0)){
                            templateData.personData[i].exposureWorkYear = templateData.personData[i].exposureWorkYear + "年"
                        }else if((!templateData.personData[i].exposureWorkYear || templateData.personData[i].exposureWorkYear == 0) && (!templateData.personData[i].exposureWorkMonth || templateData.personData[i].exposureWorkMonth == 0)){
                            templateData.personData[i].exposureWorkYear = 0
                        }else{
                            templateData.personData[i].exposureWorkYear = templateData.personData[i].exposureWorkYear + "年" + templateData.personData[i].exposureWorkMonth + "月"
                        }*/
                        if(isRecheck == 1 || templateData.personData[i].checkResult.indexOf("2") > -1 || templateData.personData[i].checkResult.indexOf("3") > -1 || templateData.personData[i].checkResult.indexOf("4") > -1){
                            templateData.personData[i].isRecheck = "异常";
                        }else{
                            templateData.personData[i].isRecheck = "目前未见异常";
                        }
                    }else{
                        if(isRecheck == 1 || templateData.personData[i].checkResult.indexOf("2") > -1 || templateData.personData[i].checkResult.indexOf("3") > -1 || templateData.personData[i].checkResult.indexOf("4") > -1){
                            templateData.personData[i].isRecheck = "异常";
                        }else{
                            templateData.personData[i].isRecheck = "正常";
                        }
                    }
                    templateData.personData[i].registDate = formartDate(templateData.personData[i].registDate,"yyyy-MM-dd");
                    if(templateData.personData[i] && templateData.personData[i].workStateText){
                        templateData.personData[i].workStateText == templateData.personData[i].workStateText.replace(" ","");
                    }
                }
            }
            getTemplatePreviewData({id: this.TTemplateId.id, templateData: JSON.stringify(templateData)}).then(res => {
                this.loading = false;
                if (res && res.success) {
                    this.previewHtml = res.data.replace("template", "div");
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                    this.previewHtmlUrl = url;
                } else {
                    this.loading = false;
                    this.$Message.error('预览请求失败');
                }
            });
        },
        initReview() {
            this.loading = true;
            this.previewHtmlUrl = "";
            let templateData = {};
            templateData = JSON.parse(JSON.stringify(this.TTemplateId));

            //是否修改复查位报告
            let isUpdateUnit = this.$hospitalName.isUpdateUnit;

            let resultDatasGQ = [];
            let resultDatasZG = [];
            let resultDatasLGS = [];
            let resultDatasLGH = [];
            let resultDatasYJ = [];
            if (templateData.resultDatas && templateData.resultDatas != [] && templateData.resultDatas != null) {
                let resultDatasNow = templateData.resultDatas;
                let resultDatas = [];
                for (var key in resultDatasNow){
                    let workStateNameNow = key;//体检类型
                    let hazardFactorsDataNow = resultDatasNow[workStateNameNow];
                    for (var keyH in hazardFactorsDataNow){
                        let hazardFactorsNow = keyH;//危害因素
                        let valueNow = hazardFactorsDataNow[hazardFactorsNow];//详细数据(体检结果)
                        let numberAll = valueNow.length;//check_result
                        let dataYc = valueNow.filter(item => (item.reviewResult && item.reviewResult.indexOf("不宜继续") > -1));
                        let numberYc = dataYc.length;
                        let numberNyc = numberAll - numberYc;
                        let personResult = "";
                        let newResults = [];
                        let newPersonNames = [];
                        let portfolioProjectName = "";
                        for (let j = 0;j < dataYc.length;j ++){
                            if(portfolioProjectName != ""){
                                portfolioProjectName += "、" + dataYc[j].reviewName;
                            }else{
                                portfolioProjectName += dataYc[j].reviewName;
                            }

                            let personNames = dataYc[j].personName;
                            // let results = "" + dataYc[j].otherCheckAbnormalResults + dataYc[j].handleOpinion;
                            let results = ""
                            /*if(!dataYc[j].reviewResult){
                                results = "" + dataYc[j].conclusion + dataYc[j].handleOpinion;
                            }else{
                                results = "" + dataYc[j].reviewResult + dataYc[j].handleOpinion;
                            }*/
                            if(!dataYc[j].reviewResult){
                                results = "" + dataYc[j].conclusion;
                            }else{
                                results = "" + dataYc[j].reviewResult;
                            }
                            results = results.replace("undefined","");
                            results = results.replaceAll("\r","").replaceAll("\n","").replaceAll("|","、");
                            if(dataYc[j].reviewResult){
                                let splitData = [];
                                if(results && results.indexOf(";为") > -1){
                                    splitData = results.split(";为")
                                    results = "为"+splitData[1];
                                }else if(results && results.indexOf("；为") > -1){
                                    splitData = results.split("；为")
                                    results = "为"+splitData[1];
                                }
                            }
                            if(newPersonNames && newPersonNames.length > 0 && !(newPersonNames.indexOf(personNames) > -1)){
                                let nowDataResults = newResults.filter(item => item.results == results);
                                if(nowDataResults.length > 0){
                                    for(let m = 0;m < newResults.length;m ++){
                                        if(newResults[m].results == results){
                                            newResults[m].personNames += "、" + personNames;
                                        }
                                    }
                                }else{
                                    newResults.push({
                                        personNames: personNames,
                                        results: results,
                                    });
                                    newPersonNames.push(personNames);
                                }
                            }else{
                                newResults.push({
                                    personNames: personNames,
                                    results: results,
                                });
                                newPersonNames.push(personNames);
                            }
                        }
                        //复查项目筛查(去除后缀、去重)
                        portfolioProjectName = (portfolioProjectName + "").replace("(复)","").replaceAll("(复)","");
                        portfolioProjectName = portfolioProjectName.split("、");;
                        portfolioProjectName = this.removeRepeat(portfolioProjectName);
                        portfolioProjectName = portfolioProjectName.join("、");
                        let personCount = ""
                        let personCountName = ""
                        if(!isUpdateUnit){//不修改 是川北、大乔
                            personCount = "人员" + numberAll + "人，经复查"+portfolioProjectName+"，其中：";
                            for(let n = 0;n < newResults.length;n ++){
                                let personCountNow = newResults[n].personNames.split("、").length;
                                if(n < newResults.length - 1){
                                    personCountName += "" + newResults[n].personNames + "、";
                                    personResult += "" + newResults[n].personNames + personCountNow + "人:" + newResults[n].results + '\n' + "    ";
                                }else {
                                    personCountName += "" + newResults[n].personNames;
                                    personResult += "" + newResults[n].personNames + personCountNow + "人:" + newResults[n].results;
                                }
                            }
                        }else{//修改 是师古
                            personCount = "人员" + numberAll + "人，经复查"+portfolioProjectName+"：";
                            for(let n = 0;n < newResults.length;n ++){
                                let personCountNow = newResults[n].personNames.split("、").length;
                                if(n < newResults.length - 1){
                                    personCountName += "" + newResults[n].personNames + "、";
                                    personResult += "其中" + personCountNow + "人:" + newResults[n].results + '\n' + "    ";
                                }else {
                                    personCountName += "" + newResults[n].personNames;
                                    personResult += "其中" + personCountNow + "人:" + newResults[n].results;
                                }
                            }
                        }
                        //排版调整
                        let nowData = {};
                        hazardFactorsNow = hazardFactorsNow.replaceAll("|","、");
                        hazardFactorsNow = (hazardFactorsNow && hazardFactorsNow.indexOf("作业") > -1) ? hazardFactorsNow.replace("作业","") : hazardFactorsNow;
                        if(numberYc != 0){
                            if(numberNyc == 0){
                                /*if(!isUpdateUnit) {//不修改 是川北、大乔
                                    personCount = "人员" + numberAll + "人（" + personCountName + "），经复查"+portfolioProjectName+"，均异常，为" + hazardFactorsNow + "作业职业禁忌证，不宜继续从事" + hazardFactorsNow + "作业的工作，建议调离" + hazardFactorsNow + "工作岗位。";
                                    nowData = {
                                        hazardFactorsName: "本次复查" + hazardFactorsNow,
                                        personCount: personCount,
                                    }
                                }else{
                                    nowData = {
                                        hazardFactorsName: "本次复查" + hazardFactorsNow,
                                        personCount: personCount,
                                        personResults: personResult,
                                    }
                                }*/
                                nowData = {
                                    hazardFactorsName: "本次复查" + hazardFactorsNow + "作业",
                                    personCount: personCount,
                                    personResults: personResult,
                                }
                            }else {
                                let otherPersonResults = "";
                                let numberNycNumber = "";
                                if(numberAll != 1){
                                    numberNycNumber = "均";
                                }
                                if(workStateNameNow){
                                    if(workStateNameNow.indexOf("岗前") > -1){
                                        otherPersonResults = "人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可从事接触"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                    }else if(workStateNameNow.indexOf("在岗") > -1){
                                        otherPersonResults = "人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可继续原接触"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                    }else if(workStateNameNow.indexOf("离岗时") > -1){
                                        otherPersonResults = "人，"+numberNycNumber+"未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                                    }else if(workStateNameNow.indexOf("离岗后") > -1){
                                        otherPersonResults = "人，"+numberNycNumber+"未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                                    }else if(workStateNameNow.indexOf("应急") > -1){
                                        otherPersonResults = "人，"+numberNycNumber+"未见" + hazardFactorsNow + "作业职业禁忌证，可继续从事"+ hazardFactorsNow +"作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                    }
                                }
                                nowData = {
                                    hazardFactorsName: "本次复查" + hazardFactorsNow + "作业",
                                    personCount: personCount,
                                    personResults: personResult,
                                    // otherPersonResults: '\n' + "    其余"+numberNyc+"人，均正常，可继续原"+ hazardFactorsNow +"作业的工作。加强个人劳动防护，定期参加职业健康检查。",
                                    otherPersonResults: '\n' + "    其余"+numberNyc+otherPersonResults,
                                }
                            }
                        }else if(numberAll !=0){
                            if(!portfolioProjectName && portfolioProjectName == ""){
                                portfolioProjectName = templateData.groupDatasName.replace("。","");
                            }
                            let otherPersonResults = "";
                            let numberNycNumber = "";
                            if(numberAll != 1){
                                numberNycNumber = "均";
                            }
                            if(workStateNameNow) {
                                if (workStateNameNow.indexOf("岗前") > -1) {
                                    otherPersonResults = "人，经复查" + portfolioProjectName + "，" + numberNycNumber + "未见" + hazardFactorsNow + "作业职业禁忌证，可从事接触" + hazardFactorsNow + "作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                } else if (workStateNameNow.indexOf("在岗") > -1) {
                                    otherPersonResults = "人，经复查" + portfolioProjectName + "，" + numberNycNumber + "未见" + hazardFactorsNow + "作业职业禁忌证，可继续原接触" + hazardFactorsNow + "作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                } else if (workStateNameNow.indexOf("离岗时") > -1) {
                                    otherPersonResults = "人，经复查" + portfolioProjectName + "，" + numberNycNumber + "未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                                } else if (workStateNameNow.indexOf("离岗后") > -1) {
                                    otherPersonResults = "人，经复查" + portfolioProjectName + "，" + numberNycNumber + "未发现" + hazardFactorsNow + "作业疑似职业病，可以离岗。";
                                } else if (workStateNameNow.indexOf("应急") > -1) {
                                    otherPersonResults = "人，经复查" + portfolioProjectName + "，" + numberNycNumber + "未见" + hazardFactorsNow + "作业职业禁忌证，可继续从事" + hazardFactorsNow + "作业的工作；加强个人劳动防护，定期参加职业健康检查。";
                                }
                            }
                            nowData = {
                                hazardFactorsName: "本次复查" + hazardFactorsNow + "作业",
                                // personCount: "人员" + numberAll + "人，经复查"+portfolioProjectName+"，均正常，可继续原"+hazardFactorsNow+"作业的工作；加强个人劳动防护，定期参加职业健康检查。",
                                personCount: "人员" + numberAll + otherPersonResults,
                            }
                        }
                        resultDatas.push(nowData);
                        //体检类型筛选
                        if(workStateNameNow) {
                            if (workStateNameNow.indexOf("岗前") > -1) {
                                resultDatasGQ.push(nowData);
                            } else if (workStateNameNow.indexOf("在岗") > -1) {
                                resultDatasZG.push(nowData);
                            } else if (workStateNameNow.indexOf("离岗时") > -1) {
                                resultDatasLGS.push(nowData);
                            } else if (workStateNameNow.indexOf("离岗后") > -1) {
                                resultDatasLGH.push(nowData);
                            } else if (workStateNameNow.indexOf("应急") > -1) {
                                resultDatasYJ.push(nowData);
                            }
                        }
                    }
                }

                resultDatasGQ = this.orderNumMethod(resultDatasGQ);
                resultDatasZG = this.orderNumMethod(resultDatasZG);
                resultDatasLGS = this.orderNumMethod(resultDatasLGS);
                resultDatasLGH = this.orderNumMethod(resultDatasLGH);
                resultDatasYJ = this.orderNumMethod(resultDatasYJ);

                templateData.resultDatas = resultDatas;
                //不同体检类型 检查结果数据 录入
                if(resultDatasGQ && resultDatasGQ.length > 0){
                    templateData.nameGQ = "上岗前：";
                    templateData.resultDatasGQ = resultDatasGQ;
                }
                if(resultDatasZG && resultDatasZG.length > 0){
                    templateData.nameZG = "在岗期间：";
                    templateData.resultDatasZG = resultDatasZG;
                }
                if(resultDatasLGS && resultDatasLGS.length > 0){
                    templateData.nameLGS = "离岗时：";
                    templateData.resultDatasLGS = resultDatasLGS;
                }
                if(resultDatasLGH && resultDatasLGH.length > 0){
                    templateData.nameLGH = "离岗后：";
                    templateData.resultDatasLGH = resultDatasLGH;
                }
                if(resultDatasYJ && resultDatasYJ.length > 0){
                    templateData.nameYJ = "应急健康检查：";
                    templateData.resultDatasYJ = resultDatasYJ;
                }
            }

            getTemplatePreviewData({id: this.TTemplateId.id, templateData: JSON.stringify(templateData)}).then(res => {
                this.loading = false;
                if (res && res.success) {
                    this.previewHtml = res.data.replace("template", "div");
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                    this.previewHtmlUrl = url;
                } else {
                    this.loading = false;
                    this.$Message.error('预览请求失败');
                }
            });
        },

        closeModal(val) {
            this.$emit('input', val);
        },
        //数组去重
        removeRepeat(arr) {
            return Array.from(new Set(arr));
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
                this.$Message.error('数据导出失败');
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
        changeFull() {
            this.isFullscreen = !this.isFullscreen;
            let height = document.documentElement.clientHeight;
            let element = document.querySelector(".previewTemplate").querySelector(".ivu-modal-body");
            if (this.isFullscreen) {
                element.style.height = (height - 110) + "px";
            } else {
                element.style.height = (height - 300) + "px";
            }
        },
        //word下载
        downloadTemplateWord() {
            let _this = this;
            let url = "";
            let name = "";
            url = _this.previewHtmlUrl;//单位报告
            name = _this.previewName;
            let fileName = _this.TTemplateId.physicalUnit+ "_"+name+".docx";
            exportWord({url: url}).then(res => {
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
    },
    watch: {
        value(val) {
            this.show = val;
        },
        show(val) {
            if (val) {
                //是否修改单位页面
                if(this.$hospitalName.isUpdateUnitPage){
                    this.isUpdateUnitPage = this.$hospitalName.isUpdateUnitPage;
                }
                if(this.previewName == "单位报告"){
                    this.init();
                }else if(this.previewName == "复查报告"){
                    this.initReview();
                }else if(this.previewName == "单位报告(健康)"){
                    this.initJKTJ();
                }
                // 计算高度
                let height = document.documentElement.clientHeight;
                let element = document.querySelector(".previewTemplate").querySelector(".ivu-modal-body");
                element.style.height = (height - 300) + "px";
                this.modalWidth = (document.documentElement.clientWidth - 400);
                window.onresize = () => {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    element.style.height = (height - 300) + "px";
                    this.modalWidth = (document.documentElement.clientWidth - 400);
                };
            } else {
                this.closeModal(false)
            }
        }
    }
}
</script>

<style lang="less">
.previewTemplate {
    .ivu-modal-body {
        position: relative;
        //height: 70vh;
        background-color: #e8eaec;
        top: 0 !important;
        bottom: 0 !important;
        //height: calc(100% - 110px);
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
