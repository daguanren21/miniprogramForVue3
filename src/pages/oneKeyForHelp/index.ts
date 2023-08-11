import { useNotify } from './../../composables/use-notify';
import Taro from "@tarojs/taro"
import { ReceivedInfo, RescueInfo, VolunteerRecord, fetchLocationDistance, fetchVolunteerDrill, fetchVolunteerRescueInfo, saveAgreeToHelp, saveDrillVolunteer, saveRefuseToHelp, saveSwitchModel } from "~/api/user"
import { useMapLocation } from '~/composables/use-map-location';
import callForHelpIcon from '~/assets/images/icon-callforHelper.png'
import volunteerAEDActiveIcon from '~/assets/images/icon-volunteer-aed-active.png'
import volunteerAEDIcon from '~/assets/images/icon-volunteer-aed.png'
import volunteerCprActiveIcon from '~/assets/images/icon-volunteer-cpr-active.png'
import volunteerCprIcon from '~/assets/images/icon-volunteer-cpr.png'
import normalImage from '~/assets/images/map_jx.png'
const DEVICE_MARKERID_PREFIX = "device"
const RESUCE_MARKERID_PREFIX = "rescue"
const RESPONSE_INFO_MARKERID_PREFIX = "response"
import normalSelectImage from '~/assets/images/jx_select.png'
import { fetchLatelyDevices, fetchRegionDeviceInfo } from '~/api/device';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
export function useSwitchModel() {
    const { notify, state } = useNotify('danger')
    let { getNewLocation } = useMapLocation()
    const dynamicRefForm = ref<any>(null);
    //添加演练人员
    const dynamicForm = reactive({
        show: false,
        phoneList: [{
            tel: ''
        }, {
            tel: ''
        }],
        confirm: async () => {
            dynamicRefForm.value.validate().then(async ({ valid, errors }: any) => {
                if (valid) {
                    try {
                        let res = await getNewLocation()
                        await saveDrillVolunteer({
                            latestObtainedLatitude: res.lat,
                            latestObtainedLongitude: res.lng,
                            phoneList: dynamicForm.phoneList.map(v => v.tel)
                        })
                        Taro.showToast({
                            icon: 'success',
                            title: '保存成功！'
                        })
                        dynamicForm.show = false
                    } catch (error) {
                        Taro.showToast({
                            icon: 'none',
                            title: error
                        })
                    }
                } else {
                    console.log(errors[0].message);
                    console.log('error submit!!', errors);
                }
            });


        },
        methods: {
            add() {
                if (dynamicForm.phoneList.length >= 4) {
                    notify('演练人员不得超过四人')
                    return
                }
                dynamicForm.phoneList.push({
                    tel: ''
                })
            },
            remove() {
                if (dynamicForm.phoneList.length <= 2) {
                    notify('演练人员不得少于两人')
                    return
                }
                dynamicForm.phoneList.splice(dynamicForm.phoneList.length - 1, 1);
            }
        }

    })
    //模式切换
    let rescueType = ref<Filter.RescueType>('EMERGENT')
    const model = reactive({
        show: false,
        value: ['EMERGENT'],
        columns: [{
            text: '正常模式',
            value: 'EMERGENT'
        }, {
            text: '演练模式',
            value: 'DRILL'
        }],
        open: () => {
            model.show = true
        },
        confirm: async ({ selectedValue, selectedOptions }) => {
            console.log(selectedValue)
            model.value = selectedOptions.map((val: any) => val.value)
            rescueType.value = selectedOptions.map((val: any) => val.value).join('');
            //演练模式时查询演练人员
            if (rescueType.value === 'DRILL') {
                let res = await fetchVolunteerDrill()
                dynamicForm.show = true
                if (res.length) {
                    dynamicForm.phoneList = res.map(v => {
                        return {
                            tel: v
                        }
                    })
                }
            }
            model.show = false
        },

    })
    // TODO remove
    const switchModel = async () => {
        try {
            await saveSwitchModel()
            Taro.showToast({
                icon: 'success',
                title: '模式切换成功！'
            })
        } catch (error) {
            Taro.showToast({
                icon: 'none',
                title: error
            })
        }

    }

    return {
        switchModel,
        model,
        rescueType,
        dynamicForm,
        dynamicRefForm,
        state
    }
}


