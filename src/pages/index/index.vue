<template>
  <view class="home">
    <div class="main">
      <map class="wh-full" :markers="markers" @markertap="markertap" @callouttap="markertap" @regionchange="regionchange"
        :longitude="centerLng" :latitude="centerLat" :scale="mapScale" id="indexMap" :show-location="true"
        :showScale="false">
        <div class="quick_search">
          <nut-searchbar class="jx-search" v-model="searchValue" @search="handleSearch" placeholder="请输入地址">
            <template v-slot:rightin>
              <nut-button type='primary' @click="handleSearch"
                style="width:120rpx;height:75rpx;white-space: nowrap;margin-left: 40rpx;">搜索</nut-button>
            </template>
          </nut-searchbar>
        </div>
        <div class="absolute bottom-180px right-20px">
          <div @click="handleNearby">
            <image class="w-100px h-100px" src="../../assets/images/index/附近aed.png"></image>
          </div>
          <!-- <div @click="helpVisible = true" class="mt-17px">
            <image class="w-100px h-100px" src="../../assets/images/index/帮助.png"></image>
          </div> -->
        </div>
        <div @click="moveToLocation" class="absolute bottom-120px right-30px">
          <jx-icon value="myLoc" color="#fa2c19" :size="30"></jx-icon>
        </div>
        <div class="absolute bottom-0 w-full">
          <jx-tab-bar></jx-tab-bar>
        </div>
      </map>
    </div>
    <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="suggestionVisible">
      <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">搜索结果</div>
      <div class="p-x-40px box-border">
        <div class="p-y-40px box-border" style="border-bottom:1rpx solid #dadada" v-for="item in searchAreaList"
          @click="changeMapCenter(item.location)">
          <div class="text-30px font-bold text-hex-333">{{ item.title }}</div>
          <div class="mt-20px text-26px text-hex-797979">{{ item.address }}</div>
        </div>
      </div>

    </nut-popup>
    <device-info-modal :detail="deviceInfo!" :show="deviceVisible" @close="handleDeviceInfoClose"></device-info-modal>
    <nearby-devices @change="changeNearByCenter" @close="nearby.visible = false" :visible="nearby.visible"
      :list="nearby.list"></nearby-devices>
    <nut-overlay v-model:visible="helpVisible">
      <div class="flex-center h-full">
        <div class="bg-hex-fff rounded-20px w-610px pb-50px relative">
          <div class="help-header">
            <image class="w-165px h-90px" src="../../assets/images/index/夹子.png"></image>
          </div>
          <div class="pt-50px">
            <div class="text-36px text-hex-32B44B font-bold pb-8px w-226px text-center m-auto"
              style="border-bottom:2rpx solid #32B44B;">帮助</div>
            <div class="text-left mt-54px line-height-36px text-hex-484848 text-28px p-x-30px">
              <p>一.开启AED</p>
              <p>打开包装，取出AED，打开电源开关，按照语音提示操作。</p>
              <p class="mt-30px">二.贴放电极片 </p>
              <p>根据AED电极片上的图示，将一片电极片贴在患者裸露胸部的右上方（胸骨右缘，锁骨之下），另一片电极片贴在患者左乳头外侧（左腋前线之后第五肋间处）。</p>
              <p class="mt-30px">三.开启AED</p>
              <p>打开包装，取出AED，打开电源开关，按照语音提示操作。</p>
            </div>
            <div @click="helpVisible = false"
              class="m-auto w-450px mt-50px rounded-37px h-70px line-height-70px bg-hex-32B44B text-hex-fff text-34px text-center">
              已知悉
            </div>
          </div>
        </div>
      </div>
    </nut-overlay>
  </view>
</template>

<script setup lang="ts">
import { useMapLocation } from '~/composables/use-map-location';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import nearbyDevices from './components/nearby-devices/index.vue'
import { fetchLatelyDevices } from '~/api/device';
import Taro, { useDidShow } from '@tarojs/taro';
const helpVisible = ref(false)
//获取地图实例

//地图获取最新位置
const account = useAccountInfo()
const { userCenter } = storeToRefs(account)
const { lat: centerLat, lng: centerLng } = useMapLocation({ isNeedAddress: false })
const { renderMarkerDevices, mapScale, getSuggestion, deviceSelectId, regionchange, markers, markertap, deviceInfo, deviceVisible, moveToLocation } = useQQMapSdk((lat, lng) => {
  centerLat.value = lat
  centerLng.value = lng
})
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
    Taro.showToast({
      icon: 'none',
      title: '暂无该地址信息'
    })
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
  distance: 10 // 默认为10km
})
//打开Modal并查询附近设备
async function handleNearby() {
  try {
    let res = await fetchLatelyDevices({
      distance: nearby.distance,
      latFrom: userCenter.value.lat,
      lngFrom: userCenter.value.lng,
    })
    nearby.list = res
    if (nearby.list.length > 0) {
      nearby.visible = true
    }
  } catch (error) {
    Taro.showToast({
      title: error,
      icon: 'none'
    })
  }
}
//选中附近AED改变地图中心
// const { pointLevelScaleTo } = mapGlobalConfigParams
function changeNearByCenter(item: Index.DeviceInfo) {
  centerLat.value = item.deployedAreaLatitude
  centerLng.value = item.deployedAreaLongitude
  Taro.showLoading({
    title: '数据加载中'
  })
  setTimeout(() => {
    //弹出设备详情
    markertap({
      detail: {
        markerId: item.id
      }
    })
    Taro.hideLoading()
  }, 1000)
  // mapScale.value = pointLevelScaleTo

}
useDidShow(() => {
  Taro.setNavigationBarTitle({
    title: '首页'
  })
})
</script>

<style lang="scss">
@import "./index.scss";

.search-area {
  padding: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #C5C5C5;
}

.help-header {
  position: absolute;
  left: 50%;
  top: -60rpx;
  transform: translateX(-50%);
}
</style>
