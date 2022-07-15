<template>
    <Modal v-model="show" title="附件上传" :mask-closable="false" :draggable="false" class="looktTSubstances"
           width="900">
        <div style="width: 100%;height: 100%">
            <Table :loading="loading" border :columns="columns" sortable="custom" :data="tableData"
                   style="width: 100%;height: auto;" max-height="450" ref="table">
                <template slot-scope="{ row, index }" slot="fileName">
                    <div v-if="row && row.id==1" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        <Tooltip :transfer="true" style="width: 100%;z-index: 1288;" max-width="300" :content="pathEvaluate ? pathEvaluate : '还未上传'">
                            <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{pathEvaluate ? pathEvaluate : '还未上传'}}</div>
                        </Tooltip>
                    </div>
                    <div v-if="row && row.id==2" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        <Tooltip :transfer="true" style="width: 100%;z-index: 1288;" max-width="300" :content="pathLicense ? pathLicense : '还未上传'">
                            <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{pathLicense ? pathLicense : '还未上传'}}</div>
                        </Tooltip>
                    </div>
                    <div v-if="row && row.id==3" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                        <Tooltip :transfer="true" style="width: 100%;z-index: 1288;" max-width="300" :content="path ? path : '还未上传'">
                            <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{path ? path : '还未上传'}}</div>
                        </Tooltip>
                    </div>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <div style="display:flex;flex-direction:row;justify-content:center;">
                        <Upload style="width: 68px;margin-top: 0.8vh;margin-left: 5px;"
                                type="drag"
                                :show-upload-list="false"
                                name="file"
                                accept=".pdf"
                                :format="fileTypeArr"
                                :on-success="row.id==1 ? uploadSuccessEvaluate : row.id==2 ? uploadSuccessLicense : row.id==3 ? uploadSuccess : uploadSuccess"
                                :data="data"
                                :action="row.id==1 ? apiEvaluate : row.id==2 ? apiLicense : row.id==3 ? api : api"
                                :headers="upHeaders"
                                :before-upload="row.id==1 ? handleUploadEvaluate : row.id==2 ? handleUploadLicense : row.id==3 ? handleUpload : handleUpload"
                                ref="upload">
                            <Button type="info" style="width:100%;heigth:100%;" size="small" icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                        <Button type="primary" style="width: 68px;margin-top: 0.8vh;margin-bottom: 0.8vh;margin-left: 5px;" icon="ios-eye-outline" size="small"
                                @click="showPreviewFileMethod(row.id)">预览</Button>
                    </div>
                </template>
            </Table>
        </div>
        <!--评价上传orderEvaluatePath-->
        <!--<div>近期职业病危害因素检测报告或评价报告</div>
        <Upload
                type="drag"
                name="file"
                accept=".pdf"
                :format="fileTypeArr"
                :on-success="uploadSuccessEvaluate"
                :data="data"
                :action="apiEvaluate"
                :headers="upHeaders"
                :before-upload="handleUploadEvaluate"
                ref="uploadEvaluate">
            <div style="padding: 20px 0" v-if="!pathEvaluate && pathEvaluate.trim().length==0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>请选择上传的文件</p>
            </div>
            <div style="padding: 20px 0" v-else>
                {{pathEvaluate}}
            </div>
        </Upload>
        <div style="color: red;font-weight: bold;margin-bottom: 10px;">
            <p>提示：</p>
            <p>1.上传报告的文件类型只能为"pdf"</p>
        </div>-->
        <!--执照上传orderLicensePath-->
        <!--<div>营业执照（三证合一）</div>
        <Upload
                type="drag"
                name="file"
                accept=".pdf"
                :format="fileTypeArr"
                :on-success="uploadSuccessLicense"
                :data="data"
                :action="apiLicense"
                :headers="upHeaders"
                :before-upload="handleUploadLicense"
                ref="uploadLicense">
            <div style="padding: 20px 0" v-if="!pathLicense && pathLicense.trim().length==0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>请选择上传的文件</p>
            </div>
            <div style="padding: 20px 0" v-else>
                {{pathLicense}}
            </div>
        </Upload>
        <div style="color: red;font-weight: bold;margin-bottom: 10px;">
            <p>提示：</p>
            <p>1.营业执照需要盖章上传，否则无效</p>
            <p>2.上传证件的文件类型只能为"pdf"</p>
        </div>-->
        <!--协议上传-->
        <!--<div>合同（委托书）</div>
        <Upload
            type="drag"
            name="file"
            accept=".pdf"
            :format="fileTypeArr"
            :on-success="uploadSuccess"
            :data="data"
            :action="api"
            :headers="upHeaders"
            :before-upload="handleUpload"
            ref="upload">
            <div style="padding: 20px 0" v-if="!path && path.trim().length==0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>请选择上传的文件</p>
            </div>
            <div style="padding: 20px 0" v-else>
                {{path}}
            </div>
        </Upload>
        <div style="color: red;font-weight: bold;">
            <p>提示：</p>
            <p>1.请先下载委托协议，打印签订后再上传</p>
            <p>2.上传合同的文件类型只能为"pdf"</p>
        </div>-->

        <div slot="footer">
            <!--            <Button type="primary" @click="show=false">关闭</Button>-->
            <Button type="text" @click="show=false">取消</Button>
            <!--            <Button type="primary" @click="handelSubmit">确定</Button>-->
            <!--            <Button type="primary" @click="closeAllModal">关闭</Button>-->
            <!--            <Button type="primary" :loading="loading" @click="init()">下载</Button>-->
        </div>
        <previewFile v-model="showPreviewFile"
                     :url="url"></previewFile>
    </Modal>
