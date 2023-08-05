<template>
    <div>
        <nut-tabbar @tab-switch="tabSwitch" v-model="activeTab" class="w-full">
            <nut-tabbar-item name="index" tab-title="首页">
                <template #icon>
                    <Home></Home>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="management" tab-title="运维管理" v-if="roleType && roleType !== 'WECHAT'">
                <template #icon>
                    <jx-icon value="tab-manage"
                        :style="{ color: activeTab === 'management' ? '#fa2c19' : '#000' }"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="oneKeyForHelp" tab-title="一键呼救" v-if="roleType">
                <template #icon>
                    <jx-icon value="help-rescue"
                        :style="{ color: activeTab === 'oneKeyForHelp' ? '#fa2c19' : '#000' }"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="college" tab-title="急救课堂">
                <template #icon>
                    <jx-icon value="tab-college" :style="{ color: activeTab === 'college' ? '#fa2c19' : '#000' }"></jx-icon>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="center" tab-title="个人中心">
                <template #icon>
                    <My></My>
                </template>
            </nut-tabbar-item>
        </nut-tabbar>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { My, Home } from '@nutui/icons-vue-taro';
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

function tabSwitch(item, index) {
    console.log(item, index);
    auth.updateTabName(item.name)
    Taro.switchTab({
        url: `/pages/${item.name}/index`
    })
}
</script>
