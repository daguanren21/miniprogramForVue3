<template>
  <view class="home">
    <div class="main">
      <map class="wh-full" :markers="markers" @markertap="markertap" @callouttap="markertap" @regionchange="regionchange"
        :longitude="centerLng" :latitude="centerLat" :scale="scale" id="indexMap" :show-location="true" :showScale="true">
        <div class="quick_search">
          <nut-searchbar v-model="searchValue" @search="handleSearch">
            <template v-slot:leftin>
              <Search2 />
            </template>
          </nut-searchbar>
        </div>
        <div class="absolute top-120px right-30px">
          <div @click="handleNearby" class="flex-center flex-col mb-20px  p-10px rounded-15px bg-hex-1890ff">
            <IconFont font-class-name="fa" class-prefix="fa" name="nearby" color="#fff" size="24"></IconFont>
            <p class="text-20px text-hex-fff">附近AED</p>
          </div>
        </div>
        <div @click="moveToLocation" class="absolute bottom-20px right-30px">
          <IconFont font-class-name="fa" class-prefix="fa" name="myLoc" color="#fa2c19" size="30"></IconFont>
        </div>
      </map>
    </div>
    <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="suggestionVisible">
      <nut-cell v-for="item in searchAreaList" @click="changeMapCenter(item.location)" :key="item.id" :title="item.title"
        :sub-title="item.address"></nut-cell>
    </nut-popup>
    <device-info-modal :detail="deviceInfo!" :show="deviceVisible" @close="handleDeviceInfoClose"></device-info-modal>
    <nearby-devices @change="changeNearByCenter" @close="nearby.visible = false" :visible="nearby.visible"
      :list="nearby.list"></nearby-devices>
    <jx-tab-bar></jx-tab-bar>
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
const { renderMarkerDevices, getSuggestion, deviceSelectId, regionchange, markers, markertap, deviceInfo, deviceVisible,moveToLocation } = useQQMapSdk()
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
</style>