</template>
<script>
    import {base_Url} from '@/libs/axios'
    import {getStore} from '@/libs/storage';
    import {getTemplatePreviewData,exportWord,getEntrustData} from '@/api/healthy/tTemplate'
    import {formartDate} from "../../../api/tools/tool";
    import {uploadorderFile} from '@/api/healthy/tGroupOrder'
    import previewFile from "./previewFile";
    import ChoosePortfolioProject from "./choosePortfolioProject";

    export default {
        name: "ExcelUpload",
        components: {
            previewFile
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            orderId: {
                type: String,
                default: ""
            },
            groupOrderInfo: {
                type: Object,
                default: {}
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            }
        },
        data() {
            return {
                showPreviewFile: false,
                url:"",
                columns: [
                    {
                        title: '附件类型',
                        key: 'fileType',
                        minWidth: 90,
                        ellipsis: true,
                        tooltip: true,
                        sortable: false,
                        align: 'center',
                    },
                    {
                        title: '提示',
                        key: 'tips',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        sortable: false,
                        align: 'center',
                    },
                    {
                        title: '附件内容',
                        // key: 'fileName',
                        slot: 'fileName',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        sortable: false,
                        align: 'center',
                        /*render: (h, params) => {
                            let fileNameData = params.row.fileName;
                            if(!fileNameData || fileNameData.trim().length==0){
                                fileNameData = "暂未上传";
                            }
                            return h('Tooltip', {
                                props: {
                                    content: fileNameData,
                                    placement: 'bottom',
                                    transfer: true
                                }
                            }, fileNameData);
                        }*/
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 180,
                        align: 'center'
                    }
                ],
                tableData: [
                    {
                        id: 1,
                        fileType: '近期职业病危害因素检测报告或评价报告',
                        tips: '上传报告的文件类型只能为pdf',
                        fileName: ''
                    },
                    {
                        id: 2,
                        fileType: '营业执照（三证合一）',
                        tips: '营业执照需要盖章上传，否则无效;上传证件的文件类型只能为pdf',
                        fileName: ''
                    },
                    {
                        id: 3,
                        fileType: '合同（委托书）',
                        tips: '请先下载委托协议，打印签订后再上传;上传合同的文件类型只能为pdf',
                        fileName: ''
                    }
                ],

                fileEvaluate:null,
                fileLicense:null,
                file:null,
                pathEvaluate:"",
                pathLicense:"",
                path:"",
                previewHtmlUrl: '',
                contentStr: [],
                fileTypeArr: ["pdf"],//文件类型
                show: this.value,//是否显示
                editTitle: this.modalTitle,//标题
                loading: true,
                api: this.getApi(),
                apiLicense: this.getApiLicense(),
                apiEvaluate: this.getApiEvaluate(),
                upHeaders: {
                    "User-Type": 'Gov_User',
                    "accessToken": getStore("accessToken")
                },
                data: {},
            }
        },
        methods: {
            showPreviewFileMethod(id){
                if(id){
                    /*if(id == 1){
                        this.url = this.pathEvaluate;
                    }else if(id == 2){
                        this.url = this.pathLicense;
                    }else if(id == 3){
                        this.url = this.path;
                    }*/
                    this.url = "";
                    if(id == 1){
                        if(this.pathEvaluate && this.pathEvaluate.trim().length>0){
                            this.url = this.pathEvaluate;
                            this.showPreviewFile = true;
                        }else{
                            this.$Message.info('评价报告暂未上传！');
                        }
                    }else if(id == 2){
                        if(this.pathLicense && this.pathLicense.trim().length>0){
                            this.url = this.pathLicense;
                            this.showPreviewFile = true;
                        }else{
                            this.$Message.info('营业执照暂未上传！');
                        }
                    }else if(id == 3){
                        if(this.path && this.path.trim().length>0){
                            this.url = this.path;
                            this.showPreviewFile = true;
                        }else{
                            this.$Message.info('委托协议暂未上传！');
                        }
                    }
                    /*if(id == 1){
                        if(this.groupOrderInfo.orderEvaluatePath && this.groupOrderInfo.orderEvaluatePath.trim().length>0){
                            this.url = this.groupOrderInfo.orderEvaluatePath;
                            this.showPreviewFile = true;
                        }else{
                            this.$Message.info('评价报告暂未上传！');
                        }
                    }else if(id == 2){
                        if(this.groupOrderInfo.orderLicensePath && this.groupOrderInfo.orderLicensePath.trim().length>0){
                            this.url = this.groupOrderInfo.orderLicensePath;
                            this.showPreviewFile = true;
                        }else{
                            this.$Message.info('营业执照暂未上传！');
                        }
                    }else if(id == 3){
                        if(this.groupOrderInfo.orderPath && this.groupOrderInfo.orderPath.trim().length>0){
                            this.url = this.groupOrderInfo.orderPath;
                            this.showPreviewFile = true;
                        }else{
                            this.$Message.info('委托协议暂未上传！');
                        }
                    }*/
                }
            },
            handEdit(row, index) {
                // this.title = '编辑';
                // this.TdTjBhkId = row.id.toString();
                // this.updateShow = true;
            },
            getApi() {
                return base_Url + '/tGroupOrder/uploadContracts?orderId=' + this.orderId + '&name=协议';
            },
            getApiLicense() {
                return base_Url + '/tGroupOrder/uploadContracts?orderId=' + this.orderId + '&name=执照';
            },
            getApiEvaluate() {
                return base_Url + '/tGroupOrder/uploadContracts?orderId=' + this.orderId + '&name=评价';
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            handleUpload(file) {
                return true;
                // this.file = file;
                // this.path = file.name;
                // this.$Message.success('选择成功');
                // //不自动上传
                // return false ;
            },
            handleUploadLicense(file) {
                return true;
                // this.fileLicense = file;
                // this.pathLicense = file.name;
                // this.$Message.success('选择成功');
                // //不自动上传
                // return false ;
            },
            handleUploadEvaluate(file) {
                return true;
                // this.fileEvaluate = file;
                // this.pathEvaluate = file.name;
                // this.$Message.success('选择成功');
                // //不自动上传
                // return false ;
            },
            //确定上传附件
            handelSubmit(){
                let formData = new FormData();
                if(this.file!=null&&this.path.trim().length>0){
                    formData.append("file", this.file);
                }
                if(this.fileLicense!=null&&this.pathLicense.trim().length>0){
                    formData.append("fileLicense", this.fileLicense);
                }
                if(this.fileEvaluate!=null&&this.pathEvaluate.trim().length>0){
                    formData.append("fileEvaluate", this.fileEvaluate);
                }
                formData.append("groupOrderInfo", JSON.stringify( this.groupOrderInfo));
                uploadorderFile(formData).then(res => {
                    if (res.success) {
                        this.closeAllModal();
                        this.$Message.success('保存成功');
                    } else {
                        this.$Message.error(res.msg);
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success("上传成功");
                    this.path = response.msg;
                    // this.closeAllModal();
                } else {
                    this.$Message.error(response.msg);
                }
            },
            uploadSuccessLicense(response, file, fileList) {
                if (response.success) {
                    this.$Message.success("上传成功");
                    this.pathLicense = response.msg;
                    // this.closeAllModal();
                } else {
                    this.$Message.error(response.msg);
                }
            },
            uploadSuccessEvaluate(response, file, fileList) {
                if (response.success) {
                    this.$Message.success("上传成功");
                    this.pathEvaluate = response.msg;
                    // this.closeAllModal();
                } else {
                    this.$Message.error(response.msg);
                }
            },
            closeAllModal() {//关闭
                this.closeModal(false);
                this.$emit('handleSearch');//上传完毕后再重新渲染表格
            },
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
                        // this.loading = false;
                        if (res && res.success) {
                            this.previewHtml = res.data.replace("template", "div");
                            let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + this.previewHtml;
                            this.previewHtmlUrl = url;
                        } else {
                            this.$Message.error('模板生成请求失败');
                            this.closeModal();
                        }
                    }).finally(() => {
                        // this.loading = false;
                        this.downloadTemplateWord()
                    });
                })
            },
            //word下载
            downloadTemplateWord() {
                let hospitalName = "";
                if(this.$hospitalName && this.$hospitalName.name){
                    hospitalName = this.$hospitalName.name;
                }
                let _this = this;
                // _this.loading = true;
                let url = "";
                let name = "";
                url = this.previewHtmlUrl;//合同模板
                name = "委托协议";
                let fileName = hospitalName+ "_"+name+".docx";
                exportWord({url: url}).then(res => {
                    let content = res;
                    let blob = new Blob([content], {type: 'application/ms-excel'});
                    _this.loading = false;
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
                this.loading = false;
                this.editTitle = this.modalTitle;
                this.api = this.getApi();
                this.apiLicense = this.getApiLicense();
                this.apiEvaluate = this.getApiEvaluate();
                if(this.groupOrderInfo){
                    if(this.groupOrderInfo.orderPath){
                        this.path = this.groupOrderInfo.orderPath;
                    }
                    if(this.groupOrderInfo.orderEvaluatePath) {
                        this.pathEvaluate = this.groupOrderInfo.orderEvaluatePath;
                    }
                    if(this.groupOrderInfo.orderLicensePath) {
                        this.pathLicense = this.groupOrderInfo.orderLicensePath;
                    }
                    /*if(this.groupOrderInfo.orderPath){
                        let split = this.groupOrderInfo.orderPath.split("/");
                        let path = split[split.length-1];
                        this.path = path;
                    }
                    if(this.groupOrderInfo.orderEvaluatePath) {
                        let split = this.groupOrderInfo.orderEvaluatePath.split("/");
                        let path = split[split.length-1];
                        this.pathEvaluate = path;
                    }
                    if(this.groupOrderInfo.orderLicensePath) {
                        let split = this.groupOrderInfo.orderLicensePath.split("/");
                        let path = split[split.length-1];
                        this.pathLicense = path;
                    }*/
                }
                if (!val) {
                    this.closeModal(val);
                    // this.closeAllModal();
                    this.fileEvaluate = null;
                    this.fileLicense = null;
                    this.file = null;
                    this.pathEvaluate = "";
                    this.pathLicense = "";
                    this.path = "";
                    this.$refs.upload.clearFiles();//清空已上传的文件列表
                    // this.$refs.uploadEvaluate.clearFiles();//清空已上传的文件列表
                    // this.$refs.uploadLicense.clearFiles();//清空已上传的文件列表
                }
            }
        },
        created() {
            this.height = Math.floor(document.body.scrollHeight * 0.95) + "px";
            this.width = Math.floor(document.body.scrollWidth * 0.95) + "px";
        },
    }
</script>
<style lang="less">
    .looktTSubstances {
        position: relative;
        width: 100%;
        height: 100%;

        .ivu-modal {
            width: 50vw !important;
            /* width: auto; */
            margin: 0 auto;
            position: relative;
            outline: 0;
            top: 100px;
            min-width: 500px;
        }


    }
</style>