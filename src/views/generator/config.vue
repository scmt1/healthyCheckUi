<template>
  <div class="config">
    <Card>
      <Row style="display: flex;justify-content: space-between;margin-bottom:15px;">
        <Col>
          <span class="role-span">字段配置：{{ tableName }}</span>
        </Col>
        <Col>
          <Button
              :loading="genLoading"
              style="float: right; padding: 6px 12px;margin-right:0 !important;"
              type="success"
              @click="toGen"

          >保存&生成
          </Button>
          <Button
              :loading="columnLoading"
              style="float: right; padding: 6px 12px;"
              type="primary"
              @click="saveColumnConfig"
          >保存
          </Button>
          <Tooltip class="item" effect="dark" content="数据库中表字段变动时使用该功能" :transfer="true"
                   placement="top-start">
            <Button
                :loading="syncLoading"
                style="float: right; padding: 6px 12px;"
                type="info"
                @click="sync"
            >同步
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <!--列表-->
      <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          sortable="custom"
          ref="table"
      ></Table>
    </Card>

    <Card style="width: 650px;margin-top: 10px;">
      <div style="margin-bottom:10px;">
        <span class="role-span">生成配置</span>
        <Button
            :loading="configLoading"
            style="float: right; padding: 6px 12px;margin-left: 0!important; "
            type="primary"
            @click="doSubmit"
        >保存
        </Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" size="small" :labe-width="78">
        <FormItem label="作者名称" prop="author">
          <Input v-model="form.author" style="width: 40%"/>
          <span style="color: #C0C0C0;margin-left: 10px;">类上面的作者名称</span>
        </FormItem>
        <FormItem label="模块名称" prop="moduleName">
          <Input v-model="form.moduleName" style="width: 40%"/>
          <span style="color: #C0C0C0;margin-left: 10px;">模块的名称，请选择项目中已存在的模块</span>
        </FormItem>
        <FormItem label="至于包下" prop="pack">
          <Input v-model="form.pack" style="width: 40%"/>
          <span style="color: #C0C0C0;margin-left: 10px;">项目包的名称，生成的代码放到哪个包里面</span>
        </FormItem>
        <FormItem label="接口名称" prop="apiAlias">
          <Input v-model="form.apiAlias" style="width: 40%"/>
          <span style="color: #C0C0C0;margin-left: 10px;">接口的名称，用于控制器与接口文档中</span>
        </FormItem>
        <FormItem label="前端路径" prop="path">
          <Input v-model="form.path" style="width: 40%"/>
          <span style="color: #C0C0C0;margin-left: 10px;">输入views文件夹下的目录，不存在即创建</span>
        </FormItem>
        <FormItem label="去表前缀" prop="prefix" style="margin-left: 8px;">
          <Input v-model="form.prefix" placeholder="默认不去除表前缀" style="width: 40%"/>
          <span style="color: #C0C0C0;margin-left: 10px;">默认不去除表前缀，可自定义</span>
        </FormItem>
        <FormItem label="是否覆盖" prop="cover">
          <RadioGroup v-model="form.cover" style="width: 40%">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
          <span style="color: #C0C0C0;margin-left: 10px;">谨防误操作，请慎重选择</span>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import {update, getConfig} from '@/api/generator/genConfig'
import {save, sync, generator, getFieldData} from '@/api/generator/generator'
import {getAllDictList} from "../../api";

