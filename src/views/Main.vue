<style lang="less">
@import "./main.less";
</style>

<template>
  <div class="main" :class="{ 'main-hide-text': shrink }">
    <!-- 左侧菜单 -->
    <div :class="`sidebar-menu-content side-bar-menu-theme-${menuTheme}`"
         :style="{width: shrink ? leftWidth + 'px' : menuWidth + 'px',overflow: shrink ? 'visible' : 'auto',}">
      <shrinkable-menu
          :shrink="shrink"
          @on-change="handleSubmenuChange"
          :theme="menuTheme"
          :before-push="beforePush"
          :menu-list="menuList">
        <div slot="top" class="logo-content" v-if="showLogo || fixNav">
          <img v-show="!shrink && (menuTheme != 'light' || mainTheme == 'darkMode')" src="@/assets/logo-back.png"/>
          <img v-show="!shrink && menuTheme == 'light' && mainTheme != 'darkMode'" src="@/assets/logo-back.png"/>
          <img v-show="shrink" src="@/assets/logo-min.png" key="min-logo"/>
        </div>
      </shrinkable-menu>
    </div>
    <!-- 右上顶部导航条 -->
    <div :class="`main-header-content fix-nav-${fixNav}`" :style="{paddingLeft: navPaddingLeft,}">
      <div :class="`main-header header-theme-${navTheme}`">
        <div class="header-left">
          <!-- 固定图标 -->
          <div v-if="fixNav && showLogo" style="width: 220px" class="fix-logo" @click="selectProcessShow">
            <img src="@/assets/logo-back.png" v-if="navTheme == 'light' && mainTheme != 'darkMode'"/>
            <img src="@/assets/logo-back.png" key="max-logo" v-else/>
          </div>
          <!-- 收缩图标 -->
          <div class="header-navicon-content header-action" @click="toggleClick" v-if="showFold">
            <Icon custom="iconfont icon-menu-unfold" size="20" v-show="shrink"/>
            <Icon custom="iconfont icon-menu-fold" size="20" v-show="!shrink"/>
          </div>
          <div class="header-middle-content">
            <!-- 顶部菜单 -->
            <div v-if="navType == 1">
              <navMenu
                  :theme="navTheme"
                  :currNav="currNav"
                  :navList="navList"
                  @on-click="selectNav"
                  :sliceNum="sliceNum"
                  :showIcon="showNavMenuIcon"
              />
            </div>
            <!-- 下拉菜单 -->
            <div v-if="navType == 2">
              <navApp
                  currType="tabs"
                  placement="bottom-start"
                  :currNavTitle="currNavTitle"
                  :currNav="currNav"
                  :navList="navList"
                  :type="navShowType"
                  :theme="navTheme"
                  @on-click="selectNav"
              />
            </div>
            <!-- 面包导航 -->
            <div class="main-breadcrumb" v-if="navType == 3">
              <breadcrumb-nav :theme="navTheme" :currentPath="currentPath"/>
            </div>
          </div>
        </div>
        <!-- 顶部右侧按钮 -->
        <div class="header-right-content">
          <search :theme="navTheme" :type="searchType" v-if="showSearch"/>
          <navApp
              :currNav="currNav"
              :navList="navList"
              :type="navShowType"
              @on-click="selectNav"
              v-if="navType == 3"/>
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"/>
          <language/>
          <message-tip/>
          <user/>
          <theme v-if="nickname == '管理员'"/>
        </div>
      </div>
    </div>
    <!-- Tags 标签 -->
    <div class="nav-tags" :style="{paddingLeft: shrink ? leftWidth +'px' : menuWidth + 'px'}">
      <tags-page-opened :pageTagsList="pageTagsList" v-if="showTags"/>
    </div>
    <!-- 页面部分 -->
    <div class="single-page-content" :style="{left: shrink ? leftWidth + 'px' : menuWidth + 'px',top: showTags ? '100px' : '60px', padding: '0px'}">
      <div class="single-page" :style="{height: showTags ? 'calc(100vh - 100px)' : 'calc(100vh - 60px)'}">
        <keep-alive :include="cachePage">
          <router-view/>
        </keep-alive>
      </div>
      <!-- 页面页脚 -->
      <div class="main-page-footer-content" v-if="showFooter">
        <Footer class="main-page-footer"/>
      </div>
    </div>
    <!-- 全局加载动画 -->
    <circleLoading class="loading-position" v-show="loading"/>
  </div>
