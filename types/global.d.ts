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
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare namespace Filter {
  /** @description 开放类型 */
  type PublicType = 'PUBLIC' | 'HALF' | 'NEVER' | 'BUSINESS_HOURS'
  /** @description 运行状态 OR 电极片状态 */
  type RunningState = 'UNKNOWN' | 'NORMAL' | 'ABNORMAL' | 'WARNING'
  /** @description 质保状态 */
  type QualityAssuranceState = 'UNKNOWN' | 'IN' | 'OUT'
  /** @description 位置状态 */
  type PositionState = 'UNKNOWN' | 'OUT_OF_POSITION' | 'IN_POSITION'
  /** @description 网络状态 */
  type DeviceNetworkState = 'UNKNOWN' | 'ONLINE' | 'OFFLINE' | 'UNSTABLE'
  /** @description 电池状态 */
  type BatteryState = 'UNKNOWN' | 'NORMAL' | 'POWER_LOW' | 'POWER_RUN_OUT'
  /** @description 培训课程类型 */
  type CourseType = 'BUSINESS' | 'AHA' | 'OTHER'
  /** @description 证书状态类型 */
  type CertificateState = 'EXPIRED' | 'UNKNOWN' | 'VALID'
  /** @description 审核状态 */
  type CheckState = 'UNKNOWN' | 'RUNNING' | 'REJECT' | 'APPROVE'
}
declare namespace Index {
  type ObjLimit1<T, K extends keyof T> = {
    [key in K]?: T[key]
  }

  type ObjLimit2<T, K extends keyof T> = {
    [key in Exclude<keyof T, K>]: T[key]
  }

  // 两种类型 交叉
  type PartialLimit<T, K extends keyof T> = ObjLimit1<T, K> & ObjLimit2<T, K>
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
    id: number,
    brandId: number,
    address: string,
    brandLogo: string,
    brandName: string,
    calDistance: number,
    deployedAreaLatitude: number,
    deployedAreaLongitude: number,
    deployedImagePath: string,
    distance: number,
    duration: number,
    publicTimeFrom: string,
    publicTimeTo: string,
    publicType: Filter.PublicType
    runningState: Filter.RunningState,
    serialNumber: string,
    workDay: string
  }
}

declare namespace Manage {
  /**
   * 页码配置
   */
  interface Page {
    page: number;
    size: number;
  }
  /**
  * @description 运维管理 查询字段
  */
  interface DeviceSearch {
    runningState: Filter.RunningState;
    keyword: string;
    brandId: number;
    placeId: number;
    positionState: Filter.PositionState;
    installDateBegin: string;
    installDateEnd: string;
    hasRescueData: boolean;
    mobile: boolean;
    provinceId: number;
    cityId: number;
    districtId: number;
    streetId: number;
  }
  /**
   * @description 运维管理 设备字段
   */
  interface DeviceList {
    id: number;
    serialNumber: string;
    runningState: Filter.RunningState;
    qualityAssuranceState: Filter.QualityAssuranceState;
    positionState: Filter.PositionState;
    installDate: string;
    electrodeState: Filter.RunningState;
    deviceNetworkState: Filter.DeviceNetworkState;
    deployedLatitude: number;
    deployedLongitude: number;
    brandName: string;
    brandId: number | string;
    brandLogo: string;
    batteryState: Filter.BatteryState;
    address: string;
  }
  /**
   * @description 设备详情
   */
  interface DeviceInfo extends DeviceList {
    batteryInvalidDate: string;
    batteryPower: string;
    configInstitutionId: number;
    configInstitutionName: string;
    configInstitutionAdminName: string;
    configInstitutionAdminPhoneNumber: string;
    contactName: string;
    contactPhone: string;
    deployedImagePath: string;
    description: string;
    electrodeInvalidDate: string;
    hasRescueData: boolean;
    investor: string;
    latestAddress: string;
    latestLatitude: number;
    latestLongitude: number;
    maintainInstitutionId: number;
    maintainInstitutionName: string;
    maintainInstitutionAdminName: string;
    maintainInstitutionAdminPhoneNumber: string;
    mobile: boolean;
    model: string;
    placeId: number,
    placeName: string,
    publicDate: string,
    publicType: Filter.PublicType
    publicTimeFrom: string,
    publicTimeTo: string,
    qualityAssuranceDate: string,
    regionId: number[];
    regionName: string,
    serialNumber: string,
    sourcesOfDevice: string,
    unitName: string,
    workDay: string
  }
  /**
   * @description 新增设备or编辑设备
   */
  interface DeviceSaveForm {
    id?: number;
    address: string;
    batteryInvalidDate: string;
    brandId: number;
    configInstitutionId: number;
    contactName: string;
    contactPhone: string;
    deployedImagePath: string,
    deployedLatitude: number,
    deployedLongitude: number,
    description: string,
    deviceNetworkState: Filter.DeviceNetworkState,
    electrodeInvalidDate: string,
    installDate: string,
    investor: string,
    maintainInstitutionId: number,
    mobile: boolean,
    model: string,
    placeId: number,
    publicTimeFrom: string,
    publicTimeTo: string,
    publicType: Filter.PublicType,
    qualityAssuranceDate: string,
    regionId: number[]
    runningState: Filter.RunningState,
    serialNumber: string,
    unitName: string,
    workDay: string
  }

}


declare namespace User {
  interface AccountInfo {
    activated: boolean;
    address: string;
    email: string;
    imageUrl: string;
    nickName: string;
    phoneNumber: string;
    realName: string;
    roleName: string;
    volunteer?: boolean;
    certificateNumber?: number;
    volunteerId?: number | string;
  }
  interface VolunteerCert {
    backImagePath: string;
    certificateExpireDate: string;
    certificateName: string;
    certificateNumber: string;
    certificateReleaseDate: string;
    certificateState: Filter.CertificateState;
    description: string;
    frontImagePath: string;
    id: number | null;
    volunteerId?: number | null;
  }
  interface Volunteer {
    certificateNumber: number;
    email: string;
    id: number | null;
    mainMomentAreaAddress: string;
    name: string;
    phoneNumber: string;
    receiveHelpTimeBegin: string;
    receiveHelpTimeEnd: string;
    receiveHelpWeekOption: string;
    regionId: number[];
    regionName: string;
  }
}


