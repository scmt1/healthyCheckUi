<style lang="less">
    .tProTypeList {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;


        .d-card {
            height: 100%;
            overflow: auto;

            .operation {
                margin-bottom: 10px;
            }

            #table {
                position: relative;
            }

            .vxe-table--body-wrapper table tr td {
                &:nth-child(6) div {
                    display: flex;
                }
            }

            .demo-spin-icon-load {
                animation: ani-demo-spin 1s linear infinite;
            }
        }
    }
</style>
<template>
    <div class="tProTypeList">
        <Card class="d-card">
            <Row v-show="openSearch">
                <Form ref="searchForm" :model="searchForm" :label-width="70" inline
                      @keydown.enter.native="handleSearch(1)">
                    <FormItem label="类型名称">
                        <Input v-model="searchForm.typeName" placeholder="请输入"/>
                    </FormItem>
                    <FormItem label="类型编码">
                        <Input v-model="searchForm.typeCode" placeholder="请输入"/>
                    </FormItem>
                    <FormItem style="margin-left:-35px" class="br">
                        <Button @click="handleSearch(1)" type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handleReset">重置</Button>
                    </FormItem>
                </Form>
            </Row>
            <div class="operation">
                <Button @click="addTProType" type="primary" icon="md-add">新增</Button>
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
                        <!--<DropdownItem name="removeAll">-->
                        <!--    <Icon type="md-trash"/>-->
                        <!--    批量删除-->
                        <!--</DropdownItem>-->
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
                                <checkbox v-for="item in colSelect" :label="item" :key="item"></checkbox>
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
            <div id="table" :style="{'height':loading?'200px':'','border':loading?'1px dashed #C1C1C1':''}">
                <vxe-table
                        v-if="data.length>0"
                        :data="data"
                        border
                        resizable
                        row-id="id"
                        :update-show-children="true"
                        :checkbox-config="{checkMethod: checkMethod }"
                        :tree-config="{rowField: 'id',parentField:'parentId', hasChild: 'hasChild'}"
                        @checkbox-change="checkBoxChange"
                        ref="table"
                >
                    <vxe-column type="checkbox" width="60" align="center"></vxe-column>
                    <vxe-column field="typeName" title="类型名称" minWidth="300" tree-node/>
                    <vxe-column field="typeCode" title="类型编码" minWidth="200" align="center"/>
                    <vxe-column field="orderNum" title="排序" minWidth="80" align="center"/>
                    <vxe-column field="remark" title="备注" minWidth="200" align="center"/>
                    <vxe-column title="操作" width="180" style="display:flex;" align="center">
                        <template #default="{ row,index }" style="display:flex;">
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
                                    <DropdownItem name="edit" @click.native="handleSet(row, index)" v-if="row.id.length==6">
                                        <Icon type="ios-cog"/>
                                        问诊配置
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
                    </vxe-column>
                </vxe-table>
                <Spin fix v-if="loading">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
            </div>
        </Card>
        <updateTProType v-model="updateShow"
                        :TProTypeId="TProTypeId"
                        :modalTitle="title"
                        v-on:handleSearch="handleSearch"></updateTProType>

        <ask-set v-model="askShow"
                 :TProTypeId="TProTypeId"
                 :TTypeName="TTypeName"
                 :modalTitle="title"></ask-set>
    </div>
</template>
<script>
    import {deleteTProType, queryTProTypeList} from '@/api/healthy/tProType'
    import updateTProType from './updateTProType'
    import askSet from "./askSet";

    export default {
        components: {
            updateTProType, askSet
        },
        data() {
            return {
                drop: false,
                askShow: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                search: '',
                data: [],
                columns: this.getTProTypeColumns(),
                openSearch: true,//打开搜索
                openTip: true,//打开提示
                loading: false, // 表单加载状态
                selectCount: 0, // 多选计数
                selectList: [], // 多选数据
                searchForm: {
                    parentId: "0",
                    typeName: "",
                    typeCode: ""
                },
                total: 0,
                title: '',
                TProTypeId: '',
                TTypeName: "",
                updateShow: false,
                tableHeight: 200,
                colOptions: ["类型名称", "类型编码", "排序", "备注", "操作"],
                colSelect: ["类型名称", "类型编码", "排序", "备注", "操作"],
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
            //允许勾选CheckBox
            checkMethod() {
                return true
            },
            checkBoxChange({records}) {
                this.selectCount = records.length;
                this.selectList = records;
            },
            //新增
            addTProType() {
                this.title = '新增';
                this.updateShow = true
                this.TProTypeId = '';
            },
            //编辑
            handleEdit(row, index) {
                this.title = '编辑';
                this.TProTypeId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handleLook(row, index) {
                this.title = '查看';
                this.TProTypeId = row.id.toString();
                this.updateShow = true;
            },
            //问诊配置
            handleSet(row) {
                this.TProTypeId = row.id.toString();
                this.TTypeName = row.typeName;
                this.askShow = true;
                this.title = "检查科目";
            },
            //分页查询
            getDataList() {
                this.loading = true;
                queryTProTypeList(this.searchForm).then(res => {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            res.data.forEach(i => {
                                i.hasChild = true;
                            })
                            this.data = res.data;
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            //单一删除
            deleteData(row, index) {
                if (row.children && row.children.length > 0) {
                    this.$Message.error("该类型下有子节点，暂不允许删除！！！");
                    return
                }
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
                    }
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
                deleteTProType({ids: ids}).then(res => {
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
            //查询
            handleSearch(type) {
                if (this.searchForm.typeCode || this.searchForm.typeName) {
                    this.searchForm.parentId = "";
                } else {
                    this.searchForm.parentId = "0";
                }
                this.getDataList();
            },
            //重置
            handleReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.typeCode = "";
                this.searchForm.typeName = "";
                this.searchForm.parentId = "0";
                // 重新加载数据
                this.getDataList();
            },
            //清空选择
            clearSelectAll() {
                this.selectCount = 0;
                this.$refs.table.clearAll();
            },
            //获取列表字段
            getTProTypeColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '类型名称',
                        align: 'left',
                        minWidth: 120,
                        key: 'typeName',
                        tree: true
                    }, {
                        title: '类型编码',
                        align: 'center',
                        minWidth: 120,
                        key: 'typeCode',
                        sortable: false
                    }, {
                        title: '排序',
                        align: 'center',
                        minWidth: 120,
                        key: 'orderNum',
                        sortable: false
                    }, {
                        title: '备注',
                        align: 'center',
                        minWidth: 120,
                        key: 'remark',
                        sortable: false
                    }, {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
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
            this.getDataList();
        }
    }
</script>
