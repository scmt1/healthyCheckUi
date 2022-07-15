<style lang="less">
@import "../../../styles/table-common.less";
@import "./todoManage.less";
</style>
<template>
  <div class="search">
    <historicDetail
      v-if="showHistory"
      @close="showHistory = false"
      :procInstId="procInstId"
    />
    <Card v-show="!showHistory">
      <Row v-show="openSearch" @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70">
          <FormItem label="任务名称" prop="name">
            <Input
              type="text"
              v-model="searchForm.name"
              placeholder="请输入"
              clearable
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="创建时间">
            <DatePicker
              :options="options"
              v-model="selectDate"
              type="daterange"
              format="yyyy-MM-dd"
              clearable
              @on-change="selectDateRange"
              placeholder="选择起始时间"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem style="margin-left: -35px" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search"
              >搜索</Button
            >
            <Button @click="handleReset">重置</Button>
          </FormItem>
        </Form>
      </Row>
      <Row class="operation">
        <Button @click="passAllTask" icon="md-checkmark-circle-outline"
          >批量通过</Button
        >
        <Button @click="backAllTask" icon="md-close">批量驳回</Button>
        <Button @click="getDataList" icon="md-refresh">刷新</Button>
        <Button type="dashed" @click="openSearch = !openSearch">{{
          openSearch ? "关闭搜索" : "开启搜索"
        }}</Button>
        <Button type="dashed" @click="openTip = !openTip">{{
          openTip ? "关闭提示" : "开启提示"
        }}</Button>
      </Row>
      <Row v-show="openTip">
        <Alert show-icon>
          已选择
          <span class="select-count">{{ selectList.length }}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </Row>
      <Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          sortable="custom"
          :data="data"
          @on-sort-change="changeSort"
          @on-selection-change="showSelect"
          ref="table"
        ></Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10, 20, 50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
    </Card>

    <!-- 审批操作 -->
    <Modal
      :title="modalTaskTitle"
      v-model="modalTaskVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="85" :rules="formValidate">
        <FormItem label="审批意见" prop="reason">
          <Input type="textarea" v-model="form.comment" :rows="4" />
        </FormItem>
        <FormItem
          label="下一审批人"
          prop="assignees"
          v-show="showAssign"
          :error="error"
        >
          <Select
            v-model="form.assignees"
            placeholder="请选择或输入搜索"
            filterable
            clearable
            multiple
            :loading="userLoading"
          >
            <Option
              v-for="(item, i) in assigneeList"
              :key="i"
              :value="item.id"
              :label="item.nickname"
            >
              <span style="margin-right: 10px">{{ item.nickname }}</span>
              <span style="color: #ccc">{{ item.username }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="自定义搜索选择审批人"
          prop="assignees"
          v-show="isCustom"
          :error="error"
        >
          <Select
            v-model="form.assignees"
            placeholder="请输入用户名搜索选择用户"
            filterable
            remote
            multiple
            :remote-method="searchUser"
            :loading="userLoading"
          >
            <Option
              v-for="(item, i) in userList"
              :value="item.id"
              :key="i"
              :label="item.nickname"
            >
              <span style="margin-right: 10px">{{ item.nickname }}</span>
              <span style="color: #ccc">{{ item.username }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem label="下一审批人" v-show="isGateway">
          <span
            >分支网关处暂不支持自定义选择下一审批人，将发送给下一节点所有人</span
          >
        </FormItem>
        <div v-show="form.type == 1">
          <FormItem label="驳回至">
            <Select
              v-model="form.backTaskKey"
              filterable
              :loading="backLoading"
              @on-change="changeBackTask"
            >
              <Option
                v-for="(item, i) in backList"
                :key="i"
                :value="item.key"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem
            label="指定原节点审批人"
            prop="assignees"
            v-show="form.backTaskKey != -1"
            :error="error"
          >
            <Select
              v-model="form.assignees"
              placeholder="请选择或输入搜索"
              filterable
              clearable
              multiple
              :loading="userLoading"
            >
              <Option
                v-for="(item, i) in assigneeList"
                :key="i"
                :value="item.id"
                :label="item.nickname"
              >
                <span style="margin-right: 10px">{{ item.nickname }}</span>
                <span style="color: #ccc">{{ item.username }}</span>
              </Option>
            </Select>
          </FormItem>
        </div>
        <FormItem
          label="选择转办人"
          prop="userId"
          :error="error"
          v-show="form.type == 2"
        >
          <Select
            v-model="form.userId"
            placeholder="请输入用户名搜索选择用户"
            filterable
            remote
            :remote-method="searchUser"
            :loading="userLoading"
          >
            <Option
              v-for="(item, i) in userList"
              :value="item.id"
              :key="i"
              :label="item.nickname"
            >
              <span style="margin-right: 10px">{{ item.nickname }}</span>
              <span style="color: #ccc">{{ item.username }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem label="消息通知">
          <Checkbox v-model="form.sendMessage">站内消息通知</Checkbox>
          <Checkbox v-model="form.sendSms">短信通知</Checkbox>
          <Checkbox v-model="form.sendEmail">邮件通知</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalTaskVisible = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmit"
          >提交</Button
        >
      </div>
    </Modal>

    <!-- 批量审批操作 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Alert show-icon>{{
        modalType == 0
          ? "注意：将默认分配给节点设定的所有可审批用户"
          : "注意：所有流程将驳回至发起人"
      }}</Alert>
      <Form ref="form" :model="form" :label-width="85" :rules="formValidate">
        <FormItem label="审批意见" prop="reason">
          <Input type="textarea" v-model="form.comment" :rows="4" />
        </FormItem>
        <FormItem label="消息通知">
          <Checkbox v-model="form.sendMessage">站内消息通知</Checkbox>
          <Checkbox v-model="form.sendSms">短信通知</Checkbox>
          <Checkbox v-model="form.sendEmail">邮件通知</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitAll"
          >提交</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  todoList,
  pass,
  back,
  getBackList,
  backToTask,
  delegate,
  getNextNode,
  getNode,
  passAll,
  backAll,
} from "@/api/activiti";
import { searchUserByName, getDictDataByType } from "@/api/index";
import historicDetail from "../historic-detail/historicDetail.vue";
import { shortcuts } from "@/libs/shortcuts";
export default {
  name: "todo-manage",
  components: {
    historicDetail,
  },
  data() {
    return {
      modalVisible: false,
      modalType: 0,
      showHistory: false,
      procInstId: "",
      openSearch: true,
      openTip: true,
      loading: true, // 表单加载状态
      modalTaskVisible: false,
      userLoading: false,
      backLoading: false,
      userList: [],
      selectList: [], // 多选数据
      assigneeList: [],
      backList: [
        {
          key: "-1",
          name: "发起人",
        },
      ],
      error: "",
      showAssign: false,
      searchForm: {
        // 搜索框对应data对象
        name: "",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
      },
      selectDate: null,
      options: {
        shortcuts: shortcuts,
      },
      modalTaskTitle: "",
      modalTitle: "", // 添加或编辑标题
      form: {
        id: "",
        userId: "",
        procInstId: "",
        comment: "",
        type: 0,
        assignees: [],
        backTaskKey: "-1",
        sendMessage: true,
        sendSms: true,
        sendEmail: true,
      },
      formValidate: {
        // 表单验证规则
      },
      submitLoading: false, // 添加或编辑提交状态
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "任务名称",
          key: "name",
          minWidth: 160,
        },
        {
          title: "所属流程",
          key: "processName",
          minWidth: 150,
          render: (h, params) => {
            let text = "";
            if (params.row.version) {
              text = params.row.processName + " - v." + params.row.version;
            }
            return h("div", [h("span", text)]);
          },
        },
        {
          title: "委托代办人",
          key: "owner",
          minWidth: 130,
          align: "center",
          render: (h, params) => {
            if (!params.row.owner) {
              return h("span", "-");
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top",
                  content: params.row.ownerUsername,
                },
              },
              [
                h(
                  "Tag",
                  {
                    style: {
                      "margin-right": "8px",
                    },
                    props: {
                      type: "border",
                    },
                  },
                  params.row.owner
                ),
              ]
            );
          },
        },
        {
          title: "流程发起人",
          key: "applyer",
          minWidth: 130,
          align: "center",
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top",
                  content: params.row.applyerUsername,
                },
              },
              [
                h(
                  "Tag",
                  {
                    style: {
                      "margin-right": "8px",
                    },
                    props: {
                      type: "border",
                    },
                  },
                  params.row.applyer
                ),
              ]
            );
          },
        },
        {
          title: "优先级",
          key: "priority",
          width: 100,
          sortable: true,
          align: "center",
          render: (h, params) => {
            let text = "无",
              color = "";
            if (params.row.priority == 0) {
              color = "green";
            } else if (params.row.priority == 1) {
              color = "orange";
            } else if (params.row.priority == 2) {
              color = "red";
            } else {
              color = "default";
            }
            this.dictPriority.forEach((e) => {
              if (e.value == params.row.priority) {
                text = e.title;
              }
            });
            return h("div", [
              h(
                "Tag",
                {
                  props: {
                    color: color,
                  },
                },
                text
              ),
            ]);
          },
        },
        {
          title: "状态",
          key: "isSuspended",
          align: "center",
          width: 110,
          render: (h, params) => {
            if (!params.row.isSuspended) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "已激活",
                  },
                }),
              ]);
            } else if (params.row.isSuspended) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "已挂起",
                  },
                }),
              ]);
            }
          },
          filters: [
            {
              label: "已激活",
              value: false,
            },
            {
              label: "已挂起",
              value: true,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value) {
              return row.isSuspended == true;
            } else if (!value) {
              return row.isSuspended == false;
            }
          },
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 180,
          sortType: "desc",
          sortable: true,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 280,
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.detail(params.row);
                    },
                  },
                },
                "申请详情"
              ),
              h("Divider", {
                props: {
                  type: "vertical",
                },
              }),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.passTask(params.row);
                    },
                  },
                },
                "通过"
              ),
              h("Divider", {
                props: {
                  type: "vertical",
                },
              }),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.backTask(params.row);
                    },
                  },
                },
                "驳回"
              ),
              h("Divider", {
                props: {
                  type: "vertical",
                },
              }),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.delegateTask(params.row);
                    },
                  },
                },
                "转办"
              ),
              h("Divider", {
                props: {
                  type: "vertical",
                },
              }),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.history(params.row);
                    },
                  },
                },
                "历史"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
      dictPriority: [],
      isGateway: false,
      isCustom: false,
    };
  },
  methods: {
    init() {
      this.getDictDataType();
      this.getDataList();
    },
    getDictDataType() {
      getDictDataByType("priority").then((res) => {
        if (res.success) {
          this.dictPriority = res.data;
        }
      });
    },
    searchUser(v) {
      if (!v) {
        return;
      }
      this.userLoading = true;
      searchUserByName(v).then((res) => {
        this.userLoading = false;
        if (res.success) {
          this.userList = res.data;
        }
      });
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order == "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getDataList() {
      this.loading = true;
      todoList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.data.content;
          this.total = res.data.totalElements;
          if (this.data.length == 0 && this.searchForm.pageNumber > 1) {
            this.searchForm.pageNumber -= 1;
            this.getDataList();
          }
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      // 重新加载数据
      this.getDataList();
    },
    showSelect(e) {
      this.selectList = e;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    handelSubmit() {
      this.submitLoading = true;
      if (this.form.type == 0) {
        // 通过
        if (
          (this.showAssign || this.isCustom) &&
          this.form.assignees.length < 1
        ) {
          this.error = "请至少选择一个审批人";
          this.submitLoading = false;
          return;
        } else {
          this.error = "";
        }
        pass(this.form).then((res) => {
          this.submitLoading = false;
          if (res.success) {
            this.$Message.success("操作成功");
            this.modalTaskVisible = false;
            this.getDataList();
          }
        });
      } else if (this.form.type == 1) {
        // 驳回
        if (this.form.backTaskKey == "-1") {
          // 驳回至发起人
          back(this.form).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("操作成功");
              this.modalTaskVisible = false;
              this.getDataList();
            }
          });
        } else {
          // 自定义驳回
          if (this.form.backTaskKey != "-1" && this.form.assignees.length < 1) {
            this.error = "请至少选择一个审批人";
            this.submitLoading = false;
            return;
          } else {
            this.error = "";
          }
          backToTask(this.form).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("操作成功");
              this.modalTaskVisible = false;
              this.getDataList();
            }
          });
        }
      } else if (this.form.type == 2) {
        // 转办
        if (!this.form.userId) {
          this.error = "请搜索选择一转办人";
          this.submitLoading = false;
          return;
        } else {
          this.error = "";
        }
        delegate(this.form).then((res) => {
          this.submitLoading = false;
          if (res.success) {
            this.$Message.success("操作成功");
            this.modalTaskVisible = false;
            this.getDataList();
          }
        });
      }
    },
    detail(v) {
      let query = {
        id: v.tableId,
        type: 3,
        backRoute: this.$route.name,
      };
      this.$router.push({
        name: v.routeName,
        query: query,
      });
    },
    passTask(v) {
      this.modalTaskTitle = "审批通过";
      this.form.id = v.id;
      this.form.procInstId = v.procInstId;
      this.form.priority = v.priority;
      this.form.type = 0;
      this.modalTaskVisible = true;
      this.userLoading = true;
      getNextNode(v.procDefId, v.key).then((res) => {
        this.userLoading = false;
        if (res.success) {
          this.error = "";
          if (res.data.type == 3 || res.data.type == 4) {
            this.isGateway = true;
            this.showAssign = false;
            this.isCustom = false;
            return;
          }
          if (res.data.type == 5) {
            this.isCustom = true;
            this.isGateway = false;
            this.showAssign = false;
            return;
          }
          if (res.data.type == 1) {
            this.showAssign = true;
            this.isGateway = false;
            this.isCustom = false;
            if (res.data.users && res.data.users.length > 0) {
              this.assigneeList = res.data.users;
              // 默认勾选
              let ids = [];
              res.data.users.forEach((e) => {
                ids.push(e.id);
              });
              this.form.assignees = ids;
              this.showAssign = true;
            } else {
              this.form.assignees = [];
              this.showAssign = false;
            }
          }
        }
      });
    },
    changeBackTask(v) {
      if (v == "-1") {
        return;
      }
      this.userLoading = true;
      getNode(v, { taskId: this.form.id }).then((res) => {
        this.userLoading = false;
        if (res.success) {
          if (res.data.users && res.data.users.length > 0) {
            this.assigneeList = res.data.users;
            // 默认勾选
            let ids = [];
            res.data.users.forEach((e) => {
              ids.push(e.id);
            });
            this.form.assignees = ids;
          }
        }
      });
    },
    backTask(v) {
      this.modalTaskTitle = "审批驳回";
      this.form.id = v.id;
      this.form.procInstId = v.procInstId;
      this.form.procDefId = v.procDefId;
      this.form.priority = v.priority;
      this.form.type = 1;
      this.showAssign = false;
      this.isCustom = false;
      this.modalTaskVisible = true;
      // 获取可驳回节点
      this.backList = [
        {
          key: "-1",
          name: "发起人",
        },
      ];
      this.form.backTaskKey = "-1";
      this.backLoading = true;
      getBackList(v.procInstId).then((res) => {
        this.backLoading = false;
        if (res.success) {
          res.data.forEach((e) => {
            this.backList.push(e);
          });
        }
      });
    },
    delegateTask(v) {
      this.modalTaskTitle = "委托他人代办";
      this.form.id = v.id;
      this.form.procInstId = v.procInstId;
      this.form.type = 2;
      this.showAssign = false;
      this.isCustom = false;
      this.modalTaskVisible = true;
    },
    history(v) {
      if (!v.procInstId) {
        this.$Message.error("流程实例ID不存在");
        return;
      }
      this.procInstId = v.procInstId;
      this.showHistory = true;
    },
    passAllTask() {
      if (this.selectList.length <= 0) {
        this.$Message.warning("您还未选择要通过的数据");
        return;
      }
      // 批量通过
      this.modalVisible = true;
      this.modalType = 0;
      this.modalTitle = "批量通过 " + this.selectList.length + " 条数据";
    },
    backAllTask() {
      if (this.selectList.length <= 0) {
        this.$Message.warning("您还未选择要驳回的数据");
        return;
      }
      // 批量驳回
      this.modalVisible = true;
      this.modalType = 1;
      this.modalTitle = "批量驳回 " + this.selectList.length + " 条数据";
    },
    handelSubmitAll() {
      if (this.modalType == 0) {
        let ids = "",
          params = {};
        this.selectList.forEach(function (e) {
          ids += e.id + ",";
        });
        ids = ids.substring(0, ids.length - 1);
        params = {
          ids: ids,
          comment: this.form.comment,
          sendMessage: this.form.sendMessage,
          sendSms: this.form.sendSms,
          sendEmail: this.form.sendEmail,
        };
        passAll(params).then((res) => {
          this.$Modal.remove();
          if (res.success) {
            this.$Message.info(res.msg);
            this.modalVisible = false;
            this.clearSelectAll();
            this.getDataList();
          }
        });
      } else {
        let procInstIds = "",
          params = {};
        this.selectList.forEach(function (e) {
          procInstIds += e.procInstId + ",";
        });
        procInstIds = procInstIds.substring(0, procInstIds.length - 1);
        params = {
          procInstIds: procInstIds,
          comment: this.form.comment,
          sendMessage: this.form.sendMessage,
          sendSms: this.form.sendSms,
          sendEmail: this.form.sendEmail,
        };
        backAll(params).then((res) => {
          this.$Modal.remove();
          if (res.success) {
            this.$Message.success("操作成功");
            this.modalVisible = false;
            this.clearSelectAll();
            this.getDataList();
          }
        });
      }
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      if (to.name == "todo-manage") {
        this.getDataList();
      }
    },
  },
};
</script>
