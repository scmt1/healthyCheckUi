<template>
    <Drawer title="编辑分组" :mask-closable="false" v-model="show" width="622" inner class="groupEdit">
        <Button @click="addTGroup" type="primary" icon="md-add" style="margin-bottom: 20px;">添加分组</Button>
        <Table border ref="table" :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" @click="deleteData(row, index)" size="small">
                    <Icon type="md-trash"></Icon>
                    删除
                </Button>
            </template>
        </Table>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="show = false">关闭</Button>
            <Button type="primary" @click="handSubmit">确定</Button>
        </div>
    </Drawer>
</template>

<script>
    export default {
        name: "groupEdit",
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
                show: this.value,
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                    },
                    {
                        align: 'center',
                        title: '分组名称',
                        minWidth: 120,
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        placeholder: '请输入分组名称',
                                        value: params.row.name,
                                        readonly: params.row.comboId > 0 ? true : false
                                    },
                                    style: {},
                                    on: {
                                        input: (val) => {
                                            this.data[params.index].name = val;
                                        },
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 100,
                    }
                ],
                data: [],
            }
        },
        methods: {
            deleteData(row, index) {
                this.data.splice(index, 1);
            },
            addTGroup() {
                this.data.push({
                    id: "",
                    name: '危害因素[上岗前]',
                    show: true,
                    comboId: "",
                    projectData: [],
                    discount: 100,
                    addDiscount: 100,
                    personCount: 0,
                    eiaFactors: ''
                })
            },
            handSubmit() {
                this.$emit('handleSearch', this.data);
                this.closeModal(false);
            },
            closeModal(val) {
                this.$emit('input', val);
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                if (val) {
                    this.loading = true;
                    this.data = JSON.parse(JSON.stringify(this.checkedList));
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>

<style lang="less">
    .groupEdit {
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
