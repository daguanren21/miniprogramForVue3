<template>
    <view class="course_list overflow-auto" style="line-height:30px">
        <view class="header">
            AHA授证培训
            <text @tap="goToList('AHA')" style="color: #ff6216" v-if="ahaCount > 2">更多</text>
        </view>
        <view class="content">
            <nut-row justify="between" v-if="hahList.length">
                <nut-col @tap="goToInfo(item.id)" v-for="item in hahList" :key="item.id" class="item" :span="12">
                    <view class="image">
                        <image style="width: 100%; height: 100%" :src="item.imagePath"></image>
                    </view>
                    <view class="title"> {{ item.name }} </view>
                    <view class="time">
                        {{ dateFilter(item.startTime, "YYYY-MM-DD") }}
                    </view>
                    <view class="phone" @tap.stop="makePhoneCall(item.phoneNumber)">
                        <text class="name ft">{{ item.userName }}</text>
                        <jx-icon style="color:#f5222D" class="icon ml-20px" value="course-phone" :size="20"></jx-icon>
                        <text class="ft" style="color: #1890ff">{{ item.phoneNumber }}</text>
                    </view>
                </nut-col>
            </nut-row>
            <view class="noData" v-else>
                <nut-empty description="暂无AHA培训课程"></nut-empty>
            </view>
        </view>
        <view class="header">
            企业客户团课
            <text @tap="goToList('BUSINESS')" v-if="busCount > 2" style="color: #ff6216">更多</text>
        </view>
        <view class="content">
            <nut-row justify="between" v-if="busList.length">
                <nut-col @tap="goToInfo(item.id)" v-for="item in busList" :key="item.id" class="item" :span="12">
                    <view class="image">
                        <image style="width: 100%; height: 100%" :src="item.imagePath"></image>
                    </view>
                    <view class="title"> {{ item.name }} </view>
                    <view class="time">
                        {{ dateFilter(item.startTime, "YYYY-MM-DD HH:mm") }}
                    </view>
                    <view class="phone" @tap.stop="makePhoneCall(item.phoneNumber)">
                        <text class="name ft">{{ item.userName }}</text>
                        <jx-icon style="color:#f5222D" class="icon ml-20px" value="course-phone" :size="20"></jx-icon>
                        <text class="ft" style="color: #1890ff">{{ item.phoneNumber }}</text>
                    </view>
                </nut-col>
            </nut-row>
            <view class="noData" v-else>
                <nut-empty description="暂无企业客户课程"></nut-empty>
            </view>
        </view>
        <view class="header">
            其他课程
            <text @tap="goToList('OTHER')" v-if="otherCount > 2" style="color: #ff6216">更多</text>
        </view>
        <view class="content">
            <nut-row justify="between" v-if="otherList.length">
                <nut-col @tap="goToInfo(item.id)" v-for="item in otherList" :key="item.id" class="item" :span="12">
                    <view class="image">
                        <image style="width: 100%; height: 100%" :src="item.imagePath"></image>
                    </view>
                    <view class="title"> {{ item.name }} </view>
                    <view class="time">
                        {{ dateFilter(item.startTime, "YYYY-MM-DD HH:mm") }}
                    </view>
                    <view class="phone" @tap.stop="makePhoneCall(item.phoneNumber)">
                        <text class="name ft">{{ item.userName }}</text>
                        <jx-icon style="color:#f5222D" class="icon ml-20px" value="course-phone" :size="20"></jx-icon>
                        <text class="ft" style="color: #1890ff">{{ item.phoneNumber }}</text>
                    </view>
                </nut-col>
            </nut-row>
            <view class="noData" v-else>
                <nut-empty description="暂无其他培训课程"></nut-empty>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { Course, fetchTrainingCourses } from '~/api/user';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { dateFilter } from '~/filter'
let { makePhoneCall } = useQQMapSdk()
let searchParams = ref<any>({
    courseType: '',
    page: 1,
    size: 2
})
let busList = ref<Course[]>([])
let hahList = ref<Course[]>([])
let otherList = ref<Course[]>([])
let busCount = ref<number>(0)
let ahaCount = ref<number>(0)
let otherCount = ref<number>(0)
const getBusList = async () => {
    searchParams.value.courseType = 'BUSINESS'
    let { content, totalCount } = await fetchTrainingCourses(searchParams.value)
    busList.value = content
    busCount.value = totalCount
}
const getHahList = async () => {
    searchParams.value.courseType = 'AHA'
    let { content, totalCount } = await fetchTrainingCourses(searchParams.value)
    hahList.value = content
    ahaCount.value = totalCount
}
const getOtherList = async () => {
    searchParams.value.courseType = 'OTHER'
    let { content, totalCount } = await fetchTrainingCourses(searchParams.value)
    otherList.value = content
    otherCount.value = totalCount
}
onMounted(() => {
    getBusList()
    getHahList()
    getOtherList()

})
const goToList = (type: string) => {
    Taro.navigateTo({
        url: `/College/courseList/index?courseType=${type}`
    })
}
const goToInfo = (id: number) => {
    Taro.navigateTo({
        url: `/College/courseInfo/index?id=${id}`
    })
}
</script>

<style lang="scss">
.course_list {
    height: 100%;
    padding: 0 30px;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 25px 0;
        font-size: 32px;
        font-weight: bold;
        color: #3e3a39;
    }

    .content {
        padding-bottom: 30px;
        border-bottom: 2px solid #e5e8f2;
        min-height: 260px;
        width: 100%;

        .item {
            padding: 0 5px;

            .image {
                width: 100%;
                height: 180px;
                background: #e5e8f2;
                border-radius: 15px;
            }

            .title {
                font-size: 30px;
                font-weight: 400;
                color: #727171;
                margin-top: 17px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .time {
                font-size: 26px;
                font-weight: 400;
                color: #727171;
                margin-top: 20px;
            }

            .phone {
                margin-top: 20rpx;
                display: flex;
                align-items: center;

                .icon {
                    color: #ff6216;
                }

                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .ft {
                    font-size: 26px;
                    font-weight: 400;
                    color: #727171;
                }
            }
        }
    }
}
</style>