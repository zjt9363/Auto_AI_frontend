import httpRequest from '@/request/index'

export function stopReturnData(bool) {
    return httpRequest({
        url: 'stop?bool='+bool,
        method: 'get',
    })
}