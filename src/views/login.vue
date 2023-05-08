<template>
  <div style="height: 100vh">
    <!--    <div style="height: 11vh;background: #fff;overflow: hidden;">-->
    <!--      <img src="../assets/top-logo.png" style="margin-left: 15%;padding: 2vh;height: 100%">-->
    <!--      <img src="../assets/top-logo-right.png" style="float: right;margin-right: 15%;height: 100%;">-->
    <!--    </div>-->
    <Row style="height: 11vh; background: #fff; overflow: hidden">
      <Col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        style="height: 100%; display: grid; justify-content: center"
      >
        <img src="../assets/top-logo.png" style="padding: 2vh; height: 100%" />
      </Col>
      <Col
        :xs="0"
        :sm="0"
        :md="0"
        :lg="12"
        style="height: 100%; display: flex; justify-content: center"
      >
        <img src="../assets/top-logo-right.png" style="height: 100%" />
      </Col>
    </Row>
    <Row
      type="flex"
      justify="end"
      @keydown.enter.native="submitLogin"
      class="login"
      style="margin-top: 0 !important"
    >
      <Col :xs="0" :sm="0" :md="0" :lg="8" class="centerImage">
        <div class="imgDiv">
          <img
            src="../assets/centerImage.png"
            style="width: 100%; max-height: 89vh"
          />
        </div>
      </Col>
      <Col class="layout">
        <div style="display: grid">
          <div style="text-align: center; margin-bottom: 5%">
            <img src="../assets/welcome.png" />
          </div>

          <Form
            ref="usernameLoginForm"
            :model="form"
            :rules="rules"
            class="form"
            v-if="tabName == 'username'"
          >
            <FormItem prop="username">
              <Input
                v-model="form.username"
                prefix="ios-contact"
                size="large"
                clearable
                placeholder="请输入用户名"
                autocomplete="off"
              />
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                prefix="ios-lock"
                size="large"
                password
                placeholder="请输入密码"
                autocomplete="off"
              />
            </FormItem>
            <FormItem prop="imgCode">
              <Row
                type="flex"
                justify="space-between"
                style="align-items: center; overflow: hidden"
              >
                <Input
                  v-model="form.imgCode"
                  size="large"
                  clearable
                  placeholder="请输入图片验证码"
                  :maxlength="10"
                  class="input-verify"
                />
                <div
                  class="code-image"
                  style="position: relative; font-size: 12px"
                >
                  <Spin v-if="loadingCaptcha" fix></Spin>
                  <img
                    :src="captchaImg"
                    @click="getCaptchaImg"
                    alt="加载验证码失败"
                    style="width: 110px; cursor: pointer; display: block"
                  />
                </div>
              </Row>
            </FormItem>
          </Form>
          <Row
            style="
              margin: 0 30px;
              color: rgb(41, 96, 226);
              width: 100%;
              display: flex;
            "
          >
            <div
              style="width: auto; cursor: pointer; text-decoration: underline"
              @click="previewFile"
            >
              用户手册
            </div>
            <div
              style="
                width: auto;
                cursor: pointer;
                text-decoration: underline;
                margin-left: 20px;
              "
              @click="previewFileXC"
            >
              宣传手册
            </div>
          </Row>
          <Row style="margin: 0 30px">
            <Button
              class="login-btn"
              type="primary"
              size="large"
              :loading="loading"
              @click="submitLogin"
              long
            >
              <span v-if="!loading">{{ $t("login") }}</span>
              <span v-else>{{ $t("logining") }}</span>
            </Button>
          </Row>
        </div>
      </Col>
    </Row>
    <div class="login-span">
      <!--<span>软件服务商:{{softwareServiceProvider}}</span>-->
      <span>软件版本:{{ softwareVersion }}</span>
      <span>服务热线:{{ serviceHotline }}</span>
    </div>
    <div class="login-span">
      <span>友情链接:</span>
      <a
        href="https://www.sccdc.cn"
        title="链接到四川省疾病预防控制中心"
        target="_blank"
        >四川省疾病预防控制中心</a
      >
      <a
        href="http://wsjkw.sc.gov.cn"
        title="链接到四川省卫生健康委员会"
        target="_blank"
        >四川省卫生健康委员会</a
      >
      <a
        href=" http://ylbzj.sc.gov.cn"
        title="链接到四川省医疗保障局"
        target="_blank"
        >四川省医疗保障局</a
      >
    </div>
    <pdfPreview v-model="pdfPreviewShow" :url="pdfUrl"></pdfPreview>
  </div>
