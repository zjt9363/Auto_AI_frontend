import httpRequest from '@/request/index'

export function getReturnData(param) {
    return httpRequest({
        url: 'api/save',
        method: 'post',
        data: param,
    })
}