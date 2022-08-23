import httpRequest from '@/request/index'

export function getReturnData(param) {
    return httpRequest({
        url: 'save',
        method: 'post',
        data: param,
    })
}