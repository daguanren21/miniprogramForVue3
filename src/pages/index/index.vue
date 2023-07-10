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
      </map>
    </div>
    <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="suggestionVisible">
      <nut-cell v-for="item in searchAreaList" @click="changeMapCenter(item.location)" :key="item.id" :title="item.title"
        :sub-title="item.address"></nut-cell>
    </nut-popup>
    <device-info-modal :detail="deviceInfo" :show="deviceVisible" @close="handleDeviceInfoClose"></device-info-modal>
    <jx-tab-bar></jx-tab-bar>
  </view>
</template>

<script setup lang="ts">
import { Search2 } from '@nutui/icons-vue-taro';
import { useMapLocation } from '~/composables/use-map-location';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
//获取地图实例
const mapState = reactive({
  scale: 13,
})
const { scale } = toRefs(mapState)
//地图获取最新位置
const { lat: centerLat, lng: centerLng } = useMapLocation()
const { renderMarkerDevices, getSuggestion, deviceSelectId, regionchange, markers, markertap, deviceInfo, deviceVisible } = useQQMapSdk()
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
</script>

<style lang="scss">
@import "./index.scss";
</style>
