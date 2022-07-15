<template>
    <div class="user-edit">
        <!-- Drawer抽屉 -->
        <Drawer
            :title="title"
            v-model="visible"
            width="720"
            draggable
            :mask-closable="type == '0'"
        >
            <div :style="{ maxHeight: maxHeight }" class="drawer-content">
                <div class="drawer-header">
                    <div style="margin-right: 16px">基本信息</div>
                    <Avatar :src="form.avatarFile" size="large" v-show="type != '2'"/>
                </div>
                <Form labColon v-show="type != '2'">
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="用户ID">
                                {{ form.id }}
                                <Tooltip trigger="hover" placement="right" content="账户已禁用">
                                    <Icon
                                        v-show="form.status == -1"
                                        type="md-lock"
                                        size="18"
                                        style="margin-left: 10px; cursor: pointer"
                                    />
                                </Tooltip>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="登录账号">
                                {{ form.username }}
                                <Tooltip
                                    trigger="hover"
                                    placement="right"
                                    :content="`密码强度：${form.passStrength}`"
                                >
                                    <Icon
                                        v-show="form.passStrength"
                                        type="md-key"
                                        :color="passColor"
                                        size="18"
                                        style="margin-left: 10px; cursor: pointer"
                                    />
                                </Tooltip>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Form
                    ref="form"
                    :model="form"
                    :rules="formValidate"
                    label-position="top"
                >
                    <Row :gutter="32" v-if="type == '2'">
                        <Col span="12">
                            <FormItem label="登录账号" prop="username">
                                <Input
                                    v-model="form.username"
                                    autocomplete="off"
                                    :maxlength="16"
                                />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="密码" prop="password">
                                <SetPassword v-model="form.password" @on-change="changePass"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="用户名" prop="nickname">
                                <Input v-model="form.nickname"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="邮箱" prop="email">
                                <Input v-model="form.email"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="手机号" prop="mobile">
                                <Input v-model="form.mobile"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="性别">
                                <dict dict="sex" v-model="form.sex" transfer/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="32">
                        <Col span="12">
                            <!--                            <FormItem label="所属科室">-->
                            <!--                                <Select v-model="form.departmentId" transfer placeholder="请选择" label-in-value @on-change="deptChange">-->
                            <!--                                    <Option v-for="(item,index) in officeData" :value="item.id" :key="index">-->
                            <!--                                        {{ item.sectionName }}-->
                            <!--                                    </Option>-->
                            <!--                                </Select>-->
                            <!--                            </FormItem>-->
                            <FormItem label="所属部门" prop="departmentId">
                                <department-tree-choose
                                    @on-change="handleSelectDepTree"
                                    ref="depTree"
                                ></department-tree-choose>
                            </FormItem>
                        </Col>

                        <Col span="12">
                            <FormItem label="用户类型">
                                <Select v-model="form.type" transfer placeholder="请选择">
                                    <Option :value="0">普通用户</Option>
                                    <Option :value="1">管理员</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="头像">
                                <div class="pic">
                                    <div class="pic-box" :style="{'border':form.avatarFile?'0 !important;':'auto'}" @click.stop="chooseAvatar">
                                        <input ref="upload1" type="file" accept="image/*" @change="avatarChange" style="display: none;"/>
                                        <Icon type="ios-add" size="24" color="#2988f3" v-if="!form.avatarFile"/>
                                        <template v-else>
                                            <img :src="form.avatarFile" style="height: 100%;width: 100%;">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native.stop="handleView(form.avatarFile)"></Icon>
                                                <Icon type="ios-trash-outline" @click.native.stop="handleRemove(1)"></Icon>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="角色分配" prop="roleIds">
                                <Select v-model="form.roleIds" multiple transfer>
                                    <Option
                                        v-for="item in roleList"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name">
                                        <span style="margin-right: 10px">{{ item.name }}</span>
                                        <span style="color: #ccc">{{ item.description }}</span>
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Divider/>
                    <p class="drawer-title">个人资料</p>
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="所在地区" prop="address">
                                <al-cascader
                                    v-model="form.address"
                                    data-type="name"
                                    level="2"
                                    transfer
                                />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="街道地址">
                                <Input v-model="form.street"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="生日" prop="birth">
                                <DatePicker
                                    v-model="form.birth"
                                    style="display: block"
                                    type="date"
                                    transfer
                                ></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="简介">
                                <Input type="textarea" v-model="form.description" :rows="4"/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="drawer-footer br" v-show="type != '0'">
                <Button type="primary" :loading="submitLoading" @click="submit">提交</Button>
                <Button @click="visible = false">取消</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