</template>

<script>
import { login, userInfo, initCaptcha, drawCodeImage } from "@/api/index";
import { validateMobile } from "@/libs/validate";
import Cookies from "js-cookie";
import Header from "@/views/main-components/header";
import Footer from "@/views/main-components/footer";
import LangSwitch from "@/views/main-components/lang-switch";
import CountDownButton from "@/views/my-components/scmt/count-down-button";
import pdfPreview from "./pdfPreview";
import util from "@/libs/util.js";
import { formartDate } from "@/api/tools/tool";
import { exportTemplatePdfZip } from "@/api/healthy/tTemplate";
import Vue from "vue";
import { getSynchronizationRequest } from "@/api/healthy/ftpClient";
export default {
  components: {
    CountDownButton,
    LangSwitch,
    Header,
    Footer,
    pdfPreview,
  },
  data() {
    return {
      //软件信息
      softwareServiceProvider: "",
      softwareVersion: "",
      serviceHotline: "",

      pdfPreviewShow: false,
      pdfUrl: "",
      showMore: false,
      captchaId: "",
      captchaImg: "",
      loadingCaptcha: true,
      error: false,
      tabName: "username",
      saveLogin: true,
      getSms: "获取验证码",
      loading: false,
      sending: false,
      errorCode: "",
      form: {
        username: "",
        password: "123456",
        mobile: "",
        code: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change",
          },
        ],
        imgCode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "change",
          },
        ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "change",
          },
          {
            validator: validateMobile,
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    async getCaptchaImg() {
      this.loadingCaptcha = true;
      try {
        const res = await initCaptcha();

        if (res?.success) {
          this.captchaId = res.data;
          const imgFlow = await this.$api.getCaptchaImg(res.data);
          this.captchaImg = window.URL.createObjectURL(imgFlow);
        }
      } catch (error) {
        console.log(error);
        this.$Message.error(error.message);
      }
      this.loadingCaptcha = false;
    },
    sendSmsCode() {
      this.$refs.mobileLoginForm.validate((valid) => {
        if (valid) {
        }
      });
    },
    submitLogin() {
      if (this.tabName == "username") {
        this.$refs.usernameLoginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            login({
              username: this.form.username,
              password: this.form.password,
              code: this.form.imgCode,
              captchaId: this.captchaId,
              saveLogin: this.saveLogin,
            }).then((res) => {
              if (res.success) {
                this.setStore("accessToken", res.data);
                // 获取用户信息
                userInfo().then((res) => {
                  if (res.success) {
                    // 避免超过大小限制
                    delete res.data.permissions;
                    let roles = [];
                    res.data.roles.forEach((e) => {
                      roles.push(e.name);
                    });
                    delete res.data.roles;
                    this.setStore("roles", roles);
                    this.setStore("saveLogin", this.saveLogin);

                    this.$store.commit("setNickname", res.data.nickname);
                    if (res.data.avatar) {
                      this.$store.commit(
                        "setAvatar",
                        "data:image/png;base64," + res.data.avatar
                      );
                    }
                    //把头像和签名的base64先置为空，避免cookies无法存储， 在需要用到签名的地方，调用userInfo接口获取
                    delete res.data.avatar;
                    delete res.data.autograph;
                    if (this.saveLogin) {
                      // 保存1天
                      Cookies.set("userInfo", JSON.stringify(res.data), {
                        expires: 1,
                      });
                    } else {
                      Cookies.set("userInfo", JSON.stringify(res.data));
                    }
                    this.setStore("userInfo", res.data);
                    this.$store.commit("setUserInfo", res.data);
                    let _this = this;
                    util.initRouter(this, function () {
                      _this.$store.commit("setCurrNav", "");
                      _this.$store.commit("setShrink", true);
                      _this.$store.commit("setMenuWidth", 0);
                      _this.$store.commit("setLeftWidth", 0);
                      _this.$store.commit("setProcessShow", 0);
                      _this.$router.replace({
                        path: "home",
                      });
                    });
                    //同步lis数据
                    // getSynchronizationRequest({}).then(res => {
                    //
                    // 	if (res && res.success) {
                    // 		//this.$Message.success(res.msg);
                    // 	}
                    // 	else{
                    // 		this.$Message.error("同步失败！！");
                    // 	}
                    // }).catch(err => {
                    // 	//this.$Message.error("同步失败！！");
                    // });
                    //全局变量用于菜单切换
                    // let _this = this;
                    // // 加载菜单
                    // util.initRouter(this, function (v) {
                    //   let data = _this.$store.state.app.navList;
                    //   if (data && data.length > 0) {
                    //     if (data[0].children && data[0].children.length > 0 && data[0].children[0].children && data[0].children[0].children.length > 0){
                    //       let path = "";
                    //       path = data[0].children[0].path == "/" ? "" : data[0].children[0].path;
                    //       path += /^\/./.test(data[0].children[0].children[0].path) ? data[0].children[0].children[0].path : "/" + data[0].children[0].children[0].path;
                    //       _this.$router.replace({
                    //         path: path
                    //       });
                    //     }else {
                    //       _this.$router.replace({
                    //         path: "home"
                    //       });
                    //     }
                    //   } else {
                    //     _this.$Modal.confirm({
                    //       title: '提示',
                    //       content: '当前角色未关联菜单，请联系管理员处理！',
                    //       onOk: () => {
                    //         _this.$Modal.remove()
                    //         _this.$store.commit("logout", _this);
                    //         _this.setStore("accessToken", "");
                    //         // 强制刷新页面 重新加载router
                    //         location.reload();
                    //       },
                    //       onCancel: () => {
                    //         _this.$Modal.remove()
                    //         _this.$store.commit("logout", _this);
                    //         _this.setStore("accessToken", "");
                    //         // 强制刷新页面 重新加载router
                    //         location.reload();
                    //       }
                    //     });
                    //     _this.loading = false;
                    //   }
                    // });
                  } else {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
                this.getCaptchaImg();
              }
            });
          }
        });
      } else if (this.tabName == "mobile") {
        this.$refs.mobileLoginForm.validate((valid) => {
          if (valid) {
            if (this.form.code == "") {
              this.errorCode = "验证码不能为空";
              return;
            } else {
              this.errorCode = "";
            }
            this.form.saveLogin = this.saveLogin;
          }
        });
      }
    },
    //预览文件
    previewFile() {
      //新建标签页预览
      window.open("/excel/用户手册.pdf");

      //当前页弹窗预览
      /*this.pdfUrl = "/excel/用户手册.pdf";
            this.pdfPreviewShow = true;*/
    },
    //预览文件(宣传手册)
    previewFileXC() {
      //新建标签页预览
      window.open("/excel/宣传手册.pdf");
    },
    toGithubLogin() {},
    toQQLogin() {},
    toWeiboLogin() {},
    toWeixinLogin() {},
    toDingdingLogin() {},
    toWorkwechatLogin() {},
    relatedLogin() {},
    handleDropDown(v) {},
  },
  mounted() {
    this.relatedLogin();
    this.getCaptchaImg();

    //软件信息
    let Software = this.$hospitalName.Software;
    this.softwareServiceProvider = Software["软件服务商"];
    this.softwareVersion = Software["软件版本"];
    this.serviceHotline = Software["服务热线"];
  },
};
</script>

<style lang="less">
@import "./login.less";
</style>
