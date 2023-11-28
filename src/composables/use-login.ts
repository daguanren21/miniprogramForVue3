import Taro, { getCurrentInstance } from "@tarojs/taro";
import { fetchDeviceInfoByAssetNumber } from "~/api/device";
import { fetchWxLogin } from "~/api/login";
import { parseDeviceSnFromUrl } from "~/utils";
export const useLogin = () => {
    //检查系统是否需要更新
    function checkProgramNeedUpdate() {
        if (Taro.canIUse('getUpdateManager')) {
            const updateManager = Taro.getUpdateManager()
            function _updateReady() {
                Taro.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            }
            function _checkForUpdate(res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(_updateReady)
                }
            }
            updateManager.onCheckForUpdate(_checkForUpdate)
            updateManager.onUpdateFailed(function () {
                Taro.showModal({
                    title: '发现新版本',
                    content: '请删除当前小程序，重新搜索打开...',
                })
            })
        }
    }
    //检查系统是否开启定位
    function checkOpenLocation() {
        return new Promise((resolve, reject) => {
            Taro.getSetting({
                success: (res) => {
                    let authSetting = res.authSetting
                    if (authSetting['scope.userLocation']) {
                        // 已授权
                        resolve(res)
                    } else {
                        Taro.showModal({
                            title: '授权提示',
                            content: '您未开启地理位置授权',
                            success: res => {
                                if (res.confirm) {
                                    Taro.openSetting({
                                        success: async (res) => {
                                            let authSetting = res.authSetting
                                            if (authSetting['scope.userLocation']) {
                                                // 已授权
                                                resolve(res)
                                            } else {
                                                reject('未开启地理位置失败！')
                                            }
                                        },
                                        fail: (error) => {
                                            reject(error)
                                        }
                                    })
                                }
                            }

                        })
                    }
                },
                fail: (error) => {
                    reject(error)
                }
            })
        })

    }
    async function wxLogin() {
        //检查更新
        checkProgramNeedUpdate()
        //存储权限数据
        const auth = useAuthStore()
        //获取用户详情
        const user = useAccountInfo()

        //获取微信登录code
        const wxLoginRes = await Taro.login()
        //获取小程序的appId
        const accountInfo = Taro.getAccountInfoSync()
        debugger
        //获取后台用户的token
        try {
            Taro.showLoading({
                title: '加载中',
                mask: true
            })
            let serverLoginRes = await fetchWxLogin({
                appId: accountInfo.miniProgram.appId,
                code: wxLoginRes.code
            })
            auth.$state.authInfo = serverLoginRes
            if (auth.authInfo.id_token) {
                await user.getAccountInfo()
            }
            setTimeout(async () => {
                Taro.hideLoading()
                let options = getCurrentInstance().router?.params
                if (options && options.q) {
                    const decodedUri = decodeURIComponent(options.q as string);
                    //解析获取资产编号
                    let assetNumber = parseDeviceSnFromUrl(decodedUri)
                    if (!assetNumber) {
                        Taro.showToast({
                            icon: 'none',
                            title: '错误的二维码信息'
                        })
                    } else {
                        try {
                            let res = await fetchDeviceInfoByAssetNumber(assetNumber)
                            Taro.navigateTo({
                                url: '/Manage/deviceInfo/index?id=' + res.id
                            })
                        } catch (error) {
                            Taro.showToast({
                                icon: 'none',
                                title: error
                            })
                        }

                    }
                }
            }, 500)
            return Promise.resolve('登录成功！')
        } catch (error) {
            console.warn(error)
            return Promise.reject(error)
        }
    }
    return {
        checkProgramNeedUpdate,
        wxLogin,
        checkOpenLocation
    }

}