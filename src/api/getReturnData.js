import httpRequest from '@/request/index'

export function getReturnData(param) {
    return httpRequest({
        url: 'submit',
        method: 'post',
        data: param,
    })
}