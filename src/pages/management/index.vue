<template>
    <div class="home">
        <div class="operate bg-hex-fff">
            <nut-row type="flex" align="center">
                <nut-col :span="13">
                    <nut-searchbar placeholder="请输入编号、地址、归属单位" v-model="form.keyword" @search="handleSearch">
                        <template v-slot:leftin>
                            <Search2 />
                        </template>
                    </nut-searchbar>
                </nut-col>
                <nut-col :span="6">
                    <nut-button @click="visible = true" type='info' style="font-size: 24rpx;">高级过滤</nut-button>
                </nut-col>
                <nut-col :span="5">
                    <nut-button @click="toDeviceInstall" type='primary' style="font-size: 24rpx;">新增</nut-button>
                </nut-col>
            </nut-row>
        </div>
        <div class="main">
            <device-list :search="searchParams"></device-list>
            <nut-popup position="top" :style="{ height: '100%' }" v-model:visible="visible">
                <nut-form>
                    <nut-form-item label="品牌">
                        <nut-input class="nut-input-text" :model-value="form.brandName" @click="handleChangeBrand" readonly
                            placeholder="请选择品牌" type="text">
                        </nut-input>
                    </nut-form-item>
                    <nut-form-item label="安装场所">
                        <nut-input class="nut-input-text" :model-value="form.placeName" @click="handleChangePlace" readonly
                            placeholder="请选择安装场所" type="text">
                        </nut-input>
                    </nut-form-item>
                    <nut-form-item label="区域">
                        <nut-input class="nut-input-text" :model-value="form.regionName" placeholder="请选择区域" type="text"
                            readonly @click="region.visible = true">
                        </nut-input>
                        <nut-popup round closeable @close="region.closeRegion" position="bottom" title="地址选择"
                            v-model:visible="region.visible">
                            <nut-cascader :poppable="false" v-model="form.regionId" @change="region.change"
                                @pathChange="region.pathChange" lazy :lazyLoad="region.lazyLoad"></nut-cascader>
                            <nut-cell>
                                <nut-button style="width:100%" type='primary' @click="region.confirm">确定</nut-button>
                            </nut-cell>
                        </nut-popup>
                    </nut-form-item>
                    <nut-form-item label="安装时间">
                        <div class="flex-center">
                            <nut-input class="nut-input-text" input-align="center" v-model="form.installDateBegin" readonly
                                @click="datePop.open('installDateBegin')" placeholder="请选择开始时间" type="text">
                            </nut-input>
                            <nut-input class="nut-input-text" input-align="center" v-model="form.installDateEnd" readonly
                                @click="datePop.open('installDateEnd')" placeholder="请选择结束时间" type="text">
                            </nut-input>
                        </div>
                    </nut-form-item>
                    <nut-form-item label="运行状态">
                        <nut-radio-group direction="horizontal" v-model="form.runningState">
                            <nut-radio label="">全部</nut-radio>
                            <nut-radio label="NORMAL">正常</nut-radio>
                            <nut-radio label="ABNORMAL">异常</nut-radio>
                            <nut-radio label="WARNING">预警</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>
                    <nut-form-item label="位置状态">
                        <nut-radio-group direction="horizontal" v-model="form.positionState">
                            <nut-radio label="">全部</nut-radio>
                            <nut-radio label="IN_POSITION">在位</nut-radio>
                            <nut-radio label="OUT_OF_POSITION">离位</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>
                    <nut-form-item label="抢救数据">
                        <nut-radio-group direction="horizontal" v-model="form.hasRescueData">
                            <nut-radio label="">全部</nut-radio>
                            <nut-radio label="true">有</nut-radio>
                            <nut-radio label="false">无</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>
                    <nut-form-item label="车载设备">
                        <nut-radio-group direction="horizontal" v-model="form.mobile">
                            <nut-radio label="">全部</nut-radio>
                            <nut-radio label="true">是</nut-radio>
                            <nut-radio label="false">否</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>

                    <nut-form-item>
                        <nut-cell>
                            <nut-row type="flex" align="center" justify="center">
                                <nut-col :span="11">
                                    <nut-button style="width: 100%;" type='info' @click="clear">重置</nut-button>
                                </nut-col>
                                <nut-col :offset="2" :span="11">
                                    <nut-button style="width: 100%;" type='primary' @click="submit"
                                        :loading="isLoading">查询</nut-button>
                                </nut-col>
                            </nut-row>
                        </nut-cell>
                    </nut-form-item>
                </nut-form>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="placePop.show">
                <nut-picker v-model="placePop.value" :columns="placePop.columns" @confirm="placePop.confirm"
                    @cancel="placePop.show = false">
                </nut-picker>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="brandPop.show">
                <nut-picker v-model="brandPop.value" :columns="brandPop.columns" @confirm="brandPop.confirm"
                    @cancel="brandPop.show = false">
                </nut-picker>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="datePop.show">
                <nut-date-picker @cancel="datePop.show = false" v-model="datePop.value" @confirm="datePop.confirm"
                    :is-show-chinese="true">
                </nut-date-picker>
            </nut-popup>
        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro';
