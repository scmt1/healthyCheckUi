<style lang="less">
.tdTjBhkList {
}
</style>
<template>
    <div class="tdTjBhkList">
        <Card>
            <Row v-show="openSearch">
                <Form ref="searchForm" :model="searchForm" inline :label-width="70" @keydown.enter.native="handSearch">
                    <Form-item label="企业名称">
                        <!--                        <Input type="text"-->
                        <!--                               v-model="searchForm.crptName"-->
                        <!--                               v-width="200"-->
                        <!--                               placeholder="请输入企业名称"/>-->
                        <Select v-model="searchForm.crptName" clearable filterable style="width:250px">
                            <Option v-for="(item,i) in companyList" :value="item.name" :key="i">{{ item.name }}
                            </Option>
                        </Select>
                    </Form-item>

                    <Form-item label="体检日期">
                        <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange"
                                    placeholder="选择起始时间" style="width: 250px"></DatePicker>
                    </Form-item>
                    <FormItem label="网传状态">
                        <Select v-model="searchForm.flag" clearable style="width:250px">
                            <Option v-for="(item,i) in flagRadio" :value="item.value" :key="i">{{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否复查">
                        <Select v-model="searchForm.ifRhk" clearable style="width:250px">
                            <Option v-for="(item,i) in ifRhkRadio" :value="item.value" :key="i">{{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                    <Form-item v-if="drop" label="订单编号">
                        <Input type="text"
                               v-model="searchForm.orderCode"
                               v-width="250"
                               placeholder="请输入订单编号"/>
                    </Form-item>
                    <br v-if="drop"/>
                    <Form-item v-if="drop" label="人员姓名">
                        <Input type="text"
                               v-model="searchForm.personName"
                               v-width="250"
                               placeholder="请输入人员姓名"/>
                    </Form-item>
                    <Form-item v-if="drop" label="证件号码">
                        <Input type="text"
                               v-model="searchForm.idc"
                               v-width="250"
                               placeholder="请输入证件号码"/>
                    </Form-item>
                    <FormItem v-if="drop" label="体检结论">
                        <Select v-model="searchForm.verdict" v-width="250" placeholder="请选择" clearable transfer>
                            <Option v-for="(item, i) in conclusionData" :key="i" :value="item.value" >{{
                                item.title
                                }}
                            </Option>
                        </Select>
                    </FormItem>
                    <Form-item v-if="drop" label="主检建议">
                        <Input type="text"
                               v-model="searchForm.mhkadv"
                               v-width="250"
                               placeholder="请输入主检建议"/>
                    </Form-item>
                    <Form-item style="margin-left:-2.78vw" class="br">
                        <Button @click="handSearch" type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handReset">重置</Button>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <Icon :type="dropDownIcon"></Icon>
                        </a>
                    </Form-item>
                </Form>
            </Row>
            <div class="operation">
                <Button type="info" @click="syncData" :loading="syncLoading">
                    <Icon type="ios-loading" v-if="!syncLoading"/>
                    数据同步
                </Button>
                <Button type="error" @click="syncDataError" :loading="syncLoading">
                    <Icon type="ios-loading" v-if="!syncLoading"/>
                    错误数据同步
                </Button>
                <Button type="info" @click="syncDataReview" :loading="syncLoading">
                    <Icon type="ios-loading" v-if="!syncLoading"/>
                    复查数据同步
                </Button>
                <Button type="error" @click="syncDataErrorReview" :loading="syncLoading">
                    <Icon type="ios-loading" v-if="!syncLoading"/>
                    复查错误数据同步
                </Button>
                <!--<Button type="success" @click="upData(1)" :loading="upLoading">
                    <Icon type="ios-loading" v-if="!upLoading"/>
                    按企业上报
                </Button>-->
                <Button type="success" @click="upData(2)" :loading="upLoading">
                    <Icon type="ios-loading" v-if="!upLoading"/>
                    自定义上报
                </Button>
                <!--<Button type="success" @click="upData(3)" :loading="upLoading">
                    <Icon type="ios-loading" v-if="!upLoading"/>
                    智能网报
                </Button>-->
                <Dropdown @on-click="handDropdown">
                    <Button>
                        更多操作
                        <Icon type="md-arrow-dropdown"/>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="refresh">
                            <Icon type="md-sync"/>
                            刷新
                        </DropdownItem>
                        <DropdownItem name="export">
                            <Icon type="md-arrow-down"/>
                            导出本页数据
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="dashed" @click="openSearch=!openSearch">{{ openSearch ? '关闭搜索' : '开启搜索' }}</Button>
                <Button type="dashed" @click="openTip=!openTip">{{ openTip ? '关闭提示' : '开启提示' }}</Button>
                <div style="float: right;">
                    <Poptip transfer trigger="click" placement="bottom-end" title="动态列">
                        <Button icon="md-list"></Button>
                        <div slot="content" style="position:relative;min-height:5vh">
                            <Checkbox-group v-model="colOptions" @on-change="checkboxChange">
<!--                                <checkbox v-for="item in colSelect" :label="item" :key="item"></checkbox>-->
                                <row v-for="(item,i) in colSelect" :key="i">
                                    <checkbox style="margin-bottom: 5px;font-weight: 700;" :label="item"></checkbox>
                                </row>
                            </Checkbox-group>
                        </div>
                    </Poptip>
                </div>
            </div>
            <div v-show="openTip">
                <Alert show-icon>
                    已选择
                    <span class="select-count">{{ selectCount }}</span> 项
                    <a class="select-clear" @click="clearSelectAll">清空</a>
                    <span style="float: right;">点击右上角按钮配置动态列↑</span>
                </Alert>
            </div>
            <div>
                <Table :loading="loading" border :columns="columns" sortable="custom" :data="data" @on-sort-change="changeSort"
                       :max-height="tableMaxHeight" @on-selection-change="showSelect" ref="table">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" @click="handEdit(row, index)" size="small">
                            <Icon type="ios-eye-outline"/>
                            编辑
                        </Button>
                        <Button type="primary" @click="handLook(row, index)" size="small">
                            <Icon type="ios-eye-outline"/>
                            查看
                        </Button>
                    </template>
                </Table>
            </div>
            <Row type="flex" justify="end" class="page">
                <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize"
                      :page-size-opts="[10,20,50,100,500,1000]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Card>
        <updateTdTjBhk v-model="updateShow" :TdTjBhkId="TdTjBhkId" :modalTitle="title" v-on:handSearch="handSearch"></updateTdTjBhk>
    </div>
</template>
<script>
import {deleteTdTjBhk, queryTdTjBhkList, queryCompanyList} from '@/api/healthy/tdTjBhk'
import updateTdTjBhk from "./updateTdTjBhk"
import {syncTConclusion, runSpiderTask} from '@/api/healthy/tConclusion'
import {getDictDataByType} from "../../../api";

export default {
    components: {updateTdTjBhk},
    data() {
        return {
            conclusionData:[],//体检结论
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "ios-arrow-down",
            search: '',
            data: [],
            columns: this.getTdTjBhkColumns(),
            openSearch: true,//打开搜索
            openTip: true,//打开提示
            loading: true, // 表单加载状态
            selectCount: 0, // 多选计数
            selectList: [], // 多选数据
            selectDate: null,
            searchForm: {
                // 搜索框对应data对象
                pageNumber: 1, // 当前页数
                pageSize: 10, // 页面大小
                startDate: null,//开始时间
                crptName: '',
                personName: "",
                verdict: "",//体检结论
                mhkadv: "",//主检建议
                idc: "",
                flag: null,
                endDate: null,//结束时间
                sort: 'createTime', // 默认排序字段
                order: 'desc', // 默认排序方式
                ifRhk: null, // 是否复查
                orderCode: '', // 订单编号
            },
            total: 0,
            title: '',
            TdTjBhkId: '',
            updateShow: false,
            syncLoading: false,
            upLoading: false,
            tableMaxHeight: 200,
            flagRadio: [
                {title: "未上传", value: 0},
                {title: "上传成功", value: 1},
                {title: "上传失败", value: 2},
				{title: "已删除", value: 3},
            ],
            ifRhkRadio: [
                {title: "否", value: 0},
                {title: "是", value: 1},
            ],
            companyList: [],
            colOptions: ["企业名称", "订单编号", "人员姓名", "性别", "证件号码", "年龄", "婚否", "人员联系电话",  "接害因素", "接害工龄年数", "接害工龄月数", "工种其他名称", "体检日期", "体检结果", "主检建议", "体检结论", "主检医师", "开始接害日期", "网传状态","是否复查", "操作"],
            colSelect: ["企业名称", "订单编号", "人员姓名", "性别", "证件号码", "年龄", "婚否", "人员联系电话",  "接害因素", "接害工龄年数", "接害工龄月数", "工种其他名称", "体检日期", "体检结果", "主检建议", "体检结论", "主检医师", "开始接害日期", "网传状态","是否复查", "操作"],
        }
    },
    methods: {
        syncData() {
            // 把数据同步到中间表
            this.syncLoading = true;
            this.loading = true;
            syncTConclusion({id: "d1f35bb81217414d9259560a289229f5"}).then(res => {//企业
                syncTConclusion({id: "d4592870d3314059b232bbafd7482l26"}).then(res => {//体检信息统一抓取NEW2
                }).finally(() => {
                    this.syncLoading = false;
                    this.$Message.success("数据同步成功！");
                    this.getCompanyData();
                    this.handSearch();

                })
            })
            /*syncTConclusion({id: "d1f35bb81217414d9259560a289229f5"}).then(res => {//企业
                syncTConclusion({id: "d4592870d3314059b232bbafd7482e64"}).then(res => {//体检主表
                    syncTConclusion({id: "3c876dfbb6864d51ab86834f1fee929f"}).then(res => {//体检结果
                        syncTConclusion({id: "3d70f5c100d44d4da8f9ef3ae91892e0"}).then(res => {//既往病史
                            syncTConclusion({id: "6f6fda93c6d24b5896d74baeb05923aa"}).then(res => {//一般问诊
                                syncTConclusion({id: "8d54a682f17249bd8abc864d76a17dde"}).then(res => {//危害因素
                                    syncTConclusion({id: "9765714a59c84d41a7c0f988f75ea0ea"}).then(res => {//症状信息
                                        syncTConclusion({id: "aa363fa494a646eda4a2516a606efe3a"}).then(res => {//职业史
                                            syncTConclusion({id: "a639d3ce0e2e423880e18edc00c245cc"}).then(res => {//主检结论
                                            }).finally(() => {
                                                this.syncLoading = false;
                                                this.$Message.success("数据同步成功！");
                                                this.getCompanyData();
                                                this.handSearch();

                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })*/
        },
        syncDataReview() {
            // 把数据同步到中间表(复查)
            this.syncLoading = true;
            this.loading = true;
            syncTConclusion({id: "d1f35bb81217414d9259560a289229f5"}).then(res => {//企业
                syncTConclusion({id: "d4592870d3314059b232bbafd7482l27"}).then(res => {//体检信息统一抓取NEW2(复查)
                }).finally(() => {
                    this.syncLoading = false;
                    this.$Message.success("数据同步成功！");
                    this.getCompanyData();
                    this.handSearch();

                })
            })
        },
        upData(type) {
            this.upLoading = true;
            if (type == 1) {
                if (!this.searchForm.crptName) {
                    this.$Message.error("请选择企业后进行上报！");
                    this.upLoading = false;
                } else {
                    runSpiderTask({companyName: this.searchForm.crptName}).then(res => {
                        if(res.code == 1) {
                            this.upLoading = false;
                            this.$Message.success("网报上传结果引擎启动成功！");
                            this.handSearch();
                        }else {
                            this.upLoading = false;
                            this.$Message.success("数据上报失败：" + res.message);
                        }
                    });
                }
            } else if(type == 2) {
                if (this.selectList.length < 1) {
                    this.$Message.error("请勾选需要上报的数据！");
                    this.upLoading = false;
                } else {
                    let ids = [];
                    for (let i = 0; i < this.selectList.length; i++) {
                        ids.push("\"" + this.selectList[i].id + "\"");
                    }
                    runSpiderTask({ids: ids}).then(res => {
                        if(res.code == 1) {
                            this.upLoading = false;
                            this.$Message.success("网报上传结果引擎启动成功！");
                            this.handSearch();
                        }else {
                            this.upLoading = false;
                            this.$Message.success("数据上报失败：" + res.message);
                        }
                    });
                }
            }else {
                runSpiderTask({}).then(res => {
                    if(res.code == 1) {
                        this.upLoading = false;
                        this.$Message.success("网报上传结果引擎启动成功！");
                        this.handSearch();
                    }else {
                        this.upLoading = false;
                        this.$Message.success("数据上报失败：" + res.message);
                    }
                });
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
                if(v[0].trim().length > 0){
                    this.searchForm.startDate = v[0];
                }else{
                    this.searchForm.startDate = null;
                }
                if(v[1].trim().length > 0){
                    this.searchForm.endDate = v[1];
                }else{
                    this.searchForm.endDate = null;
                }
            }else{
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
            }
        },
        //新增
        addTdTjBhk() {
            this.title = '新增';
            this.updateShow = true
            this.TdTjBhkId = '';
        },
        //编辑
        handEdit(row, index) {
            this.title = '编辑';
            this.TdTjBhkId = row.id.toString();
            this.updateShow = true;
        },
        //查看
        handLook(row, index) {
            this.title = '查看';
            this.TdTjBhkId = row.id.toString();
            this.updateShow = true;
        },
        //分页查询
        getDataList() {
            this.loading = true;
            queryTdTjBhkList(this.searchForm).then(res => {
                if (res.success) {
                    this.loading = false;
                    this.data = res.data.records;
                    this.total = res.data.total;
                }
            });
        },
        getCompanyData() {
            queryCompanyList({}).then(res => {
                if (res.success) {
                    this.companyList = res.data;
                }
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
            deleteTdTjBhk({ids: ids}).then(res => {
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
            this.searchForm.crptName = "";
            this.searchForm.personName = ""
            this.searchForm.verdict = ""//体检结论
            this.searchForm.mhkadv = ""//主检建议
            this.searchForm.idc = ""
            this.searchForm.flag = null
            this.searchForm.ifRhk = null
            this.searchForm.orderCode = ''
            this.selectDate = null;
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
        getTdTjBhkColumns() {
            return [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                // {
                // 	title: '业务系统编号',
                // 	align: 'center',
                // 	minWidth: 200,
                // 	ellipsis: true,
                // 	tooltip: true,
                // 	key: 'rid',
                // 	sortable: false
                // },
                // {
                // 	title: '体检机构编号',
                // 	align: 'center',
                // 	minWidth: 140,
                // 	ellipsis: true,
                // 	tooltip: true,
                // 	key: 'bhkorganCode',
                // 	sortable: false
                // },
                // {
                // 	title: '体检编号',
                // 	align: 'center',
                // 	minWidth: 120,
                // 	ellipsis: true,
                // 	tooltip: true,
                // 	key: 'bhkCode',
                // 	sortable: false
                // },
                // {
                //     title: '社会信用代码',
                //     align: 'center',
                //     minWidth: 200,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'institutionCode',
                //     sortable: false
                // },
                {
                    title: '企业名称',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'crptName',
                    sortable: false
                },
                {
                    title: '订单编号',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'orderCode',
                    sortable: false
                },
                // {
                //     title: '企业注册地址',
                //     align: 'center',
                //     minWidth: 140,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'crptAddr',
                //     sortable: false
                // },
                {
                    title: '人员姓名',
                    align: 'center',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'personName',
                    sortable: false
                },
                {
                    title: '性别',
                    align: 'center',
                    minWidth: 70,
                    ellipsis: true,
                    tooltip: true,
                    key: 'sex',
                    sortable: false,
                    render: (h, params) => {
                        let re = "";
                        if (params.row.sex == 1) {
                            re = "男";
                        } else if (params.row.sex == 2) {
                            re = "女";
                        }
                        return h("div", re);
                    },
                },
                {
                    title: '证件号码',
                    align: 'center',
                    minWidth: 180,
                    ellipsis: true,
                    tooltip: true,
                    key: 'idc',
                    sortable: false
                },
                // {
                //     title: '出生日期',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'brth',
                //     sortable: false
                // },
                {
                    title: '年龄',
                    align: 'center',
                    minWidth: 70,
                    ellipsis: true,
                    tooltip: true,
                    key: 'age',
                    sortable: false
                },
                {
                    title: '婚否',
                    align: 'center',
                    minWidth: 70,
                    ellipsis: true,
                    tooltip: true,
                    key: 'isxmrd',
                    sortable: false,
                    render: (h, params) => {
                        let re = "";
                        if (params.row.isxmrd == 0) {
                            re = "未婚";
                        } else if (params.row.isxmrd == 1) {
                            re = "已婚";
                        } else if (params.row.isxmrd == 2) {
                            re = "离异";
                        } else if (params.row.isxmrd == 3) {
                            re = "丧偶";
                        } else if (params.row.isxmrd == 4) {
                            re = "未知";
                        }
                        return h("div", re);
                    },
                },
                {
                    title: '人员联系电话',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'lnktel',
                    sortable: false
                },
                // {
                //     title: '体检人员工作部门',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'dpt',
                //     sortable: false
                // },
                // {
                //     title: '人员工号',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'wrknum',
                //     sortable: false
                // },
                {
                    title: '接害因素',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'badrsn',
                    sortable: false
                },
                // {
                //     title: '总工龄年数',
                //     align: 'center',
                //     minWidth: 130,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'wrklnt',
                //     sortable: false
                // },
                // {
                //     title: '总工龄月数',
                //     align: 'center',
                //     minWidth: 130,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'wrklntmonth',
                //     sortable: false
                // },
                {
                    title: '接害工龄年数',
                    align: 'center',
                    minWidth: 130,
                    ellipsis: true,
                    tooltip: true,
                    key: 'tchbadrsntim',
                    sortable: false
                },
                {
                    title: '接害工龄月数',
                    align: 'center',
                    minWidth: 130,
                    ellipsis: true,
                    tooltip: true,
                    key: 'tchbadrsnmonth',
                    sortable: false
                },
                {
                    title: '工种其他名称',
                    align: 'center',
                    minWidth: 130,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workName',
                    sortable: false
                },
                // {
                //     title: '在岗状态编码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'onguardState',
                //     sortable: false
                // },
                {
                    title: '体检日期',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'bhkDate',
                    sortable: false
                },
                {
                    title: '体检结果',
                    align: 'center',
                    minWidth: 300,
                    ellipsis: true,
                    tooltip: true,
                    key: 'bhkrst',
                    sortable: false
                },
                {
                    title: '主检建议',
                    align: 'center',
                    minWidth: 300,
                    ellipsis: true,
                    tooltip: true,
                    key: 'mhkadv',
                    sortable: false
                },
                {
                    title: '体检结论',
                    align: 'center',
                    minWidth: 250,
                    ellipsis: true,
                    tooltip: true,
                    key: 'verdict',
                    sortable: false,
                    render(h, params) {
                        if (params.row.verdict == '12001') {
                            return h("div", "目前未见异常：本次职业健康检查各项检查指标均在正常范围内；");
                        } else if (params.row.verdict == '12002') {
                            return h("div", "复查：检查时发现与目标疾病相关的单项或多项异常，需要复查确定者，应明确复查的内容和时间；");
                        } else if (params.row.verdict == '12003') {
                            return h("div", "疑似职业病：检查时发现疑似职业病或可能患有职业病，需要提交职业病诊断机构进一步明确诊断者；");
                        } else if (params.row.verdict == '12004') {
                            return h("div", "职业禁忌证：检查发现有职业禁忌的患者，需写明具体疾病名称；");
                        } else if (params.row.verdict == '12005') {
                            return h("div", "其他疾病或异常：除目标疾病之外的其他疾病或某些检查指标的异常。");
                        }
                    }
                },
                {
                    title: '主检医师',
                    align: 'center',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'mhkdct',
                    sortable: false
                },
                // {
                //     title: '体检类型编码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'bhkType',
                //     sortable: false
                // },
                // {
                //     title: '主检判定日期',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'jdgdat',
                //     sortable: false
                // },

                // {
                //     title: '是否为复检',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'ifRhk',
                //     sortable: false,
                //     render: (h, params) => {
                //         let re = "";
                //         if (params.row.ifRhk == 0) {
                //             re = "是";
                //         } else if (params.row.ifRhk == 1) {
                //             re = "否";
                //         }
                //         return h("div", re);
                //     },
                // },
                // {
                //     title: '复检对应的上次体检编号',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'lastBhkCode',
                //     sortable: false
                // },
                // {
                //     title: '身份证件类型代码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'idCardTypeCode',
                //     sortable: false
                // },
                // {
                //     title: '工种代码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'workTypeCode',
                //     sortable: false
                // },
                {
                    title: '开始接害日期',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'harmStartDate',
                    sortable: false
                },
                // {
                //     title: '监测类型',
                //     align: 'center',
                //     minWidth: 150,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'jcType',
                //     sortable: false
                // },
                // {
                //     title: '报告打印日期',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'rptPrintDate',
                //     sortable: false
                // },
                // {
                //     title: '用工单位社会信用代码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'creditCodeEmp',
                //     sortable: false
                // },
                // {
                //     title: '用工单位名称',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'crptNameEmp',
                //     sortable: false
                // },
                // {
                //     title: '用工单位行业类别编码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'indusTypeCodeEmp',
                //     sortable: false
                // },
                // {
                //     title: '用工单位经济类型编码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'economyCodeEmp',
                //     sortable: false
                // },
                // {
                //     title: '用工单位企业规模编码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'crptSizeCodeEmp',
                //     sortable: false
                // },
                // {
                //     title: '用工单位所属地区编码',
                //     align: 'center',
                //     minWidth: 120,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'zoneCodeEmp',
                //     sortable: false
                // },
                {
                    fixed: 'right',
                    title: '网传状态',
                    align: 'center',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'flag',
                    sortable: false,
                    render: (h, params) => {
                        let re = "";
                        if (params.row.flag == 0) {
                            re = "未上传";
                        } else if (params.row.flag == 1) {
                            re = "上传成功";
                        } else if (params.row.flag == 2) {
                            re = "上传失败";
                        }
						else if (params.row.flag == 3) {
							re = "已删除";
						}
                        return h("div", re);
                    },
                },
                {
                    fixed: 'right',
                    title: '是否复查',
                    align: 'center',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'ifRhk',
                    sortable: false,
                    render: (h, params) => {
                        let re = "";
                        if (params.row.ifRhk == 0) {
                            re = "否";
                        } else if (params.row.ifRhk == 1) {
                            re = "是";
                        }
                        return h("div", re);
                    },
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 180,
                }
            ]
        },
        //动态列实现
        checkboxChange: function (data) {
            var columnss = this.getTdTjBhkColumns();
            this.columns = columnss.filter(function (v) {
                return data.indexOf(v.title) > -1 || v.type == 'selection'
            })
        },
        //错误数据同步
        syncDataError() {
            // 重新抓取错误数据
            this.syncLoading = true;
            this.loading = true;
            syncTConclusion({id: "d4592870d3314059b232bbafd7482666"}).then(res => {//体检信息错误数据抓取
            }).finally(() => {
                this.syncLoading = false;
                this.$Message.success("数据同步成功！");
                this.getCompanyData();
                this.handSearch();

            })
        },
        //错误数据同步(复查)
        syncDataErrorReview() {
            // 重新抓取错误数据
            this.syncLoading = true;
            this.loading = true;
            syncTConclusion({id: "d4592870d3314059b232bbafd7482667"}).then(res => {//体检信息错误数据抓取(复查)
            }).finally(() => {
                this.syncLoading = false;
                this.$Message.success("数据同步成功！");
                this.getCompanyData();
                this.handSearch();

            })
        }
    },
    mounted() {
        this.getCompanyData();
        this.getDataList();
        window.onresize = () => {
            // 计算高度
            let height = document.documentElement.clientHeight;
            this.tableMaxHeight = height - 400;
        };
        // 计算高度
        let height = document.documentElement.clientHeight;
        this.tableMaxHeight = height - 400;
        getDictDataByType("physical_conclusion").then(res => {
            if (res.success) {
                this.conclusionData = res.data;
            }
        });
    }
}
</script>
<style scoped="less">
.operation {
    margin-bottom: 10px;
}
</style>
