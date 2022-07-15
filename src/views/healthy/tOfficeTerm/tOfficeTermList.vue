<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .tOfficeTermList {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;

        .d-card {
            height: 100%;
            overflow: auto;

            .ivu-col-span-1 {
                flex: 0 0 2.16666667% !important;
                max-width: 2.16666667% !important;
            }

            .ivu-col-span-4 {
                flex: 0 0 15% !important;
                max-width: 15% !important;
            }

            .ivu-col-span-23 {
                flex: 0 0 98% !important;
                max-width: 98% !important;
            }

            .operation {
                margin-bottom: 10px;
            }

            .page {
                margin-top: 20px !important;
            }
        }
    }
</style>
<template>
    <div class="tOfficeTermList">
        <Card class="d-card">
            <Row type="flex" justify="space-between" :wrap="false">
                <Col v-if="expand" :span="leftSpan" style="position: relative">
                    <Alert show-icon>
                        当前选择：
                        <span class="select-title">{{editTitle}}</span>
                        <br/>
                        <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
                    </Alert>
                    <Input v-model="searchKey" suffix="ios-search" @on-change="search" placeholder="输入搜索科室" clearable/>
                    <div style="position: relative">
                        <div class="tree-bar" :style="{ 'maxHeight': (height + 100) +'px' }">
                            <Tree ref="tree" :data="treeData" @on-select-change="selectTree"></Tree>
                            <Spin size="large" fix v-if="treeLoading"></Spin>
                        </div>
                    </div>
                </Col>

                <div class="expand">
                    <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
                </div>

                <Col :span="span">
                    <Row v-show="openSearch" @keydown.enter.native.prevent="handSearch">
                        <Form ref="searchForm" :model="searchForm" inline :label-width="80" @keydown.enter.native="handSearch">
                            <Form-item label="体检类型">
                                <Select v-model="searchForm.inspectType" placeholder="请选择体检类型"
                                        multiple transfer clearable v-width="150">
                                    <Option v-for="(item, i) in inspectTypePriority" :key="item.id" :value="item.value">{{item.title}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="术语类型">
                                <Select v-model="searchForm.type" placeholder="请选择术语类型" clearable v-width="150">
                                    <Option v-for="(item, i) in officeTermTypePriority" :key="item.id" :value="item.value">{{item.title}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="危害因素">
                                <TreeSelect :data="hazardFactorsPriority" clearable
                                            v-model="searchForm.hazardFactors"
                                            v-width="150"
                                            ref="hazardFactors"
                                            @on-change="hazardFactorsChange"/>
                            </Form-item>
                            <Form-item label="在岗状态">
                                <Select v-model="searchForm.workStateCode" placeholder="请选择在岗状态" multiple clearable v-width="150" transfer label-in-value @on-change="workChange">
                                    <Option v-for="(item, index) in workStateCodeArr" :key="item.id" :value="item.value">{{item.title}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="术语内容" v-if="drop">
                                <Input v-model="searchForm.content" placeholder="术语内容" v-width="150"/>
                            </Form-item>
                            <Form-item label="创建时间" v-if="drop">
                                <DatePicker v-model="selectDate"
                                            v-width="150"
                                            type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange"
                                            placeholder="选择起始时间"></DatePicker>
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
                        <Button @click="addTOfficeTerm" type="primary" icon="md-add">新增</Button>
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
                                <DropdownItem name="removeAll">
                                    <Icon type="md-trash"/>
                                    批量删除
                                </DropdownItem>
                                <DropdownItem name="export">
                                    <Icon type="md-arrow-down"/>
                                    导出本页数据
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? '关闭搜索' : '开启搜索'}}</Button>
                        <Button type="dashed" @click="openTip=!openTip">{{openTip ? '关闭提示' : '开启提示'}}</Button>
                        <div style="float: right;">
                            <Poptip transfer trigger="click" placement="bottom-end" title="动态列">
                                <Button icon="md-list"></Button>
                                <div slot="content" style="position:relative;min-height:5vh">
                                    <Checkbox-group v-model="colOptions" @on-change="checkboxChange">
                                        <row v-for="(item,i) in colSelect" :key="i">
                                            <checkbox style="margin-bottom: 5px;font-weight: 700;" :label="item"></checkbox>
                                        </row>
                                        <!--											<checkbox v-for="item in colSelect" :label="item" :key="item" ></checkbox>-->
                                    </Checkbox-group>
                                </div>
                            </Poptip>
                        </div>
                    </div>
                    <div v-show="openTip">
                        <Alert show-icon>
                            已选择
                            <span class="select-count">{{selectCount}}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                            <span style="float: right;">点击右上角按钮配置动态列↑</span>
                        </Alert>
                    </div>
                    <div>
                        <Table :max-height="height"
                               :loading="loading" border :columns="columns" sortable="custom" :data="data" @on-sort-change="changeSort"
                               @on-selection-change="showSelect" ref="table">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="primary" @click="handLook(row, index)" size="small">
                                    <Icon type="ios-eye-outline"/>
                                    查看
                                </Button>
                                <Dropdown :transfer=true>
                                    <Button size="small">
                                        更多操作
                                        <Icon type="md-arrow-dropdown"/>
                                    </Button>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="edit" @click.native="handEdit(row, index)">
                                            <Icon type="ios-create-outline"/>
                                            修改
                                        </DropdownItem>
                                        <DropdownItem name="delete" @click.native="deleteData(row, index)">
                                            <Icon type="md-trash"></Icon>
                                            删除
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </template>
                        </Table>
                    </div>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage"
                              @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total
                              show-elevator
                              show-sizer></Page>
                    </Row>
                </Col>
            </Row>

        </Card>
        <updateTOfficeTerm v-model="updateShow" :TOfficeTermId="TOfficeTermId" :TOfficeId="TOfficeId" :modalTitle="title"
                           v-on:handSearch="handSearch"></updateTOfficeTerm>
    </div>
</template>
<script>
    import {
        deleteTOfficeTerm,
        queryTOfficeTermList,
        updateTOfficeTerm as update
    } from '@/api/healthy/tOfficeTerm'
    import {queryAllSectionOfficeData} from '@/api/healthy/tSectionOffice'
    import {formartDate} from '@/api/tools/tool'
    import updateTOfficeTerm from './updateTOfficeTerm'
    import {getDictDataByType} from '@/api/index';
    import {getTypeCodeByTProType} from '@/api/healthy/tGroupPerson'
    import util from "../../../libs/util";

    export default {
        components: {
            updateTOfficeTerm
        },
        data() {
            return {
                height: 500,
                leftSpan: 4,
                span: 20,
                editTitle: '',
                searchKey: '',
                treeData: [],
                expandIcon: 'ios-arrow-back',
                treeLoading: false,
                selectDate: null,
                expand: true,
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                data: [],
                columns: this.getTOfficeTermColumns(),
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
                    content: '',//术语内容
                    officeId: '',//科室id
                    type: '',//术语类型
                    inspectType: '',//体检类型
                    hazardFactorsText: '',//危害因素text
                    hazardFactors: '',//危害因素
                    workStateCode: '',//在岗状态编码
                    workStateText: '',//在岗状态
                },
                TOfficeId: '',
                total: 0,
                title: '',
                TOfficeTermId: '',
                updateShow: false,
                tableHeight: 200,
                colOptions: ["科室名称", "术语类型", "体检类型", "危害因素", "状态", "术语内容", "创建时间", "操作"],
                colSelect: ["科室名称", "术语类型", "体检类型", "危害因素", "状态", "术语内容", "创建时间", "操作"],
                csvData: [],
                officeIdPriority: [],//科室
                selectNode: {},
                officeTermTypePriority: '',//术语类型
                workStateCodeArr: [],//在岗状态
                inspectTypePriority: [{
                    id: '1',
                    value: "健康体检",
                    title: "健康体检",
                }, {
                    id: '2',
                    value: "职业体检",
                    title: "职业体检",
                }, {
                    id: '3',
                    value: "从业体检",
                    title: "从业体检",
                }, {
                    id: '4',
                    value: "放射体检",
                    title: "放射体检",
                }],//体检类型
                hazardFactorsPriority: [],//危害因素
            }
        },
        methods: {
            hazardFactorsChange() {
                let labels = this.$refs.hazardFactors.$children[0].values;
                if (labels && labels.length > 0) {
                    this.searchForm.hazardFactorsText = "";
                    this.searchForm.hazardFactors = "";
                    labels.forEach((i, index) => {
                        if (index == labels.length - 1) {
                            this.searchForm.hazardFactorsText += i.label;
                            this.searchForm.hazardFactors += i.value;
                        } else {
                            this.searchForm.hazardFactorsText += i.label + ",";
                            this.searchForm.hazardFactors += i.value + ",";
                        }
                    })
                }
            },
            //获取类型库树
            getProTypeByTypeCode(typeCode) {
                getTypeCodeByTProType({typeCode: typeCode}).then(res => {
                    if (res && res.success) {
                        this.hazardFactorsPriority = this.recursion(res.data);
                    }
                }).catch(err => {
                });
            },
            //递归
            recursion(proTypes) {
                if (proTypes) {
                    proTypes.forEach(item => {
                        item.value = item.typeCode;
                        item.title = item.typeName;
                        item.selected = false;
                        item.checked = false;
                        if (item.children && item.children.length > 0) {
                            item.disabled = true;
                            this.recursion(item.children)
                        }
                    })
                }
                return proTypes;
            },
            //取消选择
            cancelEdit() {
                let data = this.$refs.tree.getSelectedNodes()[0];
                if (data) {
                    data.selected = false;
                }
                // 取消选择后获取全部数据
                this.selectNode = {};
                this.editTitle = "";
                this.searchForm.officeId = '';
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;

                this.getDataList();
            },
            search() {//搜索树
                if (this.searchKey) {
                    this.treeLoading = true;
                    queryAllSectionOfficeData({sectionName: this.searchKey}).then(res => {
                        this.treeLoading = false;
                        if (res && res.success) {
                            this.treeData = this.setTreeData(res.data);
                        }
                    }).catch(err => {
                        this.$Message.error("搜索失败");
                    });
                } else {
                    this.getTreeData();// 为空重新加载
                }
            },
            selectTree(v) {//树 选择
                if (v.length > 0) {
                    // 转换null为""
                    for (let attr in v[0]) {
                        if (v[0][attr] == null) {
                            v[0][attr] = "";
                        }
                    }
                    let str = JSON.stringify(v[0]);
                    let data = JSON.parse(str);
                    this.selectNode = data;
                    this.editTitle = v[0].title;
                    // 重新加载表
                    this.searchForm.pageNumber = 1;
                    this.searchForm.pageSize = 10;
                    this.searchForm.officeId = v[0].id;
                    this.getDataList();
                } else {
                    this.cancelEdit();
                }
            },
            changeExpand() {
                this.expand = !this.expand;
                if (this.expand) {
                    this.expandIcon = "ios-arrow-back";
                    this.span = 20;
                    this.leftSpan = 4
                } else {
                    this.expandIcon = "ios-arrow-forward";
                    this.span = 23;
                    this.leftSpan = 1;
                }
            },
            setTreeData(data) {//初始化树结构
                let j = 0;
                if (data) {
                    for (let i in data) {
                        data[i].title = data[i].sectionName;
                        data[i].value = data[i].id;
                        data[i].expand = false;

                        if (data[i].children && i == j) {
                            data[i].expand = true;
                        } else
                            j++;

                        if (data[i].children) {
                            data[i].children = this.setTreeData(data[i].children);
                        }
                    }
                }
                return data;
            },
            getTreeData() {//获取树数据 科室
                let _this = this;
                _this.treeLoading = true;
                queryAllSectionOfficeData({}).then(res => {
                    if (res && res.success) {
                        _this.treeLoading = false;
                        _this.officeIdPriority = res.data;//科室数据
                        _this.treeData = _this.setTreeData(res.data);//树化 科室数据
                    }
                }).catch(err => {
                    _this.treeLoading = false;
                    _this.$Message.error('获取失败!');
                });
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
                        data: this.csvData
                    });
                }
            },
            //展开 收起
            dropDown() {
                if (this.drop) {
                    this.height = this.height + 60;
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                } else {
                    this.height = this.height - 60;
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
            addTOfficeTerm() {
                this.title = '新增';
                this.updateShow = true
                this.TOfficeTermId = '';
                if (this.searchForm.officeId && this.searchForm.officeId != '') {
                    this.TOfficeId = this.searchForm.officeId;
                }
            },
            //编辑
            handEdit(row, index) {
                this.title = '编辑';
                this.TOfficeTermId = row.id.toString();
                this.updateShow = true;
                if (this.searchForm.officeId && this.searchForm.officeId != '') {
                    this.TOfficeId = this.searchForm.officeId;
                }
            },
            //查看
            handLook(row, index) {
                this.title = '查看';
                this.TOfficeTermId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                //选中体检类型json转换
                if(this.searchForm.inspectType && this.searchForm.inspectType != null && this.searchForm.inspectType.constructor != String){
                    this.searchForm.inspectType = this.searchForm.inspectType.join(",");
                }
                //选中在岗状态json转换
                if(this.searchForm.workStateCode && this.searchForm.workStateCode != null && this.searchForm.inspectType.workStateCode != String){
                    this.searchForm.workStateCode = this.searchForm.workStateCode.join(",");
                }
                let _this = this;
                this.loading = true;
                queryTOfficeTermList(this.searchForm).then(res => {
                    if (res.success) {
                        this.loading = false;
                        this.data = res.data.records;
                        this.total = res.data.total;
                        this.csvData = JSON.parse(JSON.stringify(res.data.records));
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
                        this.patchdeleteData(ids);
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
                        this.patchdeleteData(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //删除（后台）
            patchdeleteData(ids) {
                if (ids == undefined || ids == null || ids.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                deleteTOfficeTerm({ids: ids}).then(res => {
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
            //在岗状态改变
            workChange(v) {
                let _this = this;
                if (v) {
                    if(v.length > 0){
                        _this.searchForm.workStateText = "";
                        v.forEach((i, index) => {
                            if (index == v.length - 1) {
                                _this.searchForm.workStateText += i.label.trim();
                            }else{
                                _this.searchForm.workStateText += i.label.trim() + ",";
                            }
                        })
                    }else{
                        _this.searchForm.workStateText = "";
                    }
                }
            },
            //查询
            handSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
            //重置
            handReset() {
                let data = this.$refs.tree.getSelectedNodes()[0];
                if (data) {
                    data.selected = false;
                }
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
                this.searchForm.content = '';
                this.searchForm.officeId = '';
                this.searchForm.type = '';
                this.searchForm.inspectType = '';
                this.searchForm.hazardFactors = '';
                this.searchForm.workStateCode = '';
                this.searchForm.workStateText = '';
                this.editTitle = '';
                this.TOfficeId = '';
                this.selectDate = null;
                this.$refs.table.selectAll(false);
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
            //更新状态(后台）
            updateData(row) {
                if (row.status === '0') {
                    row.status = '1'
                } else {
                    row.status = '0'
                }
                let data = {
                    status: row.status,
                    id: row.id,
                }
                let _this = this;
                //改变开关状态
                update(data).then(res => {
                    if (res && res.code && res.code == 200) {
                        //刷新列表
                        _this.$Message.success('更改成功');
                        _this.getDataList();
                    } else {
                        _this.$Message.error('更改失败');
                    }
                }).catch(err => {
                    _this.$Message.error('更改失败');
                })
            },
            //获取列表字段
            getTOfficeTermColumns() {
                let _this = this;
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '科室名称',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'officeId',
                        sortable: false,
                        render: (h, params) => {
                            let item = params.row.officeData.sectionName;
                            let dataD = _this.csvData.filter(item => item.id == params.row.id);
                            dataD[0].officeId = item;
                            return h('Tooltip', {
                                props: {
                                    content: item,
                                    placement: 'bottom',
                                    transfer: true
                                }
                            }, item);
                        }
                    },
                    {
                        title: '体检类型',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'inspectType',
                        sortable: false
                    },
                    {
                        title: '术语类型',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'type',
                        sortable: false,
                        render: (h, params) => {
                            let item = params.row.typeName;
                            let dataD = _this.csvData.filter(item => item.id == params.row.id);
                            dataD[0].type = item;
                            return h('Tooltip', {
                                props: {
                                    content: item,
                                    placement: 'bottom',
                                    transfer: true
                                }
                            }, item);
                        }
                    },
                    {
                        title: '危害因素',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'hazardFactors',
                        sortable: false,
                        render: (h, params) => {
                            let item = params.row.hazardFactorsText;
                            let dataD = _this.csvData.filter(item => item.id == params.row.id);
                            dataD[0].type = item;
                            return h('Tooltip', {
                                props: {
                                    content: item,
                                    placement: 'bottom',
                                    transfer: true
                                }
                            }, item);
                        }
                    },
                    {
                        title: '在岗状态',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'workStateText',
                        sortable: false,
                    },
                    {
                        title: '状态',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'status',
                        sortable: false,
                        render: function (h, params) {
                            let item = params.row.status == 0 ? '启用' : '停用';
                            let dataD = _this.csvData.filter(item => item.id == params.row.id);
                            dataD[0].status = item;
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        type: 'primary',
                                        size: 'large',
                                        value: params.row.status,
                                        'true-value': '0',
                                        'false-value': '1'
                                    },
                                    scopedSlots: {
                                        open: function () {
                                            return h("span", "启用")
                                        },
                                        close: function () {
                                            return h("span", "停用")
                                        }
                                    },
                                    on: {
                                        //  处理状态的逻辑
                                        'on-change': function (value) {
                                            _this.updateData(params.row)
                                        }
                                    }
                                }, '')
                            ])
                        }
                    },
                    {
                        title: '术语内容',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'content',
                        sortable: false
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: true,
                        align: 'center',
                        width: 180,
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                    }
                ]
            },
            //动态列实现
            checkboxChange: function (data) {
                var columnss = this.getTOfficeTermColumns();
                this.columns = columnss.filter(function (v) {
                    return data.indexOf(v.title) > -1 || v.type == 'selection'
                })
            },
            //table 高度设置
            setHeight() {
                let height = window.innerHeight - 280;
                if (height <= 1220) {
                    height = height - 40;
                }
                this.height = height;

                window.onresize = () => {
                    height = window.innerHeight - 280;
                    if (height <= 1220) {
                        height = height - 40;
                    }
                    console.log(height);
                    this.height = height;
                }
            }
        },
        mounted() {
            //术语类型
            getDictDataByType('office_term_type').then(res => {
                if (res.success) {
                    this.officeTermTypePriority = res.data;
                }
            })
            //危害因素
            this.getProTypeByTypeCode("TYPE_001");
            //在岗状态
            getDictDataByType('workState').then(res => {
                if (res.success) {
                    this.workStateCodeArr = res.data;
                }
            })
            this.getTreeData();
            this.getDataList();
            this.setHeight();
        }
    }
</script>
