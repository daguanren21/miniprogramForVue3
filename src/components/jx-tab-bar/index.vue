<template>
    <div class="h-160rpx w-full jx-tabbar relative overflow-hidden">
        <nut-row type="flex" class="h-full flex " style="align-items: flex-end;">
            <nut-col @click="tabSwitch('index', 0)" class="mb-20px">
                <div class="flex-col items-center">
                    <jx-icon value="tab-home" :style="{ color: activeTab === 'index' ? '#3367E9' : '#ACB6D0' }"
                        :size="22"></jx-icon>
                    <div class="text-24px text-hex-ACB6D0 mt-10px"
                        :style="{ color: activeTab === 'index' ? '#3367E9' : '#ACB6D0' }">首页</div>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('management', 1)" class="mb-20px">
                <div class="flex-col items-center">
                    <jx-icon value="tab-manage" :style="{ color: activeTab === 'management' ? '#3367E9' : '#ACB6D0' }"
                        :size="22"></jx-icon>
                    <div class="text-24px text-hex-ACB6D0 mt-10px"
                        :style="{ color: activeTab === 'management' ? '#3367E9' : '#ACB6D0' }">运维管理</div>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('oneKeyForHelp', 2)">
                <div class="flex-col items-center">
                    <jx-icon class="top-16px" style="position: absolute;" value="tab-rescue" color="#EC4A41"
                        :size="46"></jx-icon>
                    <span class="bottom-20px  text-24px"
                        :style="{ color: activeTab === 'oneKeyForHelp' ? '#EC4A41' : '#ACB6D0' }"
                        style="position: absolute;">一键呼救</span>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('college', 3)" class="mb-20px">
                <div class="flex-col items-center">
                    <jx-icon value="tab-college" :style="{ color: activeTab === 'college' ? '#3367E9' : '#ACB6D0' }"
                        :size="22"></jx-icon>
                    <div class="text-24px text-hex-ACB6D0 mt-10px"
                        :style="{ color: activeTab === 'college' ? '#3367E9' : '#ACB6D0' }">急救课堂</div>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('center', 4)" class="mb-20px">
                <div class="flex-col items-center">
                    <jx-icon value="tab-person" :style="{ color: activeTab === 'center' ? '#3367E9' : '#ACB6D0' }"
                        :size="22"></jx-icon>
                    <div class="text-24px text-hex-ACB6D0 mt-10px"
                        :style="{ color: activeTab === 'center' ? '#3367E9' : '#ACB6D0' }">个人中心</div>
                </div>
            </nut-col>
        </nut-row>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
defineOptions({
    name: 'JxTabBar'
})
// const tabList = ref([{
//     name: '首页',
//     value: 'index',
// }, {
//     name: '运维管理',
//     value: 'management',
// }, {
//     name: '一键呼救',
//     value: 'oneKeyForHelp',
// }, {
//     name: '急救课堂',
//     value: 'college',
// }, {
//     name: '个人中心',
//     value: 'center',
// }])
const auth = useAuthStore()
const user = useAccountInfo()   
const roleType = computed(() => user.accountInfo.roleType)
const activeTab = computed(() => auth.tabName)
console.log(activeTab.value)
function tabSwitch(name, index) {
    console.log(index)
    if (name === 'management' && (!roleType.value || roleType.value === 'WECHAT')) {
        Taro.showToast({
            icon: 'none',
            title: '暂无访问权限',
            duration: 4000
        })
        return
    }
    if (auth.authInfo.id_token && !user.accountInfo.activated && (name === 'management' || name === 'center')) {
        Taro.showToast({
            icon: 'none',
            title: '用户被禁用，请联系管理员激活',
            duration: 4000
        })
        return
    }
    if (name === 'oneKeyForHelp' && !roleType.value) {
        Taro.showToast({
            icon: 'none',
            title: '暂无访问权限',
            duration: 4000
        })
        return
    }
    auth.updateTabName(name)
    Taro.switchTab({
        url: `/pages/${name}/index`
    })
}
</script>

<style lang="scss">
.jx-tabbar {
    display: flex;
    align-items: flex-end !important;
    background: url(../../assets/images/center/底部背景.png) no-repeat;
    background-size: 100% 100%;
}
</style>