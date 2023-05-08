<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .tBaseProjectList {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        .d-card {
            height: 100%;
            overflow: auto;

            .page {
                margin-top: 20px !important;
            }
        }

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

        .select-title {
            font-weight: 600;
            color: #40a9ff;
        }
    }
</style>
<template>
    <div class="tBaseProjectList">
        <Card class="d-card">
            <Row type="flex" justify="space-between" :wrap="false">
                <Col v-show="expand" :span="leftSpan" style="position: relative">
                    <Alert show-icon>
                        当前选择：
                        <span class="select-title">{{ editTitle }}</span>
                        <br/>
                        <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
                    </Alert>
                    <Input v-model="searchKey" suffix="ios-search" @on-change="changeSearch" placeholder="输入搜索科室" clearable/>
                    <div style="position: relative">
                        <div class="tree-bar" :style="{ 'maxHeight': (height + 100) +'px' }">
                            <Tree ref="tree" :data="treeData" @on-select-change="selectTree"></Tree>
                        </div>
                        <Spin size="large" fix v-if="treeLoading"></Spin>
                    </div>
                </Col>

                <div class="expand">
                    <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
                </div>

                <Col :span="span">
                    <Row v-show="openSearch" @keydown.enter.native="handleSearch">
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" @submit.native.prevent>
                            <FormItem label="项目名称" prop="name">
                                <Input type="text" :maxlength=50 v-model="searchForm.name" placeholder="请输入名称"/>
                            </FormItem>
                            <FormItem label="项目代码" prop="code">
                                <Input type="text" :maxlength=50 v-model="searchForm.code" placeholder="请输入项目代码"/>
                            </FormItem>
                            <Form-item style="margin-left:-35px" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset">重置</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Button @click="addTBaseProject" type="primary" icon="md-add">新增</Button>
                        <Dropdown @on-click="handleDropdown">
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
                        <Button type="dashed" @click="openSearch=!openSearch">{{ openSearch ? '关闭搜索' : '开启搜索' }}</Button>
                        <Button type="dashed" @click="openTip=!openTip">{{ openTip ? '关闭提示' : '开启提示' }}</Button>
                    </Row>
                    <div v-show="openTip">
                        <Alert show-icon>
                            已选择
                            <span class="select-count">{{ selectCount }}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                        </Alert>
                    </div>
                    <div>
                        <Table
                                :max-height="height"
                                :loading="loading" border :columns="columns" sortable="custom" :data="data" @on-sort-change="changeSort"
                                @on-selection-change="showSelect" ref="table">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="primary" @click="handleLook(row, index)" size="small">
                                    <Icon type="ios-eye-outline"/>
                                    查看
                                </Button>
                                <Dropdown :transfer=true>
                                    <Button size="small">
                                        更多操作
                                        <Icon type="md-arrow-dropdown"/>
                                    </Button>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="edit" @click.native="handleSetting(row, index)">
                                            <Icon type="md-cog"/>
                                            配置
                                        </DropdownItem>
                                        <DropdownItem name="edit" @click.native="handleEdit(row, index)">
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
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
                              @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator
                              show-sizer></Page>
                    </Row>
                </Col>
            </Row>
        </Card>
        <updateTBaseProject v-model="updateShow" :TBaseProjectId="TBaseProjectId" :modalTitle="title" :officeId="this.searchForm.officeId"
                            v-on:handleSearch="getDataList"></updateTBaseProject>
        <projectSetting v-model="settingShow" :TBaseProjectId="TBaseProjectId" :modalTitle="title"></projectSetting>
    </div>
