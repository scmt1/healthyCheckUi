<template>
    <Drawer title="套餐选择" :mask-closable="false" v-model="show" width="520" inner class="chooseCombo">
        <Card class="card">
            <RadioGroup v-model="searchForm.careerStage" @on-change="getDataList" v-if="physicalType != '健康体检'">
                <Radio :label="item.title" v-for="(item, index) in careerStageArr" :key="index"></Radio>
            </RadioGroup>
            <Input suffix="ios-search" placeholder="请输入关键字" class="search-input"
                   @keyup.native.enter="inputSearchChange" v-model="searchForm.name"
                   @on-clear="onclearChange"
                   clearable/>
            <Alert show-icon>
                已选择
                <span class="select-count">{{ itemSelectedData.length }}</span> 项
                <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
            <!--项目列表-->
            <Table
                    :max-height="tableMaxHeight"
                    row-key="id"
                    :loading="comboLoading"
                    border
                    :columns="columns"
                    sortable="custom"
                    :data="comboData"
                    ref="table"
                    @on-selection-change="handleSelectAll"
                    @on-select-cancel="handleCancel"
                    @on-select="handleSelect"
                    @on-select-all-cancel="handleCancelSelectAll"
            ></Table>
            <!--分页-->
            <Row type="flex" justify="end" class="page">
                <Page :current="searchForm.pageNumber" :total="total"
                      :page-size="searchForm.pageSize"
                      @on-change="changePage" @on-page-size-change="changePageSize"
                      size="small" show-total></Page>
            </Row>
        </Card>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="show = false">关闭</Button>
            <Button type="primary" @click="handSubmit">确定</Button>
        </div>
    </Drawer>
</template>

<script>
    import {queryTComboList} from '@/api/healthy/tCombo'
    import uniqBy from "lodash.uniqby";
    import remove from "lodash.remove";
    import differenceBy from "lodash.differenceby";
    import {getDictDataByType} from "../../../api";

    export default {
        name: "chooseCombo",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            physicalType: {
                type: String,
                default: ""
            },
            checkedList: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                tableMaxHeight: 0,
                show: this.value,
                comboData: [],
                comboLoading: false,
                total: 0,
                searchForm: {
                    careerStage: '上岗前',
                    name: '',
                    pageNumber: 1,
                    pageSize: 20
                },
                columns: [
                    {
                        type: "index",
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '套餐名称',
                        align: 'left',
                        minWidth: 200,
                        key: 'name',
                        tree: true
                    }
                ],
                itemSelectedData: [],
                careerStageArr: [],
            }
        },
        methods: {
            //页码
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
            },
            //每页数据
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getDataList();
            },
            //套餐查询
            inputSearchChange() {
                this.searchForm.pageNumber = 1;
                this.getDataList();
            },
            onclearChange(){
                this.searchForm.name = "";
                this.getDataList();
            },
            handSubmit() {
                this.$emit('handleSearch', this.itemSelectedData);
                this.closeModal(false);
            },
            //获取comboData
            getDataList() {
                this.comboLoading = true;
                queryTComboList(this.searchForm).then(res => {
                    if (res.success) {
                        this.comboData = res.data.records;
                        for (let i = 0; i < this.comboData.length; i++) {
                            for (let j = 0; j < this.itemSelectedData.length; j++) {
                                if (this.comboData[i].id == this.itemSelectedData[j].id) {
                                    this.comboData[i]._checked = true;
                                    this.itemSelectedData[j].hazardFactorsText = this.comboData[i].hazardFactorsText;
                                    this.itemSelectedData[j].name = this.comboData[i].name;
                                    this.itemSelectedData[j].careerStage = this.comboData[i].careerStage;
                                }
                            }
                        }
                        this.total = res.data.total;
                    }
                }).finally(() => {
                    this.comboLoading = false;
                })
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            //清空项目选择
            clearSelectAll() {
                this.itemSelectedData = [];
                this.$refs.table.selectAll(false);
            },
            //选择素有套餐项
            handleSelectAll(selection) {
                if (selection.length > 0) {
                    selection.forEach(row => {
                        if (row.children && row.children.length > 0) {
                            row.children = null;
                            row.projectList = null;
                        }
                    })
                }
                //监听全选，有可能用户先单独选择了某几项，被我们push进去，然后再点了全选，因此数组合并需要去重一下
                this.itemSelectedData = uniqBy(this.itemSelectedData.concat(selection), "id");
            },
            //取消选择套餐项
            handleCancel(selection, row) {
                //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
                remove(this.itemSelectedData, n => {
                    return n.id === row.id;
                });
            },
            //选择一项套餐项
            handleSelect(selection, row) {
                if (row.children && row.children.length > 0) {
                    row.children = null;
                    row.projectList = null;
                }
                //监听选中某一项，添加到已选项
                this.itemSelectedData.push(row);
            },
            //取消选择所有套餐项
            handleCancelSelectAll(selection) {
                //监听取消全选，从已选项中移除当页数据
                this.itemSelectedData = differenceBy(this.itemSelectedData, this.itemData, "id");
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                if (val) {
                    window.onresize = () => {
                        // 计算高度
                        let height = document.documentElement.clientHeight;
                        this.tableMaxHeight = height - 300;
                    };
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    this.tableMaxHeight = height - 300;
                    this.searchForm.type = this.physicalType;
                    this.itemSelectedData = JSON.parse(JSON.stringify(this.checkedList));

                    if (this.physicalType != '健康体检') {
                        getDictDataByType("workState").then(res => {
                            if (res.success) {
                                this.careerStageArr = res.data;
                                this.getDataList();
                            }
                        });
                    } else {
                        this.searchForm.careerStage = "";
                        this.getDataList();
                    }
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>

<style lang="less">
    .chooseCombo {
        .radio-group {
            width: 100%;
            overflow: hidden;

            .row-border {
                padding-top: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #d0d0d0;

                .radio-group-radio {
                    padding-left: 10px !important;

                    .ivu-radio-group-item {
                        font-size: 0 !important;
                    }
                }

                .radio-group-content {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }

        .demo-drawer-footer {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 1px solid #e8e8e8;
            padding: 10px 16px;
            text-align: right;
            background: #fff;
        }

        .ivu-scroll-container {
            height: calc(100vh - 300px) !important;
            overflow: auto;

            &::-webkit-scrollbar {
                width: 10px;
            }

            .ivu-scroll-loader {
                position: relative;
                bottom: -30px;
            }
        }

        .search-input {
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }
</style>
