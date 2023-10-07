<template>
    <div class="h-full overflow-auto">
        <div class="w-full bg-hex-F2F2F2 flex-y-center justify-between h-64px">
            <div class="flex-y-center">
                <div class="ml-30px w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                <div class="ml-11px text-30px text-hex-333">120急救培训</div>
            </div>
            <div class="text-hex-797979 text-24px mr-29px" @click="goToList('FIRST_AID_120')" v-if="firstAidCount > 2">查看更多
            </div>
        </div>
        <div class="p-x-29px p-y-33px flex-y-center flex-col">
            <div v-if="firstAidList.length">
                <div class="bg-hex-fff rounded-20px  w-650px flex-y-center  mb-20px" @click="goToInfo(item.id)"
                    v-for="item in firstAidList " :key="item.id">
                    <div class="w-200px h-170px mr-16px">
                        <image :src="item.imagePath" class="wh-full"></image>
                    </div>
                    <div class="p-y-30px p-r-30px flex-1">
                        <div class="text-30px text-hex-333 mb-29px line-clamp-1 break-all">{{ item.name }} </div>
                        <div class="text-24px text-hex-3BD5AC mb-34px flex-y-center">
                            <jx-icon value="time" color="#3BD5AC" :size="14"></jx-icon>
                            <span class="ml-10px">{{ dateFilter(item.startTime, "YYYY-MM-DD") }}</span>
                        </div>
                        <div class="flex-y-center justify-between">
                            <div class="text-26px text-hex-525252 line-clamp-1 break-all flex-1">联系人：{{ item.userName }}
                            </div>
                            <div class="text-26px text-hex-409EFF flex-y-center"
                                @click.stop="makePhoneCall(item.phoneNumber)">
                                <jx-icon value="phone" color="#409EFF" :size="16"></jx-icon>
                                <span class="ml-5px">{{
                                    item.phoneNumber }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full flex-center" v-else>
                <nut-empty description="暂无120急救培训"></nut-empty>
            </div>
        </div>
        <div class="w-full bg-hex-F2F2F2 flex-y-center justify-between h-64px">
            <div class="flex-y-center">
                <div class="ml-30px w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                <div class="ml-11px text-30px text-hex-333">红十字会培训</div>
            </div>
            <div class="text-hex-797979 text-24px mr-29px" @click="goToList('RED_CROSS')" v-if="redCrossCount > 2">查看更多
            </div>
        </div>
        <div class="p-x-29px p-y-33px flex-y-center flex-col">
            <div v-if="redCrossList.length">
                <div class="bg-hex-fff rounded-20px  w-650px flex-y-center  mb-20px" @click="goToInfo(item.id)"
                    v-for="item in redCrossList" :key="item.id">
                    <div class="w-200px h-170px mr-16px">
                        <image :src="item.imagePath" class="wh-full"></image>
                    </div>
                    <div class="p-y-30px p-r-30px flex-1">
                        <div class="text-30px text-hex-333 mb-29px line-clamp-1 break-all">{{ item.name }} </div>
                        <div class="text-24px text-hex-3BD5AC mb-34px flex-y-center">
                            <jx-icon value="time" color="#3BD5AC" :size="14"></jx-icon>
                            <span class="ml-10px">{{ dateFilter(item.startTime, "YYYY-MM-DD") }}</span>
                        </div>
                        <div class="flex-y-center justify-between">
                            <div class="text-26px text-hex-525252 line-clamp-1 break-all flex-1">联系人：{{ item.userName }}
                            </div>
                            <div class="text-26px text-hex-409EFF flex-y-center"
                                @click.stop="makePhoneCall(item.phoneNumber)">
                                <jx-icon value="phone" color="#409EFF" :size="16"></jx-icon>
                                <span class="ml-5px">{{
                                    item.phoneNumber }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full flex-center" v-else>
                <nut-empty description="暂无红十字会培训"></nut-empty>
            </div>
        </div>

        <div class="w-full bg-hex-F2F2F2 flex-y-center  justify-between h-64px">
            <div class="flex-y-center">
                <div class="ml-30px w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                <div class="ml-11px text-30px text-hex-333">AHA认证培训</div>
            </div>
            <div class="text-hex-797979 text-24px mr-29px" @tap="goToList('AHA')" v-if="ahaCount > 2">查看更多</div>
        </div>
        <div class="p-x-29px p-y-33px flex-y-center flex-col">
            <div v-if="hahList.length">
                <div class="bg-hex-fff rounded-20px w-650px flex-y-center mb-20px" @click="goToInfo(item.id)"
                    v-for="item in hahList" :key="item.id">
                    <div class="w-200px h-170px mr-16px">
                        <image :src="item.imagePath" class="wh-full"></image>
                    </div>
                    <div class="p-y-30px p-r-30px flex-1">
                        <div class="text-30px text-hex-333 mb-29px line-clamp-1 break-all">{{ item.name }} </div>
                        <div class="text-24px text-hex-3BD5AC mb-34px flex-y-center">
                            <jx-icon value="time" color="#3BD5AC" :size="14"></jx-icon>
                            <span class="ml-10px">{{ dateFilter(item.startTime, "YYYY-MM-DD") }}</span>
                        </div>
                        <div class="flex-y-center justify-between">
                            <div class="text-26px text-hex-525252 line-clamp-1 break-all flex-1">联系人：{{ item.userName }}
                            </div>
                            <div class="text-26px text-hex-409EFF flex-y-center"
                                @click.stop="makePhoneCall(item.phoneNumber)">
                                <jx-icon value="phone" color="#409EFF" :size="16"></jx-icon>
                                <span class="ml-5px">{{
                                    item.phoneNumber }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full flex-center" v-else>
                <nut-empty description="暂无AHA认证培训"></nut-empty>
            </div>
        </div>

        <div class="w-full bg-hex-F2F2F2 flex-y-center justify-between h-64px">
            <div class="flex-y-center">
                <div class="ml-30px w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                <div class="ml-11px text-30px text-hex-333">其他课程</div>
            </div>
            <div class="text-hex-797979 text-24px mr-29px" @click="goToList('OTHER')" v-if="otherCount > 2">查看更多</div>
        </div>
        <div class="p-x-29px p-y-33px flex-y-center flex-col">
            <div v-if="otherList.length">
                <div class="bg-hex-fff rounded-20px  w-650px flex-y-center  mb-20px" @click="goToInfo(item.id)"
                    v-for="item in otherList" :key="item.id">
                    <div class="w-200px h-170px mr-16px">
                        <image :src="item.imagePath" class="wh-full"></image>
                    </div>
                    <div class="p-y-30px p-r-30px flex-1">
                        <div class="text-30px text-hex-333 mb-29px line-clamp-1 break-all">{{ item.name }} </div>
                        <div class="text-24px text-hex-3BD5AC mb-34px flex-y-center">
                            <jx-icon value="time" color="#3BD5AC" :size="14"></jx-icon>
                            <span class="ml-10px">{{ dateFilter(item.startTime, "YYYY-MM-DD") }}</span>
                        </div>
                        <div class="flex-y-center justify-between">
                            <div class="text-26px text-hex-525252 line-clamp-1 break-all flex-1">联系人：{{ item.userName }}
                            </div>
                            <div class="text-26px text-hex-409EFF flex-y-center"
                                @click.stop="makePhoneCall(item.phoneNumber)">
                                <jx-icon value="phone" color="#409EFF" :size="16"></jx-icon>
                                <span class="ml-5px">{{
                                    item.phoneNumber }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full flex-center" v-else>
                <nut-empty description="暂无其他课程"></nut-empty>
            </div>
        </div>
    </div>
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
let redCrossList = ref<Course[]>([])
let firstAidList = ref<Course[]>([])
let hahList = ref<Course[]>([])
let otherList = ref<Course[]>([])
let redCrossCount = ref<number>(0)
let firstAidCount = ref<number>(0)
let ahaCount = ref<number>(0)
let otherCount = ref<number>(0)
const getRedCrossList = async () => {
    searchParams.value.courseType = 'RED_CROSS'
    let { content, totalCount } = await fetchTrainingCourses(searchParams.value)
    redCrossList.value = content
    redCrossCount.value = totalCount
}
const getFirstAidList = async () => {
    searchParams.value.courseType = 'FIRST_AID_120'
    let { content, totalCount } = await fetchTrainingCourses(searchParams.value)
    firstAidList.value = content
    firstAidCount.value = totalCount
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
    getRedCrossList()
    getFirstAidList()
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
defineExpose({
    load: getRedCrossList
})
</script>

<style lang="scss"></style>