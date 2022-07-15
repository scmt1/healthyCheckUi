<style lang="less">
    .tPacsDataList {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
        /*最外层div样式设置*/
        overflow-x: hidden;

        ::-webkit-scrollbar {
            width: 6px;
            background-color: #d8d8d8;
        }

        /* 滚动槽 */

        ::-webkit-scrollbar-track {
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #bfc1c4;
        }

        .ivu-card-body {
            height: 100%;
        }

        .search {
            .ivu-select {
                width: 190px !important;
            }

            .ivu-input-wrapper {
                width: 200px !important;
            }
        }

        .listDiv {
            overflow-y: auto;
            min-height: 300px;
        }

        .ivu-table-tbody {
            max-height: calc(100vh - 250px);
        }

        .card {
            height: 100%;
        }

        .expand {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
        }
    }
</style>
<template>
    <div class="tPacsDataList">
        <Row :gutter="4" style="flex-wrap: nowrap; height: 100%;">
            <Col :span="outLeftSpan" v-if="expand">
                <Card class="card">
                    <Row>
                        <div style="width: 250px">
                            <Alert show-icon>
                                当前选择：
                                <span class="select-title">{{editTitle}}</span>
                                <br/>
                                <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
                            </Alert>
                            <Input v-model="searchKey" suffix="ios-search" @on-change="search" placeholder="输入搜索类型"
                                   clearable/>
                        </div>
                        <div class="tree-bar"
                             style="overflow-y: auto;min-width: 200px;max-width:250px;max-height:660px;">
                            <Tree ref="tree" :data="treeData" :render="renderContent"
                                  @on-select-change="selectTree"></Tree>
                            <Spin size="large" fix v-if="treeLoading"></Spin>
                        </div>
                    </Row>

                </Card>
            </Col>

            <div class="expand">
                <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
            </div>

            <Col :span="outSpan" ref="divHeight" style="padding-right: 20px;">
                <Card style="height: 100%;overflow-y: auto;">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="PACS管理" name="first">
                            <Col span="24" style="margin-top: 10px;">
                                <Row v-show="openSearch" ref="form">
                                    <Form ref="searchForm" :model="searchForm" inline :label-width="70"
                                          @keydown.enter.native="handSearch">
                                        <Form-item label="标识码">
                                            <Input v-model="searchForm.code" placeholder="标识码"></Input>
                                        </Form-item>
                                        <Form-item label="设备型号">
                                            <Input v-model="searchForm.equipmentManufacturerModel" placeholder="设备型号"></Input>
                                        </Form-item>
                                        <Form-item label="检查者">
                                            <Input v-model="searchForm.personName" placeholder="检查者"></Input>
                                        </Form-item>
                                        <Form-item label="检查项目" v-if="drop">
                                            <Input v-model="searchForm.item" placeholder="检查项目"></Input>
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
                                <div ref="operation" class="operation">
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
                                    <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? '关闭搜索' : '开启搜索'}}
                                    </Button>
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
                                <div ref="openTip" v-show="openTip">
                                    <Alert show-icon>
                                        已选择
                                        <span class="select-count">{{selectCount}}</span> 项
                                        <a class="select-clear" @click="clearSelectAll">清空</a>
                                        <span style="float: right;">点击右上角按钮配置动态列↑</span>
                                    </Alert>
                                </div>
                                <div>
                                    <Table :loading="loading" border :columns="columns" sortable="custom" :data="data"
                                           @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table" :max-height="tableHeight">
                                        <template slot-scope="{ row, index }" slot="action">
                                            <Button type="primary" @click="handLook(row, index)" size="small">
                                                <Icon type="ios-eye-outline"/>
                                                查看
                                            </Button>
                                            <Button type="primary" @click="handEdit(row, index)" size="small">
                                                <Icon type="ios-create-outline"/>
                                                编辑
                                            </Button>
                                        </template>
                                    </Table>
                                </div>
                                <Row ref="page" type="flex" justify="end" class="page">
                                    <Page :current="searchForm.pageNumber" :total="total" transfer
                                          :page-size="searchForm.pageSize"
                                          @on-change="changePage" @on-page-size-change="changePageSize"
                                          :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                                </Row>
                            </Col>
                        </el-tab-pane>
                        <el-tab-pane label="体检结论" name="second">
                            <Col span="24" style="margin-top: 10px;">
                                <Row v-show="conOpenSearch" ref="form">
                                    <Form ref="conclusionSearchForm" :model="conclusionSearchForm" inline :label-width="70"
                                          @keydown.enter.native="handSearch">
                                        <Form-item label="识别码">
                                            <Input v-model="conclusionSearchForm.code" placeholder="识别码"></Input>
                                        </Form-item>
                                        <Form-item label="人员姓名">
                                            <Input v-model="conclusionSearchForm.personName" placeholder="人员姓名"></Input>
                                        </Form-item>
                                        <Form-item style="margin-left:-35px" class="br">
                                            <Button @click="conHandleSearch" type="primary" icon="ios-search">搜索</Button>
                                            <Button @click="conHandReset">重置</Button>
                                        </Form-item>
                                    </Form>
                                </Row>
                                <div ref="operation" class="operation">
                                    <Button type="success" @click="syncPacs" :loading="syncLoading">
                                        <Icon type="ios-loading" v-if="!syncLoading"></Icon>
                                        同步
                                    </Button>
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
                                    <Button type="dashed" @click="conOpenSearch=!conOpenSearch">{{conOpenSearch ? '关闭搜索' : '开启搜索'}}
                                    </Button>
                                    <Button type="dashed" @click="conOpenTip=!conOpenTip">{{conOpenTip ? '关闭提示' : '开启提示'}}</Button>
                                    <div style="float: right;">
                                        <Poptip transfer trigger="click" placement="bottom-end" title="动态列">
                                            <Button icon="md-list"></Button>
                                            <div slot="content" style="position:relative;min-height:5vh">
                                                <Checkbox-group v-model="conOptions" @on-change="checkboxConChange">
                                                    <checkbox v-for="item in conSelect" :label="item" :key="item"></checkbox>
                                                </Checkbox-group>
                                            </div>
                                        </Poptip>
                                    </div>
                                </div>
                                <div ref="openTip" v-show="conOpenTip">
                                    <Alert show-icon>
                                        已选择
                                        <span class="select-count">{{conSelectCount}}</span> 项
                                        <a class="select-clear" @click="clearSelectAll('con',$event)">清空</a>
                                        <span style="float: right;">点击右上角按钮配置动态列↑</span>
                                    </Alert>
                                </div>
                                <div>
                                    <Table :loading="loading"
                                           border
                                           :columns="conColumns"
                                           sortable="custom"
                                           :data="conData"
                                           @on-sort-change="changeSort"
                                           @on-selection-change="showSelect('con',$event)" ref="conTable" :max-height="tableHeight">
                                        <template slot-scope="{ row, index }" slot="action">
                                            <Button type="primary" @click="handLook(row, index)" size="small">
                                                <Icon type="ios-eye-outline"/>
                                                查看
                                            </Button>
                                        </template>
                                    </Table>
                                </div>
                                <Row ref="page" type="flex" justify="end" class="page">
                                    <Page :current="conclusionSearchForm.pageNumber" :total="conTotal" transfer
                                          :page-size="conclusionSearchForm.pageSize"
                                          @on-change="changePage('con',$event)" @on-page-size-change="changePageSize('con',$event)"
                                          :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                                </Row>
                            </Col>
                        </el-tab-pane>
                    </el-tabs>
                </Card>
            </Col>
        </Row>
        <updateTPacsData v-model="updateShow" :TPacsDataId="TPacsDataId" :modalTitle="title"
                         v-on:handSearch="handSearch"></updateTPacsData>
    </div>
