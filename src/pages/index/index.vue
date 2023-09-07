<template>
  <view class="home">
    <div class="main">
      <map class="wh-full" :markers="markers" @markertap="markertap" @callouttap="markertap" @regionchange="regionchange"
        :longitude="centerLng" :latitude="centerLat" :scale="scale" id="indexMap" :show-location="true" :showScale="true">
        <div class="quick_search">
          <nut-searchbar v-model="searchValue" @search="handleSearch" placeholder="请输入地址">
            <template v-slot:leftin>
              <Search2 />
            </template>
          </nut-searchbar>
        </div>
        <div class="absolute top-135px right-20px">
          <div @click="handleNearby">
            <image class="w-133px h-133px" src="../../assets/images/index/附近aed.png"></image>
          </div>
          <div @click="handleNearby" class="mt-17px">
            <image class="w-133px h-133px" src="../../assets/images/index/帮助.png"></image>
          </div>
        </div>
        <div @click="moveToLocation" class="absolute bottom-20px right-30px">
          <jx-icon value="myLoc" color="#fa2c19" :size="30"></jx-icon>
        </div>
        <div class="absolute bottom-0 w-full">
          <jx-tab-bar></jx-tab-bar>
        </div>
      </map>
    </div>
    <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="suggestionVisible">
      <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">搜索结果</div>
      <div class="p-40px box-border " style="border:1rpx solid #dadada" v-for="item in searchAreaList"
        @click="changeMapCenter(item.location)">
        <div class="text-30px font-bold text-hex-333">{{ item.title }}</div>
        <div class="mt-20px text-26px text-hex-797979">{{ item.address }}</div>
      </div>
    </nut-popup>
    <device-info-modal :detail="deviceInfo!" :show="deviceVisible" @close="handleDeviceInfoClose"></device-info-modal>
    <nearby-devices @change="changeNearByCenter" @close="nearby.visible = false" :visible="nearby.visible"
      :list="nearby.list"></nearby-devices>
    <nut-overlay :visible="true">
      <div claas="flex-center h-full">
        <div class="bg-hex-fff rounded-20px w-610px">
          <div class="text-left">
            <div class="text-36px text-hex-32B44B font-bold pb-8px w-226px text-center"
              style="border-bottom:2rpx solid #32B44B;padding-bottom:8rpx">帮助</div>
            <div class="mt-54px line-height-36px text-hex-484848 text-28px">
              <p>一.开启AED</p>
              <p>打开包装，取出AED，打开电源开关，按照语音提示操作。</p>
              <p class="mt-30px">二.贴放电极片 </p>
              <p>根据AED电极片上的图示，将一片电极片贴在患者裸露胸部的右上方（胸骨右缘，锁骨之下），另一片电极片贴在患者左乳头外侧（左腋前线之后第五肋间处）。</p>
              <p class="mt-30px">三.开启AED</p>
              <p>打开包装，取出AED，打开电源开关，按照语音提示操作。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="absolute" style="top: -40rpx;">
        <image class="w-165px h-91px" src="../../assets/images/index/夹子.png"></image>
      </div> -->

    </nut-overlay>
  </view>
</template>

<script setup lang="ts">
import { Search2 } from '@nutui/icons-vue-taro';
import { useMapLocation } from '~/composables/use-map-location';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import nearbyDevices from './components/nearby-devices/index.vue'
import { fetchLatelyDevices } from '~/api/device';
import Taro from '@tarojs/taro';
//获取地图实例
const mapState = reactive({
  scale: 13,
})
const { scale } = toRefs(mapState)
//地图获取最新位置
const { lat: centerLat, lng: centerLng } = useMapLocation()
const { renderMarkerDevices, getSuggestion, deviceSelectId, regionchange, markers, markertap, deviceInfo, deviceVisible, moveToLocation } = useQQMapSdk()
// 搜索
const searchValue = ref('')
const searchAreaList = ref<Index.Suggestion[]>([])
const suggestionVisible = ref<boolean>(false)
const handleSearch = async () => {
  let data = await getSuggestion({ keyword: searchValue.value })
  if (data.length) {
    searchAreaList.value = data
    suggestionVisible.value = true
  } else {
    // TODO:补充提示
    console.log("数据为空")
  }
}
//关闭弹窗并且取消设备选中效果
const handleDeviceInfoClose = () => {
  deviceVisible.value = false;
  deviceSelectId.value = 0
  renderMarkerDevices()
}
//选中地址后改变地图位置
const changeMapCenter = (location: Pick<Index.Suggestion, 'location'>['location']) => {
  centerLat.value = location.lat
  centerLng.value = location.lng
  suggestionVisible.value = false
}
//附近AED
const nearby = reactive({
  visible: false,
  list: [] as Index.DeviceInfo[],
  distance: 100 // 默认为10km
})
//打开Modal并查询附近设备
async function handleNearby() {
  let res = await fetchLatelyDevices({
    distance: nearby.distance,
    latFrom: centerLat.value,
    lngFrom: centerLng.value
  })
  nearby.list = res
  if (nearby.list.length > 0) {
    nearby.visible = true
  } else {
    Taro.showToast({
      title: '附近' + nearby.distance + '公里没有设备',
      icon: 'none'
    })
  }
}
//选中附近AED改变地图中心
function changeNearByCenter(item: Index.DeviceInfo) {
  //弹出设备详情
  markertap({
    detail: {
      markerId: item.id
    }
  })
  // centerLat.value = item.deployedAreaLatitude
  // centerLng.value = item.deployedAreaLongitude
}
</script>

<style lang="scss">
@import "./index.scss";

.search-area {
  padding: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #C5C5C5;
}
</style>
