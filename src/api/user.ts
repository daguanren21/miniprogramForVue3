const api = {
    public: 'user/api/v1/mini-program/public/',
    user: 'user/api/v1/mini-program/',
    news: 'user/api/v1/mini-program/public/news-knowledge-bases',
    train: 'user/api/v1/mini-program/public/training-courses',
    volunteer: 'user/api/v1/mini-program/volunteer/'
}
/**
 * @description 查询单位列表
 */
export interface Unit {
    name: string;
    indexLetter: string;
    id: number
}
export function fetchUnits(data: {
    name: string,
    unitType: string,
}): Promise<Unit[]> {
    return request({
        url: api.public + 'units/unit-options',
        data: data,
        method: Method.GET
    })
}

/**
 * 
 * @description 获取小程序账号基本信息
 */
export function fetchAccountInfo(): Promise<User.AccountInfo> {
    return request({
        url: api.user + 'account-info',
        method: Method.GET
    })
}
/**
 * 
 * @description 修改小程序个人信息
 */
export type ModifyAccountInfo = Omit<User.AccountInfo, 'activated' | 'roleName' | 'address' | 'roleType'>
export function updateAccountInfo(data: ModifyAccountInfo): Promise<User.AccountInfo> {
    return request({
        url: api.user + 'account-info/update',
        data,
        method: Method.PUT
    })
}

/**
 * 
 * @description 查询个人未读通知消息
 */
export interface Message {
    content: string;
    createdDate: string;
    deleted: boolean;
    eventTypeName: string;
    expired: boolean;
    hasRead: boolean;
    id: number;
    level: string;
    linkUrl: string;
}
export function fetchUnreadMessages(data: { page: number, size: number }): Promise<{
    content: Message[];
    totalCount: number;
    totalPage: number;
}> {
    return request({
        url: api.user + 'notification-messages/unread',
        data,
        method: Method.GET
    })
}

/**
 * @description 查询个人未读通知消息数量
 */

export function fetchUnreadCount(): Promise<{
    certificatesCount: number,
    unreadCount: number
}> {
    return request({
        url: api.user + 'notification-messages/unread-count',
        method: Method.GET
    })
}

/**
 * @description 标记通知已阅读
 */

export function updateReadMarks(id: number): Promise<void> {
    return request({
        url: api.user + `notification-messages/read-marks/${id}`,
        method: Method.POST
    })
}


/**
 * @description 获取志愿者资质证书
 */

export function fetchVolunteerCerts(id: number): Promise<User.VolunteerCert[]> {
    return request({
        url: api.user + `volunteer-certificates`,
        data: {
            volunteerId: id
        },
        method: Method.GET
    })
}
/**
 * @description 获取志愿者资质证书详情
 */

export function fetchVolunteerCertInfo(id: number): Promise<User.VolunteerCert> {
    return request({
        url: api.user + `volunteer-certificates/${id}`,
        method: Method.GET
    })
}
/**
 * @description 修改志愿者资质证书
 */

export function updateVolunteerCerts(data: Omit<User.VolunteerCert, 'description' | 'certificateState'>): Promise<User.VolunteerCert[]> {
    return request({
        url: api.user + `volunteer-certificates`,
        data,
        method: Method.PUT
    })
}
/**
 * @description 删除志愿者资质证书
 */
export function deleteVolunteerCerts(id: number, deleteReason: string): Promise<void> {
    return request({
        url: api.user + `volunteer-certificates/${id}`,
        data: {
            deleteReason
        },
        method: Method.DELETE
    })
}
/**
 * @description 保存志愿者资质证书
 */

export function saveVolunteerCerts(data: Omit<User.VolunteerCert, 'description' | 'certificateState'>): Promise<User.VolunteerCert[]> {
    return request({
        url: api.user + `volunteer-certificates`,
        data,
        method: Method.POST
    })
}

/**
 * @description 获取志愿者信息
 */
export function fetchVolunteerInfo(): Promise<User.Volunteer> {
    return request({
        url: api.user + `volunteer-info`,
        method: Method.GET
    })
}
/**
 * @description 注册成为志愿者
 */
export function registerVolunteer(data: Omit<User.Volunteer, 'certificateNumber'> & {
    latitude: number
    longitude: number
}): Promise<void> {
    return request({
        url: api.user + `volunteer-register`,
        data,
        method: Method.POST
    })
}

/**
 * @description 更新志愿者位置信息
 */
export function updateVolunteerLocation(data: {
    adddress: string
    latitude: number
    longitude: number
}): Promise<void> {
    return request({
        url: api.user + `volunteer/location`,
        data,
        method: Method.PUT
    })
}

/**
 * @description 查询新闻知识库列表
 */
export interface News {
    content: string;
    description: string;
    id: number;
    likeCount: number;
    publishTime: string;
    readCount: number;
    title: string;
    titleImagePath: string;
    top: boolean;
}
export function fetchNews(data: {
    page: number,
    size: number
}): Promise<{
    content: News[];
    totalCount: number;
    totalPage: number;
}> {
    return request({
        url: api.news,
        data,
        method: Method.GET
    })
}

