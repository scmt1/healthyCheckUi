<style lang="less">
    .reviewRecord {
        .ivu-modal {
            width: 1000px !important;
            top: 20%;
        }
    }
</style>
<template>
    <div>
        <Modal v-model="show" title="复查记录" footer-hide :mask-closable="false" class="reviewRecord">
            <Row type="flex" justify="end" style="margin-bottom: 20px;">
                <Col>
                    <Button type="primary" @click="addReviewRecord">新增复查项目</Button>
                </Col>
            </Row>
            <Table :loading="tableLoading" border :columns="columns" sortable="custom" :data="tableData"
                   @on-selection-change="showSelect" ref="table" style="width: 100%;">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click.native="deleteClick(row,index)">删除
                    </Button>
                    <Button type="info" size="small" @click.native="editClick(row,index)">修改
                    </Button>
                    <Button type="info" size="small" @click.native="auditingReportClick(row,index)">复查报告查看
                    </Button>
                </template>
            </Table>
            <Row type="flex" justify="end" class="page">
                <Page
                        :current="param.pageNumber"
                        :total="tableData.length"
                        size="small"
                        show-total
                        transfer
                ></Page>
            </Row>
        </Modal>
        <Modal title="复查修改" v-model="reviewUpdateShow" :mask-closable="false" footer-hide :width="650">
            <Form ref="inspectForm"
                  :model="reviewData"
                  style="" :label-width="90">
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="姓名：">
                            <Input :rows="1" disabled type="textarea" style="background-color: #fff;color: #000;" v-model="reviewData.personName"
                                   placeholder="请输入姓名"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="复查项目：">
                            <Input :rows="1" disabled type="textarea" v-model="reviewData.name"
                                   placeholder="请输入复查项目"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="复查说明：">
                            <Input :rows="3" type="textarea" v-model="reviewData.reason"
                                   placeholder="请输入复查原因"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="复查日期：">
                            <DatePicker type="datetime" :disabled="reviewData.registDate ? false : true" v-model="reviewData.registDate" transfer placeholder="请选择"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span="4">
                    <Button @click="closeReviewResult" style="height: 30px;margin-top: 10px;">取消</Button>
                </Col>
                <Col span="16">
                </Col>
                <Col span="4" style="text-align: right;margin-right: 0px;">
                    <Button type="primary":loading="loading" @click="getReviewResult" style="height: 30px;margin-top: 10px;text-align: center;">确定</Button>
                </Col>
            </Row>
        </Modal>
        <update-review-record v-model="addReviewRecordShow" :personInfo="personInfo" :officeId="officeId"
                              v-on:handleSearch="handleSearch" :modalTitle="editTitle"></update-review-record>
        <!--复查-->
        <review v-model="addReviewRecordShow" :modalTitle="editTitle" :personInfo="personInfo" :conclusion="conclusion" @getItemDataByGroupId="handleSearch"></review>
        <auditing-report v-model="auditingReportShow"  :physicalType="physicalStatus" :type-status="typeCheck" :person-id="personInfo.id" :ReviewPerson="tReviewPerson"
                         :status="status"></auditing-report>
    </div>
