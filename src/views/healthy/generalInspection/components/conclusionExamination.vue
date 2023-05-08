<style lang="less">
    .conclusionExamination {
        .ivu-modal {
            width: 800px !important;
        }

        .cardTextareaResult {
            width: 100%;

            .cardTextarea > textarea::-webkit-scrollbar {
                width: 4px;
                background-color: #2684e780;
            }

            .cardTextarea > textarea::-webkit-scrollbar-track {
                background-color: #e4e4e4;
                border-radius: 100px;
            }

            .cardTextarea > textarea::-webkit-scrollbar-thumb {
                background-color: #2684e780;
                border-radius: 100px;
            }
        }

    }
</style>
<template>
    <Modal v-model="show" :title="modalTitle" :mask-closable="false" :draggable="false" class="conclusionExamination">
        <Row :gutter="16">
            <Col span="12">
                <div class="txt"><span
                        style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>职业健康体检结论
                </div>
                <div class="cardTextareaResult">
                    <div class="textareaResult" style="position: relative;">
                        <Input type="textarea" class="cardTextarea"
                               v-model="inspectForm.conclusionInfo"
                               :autosize="{maxRows: 10,minRows:10}"></Input>
                    </div>

                </div>
            </col>
            <Col span="12">
                <div class="txt"><span
                        style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>职业健康体检结果
                </div>
                <div class="cardTextareaResult">
                    <div class="textareaResult" style="position: relative;">
                        <Input type="textarea" class="cardTextarea"
                               v-model="inspectForm.conclusion"
                               :autosize="{maxRows: 10,minRows:10}"></Input>
                    </div>

                </div>
            </Col>
        </Row>
        <Row :gutter="16">
            <Col span="12">
                <div class="txt"><span
                        style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>其他异常描述
                </div>
                <div class="cardTextareaResult">
                    <div class="textareaResult" style="position: relative;">
                        <Input type="textarea" class="cardTextarea"
                               v-model="inspectForm.otherCheckAbnormalResults"
                               :autosize="{maxRows: 10,minRows: 10}"></Input>
                    </div>

                </div>
            </Col>

            <Col span="12">
                <div class="txt"><span
                        style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>职业健康体检建议
                </div>
                <div class="cardTextareaResult">
                    <div class="textareaResult" style="position: relative;">
                        <Input type="textarea" class="cardTextarea"
                               v-model="inspectForm.handleOpinion"
                               :autosize="{maxRows: 10,minRows: 10}"></Input>
                    </div>

                </div>
            </Col>
        </Row>
    </Modal>
