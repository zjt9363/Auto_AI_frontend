import httpRequest from '@/request/index'

export function stopReturnData(bool) {
    return httpRequest({
        url: 'api/stop?bool='+bool,
        method: 'get',
    })
}