export function useMap(lat: Ref<number>, lng: Ref<number>) {
    const { openLocation } = useQQMapSdk()
    const mapCtx = Taro.createMapContext('helpMap')
    let volunteer = ref({
        aedAgreeCount: 0,
        agreeCount: 0,
        allVolunteerCount: 2,
        cprAgreeCount: 0,
        cprReceiverCount: 1,
        fetchAedReceiverCount: 1
    } as RescueInfo)
    const markers = ref<{
        id: number,
        markerType: string,
        latitude: number,
        longitude: number,
        iconPath: string
        width: number,
        height: number,
    }[]>([])
    const scale = ref(18)
    let recordId = ref(0)
    const volunteerRescueModal = reactive({
        visible: false,
        responseTaskType: '' as Filter.RescueResponseTaskType,
        responseInfoId: 0,
        confirm: async () => {
            try {
                await saveAgreeToHelp({
                    responseInfoId: volunteerRescueModal.responseInfoId
                })
                Taro.showToast({
                    icon: 'success',
                    title: '同意救助'
                })
                setTimeout(() => {
                    getRescueInfo()
                    volunteerRescueModal.visible = false
                }, 500)
            } catch (error) {
                Taro.showToast({
                    icon: 'none',
                    title: error
                })
            }

        },
        cancel: async () => {
            try {
                await saveRefuseToHelp({
                    responseInfoId: volunteerRescueModal.responseInfoId
                })
                Taro.showToast({
                    icon: 'success',
                    title: '拒绝救助'
                })
                setTimeout(() => {
                    getRescueInfo()
                    volunteerRescueModal.visible = false
                }, 500)
            } catch (error) {
                Taro.showToast({
                    icon: 'none',
                    title: error
                })
            }
        }
    })
    // 去除重复数据
    const unique = (markers) => {
        let arr = [...markers, ...toRaw(markers.value)]
        let map = new Map();
        for (let item of arr) {
            let name = item.id + '_' + item.markerType
            if (!map.has(name)) {
                map.set(name, item)
            }
        }
        markers.value = [...map.values()]
    }
    const getRescueInfo = async () => {
        // Taro.showLoading({
        //     title: "数据加载中",
        //     mask: true
        // })
        let res = await fetchVolunteerRescueInfo()
        volunteer.value = { ...volunteer.value, ...res }
        //判断是志愿者还是呼救人
        if (res.receivedInfo) {
            //打开任务弹窗
            volunteerRescueModal.responseTaskType = res.receivedInfo.rescueResponseTaskType
            volunteerRescueModal.responseInfoId = res.receivedInfo.id
            volunteerRescueModal.visible = res.receivedInfo.rescueResponseState === 'UNHANDLED'
        }

        if (!res.record) {
            recordId.value = 0
        } else {
            //地图渲染呼救人信息
            recordId.value = res.record.id
            renderCallForHelp(res.record)
        }
        if (res.responseInfos && res.responseInfos.length) {
            //地图渲染志愿者信息
            renderVolunteer(res.responseInfos)
        }
        // setTimeout(() => {
        //     Taro.hideLoading()
        // }, 1000)
        return Promise.resolve(res)

    }
    const renderCallForHelp = (record: VolunteerRecord) => {
        unique([{
            id: record.id,
            markerType: RESUCE_MARKERID_PREFIX,
            latitude: record.latitude,
            longitude: record.longitude,
            iconPath: callForHelpIcon,
            width: 40,
            height: 60
        }])

    }
    const renderVolunteer = (responseInfos: ReceivedInfo[]) => {

        unique(responseInfos.map(v => {
            let iconPath = ''
            if (v.rescueResponseTaskType == 'FETCH_AED') {
                iconPath = volunteerAEDIcon
            } else {
                iconPath = volunteerCprIcon
            }

            if (v.rescueResponseState == 'ACCEPTED') {
                if (v.rescueResponseTaskType == 'FETCH_AED') {
                    iconPath = volunteerAEDActiveIcon
                } else {
                    iconPath = volunteerCprActiveIcon
                }
            }
            return {
                id: v.id,
                markerType: RESPONSE_INFO_MARKERID_PREFIX,
                latitude: v.receiverLatitude,
                longitude: v.receiverLongitude,
                iconPath: iconPath,
                width: 39,
                height: 39
            }
        }))
    }
    const devices = ref<Index.DeviceInfo[]>([])
    const deviceModal = reactive({
        visible: false,
        deviceSelectId: 0,
        deviceInfo: {} as Index.DeviceInfo
    })
    const getNearbyDevices = async (distance: number) => {
        if (recordId.value) {
            let res = await fetchLatelyDevices({
                distance,
                latFrom: lat.value,
                lngFrom: lng.value
            })
            devices.value = res
            renderDeviceMarkers()
        }
        return Promise.resolve(true)
    }
    const renderDeviceMarkers = () => {
        let deviceMarkers = devices.value.map(device => {
            let isSelect = device.id === deviceModal.deviceSelectId
            return {
                id: device.id,
                markerType: DEVICE_MARKERID_PREFIX,
                deviceId: device.id,
                latitude: device.deployedAreaLatitude,
                longitude: device.deployedAreaLongitude,
                iconPath: isSelect ? normalSelectImage : normalImage,
                width: isSelect ? 55 : 50,
                height: isSelect ? 55 : 50
            }
        })
        //数据去重
        let arr = [...deviceMarkers, ...toRaw(markers.value)]
        let map = new Map();
        for (let item of arr) {
            let name = item.id + '_' + item.markerType
            if (!map.has(name)) {
                map.set(name, item)
            }
        }
        markers.value = [...map.values()]
        console.log(markers.value)
    }
    const rescueDistance = ref(0)
    const rescueModal = reactive({
        show: false,
        confrim: async () => {
            let { address, latitude, longitude } = volunteer.value.record
            try {
                await openLocation(latitude, longitude, address)
            } catch (error) {
                Taro.showToast({
                    title: error,
                    icon: 'none'
                })
            }
        }
    })
    const selectedResponseInfo = ref<Pick<ReceivedInfo, 'receiverName' | 'receiverPhone' | 'rescueResponseState' | 'rescueResponseTaskType'>>({
        receiverName: '',
        receiverPhone: '',
        rescueResponseState: 'UNHANDLED',
        rescueResponseTaskType: 'FETCH_AED'
    })
    const responseModal = reactive({
        show: false,
    })

    const handleDeviceInfoClose = () => {
        deviceModal.visible = false;
        deviceModal.deviceSelectId = 0
        renderDeviceMarkers()
    }
    const markertap = async (e: { detail: { markerId: number } }) => {
        let id = e.detail.markerId
        let { markerType } = markers.value.find(v => v.id == id) || { markerType: '' }
        if (markerType) {
            //呼救人信息弹窗展示
            if (markerType === RESUCE_MARKERID_PREFIX) {
                rescueDistance.value = await fetchLocationDistance({
                    latFrom: lat.value,
                    lngFrom: lng.value,
                    latTo: volunteer.value.record.latitude,
                    lngTo: volunteer.value.record.longitude
                })
                rescueModal.show = true
            }
            //志愿者信息弹窗展示
            if (markerType === RESPONSE_INFO_MARKERID_PREFIX) {
                let selectedMarker = volunteer.value.responseInfos!.find(v => v.id === id)
                if (!selectedMarker) {
                    console.log("selectedMarker is not valid")
                    return
                }
                selectedResponseInfo.value.receiverName = selectedMarker.receiverName
                selectedResponseInfo.value.receiverPhone = selectedMarker.receiverPhone
                selectedResponseInfo.value.rescueResponseState = selectedMarker.rescueResponseState
                selectedResponseInfo.value.rescueResponseTaskType = selectedMarker.rescueResponseTaskType
                responseModal.show = true
            }
            //设备弹窗信息展示
            if (markerType === DEVICE_MARKERID_PREFIX) {
                deviceModal.deviceSelectId = id
                renderDeviceMarkers()
                let res = await fetchRegionDeviceInfo({
                    deviceId: id,
                    latFrom: lat.value,
                    lngFrom: lng.value
                })
                deviceModal.deviceInfo = res
                deviceModal.visible = true
            }
        }
    }
    return {
        mapCtx,
        scale,
        recordId,
        getRescueInfo,
        markers,
        markertap,
        volunteer,
        rescueModal,
        rescueDistance,
        selectedResponseInfo,
        responseModal,
        getNearbyDevices,
        handleDeviceInfoClose,
        deviceModal,
        volunteerRescueModal
    }
}
