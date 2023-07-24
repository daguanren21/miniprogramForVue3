import Taro from "@tarojs/taro"
import { fetchDeviceCoordinate, fetchDistrictAreas } from "~/api/common"

export const useDeviceRegion = (cb: (form: {
    regionName: string,
    regionId: number[],
    address: string,
    deployedLatitude: number,
    deployedLongitude: number
}) => void) => {
    const lastArea = ref<any>()
    //定位（拉起微信自带页面）
    async function chooseLocation(option: { latitude?: number, longitude?: number } = {}) {
        try {
            let locRes = await Taro.chooseLocation(option)
            if (!locRes) {
                // return Promise.reject('当前地址无法解析')
                Taro.showToast({
                    icon: 'none',
                    title: '当前地址无法解析'
                })
                return
            }
            let { province, city, district, street, address } = await fetchDeviceCoordinate({
                latitude: locRes.latitude,
                longitude: locRes.longitude
            })
            let _name = [province.cnName, city.cnName, district.cnName, street.cnName].filter(v => v).join('/')
            let _id = [province.id, city.id, district.id, street.id].filter(v => v)
            // return Promise.resolve({
            //     regionName: _name,
            //     regionId: _id,
            //     address: locRes.address || address,
            //     deployedLatitude: locRes.latitude,
            //     deployedLongitude: locRes.longitude
            // })
            cb({
                regionName: _name,
                regionId: _id,
                address: locRes.address || address,
                deployedLatitude: locRes.latitude,
                deployedLongitude: locRes.longitude
            })
            return
        } catch (error) {
            Taro.showToast({
                icon: 'none',
                title: '当前地址无法解析'
            })
            return
        }
    }
    //获取区域列表
    async function getAreas(value: number | string = '') {
        let res = await fetchDistrictAreas(({ parentId: value }))
        let _areas = res.map(v => {
            return {
                text: v.cnName,
                value: v.id,
                ...v
            }
        })
        return _areas
    }
    const region = reactive({
        visible: false,
        lazyLoad: async (node: any, resolve: (children: any) => void) => {
            if (node.root) {
                resolve(getAreas());
            } else {
                if (node.haveChildren) {
                    resolve(getAreas(node.value))
                } else {
                    resolve([])
                }
            }
        },
        change(...args: number[]) {
            console.log('change', ...args);
        },
        pathChange(...args: any) {
            let _args = args[0].filter(v => v)
            // let regionId = _args.map(v => v.value)
            // let regionName = _args.map(v => v.text).join('/')
            let item = _args[_args.length - 1]
            lastArea.value = item
        },
        closeRegion() {
            if (!lastArea.value) {
                region.visible = false
                return
            }
            chooseLocation({
                latitude: lastArea.value.lat,
                longitude: lastArea.value.lng,
            })
        }
    })
    return {
        chooseLocation,
        region,
        lastArea
    }
}