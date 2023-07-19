const api = {
    public: 'user/api/v1/mini-program/public/',
}
/**
 * @description 查询单位列表
 */
export interface Unit{
    name:string;
    indexLetter:string;
    id:number
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