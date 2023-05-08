<template>
    <div class="homeProcess">
        <div class="navigation">
            <div>
                <!-- 职业体检系统流程图-->
                <Row>
                    <div class="container">
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/tjdw.png" @click="goto(2)">
                                <p>团检单位</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/tjdd.png" @click="goto(5)">
                                <p>团检订单</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>

                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/tjry.png" @click="goto(4)">
                                <p>团检人员</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/tdsp.png" @click="goto(3)">
                                <p>合同评审</p>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div class="container regist">
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/bm.png" @click="goto(1)">
                                <p>体检登记</p>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
            <div class="square_brackets"></div>
            <div class="doc">
                <Row>
                    <div class="container">
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/cj.png" @click="goto(6)">
                                <p>体检诊台</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/zj.png" @click="goto(7)">
                                <p>医生总检</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/shbg.png" @click="goto(8)">
                                <p>报告审核</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/dybg.png" @click="goto(9)">
                                <p>体检报告</p>
                            </div>
                        </div>
                        <div class="arrow">
                            <div class="arrow-body"></div>
                            <div class="arrow-footer"></div>
                        </div>
                    </div>
                </Row>
            </div>
            <div class="square_left"></div>
            <div>
                <Row>
                    <div class="container">
                        <div class="arrow-only-footer unit">
                            <div class="arrow-footer" style="position:relative;top:-1px;"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/dwbg.png" @click="goto(10)">
                                <p>单位报告</p>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div class="container data-count">
                        <div class="arrow">
                            <div class="arrow-body-true"></div>
                            <div class="arrow-footer"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/tj.png" @click="goto(11)">
                                <p>查询统计</p>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div class="container data-submit">
                        <div class="arrow-only-footer">
                            <div class="arrow-footer" style="position:relative;top:2px;"></div>
                        </div>
                        <div class="flex">
                            <div class="u-select">
                                <img class="rect" src="/big_screen/images/sjwb.png" @click="goto(12)">
                                <p>数据网报</p>
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
        name: "process",
        data() {
            return {
                routerList: {
                    1: "/tjdj/physicalRegister",
                    2: "/tjgl/tjgl",
                    3: "/tdaudit/tdaudit",
                    4: "/tjry/tjry",
                    5: "/tjdd/tjdd",
                    6: "/tjzt/checkStation",
                    7: "/inspect/tAllInspect",
                    8: "/bgsh/bgsh",
                    9: "/bgdy/bgdy",
                    10: "/unit/unitReport",
                    11: "/cxtj/cxtj",
                    12: "/history/history",
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
            height: (75 / 19.2vw) !important;
            border-radius: (10 / 19.2vw) !important;
            background: #adbebf;
            text-align: center;
            padding: (5 / 19.2vw) !important;
            margin: (5 / 19.2vw) (5 / 19.2vw) !important;
            cursor: pointer;
        }

        div.rect:hover {
            cursor: pointer;
        }

        div.rect p {
            font-size: (14 / 19.2vw) !important;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }

        div.flex {
            display: -webkit-box;
            flex-wrap: wrap;
            width: (85 / 19.2vw) !important;
            height: (87 / 19.2vw) !important;
        }

        div.flex p {
            width: (110 / 19.2vw) !important;
            text-align: center;
            margin-left: (-10 / 19.2vw) !important;
            font-weight: 600;
        }

        div.arrow {
            height: (85 / 19.2vw) !important;
            width: (50 / 19.2vw) !important;
            display: flex;
        }

        div.arrow-only-footer {
            height: (85 / 19.2vw) !important;
            display: flex;
        }

        .unit {
            position: relative;
            top: 4px;
        }

        div.arrow-body {
            width: (30 / 19.2vw) !important;
            height: (10 / 19.2vw) !important;;
            background-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgb(0 196 255));
            margin: auto 0;
        }

        div.arrow-body-true {
            width: (30 / 19.2vw) !important;
            height: (10 / 19.2vw) !important;
            background-color: rgb(0 196 255);
            margin: auto 0;
        }


        div.arrow-footer {
            width: 0;
            height: 0;
            border-width: (15 / 19.2vw) (20 / 19.2vw) (15 / 19.2vw) !important;
            border-style: solid;
            border-color: transparent transparent transparent rgb(0 196 255);
            margin: auto 0;
            border-right: 0;
        }

        div.arrow-down {
            width: (60 / 19.2vw) !important;
        }

        div.arrow-body-down {
            width: (10 / 19.2vw) !important;
            height: (30 / 19.2vw) !important;
            background-image: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgb(0 196 255));
            margin: 0 auto;
        }

        div.arrow-footer-down {
            width: 0;
            height: 0;
            border-width: (20 / 19.2vw) (15 / 19.2vw) (15 / 19.2vw) !important;
            border-style: solid;
            border-color: #00c4ff transparent transparent transparent;
            margin: 0 auto;
            border-bottom: 0;
        }

        div.arrow-up {
            width: (60 / 19.2vw) !important;
        }

        div.arrow-body-up {
            width: (10 / 19.2vw) !important;
            height: (30 / 19.2vw) !important;
            background-image: linear-gradient(to top, rgba(255, 0, 0, 0), rgb(0 196 255));
            margin: 0 auto;
        }

        div.arrow-footer-up {
            width: 0;
            height: 0;
            border-width: (20 / 19.2vw) (15 / 19.2vw) (15 / 19.2vw) !important;
            border-style: solid;
            border-color: transparent transparent #00c4ff transparent;
            margin: 0 auto;
            border-top: 0;
        }

        .container {
            display: flex;
        }

        .regist {
            margin-top: (200 / 19.2vw) !important;;
            margin-left: (405 / 19.2vw) !important;
        }

        .data-count {
            margin-top: (60 / 19.2vw) !important;
            margin-left: (-30 / 19.2vw) !important;
        }

        .data-submit {
            margin-top: (60 / 19.2vw) !important;
        }

        .square_brackets {
            border: none;
            position: relative;
            padding: 0;
            height: (303 / 19.2vw) !important;
            margin-top: (40 / 19.2vw) !important;
            width: (40 / 19.2vw) !important;

            &::before {
                content: '';
                display: block;
                height: 100%;
                width: (40 / 19.2vw) !important;
                border-right: (10 / 19.2vw) solid #00c4ff !important;
                border-top: (10 / 19.2vw) solid #00c4ff !important;
                border-bottom: (10 / 19.2vw) solid #00c4ff !important;
                position: absolute;
                top: (2 / 19.2vw) !important;
                right: (-10 / 19.2vw) !important;
                border-left: 0 !important;
            }
        }

        .doc {
            margin: (150 / 19.2vw) (20 / 19.2vw) !important;
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
            height: (303 / 19.2vw) !important;
            margin-top: (40 / 19.2vw) !important;
            width: (40 / 19.2vw) !important;

            &::after {
                content: '';
                display: block;
                height: 100%;
                width: (40 / 19.2vw) !important;
                border: 8px solid #00c4ff !important;
                border-left: (10 / 19.2vw) solid #00c4ff !important;
                border-top: (10 / 19.2vw) solid #00c4ff !important;
                border-bottom: (10 / 19.2vw) solid #00c4ff !important;
                position: absolute;
                top: (2 / 19.2vw) !important;
                left: 0;
                border-right: 0 !important;
            }
        }

        .u-select {
            user-select: none;

            p {
                white-space: nowrap;
            }
        }
    }
</style>
