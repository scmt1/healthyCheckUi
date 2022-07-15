<style lang="less">
    .harm {

        .ivu-drawer-mask, .ivu-drawer-wrap {
            z-index: 9999 !important;
        }

        /*.ivu-drawer-body {*/
        /*    height: calc(100vh - 104px);*/
        /*}*/

        .ivu-drawer-body {
            height: auto;
        }

        .vxe-table--header-wrapper {
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .vxe-table--render-default .vxe-body--row.row--checked, .vxe-table--render-default .vxe-body--row.row--radio {
            background-color: #EBF7FF;
        }

        .vxe-table--render-default .vxe-body--column:not(.col--ellipsis), .vxe-table--render-default .vxe-footer--column:not(.col--ellipsis), .vxe-table--render-default .vxe-header--column:not(.col--ellipsis) {
            padding: 6px 0;
        }

        .demo-drawer-footer {
            position: fixed;
            bottom: 0;
            right: 0;
            border-top: 1px solid #e8e8e8;
            padding: 10px 16px;
            text-align: right;
            background: #fff;
        }
    }
</style>
<template>
    <!--抽屉-->
    <Drawer :title="title"
            :mask-closable="false"
            :closable="true"
            v-model="show"
            class="harm"
            :width="width">
        <Row style="margin-bottom: 10px;" @keydown.enter.native="handleSearch">
            <Col span="12" style="display: flex;align-items: center;margin-right: 16px;">
                <h4 style="white-space: nowrap;margin-right: 4px;">关键字：</h4>
                <Input suffix="ios-search" placeholder="请输入关键字" v-model="searchForm.typeName"/>
            </Col>
            <Col>
                <Button type="primary" @click="handleSearch">
                    <Icon type="ios-search"/>
                    查询
                </Button>
                <Button @click="handleReset" type="default">重置</Button>
            </Col>
        </Row>

        <Alert show-icon>
            已选择
            <span class="select-count">{{ itemSelectedData.length }}</span> 项
            <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
        <!--项目列表-->
        <div style="position: relative;height: calc(100vh - 220px);overflow-y:auto;overflow-x:hidden;">
            <vxe-table
                    v-if="show"
                    border
                    resizable
                    ref="xTree"
                    row-id="id"
                    :tree-config="{rowField: 'id',parentField:'parentId', hasChild: 'hasChild'}"
                    :radio-config="{ checkMethod: checkMethod, highlight:true,trigger:'row'}"
                    :checkbox-config="{checkMethod: checkMethod }"
                    :data="data"
                    @radio-change="radioChange"
                    @checkbox-change="checkBoxChange">
                <vxe-column type="checkbox" align="center" v-if="selectType == 'checkbox'"/>
                <vxe-column type="radio" align="center" title="选择" v-if="selectType == 'radio'"/>
                <vxe-column field="typeName" title="类型名称" width="400" tree-node/>
                <vxe-column field="typeCode" title="类型编码" align="center"/>
            </vxe-table>
            <Spin size="large" fix v-if="loading"></Spin>
        </div>
        <div class="demo-drawer-footer" :style="{'width':width+'px'}">
            <Button style="margin-right: 8px" @click="show = false">关闭</Button>
            <Button type="primary" @click="submitClick">确定</Button>
        </div>
    </Drawer>
</template>
<script>
    import {getAllProTypeByTree} from '@/api/healthy/tProType'

    export default {
        name: "harmDrawer",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            modalTitle: {
                type: String,
                default: ""
            },
            selectType: {
                type: String,
                default: "radio"
            },
            selectedHarmList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                width: 620,
                title: "",
                data: [],
                loading: false,
                show: this.value,
                searchForm: {
                    typeName: "",
                    parentId: "a70c9d8cb45118c9f765c8ab1ee5559e"
                },
                columns: this.getTProTypeColumns(),
                itemSelectedData: [],
                defaultExpandRowKeys: [],
                defaultRadioSelect: "",
                defaultCheckboxSelect: []
            }
        },
        methods: {
            //单选选中
            radioChange(e) {//e.row obj
                if (this.selectType == "radio") {
                    this.itemSelectedData = [e.row];
                }
            },
            //是否可以选中选择框
            checkMethod({row}) {
                if (row.children && row.children.length > 0) {
                    return false;
                } else {
                    return true;
                }
            },
            //多选选中
            checkBoxChange(data) {//e.records Array
                if (this.selectType == "checkbox") {
					if(!this.itemSelectedData ||this.itemSelectedData.length==0){
						this.itemSelectedData = data.records;
					}
					else{
						let row= data.row;
						if(row ){
							if(data.checked){
								let filter = this.itemSelectedData.filter(ii=>ii.typeCode == row.typeCode);
								if(!filter||filter.length==0){
									this.itemSelectedData.push(row);
								}
							}
							else{
								for (let j = 0; j < this.itemSelectedData.length; j++) {
									if(this.itemSelectedData[j].typeCode == row.typeCode){
										this.itemSelectedData.splice(j,1);
										break;
									}
								}
							}
						}

					}

                }
            },
            //分页查询
            getDataList() {
                this.loading = true;
                getAllProTypeByTree(this.searchForm).then(res => {
                    if (res.success) {
                        res.data.forEach(i => {
                            i.hasChild = true;
                        })
                        this.data = res.data;
                        if (this.selectedHarmList && this.selectedHarmList.length > 0) {
                            if (this.selectType == 'radio') {
                                let findData1 = this.findData(this.data, this.selectedHarmList[0].typeCode, this.selectedHarmList[0].typeName);
                                if (findData1) {
                                    let parentData = this.findParentData(this.data, findData1.parentId);
                                    this.$refs.xTree.setTreeExpand(parentData, true)
                                }
                                this.$refs.xTree.setRadioRow(findData1)
                            } else {
                                for (let i = 0; i < this.selectedHarmList.length; i++) {
                                    let findData1 = this.findData(this.data, this.selectedHarmList[i].typeCode, this.selectedHarmList[i].typeName);
                                    if (findData1) {
                                        let parentData = this.findParentData(this.data, findData1.parentId);
                                        this.$refs.xTree.setTreeExpand(parentData, true)
                                    }
                                    this.$refs.xTree.setCheckboxRow(findData1, true)
                                }
                            }
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            findData(arr, typeCode, typeName) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].typeCode == typeCode || arr[i].typeName == typeName) {
                        return arr[i];
                    } else {
                        if (arr[i].children && arr[i].children.length > 0) {
                            let data = this.findData(arr[i].children, typeCode, typeName);
                            if (data) {
                                return data;
                            }
                        }
                    }
                }
            },
            findParentData(arr, parentId) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id == parentId) {
                        return arr[i];
                    } else {
                        if (arr[i].children && arr[i].children.length > 0) {
                            let data = this.findParentData(arr[i].children, parentId);
                            if (data) {
                                return data;
                            }
                        }
                    }
                }
            },
            //查询
            handleSearch() {
                if (this.searchForm.typeName) {
                    this.searchForm.parentId = "";
                } else {
                    this.searchForm.parentId = "a70c9d8cb45118c9f765c8ab1ee5559e";
                }
                this.getDataList();
            },
            //重置
            handleReset() {
                this.searchForm.parentId = "a70c9d8cb45118c9f765c8ab1ee5559e";
                this.searchForm.typeName = "";
                // 重新加载数据
                this.getDataList();
            },
            //确认选中
            submitClick() {
                this.$emit("harmReback", this.itemSelectedData);
                this.closeModal(false);
            },
            //清空选择
            clearSelectAll() {
                this.itemSelectedData = [];
                this.$refs.xTree.clearAll();
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
                        width: 100,
                        key: 'typeCode',
                        sortable: false
                    }
                ]
            },
            //关闭弹出框
            closeModal(val) {
                this.$emit('input', val);
            }
        },
        deactivated() {
            this.$destroy("harmDrawer");
        },
        watch: {
            value(val) {
                this.show = val
            },
            show(val) {
                this.defaultExpandRowKeys = [];
                this.title = this.modalTitle;
                this.itemSelectedData = [];

                if (val) {
                    this.itemSelectedData = this.selectedHarmList;
                    this.getDataList();
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>