import {getAllRoleList, addUser, editUser} from "@/api/index";
import {
    validateUsername,
    validateMobile,
    validatePassword,
} from "@/libs/validate";
import departmentTreeChoose from "@/views/my-components/scmt/department-tree-choose";
import uploadPicInput from "@/views/my-components/scmt/upload-pic-input";
import SetPassword from "@/views/my-components/scmt/set-password";
import dict from "@/views/my-components/scmt/dict";
import {getAllSectionOffice} from "@/api/healthy/tSectionOffice"
import Viewer from "viewerjs";


export default {
    name: "user",
    components: {
        departmentTreeChoose,
        uploadPicInput,
        SetPassword,
        dict
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
        },
        type: {
            type: String,
            default: "0",
        },
    },
    data() {
        return {
            roleList: [],
            visible: this.value,
            title: "",
            passColor: "",
            submitLoading: false,
            maxHeight: 510,
            form: {
                address: [],
                password: "123456"
            },
            officeData: [],
            formValidate: {
                // 表单验证规则
                username: [
                    {required: true, message: "请输入登录账号", trigger: "change"},
                    {validator: validateUsername, trigger: "change"},
                ],
                nickname: [
                    {required: true, message: "请输入用户名", trigger: "change"},
                ],
                departmentId: [
                    {required: true, message: "部门不能为空", trigger: "change"},
                ],
                mobile: [
                    {required: true, message: "请输入手机号", trigger: "change"},
                    {validator: validateMobile, trigger: "change"},
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "change"},
                    {validator: validatePassword, trigger: "change"},
                ],
                // email: [
                //   { required: true, message: "请输入邮箱地址" },
                //   { type: "email", message: "邮箱格式不正确" },
                // ]
            },
        };
    },
    methods: {
        avatarChange() {
            const inputFile = this.$refs['upload1'].files[0];
            let fileSize = inputFile.size;
            var size = fileSize / 1024;
            if (size > 1024) {
                this.$Message.error('图片大小不能超过1M！');
                return;
            }
            if (size <= 0) {
                this.$Message.error('图片大小不能为0M！');
                return;
            }
            let fileType = inputFile.type.toString().substring(inputFile.type.toString().lastIndexOf('/') + 1, inputFile.type.toString().length);
            if (fileType) {
                if (fileType.toLowerCase() != 'jpg' && fileType.toLowerCase() != 'jpeg' && fileType.toLowerCase() != 'png') {
                    this.$Message.error('附件格式不正确，请选择图片格式！');
                    this.$refs['upload1'].value = null;
                    return;
                }
            }
            let reader = new FileReader();
            reader.readAsDataURL(inputFile);
            reader.onload = () => {
                this.form.avatarFile = reader.result;
                this.$forceUpdate();
            }
            this.$refs['upload1'].value = null;
        },
        autographChange() {
            const inputFile = this.$refs['upload2'].files[0];
            let fileSize = inputFile.size;
            var size = fileSize / 1024;
            if (size > 1024) {
                this.$Message.error('图片大小不能超过1M！');
                return;
            }
            if (size <= 0) {
                this.$Message.error('图片大小不能为0M！');
                return;
            }
            let fileType = inputFile.type.toString().substring(inputFile.type.toString().lastIndexOf('/') + 1, inputFile.type.toString().length);
            if (fileType) {
                if (fileType.toLowerCase() != 'jpg' && fileType.toLowerCase() != 'jpeg' && fileType.toLowerCase() != 'png') {
                    this.$Message.error('附件格式不正确，请选择图片格式！');
                    this.$refs['upload2'].value = null;
                    return;
                }
            }
            let reader = new FileReader();
            reader.readAsDataURL(inputFile);
            reader.onload = () => {
                this.form.autograph = reader.result;
                this.$forceUpdate();
            }
            this.$refs['upload2'].value = null;
        },
        chooseAvatar() {
            this.$refs['upload1'].dispatchEvent(new MouseEvent('click'));
        },
        photograph() {
            this.$refs['upload2'].dispatchEvent(new MouseEvent('click'));
        },
        handleView(v) {
            let image = new Image();
            image.src = v;
            let viewer = new Viewer(image, {
                hidden: function () {
                    viewer.destroy();
                },
            });
            viewer.show();
        },
        handleRemove(type) {
            if (type == 1) {
                this.form.avatarFile = "";
            } else {
                this.form.autograph = "";
            }
        },
        async init() {
            this.getRoleList();
            this.getTSectionOfficeData();
        },
        async getTSectionOfficeData() {
            this.officeData = await getAllSectionOffice().then(res => res.data);
        },
        getRoleList() {
            getAllRoleList().then((res) => {
                if (res.success) {
                    this.roleList = res.data;
                }
            });
        },
        deptChange(v) {
            this.form.departmentTitle = v.label;
            this.form.departmentId = v.value;
        },
        handleSelectDepTree(v, title) {
            this.form.departmentId = v;
            this.form.departmentTitle = title;
        },
        changePass(v, grade, strength) {
            this.form.passStrength = strength;
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (typeof this.form.birth == "object") {
                        this.form.birth = this.format(this.form.birth, "yyyy-MM-dd");
                    }
                    if (this.type == "1") {
                        // 编辑
                        this.submitLoading = true;
                        if (this.form.autograph) {
                            this.form.autographFile = "data:image/png;base64," + this.form.autograph;
                        }
                        editUser(this.form).then((res) => {
                            this.submitLoading = false;
                            if (res.success) {
                                this.$Message.success("操作成功");
                                this.$emit("on-submit", true);
                                this.visible = false;
                            }
                        });
                    } else {
                        // 添加
                        this.submitLoading = true;
                        addUser(this.form).then((res) => {
                            this.submitLoading = false;
                            if (res.success) {
                                this.$Message.success("操作成功");
                                this.$emit("on-submit", true);
                                this.visible = false;
                            }
                        });
                    }
                }
            });
        },
        setCurrentValue(value) {
            if (value === this.visible) {
                return;
            }
            if (this.type == "1") {
                this.title = "编辑用户";
                this.maxHeight =
                    Number(document.documentElement.clientHeight - 121) + "px";
            } else if (this.type == "2") {
                this.title = "添加用户";
                this.maxHeight =
                    Number(document.documentElement.clientHeight - 121) + "px";
            } else {
                this.title = "用户详情";
                this.maxHeight = "100%";
            }
            // 清空数据
            this.$refs.form.resetFields();

            if (this.type == "0" || this.type == "1") {
                // 回显数据
                let data = this.data;
                if (data.avatar) {
                    data.avatarFile = "data:image/png;base64," + data.avatar;
                }
                // 地址
                if (data.address) {
                    data.address = data.address.split(",");
                } else {
                    data.address = [];
                }
                // 部门
                // this.$refs.depTree.setData(data.departmentId, data.departmentTitle);
                // 角色
                let selectRolesId = [];
                data.roles.forEach(function (e) {
                    selectRolesId.push(e.id);
                });
                data.roleIds = selectRolesId;
                delete data.roles;
                delete data.permissions;
                // 密码强度
                if (data.passStrength == "弱") {
                    this.passColor = "#ed3f14";
                } else if (data.passStrength == "中") {
                    this.passColor = "#faad14";
                } else if (data.passStrength == "强") {
                    this.passColor = "#52c41a";
                }
                // 回显
                this.form = data;
            } else {
                // 添加
                // this.$refs.depTree.setData(null, null);
                this.form = {
                    type: 0,
                    sex: "男",
                    address: [],
                    password: "123456"
                };
            }
            this.visible = value;
        },
    },
    watch: {
        value(val) {
            this.setCurrentValue(val);
        },
        visible(value) {
            this.$emit("input", value);
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="less">
@import "@/styles/drawer-common.less";

.drawer-content {
    .pic {
        min-width: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .pic-box {
            display: flex;
            justify-content: center;
            padding: 2px;
            box-sizing: border-box;
            align-items: center;
            width: 60px;
            height: 60px;
            line-height: 60px;
            margin-right: 10px;
            border: 1px dashed #2988f3;
            cursor: pointer;
            flex-direction: column;
            position: relative;

            &:hover {
                .demo-upload-list-cover {
                    display: block;
                }
            }
        }

        .re-upload {
            width: 100%;
            flex: 1;
            color: #2e58d6;
            font-size: 13px;

            span {
                cursor: pointer;
            }
        }

        .pic-text {
            font-size: 13px;
            color: #cbcfd6;
        }
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: rgba(0, 0, 0, .6);
        text-align: center;

        &:hover {
            display: block;
            background: rgba(0, 0, 0, .6);
        }
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
}
</style>
