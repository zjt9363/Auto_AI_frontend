import httpRequest from '@/request/index'

export function getReturnData(param) {
    return httpRequest({
        url: 'api/test',
        method: 'post',
        data: param
    })
}