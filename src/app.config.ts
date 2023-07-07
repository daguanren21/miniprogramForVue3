export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/management/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#000000',
    selectedColor: '#DC143C',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '设备分布'
      },
      {
        pagePath: 'pages/management/index',
        text: '运维管理'
      }
    ]
  },
  "requiredPrivateInfos": ["getLocation", "chooseLocation", "onLocationChange", "startLocationUpdate"]
})
