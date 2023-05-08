<template>
    <div class="homeProcess">
        <div class="navigation">
            <div style="margin: 150px 20px;">
                <!-- 从业体检系统流程图 -->
                <Row>
                    <div class="container">
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/tjdw.png" @click="goto(1)">
                                <p>单位信息</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/bm.png" @click="goto(2)">
                                <p>体检登记</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/cj.png" @click="goto(3)">
                                <p>体检诊台</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/zj.png" @click="goto(4)">
                                <p>医生总检</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/dybg.png" @click="goto(5)">
                                <p>体检报告</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/健康证.png" @click="goto(6)">
                                <p>健康证</p>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "processPractice",
        data() {
            return {
                routerList: {
                    1: "/tjgl/tjgl",
                    2: "/tjdj/physicalRegister",
                    3: "/tjzt/checkStation",
                    4: "/inspect/tAllInspect",
                    5: "/healthCertificate/healthCertificate",
                    6: "/tCertificateManage/tCertificateManage",
                }
            };
        },
        methods: {
            goto(val) {
                if (this.routerList[val]) {
                    this.$router.push({
                        path: this.routerList[val]
                    })

                    localStorage.setItem("isHome", true);
                }
            },
        }
    }
</script>

<style lang="less">
    .homeProcess {
        margin: auto;
        z-index: 2;

        img.rect {
            height: 75px;
            border-radius: 10px;
            background: #adbebf;
            text-align: center;
            padding: 5px;
            margin: 5px 5px;
            cursor: pointer;
        }

        div.rect:hover {
            cursor: pointer;
        }

        div.rect p {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }

        div.flex {
            display: -webkit-box;
            flex-wrap: wrap;
            width: 85px;
            height: 87px;
        }

        div.flex p {
            width: 110px;
            text-align: center;
            margin-left: -10px;
            font-weight: 600;
        }

        div.arrow {
            height: 85px;
            width: 50px;
            display: flex;
        }

        div.arrow-only-footer {
            height: 85px;
            display: flex;
        }

        div.arrow-body {
            width: 30px;
            height: 10px;
            background-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgb(0 196 255));
            margin: auto 0;
        }

        div.arrow-body-true {
            width: 30px;
            height: 10px;
            background-color: rgb(0 196 255);
            margin: auto 0;
        }


        div.arrow-footer {
            width: 0;
            height: 0;
            border-width: 15px 20px 15px;
            border-style: solid;

            border-color: transparent transparent transparent rgb(0 196 255);
            margin: auto 0;
            border-right: 0;
        }

        div.arrow-down {
            width: 60px;
        }

        div.arrow-body-down {
            width: 10px;
            height: 30px;
            background-image: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgb(0 196 255));
            margin: 0 auto;
        }

        div.arrow-footer-down {
            width: 0;
            height: 0;
            border-width: 20px 15px 15px;
            border-style: solid;
            border-color: #00c4ff transparent transparent transparent;
            margin: 0 auto;
            border-bottom: 0;
        }

        div.arrow-up {
            width: 60px;
        }

        div.arrow-body-up {
            width: 10px;
            height: 30px;
            background-image: linear-gradient(to top, rgba(255, 0, 0, 0), rgb(0 196 255));
            margin: 0 auto;
        }

        div.arrow-footer-up {
            width: 0;
            height: 0;
            border-width: 20px 15px 15px;
            border-style: solid;
            border-color: transparent transparent #00c4ff transparent;
            margin: 0 auto;
            border-top: 0;
        }

        .container {
            display: flex;
            //margin: 50px 50px 0 50px;
        }

        .square_brackets {
            border: none;
            position: relative;
            padding: 0;
            height: 303px;
            margin-top: 40px;
            width: 40px;
        }

        .square_brackets:before {
            content: '';
            display: block;
            height: 100%;
            width: 40px;
            border: 10px solid #00c4ff;
            position: absolute;
            top: -2px;
        }


        .square_brackets:before {
            right: 0;
            border-left: 0;
        }

        .triangle {
            width: 0;
            height: 0;
            border: 10px solid;
            border-color: transparent #979797 transparent transparent;
            position: absolute;
            left: -17px;
            top: 50px;
        }

        .navigation {
            display: flex;
            margin: auto;
            z-index: 2;
        }

        .square_left {
            border: none;
            position: relative;
            padding: 0;
            height: 303px;
            margin-top: 40px;
            width: 40px;
        }

        .square_left:after {
            content: '';
            display: block;
            height: 100%;
            width: 40px;
            border: 10px solid #00c4ff;
            position: absolute;
            top: -2px;
        }

        .square_left:after {
            left: 0;
            border-right: 0;
        }

        .u-select {
            user-select: none;

            p {
                white-space: nowrap;
            }
        }
    }

</style>
