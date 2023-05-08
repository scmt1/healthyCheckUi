<style lang="less">
    .tCertificateManageList {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;

        .card {
            height: calc(100vh - 60px - 40px - 80px);
            border-top-left-radius: 0;
            border-top-right-radius: 0;

            .radio-group {
                width: 100%;

                .row-border {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                }

                .radio-group-radio {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .ivu-radio-group-item {
                        font-size: 0;
                    }
                }

                .radio-group-content {

                    .date {
                        color: #000;
                        font-size: 13px;
                    }

                    .border-blue {
                        border: 1px solid #0000FF;
                        border-radius: 8px;
                        text-align: center;
                        color: #0000FF;
                    }

                    .bg-green {
                        background-color: #42C3AF;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                    }

                    .bg-audit {
                        background-color: #ff9900;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                    }

                    .bg-refute {
                        background-color: #ed4014;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                    }

                    .bg-deflate {
                        background-color: #2db7f5;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                    }

                    .company {
                        color: #000;
                        font-size: 13px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }

        .ivu-card-body {
            padding: 16px;
            height: 100%;
        }
    }
</style>
<template>
    <div class="tCertificateManageList">
        <Row :gutter="4" style="flex-wrap: nowrap;">
            <Col span="16">
                <Alert class="alert">证件列表</Alert>
                <Card>
                    <Row v-show="openSearch">
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70"
                              @keydown.enter.native="handSearch">
                            <Form-item label="编号">
                                <Input v-model="searchForm.code" placeholder="请输入编号"></Input>
                            </Form-item>
                            <Form-item label="姓名">
                                <Input v-model="searchForm.name" placeholder="请输入姓名"></Input>
                            </Form-item>
                            <Form-item label="性别" v-if="drop">
                                <Select v-model="searchForm.sex" label-in-value placeholder="请选择" style="width: 186px;"
                                        clearable>
                                    <Option v-for="item in sexArray" :value="item.value" :key="item.id">
                                        {{ item.value }}
                                    </Option>
                                </Select>
                            </Form-item>
                            <Form-item label="年龄" v-if="drop">
                                <Input v-model="searchForm.age" placeholder="请输入年龄"></Input>
                            </Form-item>
                            <Form-item label="打印状态" v-if="drop">
                                <Select v-model="searchForm.printState" label-in-value placeholder="请选择"
                                        style="width: 186px;"
                                        clearable>
                                    <Option :value="1" :key="1">已打印</Option>
                                    <Option :value="0" :key="0">未打印</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="登记时间" v-if="drop">
                                <DatePicker v-model="registDate" @on-change="registDateChange"
                                            transfer :clearable="false" placeholder="请选择"
                                            style="width: 186px;"
                                            type="daterange"></DatePicker>
                            </Form-item>
                            <Form-item label="上传状态" v-if="drop">
                                <Select v-model="searchForm.isUpload" label-in-value placeholder="请选择"
                                        style="width: 186px;"
                                        clearable>
                                    <Option :value="0" :key="0">未上传</Option>
                                    <Option :value="1" :key="1">上传成功</Option>
                                    <Option :value="2" :key="2">上传失败</Option>
                                </Select>
                            </Form-item>
                            <Form-item style="margin-left:-35px" class="br">
                                <Button @click="handSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handReset">重置</Button>
                                <a class="drop-down" @click="dropDown">
                                    {{dropDownContent}}
                                    <Icon :type="dropDownIcon"></Icon>
                                </a>
                            </Form-item>
                        </Form>
                    </Row>
                    <div class="operation">
                        <!--						<Button @click="addTCertificateManage" type="primary" icon="md-add">新增</Button>-->
                        <Button @click="printInfoAll" type="primary" icon="ios-cloud-upload">批量打印</Button>
                        <Button @click="updateAll" type="primary" icon="ios-print-outline">批量打印确认</Button>
                        <Button v-if="employmentUpload" @click="batchUpload" type="primary" icon="ios-print-outline">批量上传</Button>
                    </div>
                    <div>
                        <Table @on-row-click="tableClick" :loading="loading" border :columns="columns" sortable="custom"
                               :data="data"
                               @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table">
                            <template #action="{ row, index }">
                                <Button type="primary" size="small" style="margin-right: 5px"
                                        @click="confirmation(row,index)">打印确认
                                </Button>
                                <Button type="primary" size="small" style="margin-right: 5px"
                                        @click="iviewShow(row,index)">
                                    <Icon type="ios-eye-outline"/>
                                    查看异常
                                </Button>
                            </template>
                        </Table>
                    </div>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                              size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
            <Col span="8">
                <Alert class="alert">健康证</Alert>
                <Card class="card">
                    <div style="width: 100%; height: 100%;font-size: 15px;color: #000000;text-align: center;display: flex;flex-direction: column;justify-content: center;"
                         v-if="templateShow == false">
                        暂无数据
                    </div>
                    <div style="width: 100%; height: 100%" v-else>
                        <iframe ref="iframeMain" :src="previewHtmlUrl" v-show="!aliLoading" frameborder="0"
                                style="width: 100%; height: 100%"></iframe>
                    </div>
                </Card>
            </Col>
        </Row>
        <!-- loading -->
        <Spin fix v-show="aliLoading">
            <div class="demo-spin-icon-load">
                <!-- 这里用的是阿里图标库 -->
                <i class="iconfont icon-loader--line"></i>
            </div>
            <!-- <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon> -->
            <div style='font-size:16px'>Loading...</div>
        </Spin>

        <updateTCertificateManage v-model="updateShow" :TCertificateManageId="TCertificateManageId" :modalTitle="title"
                                  v-on:handSearch="handSearch"></updateTCertificateManage>
        <tCertificateManageListShow v-model="viewShow" :TCertificateManageId="TCertificateManageId"
                                    :modalTitle="title"></tCertificateManageListShow>
    </div>
</template>
<script>
    import {
        deleteTCertificateManage,
        queryTCertificateManageList,
        getTCertificateManage,
        queryTCertificateManageAll,
    } from '@/api/healthy/tCertificateManage'
    import {formartDate} from '@/api/tools/tool'
    import updateTCertificateManage from './updateTCertificateManage'
    import tCertificateManageListShow from './tCertificateManageListShow.vue'
    import {
        getTemplatePreviewHealthyData,
        generatePhysicalExaminationReport,
        generateWordReport,
        generateWordReportHealthy
    } from '@/api/healthy/tTemplate'
    import pdf from "vue-pdf";
    import {
        getTestNumGeneratorBarcode,
        testNumGeneratorBarcode,
        testNumGeneratorBarcodeByIdCard,
        updatetGroupPersonNewspaper
    } from "../../../api/healthy/tGroupPerson";
    import {updateTPrintStateById} from "@/api/healthy/tGroupPerson";
    import {uploadEmployeeInfo} from '@/api/healthy/professionalUpload'

    export default {
        components: {
            updateTCertificateManage,
            tCertificateManageListShow
        },
        data() {
            return {
                employmentUpload:this.$hospitalName.employmentUpload,//批量上传按钮
                registDate: null,//登记时间
                previewData: [],//模板数据
                templateData: {},//健康证信息
                TTemplateId: '55f5fb35e0eba36bb2293e0f3a98f483',//模板id
                previewHtmlUrl: "",//pdf地址
                aliLoading: false,//加载条
                templateShow: true,//模板展示
                numPages: null, // pdf 总页数
                pdfPaths: [],//pdf合并路径
                timer: null,//定时器
                printDatasNum: 0,//
                sexArray: [{
                    id: '1',
                    value: '男',
                }, {
                    id: '2',
                    value: '女',
                }],//性别选择

                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                search: '',
                data: [],
                columns: this.getTCertificateManageColumns(),
                openSearch: true,//打开搜索
                openTip: true,//打开提示
                loading: true, // 表单加载状态
                selectCount: 0, // 多选计数
                selectList: [], // 多选数据
                searchForm: {
                    // 搜索框对应data对象
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    startDate: null,//开始时间
                    endDate: null,//结束时间
                    sort: 'createTime', // 默认排序字段
                    order: 'desc', // 默认排序方式
                    //搜索栏
                    code: '',//编号
                    name: '',//姓名
                    sex: '',//性别
                    age: '',//年龄
                    printState: '',//打印状态
                    isUpload:''//伤处状态
                },
                total: 0,
                title: '',
                TCertificateManageId: '',
                updateShow: false,
                viewShow: false,
                tableHeight: 200,
                colOptions: [
                    "编号", "姓名", "性别", "年龄", "有效期", "发证单位", "操作"],
                colSelect: [
                    "编号", "姓名", "性别", "年龄", "有效期", "发证单位", "操作"],
            }
        },
        methods: {
            //体检日期改变
            registDateChange(v) {
                if (v) {
                    this.searchForm.startDate = v[0];
                    this.searchForm.endDate = v[1];
                    if (this.searchForm.startDate) {
                        this.searchForm.startDate = "" + this.searchForm.startDate + " 00:00:00";
                    }
                    if (this.searchForm.endDate) {
                        this.searchForm.endDate = "" + this.searchForm.endDate + " 23:59:59";
                    }
                }
            },

            //批量打印确认
            updateAll() {
                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要网报的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要网报所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.selectList.forEach(function (e) {
                            ids.push(e.personId);
                        });
                        this.confirmPrintSelect(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //批量上传
            batchUpload() {
                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要上传的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认上传',
                    content: '您确认要上传所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.selectList.forEach(function (e) {
                            ids.push(e.personId);
                        });
                        this.batchUploadSelect(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },

            //批量上传后台
            batchUploadSelect(ids) {
                if (ids == undefined || ids == null || ids.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                uploadEmployeeInfo({ids:ids}).then(res => {
                    this.$Modal.remove();
                    if (res && res.success) {
                        this.modalTaskVisible = false;
                        this.$Message.success('调用接口成功');
                        this.getDataList();
                    }
                    else {
                        this.$Message.error('上传失败');
                        this.getDataList();
                    }
                });
            },
            //查看异常信息
            iviewShow(row, index) {
                this.viewShow = true;
                this.TCertificateManageId = row.id.toString();
                this.title = "异常信息"
            },
            //打印确认
            confirmation(row, index) {
                if (row.printState == 1) {
                    this.$Message.error('当前人员已打印确认');
                    return;
                }
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要确认打印所点击选的数据?",
                    onOk: () => {
                        let ids = [];
                        ids.push(row.personId);
                        this.confirmPrintSelect(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    },
                });
            },


            //打印确认（后台）
            confirmPrintSelect(ids) {
                if (ids == undefined || ids == null || ids.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                updateTPrintStateById(ids).then(res => {
                    this.$Modal.remove();
                    if (res && res.success) {
                        this.modalTaskVisible = false;
                        this.$Message.success('打印确认成功');
                        this.getDataList();
                    }
                });
            },

            //
            //健康证信息查询 并 获取pdf地址
            getReport(isPreviewData, templateData) {
                this.aliLoading = true;
                let _this = this;
                let _templateData = {}
                //健康证信息 录入
                if (templateData && templateData.name) {
                    _templateData.id = templateData.id;//id编号
                    _templateData.name = templateData.name;//姓名
                    _templateData.sex = templateData.sex;//性别
                    _templateData.age = templateData.age;//年龄
                    _templateData.idCard = templateData.idCard//身份证号
                    _templateData.termOfValidity = formartDate(templateData.dateOfIssue, 'yyyy.MM.dd') + "-" + formartDate(templateData.termOfValidity, 'yyyy.MM.dd');//有效期
                    _templateData.code = templateData.code;//编号
                    /*if (_this.$hospitalName && _this.$hospitalName.provinceCode) {
                        _templateData.code = _this.$hospitalName.provinceCode;
                    }*/
                    _templateData.code = templateData.healthCcertificate;//编号
                    _templateData.unitOfIssue = templateData.unitOfIssue;//发证单位
                    if (_this.$hospitalName && _this.$hospitalName.unitOfIssue) {
                        _templateData.unitOfIssue = _this.$hospitalName.unitOfIssue;
                    }
                    _templateData.headImgJKZ = templateData.headImgPath;//头像图片 base64
                    _templateData.comboType = templateData.comboName;//套餐名 即作为从业类型
                    let test1 = "";
                    if (templateData.certificateType) {
                        _templateData.comboType = templateData.certificateType;
                    }
                }
                testNumGeneratorBarcodeByIdCard({
                    personId: templateData.personId,
                    testNum: templateData.code
                }).then(res => {
                    if (res.success) {
                        // _templateData.barCodeImg = res.data.split(",")[1];//条形码图片 base64
                        _templateData.idCardImg = res.data;//条形码图片 base64
                    }
                    if (!isPreviewData) {//是否批量打印
                        //打印单个健康证
                        getTemplatePreviewHealthyData({
                            id: _this.TTemplateId,
                            templateData: JSON.stringify(_templateData)
                        }).then(res => {
                            if (res && res.success) {
                                let previewHtml = res.data.replace("template", "div");
                                let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + previewHtml;
                                _this.previewHtmlUrl = url;
                                _this.aliLoading = false;
                            } else {
                                _this.aliLoading = false;
                                _this.$Message.error('请求失败');
                            }
                        });
                    } else {
                        //打印多个健康证
                        let previewData = {
                            id: _this.TTemplateId,
                            baseProjectId: "",
                            templateData: JSON.stringify(_templateData)
                        }
                        _this.previewData.push(previewData);
                        if (_this.printDatasNum == _this.previewData.length) {
                            let wordData = _this.previewData;
                            generateWordReportHealthy({wordData: wordData, wordName: "健康证(批量)"}).then(res => {
                                if (res.success) {
                                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                                    this.previewHtmlUrl = url;
                                    _this.aliLoading = false;
                                    setTimeout(function () {
                                        _this.$refs.iframeMain.contentWindow.print();
                                    }, 1000)
                                    // _this.selectCount=0;
                                    // _this.selectList=[];
                                    // _this.$refs.table.selectAll(false);
                                }
                            }).catch(function (error) {
                                _this.aliLoading = false;
                                _this.$Message.error('请求失败');
                            });
                        }
                    }
                })

            },
            //左侧 列表行点击
            tableClick(e) {
                console.log('行点击事件...');
                console.log(e);
                this.templateData = e;
                //右侧 健康证(健康检查合格证)
                this.getReport(false, this.templateData);
            },
            //批量打印
            printInfoAll() {

                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要打印的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认打印',
                    content: '您确认要打印所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let printDatas = [];
                        this.selectList.forEach(function (e) {
                            printDatas.push(e);
                        });
                        this.patchPrintInfoData(printDatas);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //打印
            patchPrintInfoData(printDatas) {
                let _this = this;
                _this.previewData = [];
                _this.pdfPaths = [];
                _this.printDatasNum = printDatas.length;
                if (printDatas == undefined || printDatas == null || printDatas.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                this.$Modal.remove();
                let j = 0;
                //批量生成健康证 pdf
                for (let i = 0; i < printDatas.length; i++) {

                    /*setTimeout(function () {
                        let item = printDatas[j];
                        _this.getReport(true,item);
                        j++;
                    },300);*/
                    _this.getReport(true, printDatas[i])
                }
            },

            //列表上方更多操作
            handDropdown(name) {
                if (name == "refresh") {
                    this.getDataList();
                } else if (name == "removeAll") {
                    this.delAll();
                } else if (name == "export") {
                    let excolumns = this.columns.filter(function (v) {
                        return v.title != "操作" && v.type != 'selection'
                    });
                    this.$refs.table.exportCsv({
                        filename: '本页数据',
                        columns: excolumns,
                        data: this.data
                    });
                }
            },
            //展开 收起
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                }
                this.drop = !this.drop;
            },
            //时间选择事件
            selectDateRange(v) {
                if (v) {
                    this.searchForm.startDate = v[0];
                    this.searchForm.endDate = v[1];
                }
            },
            //新增
            addTCertificateManage() {
                this.title = '新增';
                this.updateShow = true
                this.TCertificateManageId = '';
            },
            //编辑
            handEdit(row, index) {
                this.title = '编辑';
                this.TCertificateManageId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handLook(row, index) {
                this.title = '查看';
                this.TCertificateManageId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                this.loading = true;
                queryTCertificateManageList(this.searchForm).then(res => {
                    if (res.success && res.data.records.length > 0) {
                        this.data = res.data.records;
                        this.total = res.data.total;
                        this.templateShow = true;
                        this.templateData = this.data[0];
                        //右侧 健康证
                        this.getReport(false, this.templateData);
                    } else {
                        this.data = [];
                        this.total = 0;
                        // this.templateShow = false;
                        this.templateShow = true;
                        this.templateData = {};
                        this.getReport(false, this.templateData);
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            //单一删除
            deleteData(row, index) {
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除所点击选的数据?",
                    loading: true,
                    onOk: () => {
                        this.userLoading = true;
                        var ids = [];
                        ids.push(row.id);
                        this.patchDeleteData(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    },
                });
            },
            //批量删除
            delAll() {
                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要删除的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.selectList.forEach(function (e) {
                            ids.push(e.id);
                        });
                        this.patchDeleteData(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //删除（后台）
            patchDeleteData(ids) {
                if (ids == undefined || ids == null || ids.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                deleteTCertificateManage({ids: ids}).then(res => {
                    this.userLoading = false;
                    this.$Modal.remove();
                    if (res.success) {
                        this.modalTaskVisible = false;
                        this.$Message.success('删除成功');
                        this.getDataList();
                    } else {
                        this.$Message.error('删除失败');
                    }
                });
            },
            //改变页码
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
                this.clearSelectAll();
            },
            //改变每页显示数据的条数
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getDataList();
            },
            //改变排序方式
            changeSort(e) {
                this.searchForm.sort = e.key;
                this.searchForm.order = e.order;
                if (e.order == 'normal') {
                    this.searchForm.order = '';
                }
                this.getDataList();
            },
            //查询
            handSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
            //重置
            handReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
                this.selectDate = null;
                this.searchForm.code = '';
                this.searchForm.name = '';
                this.searchForm.sex = '';
                this.searchForm.age = '';
                this.searchForm.printState = '';//打印状态
                this.registDate = null;
                // 重新加载数据
                this.getDataList();
            },
            //显示选择
            showSelect(e) {
                this.selectList = e;
                this.selectCount = e.length;
            },
            //清空选择
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            //获取列表字段
            getTCertificateManageColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '编号',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'code',
                        sortable: false
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    },
                    {
                        title: '性别',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'sex',
                        sortable: false
                    },
                    {
                        title: '年龄',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'age',
                        sortable: false
                    },
                    {
                        title: '有效期',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'termOfValidity',
                        sortable: false
                    },
                    {
                        title: '发证单位',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'unitOfIssue',
                        sortable: false
                    },
                    {
                        title: '打印状态',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'printState',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.printState == 1) {
                                return h('div', [
                                    h('Button', {
                                        style: {
                                            borderRadius: '10px',
                                        },
                                        props: {
                                            type: 'success',
                                            size: 'small'
                                        }
                                    }, "已打印"),
                                ])
                            } else {
                                return h('div', [
                                    h('Button', {
                                        style: {
                                            borderRadius: '10px',
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    }, '未打印')
                                ])
                            }
                        }
                    },
                    {
                        title: '上传状态',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'isUpload',
                        sortable: false,
                        render: (h, params) => {
                            let re = "";
                            if (params.row.isUpload == 0) {
                                re = "未上传";
                            } else if (params.row.isUpload == 1) {
                                re = "上传成功";
                            } else if (params.row.isUpload == 2) {
                                re = "上传失败";
                            }
                            else if (params.row.isUpload == 3) {
                                re = "已删除";
                            }else {
                                re = "未上传";
                            }
                            return h("div", re);
                        },
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 250,
                    }
                ]
            },
            //动态列实现
            checkboxChange: function (data) {
                var columnss = this.getTSubstancesColumns();
                this.columns = columnss.filter(function (v) {
                    return data.indexOf(v.title) > -1 || v.type == 'selection'
                })
            }
        },
        mounted() {
            /*getTCertificateManage({id: '1'}).then(res => {
                if (res.success) {

                }
            });*/
            queryTCertificateManageAll({}).then(res => {
                if (res.success) {

                }
            });
            this.getDataList();
        }
    }
</script>
<style scoped="less">
    .operation {
        margin-bottom: 10px;
    }
</style>