</template>

<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import navMenu from "./main-components/navMenu.vue";
import navApp from "./main-components/navApp.vue";
import search from "./main-components/search.vue";
import fullScreen from "./main-components/fullscreen.vue";
import language from "./main-components/language.vue";
import messageTip from "./main-components/message-tip.vue";
import user from "./main-components/user.vue";
import Footer from "./main-components/footer.vue";
import theme from "./main-components/theme.vue";
import circleLoading from "@/views/my-components/scmt/circle-loading.vue";

import util from "@/libs/util.js";
import Vue from "vue";

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    navMenu,
    navApp,
    search,
    fullScreen,
    language,
    messageTip,
    user,
    Footer,
    theme,
    circleLoading,
  },
  data() {
    return {
      navPaddingLeft: this.menuWidth,
      searchType: "input",
      //sliceNum: 10,
      // currNav: "",
      isFullScreen: true,
    };
  },
  computed: {
    nickname() {
      return this.$store.state.user.nickname;
    },
    // 主题
    mainTheme() {
      return this.$store.state.theme.theme.mainTheme;
    },
    menuTheme() {
      return this.$store.state.theme.theme.menuTheme;
    },
    navTheme() {
      return this.$store.state.theme.theme.navTheme;
    },
    menuWidth() {
      return this.$store.state.theme.theme.menuWidth;
    },
    fixNav() {
      return this.$store.state.theme.theme.fixNav;
    },
    navType() {
      return this.$store.state.theme.theme.navType;
    },
    showTags() {
      return this.$store.state.theme.theme.showTags;
    },
    showNavMenuIcon() {
      return this.$store.state.theme.theme.showNavMenuIcon;
    },
    navShowType() {
      return this.$store.state.theme.theme.navShowType;
    },
    showFold() {
      return this.$store.state.theme.theme.showFold;
    },
    showLogo() {
      return this.$store.state.theme.theme.showLogo;
    },
    showSearch() {
      return this.$store.state.theme.theme.showSearch;
    },
    showFooter() {
      return this.$store.state.theme.theme.showFooter;
    },
    weakMode() {
      return this.$store.state.theme.theme.weakMode;
    },
    // 应用
    loading() {
      return this.$store.state.app.loading;
    },
    navList() {
      return this.$store.state.app.navList;
    },
    currNavTitle() {
      return this.$store.state.app.currNavTitle;
    },
    currNav() {
      return this.$store.state.app.currNav;
    },
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    sliceNum() {
      return this.$store.state.theme.theme.sliceNum;
    },
    shrink() {
      return this.$store.state.theme.theme.shrink;
    },
    leftWidth() {
      return this.$store.state.theme.theme.leftWidth;
    }
  },
  methods: {
    selectProcessShow() {
      this.$store.commit("setProcessShow", 0);
      if (this.$route.name != "home_index") {
        this.$router.push({
          name: "home_index",
        });
      }
    },
    init() {
      this.changeFixNav();
      // 菜单
      let pathArr = util.setCurrentPath(this, this.$route.name);
      this.checkTag(pathArr[0].name);
      let currWidth = document.body.clientWidth;
      if (currWidth <= 1200) {
        this.$store.commit("setSliceNum", 2);
      }
    },
    getCurrNav() {
      // 读取选中顶部菜单名
      let currNav = this.getStore("currNav");
      if (currNav) {
        //this.currNav = currNav;
        this.$store.commit("setCurrNav", currNav);
      } else {
        // 默认第一个
        if (this.navList && this.navList.length > 0) {
          //this.currNav = this.navList[0].name;
          this.$store.commit("setCurrNav", this.navList[0].name);
        }
      }
    },
    selectNav(name) {
      // if (this.currNav === name) {
      //   return;
      // }
      let flag = false;
      this.navList.forEach((e) => {
        if (e.name == name) {
          if (e.showLeft == true) {
            this.$store.commit("setMenuWidth", 220);
          } else {
            this.$store.commit("setMenuWidth", 0);
          }
          if (e.isMenu == false) {
            flag = true;
            if (e.description == "direct") {
              window.location.href = e.url;
            } else if (e.description == "window") {
              window.open(e.url);
            } else if (e.description == "route") {
              this.$router.push({
                name: e.url,
              });
            }
          }
        }
      });
      if (flag) {
        // 第三方站外链接 不作其他操作
        return;
      }
      // 缓存当前顶部菜单名
      //this.currNav = name;
      this.setStore("currNav", name);
      this.$store.commit("setCurrNav", name);
      // 点击顶部菜单 回到首页
      // if (this.$route.name != "home_index") {
      //   this.$router.push({
      //     name: "home_index",
      //   });
      // }
      //点击顶部菜单，默认跳转左侧第一个菜单
      util.initRouter(this);
      let _this = this;

      let data = _this.menuList;
      if (data && data.length > 0 && data[0].children && data[0].children.length > 0) {
        let path = "";
        path = data[0].path == "/" ? "" : data[0].path;
        path += /^\/./.test(data[0].children[0].path) ? data[0].children[0].path : "/" + data[0].children[0].path;
        if (_this.$route.name == data[0].children[0].name) {
          _this.$router.replace({
            name: "home_index"
          });
        }
        setTimeout(function () {
          _this.$router.replace({
            path: path
          });
        }, 50);
      } else {
        if (_this.$route.name != 'home_index') {
          _this.$router.replace({
            name: "home_index"
          });
        }
      }
    },
    toggleClick() {
      this.$store.commit("setShrink", !this.shrink);
      this.changeFixNav();
    },
    changeFixNav() {
      if (this.fixNav) {
        this.navPaddingLeft = "0px";
      } else {
        this.navPaddingLeft = this.shrink ? this.leftWidth + 'px' : this.menuWidth + "px";
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some((item) => {
        if (item.name == name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
            this,
            name,
            this.$route.params || {},
            this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // console.log(name)
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    resize() {
      let currWidth = document.body.clientWidth;
      if (currWidth <= 1200 && currWidth > 900) {
        this.$store.commit("setSliceNum", 2);
      } else if (currWidth <= 900) {
        this.$store.commit("setSliceNum", 1);
      } else if (currWidth < 1400) {
        this.$store.commit("setSliceNum", 5);
      } else if (currWidth < 1700) {
        this.$store.commit("setSliceNum", 6);
      } else if (currWidth < 1900) {
        this.$store.commit("setSliceNum", 8);
      } else {
        this.$store.commit("setSliceNum", 10);
      }
      if (currWidth < 1325 && currWidth > 1200) {
        this.searchType = "icon";
      } else if (currWidth < 1000 && currWidth > 900) {
        this.searchType = "icon";
      } else if (currWidth < 835) {
        this.searchType = "icon";
      } else {
        this.searchType = "input";
      }
      this.changeFixNav();
    },
  },
  watch: {
    $route(to) {
      let item = localStorage.getItem("isHome");
      if (to.name == 'home_index' || item) {
        this.$store.commit("setCurrNav", "");
        this.$store.commit("setShrink", true);
        this.$store.commit("setShowFold", false);
        this.$store.commit("setMenuWidth", 0);
        this.$store.commit("setLeftWidth", 0);
      } else {
        this.$store.commit("setShrink", false);
        this.$store.commit("setMenuWidth", 220);
        this.$store.commit("setLeftWidth", 60);
        this.$store.commit("setShowFold", true);
      }
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      this.checkTag(to.name);
      localStorage.removeItem("isHome");
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
    fixNav() {
      this.changeFixNav();
    },
    menuWidth() {
      this.changeFixNav();
    },
    navList() {
      setTimeout(() => {
        this.getCurrNav();
      }, 100);
    },
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
    this.init();
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
    });
    if (this.navList && this.navList.length > 0) {
      this.getCurrNav();
    }
  },
};
</script>
