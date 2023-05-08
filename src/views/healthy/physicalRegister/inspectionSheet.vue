<template>
    <Modal title="打印导检单" v-model="modalVisible" :mask-closable="false" class="printSheet" scrollable>
        <Row>
            <Col span="16">
                <Alert class="ivu-alert-right" style="display: flex;">
                    <span>体检导检单</span>
                    <!--          <Button @click="printSheet" type="info" size="small" icon="md-print">打印导检单</Button>-->
                </Alert>
                <div style="height: 70vh;">
                    <!--          <pdf ref="pdf" id="printPdf" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i" v-show="false"></pdf>-->
                    <iframe :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
                    <!--          <pdf ref="pdf" id="printPdf" :src="previewHtmlUrl"></pdf>-->
                </div>
            </Col>
            <Col span="1"></Col>
            <Col span="7">
                <Alert class="ivu-alert-right" style="display: flex;">
                    <span>样本条码</span>
                    <Button @click="printBarcode" type="info" size="small" icon="md-print">打印样本条码</Button>
                </Alert>
                <div style="margin-top: 20px;max-height: 68vh; overflow-y: auto;">
                    <img :src="item" v-for="(item, index) in barcodeList" :key="index">
                </div>
            </Col>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Row>

        <div slot="footer">
            <Button type="text" @click="closeModal(false)">取消</Button>
        </div>
    </Modal>
</template>
<script>
import {getTemplatePreviewData} from '@/api/healthy/tTemplate'
import pdf from 'vue-pdf'
import {getLodop} from "../../../../public/LodopFuncs";
import {generatorBarcode, testNumGeneratorBarcode} from "../../../api/healthy/tGroupPerson";
import printJS from 'print-js';
import {getGroupByOfficeId} from "../../../api/healthy/tDepartResult";
import {userInfo} from "../../../api/index"
import Cookies from "js-cookie";