export default {
  name: 'GeneratorConfig',
  components: {},
  // mixins: [crud],
  data() {
    return {
      activeName: 'first',
      tableName: '',
      tableHeight: 550,
      columnLoading: false,
      configLoading: false,
      dicts: [],
      inputArr: [{
        label: "文本框", value: "Input"
      }, {
        label: "文本域", value: "Textarea"
      }, {
        label: "单选框", value: "Radio"
      }, {
        label: "下拉框", value: "Select"
      }, {
        label: "日期框", value: "Date"
      }],
      queryTypeArr: [{
        label: "=", value: "="
      }, {
        label: "!=", value: "!="
      }, {
        label: ">=", value: ">="
      }, {
        label: "<=", value: "<="
      }, {
        label: "Like", value: "Like"
      }, {
        label: "NotNull", value: "NotNull"
      }, {
        label: "BetWeen", value: "BetWeen"
      }],
      dateArr: [{label: "自动创建时间", value: "CreationTimestamp"}, {label: "自动更新时间", value: "UpdateTimestamp"}],
      dictArr: [],
      loading: false,
      syncLoading: false,
      genLoading: false,
      columns: this.getColumns(),
      data: [],
      form: {
        id: null,
        tableName: '',
        author: '',
        pack: '',
        path: '',
        moduleName: '',
        cover: 'false',
        apiPath: '',
        prefix: '',
        apiAlias: null
      },
      rules: {
        author: [
          {required: true, message: '作者不能为空', trigger: 'blur'}
        ],
        pack: [
          {required: true, message: '包路径不能为空', trigger: 'blur'}
        ],
        moduleName: [
          {required: true, message: '包路径不能为空', trigger: 'blur'}
        ],
        path: [
          {required: true, message: '前端路径不能为空', trigger: 'blur'}
        ],
        apiAlias: [
          {required: true, message: '接口名称不能为空', trigger: 'blur'}
        ],
        cover: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 385
    this.tableName = this.$route.query.table;
    this.form.tableName = this.tableName;
    this.getDataList();
    this.$nextTick(() => {
      getAllDictList().then(res => {
        this.dictArr = res.data;
      })
      getConfig(this.tableName).then(data => {
        this.form = data
        this.form.cover = this.form.cover.toString()
      })
    })
  },
  methods: {
    //获取列表数据
    getDataList() {
      getFieldData(this.tableName).then(res => {
        this.total = res.totalElements;
        this.data = res.content;
      })
    },
    //字段信息
    getColumns() {
      return [{
        title: "字段名称",
        key: "columnName",
        minWidth: 125,
        align: 'center',
      }, {
        title: "字段类型",
        key: "columnType",
        align: 'center',
        minWidth: 125,
      }, {
        title: "字段描述",
        key: "remark",
        align: 'center',
        minWidth: 125,
        render: (h, params) => {
          return h('div', [
            h('Input', {
              props: {
                placeholder: '请输入',
                value: params.row.remark,
                readonly: this.disabled
              },
              on: {
                input: (val) => {
                  this.data[params.index].remark = val;
                }
              }
            })
          ]);
        }
      }, {
        title: "必填",
        key: "notNull",
        align: 'center',
        minWidth: 125,
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                placeholder: '请输入',
                value: params.row.notNull,
                readonly: this.disabled
              },
              on: {
                input: (val) => {
                  this.data[params.index].notNull = val;
                }
              }
            })
          ]);
        }
      }, {
        title: "列表",
        key: "listShow",
        sortable: true,
        align: "center",
        minWidth: 125,
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                placeholder: '请输入',
                value: params.row.listShow,
                readonly: this.disabled
              },
              on: {
                input: (val) => {
                  this.data[params.index].listShow = val;
                }
              }
            })
          ]);
        }
      }, {
        title: "表单",
        key: "formShow",
        align: "center",
        minWidth: 125,
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                placeholder: '请输入',
                value: params.row.formShow,
                readonly: this.disabled
              },
              on: {
                input: (val) => {
                  this.data[params.index].formShow = val;
                }
              }
            })
          ]);
        }
      }, {
        title: "表单类型",
        key: "formType",
        align: "center",
        minWidth: 125,
        render: (h, params) => {
          return h('Select', {
            props: {
              value: params.row.formType,
              transfer: true
            },
            on: {
              'on-change': e => {
                this.data[params.index].formType = e;
              }
            }
          }, this.inputArr.map(item => {
            return h('Option', {
              props: {
                value: item.value,
                label: item.label
              }
            })
          }))
        }
      }, {
        title: "查询方式",
        key: "queryType",
        align: "center",
        minWidth: 125,
        render: (h, params) => {
          return h('Select', {
            props: {
              value: params.row.queryType,
              transfer: true
            },
            on: {
              'on-change': e => {
                this.data[params.index].queryType = e;
              }
            }
          }, this.queryTypeArr.map(item => {
            return h('Option', {
              props: {
                value: item.value,
                label: item.label
              }
            })
          }))
        }
      }, {
        title: "日期注解",
        key: "dateAnnotation",
        align: "center",
        minWidth: 125,
        render: (h, params) => {
          return h('Select', {
            props: {
              value: params.row.dateAnnotation,
              transfer: true
            },
            on: {
              'on-change': e => {
                this.data[params.index].dateAnnotation = e;
              }
            }
          }, this.dateArr.map(item => {
            return h('Option', {
              props: {
                value: item.value,
                label: item.label
              }
            })
          }))
        }
      }, {
        title: "关联字典",
        key: "dictName",
        align: "center",
        minWidth: 125,
        render: (h, params) => {
          return h('Select', {
            props: {
              value: params.row.dictName,
              transfer: true
            },
            on: {
              'on-change': e => {
                this.data[params.index].dictName = e;
              }
            }
          }, this.dictArr.map(item => {
            return h('Option', {
              props: {
                value: item.type,
                label: item.title
              }
            })
          }))
        }
      }];
    },
    //保存字段信息
    saveColumnConfig() {
      this.columnLoading = true
      save(this.data).then(res => {
        this.$Message.success("保存成功");
        this.columnLoading = false
      }).catch(err => {
        this.columnLoading = false
      })
    },
    //保存作者等配置
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.configLoading = true
          update(this.form).then(res => {
            this.$Message.success("保存成功");
            this.form = res;
            this.form.cover = this.form.cover.toString()
            this.configLoading = false
          }).catch(err => {
            this.configLoading = false
          })
        }
      })
    },
    sync() {
      this.syncLoading = true
      sync([this.tableName]).then(() => {
        this.$Message.success("同步成功");
        this.syncLoading = false;
      }).then(() => {
        this.syncLoading = false
      })
    },
    //保存 并生成
    toGen() {
      if (!this.form.id) {
        this.$Message.error("请先配置生成器");
        return;
      }
      this.genLoading = true
      save(this.data).then(res => {
        // 生成代码
        generator(this.tableName, 0).then(data => {
          if (!data.success) {
            this.genLoading = false
            this.$Message.error(data.msg);
          } else {
            this.genLoading = false
            this.$Message.success("生成成功");
          }
        }).catch(err => {
          this.genLoading = false
        })
      }).catch(err => {
        this.genLoading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
.config {
  padding: 15px 15px 0;
  box-sizing: border-box;


  /deep/ .ivu-form-item-error-tip {
    left: 75px !important;
  }
}
</style>
