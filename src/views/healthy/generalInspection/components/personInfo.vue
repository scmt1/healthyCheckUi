<template>
    <Collapse class="personInfoDiv" v-model="value"  @on-change="CollapseChange">
        <Panel name="1">
            体检人员信息
            <span class="personInfoPanelSpan" v-if="personId && personId.trim().length>0&&!isOpen">
                <span style="margin-left: 20px"> 姓名: {{ personInfo.person_name || personInfo.personName }}</span>
                <span style="margin-left: 20px"> 性别: {{ personInfo.sex  }}</span>
                <span style="margin-left: 20px">年龄: {{ personInfo.age }}岁</span>
            </span>
            <template #content>
                <Card >
                    <Form>
                        <Row :gutter="10" style="flex-wrap: nowrap;">
                            <Col span="3" style="min-width: 120px;">
                                <div class="pic">
                                    <div class="pic-box" v-viewer="{movable: false}" :style="{'border':personInfo.avatar?'0 !important;':'auto'}">
                                        <img :src="srcImage(personInfo.avatar)" style="height: 100%;width: 100%;"
                                             v-if="personInfo.avatar">
                                        <img src="../../../../assets/user-avatar.png" style="height: 100%;width: 100%;padding:5px;"
                                             v-if="!personInfo.avatar">
                                    </div>
                                </div>
                            </Col>
                            <Col span="21" style="display: flex;flex-direction: column;">
                                <Row class="txtFrom">
                                    <Col :span="6">
                                        <FormItem label="体检编号">
                                            {{ personInfo.test_num || personInfo.testNum }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="身份证号">
                                            {{ personInfo.id_card || personInfo.idCard }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem :label="setLabel('姓名')">
                                            {{ personInfo.person_name || personInfo.personName }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem :label="setLabel('性别')">
                                            {{ personInfo.sex }}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row class="txtFrom">
                                    <Col :span="6">
                                        <FormItem :label="setLabel('年龄')">
                                            {{ personInfo.age }}岁
                                        </FormItem>
                                    </Col>
                                    <!--<Col :span="6">
                                        <FormItem label="体检类型">
                                            {{ personInfo.physical_type || personInfo.physicalType }}
                                        </FormItem>
                                    </Col>-->
                                    <Col :span="6">
                                        <FormItem label="电话号码">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.mobile">
                                                {{ personInfo.mobile }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>

                                    <Col :span="12">
                                        <FormItem label="单位名称">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.unit_name">
                                                {{ personInfo.unit_name&& personInfo.unit_name.length>12?personInfo.unit_name.substring(0,10)+"...":personInfo.unit_name}}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>

                                </Row>

                                <Row  class="txtFrom">
                                    <Col :span="6" v-if="(personInfo.physical_type == '职业体检' || personInfo.physicalType == '职业体检') || (personInfo.physical_type == '放射体检' ||
                                personInfo.physicalType == '放射体检')">
                                        <FormItem label="危害因素">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.hazard_factors_text">
                                                {{ personInfo.hazard_factors_text || personInfo.hazardFactorsText }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                    <Col :span="6" v-if="(personInfo.physical_type == '职业体检' || personInfo.physicalType == '职业体检') || (personInfo.physical_type == '放射体检' ||
                                personInfo.physicalType == '放射体检')">
                                        <FormItem label="检查种类">
                                            {{ personInfo.work_state_text || personInfo.workStateText }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="登记时间">
                                            {{ personInfo.regist_date?personInfo.regist_date.split('.')[0]:null || personInfo.registDate }}
                                        </FormItem>
                                    </Col>

                                </Row>
                                <Row v-if="(personInfo.physical_type == '职业体检' || personInfo.physicalType == '职业体检') || (personInfo.physical_type == '放射体检' ||
                                personInfo.physicalType == '放射体检')" class="txtFrom">

                                    <Col :span="12">
                                        <FormItem label="目标职业病">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.occupational_diseases">
                                                {{ personInfo.occupational_diseases&& personInfo.occupational_diseases.length>20?personInfo.occupational_diseases.substring(0,10)+"...":personInfo.occupational_diseases}}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                    <Col :span="12">
                                        <FormItem label="目标职业禁忌证">
                                            <Tooltip transfer max-width="200" :content="personInfo.occupational_taboo">
                                                {{ personInfo.occupational_taboo&& personInfo.occupational_taboo.length>20?personInfo.occupational_taboo.substring(0,10)+"...":personInfo.occupational_taboo}}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </template>
        </Panel>
    </Collapse>

</template>

<script>

	import {getTGroupPersonWithLink} from "../../../../api/healthy/tGroupPerson";

	export default {
		name: "personInfo",
		props: {
			personId: {
				type: String,
				default: null
			},
		},
		components: {

        },
		data() {
			return {
				value:"",
                isOpen:false,//折叠版是否打开
				personInfo:{},//人员信息
				isContraindication: false,
				isDiseases: false,
				occupationalTaboo: "",//套餐目标职业禁忌证
				occupationalTabooCode: "",//套餐目标职业禁忌证code
				occupationalTabooNow: "",//当前所选职业禁忌证
				occupationalTabooNowCode: "",//当前所选职业禁忌证code
				occupationalDiseases: "",//套餐目标职业病
				occupationalDiseasesCode: "",//套餐目标职业病code
				occupationalDiseasesNow: "",//当前所选职业病
				occupationalDiseasesNowCode: "",//当前所选职业病code
            }
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		methods: {
			/**
             * 折叠板改变事件
			 * @constructor
			 */
			CollapseChange(e){
				if(e && e.length >0){
					this.isOpen = true;
                }
				else{
					this.isOpen = false;
                }

            },
			//设置头像
			srcImage(url) {
				if(url.indexOf("/dcm") <= -1){
					return "data:image/png;base64," + url;
				}else{
					return url;
				}
			},
			//设置文本
			setLabel(name) {
				name = name.split('')
				if (name.length == 2) {
					return name[0] + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + name[1];
				}
				if (name.length == 3) {
					return name[0] + '\xa0\xa0' + name[1] + '\xa0\xa0' + name[2];
				}
			},
			//获取人员信息
			getOnePersonData(id) {
				this.personInfo = {};
				let _this = this;
				if(id === undefined || id.trim().length===0){
					return
                }
				getTGroupPersonWithLink({id}).then(res => {
					if (res.success && res.data) {
						_this.personInfo = res.data;

						if(_this.personInfo.occupational_taboo_now){
							_this.occupationalTabooNow = _this.personInfo.occupational_taboo_now;
							_this.occupationalTabooNowCode = _this.personInfo.occupational_taboo_now_code;
						}else{
							_this.occupationalTabooNow = "";
							_this.occupationalTabooNowCode = "";
						}
						if(_this.personInfo.occupational_diseases_now){
							_this.occupationalDiseasesNow = _this.personInfo.occupational_diseases_now;
							_this.occupationalDiseasesNowCode = _this.personInfo.occupational_diseases_now_code;
						}else{
							_this.occupationalDiseasesNow = "";
							_this.occupationalDiseasesNowCode = "";
						}
						if(_this.personInfo.review_result){
							_this.reviewData = _this.personInfo.review_result;
						}else{
							_this.reviewData = "";
						}
						let checkResultNow = _this.personInfo.check_result;
						if(checkResultNow && checkResultNow.indexOf(",") > -1){
							let checkResultNowSplit = checkResultNow.split(",");
							if(checkResultNowSplit.indexOf('2') > -1){
								_this.isContraindication = true;
							}else{
								_this.isContraindication = false;
							}
							if(checkResultNowSplit.indexOf('3') > -1){
								_this.isDiseases = true;
							}else{
								_this.isDiseases = false;
							}
							if(checkResultNowSplit.indexOf('4') > -1){
								_this.isReviewResult = true;
							}else{
								_this.isReviewResult = false;
							}
						}else if(checkResultNow){
							if(checkResultNow == '2'){
								_this.isContraindication = true;
							}else{
								_this.isContraindication = false;
							}
							if(checkResultNow == '3'){
								_this.isDiseases = true;
							}else{
								_this.isDiseases = false;
							}
							if(checkResultNow == '4'){
								_this.isReviewResult = true;
							}else{
								_this.isReviewResult = false;
							}
						}
						_this.$emit('personInfoChang',_this.personInfo);
					}
				}).finally(() => {
					this.personInfoLoading = false;
					this.radioShow = false;
				})
			},
            //回调 人员信息
            getPersonInfo() {
                return this.personInfo;
            },
        },
		mounted() {

		},

		watch: {
            'personId'(val){
				this.getOnePersonData(val);
            }
		},
	}
</script>

<style lang="less">
    .personInfoDiv{
        width: 100%;
        .personInfoPanelSpan{
            margin-left: 30px;
            font-weight: 400;
        }
        .ivu-collapse-header {
            user-select: none;
            font-size: 0.729vw;
            font-weight: 700;
        }
        .txtFrom{
            height: 34px !important;
        }
        .pic {
            .pic-box {
                width: 120px !important;
                height: 120px !important;
            }
        }
        .ivu-form-item-content {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }
        .ivu-tooltip-rel {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        .ivu-tooltip-inner {
            min-height: 100px;
        }

    }

</style>