<style lang="less">
.drawer {
    .content {
        height: calc(100vh - 51px - 73px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 10px;


        .search-row {
            flex-wrap: nowrap;
            align-items: center;
            margin-bottom: 20px;
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
}
</style>
<template>
    <Drawer :title="title" :mask-closable="false" v-model="show" width="600" class="drawer">
        <div class="content">
            <Table
                :loading="loading"
                border
                :columns="isMultiple ? columns1 : columns"
                sortable="custom"
                :data="data"
                @on-select-all-cancel="handleCancelSelectAll"
                @on-select-all="handleSelectAll"
                @on-select="handleSelect"
                @on-select-cancel="handleCancel"
                @on-selection-change="onSelectionChange"
            ></Table>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="closeModal(false)">关闭</Button>
                <Button type="primary" @click="handleConfirm">确认</Button>
            </div>
        </div>

    </Drawer>
</template>
<script>
import {queryAllByOfficeId} from "@/api/healthy/tOfficeTerm"
import updateTOfficeTerm from "../tOfficeTerm/updateTOfficeTerm";
import {getDictDataByType} from "../../../api";
import remove from "lodash.remove";
import uniqBy from "lodash.uniqby";
import differenceBy from "lodash.differenceby";

export default {
    components: {
        updateTOfficeTerm
    },
    name: "drawerOccupation",
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
        isMultiple: {
            type: Boolean,
            default: false
        },
        occupationalTaboo: {
            type: String,
            default: ""
        },
        occupationalTabooCode: {
            type: String,
            default: ""
        },
        occupationalTabooNow: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            inspectTypeDecide: true,//是否展示新增与搜索框(职业体检、放射体检 体检结论不从术语管理获取，选项固定)
            officeTitle: '',
            updateShow: false,
            show: this.value,
            title: this.modalTitle,
            cType: this.type,
            loading: false,
            searchForm: {
                content: "",
                type: this.type,
                hazardFactors: "",
                inspectType: "",
                officeId:"1461588105466351616",
                workState:"",
            },
            selectedWords: "",
            selectedWordsCode: "",
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    transfer: true,
                    title: '禁忌症内容',
                    align: 'left',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'content',
                    sortable: false
                }, {
                    transfer: true,
                    title: '禁忌症code',
                    align: 'left',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'code',
                    sortable: false
                }
            ],
            columns1: [
                {
                    title: '#',
                    align: 'center',
                    key: 'checkBox',
                    width: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('Checkbox', {
                                props: {
                                    value: params.row.checkBox
                                },
                                on: {
                                    'on-change': (e) => {
                                        this.data.forEach((items) => {      //先取消所有对象的勾选，checkBox设置为false
                                            this.$set(items, 'checkBox', false)
                                        });
                                        this.conclusionWords = [];
                                        if (e) {
                                            this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                                            this.conclusionWords.push(params.row);
                                        }
                                    }
                                }
                            })
                        ])
                    }
                }, {
                    transfer: true,
                    title: '禁忌症内容',
                    align: 'left',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'content',
                    sortable: false
                }, {
                    transfer: true,
                    title: '禁忌症code',
                    align: 'left',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'code',
                    sortable: false
                }
            ],
            conclusionWords: [],
            data: [],
        }
    },
    methods: {
        handleCancel(selection, row) {
            //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
            this.conclusionWords = remove(this.conclusionWords, n => {
                return n.code == row.code;
            });
        },
        handleSelect(selection, row) {
            //监听选中某一项，添加到已选项
            this.conclusionWords.push(row);
        },
        handleSelectAll(selection) {
            //监听全选，有可能用户先单独选择了某几项，被我们push进去，然后再点了全选，因此数组合并需要去重一下
            this.conclusionWords = uniqBy(this.conclusionWords.concat(selection), "code");
        },
        handleCancelSelectAll(selection) {
            //监听取消全选，从已选项中移除当页数据
            this.conclusionWords = differenceBy(this.conclusionWords, this.data, "code");
        },
        onSelectionChange(rows) {
            if (rows.length > 0) {
                this.selectedWords = "";
                this.selectedWordsCode = "";
                this.conclusionWords = [];
                rows.forEach((i, index) => {
                    if (index == rows.length - 1) {
                        this.selectedWords += i.content;
                        this.selectedWordsCode += i.code;
                    } else {
                        this.selectedWords += i.content + ";"/* + "\n"*/;
                        this.selectedWordsCode += i.code + ";"/* + "\n"*/;
                    }
                })
            }
        },
        handleConfirm() {
            this.$emit("getSelectedWordsOccupation", this.selectedWords, this.selectedWordsCode, this.cType);
            this.closeModal(false);
        },
        getDataListJJZ() {
            this.loading = true;
            //职业禁忌证 拆分
            let occupationalTabooArray = this.occupationalTaboo.replaceAll("；",";").replaceAll("\n","").split(";");
            let occupationalTabooCodeArray = this.occupationalTabooCode.replaceAll("；",";").replaceAll("\n","").split(";");
            let data = [];
            for(let i = 0;i < occupationalTabooArray.length;i ++){
                let item = occupationalTabooArray[i];
                let code = occupationalTabooCodeArray[i];
                if(item && item != "" && code && code != ""){
                    data.push({
                        code: code,
                        content: item,
                    })
                }
            }
            this.data = data;
            //当前已选职业禁忌证
            // let occupationalTabooNowArray = this.occupationalTabooNow.split(";\n");
            let occupationalTabooNowArray = [];
            if(this.occupationalTabooNow && this.occupationalTabooNow.indexOf("\n") > -1){
                occupationalTabooNowArray = this.occupationalTabooNow.split(";\n")
            }else{
                occupationalTabooNowArray = this.occupationalTabooNow.split(";")
            }
            for (var i = 0; i < this.data.length; i++) {
                this.data[i]._checked = false;
                for (var j = 0; j < occupationalTabooNowArray.length; j++) {
                    if (occupationalTabooNowArray[j] && occupationalTabooNowArray[j] != "" && occupationalTabooNowArray[j] === this.data[i].content) {
                        this.data[i]._checked = true;
                        this.data[i].checkBox = true;
                    }
                }
            }
            this.loading = false;
        },
        closeModal(val) {
            this.searchForm.content = "";
            this.$emit('input', val);
        },
    },
    mounted() {

    },
    watch: {
        value(val) {
            this.show = val;
        },
        show(val) {
            this.title = this.modalTitle;
            this.cType = this.type;
            this.searchForm.type = this.type;
            if (!val) {
                this.closeModal(false);
            } else {
                if(this.cType == "zyjjz") {
                    this.getDataListJJZ();
                }
            }
        }
    }
}
</script>