export default {
    name: "inspectionSheet",
    components: {
        pdf
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        isReviewer: {
            type: Boolean
        },
        passStatus: {
            type: String,
            default: "未登记"
        },
        data: {
            type: Array,
            default: []
        },
        personInfo: {
            type: Object
        },
        projectInfo: {
            type: Array
        },
        orderTotal: {
            type: Number,
            default: 0
        }
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        }
    },
    data() {
        return {
            modalVisible: this.value,
            numPages: [],
            previewHtmlUrl: "",
            barcodeList: [],
            spinShow: false,
            flag: false,
            testNumCode: '',
            inspectionDoctor:''
        }
    },
    methods: {
        generatorCode() {
            this.spinShow = true;
            //当前导检单检查项目
            let projectIds = "";
            if(this.data && this.data.length > 0){
                for(let i = 0;i < this.data.length;i ++){
                    if(projectIds == ""){
                        projectIds += this.data[i].id;
                    }else{
                        projectIds += "," + this.data[i].id;
                    }
                }
            }
            //如果是复查的，需要重新生成条形码和登记码
            generatorBarcode({personId: this.personInfo.id, testNum: this.personInfo.testNum, isReviewer: this.isReviewer,passStatus: this.passStatus,projectIds: projectIds}).then(res => {
                if (res.success) {
                    this.barcodeList = res.data;
                }
            });

            let templateData = {};
            let id = "";
            let goods = [];
            let _this = this;
            //医院全称
            templateData.hospitalName = _this.$hospitalName.name;
            //获取导诊条码
            testNumGeneratorBarcode({personId: this.personInfo.id, testNum: this.personInfo.testNum,isReviewer: this.isReviewer}).then(res => {
                if (res.success) {
                    if (this.physicalType == "从业体检") {
                        this.testNumCode = res.data;
                        id = "52033607b4784d064c7299713da72995";
                        templateData.name = this.personInfo.personName;
                        templateData.sex = this.personInfo.sex;
                        templateData.idCard = _this.personInfo.idCard;
                        templateData.mobile = this.personInfo.mobile;
                        templateData.age = this.personInfo.age;
                        templateData.workStateText = _this.personInfo.workStateText;
                        templateData.groupUnit = _this.personInfo.unitName;
                        if(!templateData.groupUnit){
                            templateData.groupUnit = _this.personInfo.dept;
                        }
                        if(_this.personInfo.avatar){
                            templateData.headImg = _this.personInfo.avatar.replace("data:image/png;base64,", "");
                        }
                        this.inspectionDoctor = JSON.parse(Cookies.get("userInfo"));
                        templateData.nickname = this.inspectionDoctor.nickname;
                        templateData.isMarry = this.personInfo.isMarry;
                        /*影像数据*/
                        let base64img = this.testNumCode;
                        templateData.barCodeImg = base64img;
                        if (this.personInfo.unitName) {
                            templateData.unitName = this.personInfo.unitName;
                        } else {
                            templateData.unitName = "无";
                        }
                        templateData.orderTotal = this.orderTotal;
                        for (let i = 0; i < this.projectInfo.length; i++) {
                            let good = goods.filter(item => item.officeName && item.officeName.trim().toString() == this.projectInfo[i].officeName.trim().toString());
                            if (good && good.length > 0) {
                                good[0].projectName = good[0].projectName + "," + this.projectInfo[i].name;
                            } else {
                                if (_this.$hospitalName.isProjectInfo){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    if (t == 1){
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: "身高,体重,血压",//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }else {
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: this.projectInfo[i].name,//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }
                                }else if (_this.$hospitalName.isProjectInfo==false){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    goods.push({
                                        officeName: this.projectInfo[i].officeName,//科室名
                                        address: this.projectInfo[i].address,//检查地址
                                        projectName: this.projectInfo[i].name,//检查项目名
                                        discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                        t:t,
                                    });
                                }

                            }

                        }
                        goods.sort((a,b)=>{return a.t-b.t})
                        templateData.goods = goods;
                    } else if (this.physicalType == "健康体检") {
                        this.testNumCode = res.data;
                        id = "64eb2b7a369175d862b7a2e9ad0d8db1";
                        templateData.name = _this.personInfo.personName;
                        templateData.sex = _this.personInfo.sex;
                        templateData.idCard = _this.personInfo.idCard;
                        templateData.mobile = _this.personInfo.mobile;
                        templateData.workStateText = _this.personInfo.workStateText;
                        templateData.age = _this.personInfo.age;
                        templateData.groupUnit = _this.personInfo.unitName;
                        if(!templateData.groupUnit){
                            templateData.groupUnit = _this.personInfo.dept;
                        }
                        templateData.hazardFactorsText = _this.personInfo.hazardFactorsText;
                        templateData.orderTotal = _this.orderTotal;
                        if(_this.personInfo.avatar){
                            templateData.headImg = _this.personInfo.avatar.replace("data:image/png;base64,", "");
                        }
                        let base64img = _this.testNumCode;
                        this.inspectionDoctor = JSON.parse(Cookies.get("userInfo"));
                        templateData.nickname = this.inspectionDoctor.nickname;
                        templateData.isMarry = this.personInfo.isMarry;
                        templateData.barCodeImg = base64img;
                        for (let i = 0; i < _this.projectInfo.length; i++) {
                            let good = goods.filter(item => item.officeName && item.officeName.trim().toString() == this.projectInfo[i].officeName.trim().toString());
                            if (good && good.length > 0) {
                                good[0].projectName = good[0].projectName + "," + _this.projectInfo[i].name;
                            } else {
                                if (_this.$hospitalName.isProjectInfo){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    if (t == 1){
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: "身高,体重,血压",//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }else {
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: this.projectInfo[i].name,//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }
                                }else if (_this.$hospitalName.isProjectInfo==false){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    goods.push({
                                        officeName: this.projectInfo[i].officeName,//科室名
                                        address: this.projectInfo[i].address,//检查地址
                                        projectName: this.projectInfo[i].name,//检查项目名
                                        discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                        t:t,
                                    });
                                }

                            }
                        }
                        goods.sort((a,b)=>{return a.t-b.t})
                        templateData.goods = goods;
                    } else if (this.physicalType == "职业体检") {
                        this.testNumCode = res.data;
                        id = "7246f807db9cf83a75750d6762577a19";
                        templateData.name = _this.personInfo.personName;
                        templateData.sex = _this.personInfo.sex;
                        templateData.idCard = _this.personInfo.idCard;
                        templateData.mobile = _this.personInfo.mobile;
                        templateData.workStateText = _this.personInfo.workStateText;
                        templateData.age = _this.personInfo.age;
                        templateData.groupUnit = _this.personInfo.unitName;
                        if(!templateData.groupUnit){
                            templateData.groupUnit = _this.personInfo.dept;
                        }
                     /*   if (_this.personInfo.hazardFactorsText==null||_this.personInfo.hazardFactorsText==undefined){
                            return;
                        }*/
                        templateData.hazardFactorsText = _this.personInfo.hazardFactorsText;
                        templateData.orderTotal = _this.orderTotal;
                        if(_this.personInfo.avatar){
                            templateData.headImg = _this.personInfo.avatar.replace("data:image/png;base64,", "");
                        }
                        this.inspectionDoctor = JSON.parse(Cookies.get("userInfo"));
                        templateData.nickname = this.inspectionDoctor.nickname;
                        let base64img = _this.testNumCode;
                        templateData.barCodeImg = base64img;
                        for (let i = 0; i < _this.projectInfo.length; i++) {
                            let good = goods.filter(item => item.officeName && item.officeName.trim().toString() == this.projectInfo[i].officeName.trim().toString());
                            if (good && good.length > 0) {
                                good[0].projectName = good[0].projectName + "," + _this.projectInfo[i].name;
                            } else {
                                if (_this.$hospitalName.isProjectInfo){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    if (t == 1){
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: "身高,体重,血压",//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }else {
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: this.projectInfo[i].name,//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }
                                }else if (_this.$hospitalName.isProjectInfo==false){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    goods.push({
                                        officeName: this.projectInfo[i].officeName,//科室名
                                        address: this.projectInfo[i].address,//检查地址
                                        projectName: this.projectInfo[i].name,//检查项目名
                                        discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                        t:t,
                                    });
                                }


                            }
                        }
                        goods.sort((a,b)=>{return a.t-b.t})
                        templateData.goods = goods;
                    } else if (this.physicalType == "放射体检") {
                        this.testNumCode = res.data;
                        id = "59d8b693e5e8f7128b1f336bdff02e2f";
                        templateData.name = _this.personInfo.personName;
                        templateData.sex = _this.personInfo.sex;
                        templateData.idCard = _this.personInfo.idCard;
                        templateData.mobile = _this.personInfo.mobile;
                        templateData.workStateText = _this.personInfo.workStateText;
                        templateData.age = _this.personInfo.age;
                        templateData.groupUnit = _this.personInfo.unitName;
                        if(!templateData.groupUnit){
                            templateData.groupUnit = _this.personInfo.dept;
                        }
           /*             if (_this.personInfo.hazardFactorsText==null||_this.personInfo.hazardFactorsText==undefined){
                            return;
                        }*/
                        templateData.hazardFactorsText = _this.personInfo.hazardFactorsText;
                        templateData.orderTotal = _this.orderTotal;
                        if(_this.personInfo.avatar){
                            templateData.headImg = _this.personInfo.avatar.replace("data:image/png;base64,", "");
                        }
                        let base64img = _this.testNumCode;
                        this.inspectionDoctor = JSON.parse(Cookies.get("userInfo"));
                        templateData.nickname = this.inspectionDoctor.nickname;
                        templateData.barCodeImg = base64img;
                        for (let i = 0; i < _this.projectInfo.length; i++) {
                            let good = goods.filter(item => item.officeName && item.officeName.trim().toString() == this.projectInfo[i].officeName.trim().toString());
                            if (good && good.length > 0) {
                                good[0].projectName = good[0].projectName + "," + _this.projectInfo[i].name;
                            } else {
                                if (_this.$hospitalName.isProjectInfo){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    if (t == 1){
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: "身高,体重,血压",//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }else {
                                        goods.push({
                                            officeName: this.projectInfo[i].officeName,//科室名
                                            address: this.projectInfo[i].address,//检查地址
                                            projectName: this.projectInfo[i].name,//检查项目名
                                            discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                            t:t,
                                        });
                                    }
                                }else if (_this.$hospitalName.isProjectInfo==false){
                                    let t = this.officeSort(this.projectInfo[i]);
                                    goods.push({
                                        officeName: this.projectInfo[i].officeName,//科室名
                                        address: this.projectInfo[i].address,//检查地址
                                        projectName: this.projectInfo[i].name,//检查项目名
                                        discountPrice: this.projectInfo[i].discountPrice,//检查项目费用
                                        t:t,
                                    });
                                }

                            }
                        }
                        goods.sort((a,b)=>{return a.t-b.t})
                        templateData.goods = goods;
                    }
                    getTemplatePreviewData({id: id, templateData: JSON.stringify(templateData)}).then(res => {
                        if (res && res.success) {

                            this.previewHtml = res.data.replace("template", "div");
                            let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                            this.previewHtmlUrl = url;
                        } else {
                            this.$Message.error('预览请求失败');
                        }
                    }).finally(() => {
                        this.spinShow = false;
                    });
                }
                else{
					this.spinShow = false;
                }
            })
        },
        closeModal(val) {
            this.$emit('input', val);
            if (this.flag) {
                this.$emit('handleSearch');
            }
        },
        printBarcode() {
            let LODOP = getLodop();
            LODOP.PRINT_INIT("条码打印");//打印初始化
            LODOP.SET_PRINTER_INDEX("Deli DL-720C");//打印初始化
            if(this.$hospitalName && this.$hospitalName.liscode){
				LODOP.SET_PRINT_PAGESIZE(0, "500", "300", "");//设定纸张大小
            }
            else{
				LODOP.SET_PRINT_PAGESIZE(0, "400", "300", "");//设定纸张大小
            }

            for (let i = 0; i < this.barcodeList.length; i++) {
				if(this.$hospitalName && this.$hospitalName.liscode){
					LODOP.ADD_PRINT_IMAGE(20, -15, '100%', '100%', this.barcodeList[i]);
				}
				else{
					LODOP.ADD_PRINT_IMAGE(20, -15, '100%', '100%', this.barcodeList[i]);
				}
                if (i + 1 != this.barcodeList.length) {
                    LODOP.NEWPAGE(); //分页
                }
            }
            LODOP.PREVIEW();   //预览打印
            //LODOP.PRINT(); //直接打印
            this.flag = true;
        },
        printSheet() {
            let dev = document.getElementById('printPdf');
            dev.style.marginLeft = '0px';
            printJS({
                printable: 'printPdf',
                type: 'html',
                ignoreElements: [],
                targetStyles: ['*']
            });
            dev.style.margin = 'auto';
        },
        officeSort(projectInfo){
            let t=10
            if(projectInfo.officeName.trim().toString()=="一般检查"){
                t=1;
            }else if(projectInfo.officeName.trim().toString()=="内科"){
                t=2;
            }else if(projectInfo.officeName.trim().toString()=="外科"){
                t=3;
            }else if(projectInfo.officeName.trim().toString()=="五官科"){
                t=4;
            }else if(projectInfo.officeName.trim().toString()=="妇科"){
                t=5;
            }else if(projectInfo.officeName.trim().toString()=="检验科"){
                t=6;
            }else if(projectInfo.officeName.trim().toString()=="心电图"){
                t=7;
            }else if(projectInfo.officeName.trim().toString()=="彩超室"){
                t=8;
            }else if(projectInfo.officeName.trim().toString()=="CT室"){
                t=9;
            }
            return t;
        }
    }
    ,
    watch: {
        value(val) {
            this.modalVisible = val;
        }
        ,
        modalVisible(val) {
            if (val) {
                this.flag = false;
                this.generatorCode();
            } else {
                this.closeModal(val);
            }
        }
    }
}
</script>

<style lang="less">
.printSheet {
    .ivu-modal {
        width: 80vw !important;

        .ivu-modal-body {
            position: relative;
        }
    }

    .ivu-alert-right {
        padding: 8px;
        font-weight: bold;
        height: 25px;
        line-height: 25px;
        box-sizing: content-box;
        font-size: 15px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        margin-bottom: 0 !important;

        .ivu-alert-message {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
