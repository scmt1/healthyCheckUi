<template>
    <!--抽屉-->
    <Drawer title="套餐项目" width="600" :mask-closable="false" :closable="true" v-model="isDrawerShow" class="choosePortfolioProject">
        <Row style="margin-bottom: 10px;">
            <Col span="19" style="display: flex;align-items: center;" @keydown.enter.native="itemSearchClick()">
                <h4 style="white-space: nowrap;margin-right: 4px;">关键字：</h4>
                <Input suffix="ios-search" placeholder="请输入关键字" v-model="itemSearchForm.query" clearable/>
                <h4 style="white-space: nowrap;margin-left: 5px;margin-right: 5px;">所属科室：</h4>
                <Select v-model="itemSearchForm.officeId" placeholder="请选择" clearable>
                    <Option v-for="(item,index) in officeData" :value="item.id" :key="index">
                        {{ item.sectionName }}
                    </Option>
                </Select>
            </Col>
            <Col span="5" style="text-align: right;">
                <Button type="primary" @click.native="itemSearchClick">
                    <Icon type="ios-search"/>
                    查询
                </Button>
            </Col>
        </Row>

        <Alert show-icon>
            已选择
            <span class="select-count">{{ itemSelectedData.length }}</span> 项
            <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
        <!--项目列表-->
        <Table
            :max-height="tableMaxHeight"
            row-key="id"
            :loading="itemLoading"
            border
            :columns="itemColumns"
            sortable="custom"
            :data="itemData"
            ref="table"
            @on-selection-change="handleSelectAll"
            @on-select-cancel="handleCancel"
            @on-select="handleSelect"
            @on-select-all-cancel="handleCancelSelectAll"
        ></Table>
        <!--分页-->
        <Row type="flex" justify="end" class="page">
            <Page :current="itemSearchForm.pageNumber" :total="itemTotal"
                  :page-size="itemSearchForm.pageSize"
                  @on-change="itemChangePage" @on-page-size-change="itemChangePageSize"
                  :page-size-opts="[10,20,50]"
                  size="small" show-total show-elevator show-sizer></Page>
        </Row>

        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="isDrawerShow = false">关闭</Button>
            <Button type="primary" @click="itemConfirmClick">确定</Button>
        </div>
    </Drawer>
</template>

<script>
import uniqBy from "lodash.uniqby";
import remove from "lodash.remove";
import differenceBy from "lodash.differenceby";
import {queryTPortfolioProjectList} from "@/api/healthy/tPortfolioProject"
import {getAllSectionOffice} from "@/api/healthy/tSectionOffice"

export default {
    name: "choosePortfolioProject",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        checkedList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            tableMaxHeight: 0,
            itemSearchForm: {
                pageNumber: 1,
                pageSize: 10
            },
            itemTotal: 0,
            itemLoading: false,
            itemColumns: [{
                type: "index",
                width: 60,
                align: 'center'
            },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    title: '名称',
                    align: 'left',
                    minWidth: 100,
                    key: 'name',
                    tree: true
                }/*, {
                    title: '简拼',
                    align: 'center',
                    ellipsis: true,
                    tooltip: true,
                    minWidth: 100,
                    key: 'shortName',
                }*/, {
                    title: '销售价（元）',
                    align: 'center',
                    ellipsis: true,
                    tooltip: true,
                    minWidth: 100,
                    key: 'salePrice',
                }],
            itemData: [],
            itemSelectedData: [],
            officeData: [],
            isDrawerShow: this.value
        }
    },
    methods: {
        //项目查询
        itemSearchClick() {
            if (/^[A-Za-z]+$/ig.test(this.itemSearchForm.query)) {
                this.itemSearchForm.shortName = this.itemSearchForm.query;
                this.itemSearchForm.name = "";
                this.itemSearchForm.query = "";
            } else {
                this.itemSearchForm.name = this.itemSearchForm.query;
                this.itemSearchForm.shortName = "";
            }
            this.itemSearchForm.pageNumber = 1;
            this.itemSearchForm.pageSize = 10;
            this.getItemDataList();
        },
        //清空项目选择
        clearSelectAll() {
            this.$refs.table.selectAll(false);
            this.itemSelectedData = []
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
        //页码
        itemChangePage(v) {
            this.itemSearchForm.pageNumber = v;
            this.getItemDataList();
        },
        //每页数据
        itemChangePageSize(v) {
            this.itemSearchForm.pageSize = v;
            this.getItemDataList();
        },
        itemConfirmClick() {
            this.$emit('handleSearch', this.itemSelectedData);
            this.closeModal(false);
        },
        //获取项目
        getItemDataList() {
            this.itemLoading = true;
            queryTPortfolioProjectList(this.itemSearchForm).then(res => {
                if (res.success) {
                    let data = res.data.records;
                    this.recursion(data);
                    this.itemData = data;
                    this.itemTotal = res.data.total;
                }
            }).finally(() => {
                this.itemLoading = false;
            })
        },
        //递归
        recursion(data) {
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i]._showChildren = true;
                    data[i].projectType = 2;
                    for (let j = 0; j < this.itemSelectedData.length; j++) {
                        if (data[i].id == this.itemSelectedData[j].id) {
                            data[i]._checked = true;
                        }
                        if (data[i].children && data[i].children.length > 0) {
                            this.recursion(data[i].children);
                        }
                    }
                }
            }
        },
        closeModal(val) {
            this.$emit('input', val);
        },
    },
    watch: {
        value(val) {
            this.isDrawerShow = val;
        },
        isDrawerShow(val) {
            if (val) {
                window.onresize = () => {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    this.tableMaxHeight = height - 300;
                };
                // 计算高度
                let height = document.documentElement.clientHeight;
                this.tableMaxHeight = height - 300;

                this.loading = true;
                this.itemSelectedData = JSON.parse(JSON.stringify(this.checkedList));
                this.getItemDataList();
                getAllSectionOffice().then(res => {
                    if (res.success) {
                        this.officeData = res.data;
                    }
                });
            } else {
                this.closeModal(val);
            }
        }
    }
}
</script>

<style lang="less">
.choosePortfolioProject {
    .ivu-drawer-mask, .ivu-drawer-wrap {
        z-index: 9999 !important;
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

    .wrapper {
        height: calc(100vh - 51px - 73px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 10px;
    }
}
</style>
