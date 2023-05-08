<template>
    <div class="user-edit">
        <Form ref="form" :model="form" :label-width="90" label-position="left">
            <FormItem label="登录账号：" prop="username">{{
                    form.username
                }}
            </FormItem>
            <FormItem label="用户头像：">
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
            <FormItem label="用户名：" prop="nickname" :error="error">
                <Input v-model="form.nickname" style="width: 300px"/>
            </FormItem>
            <FormItem label="性别：">
                <dict dict="sex" v-model="form.sex" style="width: 300px"/>
            </FormItem>
            <FormItem label="生日：">
                <DatePicker
                    v-model="form.birth"
                    @on-change="changeBirth"
                    style="width: 300px"
                    type="date"
                ></DatePicker>
            </FormItem>
            <FormItem label="所在省市：">
                <al-cascader
                    v-model="form.address"
                    data-type="name"
                    level="2"
                    style="width: 300px"
                />
            </FormItem>
            <FormItem label="街道地址：" prop="street">
                <Input v-model="form.street" style="width: 300px"/>
            </FormItem>
            <FormItem label="个人简介：" prop="description">
                <Input
                    v-model="form.description"
                    type="textarea"
                    style="width: 300px"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="个人简介"
                ></Input>
            </FormItem>
            <FormItem label="所属部门：">
                <span>{{ form.departmentTitle }}</span>
            </FormItem>
            <FormItem label="用户类型：">
                <span>{{ form.typeTxt }}</span>
            </FormItem>

            <FormItem label="签名文件">
                <div class="pic">
                    <div class="pic-box" :style="{'border':form.autographFile?'0 !important;':'auto'}" @click.stop="photograph" style="width: 100px;height: 60px;">
                        <input ref="upload2" type="file" accept="image/*" @change="autographChange" style="display: none;"/>
                        <Icon type="ios-add" size="24" color="#2988f3" v-if="!form.autographFile"/>
                        <template v-else>
                            <img :src="form.autographFile" style="height: 100%;width: 100%;">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native.stop="handleView(form.autographFile)"></Icon>
                                <Icon type="ios-trash-outline" @click.native.stop="handleRemove(2)"></Icon>
                            </div>
                        </template>
                    </div>
                </div>
            </FormItem>

            <FormItem>
                <Button
                    type="primary"
                    style="width: 100px; margin-right: 5px"
                    :loading="loading"
                    @click="saveEdit"
                >保存
                </Button
                >
            </FormItem>
        </Form>

        <!-- vueCropper 剪裁图片实现-->
        <Modal title="图片剪裁" v-model="cropperDialogVisible" transfer :mask-closable="false">
            <div style="height: 400px;width: auto;text-align: center;">
                <VueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber"
                    :centerBox="option.centerBox"
                    :infoTrue="option.infoTrue"
                    :fixedBox="option.fixedBox"
                ></VueCropper>
            </div>
            <div slot="footer">
                <Button type="primary" @click="finish">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {userInfo, userInfoEdit} from "@/api/index";
import uploadPicThumb from "@/views/my-components/scmt/upload-pic-thumb";
import Cookies from "js-cookie";
import dict from "@/views/my-components/scmt/dict";
import Viewer from "viewerjs";
import {VueCropper} from 'vue-cropper'

export default {
    components: {
        uploadPicThumb,
        dict,
        VueCropper
    },
    name: "user",
    data() {
        return {
            loading: false,
            form: {
                address: [],
            },
            error: "",
            cropperDialogVisible: false,
            // 裁剪组件的基础配置option
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 220, // 默认生成截图框宽度
                autoCropHeight: 148, // 默认生成截图框高度
                canMove: true,
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: false, // 是否开启截图框宽高固定比例
                // fixedNumber: [1, 1], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: false, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: false, // 截图框是否被限制在图片里面
                infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            }
        };
    },
    methods: {
        async init() {
            let v = JSON.parse(Cookies.get("userInfo"));
            // 转换null为""
            for (let attr in v) {
                if (v[attr] == null) {
                    v[attr] = "";
                }
            }
            let newInfo = await userInfo().then(res => res.data);
            let str = JSON.stringify(v);
            let info = JSON.parse(str);
            if (newInfo.avatar) {
                info.avatarFile = "data:image/png;base64," + newInfo.avatar;
            }
            if (newInfo.autograph) {
                // info.autographFile = "data:image/png;base64," + newInfo.autograph;
                if(!newInfo.autographFile || newInfo.autographFile.indexOf("/dcm") <= -1){
                    info.autographFile = "data:image/png;base64," + newInfo.autograph;
                }else{
                    info.autographFile = newInfo.autographFile;
                }
            }
            this.form = info;
            if (info.address) {
                if (typeof info.address == "string") {
                    this.form.address = info.address.split(",");
                } else {
                    this.form.address = info.address;
                }
            } else {
                this.form.address = [];
            }
            if (this.form.type == 0) {
                this.form.typeTxt = "普通用户";
            } else if (this.form.type == 1) {
                this.form.typeTxt = "管理员";
            }
        },
        changeBirth(v) {
            this.form.birth = v;
        },
        saveEdit() {
            if (!this.form.nickname) {
                this.error = "请输入用户名";
                return;
            } else {
                this.error = "";
            }
            this.loading = true;
            if (typeof this.form.birth == "object") {
                this.form.birth = this.format(this.form.birth, "yyyy-MM-dd");
            }
            delete this.form.roles;
            userInfoEdit(this.form).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.form.autographFile = res.data;
                    this.$Message.success("保存成功");
                    // 更新头像
                    this.$store.commit("setNickname", this.form.nickname);
                    this.$store.commit("setAvatar", this.form.avatarFile);
                    // 需要更新用户信息
                    this.$emit("on-success", true);
                }
            });
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
                this.option.img = reader.result;
                this.cropperDialogVisible = true;
            }
            this.$refs['upload2'].value = null;
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
                this.form.autographFile = "";
            }
        },
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
        chooseAvatar() {
            this.$refs['upload1'].dispatchEvent(new MouseEvent('click'));
        },
        // 点击裁剪，这一步是可以拿到处理后的地址
        finish() {
            let _this = this
            this.$refs.cropper.getCropBlob((data) => {
                if (data) {
                    // 上传图片，成功后把图片信息添加进imageList
                    var reader = new FileReader()
                    reader.readAsDataURL(data)
                    reader.onload = () => {
                        _this.form.autographFile = reader.result
                        _this.cropperDialogVisible = false
                    }
                } else {
                    _this.$message.error('图片错误！')
                }
            })
        }
    },
    mounted() {
        this.init();
    },
};
</script>
<style lang="less">
.user-edit {
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
