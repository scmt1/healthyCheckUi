<style lang="less">
    .tGroupUnitList {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        .card {
            height: 100%;
            overflow: auto;

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
    <div class="tGroupUnitList">
        <Card class="card">
            <Row v-show="openSearch">
                <Form ref="searchForm" :model="searchForm" inline @keydown.enter.native="handleSearch">
                    <FormItem label="单位名称" :label-width="80">
                        <Input type="text" v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px"/>
                    </FormItem>
                    <FormItem label="信用代码" :label-width="80">
                        <Input type="text" v-model="searchForm.uscc" placeholder="请输入" clearable style="width: 200px"/>
                    </FormItem>
                    <FormItem label="联系人" :label-width="80">
                        <Input type="text" v-model="searchForm.linkMan2" placeholder="请输入" clearable style="width: 200px"/>
                    </FormItem>
                    <FormItem label="联系电话" :label-width="80">
                        <Input type="text" v-model="searchForm.linkPhone2" placeholder="请输入" clearable style="width: 200px"/>
                    </FormItem>
                    <FormItem :label-width="20">
                        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handleReset">重置</Button>
                    </FormItem>
                </Form>
            </Row>
            <div class="operation">
                <Button @click="addTGroupUnit" type="primary" icon="md-add">新增</Button>
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
            </div>
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
                      @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Card>
        <updateTGroupUnit v-model="updateShow" :TGroupUnitId="TGroupUnitId" :modalTitle="title"
                          v-on:handleSearch="handleSearch"></updateTGroupUnit>
        <addTGroupUnit v-model="addShow" :TGroupUnitId="TGroupUnitId" :modalTitle="title"
                          v-on:handleSearch="handleSearch"></addTGroupUnit>
    </div>
</template>
<script>
    import {deleteTGroupUnit, queryTGroupUnitList} from '@/api/healthy/tGroupUnit'
    import updateTGroupUnit from './updateTGroupUnit'
    import addTGroupUnit from './addTGroupUnit'

    export default {
        components: {
            updateTGroupUnit,
            addTGroupUnit
        },
        data() {
            return {
                height: 500,
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                search: '',
                data: [],
                columns: this.getTGroupUnitColumns(),
                openSearch: true,//打开搜索
                openTip: true,//打开提示
                loading: true, // 表单加载状态
                selectCount: 0, // 多选计数
                selectList: [], // 多选数据
                searchForm: {
                    // 搜索框对应data对象
                    physicalType: '',
                    name: '',
                    uscc: '',
                    linkMan2: '',
                    linkPhone2: '',
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    startDate: null,//开始时间
                    endDate: null,//结束时间
                    sort: 'uscc', // 默认排序字段
                    order: 'asc' // 默认排序方式
                },
                total: 0,
                title: '',
                TGroupUnitId: '',
                updateShow: false,
                addShow: false,
                tableHeight: 200,
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
                    value: "放射体检",
                    title: "放射体检",
                }, {
                    id: '4',
                    value: "从业体检",
                    title: "从业体检",
                }],//体检类型
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        methods: {
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
                        data: this.data
                    });
                }
            },
            //新增
            addTGroupUnit() {
                this.title = '新增';
                this.addShow = true
                this.TGroupUnitId = '';
            },
            //编辑
            handleEdit(row, index) {
                this.title = '编辑';
                this.TGroupUnitId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handleLook(row, index) {
                this.title = '查看';
                this.TGroupUnitId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                this.loading = true;
                this.searchForm.physicalType = this.physicalType;
                queryTGroupUnitList(this.searchForm).then(res => {
                    if (res.success) {
                        this.loading = false;
                        this.data = res.data.records;
                        this.total = res.data.total;
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
                deleteTGroupUnit({ids: ids}).then(res => {
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
                this.searchForm.name = '';
                this.searchForm.uscc = '';
                this.searchForm.linkMan2 = '';
                this.searchForm.linkPhone2 = '';
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
            getTGroupUnitColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '单位名称',
                        align: 'center',
                        minWidth: 200,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    },
                    {
                        title: '信用代码',
                        align: 'center',
                        minWidth: 140,
                        ellipsis: true,
                        tooltip: true,
                        key: 'uscc',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.uscc) {
                                text = '--';
                            } else {
                                text = params.row.uscc;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
                    },
                    {
                        title: '体检类型',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'physicalType',
                        sortable: false
                    },
                    {
                        title: '所属地区',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'regionName',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.regionName) {
                                text = '--';
                            } else {
                                text = params.row.regionName;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
                    },
                    {
                        title: '行业类别',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'industryName',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.industryName) {
                                text = '--';
                            } else {
                                text = params.row.industryName;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
                    },
                    {
                        title: '经济类型',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'economicTypeName',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.economicTypeName) {
                                text = '--';
                            } else {
                                text = params.row.economicTypeName;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
                    },
                    {
                        title: '企业规模',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'businessScaleName',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.businessScaleName) {
                                text = '--';
                            } else {
                                text = params.row.businessScaleName;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
                    },
                    {
                        title: '联系人',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'linkMan2',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.linkMan2) {
                                text = '--';
                            } else {
                                text = params.row.linkMan2;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
                    },
                    {
                        title: '联系电话',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'linkPhone2',
                        sortable: false,
                        render: (h, params) => {
                            let text = "";
                            if (!params.row.linkPhone2) {
                                text = '--';
                            } else {
                                text = params.row.linkPhone2;
                            }
                            return h('div', [
                                h('Ellipsis', {
                                    props: {
                                        length: 20,
                                        text: text,
                                        tooltip: true,
                                        transfer: true
                                    }
                                }, text)
                            ]);
                        },
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
            //table 高度设置
            setHeight() {
                let height = window.innerHeight - 280;
                if (height <= 1220) {
                    height = height - 40;
                }
                this.height = height;

                window.onresize = (e) => {
                    height = window.innerHeight - 280;
                    if (height <= 1220) {
                        height = height - 40;
                    }
                    this.height = height;
                }
            }
        },
        mounted() {
            this.getDataList();
            //table 高度设置
            this.setHeight();
        }
    }
</script>
