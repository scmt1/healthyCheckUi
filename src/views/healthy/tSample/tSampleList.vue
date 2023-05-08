<style lang="less">
    .tSampleList {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        .d-card {
            height: 100%;
            overflow: auto;

            .operation {
                margin-bottom: 10px;
            }

            .page {
                margin-top: 15px !important;
            }
        }
    }
</style>
<template>
    <div class="tSampleList">
        <Card class="d-card">
            <Row v-show="openSearch" @keydown.enter.native="handleSearch">
                <Form ref="searchForm" :model="searchForm" inline :label-width="70">
                    <Form-item label="名称">
                        <Input type="text"
                               v-model="searchForm.name"
                               v-width="150"
                               placeholder="请输入名称"/>
                    </Form-item>
                    <Form-item label="标本代码">
                        <Input type="text"
                               v-model="searchForm.code"
                               v-width="150"
                               placeholder="请输入标本代码"/>
                    </Form-item>
                    <Form-item label="关联码">
                        <Input type="text"
                               v-model="searchForm.liscode"
                               v-width="150"
                               placeholder="请输入关联码"/>
                    </Form-item>
                    <Form-item style="margin-left:-35px" class="br">
                        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handleReset">重置</Button>
                    </Form-item>
                </Form>
            </Row>
            <div class="operation">
                <Button @click="addTSample" type="primary" icon="md-add">新增</Button>
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
                    <span class="select-count">{{selectCount}}</span> 项
                    <a class="select-clear" @click="clearSelectAll">清空</a>
                    <span style="float: right;">点击右上角按钮配置动态列↑</span>
                </Alert>
            </div>
            <div>
                <Table
                        :max-height="height"
                        :loading="loading" border :columns="columns" sortable="custom" :data="data"
                        @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table">
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
                <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                      @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                      size="small" show-total show-elevator show-sizer></Page>
            </Row>
        </Card>
        <updateTSample v-model="updateShow" :TSampleId="TSampleId" :modalTitle="title"
                       v-on:handleSearch="handleSearch"></updateTSample>
    </div>
</template>
<script>
    import {deleteTSample, queryTSampleList} from '@/api/healthy/tSample'
    import updateTSample from './updateTSample'

    export default {
        components: {
            updateTSample
        },
        data() {
            return {
                height: 300,
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                search: '',
                data: [],
                columns: this.getTSampleColumns(),
                openSearch: true,//打开搜索
                openTip: true,//打开提示
                loading: true, // 表单加载状态
                selectCount: 0, // 多选计数
                selectList: [], // 多选数据
                searchForm: {
                    name: "",
                    code: "",
                    liscode: '',
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    sort: 'createTime', // 默认排序字段
                    order: 'desc' // 默认排序方式
                },
                total: 0,
                title: '',
                TSampleId: '',
                updateShow: false,
                tableHeight: 200,
                colOptions: ["名称", "条码份数", "规格", "是否需要采血", "标本代码", "排序", "是否打印", "关联码", "容量", "操作"],
                colSelect: ["名称", "条码份数", "规格", "是否需要采血", "标本代码", "排序", "是否打印", "关联码", "容量", "操作"],
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
                        data: this.data
                    });
                }
            },
            //新增
            addTSample() {
                this.title = '新增';
                this.updateShow = true
                this.TSampleId = '';
            },
            //编辑
            handleEdit(row, index) {
                this.title = '编辑';
                this.TSampleId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handleLook(row, index) {
                this.title = '查看';
                this.TSampleId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                this.loading = true;
                this.searchForm.id = null;
                queryTSampleList(this.searchForm).then(res => {
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
                deleteTSample({ids: ids}).then(res => {
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
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.searchForm.name = "";
                this.searchForm.code = "";
                this.searchForm.liscode = "";
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
            getTSampleColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '名称',
                        align: 'center',
                        key: 'name',
                        minWidth:80,
                        sortable: false,
                        tooltip:true,
                        ellipsis:true
                    }, {
                        title: '条码份数',
                        align: 'center',
                        key: 'barcodeNum',
                        minWidth:120,
                        sortable: false
                    },  {
                        title: '规格',
                        align: 'center',
                        key: 'spec',
                        minWidth:80,
                        sortable: false
                    }, {
                        title: '是否采血',
                        align: 'center',
                        minWidth:120,
                        key: 'needTakeBlood',
                        sortable: false
                    }, {
                        title: '标本代码',
                        align: 'center',
                        minWidth:120,
                        key: 'code',
                        sortable: false
                    }, {
                        title: '排序',
                        align: 'center',
                        minWidth:80,
                        key: 'orderNum',
                        sortable: false
                    }, {
                        title: '是否打印',
                        align: 'center',
                        minWidth:120,
                        key: 'isPrint',
                        sortable: false
                    }, {
                        title: '关联码',
                        align: 'center',
                        key: 'liscode',
                        minWidth:100,
                        sortable: false
                    }, {
                        title: '容量',
                        align: 'center',
                        minWidth:80,
                        key: 'capacity',
                        sortable: false
                    }, {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                        fixed:'right'
                    }
                ]
            },
            //动态列实现
            checkboxChange: function (data) {
                var columnss = this.getTSampleColumns();
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
                    this.height = height;
                }
            }
        },
        mounted() {
            this.getDataList();
            this.setHeight();
        }
    }
</script>