/**
 * @description 查询新闻知识库列表
 */
export function fetchNewsInfo(id: number): Promise<News> {
    return request({
        url: api.news + `/${id}`,
        method: Method.GET
    })
}

/**
 * @description 更新新闻知识库已读记录
 */
export function updateNews(id: number): Promise<void> {
    return request({
        url: api.news + `/${id}`,
        method: Method.PUT
    })
}

/**
 * @description 分页查询培训课程列表
 */
export interface Course {
    classAddress: string;
    classHour: number;
    courseType: string;
    description: string;
    endTime: string;
    id: number;
    imagePath: string;
    introduction: string;
    name: string;
    personNumber: string;
    phoneNumber: string;
    price: string;
    startTime: string;
    url: string;
    userName: string;
}
export function fetchTrainingCourses(data: {
    courseType: Filter.CourseType
    page: number,
    size: number
}): Promise<{
    content: Course[];
    totalCount: number;
    totalPage: number;
}> {
    return request({
        url: api.train,
        data,
        method: Method.GET
    })
}

/**
 * @description 获取培训课程详情信息
 */
export function fetchTrainingCourseInfo(id: number): Promise<Course> {
    return request({
        url: api.train + `/${id}`,
        method: Method.GET
    })
}


export interface RescueInfo {
    aedAgreeCount: number;
    agreeCount: number;
    allVolunteerCount: number;
    cprAgreeCount: number;
    cprReceiverCount: number;
    fetchAedReceiverCount: number;
    receivedInfo: ReceivedInfo;
    record: VolunteerRecord;
    responseInfos: ReceivedInfo[];
}
export interface ReceivedInfo {
    activated: boolean;
    callForHelpAddress: string;
    callForHelpTime: string;
    description: string;
    id: number;
    headImageUrl:string;
    receivedTime: string;
    receiverId: number;
    receiverLatitude: number;
    receiverLongitude: number;
    receiverName: string;
    receiverPhone: string;
    recordId: number;
    rescueResponseState: Filter.RescueResponseState;
    rescueResponseTaskType: Filter.RescueResponseTaskType;
    responseTime: string;
}
export interface VolunteerRecord {
    activated: boolean;
    address: string;
    callForHelpTime: string;
    callerId: number;
    callerName: string;
    callerPhone: string;
    createdDate: string;
    description: string;
    id: number;
    latitude: number;
    longitude: number;
    oneKeyForHelpRecordState: Filter.OneKeyForHelpRecordState;
    rescueType: Filter.RescueType;
}
/**
 * @description 获取志愿者急救信息
 */
export function fetchVolunteerRescueInfo(): Promise<RescueInfo> {
    return request({
        url: api.volunteer + `rescue-info`,
        method: Method.GET
    })
}

/**
 * @description 获取演练志愿者
 */
export function fetchVolunteerDrill(): Promise<string[]> {
    return request({
        url: api.volunteer + `drill-volunteer`,
        method: Method.GET
    })
}

/**
 * @description 获取地点步行距离
 */
export function fetchLocationDistance(data: {
    latFrom: number,
    latTo: number,
    lngFrom: number,
    lngTo: number
}): Promise<number> {
    return request({
        url: api.volunteer + `location-distance`,
        data,
        method: Method.GET
    })
}

/**
 * @description 同意救助
 */
export function saveAgreeToHelp(data: {
    responseInfoId: number
}): Promise<void> {
    return request({
        url: api.volunteer + `agree-to-help`,
        data,
        method: Method.POST
    })
}


/**
 * @description 添加演练志愿者
 */
export interface SaveDrillVolunteer {
    latestObtainedLatitude: number;
    latestObtainedLongitude: number;
    phoneList: string[];
}
export function saveDrillVolunteer(data: SaveDrillVolunteer): Promise<void> {
    return request({
        url: api.volunteer + `drill-volunteer`,
        data,
        method: Method.POST
    })
}
export interface SaveOneKeyForHelp {
    address: string;
    latitude: number;
    longitude: number;
    rescueType: Filter.RescueType;
}
/**
 * @description 一键呼救
 */
export function saveOneKeyForHelp(data: SaveOneKeyForHelp): Promise<void> {
    return request({
        url: api.volunteer + `one-key-for-help`,
        data,
        method: Method.POST
    })
}
/**
 * @description 关闭一键呼救
 */
export function saveOneKeyForHelpToFinish(data: {
    recordId: number
}): Promise<void> {
    return request({
        url: api.volunteer + `one-key-for-help/finish`,
        data,
        method: Method.POST
    })
}

/**
 * @description 不同意救助
 */
export function saveRefuseToHelp(data: {
    responseInfoId: number
}): Promise<void> {
    return request({
        url: api.volunteer + `refuse-to-help`,
        data,
        method: Method.POST
    })
}
/**
 * @description 切换模式
 */
export function saveSwitchModel(): Promise<void> {
    return request({
        url: api.volunteer + `switch-model`,
        method: Method.POST
    })
}


