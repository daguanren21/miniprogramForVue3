export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/management/index',
    'pages/center/index',
  ],
  subPackages: [{
    root: 'Manage/',//运维管理
    pages: [
      'deviceInfo/index',//运维管理设备详情
      'deviceInstall/index',//设备新增或编辑
      'institutionSearch/index',//单位搜索（维保或配置单位）
    ]
  },{
    root: 'Operate/',//设备操作相关
    pages: [
      'repair/index',//设备报修
      'inspection/index',//设备巡检
      'maintainance/index',//设备维护
      'statusChange/index',//状态变更
      'relocation/index',//设备移机
      'useReport/index',//使用上报
    ]
  }],
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
      },
      {
        pagePath: 'pages/center/index',
        text: '个人中心'
      }
    ]
  },
  "requiredPrivateInfos": ["getLocation", "chooseLocation", "onLocationChange", "startLocationUpdate"]
})
