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
                <Input suffix="ios-search" placeholder="请输入关键字" v-model="searchForm.name"/>
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
                    :radio-config="{ checkMethod: checkMethod, highlight:true,trigger:'row'}"
                    :data="data"
                    @radio-change="radioChange"
            >
                <vxe-column type="radio" align="center" title="选择" v-if="selectType == 'radio'"/>
                <vxe-column field="name" title="套餐名称" width="300"/>
                <vxe-column field="simpleSpell" title="套餐简拼" align="center"/>
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
    import {queryTComboList} from '@/api/healthy/tCombo'

    export default {
        name: "comboDrawer",
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
            comboId: {
                type: String,
                default: ""
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
                    type: "从业体检",
                    name: ""
                },
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
            //分页查询
            getDataList() {
                this.loading = true;
                queryTComboList(this.searchForm).then(res => {
                    this.data = res.data.records;

                    if (this.itemSelectedData && this.itemSelectedData.length > 0 || this.itemSelectedData[0].id) {
                        if (this.selectType == 'radio') {
                            let findData1 = this.findData(this.data, this.itemSelectedData[0].id);
                            this.$refs.xTree.setRadioRow(findData1)
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            findData(arr, id) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id == id) {
                        return arr[i];
                    }
                }
            },
            //查询
            handleSearch() {
                this.getDataList();
            },
            //重置
            handleReset() {
                this.searchForm.name = "";
                // 重新加载数据
                this.getDataList();
            },
            //确认选中
            submitClick() {
                this.$emit("selCallBack", this.itemSelectedData);
                this.closeModal(false);
            },
            //清空选择
            clearSelectAll() {
                this.itemSelectedData = [];
                this.$refs.xTree.clearAll();
            },
            //关闭弹出框
            closeModal(val) {
                this.$emit('input', val);
            }
        },
        deactivated() {
            this.$destroy("comboDrawer");
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
                    if(this.comboId) {
                        this.itemSelectedData = [{id: this.comboId}];
                    }
                    this.getDataList();
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>
