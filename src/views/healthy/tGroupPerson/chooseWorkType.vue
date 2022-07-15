<style lang="less">
    .chooseSymptom {
        height: 100vh;

        .ivu-drawer-mask, .ivu-drawer-wrap {
            z-index: 9999 !important;
        }

        .ivu-drawer-body {
            height: calc(100vh - 104px);
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

        a {
            white-space: nowrap;
        }

        .ivu-page-total {
            font-size: 13px;
        }

        .ivu-page {
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-end;
        }
    }
</style>
<template>
    <Drawer title="工种选择" transfer :mask-closable="false" v-model="show" :style="{'display':show?'block':'none'}" :width="width" class="chooseSymptom">
        <Row style="display: flex;flex-wrap: nowrap;margin-bottom: 10px;" @keydown.enter.native="handleSearch()">
            <Form :label-width="70" onsubmit="return false">
                <FormItem label="工种名称">
                    <Input placeholder="请输入名称" v-model="searchForm.title"/>
                </FormItem>
            </Form>
            <Button type="primary" @click.native="handleSearch" style="margin:0 8px 0 8px">查询</Button>
            <Button type="default" @click="reset">重置</Button>
        </Row>

        <Table :loading="loading"
               border
               :columns="columns"
               sortable="custom"
               ref="table"
               :data="data"></Table>
        <Page size="small"
              @on-change="changePageNum"
              @on-page-size-change="pageSize"
              :page-size-opts="[10,20,50]"
              style="margin-top: 10px;"
              show-total
              show-sizer
              :total="total"></Page>
        <div class="demo-drawer-footer" :style="{'width':width+'px'}">
            <Button style="margin-right: 8px;" @click="closeModal(false)">关闭</Button>
            <Button type="primary" @click="handSubmit">确定</Button>
        </div>
    </Drawer>
</template>
<script>
    import {getAllDictDataList} from "@/api/index.js"

    export default {
        name: "chooseSymptom",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            checkData: {
                type: String
            }
        },
        data() {
            return {
                width: 560,
                total: 0,
                loading: false,
                show: this.value,
                checkedList: [],
                data: [],
                searchForm: {
                    pageNumber: 1,
                    pageSize: 10,
                    title: "",
                    dictId: '1456812385326206976'
                },
                columns: [
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
                                            this.checkedList = [];
                                            if (e) {
                                                this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                                                this.checkedList.push(params.row);
                                            }
                                        }
                                    }
                                })
                            ])
                        }
                    }, {
                        title: '工种名称',
                        align: 'left',
                        minWidth: 100,
                        key: 'title',
                        tooltip: true,
                        ellipsis: true
                    }
                ]
            }
        },
        methods: {
            handleSearch() {
                this.getDataList();
            },
            reset() {
                this.searchForm.title = "";
                this.searchForm.pageNumber = 1;
                this.getDataList();
            },
            getDataList() {
                getAllDictDataList(this.searchForm).then(res => {
                    if (res.success) {
                        this.data = res.data.content;
                        this.total = res.data.totalElements;
                    }
                })
            },
            //团检人员页码
            changePageNum(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
            },
            //团检人员单页数据
            pageSize(v) {
                this.searchForm.pageSize = v;
                this.getDataList();
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            handSubmit() {
                this.$emit('workCodeReback', this.checkedList);
                this.closeModal(false);
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.data = [];
                if (val) {
                    this.getDataList();
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>