</template>
<script>

	import {getTInspectionRecordByPersonId} from "../../../../api/healthy/tInspectionRecord";
	import {formartDate} from "../../../../api/tools/tool";

	export default {
		name: "conclusionExamination",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			modalTitle: {
				type: String
			},
			personId: {
				type: String,
				default: null
			},
			hazardFactorsList: {
				type: Array,
				default: []
			},
		},
		data() {
			return {
				show: this.value,//是否显示
				loading: false,
				inspectForm: {
					handleOpinion: "",
					conclusion: "",
					otherCheckAbnormalResults: "",
					conclusionInfo: "",
				},//总检结论
			}
		},
		methods: {
			//查询人员总检记录
			getInsRecord(id) {
				let _this = this;
				// _this.inspectForm= {};
				_this.inspectForm.tDiseaseDiagnosis = null;
				getTInspectionRecordByPersonId({personId: _this.personId}).then(res => {
					_this.inspectForm.id = "";
					if (res.success && res.data) {
						_this.inspectForm.id = res.data.id;
						_this.inspectForm.inspectionDoctor = res.data.inspectionDoctor;
						_this.inspectForm.inspectionAutograph = res.data.inspectionAutograph;
						_this.inspectForm.reviewResult = res.data.reviewResult;
						_this.inspectForm.reviewResultCode = res.data.reviewResultCode;
						_this.inspectForm.reviewOpinion = res.data.reviewOpinion;

						_this.inspectForm.createId = res.data.createId;
						_this.inspectForm.operator = res.data.operator;
						_this.inspectForm.healthCertificateConditions = res.data.healthCertificateConditions;
						_this.inspectForm.conclusion = res.data.conclusion;
						_this.inspectForm.conclusionCode = res.data.conclusionCode;

						_this.inspectForm.otherCheckAbnormalResults = res.data.otherCheckAbnormalResults;
						_this.inspectForm.careerIllnessName = res.data.careerIllnessName;
						_this.inspectForm.handleOpinion = res.data.handleOpinion;
						_this.inspectForm.occupationalTabooNowCode = res.data.occupationalTabooNowCode;
						_this.inspectForm.occupationalDiseasesNowCode = res.data.occupationalDiseasesNowCode;
                        if(res.data.bairns &&res.data.bairns.length>0){
							_this.inspectForm.bairns = res.data.bairns;
                        	_this.initTypeName();
							_this.inspectForm.conclusionInfo = _this.getTdTjBadrsnsResultData (res.data.bairns);

						}
					}
				})
			},
            //初始化危害因素的typeName
            initTypeName(){
				let _this = this;
                if(_this.inspectForm.bairns && _this.inspectForm.bairns.length>0 && _this.hazardFactorsList && _this.hazardFactorsList.length>0){
					for (let i = 0; i < _this.inspectForm.bairns.length; i++) {
						let item = _this.inspectForm.bairns[i];
						if(item && item.badrsnCode){
							let filter = _this.hazardFactorsList.filter(ii => ii && ii.code == item.badrsnCode);
							if(filter && filter.length>0){
								item.typeName = filter[0].name;
                            }
                        }
					}
                }
            },
			//获取职业健康检查结论
			getTdTjBadrsnsResultData(val) {
				let _this = this;
				if (val) {
					/*1.目前未见异常（汽油、噪声）；
                    2.复查（木粉尘）；
                    3.疑是职业病（木粉尘）；
                    4.职业禁忌证（电焊烟尘）；
                    5.其他疾病或异常（矽尘，血葡萄糖减少 1mmol/L）)*/
					let tdTjBadrsnsData = val;
					let tdTjBadrsnsResult = "";
					let intText = 0;
					let resultWJYC = [];//未见异常结论
					resultWJYC = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12001")
					if(resultWJYC && resultWJYC.length>0){
						let badrsnTexts = "";
						for(let i = 0;i < resultWJYC.length;i ++){
							if(!badrsnTexts){
								badrsnTexts = resultWJYC[i].typeName;
							}else{
								badrsnTexts += "、" + resultWJYC[i].typeName;
							}
						}
						if(badrsnTexts){
							intText ++;
							tdTjBadrsnsResult += "" + intText + ".目前未见异常（" + badrsnTexts + "）"
						}
					}
					let resultFC = [];//复查结论
					resultFC = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12002")
					if(resultFC && resultFC.length>0){
						let badrsnTexts = "";
						for(let i = 0;i < resultFC.length;i ++){
							if(!badrsnTexts){
								badrsnTexts = resultFC[i].typeName;
							}else{
								badrsnTexts += "、" + resultFC[i].typeName;
							}
						}
						if(badrsnTexts){
							intText ++;
							tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".复查（" + badrsnTexts + "）"
						}
					}
					let resultZYB = [];//疑是职业病结论
					resultZYB = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12003")
					if(resultZYB && resultZYB.length>0){
						let badrsnTexts = "";
						for(let i = 0;i < resultZYB.length;i ++){
							if(!badrsnTexts){
								badrsnTexts = resultZYB[i].typeName;
							}else{
								badrsnTexts += "、" + resultZYB[i].typeName;
							}
						}
						if(badrsnTexts){
							intText ++;
							tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".疑是职业病（" + badrsnTexts + "）"
						}
					}
					let resultJJZ = [];//职业禁忌证结论
					resultJJZ = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12004")
					if(resultJJZ && resultJJZ.length>0){
						let badrsnTexts = "";
						for(let i = 0;i < resultJJZ.length;i ++){
							if(!badrsnTexts){
								badrsnTexts = resultJJZ[i].typeName;
							}else{
								badrsnTexts += "、" + resultJJZ[i].typeName;
							}
						}
						if(badrsnTexts){
							intText ++;
							tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".职业禁忌证（" + badrsnTexts + "）"
						}
					}
					let resultQTYC = [];//其他异常结论
					resultQTYC = tdTjBadrsnsData.filter(item => item && item.badrsnCode && item.examConclusionCode=="12005")
					if(resultQTYC && resultQTYC.length>0){
						let badrsnTexts = "";
						let qtjbNames = "";
						for(let i = 0;i < resultQTYC.length;i ++){
							if(!badrsnTexts){
								badrsnTexts = resultQTYC[i].typeName;
							}else{
								badrsnTexts += "、" + resultQTYC[i].typeName;
							}
							if(!qtjbNames && resultQTYC[i].qtjbName){
								qtjbNames = "，" + resultQTYC[i].qtjbName.replace(" ","").replace(/\r|\n/ig, "");
							}
						}
						if(badrsnTexts){
							intText ++;
							tdTjBadrsnsResult += (intText>1 ? "\n" : "") + intText + ".其他疾病或异常（" + badrsnTexts + qtjbNames + "）"
						}
					}
					if (tdTjBadrsnsData){
						return tdTjBadrsnsResult;
					}else {
						return "";
					}
				}else {
					return "";
				}
			},
			//关闭弹框
			closeModal(val) {
				this.$emit('input', val);
			},
		},
		watch: {
			value(val) {
				this.show = val;
			},
			show(val) {
				if (!val) {
					this.closeModal(val);
				} else {
					this.getInsRecord();
				}
			}
		}
	}
</script>
