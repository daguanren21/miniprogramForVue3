<template>
    <div class="h-160rpx w-full jx-tabbar relative overflow-hidden">
        <!-- <nut-tabbar class="h-160rpx w-full jx-tabbar" @tab-switch="tabSwitch" v-model="activeTab">
            <nut-tabbar-item name="index" tab-title="首页">
                <template #icon>
                    <jx-icon value="tab-home" :style="{ color: activeTab === 'index' ? '#3367E9' : '#ACB6D0' }"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="management" tab-title="运维管理">
                <template #icon>
                    <jx-icon value="tab-manage"
                        :style="{ color: activeTab === 'management' ? '#3367E9' : '#ACB6D0' }"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="oneKeyForHelp" tab-title="一键呼救">
                <template #icon>
                    <jx-icon value="tab-rescue" color="#EC4A41" size="46"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="college" tab-title="急救课堂">
                <template #icon>
                    <jx-icon value="tab-college"
                        :style="{ color: activeTab === 'college' ? '#3367E9' : '#ACB6D0' }"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="center" tab-title="个人中心">
                <template #icon>
                    <jx-icon value="tab-person"
                        :style="{ color: activeTab === 'center' ? '#3367E9' : '#ACB6D0' }"></jx-icon>
                </template>
            </nut-tabbar-item>
        </nut-tabbar> -->
        <nut-row type="flex" class="mt-54px mb-20px h-full">
            <nut-col @click="tabSwitch('index', 0)">
                <div class="flex-col items-center">
                    <jx-icon value="tab-home" :style="{ color: activeTab === 'index' ? '#3367E9' : '#ACB6D0' }"
                        :size="22"></jx-icon>
                    <div class="text-24px text-hex-ACB6D0 mt-10px"
                        :style="{ color: activeTab === 'index' ? '#3367E9' : '#ACB6D0' }">首页</div>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('management', 1)">
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
                    <span class="bottom-16px  text-24px"  :style="{ color: activeTab === 'oneKeyForHelp' ? '#EC4A41' : '#ACB6D0' }" style="position: absolute;">一键呼救</span>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('college', 3)">
                <div class="flex-col items-center">
                    <jx-icon value="tab-college" :style="{ color: activeTab === 'college' ? '#3367E9' : '#ACB6D0' }"
                        :size="22"></jx-icon>
                    <div class="text-24px text-hex-ACB6D0 mt-10px"
                        :style="{ color: activeTab === 'college' ? '#3367E9' : '#ACB6D0' }">急救课堂</div>
                </div>
            </nut-col>
            <nut-col @click="tabSwitch('center', 4)">
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
const auth = useAuthStore()
const user = useAccountInfo()

const roleType = computed(() => user.accountInfo.roleType)
const activeTab = computed({
    get() {
        return auth.tabName
    },
    set(value) {
        auth.updateTabName(value)
        return true
    }
})

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
    background: url(../../assets/images/center/底部背景.png) no-repeat;
    background-size: 100% 100%;
}
</style>