import deviceList from './components/deviceList.vue';
import { Search2 } from '@nutui/icons-vue-taro';
import { useDeviceRegion } from '~/composables/use-device-region';
import { fetchDeviceBrands, fetchDevicePlaces } from '~/api/common';
const manage = useManageStore()
function toDeviceInstall() {
    manage.$reset();
    Taro.navigateTo({
        url: '/Manage/deviceInstall/index'
    })
}
const visible = ref(false)
let formObj = {
    keyword: '',
    runningState: '',
    positionState: '',
    hasRescueData: '',
    mobile: '',
    regionName: '',
    regionId: [] as number[],
    placeName: '',
    placeId: '',
    brandName: '',
    brandId: '',
    installDateBegin: '',
    installDateEnd: '',
}
let searchObj = {
    keyword: '',
    runningState: '',
    positionState: '',
    hasRescueData: '',
    mobile: '',
    placeId: '',
    brandId: '',
    installDateBegin: '',
    installDateEnd: '',
    provinceId: '',
    cityId: '',
    districtId: ''
}
let form = ref({ ...formObj })
let searchParams = ref({
    ...searchObj
})
const isLoading = ref(false)
const handleSearch = () => {
    searchParams.value.keyword = form.value.keyword
}
const { region } = useDeviceRegion((options) => {
    form.value.regionName = options.regionName;
    form.value.regionId = options.regionId;
})
const submit = () => {
    let { runningState, positionState, hasRescueData, mobile, placeId, brandId, installDateBegin, installDateEnd } = form.value
    let [provinceId, cityId, districtId] = form.value.regionId
    searchParams.value.provinceId = provinceId ? provinceId.toString() : '';
    searchParams.value.cityId = cityId ? cityId.toString() : '';
    searchParams.value.districtId = districtId ? districtId.toString() : '';
    searchParams.value.runningState = runningState;
    searchParams.value.positionState = positionState;
    searchParams.value.hasRescueData = hasRescueData;
    searchParams.value.mobile = mobile;
    searchParams.value.placeId = placeId
    searchParams.value.brandId = brandId;
    searchParams.value.installDateBegin = installDateBegin;
    searchParams.value.installDateEnd = installDateEnd;
    isLoading.value = true
    setTimeout(() => {
        visible.value = false
        isLoading.value = false
    }, 1000)
}
const clear = () => {
    form.value = {
        ...formObj
    }
}
//切换安装场所
const placePop = reactive({
    show: false,
    value: [''],
    columns: [] as { text: string, value: string }[],
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        form.value.placeName = selectedOptions.map((val: any) => val.text).join('')
        form.value.placeId = selectedOptions.map((val: any) => val.value).join('')
        placePop.show = false
    }
})
async function handleChangePlace() {
    let res = await fetchDevicePlaces()
    placePop.columns = res.map(i => {
        return {
            text: i.name,
            value: i.id.toString()
        }
    })
    placePop.columns.unshift({
        text: '全部',
        value: ''
    })
    placePop.value = [form.value.placeId]
    setTimeout(() => {
        placePop.show = true
    }, 500)
}
//切换品牌
const brandPop = reactive({
    show: false,
    value: [''],
    columns: [] as { text: string, value: string }[],
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        form.value.brandName = selectedOptions.map((val: any) => val.text).join('')
        form.value.brandId = selectedOptions.map((val: any) => val.value).join('')
        brandPop.show = false
    }
})
async function handleChangeBrand() {
    let res = await fetchDeviceBrands()
    brandPop.columns = res.map(i => {
        return {
            text: i.name,
            value: i.id.toString()
        }
    })
    brandPop.columns.unshift({
        text: '全部',
        value: ''
    })
    brandPop.value = [form.value.brandId]
    setTimeout(() => {
        brandPop.show = true
    }, 500)
}

//时间操作
const datePop = reactive({
    show: false,
    key: '',
    value: new Date(Date.now()),
    open: (key: string) => {
        datePop.key = key
        datePop.value = form[key] || new Date(Date.now())
        datePop.show = true
    },
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        let dateTime = selectedOptions.map((val: any) => val.value)
        let date = dateTime.slice(0, 3)
        let time = dateTime.slice(3, dateTime.length)
        form.value[datePop.key] = date.join('-') + ' ' + time.join(':')
        datePop.show = false
    }
})
</script>

<style lang="scss"></style>