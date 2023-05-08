<style lang="less">
    @import "./home.less";
</style>

<template>
    <div style="height: 100%">
        <div class="home">
            <row>
                <div id="navigation" class="home-background">
                    <!-- processShow判断进入的是哪个体检系统 并展示出对应流程 -->
                    <homeCard v-if="processShow==0"></homeCard>
                    <process v-if="processShow==1"></process>
                    <process-healthy v-if="processShow==2"></process-healthy>
                    <process-practice v-if="processShow==3"></process-practice>
                    <process-radiation v-if="processShow==4"></process-radiation>
                    <div v-if="processShow!=0" style="position: absolute;margin-left: 12px;margin-top: 12px;">
                        <img v-if="processShow==1" src="/big_screen/images/职业体检.png" style="width: 100%;height: 100%;">
                        <img v-if="processShow==2" src="/big_screen/images/健康体检.png" style="width: 100%;height: 100%;">
                        <img v-if="processShow==3" src="/big_screen/images/从业体检.png" style="width: 100%;height: 100%;">
                        <img v-if="processShow==4" src="/big_screen/images/放射体检.png" style="width: 100%;height: 100%;">
                    </div>
                    <div style="font-size: 15px;color: #837e7e;position: absolute;right: 24px;bottom: 18px;font-weight: 500;">
                        <!--软件服务商：{{softwareServiceProvider}}&nbsp;-->&nbsp;&nbsp;&nbsp;体检管理系统{{softwareVersion}}
                    </div>
                    <!--<Button v-if="processShow!=0" style="position: absolute" @click="selectProcessShow(0)" shape="circle" icon="ios-home">菜单</Button>-->
                </div>
            </row>
        </div>
    </div>
</template>

<script>
    import process from "./components/process.vue";
    import homeCard from "./components/homeCard.vue";
    import Vue from 'vue'
    import ProcessHealthy from "./components/processHealthy";
    import ProcessPractice from "./components/processPractice";
    import ProcessRadiation from "./components/processRadiation";

    export default {
        name: "home",
        components: {
            ProcessRadiation,
            ProcessPractice,
            ProcessHealthy,
            process,
            homeCard,
        },
        data() {
            return {
                //软件信息
                softwareServiceProvider: "",
                softwareVersion: "",
                serviceHotline: "",

                showVideo: false,
                count: {
                    data1: 5396,
                    data2: 68,
                    data3: 19305,
                    data4: 39503498,
                },
                city: "未知",
                departmentTitle: "无",
                userType: "无",
                time: "",
                price: "...",
                showChangePass: false,
                hospitalName: "",//医院名称
            };
        },
        computed: {
            currNav() {
                let currNav = this.$store.state.app.currNav;
                if (currNav == 'home_index') {
                    this.$store.commit("setMainTheme", 'topNav');
                    this.$store.commit("setMenuTheme", "light");
                    this.$store.commit("setNavTheme", "black");
                    this.$store.commit("setFixNav", true);
                    this.$store.commit("setShrink", true);
                    //this.$store.commit("setShowTags", false);
                    this.$store.commit("setMenuWidth", 0);
                    this.$store.commit("setLeftWidth", 0);
                } else {
                    //this.$store.commit("setShowTags", true);
                    this.$store.commit("setMainTheme", 'topNav');
                    this.$store.commit("setMenuWidth", 0);
                    this.$store.commit("setLeftWidth", 0);
                }
                return currNav;
            },
            nickname() {
                return this.$store.state.user.nickname;
            },
            avatar() {
                return this.$store.state.user.avatar;
            },
            processShow() {
                return this.$store.state.theme.theme.processShow;
            }
        },
        methods: {
            //添加水印
            init() {
                let watermark = {};
                let setWatermark = (str) => {
                    let id = '1.524452.45245245';
                    if (document.getElementById(id) !== null) {
                        document.getElementById('navigation').removeChild(document.getElementById(id));
                    }
                    let can = document.createElement('canvas');
                    can.width = 300;
                    can.height = 240;
                    let cans = can.getContext('2d');
                    // getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性，可用于在画布上绘制文本、线条、矩形、圆形等等。
                    cans.rotate(-20 * Math.PI / 180);
                    // Math.PI = 3.14 = 180°  1度
                    cans.font = '16px Vedana';
                    // Verdana是一套无衬线字体
                    // cans.fillStyle = 'rgba(242, 242, 242, 0.10)';
                    cans.fillStyle = '#d7d5d3'; //方便观看的颜色，正常使用删掉
                    cans.textAlign = 'left';
                    cans.textBaseline = 'Middle';
                    cans.fillText(str, can.width / 20, can.height);
                    let div = document.createElement('div');
                    div.id = id;
                    div.style.pointerEvents = 'none';
                    // 元素永远不会成为鼠标事件的target。
                    div.style.top = '0px';
                    div.style.left = '0px';
                    div.style.position = 'absolute';
                    div.style.zIndex = '1';
                    div.style.width = '100%';
                    div.style.height = "100%";
                    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
                    // left：背景图像在横向上填充从左边开始；
                    // background-repeat 背景图像在横向和纵向平铺
                    document.getElementById('navigation').appendChild(div);
                    return id;
                };
                // 该方法只允许调用一次
                watermark.set = (str) => {
                    let id = setWatermark(str);
                    // setInterval(() => {
                    //   if (document.getElementById(id) === null) {
                    //     id = setWatermark(str);
                    //   }
                    // }, 2000);
                    window.onresize = () => {
                        // 当浏览器被重置大小时执行Javascript代码:
                        //setWatermark(str);
                    };
                };
                //根据医院的名字 设置水印名称
                watermark.set(this.$hospitalName.name);
            },
        },
        mounted() {
            //软件信息
            let Software = this.$hospitalName.Software;
            this.softwareServiceProvider= Software["软件服务商"];
            this.softwareVersion= Software["软件版本"];
            this.serviceHotline= Software["服务热线"];

            this.init();
            let pic = {
                load(domName, datas) {
                    let num = Object.keys(datas).length;
                    Object.keys(datas).forEach((i, j) => {
                        pic.rect('container', datas[i], (j + 1) === num);
                    });
                    //this.bindEvents()
                },
                rect(domName, data, isEnd) {
                    let div = document.createElement("div");
                    div.classList.add("flex");
                    for (let i in data) {
                        div.innerHTML += '<div>\n' +
                            '            <img class="rect"  src="' + data[i].url + '">\n' +
                            '                <p>' + data[i].title + '</p>\n' +
                            '            </img>\n' +
                            '        </div>';
                    }
                    document.getElementById(domName).appendChild(div);
                    if (!isEnd) {
                        let arrow = document.createElement("div");
                        arrow.classList.add("arrow");
                        arrow.innerHTML +=
                            '        <div class="arrow-body"></div>\n' +
                            '        <div class="arrow-footer"></div>\n';
                        document.getElementById(domName).appendChild(arrow)
                    }
                },
                bindEvents() {
                    let rect = document.getElementsByClassName('rect');
                    for (let i = 0, rule; rule = rect[i++];) {
                        rule.addEventListener('click', () => {
                            let title = rule.getAttribute('data');
                            alert(title);
                        });
                    }
                }
            };
        }
    };
</script>
<style lang="less">
    .home {
        .home-background {
            display: flex;
            height: calc(100vh - 60px);
            width: 100%;
            position: relative;
            //min-width: 1330px;
            /*background-color: #fff*/

            background: url("../../assets/images/homeBg.png") 50% 50%;
            background-size: 100% 100%;

            //
        }
    }

</style>