</template>
<script>
    import {queryTPacsDataList} from '@/api/healthy/tPacsData'
    import {queryTConclusionList, syncTConclusion} from '@/api/healthy/tConclusion'
    import updateTPacsData from './updateTPacsData'
    import {
        getDictDataByType,
        getAllDictDataList,
    } from '@/api/index';

    export default {
        components: {
            updateTPacsData
        },
        data() {
            return {
                syncLoading: false,
                href: '',
                activeName: 'first',
                tPacsDataTypeArry: [],//LIS类型
                dictId: '',//字典id
                centerDiv: '',
                treeDiv: '250px',
                listDiv: '',
                editTitle: '',
                changeListDiv: '',//mounted--进行div宽高运算
                expand: true,
                searchKey: '',
                treeData: [],
                expandIcon: 'ios-arrow-back',
                outLeftSpan: 4,
                outSpan: 20,
                treeLoading: false,
                selectNode: {},
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                data: [],
                columns: this.getTPacsDataColumns(),
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
                    sort: 'create_time', // 默认排序字段
                    order: 'desc', // 默认排序方式
                    type: '',//类型
                    code: '',//识别码
                    personName: '',//检查者
                    item: '',//检查项目
                    equipmentManufacturerModel: "",//设备型号
                },
                conclusionSearchForm: {
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    code: "", // 影响所见
                    personName: "",//类型
                },
                conData: [],
                conTotal: 0,
                conColumns: this.getConColumns(),
                conOpenTip: true,//打开提示
                conOpenSearch: true,//打开搜索
                conSelectCount: 0,
                conSelectList: 0,
                total: 0,
                title: '',
                TPacsDataId: '',
                updateShow: false,
                tableHeight: 200,
                colOptions: ["识别码", "设备类型", "设备型号", "检查者", "检查项目", "数据", "检查时间", "操作"],
                colSelect: ["识别码", "设备类型", "设备型号", "检查者", "检查项目", "数据", "检查时间", "操作"],
                conOptions: ['体检结论', '影像所见', '检查部位', '影像类型', '人员编码', '创建时间'],
                conSelect: ['体检结论', '影像所见', '检查部位', '影像类型', '人员编码', '创建时间']
            }
        },
        methods: {
            //同步影像数据
            syncPacs() {
                if (!this.editTitle) {
                    this.$Message.info("请先选择左侧树");
                    return;
                }
                let id = "";
                if (this.editTitle.indexOf("DR") > -1) {
                    id = "fe49939bfaf74cac8ff191ddd959f5f5";
                }

                if (this.editTitle.indexOf("CT") > -1) {
                    id = "123456";
                }

                if (this.editTitle.indexOf("B超") > -1) {
                    id = "75e0180d8eaa47e4a03b19aa548be9ed";
                }

                if (this.editTitle.indexOf("心电图") > -1) {
                    id = "321654";
                }
                this.syncLoading = true;
                syncTConclusion({id}).then(res => {
                    console.log(res);
                }).finally(() => {
                    setTimeout(() => {
                        this.syncLoading = false;
                        this.$Message.success("同步成功")
                        this.conHandReset();
                    }, 1500)
                })
            },
            //tab Click
            handleClick(tab, event) {
            },
            //影像结论
            getConclusionData() {
                queryTConclusionList(this.conclusionSearchForm).then(res => {
                    if (res.success && res.data) {
                        this.conData = res.data.records;
                        this.conTotal = res.data.total;
                    }
                })
            },
            conHandleSearch() {
                this.conclusionSearchForm.pageSize = 10;
                this.getConclusionData();
            },
            conHandReset() {
                this.conclusionSearchForm.pageNumber = 1;
                this.conclusionSearchForm.pageSize = 10;
                this.conclusionSearchForm.code = "";
                this.conclusionSearchForm.personName = "";
                // 重新加载数据
                this.getConclusionData();
            },
            renderContent(h, {root, node, data}) {
                let icon = "";
                return h("span", [
                    h("span", [
                        h("Icon", {
                            props: {
                                type: icon,
                                size: "16"
                            },
                            style: {
                                "margin-right": "8px",
                                "margin-bottom": "3px"
                            }
                        }),
                        h("span", data.title)
                    ])
                ]);
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
                this.searchForm.type = "";//重置类型
                this.conclusionSearchForm.type = "";//重置类型

                if (this.activeName == "first") {
                    this.handReset();
                } else {
                    this.conHandReset();
                }
            },
            /**
             * 搜索树
             * */
            search() {
                if (this.searchKey) {
                    this.treeLoading = true;
                    // 搜索框对应data对象
                    getAllDictDataList({
                        name: "",
                        status: "",
                        dictId: this.dictId,
                        title: this.searchKey,//数据名称
                    }).then((res) => {
                        if (res.success) {
                            this.treeLoading = false;
                            this.treeData = this.setTreeData(res.data.content);
                        }
                    });
                } else {
                    this.getTreeData();// 为空重新加载
                }
            },
            /**
             * 树 选择
             */
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
                    this.editTitle = v[0].title;

                    if (this.activeName == 'first') {
                        // 重新加载表
                        this.searchForm.pageNumber = 1;
                        this.searchForm.type = v[0].value;
                        this.getDataList();
                    } else {
                        this.conclusionSearchForm.pageNumber = 1;
                        this.conclusionSearchForm.type = v[0].value;
                        this.getConclusionData();
                    }
                } else {
                    this.cancelEdit();
                }
            },
            //扩展 收缩按钮
            changeExpand() {
                this.expand = !this.expand;
                if (this.expand) {
                    //扩展伸缩--扩展
                    this.expandIcon = "ios-arrow-back";
                    this.centerDiv = '';//伸缩按钮--定位调整--扩展状态下
                    this.treeDiv = '250px';//树状区域--宽度调整--扩展状态下
                    this.listDiv = '';//功能列表区域--边距调整--扩展状态下
                } else {
                    //扩展伸缩--收缩
                    this.expandIcon = "ios-arrow-forward";
                    this.centerDiv = '';//伸缩按钮--定位调整--收缩状态下
                    this.treeDiv = '0px';//树状区域--宽度调整--收缩状态下
                    this.listDiv = '';//功能列表区域--边距调整--收缩状态下
                }
                //div宽高运算
                this.changeListDiv = 'width:calc(100% - 64px - ' + this.treeDiv + ')';//功能列表区域--宽度
                this.listDiv = this.listDiv + this.changeListDiv;//功能列表区域--style:左边距+宽度
            },
            //列表上方更多操作
            handDropdown(name) {
                if (name == "refresh") {
                    this.getDataList();
                } else if (name == "removeAll") {
                    this.delAll();
                } else if (name == "export") {
                    let exColumns = this.columns.filter(function (v) {
                        return v.title != "操作" && v.type != 'selection'
                    });
                    this.$refs.table.exportCsv({
                        filename: '本页数据',
                        columns: exColumns,
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
            //编辑
            handEdit(row, index) {
                this.title = '编辑';
                this.TPacsDataId = row.id.toString();
                this.updateShow = true;
            },
            //查看
            handLook(row, index) {
                this.title = '查看';
                this.TPacsDataId = row.id.toString();
                this.updateShow = true;
            },
            //分页查询
            getDataList() {
                this.loading = true;
                queryTPacsDataList(this.searchForm).then(res => {
                    if (res.success) {
                        this.loading = false;
                        this.data = res.data.records;
                        this.total = res.data.total;
                    }
                });
            },
            //改变页码
            changePage(type, v) {
                if (type == 'con') {
                    this.conclusionSearchForm.pageNumber = v;
                    this.getConclusionData();
                } else {
                    this.searchForm.pageNumber = type;
                    this.getDataList();
                }
                this.clearSelectAll();
            },
            //改变每页显示数据的条数
            changePageSize(type, v) {
                if (type == 'con') {
                    this.conclusionSearchForm.pageSize = v;
                    this.getConclusionData();
                } else {
                    this.searchForm.pageSize = type;
                    this.getDataList();
                }
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
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
                this.searchForm.code = "";
                this.searchForm.equipmentManufacturerModel = "";
                this.searchForm.personName = "";
                this.searchForm.item = "";
                this.selectDate = null;
                // 重新加载数据
                this.getDataList();
            },
            //显示选择
            showSelect(type, e) {
                if (type == 'con') {
                    this.conSelectList = e;
                    this.conSelectCount = e.length;
                } else {
                    this.selectList = type;
                    this.selectCount = type.length;
                }
            },
            //清空选择
            clearSelectAll(type) {
                if (type == 'con') {
                    this.$refs.conTable.selectAll(false);
                } else {
                    this.$refs.table.selectAll(false);
                }
            },
            //获取列表字段
            getTPacsDataColumns() {
                let _this = this;
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '识别码',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'code',
                        sortable: false
                    },
                    {
                        title: '设备类型',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'type',
                        sortable: false,
                        render: (h, params) => {
                            let type = params.row.type;
                            if (type) {
                                let typeName = "";
                                let tab = _this.tPacsDataTypeArry.filter(i => i.value == type);
                                if (tab && tab.length > 0) {
                                    typeName = tab[0].title;
                                    this.$set(_this.data[params.index], 'type', tab[0].title);
                                    if (typeName && typeName.length > 10) {
                                        typeName = typeName.substring(0, 10) + "..."
                                    }
                                    return h('Tooltip', {
                                        props: {
                                            content: typeName,
                                            placement: 'bottom',
                                            transfer: true
                                        }
                                    }, tab[0].title);
                                }
                            }
                            let newTypeName = "";
                            if (type) {
                                newTypeName = type.toString();
                            }

                            if (newTypeName && newTypeName.length > 10) {
                                newTypeName = newTypeName.substring(0, 10) + "..."
                            }
                            return h('Tooltip', {
                                props: {
                                    content: type,
                                    placement: 'bottom',
                                    transfer: true
                                }
                            }, newTypeName);
                        }
                    },
                    {
                        title: '设备型号',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'equipmentManufacturerModel',
                        sortable: false
                    },
                    {
                        title: '检查者',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false,
                        render: (h, params) => {
                            let type = params.row.personName;
                            if (type) {
                                let typeName = "";
                                if (type == "null") {
                                    return h('Tooltip', {
                                        props: {
                                            content: typeName,
                                            placement: 'bottom',
                                            transfer: true
                                        }
                                    }, typeName);
                                }
                            }
                            return h('Tooltip', {
                                props: {
                                    content: type,
                                    placement: 'bottom',
                                    transfer: true
                                }
                            }, type);
                        }
                    },
                    {
                        title: '检查项目',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'item',
                        sortable: false
                    },
                    {
                        title: '数据',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'data',
                        sortable: false,
                        render: (h, params) => {
                            let type = params.row.data && params.row.data.length > 15 ? params.row.data.substring(0, 12) + "..." : params.row.data;
                            return h('Tooltip', {
                                props: {
                                    content: params.row.data,
                                    placement: 'bottom',
                                    transfer: true,
                                    maxWidth: 200,
                                    transferClassName: "dataListTooltip"

                                }
                            }, type);
                        }
                    },
                    {
                        title: '检查时间',
                        key: 'time',
                        sortable: true,
                        align: 'center',
                        width: 180,
                    },
                    {
                        title: '数据同步时间',
                        key: 'createTime',
                        sortable: false,
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
            getConColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '识别码',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'code',
                        sortable: false
                    }, {
                        title: '人员姓名',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false
                    }, {
                        title: '影像类型',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'type',
                        sortable: false
                    }, {
                        title: '检查部位',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'viewpos',
                        sortable: false
                    }, {
                        title: '体检结论',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'comments',
                        sortable: false
                    }, {
                        title: '影像所见',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'seeing',
                        sortable: false
                    }, {
                        title: '创建时间',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'createTime',
                        sortable: false
                    }
                ]
            },
            //动态列实现
            checkboxChange: function (data) {
                let columnSs = this.getTPacsDataColumns();
                this.columns = columnSs.filter(function (v) {
                    return data.indexOf(v.title) > -1 || v.type == 'selection'
                })
            },
            //动态列实现
            checkboxConChange: function (data) {
                let columnSs = this.getConColumns();
                this.conColumns = columnSs.filter(function (v) {
                    return data.indexOf(v.title) > -1 || v.type == 'selection'
                })
            },
            /**
             * 获取树数据 LIS类型
             */
            getTreeData() {
                let _this = this;
                _this.treeLoading = true;

                getDictDataByType('t_pacs_data_type').then(res => {
                    if (res.success) {
                        _this.treeLoading = false;
                        _this.tPacsDataTypeArry = res.data;
                        _this.dictId = _this.tPacsDataTypeArry[0].dictId;
                        _this.treeData = _this.setTreeData(res.data);//树化 LIS类型数据
                        _this.getDataList();
                    }
                })
            },
            /**
             * 初始化树结构
             * @param data
             * @returns {[]}
             */
            setTreeData(data) {
                let _this = this;
                let item = [];
                let num = 0;

                for (let i in data) {
                    let children = [];
                    let expand = false;
                    if (data[i].children && data[i].children.length > 0) {
                        num += 1;
                        children = _this.setTreeData(data[i].children);
                        if (num == 1) {
                            expand = true;
                        }
                    }
                    item.push({
                        id: data[i].id,
                        title: data[i].title,
                        value: data[i].value,
                        children: children,
                        expand: expand,
                    });
                }
                return item;
            },
            //table 高度设置
            setHeight() {
                let height = window.innerHeight - 340;
                if (height <= 1220) {
                    height = height - 40;
                }
                this.tableHeight = height;

                window.onresize = () => {
                    height = window.innerHeight - 340;
                    if (height <= 1220) {
                        height = height - 40;
                    }
                    this.tableHeight = height;
                }
            }
        },
        mounted() {
            //div宽高运算
            // this.changeListDiv = 'width:calc(100% - 64px - ' + this.treeDiv + ')';//功能列表区域--宽度
            // this.listDiv = this.listDiv + this.changeListDiv + '';//功能列表区域--style:左边距+宽度
            // // 计算高度
            // let height = document.documentElement.clientHeight;
            // this.maxHeight = Number(height - 287) + "px";
            // let divHeight = this.$refs.divHeight.$el.offsetHeight;
            // let form = this.$refs.form.$el.offsetHeight;
            // let operation = this.$refs.operation.offsetHeight;
            // let openTip = this.$refs.openTip.offsetHeight;
            // let page = this.$refs.page.$el.offsetHeight;
            // this.tableHeight = divHeight - form - operation - openTip - page - 65;
            this.getTreeData();
            this.getConclusionData();
            this.setHeight();
        }
    }
</script>
<style scoped="less">
    .operation {
        margin-bottom: 10px;
    }
</style>
