<template>
  <div id="CommunityManagementOperation">
    <TyReturn></TyReturn>
    <a-space direction="vertical" size="large" style="width: 100%">
      <a-radio-group v-model="menu_select" @change="e => tabChange(menuList[activityType - 1][e.target.value].value)" button-style="solid">
        <a-radio-button v-for="(item, key) in menuList[activityType - 1]" :key="key" :value="key" :tab="item.name">{{ item.name }}</a-radio-button>
      </a-radio-group>
      <a-row>
        <a-col>
          <a-space class="facility-title">
            <div class="facility-title-box"></div>
            <div class="facility-title-text">{{ menuList[activityType - 1][menu_select]["showTitle"] || menuList[activityType - 1][menu_select]["name"] }}</div>
            <a-select v-if="tabSelect === 'returnVisitInfo'" v-model="form.type" placeholder="请选择" :options="type_options" allowClear style="width: 150px;" @change="getVisit()" />
          </a-space>
          <a-form-model v-if="tabSelect === 'basicInfo' && activityType !== 3" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 800px">
            <a-form-model-item ref="activityName" label="活动主题:" prop="activityName" class="flex-center" has-feedback>{{ form.activityName }}</a-form-model-item>
            <a-form-model-item ref="region" label="小区:" prop="region" class="flex-center">{{ form.plotName }}</a-form-model-item>
            <a-form-model-item ref="address" label="地址" prop="address" class="flex-center" has-feedback>{{ form.address }} </a-form-model-item>
            <a-form-model-item ref="startTime" label="开始时间" prop="startTime" class="flex-center" has-feedback>
              {{ form.startTime }}
            </a-form-model-item>
            <a-form-model-item ref="community" label="结束时间" prop="community" class="flex-center" has-feedback>
              {{ form.endTime }}
            </a-form-model-item>
            <a-form-model-item ref="community" label="创建时间" prop="community" class="flex-center" has-feedback>
              {{ form.createTime }}
            </a-form-model-item>
            <a-form-model-item ref="createName" label="创建人" prop="createName" class="flex-center">
              {{ form.createName }}
            </a-form-model-item>
            <a-form-model-item ref="warehouse" label="仓库" prop="warehouse" class="flex-center">
              {{ form.warehouse }}
            </a-form-model-item>
            <a-form-model-item ref="userType" label="居民类型" prop="userType" class="flex-center" v-if="activityType === 2 || activityType === 4">
              {{ form.userType ? userTypeList[form.userType - 1].label : "" }}
            </a-form-model-item>
            <a-form-model-item ref="picUrl" label="图片" prop="picUrl" class="flex-center">
              <div class="picurl-list flex-left">
                <img :src="$com.showUpload() + item" v-for="(item, key) in form.picUrl && form.picUrl.split(',')" :key="key" @click="showPicture(item)" />
              </div>
            </a-form-model-item>
          </a-form-model>
          <a-form-model v-else-if="tabSelect === 'basicInfo' && activityType === 3" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 800px">
            <a-form-model-item ref="activityNo" label="订单号：" prop="activityNo" has-feedback class="flex-center">{{ form.activityNo }}</a-form-model-item>
            <a-form-model-item ref="userName" label="客户：" prop="userName" class="flex-center">{{ form.userName }}</a-form-model-item>
            <a-form-model-item ref="userPhone" label="电话：" prop="userPhone" has-feedback class="flex-center">{{ form.userPhone }} </a-form-model-item>
            <a-form-model-item ref="address" label="地址：" prop="address" has-feedback class="flex-center"> {{ form.address }}</a-form-model-item>
            <a-form-model-item ref="goodsName" label="回收物品：" prop="goodsName" has-feedback class="flex-center">
              {{ form.goodsName }}
            </a-form-model-item>
            <a-form-model-item ref="startTime" label="上门时间：" prop="startTime" has-feedback class="flex-center">
              {{ form.startTime }}
            </a-form-model-item>
            <a-form-model-item ref="remark" label="备注：" prop="remark" class="flex-center">
              {{ form.remark }}
            </a-form-model-item>
            <a-form-model-item ref="startTime" label="创建时间：" prop="startTime" class="flex-center">
              {{ form.startTime }}
            </a-form-model-item>
            <a-form-model-item ref="createName" label="创建人:" prop="createName" class="flex-center">
              {{ form.createName }}
            </a-form-model-item>
          </a-form-model>
          <a-form-model v-if="tabSelect === 'taskTimeLine' && activityType !== 3" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 800px">
            <a-form-model-item ref="siteAccountName" label="负责人:" prop="siteAccountName" class="flex-center" has-feedback>
              {{ form.siteAccountName }}
            </a-form-model-item>
            <a-form-model-item ref="activityPeople" label="成员:" prop="activityPeople" class="flex-center">{{ form.activityPeople }}</a-form-model-item>
            <a-form-model-item ref="examineTime" label="审核时间：" prop="examineTime" class="flex-center" has-feedback>
              {{ form.examineTime }}
            </a-form-model-item>
            <a-form-model-item ref="finishTime" label="完成时间：" prop="finishTime" class="flex-center" has-feedback>
              {{ form.finishTime }}
            </a-form-model-item>
            <a-form-model-item ref="cancelTime" label="取消时间：" prop="cancelTime" class="flex-center" has-feedback>
              {{ form.cancelTime }}
            </a-form-model-item>
          </a-form-model>
          <a-form-model v-else-if="tabSelect === 'taskTimeLine' && activityType === 3" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 800px">
            <a-form-model-item ref="siteAccountName" label="负责人:" prop="siteAccountName" class="flex-center" has-feedback>
              {{ form.siteAccountName }}
            </a-form-model-item>
            <a-form-model-item ref="activityPeople" label="成员:" prop="activityPeople" class="flex-center">{{ form.activityPeople }}</a-form-model-item>
            <a-form-model-item ref="dispatchTime" label="分配时间：" prop="dispatchTime" class="flex-center" has-feedback>
              {{ form.dispatchTime }}
            </a-form-model-item>
            <a-form-model-item ref="acceptTime" label="接单时间：" prop="acceptTime" class="flex-center" has-feedback>
              {{ form.acceptTime }}
            </a-form-model-item>
            <a-form-model-item ref="finishTime" label="完成时间：" prop="finishTime" class="flex-center" has-feedback>
              {{ form.finishTime }}
            </a-form-model-item>
            <a-form-model-item ref="cancelTime" label="取消时间：" prop="cancelTime" class="flex-center" has-feedback>
              {{ form.cancelTime }}
            </a-form-model-item>
          </a-form-model>
          <div v-if="tabSelect === 'signInfo'">
            <a-table size="middle" :data-source="item.dataTeam" :loading="signInTableLoading" v-for="(item, key) in signInData" :key="key" :pagination="false" style="margin-bottom:20px;">
              <a-table-column key="accountName" title="姓名" data-index="accountName" align="center" :ellipsis="true" />
              <a-table-column key="signType" title="签到类型" data-index="signType" align="center" :ellipsis="true" />
              <a-table-column key="shouldSignTime" title="签到时间" data-index="shouldSignTime" align="center" :ellipsis="true" />
              <a-table-column key="addressDetail" title="定位地址" data-index="addressDetail" align="center" :ellipsis="true" />
              <a-table-column key="signUrl" title="图片" data-index="signUrl" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img :src="/https|http/.test(item) ? item : $com.showUpload() + item" v-for="(item, key) in record.signUrl && record.signUrl.split(',')" :key="key" @click="showPicture(item)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="realSignTime" title="拍摄时间" data-index="realSignTime" align="center" :ellipsis="true" />
            </a-table>
          </div>
          <div v-if="tabSelect === 'giftInfo' && activityType !== 3">
            <a-table size="middle" :data-source="giftData" :loading="giftTableLoading" :pagination="false">
              <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
              <a-table-column key="integralPrice" title="积分" data-index="integralPrice" align="center" :ellipsis="true" />
              <a-table-column key="totalNumber" title="申请数量" data-index="totalNumber" align="center" :ellipsis="true" />
              <a-table-column key="stockNumber" title="仓库出库" data-index="stockNumber" align="center" :ellipsis="true" />
              <a-table-column key="signNum" title="运营签收" data-index="signNum" align="center" :ellipsis="true" />
              <a-table-column key="exchangeNum" title="兑换数量" data-index="exchangeNum" align="center" :ellipsis="true" />
              <a-table-column key="costNum" title="消耗数量" data-index="costNum" align="center" :ellipsis="true" />
              <a-table-column key="inventoryNum" title="活动盘存" data-index="inventoryNum" align="center" :ellipsis="true" />
              <a-table-column key="returnNum" title="仓库签收" data-index="returnNum" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="giftPage" show-quick-jumper :default-current="1" :total="giftTotal" @change="giftsMaterialsDetails(1, null, 'gift')" />
            </div>
          </div>
          <div v-if="tabSelect === 'giftInfo' && activityType === 3">
            <a-table size="middle" :data-source="giftData" :loading="giftTableLoading" :pagination="false">
              <a-table-column key="giftName" title="礼品名称" data-index="giftName" align="center" :ellipsis="true" />
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
              <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true" />
              <a-table-column key="totalNumber" title="申请数量" data-index="totalNumber" align="center" :ellipsis="true" />
              <a-table-column key="stockNumber" title="出库数量" data-index="stockNumber" align="center" :ellipsis="true" />
              <a-table-column key="exchangeNum" title="兑换数量" data-index="exchangeNum" align="center" :ellipsis="true" />
              <a-table-column key="number" title="剩余数量" data-index="number" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="giftPage" show-quick-jumper :default-current="1" :total="giftTotal" @change="giftsMaterialsDetails(1, null, 'gift')" />
            </div>
          </div>
          <div v-if="tabSelect === 'materialInfo' && activityType === 1">
            <a-table size="middle" :data-source="materialData" :loading="materialTableLoading" :pagination="false">
              <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
              <a-table-column key="integralPrice" title="积分" data-index="integralPrice" align="center" :ellipsis="true" />
              <a-table-column key="totalNumber" title="申请数量" data-index="totalNumber" align="center" :ellipsis="true" />
              <a-table-column key="stockNumber" title="仓库出库" data-index="stockNumber" align="center" :ellipsis="true" />
              <a-table-column key="signNum" title="运营签收" data-index="signNum" align="center" :ellipsis="true" />
              <a-table-column key="exchangeNum" title="兑换数量" data-index="exchangeNum" align="center" :ellipsis="true" />
              <a-table-column key="costNum" title="消耗数量" data-index="costNum" align="center" :ellipsis="true" />
              <a-table-column key="inventoryNum" title="活动盘存" data-index="inventoryNum" align="center" :ellipsis="true" />
              <a-table-column key="returnNum" title="仓库签收" data-index="returnNum" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="materialPage" show-quick-jumper :default-current="1" :total="materialTotal" @change="giftsMaterialsDetails(2, null, 'material')" />
            </div>
          </div>
          <div v-if="tabSelect === 'materialInfo' && activityType !== 1">
            <a-table size="middle" :data-source="materialData" :loading="materialTableLoading" :pagination="false">
              <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
              <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true" />
              <a-table-column key="totalNumber" title="申请数量" data-index="totalNumber" align="center" :ellipsis="true" />
              <a-table-column key="stockNumber" title="出库数量" data-index="stockNumber" align="center" :ellipsis="true" />
              <a-table-column key="exchangeNum" title="兑换数量" data-index="exchangeNum" align="center" :ellipsis="true" />
              <a-table-column key="number" title="剩余数量" data-index="number" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="materialPage" show-quick-jumper :default-current="1" :total="materialTotal" @change="giftsMaterialsDetails(2, null, 'material')" />
            </div>
          </div>
          <div v-if="tabSelect === 'returnVisitInfo'">
            <a-collapse :default-active-key="['1']" :bordered="false">
              <a-collapse-panel :header="item.buildingNo + '栋'" v-for="(item, key) in visitData" :key="key">
                <a-table size="middle" :data-source="item.returnVisit" :loading="visitTableLoading" :pagination="false" :rowKey="record => record.id">
                  <a-table-column key="userName" title="居民姓名" data-index="userName" align="center" :ellipsis="true" />
                  <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
                  <a-table-column key="buildingNo" title="楼号" data-index="buildingNo" align="center" :ellipsis="true" />
                  <a-table-column key="houseNumber" title="门牌" data-index="houseNumber" align="center" :ellipsis="true" />
                  <a-table-column key="accountName" title="指导员" data-index="accountName" align="center" :ellipsis="true" />
                  <a-table-column key="operatorName" title="回访人" data-index="operatorName" align="center" :ellipsis="true" />
                  <a-table-column key="remarkTime" title="回访时间" data-index="remarkTime" align="center" :ellipsis="true" />
                  <a-table-column key="remark" title="备注" data-index="remark" align="center" :ellipsis="true" />
                  <a-table-column key="createTime" title="操作时间" data-index="createTime" align="center" :ellipsis="true" />
                </a-table>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <div v-if="tabSelect === 'exchangeInfo'">
            <a-table size="middle" :data-source="exchangeData" :loading="exchangeTableLoading" :pagination="false">
              <a-table-column key="exchangeNo" title="编号" data-index="exchangeNo" align="center" :ellipsis="true" />
              <a-table-column key="userName" title="居民姓名" data-index="userName" align="center" :ellipsis="true" />
              <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
              <a-table-column key="giftName" title="礼品名称" data-index="giftName" align="center" :ellipsis="true" />
              <a-table-column key="unitIntegral" title="积分单价" data-index="unitIntegral" align="center" :ellipsis="true" />
              <a-table-column key="num" title="数量" data-index="num" align="center" :ellipsis="true" />
              <a-table-column key="integral" title="消耗积分" data-index="integral" align="center" :ellipsis="true" />
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="createTime" title="兑换时间" data-index="createTime" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="exchangePage" show-quick-jumper :default-current="1" :total="exchangeTotal" @change="exchange()" />
            </div>
          </div>
          <div v-if="tabSelect === 'recycleInfo'">
            <a-table size="middle" :data-source="recoveryData" :loading="recoveryTableLoading" :pagination="false">
              <a-table-column key="userName" title="居民姓名" data-index="userName" align="center" :ellipsis="true" />
              <a-table-column key="categoryName" :title="activityType === 3 ? '实际回收物品' : '垃圾类型'" data-index="categoryName" align="center" :ellipsis="true" />
              <a-table-column key="netWeight" title="净重（kg）" data-index="netWeight" align="center" :ellipsis="true" />
              <a-table-column key="settlement" title="结算单价" data-index="settlement" align="center" :ellipsis="true" />
              <a-table-column key="paidIn" title="实付" data-index="paidIn" align="center" :ellipsis="true" />
              <a-table-column key="operator" title="操作人" data-index="operator" align="center" :ellipsis="true" />
              <a-table-column key="updateTime" title="操作时间" data-index="updateTime" align="center" :ellipsis="true" />
              <a-table-column key="qualityPic" title="图片" data-index="qualityPic" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img
                      :src="/https|http/.test(item) ? item : $com.showUpload() + item"
                      v-for="(item, key) in record.qualityPic && record.qualityPic.split(',')"
                      :key="key"
                      @click="showPicture(item)"
                    />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="note" title="备注" data-index="note" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="recoveryPage" show-quick-jumper :default-current="1" :total="recoveryTotal" @change="recovery()" />
            </div>
          </div>
          <div v-if="tabSelect === 'timeWall'">
            <a-carousel autoplay class="carousel" v-if="timeWallData && timeWallData.length">
              <div v-for="(item, key) in timeWallData" :key="key">
                <h3><img :src="item.pictureUrl" /></h3>
              </div>
            </a-carousel>
            <a-table size="middle" :data-source="timeWallData" :loading="timeWallTableLoading" :pagination="false">
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="pictureUrl" title="图片" data-index="pictureUrl" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img :src="(/https|http/.test(record.pictureUrl) ? '' : $com.showUpload()) + record.pictureUrl" @click="showPicture(record.pictureUrl)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="createTime" title="上传时间" data-index="createTime" align="center" :ellipsis="true" />
            </a-table>
          </div>
          <div v-if="tabSelect === 'operationRecord'">
            <a-table size="middle" :data-source="operationData" :loading="operationTableLoading" :pagination="false">
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="createTime" title="时间" data-index="createTime" align="center" :ellipsis="true" />
              <a-table-column key="remark" title="操作" data-index="remark" align="center" :ellipsis="true" />
              <a-table-column key="remarkDetail" title="描述" data-index="remarkDetail" align="center" :ellipsis="true" />
            </a-table>
          </div>
        </a-col>
      </a-row>
    </a-space>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="(/http|https/.test(picUrl) ? '' : $com.showUpload()) + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
