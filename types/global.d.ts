/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index.vue3'
}
declare namespace Filter {
  type PublicType = 'PUBLIC' | 'HALF' | 'NEVER' | 'BUSINESS_HOURS'
  type RunningState = 'UNKNOWN' | 'HALF' | 'ABNORMAL' | 'WARNING'
}
declare namespace Index {

  interface Suggestion {
    adcode: number
    address: string
    category: string
    city: string
    district: string
    id: string
    location: { lat: number, lng: number }
    province: string
    title: string
  }
  interface DeviceInfo {
    "id": number,
    "brandId": number,
    "address": string,
    "brandLogo": string,
    "brandName": string,
    "calDistance": number,
    "deployedAreaLatitude": number,
    "deployedAreaLongitude": number,
    "deployedImagePath": string,
    "distance": number,
    "duration": number,
    "publicTimeFrom": string,
    "publicTimeTo": string,
    "publicType": Filter.PublicType
    "runningState": Filter.RunningState,
    "serialNumber": string,
    "workDay": string
  }
}