</template>
<script>
    import {
        queryTReviewRecordList,
        deleteTReviewRecord,
        updateTReviewRecordById,
        approveTReviewRecordById,
        updateTReviewRecord
    } from "../../../api/healthy/tReviewRecord"
	import {
		deleteTReviewProject,
        updateTReviewProject
	} from "../../../api/healthy/tReviewProject"
    import updateReviewRecord from "./updateReviewRecord";
    import {formartDate} from "../../../api/tools/tool";
    import review from "../tCheckStation/review";
    import auditingReport from "../tAllInspect/auditingReport";

    export default {
        components: {
            updateReviewRecord, review,auditingReport
        },
        name: "reviewRecord",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            tableDataReview: {
                type: Array,
                default: () => []
            },
            personInfo: {
                type: Object
            },
            conclusion: {
                type: String,
                default: ""
            },
            typeStatus:{
                type: Boolean,
                default: false
            },
            physicalType:{
                type:String,
                default:"职业体检"
            },
        },
        data() {
            return {
                tReviewPerson:"",
                personIds:"",
                typeCheck:true,
                physicalStatus:"职业体检",
                status:true,
                auditingReportShow: false,//审核页面查看
                code:'',
                loading: false,
                reviewData: {},//复查数据
                reviewUpdateShow: false,//复查编辑页面展示

                officeId: '',
                addReviewRecordShow: false,
                show: this.value,
                editTitle: "",
                selectCount: 0, // 多选计数
                selectList: [], // 多选数据
                tableLoading: false,
                total: 0,
                param: {
                    personId: '',
                    pageNumber: 1,
                    pageSize: 10,
                },
                tableData: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: '姓名',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false
                    },  {
                        title: '复查项目',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    }, {
                        title: '复查说明',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'reason',
                        sortable: false
                    }, {
                        title: '操作日期',
                        align: 'center',
                        minWidth: 130,
                        ellipsis: true,
                        tooltip: true,
                        key: 'createTime',
                        sortable: false,
                        render: (h, params) => {
                            return h('span', {}, formartDate(params.row.createTime, "yyyy-MM-dd"))
                        }
                    }, {
                        title: '登记日期',
                        align: 'center',
                        minWidth: 130,
                        ellipsis: true,
                        tooltip: true,
                        key: 'registDate',
                        sortable: false,
                        render: (h, params) => {
                            return h('span', {}, formartDate(params.row.registDate, "yyyy-MM-dd"))
                        }
                    }, {
                        title: '登记状态',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'isPass',
                        sortable: false,
                        render: (h, params) => {
                            if(params.row.isPass == 2){
                                return h('span',{},"已登记")
                            }else{
                                return h('span',{},"未登记")
                            }
                        }
                    },
                    {
                        title: '危害因素',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'hazardFactorCode',
                        sortable: false,
                    },
					{
						title: '操作',
						align: 'center',
						slot: 'action',
						width: 250,
					}
                ],
            }
        },
        methods: {
            closeReviewResult(){
                this.reviewUpdateShow = false;
            },
            getReviewResult(){
                // reviewData
                this.loading = true;
                let registDate = null;
                if(this.reviewData.registDate){
                    registDate = this.reviewData.registDate = formartDate(this.reviewData.registDate, 'yyyy-MM-dd HH:mm:ss');
                }
                let reviewData = {
                    id: this.reviewData.id,
                    // personName: this.reviewData.personName,
                    // name: this.reviewData.name,
                    reason: this.reviewData.reason,
                    registDate: registDate,
                };
                updateTReviewProject(reviewData).then(res => {
                    if (res.code == 200) {
                        this.reviewUpdateShow = false;
                        this.loading = false;
                        this.$Message.success('修改成功');
                        this.getRecord();
                    } else {
                        this.$Message.error('修改失败');
                    }
                });
            },
            //添加复查记录
            addReviewRecord() {
                this.addReviewRecordShow = true;
                this.editTitle = "新增复查记录";
            },
            auditingReportClick() {
                this.auditingReportShow = true;
            },
            //删除记录
            delReviewRecord() {
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
                        this.patchdeleteData(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //删除（后台）
            patchdeleteData(idList) {
                if (idList == undefined || idList == null || idList.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                deleteTReviewRecord({ids: idList}).then(res => {
                    this.$Modal.remove();
                    if (res.code == 200) {
                        this.modalTaskVisible = false;
                        this.$Message.success('删除成功');
                        this.getRecord();
                    } else {
                        this.$Message.error('删除失败');
                    }
                });
            },
            //审核记录
            approve() {
                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要审核的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认审核',
                    content: '您确认要审核所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.selectList.forEach(function (e) {
                            ids.push(e.id);
                        });
                        updateTReviewRecordById(ids).then(res => {
                            if (res.success) {
                                this.$Modal.remove();
                                this.$Message.success('审核成功');
                                this.getRecord();
                            } else {
                                this.$Modal.remove();
                                this.$Message.error(res.msg);
                            }
                        }).catch(res => {
                            this.$Message.error(res.msg);
                            this.$Modal.remove();
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //取消审核记录
            cancelApprove() {
                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要取消审核的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '取消审核',
                    content: '您确认要取消审核所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.selectList.forEach(function (e) {
                            ids.push(e.id);
                        });
                        approveTReviewRecordById(ids).then(res => {
                            if (res.success) {
                                this.$Modal.remove();
                                this.$Message.success('取消审核成功');
                                this.getRecord();
                            } else {
                                this.$Modal.remove();
                                this.$Message.error(res.msg);
                            }
                        }).catch(res => {
                            this.$Message.error(res.msg);
                            this.$Modal.remove();
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //显示选择
            showSelect(e) {
                this.selectList = e;
                this.selectCount = e.length;
            },
            //添加复查项目回调查询
            handleSearch() {
                this.param.pageNumber = 1;
                this.getRecord();
            },
            //查询复查记录
            getRecord() {
                this.selectCount = 0;
                this.tableLoading = true;
                this.param.personId = this.personInfo.id;
                queryTReviewRecordList(this.param).then(res => {
                    if (res.success) {
                        this.tableData = res.data;
                        if (!this.typeStatus){
                            this.tReviewPerson = res.data[0].personId;
                        }
                        this.$emit("reviewProject",res.data);
                    }
                }).finally(() => {
                    this.tableLoading = false;
                })
            },
            //修改复查记录
            updateReviewRecord() {
                this.addReviewRecordShow = true;
                this.editTitle = "修改复查记录";
            },
            //编辑复查项目
            editClick(row,index){
                this.reviewData = row;
                if(this.reviewData && this.reviewData.registDate){
                    this.reviewData.registDate = formartDate(this.reviewData.registDate, 'yyyy-MM-dd HH:mm:ss')
                }
                this.reviewUpdateShow = true;
            },
            //删除复查项目
			deleteClick(row,index){
                if(this.tableDataReview.indexOf(row.id) > -1){
                    this.$Modal.confirm({
                        title: '确认删除',
                        content: '当前复查项目已保存结果，确定删除？',
                        loading: true,
                        onOk: () => {
                            this.$Modal.remove();
                            let ids =[];
                            ids.push(row.id);
                            deleteTReviewProject({ids:ids}).then(res => {
                                if (res && res.success) {
                                    this.$Message.success('删除成功！');
                                    this.getRecord();
                                }
                                else {
                                    this.$Message.error('删除失败！');
                                }

                            }).catch((err)=>{
                                this.$Message.error('删除失败！');
                            }).finally(() => {

                            })
                            this.loading = false;
                        },
                        onCancel: () => {
                            this.$Message.info('取消了当前的操作行为！');
                            this.loading = false;
                        }
                    });
                }else{
                    let ids =[];
                    ids.push(row.id);
                    deleteTReviewProject({ids:ids}).then(res => {
                        if (res && res.success) {
                            this.$Message.success('删除成功！');
                            this.getRecord();
                        }
                        else {
                            this.$Message.error('删除失败！');
                        }

                    }).catch((err)=>{
                        this.$Message.error('删除失败！');
                    }).finally(() => {

                    })
                }
            },
            //页数改变
            changePage(v) {
                this.param.pageNumber = v;
            },
            //条数改变
            changePageSize(v) {
                this.param.pageSize = v;
            },
            closeModal(val) {
                this.$emit('input', val);
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.loading = false;
                this.param.personId = this.personInfo.id;
                if (this.param.personId) {
                    this.getRecord();
                }
                if (val) {
                } else {
                    this.closeModal(val);
                }
            },
          /*  typeStatus(val){
                if (val){
                    this.typeCheck = val
                }
            },*/
            physicalType(val){
                if (val){
                    this.physicalStatus = val
                }
            }


        }
    }
</script>
