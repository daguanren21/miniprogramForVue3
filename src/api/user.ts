const api = {
    public: 'user/api/v1/mini-program/public/',
    user: 'user/api/v1/mini-program/',
    news: 'user/api/v1/mini-program/public/news-knowledge-bases',
    train: 'user/api/v1/mini-program/public/training-courses'
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
export type ModifyAccountInfo = Omit<User.AccountInfo, 'activated' | 'roleName' | 'address'>
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

export function fetchUnreadCount(): Promise<number> {
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
 * @description 修改志愿者资质证书
 */

export function updateVolunteerCerts(data: Omit<User.VolunteerCert,'description' | 'certificateState'>): Promise<User.VolunteerCert[]> {
    return request({
        url: api.user + `volunteer-certificates`,
        data,
        method: Method.PUT
    })
}

/**
 * @description 保存志愿者资质证书
 */

export function saveVolunteerCerts(data: Omit<User.VolunteerCert,'description' | 'certificateState'>): Promise<User.VolunteerCert[]> {
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