import difference from "lodash/difference"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "CommunityManagement",
  components: {
    TyReturn
  },
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      userTypeList: [
        { value: 1, label: "没有参与记录" },
        { value: 2, label: "月活跃居民" },
        { value: 3, label: "巡检不合格" },
        { value: 4, label: "活动指定时间内未参与" },
        { value: 5, label: "已投递智能桶" }
      ],
      type_options: [
        { label: "全部", value: 0 },
        { label: "已回访", value: 1 },
        { label: "未回访", value: 2 }
      ],
      address: "",
      tabList: [
        { name: "已创建", value: 1, num: null },
        { name: "已开启", value: [2, 3], num: null },
        { name: "已结束", value: 4, num: null },
        { name: "已取消", value: 0, num: null }
      ],
      signType: ["上班", "下班", "活动"],
      giftAndMaterialList: [
        { typeName: "gift", typeTitle: "礼品" },
        { typeName: "material", typeTitle: "物料" }
      ],
      // query:"",
      form: {
        userType: null,
        type: null,
        activityName: undefined,
        plotName: undefined,
        address: undefined,
        startTime: undefined,
        endTime: undefined,
        createTime: undefined,
        createName: undefined,
        warehouse: undefined,
        picUrl: undefined,
        siteAccountName: undefined,
        activityPeople: undefined,
        examineTime: undefined,
        finishTime: undefined,
        cancelTime: undefined,
        dispatchTime: "",
        acceptTime: "",
        updateTime: "",
        activityNo: "",
        userName: "",
        userPhone: "",
        goodsName: "",
        remark: ""
      },
      signInTableLoading: false,
      signInData: [],
      signInTotal: 0,
      signInPage: 1,
      exchangeTableLoading: false,
      exchangeData: [],
      exchangeTotal: 0,
      exchangePage: 1,
      giftTableLoading: false,
      giftData: [],
      giftTotal: 0,
      giftPage: 1,
      materialTableLoading: false,
      materialData: [],
      materialTotal: 0,
      materialPage: 1,
      recoveryTableLoading: false,
      recoveryData: [],
      recoveryTotal: 0,
      recoveryPage: 1,
      timeWallTableLoading: false,
      timeWallData: [],
      timeWallTotal: 0,
      timeWallPage: 1,
      operationTableLoading: false,
      operationData: [],
      operationTotal: 0,
      operationPage: 1,
      visitTableLoading: false,
      feedbackVisitList: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "已回访"
        },
        {
          value: 2,
          label: "未回访"
        }
      ],
      initLocation: "", // 新增时地图初始经纬度
      type: "add", // 页面状态 编辑/新增
      areaCascaderArea: {}, // 三级联动省市区名称
      locationArr: [], // 地图上的经纬度数组
      location: [], // 地图上的经纬度
      address_details: "", // 地图上的详细地址
      searchAddress: "", // 地址模糊查询
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      rules: {
        plot_name: [{ required: true, message: "请输入小区名称", trigger: "blur" }],
        region: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        street: [{ required: true, message: "请输入街道", trigger: "blur" }]
      },
      id: 0,
      visible: false, //礼品弹窗
      confirmLoading: false,

      previewImage: "",
      imgLoading: false,

      selectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格

      targetKeys: [],
      showSearch: true,
      giftTab: [
        {
          title: "名称",
          dataIndex: "giftName"
        },
        {
          title: "规格",
          dataIndex: "specs"
        },
        {
          title: "品牌",
          dataIndex: "brand"
        },
        {
          title: "积分",
          dataIndex: "integralPrice"
        },
        {
          title: "申请数量",
          dataIndex: "totalNumber"
        },
        {
          title: "仓库出库",
          dataIndex: "stockNumber"
        },
        {
          title: "运营签收",
          dataIndex: ""
        },
        {
          title: "兑换数量",
          dataIndex: ""
        },
        {
          title: "消耗数量",
          dataIndex: ""
        },
        {
          title: "活动盘存",
          dataIndex: ""
        },
        {
          title: "仓库签收",
          dataIndex: ""
        }
      ],
      statusList: [
        { name: "已创建", value: 1 },
        { name: "已开启", value: 2 },
        { name: "已结束", value: 3 },
        { name: "已取消", value: 4 }
      ],
      menuList: [
        // 1-宣传活动；2-入户回访活动；3-上门回收活动；4-定时定点活动
        [
          { name: "基本信息", value: "basicInfo" },
          { name: "任务时间轴", value: "taskTimeLine" },
          { name: "签到信息", value: "signInfo" },
          { name: "礼品信息", value: "giftInfo" },
          { name: "物料信息", value: "materialInfo" },
          { name: "兑换信息", value: "exchangeInfo" },
          { name: "回收信息", value: "recycleInfo", showTitle: "回收记录" },
          { name: "时光墙", value: "timeWall" },
          { name: "操作记录", value: "operationRecord" }
        ],
        [
          { name: "基本信息", value: "basicInfo" },
          { name: "任务时间轴", value: "taskTimeLine" },
          { name: "签到信息", value: "signInfo" },
          { name: "礼品信息", value: "giftInfo" },
          { name: "回访信息", value: "returnVisitInfo" },
          { name: "兑换信息", value: "exchangeInfo" },
          { name: "回收信息", value: "recycleInfo", showTitle: "回收记录" },
          { name: "时光墙", value: "timeWall" },
          { name: "操作记录", value: "operationRecord" }
        ],
        [
          { name: "基本信息", value: "basicInfo" },
          { name: "任务时间轴", value: "taskTimeLine" },
          { name: "回收信息", value: "recycleInfo", showTitle: "回收记录" },
          { name: "时光墙", value: "timeWall" },
          { name: "操作记录", value: "operationRecord" }
        ],
        [
          { name: "基本信息", value: "basicInfo" },
          { name: "任务时间轴", value: "taskTimeLine" },
          { name: "签到信息", value: "signInfo" },
          { name: "礼品信息", value: "giftInfo" },
          { name: "兑换信息", value: "exchangeInfo" },
          { name: "回收信息", value: "recycleInfo", showTitle: "回收记录" },
          { name: "时光墙", value: "timeWall" },
          { name: "操作记录", value: "operationRecord" }
        ]
      ],
      menuListInfo: [],
      menu_select: 0,
      status_select: 1,
      total: 1,
      page: 1,
      activityType: undefined,
      picUrl: null,
      previewVisible: false,
      visitData: [],
      tabSelect: ""
    }
  },
  created() {
    // this.query=this.$route.query
    // 如果是edit类型 并且有 id 就是编辑状态
    // if (this.query.type === "detail" && this.query.id !== "") {

    // } else {
    //   this.show = true
    // }
    this.activityType = Number(this.query.activityType)
    this.tabSelect = this.menuList[this.activityType - 1][0].value
    this.id = Number(this.query.id) || ""
    this.activityDetails() // 宣传活动基本信息和任务时间轴
  },
  methods: {
    // 预览大图
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    tabChange(e) {
      this.tabSelect = e
      // this.selectedRowKeys = []
      if (e === "basicInfo" || e === "taskTimeLine") {
        // this.activityDetails()
      } else if (e === "signInfo") {
        this.signIn()
      } else if (e === "giftInfo") {
        this.giftsMaterialsDetails(1, null, "gift")
      } else if (e === "materialInfo") {
        this.giftsMaterialsDetails(2, null, "material")
      } else if (e === "exchangeInfo") {
        //
        this.exchange()
      } else if (e === "returnVisitInfo") {
        this.getVisit()
      } else if (e === "recycleInfo") {
        this.recovery()
      } else if (e === "timeWall") {
        this.getActivityDetail(4, "timeWall")
      } else if (e === "operationRecord") {
        this.getActivityDetail(5, "operation")
      }
    },
    getVisit() {
      let type = this.form.type
      let data = { id: this.id }
      type ? (data.type = type) : null
      this.$api.getVisit(data).then(res => {
        res.data.forEach((e, key) => {
          e.key = key
        })
        this.visitData = res.data
      })
    },
    giftsMaterialsDetails(type, page, tabName) {
      if (page) this[type + "Page"] = page
      this[tabName + "TableLoading"] = true
      this.$api
        .giftsMaterialsDetails({ id: this.id, type, pageNum: this[tabName + "Page"] })
        .then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = item.id
            return item
          })
          this[tabName + "TableLoading"] = false
          this[tabName + "Data"] = dataSource
          this[tabName + "Total"] = res.data.total
        })
        .catch(e => {
          this[tabName + "TableLoading"] = false
          this[tabName + "Data"] = []
          this[tabName + "Total"] = 0
        })
    },
    // 表格搜索过滤函数
    filterOption(inputValue, option) {
      return option.gift_name.indexOf(inputValue) > -1
    },
    showGift() {
      //获取列表
      this.getTableList()
      this.visible = true
    },
    // 获取礼品列表
    getTableList(page) {
      if (page) this.page = page
      this.tableLoading = true
      this.$api.activityGift().then(res => {
        this.dataSource = res.data.map(item => {
          item.key = item.id + ""
          item.title = item.gift_name
          item.select_number = item.number
          return item
        })
        // 设置应该选中的礼品
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    // 表格选择
    onChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
      //  如果往右移动 需要把select_number字段的值恢复为礼品初始数量
      if (direction === "right") {
        this.dataSource.forEach(item => {
          moveKeys.forEach(sitem => {
            if (item.key === sitem) {
              item.select_number = item.number
            }
          })
        })
      }
    },
    // back() {},
    // 地图 详细地址 => 经纬度
    mapInputChange(location) {
      if (this.query.type === "add" && this.form.location === "") {
        this.initLocation = location
      }
      if (location) this.form.location = location
    },
    // 地图拖拽 返回地址, 经纬度
    mapDraggableChange(location) {
      this.form.location = location
    },
    // 详细地址查询 选择某项
    addressSelect(e) {
      this.address = e
      // this.form.plot_name = e
    },
    // 详细地址查询 搜索
    addressSearch(e) {
      if (e !== "") {
        this.searchAddress = e
      }
    },
    // 地图返回模糊查询的列表
    addressList(list) {
      this.dataSource = list
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
    },
    getActivityDetail(type, typeName) {
      this.$api.getActivityDetail({ id: this.id, type }).then(res => {
        const data = res.data.map((item, key) => {
          item.key = key
          return item
        })
        this[typeName + "Data"] = data
      })
    },
    // 如果是编辑状态,需要恢复页面数据
    activityDetails() {
      this.$api.activityDetails({ id: this.id }).then(res => {
        const data = res.data
        Object.keys(this.form).forEach(e => {
          this.form[e] = data[e]
        })
      })
    },
    setTeam(data) {
      let arr = []
      let accountId = []
      data.forEach(e => {
        if (!accountId.includes(e.accountId)) {
          accountId.push(e.accountId)
          arr.push({ accountId: e.accountId, dataTeam: [e] })
        } else {
          arr.forEach(ee => {
            if (ee.accountId == e.accountId) {
              ee.dataTeam.push(e)
            }
          })
        }
      })
      return arr
    },
    signIn() {
      this.signInTableLoading = true
      this.$api
        .signIn({ id: this.id, pageNum: this.signInPage })
        .then(res => {
          const data = res.data.data.map(e => {
            e.key = e.id
            return e
          })

          let teamdata = this.setTeam(data)

          this.signInTableLoading = false
          this.signInTotal = res.data.total
          this.signInData = teamdata
        })
        .catch(e => {
          this.signInTableLoading = false
        })
    },
    exchange() {
      this.exchangeTableLoading = true
      this.$api
        .exchange({ id: this.id, pageNum: this.exchangePage })
        .then(res => {
          const data = res.data.data.map(e => {
            e.key = e.id
            return e
          })
          this.exchangeTableLoading = false
          this.exchangeTotal = res.data.total
          this.exchangeData = data
        })
        .catch(e => {
          this.exchangeTableLoading = false
        })
    },
    recovery() {
      this.recoveryTableLoading = true
      this.$api
        .recovery({ id: this.id, pageNum: this.recoveryPage })
        .then(res => {
          const data = res.data.data.map((e, key) => {
            e.key = key
            return e
          })
          this.recoveryTableLoading = false
          this.recoveryTotal = res.data.total
          this.recoveryData = data
        })
        .catch(e => {
          this.recoveryTableLoading = false
        })
    },
    // 确定
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let that = this
          this.$confirm({
            // title: "省市区不对应",
            content: "请确认是否继续保存",
            okText: "继续保存",
            cancelText: "取消保存",
            icon: "info-circle",
            onOk() {
              that.sureSubmit()
            },
            onCancel() {
              that.$message.info("已取消")
            }
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 确认保存
    sureSubmit() {
      const data = {
        type: this.form.plot_type || "",
        plot_name: this.form.plot_name || "",
        area_id: this.form.area_id || "",
        // region: this.form.region || "",
        street: this.form.street || "",
        location: this.form.location || "",
        community: this.form.community || "",
        total_number: this.form.total_number || 0,
        at_number: this.form.at_number || 0
      }

      //如果获取不到经纬度坐标信息，则不允许添加
      if (this.form.location == "" || this.form.location == undefined) {
        this.$message.error("该地址定位识别不了")
        return false
      }

      if (this.query.type === "edit") {
        // 编辑
        data.id = this.id.toString()
        this.$api.editCommunityManagement(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "CommunityManagement" })
          }, 1000)
        })
      } else if (this.query.type === "add") {
        data.create_type = this.form.is_huanbaowu || 0
        // 添加
        this.$api.addCommunityManagement(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "CommunityManagement" })
          }, 1000)
        })
      }
    },

    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },
    handleOk() {
      this.visible = false
      this.form.activity_gift = []
      this.dataSource.forEach(item => {
        this.targetKeys.forEach(sitem => {
          if (item.key === sitem) {
            this.form.activity_gift.push({
              gift_id: item.id,
              number: item.select_number,
              gift_name: item.gift_name
            })
          }
        })
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.carousel {
  margin-bottom: 20px;
}
.ant-carousel .slick-slide {
  justify-content: center;
  height: 160px;
  overflow: hidden;
}

.ant-carousel .slick-slide h3 {
  display: flex;
  justify-content: center;
  color: #fff;
}

.ant-carousel .slick-dots li.slick-active button {
  background: #31c27c;
}

.ant-carousel .slick-dots li button {
  background: rgba(0, 0, 0, 0.15);
}

#CommunityManagementOperation {
  .addressSearch {
    position: absolute;
    z-index: 9;
    width: 300px;
    right: 40px;
    top: 40px;
  }
}

.facility-title-text {
  display: flex;
  align-items: center;
  height: 30px;
}

.status-select {
  font-weight: normal;
  font-size: 14px;
  margin-left: 20px;
}

.bottom-top {
  margin-top: 10px;
}

.picUrl {
  width: 100px;
}

.picurl-list {
  height: 50px;
  width: 50px;
  overflow: hidden;
  margin: 0 auto;
  img {
    max-width: 50px;
    max-height: 50px;
  }
}

.flex-left {
  display: flex;
  margin: 0 0;
}
.ant-collapse {
  background: none;
}

.ant-collapse-borderless > .ant-collapse-item {
  border-bottom: 0;
}

.ant-carousel .slick-dots-bottom {
  bottom: -10px;
}
.ant-carousel .slick-slide img {
  max-height: 200px;
}
.ant-carousel .slick-slide img {
  max-width: 100%;
}
</style>
