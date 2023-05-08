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
            <Row class="search-row" v-if="type != 'zjzybmc' || inspectTypeDecide">
                <Input suffix="ios-search" v-model="searchForm.content" placeholder="请输入关键字" @input="getDataList"/>
                <Button type="primary" @click="addOfficeTerm" style="margin-left: 20px;">新增</Button>
            </Row>
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
            >
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" @click="updateOfficeTerm(row, index)" :loading="loading" size="small">
                        <Icon type="ios-create-outline"/>
                        修改
                    </Button>
                </template>
            </Table>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="closeModal(false)">关闭</Button>
                <Button type="primary" @click="handleConfirm">确认</Button>
            </div>
        </div>

        <updateTOfficeTerm v-model="updateShow" :TOfficeTermId="TOfficeTermId" :TOfficeId="searchForm.officeId" :tType="type" :physicalType="inspectType" :hazardFactors="hazardFactors" :hazardFactorsText="hazardFactorsText"
                           @handSearch="getDataList" :modalTitle="officeTitle"></updateTOfficeTerm>

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
        inspectForm: {
            type: Object
        },
        personInfo: {
            type: Object,
        },
        hazardFactors: {
            type: String,
            default: ""
        },
        isMultiple: {
            type: Boolean,
            default: false
        },
        hazardFactorsText: {
            type: String,
            default: ""
        },
        inspectType: {
            type: String,
            default: ""
        },
        physicalType: {
            type: String,
            default: ""
        },
    },
    data() {
        return {
            TOfficeTermId: "",//当前术语id

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
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    transfer: true,
                    title: "术语内容",
                    align: 'left',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'content',
                    sortable: false
                },
                {
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 200,
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
                    title: "结论内容",
                    align: 'left',
                    minWidth: 120,
                    ellipsis: true,
                    tooltip: true,
                    key: 'content',
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
        //添加术语
        addOfficeTerm() {
            this.updateShow = true;
            this.officeTitle = "术语添加";
        },
        //修改术语
        updateOfficeTerm(row, index) {
            this.updateShow = true;
            this.officeTitle = "术语修改";
            this.TOfficeTermId = row.id;
        },
        onSelectionChange(rows) {
            if (rows.length > 0) {
                this.selectedWords = "";
                this.conclusionWords = [];
                if (this.cType == "zjzybmc") {
                    let code = "";
                    let content = "";
                    rows.forEach((i, index) => {
                        if (index == rows.length - 1) {
                            code += i.code;
                            content += i.content;
                        } else {
                            code += i.code + ";" + "\n";
                            content += i.content + ";" + "\n";
                        }
                    })
                    this.selectedWords = [{
                        code: code,
                        content: content,
                    }]
                }else{
                    rows.forEach((i, index) => {
                        if (index == rows.length - 1) {
                            this.selectedWords += i.content;
                        } else {
                            this.selectedWords += i.content + ";" + "\n";
                        }
                    })
                }
            }
        },
        updateChecked() {
            let consoleCode = [];
            if(this.inspectForm && this.inspectForm.conclusionCode && this.inspectForm.conclusionCode.indexOf(";\n") > -1){
                consoleCode = this.inspectForm.conclusionCode.split(";\n")
            }else{
                consoleCode.push(this.inspectForm.conclusionCode);
            }
            for (var i = 0; i < this.data.length; i++) {
                this.data[i]._checked = false;
                for (var j = 0; j < this.conclusionWords.length; j++) {
                    if (this.conclusionWords[j].code === this.data[i].code) {
                        this.data[i]._checked = true;
                        this.data[i].checkBox = true;
                    }
                }
                for (var z = 0; z < consoleCode.length; z++) {
                    if (consoleCode[z] === this.data[i].code) {
                        this.data[i]._checked = true;
                        this.data[i].checkBox = true;
                    }
                }
            }
        },
        handleConfirm() {
            if (this.cType == "zjzybmc") {
                this.$emit("getSelectedWords", this.conclusionWords, this.cType);
            } else {
                this.$emit("getSelectedWords", this.selectedWords, this.cType);
            }
            // this.$emit("getSelectedWords", this.selectedWords, this.cType);
            this.closeModal(false);
        },
        handleReset() {
            this.searchForm.content = "";
            if (this.cType == "zjzybmc") {
                this.getComboDataList();
            } else {
                this.getDataList();
            }
        },
        getDataList() {
            this.loading = true;
            queryAllByOfficeId(this.searchForm).then(res => {
                if (res.success) {
                    this.data = res.data;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        //获取体检结论
        getComboDataList() {
            this.data = [];
            let type = "";
            if (this.personInfo.physical_type == "从业体检") {
                type = "practice_physical_conclusion";
            } else if (this.personInfo.physical_type == "健康体检") {
                type = "healthy_physical_conclusion";
            } else if (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检") {
                type = "physical_conclusion";
            }
            getDictDataByType(type).then(res => {
                if (res.success) {
                    for (let i = 0; i < res.data.length; i++) {
                        let obj = {
                            code: "",
                            content: "",
                        }
                        obj.content = res.data[i].title;
                        obj.code = res.data[i].value;
                        this.data.push(obj)
                    }
                    this.updateChecked();
                }
            });
        },
        closeModal(val) {
            this.conclusionWords = [];
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
            if(this.hazardFactorsText){
                this.searchForm.hazardFactors = this.hazardFactorsText;
            }else{
                this.searchForm.hazardFactors = this.personInfo.hazard_factors_text;
            }
            if(this.inspectType){
                this.searchForm.inspectType = this.inspectType;
            }else{
                this.searchForm.inspectType = this.personInfo.physical_type;
            }
            if(this.searchForm.inspectType == "职业体检" || this.searchForm.inspectType == "放射体检"){
                this.inspectTypeDecide = false;
            }
            if(this.personInfo && this.personInfo.work_state_text!=null&&this.personInfo.work_state_text!=undefined ){
                this.searchForm.workState = this.personInfo.work_state_text.trim();
            }
            if (!val) {
                this.closeModal(val);
            } else {
                if (this.cType == "zjzybmc" && (this.searchForm.inspectType == "职业体检" || this.searchForm.inspectType == "放射体检")) {
                    this.getComboDataList();
                }else {
                    this.getDataList();
                }
            }
        }
    }
}
</script>
