<style lang="less">
    .tSectionOfficeList {
    }
</style>
<template>
    <div class="tSectionOfficeList">
        <Card>
            <Row v-show="openSearch" @keydown.enter.native="handleSearch">
                <Form ref="searchForm" :model="searchForm" inline :label-width="70" @submit.native.prevent>
                    <FormItem label="科室编码" prop="sectionCode">
                        <Input type="text" :maxlength=50 v-model="searchForm.sectionCode" placeholder="请输入科室编码" v-width="120"/>
                    </FormItem>
                    <FormItem label="科室名称" prop="sectionName">
                        <Input type="text" :maxlength=50 v-model="searchForm.sectionName" placeholder="请输入科室名称" v-width="120"/>
                    </FormItem>
                    <FormItem label="科室简拼" prop="sectionAlphbet">
                        <Input type="text" :maxlength=50 v-model="searchForm.sectionAlphbet" placeholder="请输入科室简拼" v-width="120"/>
                    </FormItem>
                    <FormItem label="检查类型" prop="checkType">
                        <Select v-model="checkTypeList" placeholder="请选择" clearable v-width="120" multiple>
                            <Option v-for="(item, i) in checkTypePriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                    <Form-item style="margin-left:-35px" class="br">
                        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handleReset">重置</Button>
                    </Form-item>
                </Form>
            </Row>
            <Row class="operation">
                <Button @click="addTSectionOffice" type="primary" icon="md-add">新增</Button>
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
                <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? '关闭搜索' : '开启搜索'}}</Button>
                <Button type="dashed" @click="openTip=!openTip">{{openTip ? '关闭提示' : '开启提示'}}</Button>
            </Row>
            <div v-show="openTip">
                <Alert show-icon>
                    已选择
                    <span class="select-count">{{selectCount}}</span> 项
                    <a class="select-clear" @click="clearSelectAll">清空</a>
                </Alert>
            </div>
            <div>
                <Table :loading="loading" border :columns="columns" sortable="custom" :data="data" @on-sort-change="changeSort"
                       @on-selection-change="showSelect" ref="table" :max-height="tableMaxHeight">
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
                      @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer
                      transfer></Page>
            </Row>
        </Card>
        <updateTSectionOffice v-model="updateShow" :TSectionOfficeId="TSectionOfficeId" :modalTitle="title"
                              v-on:handleSearch="getDataList"></updateTSectionOffice>
    </div>
</template>
<script>
    import {deleteTSectionOffice, queryTSectionOfficeList} from '@/api/healthy/tSectionOffice'
    import updateTSectionOffice from './updateTSectionOffice'
    import {getDictDataByType} from "../../../api";

    export default {
        components: {
            updateTSectionOffice
        },
        data() {
            return {
                tableMaxHeight: 500,
                drop: false,
                selectDate: null,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                search: '',
                data: [],
                columns: this.getTSectionOfficeColumns(),
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
                    sort: 'order_num', // 默认排序字段
                    order: 'asc' // 默认排序方式
                },
                total: 0,
                title: '',
                TSectionOfficeId: '',
                updateShow: false,
                tableHeight: 200,
                colOptions: ["科室编码", "科室名称", "科室简拼", "排序", "联系人", "联系人电话", "检查类型", "操作"],
                colSelect: ["科室编码", "科室名称", "科室简拼", "排序", "联系人", "联系人电话", "检查类型", "操作"],
                csvData: [],
                checkTypePriority: [],
                checkTypeList: [],
            }
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
                        data: this.csvData
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
            addTSectionOffice() {
                this.title = '新增';
                this.updateShow = true
                this.TSectionOfficeId = '';
            },
            //编辑
            handleEdit(row, index) {
                this.title = '编辑';
                this.TSectionOfficeId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handleLook(row, index) {
                this.title = '查看';
                this.TSectionOfficeId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                this.loading = true;
                this.selectCount = 0;
                this.searchForm.id = null;
                queryTSectionOfficeList(this.searchForm).then(res => {
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
                deleteTSectionOffice({ids: ids}).then(res => {
                    this.userLoading = false;
                    this.$Modal.remove();
                    if (res && res.success) {
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
                this.searchForm.checkType = this.checkTypeList.join(",");
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
                this.checkTypeList = [];
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
            getTSectionOfficeColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '科室编码',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'sectionCode',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '科室名称',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'sectionName',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '科室简拼',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'sectionAlphbet',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '排序',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'orderNum',
                        sortable: false,
                        minWidth: 70
                    },
                    {
                        title: '联系人',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'contact',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '联系人电话',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'contactMobile',
                        sortable: false,
                        minWidth: 120
                    },
                    {
                        title: '检查类型',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'checkType',
                        sortable: false,
                        minWidth: 180
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                    }
                ]
            },
        },
        mounted() {
            getDictDataByType('checkType').then(res => {
                if (res.success) {
                    this.checkTypePriority = res.data;
                }
            })
            this.getDataList();
            let height = document.documentElement.clientHeight;
            this.tableMaxHeight = Number(height - 350);
        }
    }
</script>
<style scoped="less">
    .operation {
        margin-bottom: 10px;
    }
</style>
