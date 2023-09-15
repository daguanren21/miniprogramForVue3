<template>
    <div class="home">
        <div class="main bg-hex-F7F7F7 flex-col">
            <div class="flex-col overflow-hidden">
                <div class="flex-center p-x-29px p-y-25px mb-30px">
                    <div :class="{ 'ml-43px': index === 1 }" v-for="item, index in tabList" :key="item.key"
                        @click="changeTab(index)">
                        <image class="w-325px h-132px" :src="index === tabIndex ? item.icon_active : item.icon">
                        </image>
                    </div>
                </div>
                <div class="flex-1 overflow-hidden">
                    <component :is='componentTab'></component>
                </div>
            </div>

        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
</template>
<script setup lang="ts">
import courseList from './components/courseList/index.vue'
import knowLedgeList from './components/knowLedgeList/index.vue'
import knowledge_active from '~/assets/images/volunteer/knowledge_active.png'
import knowledge from '~/assets/images/volunteer/knowledge.png'
import rescue from '~/assets/images/volunteer/rescue.png'
import rescue_active from '~/assets/images/volunteer/rescue_active.png'
const componentTab = shallowRef(knowLedgeList)
const tabList = ref<{
    key: string,
    text: string,
    icon_active: string,
    icon: string,
}[]>([
    {
        key: 'knowLedgeList',
        icon: knowledge,
        icon_active: knowledge_active,
        text: '急救知识库'
    },
    {
        key: 'courseList',
        icon: rescue,
        icon_active: rescue_active,
        text: '我要学急救'
    },
])
const tabIndex = ref<number>(0)

const changeTab = (index) => {
    tabIndex.value = index
    let tab = tabList.value[tabIndex.value].key
    componentTab.value = tab === 'knowLedgeList' ? knowLedgeList : courseList
}

</script>

<style lang="scss"></style>