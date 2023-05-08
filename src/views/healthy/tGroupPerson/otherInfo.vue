<template>
    <div style="padding-top: 10px;height: 100%">
        <div class="empty" style="display: flex;justify-content: center;align-items: center;flex-direction:column;"
             v-if="!personInfo || !personInfo.id">
            <img src="@/assets/sorry.png" style="width: 300px;height: 200px;margin-bottom: 10px;">
            <span style="color: #c1c1c1;">暂无数据</span>
        </div>
        <Form :label-width="110" class="otherForm" :rules="personInfoRule" :model="personInfo" ref="otherForm" v-else>
            <el-tabs v-model="tabsValue" type="border-card" v-if="personInfo.physicalType == '职业体检' || personInfo.physicalType == '放射体检'">
                <el-tab-pane name="1" label="基本信息">
                    <div v-if="tabsValue == '1'">
                        <Row style="margin-top: 15px;">
                            <!--<Col span="8">
                                <FormItem label="特殊工种名称">
                                    <Input type="text" v-model="personInfo.workName" placeholder="请输入工种其他名称"/>
                                </FormItem>
                            </Col>-->
                            <Col span="8">
                                <FormItem label="工龄年数" prop="workYear">
                                    <InputNumber :min="0" :max="100" v-model="personInfo.workYear" @on-blur="workYearChange" placeholder="请输入总工龄年数"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="工龄月数" prop="workMonth">
                                    <InputNumber :min="0" :max="11" v-model="personInfo.workMonth" @on-blur="workYearChange" placeholder="请输入工龄月数"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="结婚状况" prop="isMarry">
                                    <Select v-model="personInfo.isMarry" placeholder="请选择" clearable transfer>
                                        <Option value="未婚">未婚</Option>
                                        <Option value="已婚">已婚</Option>
                                        <Option value="离异">离异</Option>
                                        <Option value="丧偶">丧偶</Option>
                                        <Option value="其他">其他</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="isInterrogationSplitting">
                            <Col span="8">
                                <FormItem label="接害年数" prop="exposureWorkYear">
                                    <InputNumber :min="0" :max="100" v-model="personInfo.exposureWorkYear" @on-blur="workYearChangeExp" placeholder="请输入接害工龄年数"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="接害月数" prop="exposureWorkMonth">
                                    <InputNumber :min="0" :max="11" v-model="personInfo.exposureWorkMonth" @on-blur="workYearChangeExp" placeholder="请输入接害工龄月数"/>
                                </FormItem>
                            </Col>

                        </Row>
                        <Row>
                            <Col span="8" v-if="personInfo.workStateCode != '1001'">
                                <FormItem label="接害开始日期" prop="exposureStartDate">
                                    <DatePicker type="date" placeholder="请选择" style="width: 100%;" transfer v-model="personInfo.exposureStartDate"
                                                :options="option"
                                                @on-change="exposureStartDateChange" format="yyyy-MM-dd"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="文化程度">
                                    <Select v-model="personInfo.education" placeholder="请选择" clearable transfer>
                                        <Option v-for="(item, i) in personInfoPriority" :key="i" :value="item.value">{{ item.title }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="家庭地址" prop="familyAddress">
                                    <Input type="text" :maxlength=50 v-model="personInfo.familyAddress" placeholder="请输入家庭地址"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="工种名称" prop="workTypeText">
                                    <Input placeholder="请选择工种" @click.native="handleWorkCode"
                                           v-model="personInfo.workTypeText"></Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="工种其他名称">
                                    <Input type="text" v-model="personInfo.workName" placeholder="请输入工种其他名称"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="所属部门">
                                    <Input type="text" v-model="personInfo.department" placeholder="请输入部门名称"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                            <Col span="8">
                                <FormItem label="邮政编码">
                                    <Input type="text" v-model="personInfo.zipCode" placeholder="请输入邮政编码"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="职务/职称">
                                    <Input type="text" v-model="personInfo.job" placeholder="请输入职务名称"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="2" label="职业史和个人生活史">
                    <div v-if="tabsValue == '2'" style="overflow-y: auto;">
                        <Row style="margin-top: 15px;" v-if="personInfo.sex == '女'" >
                            <FormItem label="月经史">
                                <Row :gutter="15">
                                    <Col style="width: 225px;">
                                        <RadioGroup v-model="personInfo.menstrualHistory">
                                            <Radio label="正常"></Radio>
                                            <Radio label="经期"></Radio>
                                            <Radio label="停经"></Radio>
                                            <Radio label="异常"></Radio>
                                        </RadioGroup>
                                    </Col>
                                    <Col>
                                        <Input v-model="personInfo.menstrualInfo" type="text" v-if="personInfo.menstrualHistory == '异常'" v-width="292"/>
                                    </Col>
                                </Row>
                                <Row :gutter="20" style="display: flex;margin-top: 20px"v-if="isMenstrualHistory||this.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                                    <Col span="4">
                                        <Input type="number" v-model="personInfo.menarche">
                                            <span slot="prepend">初潮</span>
                                            <span slot="append">岁</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input type="number" v-model="personInfo.period">
                                            <span slot="prepend">经期</span>
                                            <span slot="append">天</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input type="number" v-model="personInfo.cycle">
                                            <span slot="prepend">周期</span>
                                            <span slot="append">天</span>
                                        </Input>
                                    </Col>
                                    <Col span="5">
                                        <Input type="number" v-model="personInfo.lastMenstruation">
                                            <span slot="prepend">停经年龄</span>
                                            <span slot="append">岁</span>
                                        </Input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                        <Row v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                            <FormItem label="婚姻史">
                                <Row style="display: flex;margin-bottom: 24px;">
                                    <div>结婚日期：</div>
                                    <DatePicker type="date" placeholder="请选择" style="width: 223px;" transfer v-model="personInfo.marriageDate"
                                                @on-change="marriageDateChange" format="yyyy-MM-dd"/>
                                </Row>
                                <Row style="margin-bottom: 24px;display: flex">
                                    <div>配偶接触放射线情况：</div>
                                    <Input v-model="personInfo.spouseRadiationSituation" maxlength="50" type="text" v-width="500"/>
                                </Row>
                                <Row style="display: flex">
                                    <div>配偶职业及健康状况：</div>
                                    <Input v-model="personInfo.spouseHealthSituation" maxlength="50" type="text" v-width="500"/>
                                </Row>
                            </FormItem>
                        </Row>
                        <Row v-if="personInfo.sex == '男'">
                            <FormItem label="生育史">
                                <Row :gutter="15" style="margin-bottom: 24px;">
                                    <Col span="4">
                                        <Input class="sexExisting" v-model="personInfo.existingChildren" type="number"
                                               @input="existChildChange('child',$event)">
                                            <span slot="prepend">现有子女</span>
                                            <span slot="append">人</span>
                                        </Input>
                                    </Col>
                                </Row>
                                <Row :gutter="15" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                                    <Col span="4">
                                        <Input v-model="personInfo.boys" type="number" @input="existChildChange('boys',$event)">
                                            <span slot="prepend">现有男孩</span>
                                            <span slot="append">人</span>
                                        </Input>
                                    </Col>
                                    <Col span="7" style="display: flex;">
                                        <div>出生日期：</div>
                                        <Input v-model="personInfo.boysBirth" maxlength="50" type="text"/>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.girls" type="number" @input="existChildChange('girls',$event)">
                                            <span slot="prepend">现有女孩</span>
                                            <span slot="append">人</span>
                                        </Input>
                                    </Col>
                                    <Col span="7" style="display: flex;">
                                        <div>出生日期：</div>
                                        <Input v-model="personInfo.girlsBirth" maxlength="50" type="text"/>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                        <Row v-if="personInfo.sex == '女'">
                            <FormItem label="生育史">
                                <Row :gutter="15" style="margin-bottom: 24px;">
                                    <Col span="4">
                                        <Input v-model="personInfo.existingChildren" type="number" @input="existChildChange('child',$event)">
                                            <span slot="prepend">现有子女</span>
                                            <span slot="append">人</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.abortion" type="number" @input="existChildChange('abortion',$event)">
                                            <span slot="prepend">流产</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.premature" type="number" @input="existChildChange('premature',$event)">
                                            <span slot="prepend">早产</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.death" type="number" @input="existChildChange('death',$event)">
                                            <span slot="prepend">死亡</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.abnormalFetus" type="number" @input="existChildChange('abnormalFetus',$event)">
                                            <span slot="prepend">异常胎</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                </Row>
                                <Row :gutter="15" style="margin-bottom: 24px;" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                                    <Col span="4">
                                        <Input v-model="personInfo.pregnancyCount" type="number" @input="existChildChange('pregnancyCount',$event)">
                                            <span slot="prepend">孕次</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.liveBirth" type="number" @input="existChildChange('liveBirth',$event)">
                                            <span slot="prepend">活产</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.abortionSmall" type="number" @input="existChildChange('abortionSmall',$event)">
                                            <span slot="prepend">自然流产</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.multiparous" type="number" @input="existChildChange('multiparous',$event)">
                                            <span slot="prepend">多胎</span>
                                            <span slot="append">次</span>
                                        </Input>
                                    </Col>
                                    <Col span="7" style="display: flex;">
                                        <div>不孕不育原因：</div>
                                        <Input v-model="personInfo.infertilityReason" maxlength="50" type="text"/>
                                    </Col>
                                </Row>
                                <Row :gutter="15" style="margin-bottom: 24px;" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                                    <Col span="4">
                                        <Input v-model="personInfo.boys" type="number" @input="existChildChange('boys',$event)">
                                            <span slot="prepend">现有男孩</span>
                                            <span slot="append">人</span>
                                        </Input>
                                    </Col>
                                    <Col span="7" style="display: flex;">
                                        <div>出生日期：</div>
                                        <Input v-model="personInfo.boysBirth" maxlength="50" type="text"/>
                                    </Col>
                                    <Col span="4">
                                        <Input v-model="personInfo.girls" type="number" @input="existChildChange('girls',$event)">
                                            <span slot="prepend">现有女孩</span>
                                            <span slot="append">人</span>
                                        </Input>
                                    </Col>
                                    <Col span="7" style="display: flex;">
                                        <div>出生日期：</div>
                                        <Input v-model="personInfo.girlsBirth" maxlength="50" type="text"/>
                                    </Col>
                                </Row>
                                <Row :gutter="15" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                                    <Col span="10" style="display: flex;">
                                        <div>子女健康状况：</div>
                                        <Input v-model="personInfo.childrensHealth" maxlength="50" type="text"/>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="过敏史">
                                <Row>
                                    <Col style="width: 85px;">
                                        <RadioGroup v-model="personInfo.allergies">
                                            <Radio label="无"></Radio>
                                            <Radio label="有"></Radio>
                                        </RadioGroup>
                                    </Col>
                                    <Col>
                                        <Input v-model="personInfo.allergiesInfo" type="text" v-if="personInfo.allergies == '有'" v-width="433"/>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="烟酒史">
                                <Row :gutter="15" style="margin-bottom: 24px;">
                                    <Col style="width: 225px;">
                                        <RadioGroup v-model="personInfo.smokeState">
                                            <Radio label="不吸烟"></Radio>
                                            <Radio label="偶尔吸"></Radio>
                                            <Radio label="经常吸"></Radio>
                                        </RadioGroup>
                                    </Col>
                                    <Col span="5">
                                        <Input v-model="personInfo.packageEveryDay" type="number" @input="existChildChange('packageEveryDay',$event)">
                                            <span slot="append">支每天</span>
                                        </Input>
                                    </Col>
                                    <Col span="5">
                                        <Input v-model="personInfo.smokeYear" type="number" @input="existChildChange('smokeYear',$event)">
                                            <span slot="prepend">共</span>
                                            <span slot="append">年</span>
                                        </Input>
                                    </Col>
                                    <Col span="5" v-if="this.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                                        <Input v-model="personInfo.quitSomking" type="number" @input="existChildChange('quitSomking',$event)">
                                            <span slot="prepend">戒烟</span>
                                            <span slot="append">年</span>
                                        </Input>
                                    </Col>
                                </Row>
                                <Row :gutter="15">
                                    <Col style="width: 225px;">
                                        <RadioGroup v-model="personInfo.drinkState">
                                            <Radio label="不饮酒"></Radio>
                                            <Radio label="偶饮酒"></Radio>
                                            <Radio label="经常饮"></Radio>
                                        </RadioGroup>
                                    </Col>
                                    <Col span="5">
                                        <Input v-model="personInfo.mlEveryDay" type="number" @input="existChildChange('mlEveryDay',$event)">
                                            <span slot="append">ml/天</span>
                                        </Input>
                                    </Col>
                                    <Col span="5">
                                        <Input v-model="personInfo.drinkYear" type="number" @input="existChildChange('drinkYear',$event)">
                                            <span slot="prepend">共</span>
                                            <span slot="append">年</span>
                                        </Input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="出生地">
                                <v-region @values="regionChange" type="group" :town="true" style="width: 520px;" transfer
                                          v-model="birthplaceCode"></v-region>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="家族史">
                                <Col span="24" style="position: relative">
                                    <Button style="position: absolute; right: -4px;bottom: 1px; z-index: 8;"
                                            type="primary"
                                            @click="handleWordChoose()">选
                                    </Button>
                                    <Input type="textarea" v-model="personInfo.familyHistory" placeholder="家庭中有无遗传性疾病、血液病、糖尿病、高血压病、神经精神性疾病、肿瘤以及结核、肝炎等传染性疾病"
                                           :rows="3"
                                           v-width="520"/>
                                </Col>
                            </FormItem>
                        </Row>
                        <Row style="margin-top: 15px;" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                            <Button type="info" icon="md-add-circle" style="margin-bottom: 15px;" @click.native="handleAddClick(1)" v-if="status == 0">新增</Button>
                            <span style="font-weight: bold;color:red;height: 30px;line-height: 30px;">放射工种职业历史记录</span>
                            <Table border :columns="careerHistoryColumns1" sortable="custom" :data="careerHistoryData1" ref="table" :max-height="250">
                                <template slot-scope="{ row, index }" slot="action">
                                    <Button type="error" @click="handleDelete(row, index, 1)" size="small">
                                        <Icon type="md-trash"></Icon>
                                        删除
                                    </Button>
                                </template>
                            </Table>
                        </Row>
                        <Row style="margin-top: 15px;" v-if="personInfo.physicalType == '职业体检' && !(personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                            <Button type="info" icon="md-add-circle" style="margin-bottom: 15px;" @click.native="handleAddClick(2)" v-if="status == 0">新增</Button>
                            <span style="font-weight: bold;color:red;height: 30px;line-height: 30px;">非放射工种职业历史记录</span>
                            <Table border :columns="careerHistoryColumns2" sortable="custom" :data="careerHistoryData2" ref="table" :max-height="250">
                                <template slot-scope="{ row, index }" slot="action">
                                    <Button type="error" @click="handleDelete(row, index, 2)" size="small">
                                        <Icon type="md-trash"></Icon>
                                        删除
                                    </Button>
                                </template>
                            </Table>
                        </Row>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="4" label="既往患病史">
                    <Row style="margin-top: 15px;" v-if="tabsValue == '4'">
                        <Button type="info" icon="md-add-circle" style="margin-bottom: 15px;" @click.native="tableAddItem" v-if="status == 0">新增</Button>
                        <Table border :columns="pastMedicalHistoryColumns" sortable="custom" :data="personInfo.pastMedicalHistoryData" ref="table"
                               :max-height="500">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="error" @click="tableDeleteItem(row, index)" size="small">
                                    <Icon type="md-trash"></Icon>
                                    删除
                                </Button>
                            </template>
                        </Table>
                        <FormItem label="其他" :label-width="40" style="margin-top: 15px;width: 100%;">
                            <Input type="textarea" v-model="personInfo.pastMedicalHistoryOtherInfo" :rows="3"/>
                        </FormItem>
                    </Row>
                </el-tab-pane>
                <el-tab-pane name="5" label="症状询问" v-if="personInfo.physicalType == '职业体检' && !(personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                    <div v-if="tabsValue == '5'">
                        <Row style="margin-top: 15px;width: 100%;">
                            <Col span="12">
                                <Table border
                                       :columns="symptomColumns"
                                       :data="symptomData1"
                                       ref="table"
                                       :max-height="tableMaxHeight"
                                       :row-class-name="rowClassName"
                                       width="100%"
                                       :span-method="handleSpan1">
                                </Table>
                            </Col>
                            <Col span="12">
                                <Table border
                                       :columns="symptomColumns2"
                                       :data="symptomData2"
                                       ref="table1"
                                       :row-class-name="rowClassName"
                                       :max-height="tableMaxHeight"
                                       width="100%"
                                       :span-method="handleSpan2">
                                </Table>
                            </Col>
                        </Row>

                        <div style="margin-top: 10px;">
                            <div style="color:red;">备注</div>
                            <div style="color:red;text-indent: 25px;">1：无症状以“——”表示；有症状以“+”表示；症状程度：偶有以“±”，较轻以“+”，中等以“++”，明显以“+++”表示</div>
                            <div style="color:red;text-indent: 25px;" v-if="askProjectData && askProjectData.length>0">
                                2：危害因素对应的主要询问项目为：<span style="font-size:16px;font-weight: 600;">{{ askProjectData.join(",") }}</span>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="6" label="自觉症状" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))">
                    <div v-if="tabsValue == '6'">
                        <Row style="margin-top: 15px;width: 100%;">
                            <Col span="24">
                                <Button type="info" icon="md-add-circle" style="margin-bottom: 15px;" @click.native="symptomDataAdd()" v-if="status == 0">新增</Button>
                                <Table border
                                       :columns="symptomFsColumns"
                                       :data="symptomData"
                                       ref="table"
                                       :max-height="tableMaxHeight"
                                       width="100%">
                                    <template slot-scope="{ row, index }" slot="action">
                                        <Button type="error" @click="symptomDataDelete(row, index)" size="small">
                                            <Icon type="md-trash"></Icon>
                                            删除
                                        </Button>
                                    </template>
                                </Table>
                            </Col>
                        </Row>
                        <div style="margin-top: 10px;">
                            <div style="color:red;">备注</div>
                            <div style="color:red;text-indent: 25px;">症状程度：偶有以“±”，较轻以“+”，中等以“++”，明显以“+++”表示</div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <el-tabs type="border-card" v-if="personInfo.physicalType == '从业体检'">
                <el-tab-pane label="既往病史">
                    <Table :columns="pastMedicalColumns" :data="personInfo.pastMedicalHistoryData" ref="table" :max-height="tableMaxHeight"
                           width="100%"
                           border>
                    </Table>
                </el-tab-pane>
            </el-tabs>
            <Row style="margin-top: 30px;">
                <Col span="10">
                    <Row>
                        <Col span="12">
                            <FormItem label="检查医生" :label-width="90">
                                <img :src="personInfo.wzCheckAutograph && personInfo.isWzCheck == 1 ? personInfo.wzCheckAutograph.indexOf('/dcm') > -1 ? personInfo.wzCheckAutograph : 'data:image/png;base64,' + personInfo.wzCheckAutograph :
                                doctorInfo.autograph" width="150" height="30">
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="检查日期" :label-width="90">
                                {{ personInfo.wzCheckTime || checkDate }}
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
                <Col span="5" v-if="personInfo.physicalType == '从业体检'">
                    <FormItem  label="民族">
                        <Select v-model="personInfo.nation" placeholder="请选择" transfer>
                            <Option v-for="(item,i) in nationArr" :value="item.value">{{item.title}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8" style="text-align: center;">
                    <div>
                        <Button type="primary" :loading="loading" @click="handelSubmit" v-if="status == 0">保存信息</Button>
                        <Button type="info" @click="handleViewTemplate" v-if="status == 0 || status == 1">报告预览</Button>
                    </div>
                </Col>
            </Row>
            <!--模板预览-->
            <preview-template v-model="previewShow" physical-type="职业体检" v-if="personInfo.physicalType == '职业体检' && !(personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))" :personInfo="personInfo"
                              TTemplateId="1385e587148decd3be7730602748e959"></preview-template>
            <preview-template v-model="previewShow" physical-type="放射体检" v-if="personInfo.physicalType == '放射体检' || (personInfo.hazardFactors && (personInfo.hazardFactors.indexOf('160002')>-1 || personInfo.hazardFactors.indexOf('160501')>-1 || personInfo.hazardFactors.indexOf('160502')>-1  || personInfo.hazardFactors.indexOf('160503')>-1  || personInfo.hazardFactors.indexOf('160504')>-1 || personInfo.hazardFactors.indexOf('160506')>-1 || personInfo.hazardFactors.indexOf('160507')>-1 || personInfo.hazardFactors.indexOf('160999')>-1))" :personInfo="personInfo"
                              TTemplateId="ab9cc40360eccb783ea5c5e0e5b98777"></preview-template>
            <preview-template v-model="previewShow" physical-type="从业体检" v-if="personInfo.physicalType == '从业体检'" :personInfo="personInfo"
                              TTemplateId="5ec68102779a2ccdb0eea03b24ef0b19"></preview-template>
        </Form>
        <chooseWorkType v-model="workShow" @workCodeReback="workCodeReback"></chooseWorkType>
        <harmDrawer v-model="hazardFactorsShow" @harmReback="hazardFactorsReback" :selectedHarmList="hazardFactorsSelect"
                    selectType="checkbox"></harmDrawer>
        <fsDrawer v-model="fsDrawerShow" @fsReback="fsDrawerShowReback" :selectedList="fsSelectList"></fsDrawer>
        <!--术语选择-->
        <drawer v-model="wordChooseShow" modalTitle="家族史" @getSelectedWords="getSelectedWords"
                type="jzs" :isSearchPositive="false" :inspectType="personInfo.physical_type || personInfo.physicalType" officeId="1454369800754171904"
                :hazardFactors="personInfo.hazard_factors || personInfo.hazardFactors"
                :hazardFactorsText="personInfo.hazard_factors_text || personInfo.hazardFactorsText"></drawer>
    </div>
</template>
<script>
import ChooseSymptom from "./chooseWorkType";
import {updateTGroupPersonByInquiry, updatePracticePersonByInquiry} from "../../../api/healthy/tGroupPerson";
import {getDictDataByType} from "../../../api";
import previewTemplate from "../tCheckStation/previewTemplate";
import * as groupPersonApi from '@/api/healthy/tGroupPerson'
import {formatDate} from "@/api/tool.js"
import {userInfo} from "../../../api";
import chooseWorkType from "./chooseWorkType";
import {getAskProjectByFactor} from '@/api/healthy/tAskProject';
import harmDrawer from "../tCombo/harmDrawer";
import fsDrawer from "./fsDrawer";
import drawer from "../tCheckStation/drawer";

export default {
    name: "otherInfo",
    components: {ChooseSymptom, previewTemplate, chooseWorkType, harmDrawer, fsDrawer, drawer},
    props: {
        personInfo: {
            type: Object
        },
        status: {
            type: Number,
            default: 0
        }
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        },
    },
    data() {
        return {
            nationArr:[],
            isInterrogationSplitting: false,
            departmentTypeData: [],
            option: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            tabsValue: "1",
            fsSelectList: [],
            fsDrawerShow: false,
            fsDrawerIndex: 0,
            workTypeIndex: 0,
            workShow: false,
            hazardFactorsIndex: 0,
            hazardFactorsShow: false,
            hazardFactorsSelect: [],
            workCodeSelect: [],
            checkDoctor: '',
            checkDate: formatDate(new Date(), 'yyyy-MM-dd'),
            personInfoRule: {
                exposureStartDate: [
                    {required: true, message: '接害日期不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                workYear: [
                    {required: true, message: '工龄年数不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                workMonth: [
                    {required: true, message: '工龄月数不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                exposureWorkYear: [
                    {required: true, message: '接害年数不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                exposureWorkMonth: [
                    {required: true, message: '接害月数不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                education: [
                    {required: true, message: '文化程度不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                isMarry: [
                    {required: true, message: '结婚状况不能为空！', trigger: 'change', pattern: /.+/},
                ],
                /*department: [
                    {required: true, message: '所属部门不能为空！', trigger: 'change', pattern: /.+/},
                ],*/
                workTypeText: [
                    {required: true, message: '工种不能为空！', trigger: 'change', pattern: /.+/},
                ],
                workTypeText: [
                    {type: 'string', max: 50, message: '数据的最大长度为100！', trigger: 'blur'}
                ],
            },
            pastMedicalColumns: [
                {
                    title: '病名',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'diseaseName',
                },
                {
                    title: '有/无',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'yesOrNoSick',
                    render: (h, params) => {
                        return h('div', [
                            h('i-switch', {
                                props: {
                                    type: 'primary',
                                    value: params.row.yesOrNoSick === '有'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                scopedSlots: {
                                    open: () => h('span', '有'),
                                    close: () => h('span', '无')
                                },
                                on: {
                                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                        if (value == true) {
                                            this.personInfo.pastMedicalHistoryData[params.index].yesOrNoSick = '有';
                                        } else {
                                            this.personInfo.pastMedicalHistoryData[params.index].yesOrNoSick = '无';
                                        }
                                    }
                                }
                            },)
                        ]);
                    }
                },
                {
                    title: '患病时间',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'diseaseDate',
                    render: (h, params) => {
                        if (params.row.yesOrNoSick == '无') {
                            return h('span', "-");
                            params.row.diseaseDate = "-";
                            this.personInfo.pastMedicalHistoryData[params.index] = params.row;
                        } else {
                            return h('DatePicker', {
                                props: {
                                    value: params.row.diseaseDate,
                                    type: 'date',
                                    format: "yyyy-MM-dd",
                                    editable: false,
                                    transfer: true,
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    'on-change': (e) => {
                                        if (e) {
                                            params.row.diseaseDate = e;
                                            this.personInfo.pastMedicalHistoryData[params.index] = params.row;
                                        } else {
                                            params.row.diseaseDate = '';   // 必须有各种判断，否则清空时无法解除之前的禁用
                                            this.personInfo.pastMedicalHistoryData[params.index] = params.row;
                                        }
                                        ;
                                    }
                                }
                            });
                        }
                    }
                }
            ],
            loading: false,
            open: false,
            chooseSymptomShow: false,
            pastMedicalHistoryColumns: [
                {
                    type: 'index',
                    key: "index",
                    width: 60,
                    align: 'center'
                },
                {
                    title: '患病名称',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'diseaseName',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.diseaseName,
                                },
                                on: {
                                    input: (val) => {
                                        this.personInfo.pastMedicalHistoryData[params.index].diseaseName = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '诊断日期',
                    align: 'center',
                    minWidth: 100,
                    ellipsis: true,
                    tooltip: true,
                    key: 'diseaseDate',
                    sortable: false,
                    render: (h, params) => {
                        return h("DatePicker", {
                            props: {
                                placeholder: '请选择',
                                value: params.row.diseaseDate,
                                transfer: true
                            },
                            on: {
                                'on-change': (val) => {
                                    this.personInfo.pastMedicalHistoryData[params.index].diseaseDate = val;
                                }
                            }
                        })
                    }
                },
                {
                    title: '诊断单位',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'diagnosticUnit',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.diagnosticUnit,
                                },
                                on: {
                                    input: (val) => {
                                        this.personInfo.pastMedicalHistoryData[params.index].diagnosticUnit = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '治疗经过',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'afterTreatment',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.afterTreatment,
                                },
                                on: {
                                    input: (val) => {
                                        this.personInfo.pastMedicalHistoryData[params.index].afterTreatment = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '转归',
                    align: 'center',
                    minWidth: 100,
                    ellipsis: true,
                    tooltip: true,
                    key: 'fate',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.fate,
                                },
                                on: {
                                    input: (val) => {
                                        this.personInfo.pastMedicalHistoryData[params.index].fate = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 100,
                }
            ],
            careerHistoryColumns2: [
                {
                    type: 'index',
                    key: "index",
                    width: 60,
                    align: 'center'
                },
                {
                    title: '起止日期',
                    align: 'center',
                    width: 220,
                    ellipsis: true,
                    tooltip: true,
                    sortable: false,
                    render: (h, params) => {
                        params.row.startDate = formatDate(params.row.startDate, "yyyy-MM-dd")
                        return h("DatePicker", {
                            props: {
                                type: "daterange",
                                placeholder: '请选择',
                                value: [params.row.startDate, params.row.endDate],
                                transfer: true
                            },
                            on: {
                                'on-change': (val) => {
                                    this.careerHistoryData2[params.index].startDate = val[0];
                                    this.careerHistoryData2[params.index].endDate = val[1];
                                }
                            }
                        })
                    }
                },
                {
                    title: '工作单位',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workUnit',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.workUnit,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData2[params.index].workUnit = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '车间（部门）',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'department',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.department,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData2[params.index].department = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '工种',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workTypeCode',
                    sortable: false,
                    render: (h, params) => {
                        return h("Input", {
                            /*props: {
                                readonly: false,
                                placeholder: '请选择工种',
                                value: params.row.workTypeText,
                            },
                            nativeOn: {
                                click: (e) => {
                                    this.workShow = true;
                                    this.workTypeIndex = params.index;
                                }
                            },*/
                            props: {
                                placeholder: '请输入工种名',
                                value: params.row.workTypeText,
                            },
                            on: {
                                input: (val) => {
                                    this.careerHistoryData2[params.index].workTypeText = val;
                                }
                            }
                        });
                    }
                },
                {
                    title: '危害因素',
                    align: 'center',
                    minWidth: 150,
                    key: 'hazardFactorsCode',
                    sortable: false,
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                readonly: true,
                                placeholder: '请选择危害因素',
                                value: params.row.hazardFactorsText,
                            },
                            nativeOn: {
                                click: (e) => {
                                    this.hazardFactorsIndex = params.index;
                                    this.hazardFactorsSelect = [];
                                    if (params.row.hazardFactorsCode) {
                                        let codes = params.row.hazardFactorsCode.split("|");
                                        let texts = params.row.hazardFactorsText.split("|");
                                        for (let i = 0; i < codes.length; i++) {
                                            this.hazardFactorsSelect.push({
                                                typeCode: codes[i],
                                                typeName: texts[i]
                                            })
                                        }
                                    }
                                    this.hazardFactorsShow = true;
                                }
                            },
                        });
                    }
                },
                {
                    title: '防护措施',
                    align: 'center',
                    minWidth: 100,
                    ellipsis: true,
                    tooltip: true,
                    key: 'protectiveMeasures',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.protectiveMeasures,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData2[params.index].protectiveMeasures = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '接触时间',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'contactTime',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.contactTime,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData2[params.index].contactTime = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 100,
                }
            ],
            careerHistoryColumns1: [
                {
                    type: 'index',
                    key: "index",
                    width: 60,
                    align: 'center'
                },
                {
                    title: '起止年月',
                    align: 'center',
                    width: 220,
                    ellipsis: true,
                    tooltip: true,
                    sortable: false,
                    render: (h, params) => {
                        return h("DatePicker", {
                            props: {
                                type: "daterange",
                                placeholder: '请选择',
                                value: [params.row.startDate, params.row.endDate],
                                transfer: true
                            },
                            on: {
                                'on-change': (val) => {
                                    this.careerHistoryData1[params.index].startDate = val[0];
                                    this.careerHistoryData1[params.index].endDate = val[1];
                                }
                            }
                        })
                    }
                },
                {
                    title: '工作单位',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workUnit',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.workUnit,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].workUnit = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '部门',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'department',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.department,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].department = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '工种',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workTypeCode',
                    sortable: false,
                    render: (h, params) => {
                        return h("Input", {
                            /*props: {
                                readonly: true,
                                placeholder: '请选择工种',
                                value: params.row.workTypeText,
                            },
                            nativeOn: {
                                click: (e) => {
                                    this.workShow = true;
                                    this.workTypeIndex = params.index;
                                }
                            },*/
                            props: {
                                placeholder: '请输入工种名',
                                value: params.row.workTypeText,
                            },
                            on: {
                                input: (val) => {
                                    this.careerHistoryData1[params.index].workTypeText = val;
                                }
                            }
                        });
                    }
                },
                {
                    title: '放射线种类',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'radiationType',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.radiationType,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].radiationType = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '职业照射种类',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'irradiationType',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    readonly: true,
                                    placeholder: '请选择',
                                    value: params.row.irradiationType,
                                },
                                nativeOn: {
                                    click: (e) => {
                                        this.fsDrawerIndex = params.index;
                                        this.fsSelectList = [];
                                        if (params.row.irradiationTypeCode) {
                                            let codes = params.row.irradiationTypeCode.split(",");
                                            let texts = params.row.irradiationType.split(",");
                                            for (let i = 0; i < codes.length; i++) {
                                                this.fsSelectList.push({
                                                    code: codes[i],
                                                    name: texts[i]
                                                })
                                            }
                                        }
                                        this.fsDrawerShow = true;
                                    }
                                },
                            })
                        ]);
                    }
                },
                // {
                //     title: '职业照射种类代码',
                //     align: 'center',
                //     minWidth: 150,
                //     ellipsis: true,
                //     tooltip: true,
                //     key: 'irradiationTypeCode',
                //     sortable: false,
                //     render: (h, params) => {
                //         return h('div', [
                //             h('Input', {
                //                 props: {
                //                     placeholder: '请输入',
                //                     value: params.row.irradiationTypeCode,
                //                 },
                //                 on: {
                //                     input: (val) => {
                //                         this.personInfo.careerHistoryData1[params.index].irradiationTypeCode = val;
                //                     }
                //                 }
                //             })
                //         ]);
                //     }
                // },
                {
                    title: '日工作时数或工作量',
                    align: 'center',
                    minWidth: 165,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workload',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.workload,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].workload = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '累积受照剂量',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'exposureDose',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.exposureDose,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].exposureDose = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '过量照射史',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'overexposure',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.overexposure,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].overexposure = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '备注',
                    align: 'center',
                    minWidth: 180,
                    ellipsis: true,
                    tooltip: true,
                    key: 'remark',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.remark,
                                },
                                on: {
                                    input: (val) => {
                                        this.careerHistoryData1[params.index].remark = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 100,
                }
            ],
            careerHistoryData1: [], //放射
            careerHistoryData2: [], //非放射
            symptomData1: [
                {
                    type: "神经系统",
                    projectName: "头昏",
                    code: "10002",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "头痛",
                    code: "10003",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "眩晕",
                    code: "10004",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "失眠",
                    code: "10005",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "嗜睡",
                    code: "10006",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "多梦",
                    code: "10007",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "记忆力减退",
                    code: "10008",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "易激动",
                    code: "10009",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "疲乏无力",
                    code: "10010",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "四肢麻木",
                    code: "10011",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "动作不灵活",
                    code: "10012",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "神经系统",
                    projectName: "肌肉抽搐",
                    code: "10013",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "皮下出血",
                    code: "10036",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "月经异常",
                    code: "10037",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "低热",
                    code: "10038",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "盗汗",
                    code: "10039",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "多汗",
                    code: "10040",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "口渴",
                    code: "10041",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "消瘦",
                    code: "10042",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "脱发",
                    code: "10043",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "皮疹",
                    code: "10044",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "造血系统、内分泌系统",
                    projectName: "皮肤瘙痒",
                    code: "10045",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "胸痛",
                    code: "10015",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "胸闷",
                    code: "10016",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "咳嗽",
                    code: "10017",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "咳痰",
                    code: "10018",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "咯血",
                    code: "10019",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "气促",
                    code: "10020",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "呼吸系统",
                    projectName: "气短",
                    code: "10021",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "泌尿生殖系统",
                    projectName: "哮喘",
                    code: "10047",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "泌尿生殖系统",
                    projectName: "尿频、尿急",
                    code: "10048",
                    degree: "——",
                    courseTime: ""
                },

                {
                    type: "泌尿生殖系统",
                    projectName: "尿痛",
                    code: "10049",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "泌尿生殖系统",
                    projectName: "血尿",
                    code: "10050",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "泌尿生殖系统",
                    projectName: "浮肿",
                    code: "10051",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "泌尿生殖系统",
                    projectName: "性欲减退",
                    code: "10052",
                    degree: "——",
                    courseTime: ""
                },

                {
                    type: "肌肉及四肢关机",
                    projectName: "全身酸痛",
                    code: "10054",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "肌肉及四肢关机",
                    projectName: "肌肉疼痛",
                    code: "10055",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "肌肉及四肢关机",
                    projectName: "肌无力及关节疼痛",
                    code: "10056",
                    degree: "——",
                    courseTime: ""
                },
            ],
            symptomData2: [
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "视物模糊",
                    code: "10058",
                    degree: "——",
                    courseTime: ""
                }, {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "视力下降",
                    code: "10059",
                    degree: "——",
                    courseTime: ""
                }, {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "眼痛",
                    code: "10060",
                    degree: "——",
                    courseTime: ""
                }, {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "羞明",
                    code: "10061",
                    degree: "——",
                    courseTime: ""
                }, {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "流泪",
                    code: "10062",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "嗅觉减退",
                    code: "10063",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "鼻干",
                    code: "10064",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "鼻塞",
                    code: "10065",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "流鼻血",
                    code: "10066",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "流涕",
                    code: "10067",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "耳鸣",
                    code: "10068",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "耳聋",
                    code: "10069",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "流涎",
                    code: "10070",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "牙痛",
                    code: "10071",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "牙齿松动",
                    code: "10072",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "刷牙出血",
                    code: "10073",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "口腔异味",
                    code: "10074",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "口腔溃疡",
                    code: "10075",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "咽部疼痛",
                    code: "10076",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "眼、耳、鼻、咽喉及口腔",
                    projectName: "声嘶",
                    code: "10077",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "心血管系统",
                    projectName: "心悸",
                    code: "10023",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "心血管系统",
                    projectName: "心前区不适",
                    code: "10024",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "心血管系统",
                    projectName: "心前区疼痛",
                    code: "10025",
                    degree: "——",
                    courseTime: ""
                },

                {
                    type: "消化系统",
                    projectName: "食欲不振",
                    code: "10027",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "恶心",
                    code: "10028",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "呕吐",
                    code: "10029",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "腹胀、腹痛",
                    code: "10030",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "腹泻",
                    code: "10031",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "肝区疼痛",
                    code: "10032",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "便秘",
                    code: "10033",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "消化系统",
                    projectName: "便血",
                    code: "10034",
                    degree: "——",
                    courseTime: ""
                },
                {
                    type: "其他",
                    projectName: "",
                    code: "10086",
                    degree: "——",
                    courseTime: ""
                }
            ],
            symptomColumns: [
                {
                    title: '#',
                    align: 'center',
                    minWidth: 60,
                    key: 'type',
                },
                {
                    title: '项目',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'projectName',
                    render: (h, params) => {
                        if (params.row.type == '其他') {
                            return h('Input', {
                                props: {
                                    type: "textarea",
                                    rows: 3,
                                    placeholder: '请输入',
                                    value: params.row.projectName
                                },
                                on: {
                                    input: (val) => {
                                        this.symptomData1[params.index].projectName = val;
                                    }
                                }
                            });
                        } else {
                            return h("div", params.row.projectName);
                        }
                    }
                },
                {
                    title: '程度',
                    align: 'center',
                    minWidth: 100,
                    key: 'degree',
                    render: (h, params) => {
                        if (params.row.type == '其他') {
                            return h('Input', {
                                props: {
                                    type: "textarea",
                                    rows: 3,
                                    placeholder: '请输入',
                                    value: params.row.degree
                                },
                                on: {
                                    input: (val) => {
                                        this.symptomData1[params.index].degree = val;
                                    }
                                }
                            });
                        } else {
                            return h('Select', {
                                props: {
                                    value: params.row.degree,
                                    size: "small",
                                    transfer: true
                                },
                                on: {
                                    'on-change': e => {
                                        this.symptomData1[params.index].degree = e;
                                    }
                                }
                            }, this.symptomArr.map(item => {
                                return h('Option', {
                                    props: {
                                        value: item,
                                        label: item
                                    }
                                })
                            }))
                        }
                    }
                },
                {
                    title: '病程时间',
                    align: 'center',
                    minWidth: 120,
                    key: 'courseTime',
                    render: (h, params) => {
                        return h('Select', {
                            props: {
                                value: params.row.courseTime,
                                size: "small",
                                transfer: true
                            },
                            on: {
                                'on-change': e => {
                                    this.symptomData1[params.index].courseTime = e;
                                }
                            }
                        }, this.courseTimeArr.map(item => {
                            return h('Option', {
                                props: {
                                    value: item,
                                    label: item
                                }
                            })
                        }))
                    }
                },
            ],
            symptomColumns2: [
                {
                    title: '#',
                    align: 'center',
                    minWidth: 60,
                    key: 'type',
                },
                {
                    title: '项目',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'projectName',
                    render: (h, params) => {
                        if (params.row.type == '其他') {
                            return h('Input', {
                                props: {
                                    type: "textarea",
                                    rows: 3,
                                    placeholder: '请输入',
                                    value: params.row.projectName
                                },
                                on: {
                                    input: (val) => {
                                        this.symptomData2[params.index].projectName = val;
                                    }
                                }
                            });
                        } else {
                            return h("div", params.row.projectName);
                        }
                    }
                },
                {
                    title: '程度',
                    align: 'center',
                    minWidth: 100,
                    key: 'degree',
                    render: (h, params) => {
                        if (params.row.type == '其他') {
                            return h('Input', {
                                props: {
                                    type: "textarea",
                                    rows: 3,
                                    placeholder: '请输入',
                                    value: params.row.degree
                                },
                                on: {
                                    input: (val) => {
                                        this.symptomData2[params.index].degree = val;
                                    }
                                }
                            });
                        } else {
                            return h('Select', {
                                props: {
                                    value: params.row.degree,
                                    size: "small",
                                    transfer: true
                                },
                                on: {
                                    'on-change': e => {
                                        this.symptomData2[params.index].degree = e;
                                    }
                                }
                            }, this.symptomArr.map(item => {
                                return h('Option', {
                                    props: {
                                        value: item,
                                        label: item
                                    }
                                })
                            }))
                        }
                    }
                },
                {
                    title: '病程时间',
                    align: 'center',
                    minWidth: 120,
                    key: 'courseTime',
                    render: (h, params) => {
                        if (params.row.type == '其他') {
                            return h('Input', {
                                props: {
                                    type: "textarea",
                                    rows: 3,
                                    placeholder: '请输入',
                                    value: params.row.courseTime
                                },
                                on: {
                                    input: (val) => {
                                        this.symptomData2[params.index].courseTime = val;
                                    }
                                }
                            });
                        } else {
                            return h('Select', {
                                props: {
                                    value: params.row.courseTime,
                                    size: "small",
                                    transfer: true
                                },
                                on: {
                                    'on-change': e => {
                                        this.symptomData2[params.index].courseTime = e;
                                    }
                                }
                            }, this.courseTimeArr.map(item => {
                                return h('Option', {
                                    props: {
                                        value: item,
                                        label: item
                                    }
                                })
                            }))
                        }
                    }
                },
            ],
            tableMaxHeight: 500,
            personInfoPriority: [],
            symptomArr: ["——", "+", "++", "+++", "±",],
            courseTimeArr: ["0", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "1年", "2年", "3年", "4年", "5年", "6年", "7年", "8年", "9年", "10年", "15年", "20年", "25年", "30年"],
            birthplaceCode: {
                province: "",
                city: "",
                area: "",
                town: "",
            },
            previewShow: false,
            doctorInfo: {},
            askProjectData: [],
            symptomData: [],
            symptomFsColumns: [
                {
                    title: '#',
                    align: 'center',
                    width: 60,
                    type: 'index',
                },
                {
                    title: '症状',
                    align: 'center',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true,
                    key: 'projectName',
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                type: "text",
                                placeholder: '请输入',
                                value: params.row.projectName
                            },
                            on: {
                                input: (val) => {
                                    this.symptomData[params.index].projectName = val;
                                }
                            }
                        });
                    }
                },
                {
                    title: '程度',
                    align: 'center',
                    minWidth: 150,
                    key: 'degree',
                    render: (h, params) => {
                        if (params.row.type == '其他') {
                            return h('Input', {
                                props: {
                                    type: "textarea",
                                    rows: 3,
                                    placeholder: '请输入',
                                    value: params.row.degree
                                },
                                on: {
                                    input: (val) => {
                                        this.symptomData[params.index].degree = val;
                                    }
                                }
                            });
                        } else {
                            return h('Select', {
                                props: {
                                    value: params.row.degree,
                                    size: "small",
                                    transfer: true
                                },
                                on: {
                                    'on-change': e => {
                                        this.symptomData[params.index].degree = e;
                                    }
                                }
                            }, this.symptomArr.map(item => {
                                return h('Option', {
                                    props: {
                                        value: item,
                                        label: item
                                    }
                                })
                            }))
                        }
                    }
                },
                {
                    title: '病程时间',
                    align: 'center',
                    minWidth: 150,
                    key: 'courseTime',
                    render: (h, params) => {
                        return h('Select', {
                            props: {
                                value: params.row.courseTime,
                                size: "small",
                                transfer: true
                            },
                            on: {
                                'on-change': e => {
                                    this.symptomData[params.index].courseTime = e;
                                }
                            }
                        }, this.courseTimeArr.map(item => {
                            return h('Option', {
                                props: {
                                    value: item,
                                    label: item
                                }
                            })
                        }))
                    }
                },
            ],
            wordChooseShow: false,
			isMenstrualHistory:false,//是否展示月经史详细
        }
    },
    methods: {
        handleWorkCode() {
            this.workShow = true;
        },
        existChildChange(type, e) {
            if (type == 'child') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.existingChildren = 0;
                    })
                } else {
                    this.personInfo.existingChildren = e;
                }
            } else if (type == 'boys') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.boys = 0;
                    })
                } else {
                    this.personInfo.boys = e;
                }
            } else if (type == 'girls') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.girls = 0;
                    })
                } else {
                    this.personInfo.girls = e;
                }
            } else if (type == 'pregnancyCount') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.pregnancyCount = 0;
                    })
                } else {
                    this.personInfo.pregnancyCount = e;
                }
            } else if (type == 'liveBirth') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.liveBirth = 0;
                    })
                } else {
                    this.personInfo.liveBirth = e;
                }
            } else if (type == 'abortionSmall') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.abortionSmall = 0;
                    })
                } else {
                    this.personInfo.abortionSmall = e;
                }
            } else if (type == 'multiparous') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.multiparous = 0;
                    })
                } else {
                    this.personInfo.multiparous = e;
                }
            } else if (type == 'abortion') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.abortion = 0;
                    })
                } else {
                    this.personInfo.abortion = e;
                }
            } else if (type == 'premature') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.premature = 0;
                    })
                } else {
                    this.personInfo.premature = e;
                }
            } else if (type == 'death') {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.death = 0
                    });
                } else {
                    this.personInfo.death = e;
                }
            } else if (type == "abnormalFetus") {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.abnormalFetus = 0;
                    });
                } else {
                    this.personInfo.abnormalFetus = e;
                }
            } else if (type == "packageEveryDay") {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.packageEveryDay = 0;
                    });
                } else {
                    this.personInfo.packageEveryDay = e;
                }
            } else if (type == "mlEveryDay") {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.mlEveryDay = 0;
                    });
                } else {
                    this.personInfo.mlEveryDay = e;
                }
            } else if (type == "smokeYear") {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.smokeYear = 0;
                    });
                } else {
                    this.personInfo.smokeYear = e;
                }
            } else if (type == "drinkYear") {
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.drinkYear = 0;
                    });
                } else {
                    this.personInfo.drinkYear = e;
                }
            }else if (type == 'quitSomking'){
                if (e <= 0) {
                    this.$nextTick(() => {
                        this.personInfo.quitSomking = 0;
                    });
                } else {
                    this.personInfo.quitSomking = e;
                }
            }
        },
        rowClassName(row, index) {
            if (this.askProjectData && this.askProjectData.length > 0) {
                let flag = this.askProjectData.find(i => i == row.type);
                if (flag != undefined) {
                    return "red";
                }
            }
        },
        //工龄年数改变
        workYearChange() {
            if(this.isInterrogationSplitting){
                if(this.personInfo.exposureStartDate) {
                    let year = formatDate(this.personInfo.exposureStartDate, "yyyy");
                    let chooseMonth = new Date(this.personInfo.exposureStartDate).getMonth() + 1;
                    let currentYear = formatDate(new Date(), "yyyy");
                    let yearNum = currentYear - year || 0;
                    let currMonth = new Date().getMonth() + 1;
                    let realMonth = currMonth - chooseMonth || 0;
                    if (Number(this.personInfo.workYear) * 12 + Number(this.personInfo.workMonth) < Number(yearNum) * 12 + Number(realMonth)) {
                        this.$Message.error("工龄年数必须大于接害年数");
                    }
                }
            }else{
                //因为数据必要所以默认0
                if(!this.personInfo.exposureWorkYear){
                    this.personInfo.exposureWorkYear = 0;
                }
                if(!this.personInfo.exposureWorkMonth){
                    this.personInfo.exposureWorkMonth = 0;
                }
                if (Number(this.personInfo.workYear) * 12 + Number(this.personInfo.workMonth) < Number(this.personInfo.exposureWorkYear) * 12 + Number(this.personInfo.exposureWorkMonth)) {
                    this.$Message.error("工龄年数必须大于接害年数");
                }
            }
            if(this.personInfo && this.personInfo.exposureStartDate){
                this.exposureStartDateChange(this.personInfo.exposureStartDate);
            }
        },
        //接害工龄改变
        workYearChangeExp() {
            if(this.isInterrogationSplitting){
                if(this.personInfo.exposureStartDate) {
                    if (Number(this.personInfo.workYear) * 12 + Number(this.personInfo.workMonth) < Number(this.personInfo.exposureWorkYear) * 12 + Number(this.personInfo.exposureWorkMonth)) {
                        this.$Message.error("工龄年数必须大于接害年数");
                    }
                }
            }
        },
        exposureDateCount() {
            //因为数据必要所以默认0
            if(!this.personInfo.workYear){
                this.personInfo.workYear = 0;
            }
            if(!this.personInfo.workMonth){
                this.personInfo.workMonth = 0;
            }
            if(!this.personInfo.exposureWorkYear){
                this.personInfo.exposureWorkYear = 0;
            }
            if(!this.personInfo.exposureWorkMonth){
                this.personInfo.exposureWorkMonth = 0;
            }
            if(this.isInterrogationSplitting){
                if(this.personInfo.exposureStartDate && this.personInfo.workStateCode != '1001'){//接害开始时间存在并且不为岗前时 计算判断工龄
                    //选择日期
                    let chooseYear = new Date(this.personInfo.exposureStartDate).getFullYear();
                    let chooseMonth = new Date(this.personInfo.exposureStartDate).getMonth() + 1;
                    //当前
                    let currYear = new Date().getFullYear();
                    let currMonth = new Date().getMonth() + 1;

                    //实际日期
                    let realYear = currYear - chooseYear||0 ;
                    let realMonth = currMonth - chooseMonth||0 ;
                    //月份大说明年份要减一
                    if(chooseMonth>currMonth){
                        realYear--;
                        realMonth = currMonth+12 - chooseMonth ;
                    }

                    if (Number(this.personInfo.workYear) * 12 + Number(this.personInfo.workMonth) < Number(this.personInfo.exposureWorkYear) * 12 + Number(this.personInfo.exposureWorkMonth)) {
                        return false;
                    } else {
                        this.personInfo.exposureWorkYear = realYear;
                        this.personInfo.exposureWorkMonth = realMonth;
                        return true;
                    }
                }else{
                    return true;
                }
            }else{
                if(this.personInfo.exposureStartDate && this.personInfo.workStateCode != '1001'){//接害开始时间存在并且不为岗前时 计算判断工龄
                    //选择日期
                    let chooseYear = new Date(this.personInfo.exposureStartDate).getFullYear();
                    let chooseMonth = new Date(this.personInfo.exposureStartDate).getMonth() + 1;
                    //当前
                    let currYear = new Date().getFullYear();
                    let currMonth = new Date().getMonth() + 1;

                    //实际日期
                    let realYear = currYear - chooseYear||0 ;
                    let realMonth = currMonth - chooseMonth||0 ;
                    //月份大说明年份要减一
                    if(chooseMonth>currMonth){
                        realYear--;
                        realMonth = currMonth+12 - chooseMonth ;
                    }

                    if (Number(this.personInfo.workYear) * 12 + Number(this.personInfo.workMonth) < Number(realYear) * 12 + Number(realMonth)) {
                        return false;
                    } else {
                        this.personInfo.exposureWorkYear = realYear;
                        this.personInfo.exposureWorkMonth = realMonth;
                        return true;
                    }
                }else{
                    return true;
                }
            }
        },
        //接害时间改变
        exposureStartDateChange(e) {
            let flag = this.exposureDateCount();
            if (!flag) {
                this.$Message.error("工龄年数必须大于接害年数");
            } else {
                if (this.personInfo.isWzCheck == 0) {
                    let workTypeText = "";
                    if(this.personInfo.workTypeText && this.personInfo.workTypeText.indexOf("其他")>-1 && this.personInfo.workName){
                        workTypeText = this.personInfo.workName;
                    }else{
                        workTypeText = this.personInfo.workTypeText;
                    }
                    this.careerHistoryData2 = [];
                    this.careerHistoryData2.push({
                        type: 2,
                        startDate: e,
                        endDate: formatDate(new Date(), "yyyy-MM-dd"),
                        workUnit: this.personInfo.unitName,
                        workTypeCode: this.personInfo.workTypeCode,
                        workTypeText: workTypeText,
                        hazardFactorsCode: this.personInfo.hazardFactors,
                        hazardFactorsText: this.personInfo.hazardFactorsText,
                        protectiveMeasures: "有",
                        contactTime: "48小时/周",
                        personId: this.personInfo.id,
                        department: this.personInfo.department//车间(部门)
                    });
					this.careerHistoryData1 = [];
					this.careerHistoryData1.push({
						type: 1,
						startDate: e,
						endDate: formatDate(new Date(), "yyyy-MM-dd"),
						workUnit: this.personInfo.unitName,
                        workTypeCode: this.personInfo.workTypeCode,
                        workTypeText: workTypeText,
						workload: "",
						exposureDose: "",
						overexposure: "",
						irradiationType: "",
						irradiationTypeCode: "",
						radiationType: "",
						personId: this.personInfo.id,
                        department: this.personInfo.department//车间(部门)
					});
                }
            }
        },
        //结婚日期改变
        marriageDateChange(e) {
            if(e){
                this.personInfo.marriageDate = formatDate(e, "yyyy-MM-dd");
                if(this.personInfo.marriageDate && this.personInfo.marriageDate.toString().trim().length>0){
                    this.personInfo.marriageDate = this.personInfo.marriageDate+" 00:00:00";
                }
            }
        },
        //模板查看
        handleViewTemplate() {
            this.previewShow = true;
        },
        handleSpan1({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0 && columnIndex === 0) {
                return {
                    rowspan: 12,
                    colspan: 1
                };
            } else if (rowIndex === 12 && columnIndex === 0) {
                return {
                    rowspan: 10,
                    colspan: 1
                };
            } else if (rowIndex === 22 && columnIndex === 0) {
                return {
                    rowspan: 7,
                    colspan: 1
                };
            } else if (rowIndex === 29 && columnIndex === 0) {
                return {
                    rowspan: 6,
                    colspan: 1
                };
            } else if (rowIndex === 35 && columnIndex === 0) {
                return {
                    rowspan: 3,
                    colspan: 1
                };
            } else if (columnIndex === 0) {
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
        },
        handleSpan2({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0 && columnIndex === 0) {
                return {
                    rowspan: 20,
                    colspan: 1
                };
            } else if (rowIndex === 20 && columnIndex === 0) {
                return {
                    rowspan: 3,
                    colspan: 1
                };
            } else if (rowIndex === 23 && columnIndex === 0) {
                return {
                    rowspan: 8,
                    colspan: 1
                };
            } else if (rowIndex === 31 && columnIndex === 0) {
                return {
                    rowspan: 1,
                    colspan: 1
                };
            } else if (columnIndex === 0) {
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
        },
        handelSubmit(callback) {
            //当前时间
            let nowDate = formatDate(new Date(), "yyyy-MM-dd");
            this.$refs['otherForm'].validate((valid) => {
                if (valid) {
                    if (this.personInfo.physicalType == '职业体检' || this.personInfo.physicalType == '放射体检') {
                        /*let flag = this.exposureDateCount();
                        if (!flag) {
                            this.$Message.error("工龄年数必须大于接害年数");
                            return;
                        }*/
                        if(this.personInfo.exposureStartDate && this.personInfo.workStateCode != '1001'){//接害开始时间存在并且不为岗前时 计算判断工龄
                            //因为数据必要所以默认0
                            if(!this.personInfo.workYear){
                                this.personInfo.workYear = 0;
                            }
                            if(!this.personInfo.workMonth){
                                this.personInfo.workMonth = 0;
                            }
                            if(!this.personInfo.exposureWorkYear){
                                this.personInfo.exposureWorkYear = 0;
                            }
                            if(!this.personInfo.exposureWorkMonth){
                                this.personInfo.exposureWorkMonth = 0;
                            }
                            if (Number(this.personInfo.workYear) * 12 + Number(this.personInfo.workMonth) < Number(this.personInfo.exposureWorkYear) * 12 + Number(this.personInfo.exposureWorkMonth)) {
                                this.$Message.error("工龄年数必须大于接害年数");
                                return;
                            }
                        }
                        //接害时间不能为当天
                        if(this.personInfo && this.personInfo.exposureStartDate && nowDate && nowDate==formatDate(this.personInfo.exposureStartDate, "yyyy-MM-dd")){
                            this.$Message.error("接害开始时间不能为当天");
                            return;
                        }
                        //接害开始时间不能为空
                        if(this.personInfo && this.personInfo.workStateText.trim() != "上岗前" && this.personInfo.exposureStartDate==null){
                            this.$Message.error("接害开始时间不能为空");
                            return;
                        }
                    }
                    this.loading = true;
                    this.$Modal.confirm({
                        title: '确认提交',
                        content: '请确认当前信息是否无误，提交后无法修改!',
                        loading: true,
                        onOk: () => {
                            if (this.personInfo.physicalType == '职业体检' && !(this.personInfo.hazardFactors && (this.personInfo.hazardFactors.indexOf("160002")>-1 || this.personInfo.hazardFactors.indexOf("160501")>-1 || this.personInfo.hazardFactors.indexOf("160502")>-1  || this.personInfo.hazardFactors.indexOf("160503")>-1  || this.personInfo.hazardFactors.indexOf("160504")>-1 || this.personInfo.hazardFactors.indexOf("160506")>-1 || this.personInfo.hazardFactors.indexOf("160507")>-1 || this.personInfo.hazardFactors.indexOf("160999")>-1))) {
                                this.personInfo.symptomData = this.symptomData1.filter(item => {
                                    return item.degree != '——';
                                })
                                this.personInfo.symptomData = this.personInfo.symptomData.concat(this.symptomData2.filter(item => {
                                    return item.degree != '——';
                                }));
                                this.personInfo.symptomData.forEach(item => {
                                    item.personId = this.personInfo.id;
                                })
                                this.personInfo.careerHistoryData = this.careerHistoryData2;
                            }

                            if (this.personInfo.physicalType == '放射体检' || (this.personInfo.hazardFactors && (this.personInfo.hazardFactors.indexOf("160002")>-1 || this.personInfo.hazardFactors.indexOf("160501")>-1 || this.personInfo.hazardFactors.indexOf("160502")>-1  || this.personInfo.hazardFactors.indexOf("160503")>-1  || this.personInfo.hazardFactors.indexOf("160504")>-1 || this.personInfo.hazardFactors.indexOf("160506")>-1 || this.personInfo.hazardFactors.indexOf("160507")>-1 || this.personInfo.hazardFactors.indexOf("160999")>-1))) {
                                this.personInfo.careerHistoryData = this.careerHistoryData1;
                                this.personInfo.symptomData = this.symptomData;
                                this.personInfo.symptomData.forEach(item => {
                                    item.personId = this.personInfo.id;
                                })
                            }
                            if (this.personInfo.physicalType == '从业体检') {
                                updatePracticePersonByInquiry(this.personInfo).then(res => {
                                    if (res.success) {
                                        this.$Message.success("保存成功！");
                                        this.$emit('handleSearch');
                                    }
                                }).finally(() => {
                                    this.$Modal.remove();
                                    this.loading = false;
                                    if (Object.prototype.toString.call(callback) == "[object Function]") {
                                        callback(false)
                                    }
                                })
                            } else {
                                updateTGroupPersonByInquiry(this.personInfo).then(res => {
                                    if (res.success) {
                                        this.$Message.success("保存成功！");
                                        this.$emit('handleSearch');
                                    }
                                }).finally(() => {
                                    this.$Modal.remove();
                                    this.loading = false;
                                    if (Object.prototype.toString.call(callback) == "[object Function]") {
                                        callback(false)
                                    }
                                })
                            }
                        },
                        onCancel: () => {
                            this.loading = false;
                            if (Object.prototype.toString.call(callback) == "[object Function]") {
                                callback(false)
                            }
                        }
                    });
                } else {
                    this.loading = false;
                    this.$Message.error('请完善基本信息！');
                    if (Object.prototype.toString.call(callback) == "[object Function]") {
                        callback(false)
                    }
                }
            });
        },
        handleDelete(row, index, type) {
            if (type == 1) {
                this.careerHistoryData1.splice(index, 1);
            } else {
                this.careerHistoryData2.splice(index, 1);
            }
        },
        handleAddClick(type) {
            if (!this.personInfo.id) {
                this.$Message.error("请选择人员！")
                return;
            }
            if (type == 1) {
                this.careerHistoryData1.push({
                    type: type,
                    startDate: "",
                    endDate: "",
                    workUnit: "",
                    workload: "",
                    exposureDose: "",
                    overexposure: "",
                    irradiationType: "",
                    irradiationTypeCode: "",
                    radiationType: "",
                    personId: this.personInfo.id
                });
            } else {
                this.careerHistoryData2.push({
                    type: type,
                    startDate: "",
                    endDate: "",
                    workUnit: "",
                    workTypeCode: "",
                    workTypeText: "",
                    hazardFactorsCode: "",
                    hazardFactorsText: "",
                    protectiveMeasures: "",
                    contactTime: "48小时/周",
                    personId: this.personInfo.id
                });
            }
        },
        regionChange(e) {
            this.$nextTick(() => {
                let element = document.querySelector(".rg-default-btn").children[0];
                if (e.province) {
                    element.style.color = "#515a6e";
                    let values = "";
                    let codes = "";
                    if (e.province) {
                        values = e.province.value;
                        codes = e.province.key;
                    }
                    if (e.city) {
                        values += "_" + e.city.value;
                        codes += "_" + e.city.key;
                    }
                    if (e.area) {
                        values += "_" + e.area.value;
                        codes += "_" + e.area.key;
                    }
                    if (e.town) {
                        values += "_" + e.town.value;
                        codes += "_" + e.town.key;
                    }
                    element.innerHTML = values;
                    this.personInfo.birthplaceCode = codes;
                    this.personInfo.birthplaceName = values;
                } else {
                    this.personInfo.birthplaceCode = "";
                    this.personInfo.birthplaceName = "";
                    element.innerHTML = '请选择';
                    element.style.color = "#c5c8ce";
                }
            })
        },
        tableAddItem() {
            if (!this.personInfo.id) {
                this.$Message.error("请选择人员！")
                return;
            }
            this.personInfo.pastMedicalHistoryData.push({
                diseaseName: "",
                diseaseDate: "",
                diagnosticUnit: "",
                afterTreatment: "",
                fate: "",
                personId: this.personInfo.id
            });
        },
        tableDeleteItem(row, index) {
            this.personInfo.pastMedicalHistoryData.splice(index, 1)
        },
        //获取类型库树
        async getProTypeByTypeCode(typeCode) {
            let data = await groupPersonApi.getTypeCodeByTProType({typeCode: typeCode}).then(res => res.data);
            if (data) {
                this.recursionType(data);
            }
            return data;
        },
        //递归
        recursionType(proTypes) {
            proTypes.forEach(item => {
                item.value = item.typeCode;
                item.title = item.typeName;
                item.selected = false;
                item.checked = false;
                if (item.children && item.children.length > 0) {
                    item.disabled = true;
                    this.recursionType(item.children)
                }
            })
        },
        workCodeReback(v) {
            if (v && v.length > 0) {
                if (this.personInfo.physicalType == '放射体检' || (this.personInfo.hazardFactors && (this.personInfo.hazardFactors.indexOf("160002")>-1 || this.personInfo.hazardFactors.indexOf("160501")>-1 || this.personInfo.hazardFactors.indexOf("160502")>-1  || this.personInfo.hazardFactors.indexOf("160503")>-1  || this.personInfo.hazardFactors.indexOf("160504")>-1 || this.personInfo.hazardFactors.indexOf("160506")>-1 || this.personInfo.hazardFactors.indexOf("160507")>-1 || this.personInfo.hazardFactors.indexOf("160999")>-1))) {
                    if(this.careerHistoryData1 && this.careerHistoryData1[this.workTypeIndex]){
                        this.$set(this.careerHistoryData1[this.workTypeIndex], "workTypeCode", v[0].value)
                        this.$set(this.careerHistoryData1[this.workTypeIndex], "workTypeText", v[0].title)
                    }
                    this.personInfo.workTypeCode = v[0].value;
                    this.personInfo.workTypeText = v[0].title;
                } else {
                    if(this.careerHistoryData2 && this.careerHistoryData2[this.workTypeIndex]){
                        this.$set(this.careerHistoryData2[this.workTypeIndex], "workTypeCode", v[0].value)
                        this.$set(this.careerHistoryData2[this.workTypeIndex], "workTypeText", v[0].title)
                    }
                    this.personInfo.workTypeCode = v[0].value;
                    this.personInfo.workTypeText = v[0].title;
                }
            }
        },
        hazardFactorsReback(e) {
            if (e && e.length > 0) {
                this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsCode = "";
                this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsText = "";
                for (let i = 0; i < e.length; i++) {
                    this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsCode += "|" + e[i].typeCode;
                    this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsText += "|" + e[i].typeName;
                }
                this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsCode = this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsCode.substring(1);
                this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsText = this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsText.substring(1);
            } else {
                this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsCode = "";
                this.careerHistoryData2[this.hazardFactorsIndex].hazardFactorsText = "";
            }
        },
        fsDrawerShowReback(e) {
            if (e && e.length > 0) {
                for (let i = 0; i < e.length; i++) {
                    this.careerHistoryData1[this.fsDrawerIndex].irradiationType += "," + e[i].name;
                    this.careerHistoryData1[this.fsDrawerIndex].irradiationTypeCode += "," + e[i].code;
                }
                this.careerHistoryData1[this.fsDrawerIndex].irradiationType = this.careerHistoryData1[this.fsDrawerIndex].irradiationType.substring(1);
                this.careerHistoryData1[this.fsDrawerIndex].irradiationTypeCode = this.careerHistoryData1[this.fsDrawerIndex].irradiationTypeCode.substring(1);
            } else {
                this.careerHistoryData1[this.fsDrawerIndex].irradiationType = "";
                this.careerHistoryData1[this.fsDrawerIndex].irradiationTypeCode = "";
            }
        },
        symptomDataAdd() {
            this.symptomData.push({
                projectName: "",
                degree: "",
                courseTime: ""
            })
        },
        symptomDataDelete(row, index) {
            this.symptomData.splice(index, 1);
        },
        //常用术语选择
        handleWordChoose() {
            //科室id 体检类型 危害因素 术语类型
            this.wordChooseShow = true;
        },
        //获取专业术语回调
        getSelectedWords(word, cType) {
            this.personInfo.familyHistory = word;
        },
    },
    mounted() {
        //是否问诊拆分
        this.isInterrogationSplitting = this.$hospitalName.isInterrogationSplitting;

		//是否展示月经史详细
		this.isMenstrualHistory = this.$hospitalName.isMenstrualHistory;
        // 计算高度
        let height = document.documentElement.clientHeight;
        this.tableMaxHeight = height - 550;
        window.onresize = () => {
            // 计算高度
            let height = document.documentElement.clientHeight;
            this.tableMaxHeight = height - 550;
        };
        getDictDataByType("education").then(res => {
            if (res.success) {
                this.personInfoPriority = res.data;
            }
        });
        //民族
        getDictDataByType("nation").then(res => {
            if (res.success) {
                this.nationArr = res.data;
            }
        });
        userInfo().then(res => {
            if (res.success) {
                this.doctorInfo = res.data;
                if(this.doctorInfo.autograph){
                    if(this.doctorInfo.autographFile && this.doctorInfo.autographFile.indexOf("/dcm") > -1){
                        this.doctorInfo.autograph = this.doctorInfo.autographFile;
                    }else{
                        this.doctorInfo.autograph = "data:image/png;base64," + this.doctorInfo.autograph;
                    }
                }
            }
        });
        this.departmentTypeData = [];
        getDictDataByType('department_type').then(res => {
            if (res && res.success) {
                this.departmentTypeData = res.data;
            }
        });
    },
    watch: {
        personInfo: {
            handler(val, oldName) {
                if (val.id) {
                    if (val.physicalType == '职业体检') {
                        getAskProjectByFactor({hazardFactorIds: this.personInfo.hazardFactors}).then(res => {
                            if (res.success) {
                                let data = res.data;
                                let project = [];
                                if (data && data.length > 0) {
                                    data.forEach(i => {
                                        if (i.askProject) {
                                            project.push(...i.askProject.split(","))
                                        }
                                    })
                                }
                                project = project.filter((i, index, arr) => {
                                    return arr.indexOf(i) === index
                                })
                                //人员已加载
                                this.askProjectData = project;
                            }
                        });
                    }
                }
                this.tabsValue = "1";
                if (this.personInfo.physicalType == '从业体检') {
                    if (this.personInfo.id) {
                        if (this.personInfo.pastMedicalHistoryData.length == 0) {
                            this.personInfo.pastMedicalHistoryData = [
                                {
                                    diseaseName: '肝炎',
                                    yesOrNoSick: '无',
                                    diseaseDate: null,
                                    personId: this.personInfo.id
                                },
                                {
                                    diseaseName: '眼疾',
                                    yesOrNoSick: '无',
                                    diseaseDate: null,
                                    personId: this.personInfo.id
                                },
                                {
                                    diseaseName: '伤寒',
                                    yesOrNoSick: '无',
                                    diseaseDate: null,
                                    personId: this.personInfo.id
                                },
                                {
                                    diseaseName: '肺结核',
                                    yesOrNoSick: '无',
                                    diseaseDate: null,
                                    personId: this.personInfo.id
                                },
                                {
                                    diseaseName: '皮肤病',
                                    yesOrNoSick: '无',
                                    diseaseDate: null,
                                    personId: this.personInfo.id
                                }
                            ]
                        }
                    } else {
                        this.personInfo.pastMedicalHistoryData = [];
                    }
                } else {
                    if (!this.personInfo.workMonth) {
                        this.personInfo.workMonth = 0;
                    }
                    if (!this.personInfo.workYear) {
                        this.personInfo.workYear = 0;
                    }
                    if (!this.personInfo.exposureWorkYear) {
                        this.personInfo.exposureWorkYear = 0;
                    }
                    if (!this.personInfo.exposureWorkMonth) {
                        this.personInfo.exposureWorkMonth = 0;
                    }
                    if (!this.personInfo.familyHistory) {
                        this.personInfo.familyHistory = "无";
                    }
                    if (!this.personInfo.pastMedicalHistoryOtherInfo) {
                        this.personInfo.pastMedicalHistoryOtherInfo = "无";
                    }
                    this.personInfo.workStateText = " " + this.personInfo.workStateText;
                    // if (this.personInfo.workStateText.trim() == "上岗前") {
                    //     this.personInfo.workName = "拟接触" + this.personInfo.hazardFactorsText;
                    // }
                    this.birthplaceCode = {
                        province: "",
                        city: "",
                        area: "",
                        town: "",
                    };
                    this.symptomData1 = [
                        {
                            type: "神经系统",
                            projectName: "头昏",
                            code: "10002",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "头痛",
                            code: "10003",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "眩晕",
                            code: "10004",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "失眠",
                            code: "10005",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "嗜睡",
                            code: "10006",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "多梦",
                            code: "10007",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "记忆力减退",
                            code: "10008",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "易激动",
                            code: "10009",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "疲乏无力",
                            code: "10010",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "四肢麻木",
                            code: "10011",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "动作不灵活",
                            code: "10012",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "神经系统",
                            projectName: "肌肉抽搐",
                            code: "10013",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "皮下出血",
                            code: "10036",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "月经异常",
                            code: "10037",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "低热",
                            code: "10038",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "盗汗",
                            code: "10039",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "多汗",
                            code: "10040",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "口渴",
                            code: "10041",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "消瘦",
                            code: "10042",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "脱发",
                            code: "10043",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "皮疹",
                            code: "10044",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "造血系统、内分泌系统",
                            projectName: "皮肤瘙痒",
                            code: "10045",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "胸痛",
                            code: "10015",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "胸闷",
                            code: "10016",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "咳嗽",
                            code: "10017",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "咳痰",
                            code: "10018",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "咯血",
                            code: "10019",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "气促",
                            code: "10020",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "呼吸系统",
                            projectName: "气短",
                            code: "10021",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "泌尿生殖系统",
                            projectName: "哮喘",
                            code: "10047",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "泌尿生殖系统",
                            projectName: "尿频、尿急",
                            code: "10048",
                            degree: "——",
                            courseTime: ""
                        },

                        {
                            type: "泌尿生殖系统",
                            projectName: "尿痛",
                            code: "10049",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "泌尿生殖系统",
                            projectName: "血尿",
                            code: "10050",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "泌尿生殖系统",
                            projectName: "浮肿",
                            code: "10051",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "泌尿生殖系统",
                            projectName: "性欲减退",
                            code: "10052",
                            degree: "——",
                            courseTime: ""
                        },

                        {
                            type: "肌肉及四肢关机",
                            projectName: "全身酸痛",
                            code: "10054",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "肌肉及四肢关机",
                            projectName: "肌肉疼痛",
                            code: "10055",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "肌肉及四肢关机",
                            projectName: "肌无力及关节疼痛",
                            code: "10056",
                            degree: "——",
                            courseTime: ""
                        },
                    ];
                    this.symptomData2 = [
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "视物模糊",
                            code: "10058",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "视力下降",
                            code: "10059",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "眼痛",
                            code: "10060",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "羞明",
                            code: "10061",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "流泪",
                            code: "10062",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "嗅觉减退",
                            code: "10063",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "鼻干",
                            code: "10064",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "鼻塞",
                            code: "10065",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "流鼻血",
                            code: "10066",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "流涕",
                            code: "10067",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "耳鸣",
                            code: "10068",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "耳聋",
                            code: "10069",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "流涎",
                            code: "10070",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "牙痛",
                            code: "10071",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "牙齿松动",
                            code: "10072",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "刷牙出血",
                            code: "10073",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "口腔异味",
                            code: "10074",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "口腔溃疡",
                            code: "10075",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "咽部疼痛",
                            code: "10076",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "眼、耳、鼻、咽喉及口腔",
                            projectName: "声嘶",
                            code: "10077",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "心血管系统",
                            projectName: "心悸",
                            code: "10023",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "心血管系统",
                            projectName: "心前区不适",
                            code: "10024",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "心血管系统",
                            projectName: "心前区疼痛",
                            code: "10025",
                            degree: "——",
                            courseTime: ""
                        },

                        {
                            type: "消化系统",
                            projectName: "食欲不振",
                            code: "10027",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "恶心",
                            code: "10028",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "呕吐",
                            code: "10029",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "腹胀、腹痛",
                            code: "10030",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "腹泻",
                            code: "10031",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "肝区疼痛",
                            code: "10032",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "便秘",
                            code: "10033",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "消化系统",
                            projectName: "便血",
                            code: "10034",
                            degree: "——",
                            courseTime: ""
                        },
                        {
                            type: "其他",
                            projectName: "无",
                            degree: "——",
                            courseTime: ""
                        }
                    ];
                    if (this.personInfo.symptomData) {
                        //症状赋值
                        this.personInfo.symptomData.forEach(item => {
                            this.symptomData1.forEach(obj => {
                                if (item.type == obj.type && item.projectName == obj.projectName) {
                                    obj.courseTime = item.courseTime;
                                    obj.degree = item.degree
                                }
                            })
                            this.symptomData2.forEach(obj => {
                                if (item.type == obj.type && item.projectName == obj.projectName) {
                                    obj.courseTime = item.courseTime;
                                    obj.degree = item.degree
                                }

                                if (item.type == '其他' && !obj.projectName) {
                                    obj.courseTime = item.courseTime;
                                    obj.degree = item.degree;
                                    obj.projectName = item.projectName;
                                }
                            })
                        })
                    }
                    this.symptomData = this.personInfo.symptomData;
                    if (this.personInfo.birthplaceCode) {
                        let split = this.personInfo.birthplaceCode.split('_');
                        this.birthplaceCode = {
                            province: split[0],
                            city: split[1],
                            area: split[2],
                            town: split[3],
                        }
                    }
                    if (this.personInfo.careerHistoryData) {
                        this.careerHistoryData1 = this.personInfo.careerHistoryData.filter(item => {
                            return item.type == 1;
                        });
                        this.careerHistoryData2 = this.personInfo.careerHistoryData.filter(item => {
                            return item.type == 2;
                        });
                        if (this.personInfo.isWzCheck == 0 && this.personInfo.workStateText.trim() != "上岗前") {
                            let workTypeText = "";
                            if(this.personInfo.workTypeText && this.personInfo.workTypeText.indexOf("其他")>-1 && this.personInfo.workName){
                                workTypeText = this.personInfo.workName;
                            }else{
                                workTypeText = this.personInfo.workTypeText;
                            }
                            this.careerHistoryData2.push({
                                type: 2,
                                startDate: this.personInfo.exposureStartDate,
                                endDate: formatDate(new Date(), "yyyy-MM-dd"),
                                workUnit: this.personInfo.unitName,
                                workTypeCode: this.personInfo.workTypeCode,
                                workTypeText: workTypeText,
                                hazardFactorsCode: this.personInfo.hazardFactors,
                                hazardFactorsText: this.personInfo.hazardFactorsText,
                                protectiveMeasures: "有",
                                contactTime: "48小时/周",
                                personId: this.personInfo.id,
                                department: this.personInfo.department//车间(部门)
                            });
                        }
                    }
                    //岗前
                    if (this.personInfo && this.personInfo.workStateText.trim() == "上岗前") {
                        //清空接害时间
                        this.personInfo.exposureStartDate = null;
                        //未问诊
                        if (this.personInfo.isWzCheck == 0) {
                            //清空默认职业史数据
                            this.careerHistoryData1 = [];
                            this.careerHistoryData2 = [];
                        }
                    }
                    if (this.personInfo.menstrualHistory) {
                        this.personInfo.menstrualHistory = this.personInfo.menstrualHistory;
                    } else {
                        this.personInfo.menstrualHistory = '正常';
                    }
                    if (this.personInfo.allergies) {
                        this.personInfo.allergies = this.personInfo.allergies;
                    } else {
                        this.personInfo.allergies = '无';
                    }
                    if (this.personInfo.smokeState) {
                        this.personInfo.smokeState = this.personInfo.smokeState;
                    } else {
                        this.personInfo.smokeState = '不吸烟';
                    }
                    if (this.personInfo.drinkState) {
                        this.personInfo.drinkState = this.personInfo.drinkState;
                    } else {
                        this.personInfo.drinkState = '不饮酒';
                    }
                }
            },
            immediate: true
        }


    }
}
</script>

<style lang="less">
.otherForm {
    .ivu-table .red td {
        background: rgba(230, 6, 6, .6);
        color: #fff;
    }

    .ivu-form-item {
        margin-bottom: 24px !important;
    }

    .rg-default-btn {
        display: flex !important;
        justify-content: space-between !important;
        width: 100%;
        align-items: center;
    }

    .rg-default-btn {
        &:hover {
            outline: 0;
            box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
            border: 1px solid #57a3f3 !important;
        }
    }

    .rg-default-btn {
        span {
            color: #c5c8ce;
        }
    }

    .rg-caller-container {
        width: 100% !important;
    }

    .ivu-table-wrapper {
        width: 100% !important;
    }

    .ivu-tabs .ivu-tabs-content-animated {
        height: calc(100vh - 440px) !important;
    }

    .ivu-tabs-bar {
        border-bottom: 1px solid #dcdee2 !important;
    }

    .empty {
        text-align: center;
        color: #515a6e;
        margin-top: 20px;
    }

    .sexExisting {
        input {
            width: 80px;
        }
    }
}
</style>
