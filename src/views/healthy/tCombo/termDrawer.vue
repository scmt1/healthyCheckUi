<style lang="less">
.drawer {
    .content {
        padding-bottom: 10px;

        .search-row {
            flex-wrap: nowrap;
            align-items: center;
            margin-bottom: 20px;

            .search-input {
                margin-right: 30px;
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

    .ivu-drawer-mask, .ivu-drawer-wrap {
        z-index: 2000;
    }
}
</style>
<template>
    <Drawer :title="title" :closable="false" v-model="show" width="500" class="drawer">
        <div class="content">
            <Row class="search-row">
                <Input suffix="ios-search" v-model="searchForm.title" placeholder="请输入关键字" class="search-input" @input="queryDictData"/>
                <Button @click="handleReset" type="default">重置</Button>
            </Row>
            <Alert show-icon>
                已选择
                <span class="select-count">{{ selectList.length }}</span> 项
                <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
            <Table
                ref="table"
                :max-height="tableMaxHeight"
                :loading="loading"
                border
                :columns="columns"
                sortable="custom"
                :data="data"
                @on-select-all-cancel="handleCancelSelectAll"
                @on-select-all="handleSelectAll"
                @on-select="handleSelect"
                @on-select-cancel="handleCancel"></Table>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="closeModal(false)">关闭</Button>
                <Button type="primary" @click="handleConfirm">确认</Button>
            </div>
        </div>
    </Drawer>
</template>
<script>
import {getDictDataByType} from "../../../api";
import {getAllDictDataList} from "@/api/index";

const uniqBy = require("lodash.uniqby");
const remove = require("lodash.remove");
const differenceBy = require("lodash.differenceby");
export default {
    name: "drawer",
    props: {
        value: {
            type: Boolean,
            default: true
        },
        modalTitle: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: ""
        },
        checkedList: {
            type: Array
        }
    },
    data() {
        return {
            show: this.value,
            title: this.modalTitle,
            cType: this.type,
            loading: false,
            data: [],
            searchForm: {
                title: "",
                dictId: "",
                pageNumber: 1,
                pageSize: 1000000,
            },
            columns: this.getColumns(),
            tableMaxHeight: 200,
            selectList:[]
        }
    },
    methods: {
        handleCancel(selection, row) {
            //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
            remove(this.selectList, n => {
                return n.value === row.value;
            });
        },
        handleSelect(selection, row) {
            //监听选中某一项，添加到已选项
            this.selectList.push(row);
        },
        handleSelectAll(selection) {
            //监听全选，有可能用户先单独选择了某几项，被我们push进去，然后再点了全选，因此数组合并需要去重一下
            this.selectList = uniqBy(this.selectList.concat(selection), "value");
        },
        handleCancelSelectAll(selection) {
            //监听取消全选，从已选项中移除当页数据
            this.selectList = differenceBy(this.selectList, this.data, "value");
        },
        handleConfirm() {
            this.$emit("getSelectedWords", this.selectList, this.cType);
            this.closeModal(false);
        },
        handleReset() {
            this.searchForm.title = "";
            this.getDataList();
        },
        queryDictData() {
            getAllDictDataList(this.searchForm).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.data = res.data.content;
                    this.updateChecked()
                }
            });
        },
        //把源数据加上_checked字段，遍历已选项数据，更新选中状态
        updateChecked() {
            for (var i = 0; i < this.data.length; i++) {
                this.data[i]._checked = false;
                for (var j = 0; j < this.selectList.length; j++) {
                    if (this.selectList[j].value === this.data[i].value) {
                        this.data[i]._checked = true;
                    }
                }
            }
        },
        getDataList() {
            this.loading = true;
            getDictDataByType(this.cType).then(res => {
                if (res.success) {
                    this.data = res.data;
                    if (res.data && res.data.length > 0) {
                        this.searchForm.dictId = res.data[0].dictId;
                    }
                    this.updateChecked()
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        closeModal(val) {
            this.searchForm.title = "";
            this.$emit('input', val);
        },
        getColumns() {
            return [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    title: '术语内容',
                    align: 'center',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'title',
                    sortable: false
                }
            ]
        },
        clearSelectAll() {
            this.$refs.table.selectAll(false);
        },
    },
    watch: {
        value(val) {
            this.show = val;
        },
        show(val) {
            this.title = this.modalTitle;
            this.cType = this.type;
            if (!val) {
                this.closeModal(val);
            } else {
                // 计算高度
                let height = document.documentElement.clientHeight;
                this.tableMaxHeight = height - 240;
                window.onresize = () => {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    this.tableMaxHeight = height - 240;
                };
                this.getDataList();
                this.selectList = JSON.parse(JSON.stringify(this.checkedList));
            }
        }
    }
}
</script>
