<style lang="less">
    .tPortfolioProject {
        .ivu-modal {
            width: 80vw !important;
        }
    }

    .chooseProject {
        z-index: 999999999999;
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" class="tPortfolioProject">
        <Form ref="tPortfolioProjectForm" :model="tPortfolioProjectForm" :rules="tPortfolioProjectFormRule" :label-width="100">
            <Row>
                <Col :span="6">
                    <FormItem label="所属科室" prop="officeId">
                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.officeId" placeholder="请选择" clearable label-in-value
                                @on-change="onSectionChange">
                            <Option v-for="(item, i) in sectionList" :key="i" :value="item.id.toString()">{{ item.sectionName }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="名称" prop="name">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tPortfolioProjectForm.name" placeholder="请输入名称"/>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="简称" prop="shortName">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tPortfolioProjectForm.shortName" placeholder="请输入简称"/>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="父节点" prop="parentId">
                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.parentId" placeholder="请选择" clearable>
                            <Option v-for="(item, i) in parentIdPriority" :key="item.id" :value="item.id">{{ item.name }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="6">
                    <FormItem label="排序" prop="orderNum">
                        <InputNumber v-bind:disabled="disabled" v-model="tPortfolioProjectForm.orderNum" placeholder="请输入排序"/>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="标本" prop="specimen">
                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.specimen" placeholder="请选择" clearable>
                            <Option v-for="(item, i) in specimenPriority" :key="i" :value="item.value">{{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <!--                <Col :span="6">-->
                <!--                    <FormItem label="诊台显示" prop="diagnostic">-->
                <!--                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.diagnostic" placeholder="请选择"-->
                <!--                                clearable>-->
                <!--                            <Option v-for="(item, i) in diagnosticPriority" :key="item.value" :value="item.value">{{-->
                <!--                                item.title }}-->
                <!--                            </Option>-->
                <!--                        </Select>-->
                <!--                    </FormItem>-->
                <!--                </Col>-->
                <Col :span="6">
                    <FormItem label="销售价" prop="salePrice">
                        <Input type="number" v-bind:disabled="disabled" v-model="tPortfolioProjectForm.salePrice"
                               placeholder="请输入销售价">
                            <span slot="append">（元）</span>
                        </Input>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="成本价" prop="costPrice">
                        <Input type="number" v-bind:disabled="disabled" v-model="tPortfolioProjectForm.costPrice"
                               placeholder="请输入成本价">
                            <span slot="append">（元）</span>
                        </Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="6">
                    <FormItem label="检查地址" prop="address">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50
                               v-model="tPortfolioProjectForm.address" placeholder="请输入检查地址"/>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="诊断模板" prop="templeate">
                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.template" placeholder="请选择"
                                clearable>
                            <Option v-for="(item, i) in templatePriority" :key="item.value" :value="item.value">{{
                                item.title
                                }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="服务类型" prop="serviceType">
                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.serviceType" placeholder="请选择"
                                clearable>
                            <Option v-for="(item, i) in serviceTypePriority" :key="item.value" :value="item.value">{{
                                item.title
                                }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="是否为附件" prop="isFile">
                        <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.isFile" placeholder="请选择"
                                clearable>
                            <Option value="否">否</Option>
                            <Option value="是">是</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
          <Row>
            <Col :span="6">
              <FormItem label="lis标本" >
                <label>
                  <Select v-bind:disabled="disabled" v-model="tPortfolioProjectForm.lisSpecimen" placeholder="请选择"
                          clearable  label-in-value  @on-change="onLisTypeSectionChange">
                    <Option v-for="(item, i) in lisSpecimenPriority" :key="i" :value="item.value" >{{
                        item.title
                      }}
                    </Option>
                  </Select>
                </label>
              </FormItem>
            </Col>

            <Col :span="6">
              <FormItem label="lis标本名字">
                  <Input :maxlength=50 readonly v-model="tPortfolioProjectForm.lisSpecimenName" placeholder="请输入检查地址"/>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="lis对应Id " >
                <Input v-bind:disabled="disabled" type="text" :maxlength=50
                       v-model="tPortfolioProjectForm.lisId" placeholder="请输入检查地址"/>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="lis对应编码" >
                <Input v-bind:disabled="disabled" type="text" :maxlength=50
                       v-model="tPortfolioProjectForm.lisCode" placeholder="请输入检查地址"/>
              </FormItem>
            </Col>

            <Col :span="6">
                <FormItem label="检查部位" >
                      <Input v-bind:disabled="disabled" type="text" :maxlength=50
                             v-model="tPortfolioProjectForm.deptName" placeholder="请输入检查部位"/>
                </FormItem>
            </Col>
          </Row>

            <Row v-if="tPortfolioProjectForm.isFile == '是'">
                <Col span="12">
                    <FormItem label="附件地址" prop="url">
                        <Input v-bind:disabled="disabled" type="text"
                               v-model="tPortfolioProjectForm.url" placeholder="请输入附件地址"/>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <FormItem :label-width="0">
                    <Button @click="bindProject" type="primary" icon="md-add">绑定项目</Button>
                </FormItem>
            </Row>
        </Form>
        <div>
            <Table :loading="loading" border :columns="columns" sortable="custom" :data="projectTableData"
                   @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table" transfer max-height="350">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" @click="deleteData(row, index)" size="small">
                        <Icon type="md-trash"></Icon>
                        删除
                    </Button>
                    <Button type="info" @click="handleEdit(row, index)" size="small">
                        <Icon type="ios-create-outline"></Icon>
                        修改
                    </Button>
                </template>
            </Table>
        </div>
        <chooseProject class="chooseProject" v-model="drawerShow" :drawerTitle="drawerTitle" :TOfficeId="TOfficeId"
                       v-on:handleSearch="setProjectTableData"
                       :checkedList="projectTableData"></chooseProject>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="!disabled">提交</Button>
        </div>
        <div>
            <updateTBaseProject v-model="updateShow" :modalTitle="title":TBaseProjectId="TPortfolioProjectIds"
                                v-on:handleSearch="getTPortfolioProject"
            />
        </div>
    </Modal>
</template>
<script>
    import {addTPortfolioProject, updateTPortfolioProject, getTPortfolioProject} from '@/api/healthy/tPortfolioProject'
    import {getDictDataByType} from "../../../api";
    import {queryAllTSampleList} from "../../../api/healthy/tSample";
    import {queryTPortfolioProjectListByOfficeId} from "../../../api/healthy/tPortfolioProject";
    import chooseProject from "./chooseProject";
    import remove from "lodash.remove";
    import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";
    import updateTBaseProject from '../tBaseProject/updateTBaseProject'

    export default {
        name: "updateTPortfolioProject",
        components: {
            chooseProject,
            updateTBaseProject
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            TPortfolioProjectId: {
                type: String
            },
            TOfficeId: {
                type: String
            },
            modalTitle: {
                type: String
            },
            TOfficeName: {
                type: String
            }
        },
        data() {
            return {
                show: this.value,
                editTitle: this.modalTitle,
                loading: true,
                disabled: false,
                drawerShow: false,
                updateShow:false,
                TPortfolioProjectIds:'',
                title:'',
                tPortfolioProjectForm: {
                    name: '',
                    shortName: '',
                    orderNum: null,
                    parentId: '',
                    marketPrice: '',
                    salePrice: '',
                    costPrice: '',
                    suitableRange: '',
                    introduce: '',
                    address: '',
                    remark: '',
                    templeate: '',
                    serviceType: '',
                    diagnostic: '',
                    specimen: '',
                    isFile: "",
                    url: "",
                    officeId: "",
                    lisSpecimen: "",
                    lisSpecimenName: "",
                    lisId: "",
                    lisCode:"",
                    deptName: ""
                },
                tPortfolioProjectFormRule: this.getTPortfolioProjectFormRule(),
                parentIdPriority: [],
                templatePriority: [],
                serviceTypePriority: [],
                specimenPriority: [],
                diagnosticPriority: [],
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false,
                        minWidth: 150
                    },
                    {
                        title: '项目代码',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'code',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '简称',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'shortName',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '排序',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'orderNum',
                        sortable: false,
                        minWidth: 70
                    },
                    {
                        title: '项目单位',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'unitName',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '默认值',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'defaultValue',
                        sortable: false,
                        minWidth: 150
                    },
                    {
                        title: '结果类型',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'resultType',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '是否进入小结',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'inConclusion',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '是否进入报告',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'inReport',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: 'LIS关联码',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'relationCode',
                        sortable: false,
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 180,
                    }
                ],
                projectTableData: [],
                searchForm: {
                    pageNumber: 1,
                    pageSize: 10,

                },
                total: 0,
                drawerTitle: "",
                sectionList: [],
                lisSpecimenPriority:[],
            }
        },
        methods: {
            onSectionChange(e) {
                if (e) {
                    this.tPortfolioProjectForm.officeId = e.value;
                    this.tPortfolioProjectForm.officeName = e.label;
                }
            },
            //标本改变
            onLisTypeSectionChange(e) {
              if (e) {
                this.tPortfolioProjectForm.lisSpecimen = e.value;
                this.tPortfolioProjectForm.lisSpecimenName = e.label;
              }
            },
            //显示选择
            showSelect(e) {
                this.selectList = e;
                this.selectCount = e.length;
            },
            //改变排序方式
            changeSort(e) {
                this.searchForm.sort = e.key;
                this.searchForm.order = e.order;
                if (e.order == 'normal') {
                    this.searchForm.order = '';
                }
                this.getDataList();
            },
            handelSubmit() {
                this.$refs['tPortfolioProjectForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.tPortfolioProjectForm.projectList = this.projectTableData;
                        if (this.TPortfolioProjectId != null && this.TPortfolioProjectId.trim().length > 0) {
                            this.tPortfolioProjectForm.id = this.TPortfolioProjectId;
                            updateTPortfolioProject(this.tPortfolioProjectForm).then(res => {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$emit('handleSearch');
                                    this.$Message.success('保存成功');
                                }
                            }).finally(() => {
                                this.loading = false;
                            })
                        } else {
                            addTPortfolioProject(this.tPortfolioProjectForm).then(res => {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$emit('handleSearch');
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            }).finally(() => {
                                this.loading = false;
                            })
                        }
                    } else {
                        this.loading = false;
                        this.$Message.error('表单验证不通过！');
                    }
                });
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            initForm() {
                this.tPortfolioProjectForm = {
                    name: '',
                    shortName: '',
                    orderNum: null,
                    parentId: '',
                    marketPrice: '',
                    salePrice: '',
                    costPrice: '',
                    suitableRange: '',
                    introduce: '',
                    address: '',
                    remark: '',
                    template: '',
                    serviceType: '',
                    isFile: "",
                    officeId: "",
                    url: "",
                    lisSpecimen: "",
                    lisSpecimenName: "",
                    lisId: "",
                    lisCode:""
                };
            },
            getTPortfolioProjectFormRule() {
                return {
                    name: [
                        {required: true, message: '名称不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                    // shortName: [
                    // 	{required: true, message: '简称不能为空！', trigger: 'blur'},
                    // 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    // ],
                    orderNum: [
                        {required: true, message: '排序不能为空！', trigger: 'blur', type: 'number'},
                    ],
                    // parentId: [
                    // 	{required: true, message: '父节点不能为空！', trigger: 'blur',pattern: /.+/ },
                    // ],
                    // marketPrice: [
                    // 	{required: true, message: '原价（元）不能为空！', trigger: 'blur'},
                    // 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    // ],
                    salePrice: [
                        {required: true, message: '销售价不能为空！', trigger: 'change', pattern: /.+/},
                    ],
                    officeId: [
                        {required: true, message: '所属科室不能为空！', trigger: 'change', pattern: /.+/},
                    ],
                    costPrice: [
                        {required: true, message: '成本价不能为空！', trigger: 'change', pattern: /.+/},
                    ],
                    isFile: [
                        {required: true, message: '请选择是否附件！', trigger: 'blur', pattern: /.+/}
                    ],
                    // suitableRange: [
                    // 	{required: true, message: '适合人群不能为空！', trigger: 'blur'},
                    // 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    // ],
                    // introduce: [
                    // 	{required: true, message: '项目介绍不能为空！', trigger: 'blur',pattern: /.+/ },
                    // ],
                    address: [
                        {required: true, message: '检查地址不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                    // remark: [
                    // 	{required: true, message: '备注不能为空！', trigger: 'blur',pattern: /.+/ },
                    // ],
                    url: [
                        {required: true, message: '附件地址不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    diagnostic: [
                        {required: true, message: '诊台显示不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                }
            },
            getParentData(officeId) {
                queryTPortfolioProjectListByOfficeId({officeId: officeId}).then(res => {
                    if (res.success) {
                        this.parentIdPriority = res.data;
                    }
                });
            },
            handleEdit(row, index) {
                this.title = '编辑';
                this.TPortfolioProjectIds = row.id.toString();
                this.updateShow = true;
            },
            deleteData(row, index) {
                let _this = this;
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除所点击选的数据?",
                    loading: true,
                    onOk: () => {
                        //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
                        remove(_this.projectTableData, n => {
                            return n.id === row.id;
                        });
                        this.setProjectTableData(_this.projectTableData);
                        _this.$Modal.remove();
                    },
                    onCancel: () => {
                    },
                });
            },
            bindProject() {
                this.drawerTitle = "请选择项目组";
                this.drawerShow = true;
            },
            setProjectTableData(e) {
                //升序排列
                if (e && e.length > 0) {
                    e = e.sort((a, b) => {
                        return Number(a.orderNum) - Number(b.orderNum);
                    })
                }
                this.projectTableData = JSON.parse(JSON.stringify(e));
                this.total = this.projectTableData.length;
            },
            getTPortfolioProject(){
                if (this.TPortfolioProjectId != null && this.TPortfolioProjectId.trim().length > 0) {
                    getTPortfolioProject({id: this.TPortfolioProjectId}).then(res => {
                        if (res.code == 200) {
                            this.tPortfolioProjectForm = res.data;
                            this.projectTableData = res.data.projectList;
                            this.getParentData(res.data.officeId);
                        }
                    });
                } else {
                    this.getParentData(this.TOfficeId);
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.initForm();
                this.loading = false;
                this.editTitle = this.modalTitle;
                this.tPortfolioProjectForm.officeId = this.TOfficeId;
                this.tPortfolioProjectForm.officeName = this.TOfficeName;
                if (this.editTitle == "查看") {
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }
                if (val) {
                    getDictDataByType('diagnosisTemplate').then(res => {
                        if (res.success) {
                            this.templatePriority = res.data;
                        }
                    });
                    getDictDataByType('serviceType').then(res => {
                        if (res.success) {
                            this.serviceTypePriority = res.data;
                        }
                    });
                    getDictDataByType('diagnosticType').then(res => {
                        if (res.success) {
                            this.diagnosticPriority = res.data;
                        }
                    });
                    getDictDataByType('t_lis_data_type').then(res => {
                        if (res.success) {
                            this.specimenPriority = res.data;
                        }
                    });
                    this.lisSpecimenPriority = [];
                    getDictDataByType('lis_type').then(res => {
                      if (res && res.success) {
                        this.lisSpecimenPriority = res.data;
                      }
                    });
                    this.lisSpecimenPriorityDept = [];
                    getDictDataByType('lis_type').then(res => {
                      if (res && res.success) {
                        this.lisSpecimenPriorityDept = res.data;
                      }
                    });
                    queryAllSectionOfficeData({sectionName: this.searchKey}).then(res => {
                        if (res.success) {
                            this.sectionList = res.data;
                        }
                    })
                    this.projectTableData = [];
                    this.$refs['tPortfolioProjectForm'].resetFields();
                    if (this.TPortfolioProjectId != null && this.TPortfolioProjectId.trim().length > 0) {
                        getTPortfolioProject({id: this.TPortfolioProjectId}).then(res => {
                            if (res.code == 200) {
                                this.tPortfolioProjectForm = res.data;
                                this.projectTableData = res.data.projectList;
                                this.getParentData(res.data.officeId);
                            }
                        });
                    } else {
                        this.getParentData(this.TOfficeId);
                    }
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>
