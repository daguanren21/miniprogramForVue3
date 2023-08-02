<template>
    <div class="home">
        <div class="main bg-hex-fff flex-col">
            <div class="tab_wrap">
                <nut-row>
                    <nut-col @tap="changeTab(index)" v-for="(item, index) in tabList" :span="12" :key="'tab' + index">
                        <view class="tab" :class="{ active: index == tabIndex }">
                            <jx-icon :style="{ color: index === tabIndex ? '#f5222D' : '#9E9E9F' }" :size="26"
                                :value="item.icon"></jx-icon>
                            <text class="ft">{{ item.text }}</text>
                        </view>
                    </nut-col>
                </nut-row>
            </div>
            <div class="flex-1 overflow-hidden">
                <component :is='componentRef'></component>
            </div>
        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
</template>
<script setup lang="ts">
import courseList from './components/courseList/index.vue'
import knowLedgeList from './components/knowLedgeList/index.vue'
const componentRef = shallowRef(knowLedgeList)
const tabList = ref<{
    key: string,
    text: string,
    icon: string
}[]>([
    {
        key: 'knowLedgeList',
        icon: 'knowLedge',
        text: '急救知识库'
    },
    {
        key: 'courseList',
        icon: 'callHelp',
        text: '我要学急救'
    },
])
const tabIndex = ref<number>(0)
const changeTab = (index) => {
    tabIndex.value = index
    let tab = tabList.value[tabIndex.value].key
    componentRef.value = tab === 'knowLedgeList' ? knowLedgeList : courseList
}
</script>

<style lang="scss">
.form {
    .nut-dialog__content {
        margin: 0;
    }
}

.header {
    height: 60px;
    line-height: 50px;
    text-align: center;
    background: #fff;
    border-bottom: solid 1px #f4f4f4;
}

.x-scroll-view {
    background-color: #fff;
}

.manage_item {
    width: 90%;
    margin: 15px auto;
    padding: 30px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: rgb(242, 243, 248);
    border-radius: 30px;
}

.tab_wrap {
    display: flex;
    margin: 0 25px;
    margin-top: 30px;
    border-bottom: 2px solid #E5E8F2;

    .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: none;
        padding: 0 20px;

        &.active {

            border-bottom: 6px solid #ee0a24;

            .ft {
                color: #ee0a24;
            }

            .icon {
                color: #ee0a24;
            }
        }

        .ft {
            font-size: 32px;
            font-weight: bold;
            color: #9E9E9F;
            margin-top: 21px;
            margin-bottom: 25px;
        }

        .icon {
            color: #9E9E9F;
        }
    }
}
</style>