</template>
<script>
    import {deleteTBaseProject, queryTBaseProjectList} from '@/api/healthy/tBaseProject'
    import updateTBaseProject from './updateTBaseProject'
    import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";
    import projectSetting from "./projectSetting";

    export default {
        components: {
            updateTBaseProject, projectSetting
        },
        data() {
            return {
                leftSpan: 4,
                span: 20,
                height: 500,
                maxHeight: "500px",
                expandIcon: "ios-arrow-back",
                treeLoading: false, // 树加载状态
                treeData: [], // 树数据
                editTitle: "", // 编辑节点名称
                searchKey: "", // 搜索树
                expand: true,
                drop: false,
                selectDate: null,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                search: '',
                data: [],
                columns: this.getTBaseProjectColumns(),
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
                    sort: 'code', // 默认排序字段
                    order: 'asc' // 默认排序方式
                },
                total: 0,
                title: '',
                TBaseProjectId: '',
                updateShow: false,
                settingShow: false,
                tableHeight: 200,
                colOptions: ["项目代码", "名称", "简称", "排序", "项目单位", "默认值", "结果类型", "是否进入小结", "是否进入报告", "LIS关联码", "操作"],
                colSelect: ["项目代码", "名称", "简称", "排序", "项目单位", "默认值", "结果类型", "是否进入小结", "是否进入报告", "LIS关联码", "操作"],
                csvData: [],
            }
        },
        methods: {
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
            changeSearch() {
                // 搜索树
                if (this.searchKey) {
                    this.treeLoading = true;
                    queryAllSectionOfficeData({sectionName: this.searchKey}).then(res => {
                        if (res.success) {
                            for (let i = 0; i < res.data; i++) {
                                res.data[i].title = res.data[i].sectionName;
                                res.data[i].children = [];
                            }
                            this.treeData = res.data;
                        }
                    }).finally(() => {
                        this.treeLoading = false;
                    })
                } else {
                    // 为空重新加载
                    this.getAllSectionOfficeData();
                }
            },
            getAllSectionOfficeData() {
                queryAllSectionOfficeData({}).then(res => {
                    if (res.success) {
                        let data = [];
                        for (let i = 0; i < res.data.length; i++) {
                            let obj = {...res.data[i]};
                            obj.title = obj.sectionName;
                            obj.expand = true;
                            data.push(obj);
                        }
                        this.treeData = data;
                    }
                }).finally(() => {
                    this.treeLoading = false;
                })
            },
            cancelEdit() {
                let data = this.$refs.tree.getSelectedNodes()[0];
                if (data) {
                    data.selected = false;
                }
                // 取消选择后获取全部数据
                this.selectNode = {};
                this.editTitle = "";
                this.searchForm.officeId = null;
                this.getDataList();
            },
            selectTree(v) {
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
                    this.editTitle = data.title;
                    // 重新加载表
                    this.searchForm.pageNumber = 1;
                    this.searchForm.pageSize = 10;
                    this.searchForm.officeId = data.id;
                    this.getDataList();
                } else {
                    this.cancelEdit();
                }
            },
            //新增
            addTBaseProject() {
                this.title = '新增';
                this.updateShow = true
                this.TBaseProjectId = '';
            },
            //编辑
            handleEdit(row, index) {
                this.title = '编辑';
                this.TBaseProjectId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handleLook(row, index) {
                this.title = '查看';
                this.TBaseProjectId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                this.loading = true;
                this.selectCount = 0;
                queryTBaseProjectList(this.searchForm).then(res => {
                    if (res && res.success) {
                        this.loading = false;
                        this.data = res.data.records;
                        this.total = res.data.total;
                        this.csvData = JSON.parse(JSON.stringify(res.data.records));
                    }
                }).catch(err => {
                    this.loading = false
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
                deleteTBaseProject({ids: ids}).then(res => {
                    this.userLoading = false;
                    this.$Modal.remove();
                    if (res && res.success) {
                        this.modalTaskVisible = false;
                        this.$Message.success('删除成功');
                        this.getDataList();
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
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
            //重置
            handleReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
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
            getTBaseProjectColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '项目代码',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'code',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '项目名称',
                        align: 'left',
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false,
                        minWidth: 200
                    },
                    {
                        title: '简称',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'shortName',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '项目单位',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'unitName',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '默认值',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'defaultValue',
                        sortable: false,
                        minWidth: 150
                    },
                    {
                        title: '结果类型',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'resultType',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '是否进入小结',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'inConclusion',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '是否进入报告',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'inReport',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: 'LIS关联码',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'relationCode',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                        fixed: 'right'
                    }
                ]
            },
            //列表上方更多操作
            handleDropdown(name) {
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
            handleSetting(row, index) {
                this.settingShow = true;
                this.title = '（' + row.name + '）配置';
                this.TBaseProjectId = row.id.toString();
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
                    this.height = height;
                }
            }
        },
        mounted() {
            this.getAllSectionOfficeData();
            this.getDataList();
            //table 高度设置
            this.setHeight();
        }
    }
</script>
<style scoped="less">
    .operation {
        margin-bottom: 10px;
    }
</style>
