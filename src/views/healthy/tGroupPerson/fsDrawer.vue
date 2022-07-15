<template>
    <!--抽屉-->
    <Drawer title="职业照射种类选择"
            width="600"
            class="chooseRadiation"
            :mask-closable="false"
            :closable="true"
            v-model="show">
        <Alert show-icon>
            已选择
            <span class="select-count">{{ itemSelectedData.length }}</span> 项
            <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
        <!--项目列表-->
        <Table
            :max-height="tableMaxHeight"
            :loading="itemLoading"
            border
            :columns="itemColumns"
            sortable="custom"
            :data="tableData"
            ref="table"
            :span-method="handleSpan"
            @on-selection-change="handleSelectAll"
            @on-select-cancel="handleCancel"
            @on-select="handleSelect"
            @on-select-all-cancel="handleCancelSelectAll"
        ></Table>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="show = false">关闭</Button>
            <Button type="primary" @click="itemConfirmClick">确定</Button>
        </div>
    </Drawer>
</template>
<script>
const uniqBy = require("lodash.uniqby");
const remove = require("lodash.remove");
const differenceBy = require("lodash.differenceby");
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        selectedList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            show: this.value,
            itemData: [
                {
                    radiation: "核燃料循环",
                    name: "铀矿开采",
                    code: "1A"
                },
                {
                    radiation: "核燃料循环",
                    name: "铀矿水冶",
                    code: "1B"
                },
                {
                    radiation: "核燃料循环",
                    name: "铀的浓缩和转化",
                    code: "1C"
                },
                {
                    radiation: "核燃料循环",
                    name: "燃料制造",
                    code: "1D"
                },
                {
                    radiation: "核燃料循环",
                    name: "反应堆运行",
                    code: "1E"
                },
                {
                    radiation: "核燃料循环",
                    name: "燃料后处理",
                    code: "1F"
                },
                {
                    radiation: "核燃料循环",
                    name: "核燃料循环研究",
                    code: "1G"
                },
                {
                    radiation: "医学应用",
                    name: "诊断放射学",
                    code: "2A"
                },
                {
                    radiation: "医学应用",
                    name: "牙科放射学",
                    code: "2B"
                },
                {
                    radiation: "医学应用",
                    name: "核医学",
                    code: "2C"
                },
                {
                    radiation: "医学应用",
                    name: "放射治疗",
                    code: "2D"
                },
                {
                    radiation: "医学应用",
                    name: "介入放射学",
                    code: "2E"
                },
                {
                    radiation: "医学应用",
                    name: "其他",
                    code: "2F"
                },
                {
                    radiation: "工业应用",
                    name: "工业辐照",
                    code: "3A"
                },
                {
                    radiation: "工业应用",
                    name: "工业探伤",
                    code: "3B"
                },
                {
                    radiation: "工业应用",
                    name: "发光涂料工业",
                    code: "3C"
                },
                {
                    radiation: "工业应用",
                    name: "放射性同位素生成",
                    code: "3D"
                },
                {
                    radiation: "工业应用",
                    name: "测井",
                    code: "3E"
                },
                {
                    radiation: "工业应用",
                    name: "加速器运行",
                    code: "3F"
                },
                {
                    radiation: "工业应用",
                    name: "其他",
                    code: "3G"
                },
                {
                    radiation: "天然源",
                    name: "民用航空",
                    code: "4A"
                },
                {
                    radiation: "天然源",
                    name: "煤矿开采",
                    code: "4B"
                },
                {
                    radiation: "天然源",
                    name: "其他矿藏开采",
                    code: "4C"
                },
                {
                    radiation: "天然源",
                    name: "石油和天然气工业",
                    code: "4D"
                },
                {
                    radiation: "天然源",
                    name: "矿物和矿石处理",
                    code: "4E"
                },
                {
                    radiation: "天然源",
                    name: "其他",
                    code: "4F"
                },
                {
                    radiation: "其他",
                    name: "教育",
                    code: "5A"
                },
                {
                    radiation: "其他",
                    name: "兽医学",
                    code: "5B"
                },
                {
                    radiation: "其他",
                    name: "科学研究",
                    code: "5C"
                },
                {
                    radiation: "其他",
                    name: "其他",
                    code: "5D"
                },
            ],
            tableData: [],
            itemColumns: this.getItemColumns(),
            itemLoading: false,
            itemTotal: 0,
            itemSelectedData: [],
            tableMaxHeight: 800
        }
    },
    methods: {
        handleCancel(selection, row) {
            //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
            remove(this.itemSelectedData, n => {
                return n.code === row.code;
            });
        },
        handleSelect(selection, row) {
            //监听选中某一项，添加到已选项
            this.itemSelectedData.push(row);
        },
        handleSelectAll(selection) {
            //监听全选，有可能用户先单独选择了某几项，被我们push进去，然后再点了全选，因此数组合并需要去重一下
            this.itemSelectedData = uniqBy(this.itemSelectedData.concat(selection), "code");
        },
        handleCancelSelectAll(selection) {
            //监听取消全选，从已选项中移除当页数据
            this.itemSelectedData = differenceBy(this.itemSelectedData, this.itemData, "code");
        },
        //清空项目选择
        clearSelectAll() {
            this.itemSelectedData = [];
        },
        itemConfirmClick() {
            this.$emit("fsReback", this.itemSelectedData);
            this.show = false;
        },
        closeModal(val) {
            this.$emit('input', val);
        },
        //获取组合项目字段
        getItemColumns() {
            return [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    title: '照射源',
                    align: 'center',
                    minWidth: 100,
                    key: 'radiation',
                    tree: true
                }, {
                    title: '职业分类名称',
                    align: 'left',
                    ellipsis: true,
                    tooltip: true,
                    minWidth: 150,
                    key: 'name',
                }, {
                    title: '职业分类代码',
                    align: 'center',
                    ellipsis: true,
                    tooltip: true,
                    minWidth: 100,
                    key: 'code',
                }
            ]
        },
        handleSpan({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0 && columnIndex === 1) {
                return {
                    rowspan: 7,
                    colspan: 1
                };
            } else if (rowIndex === 7 && columnIndex === 1) {
                return {
                    rowspan: 6,
                    colspan: 1
                };
            } else if (rowIndex === 13 && columnIndex === 1) {
                return {
                    rowspan: 7,
                    colspan: 1
                };
            } else if (rowIndex === 20 && columnIndex === 1) {
                return {
                    rowspan: 6,
                    colspan: 1
                };
            } else if (rowIndex === 26 && columnIndex === 1) {
                return {
                    rowspan: 4,
                    colspan: 1
                };
            } else if (columnIndex === 1) {
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
        },
    },
    watch: {
        value(val) {
            this.show = val
        },
        show(val) {
            if (val) {
                window.onresize = () => {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    this.tableMaxHeight = height - 200;
                };
                // 计算高度
                let height = document.documentElement.clientHeight;
                this.tableMaxHeight = height - 200;

                this.itemSelectedData = JSON.parse(JSON.stringify(this.selectedList));
                this.tableData = JSON.parse(JSON.stringify(this.itemData));
                this.tableData.forEach(item => {
                    this.itemSelectedData.forEach(i => {
                        if(i.code == item.code) {
                            item._checked = true;
                        }
                    })
                })
            } else {
                this.closeModal(val);
            }
        }
    }
}
</script>
<style lang="less">
.chooseRadiation {
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
}
</style>