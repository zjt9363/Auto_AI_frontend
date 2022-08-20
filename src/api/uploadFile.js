import httpRequest from '@/request/index'

export function uploadFile(data) {
    return httpRequest({
        url: 'api/upload',
        method: 'post',
        data,
    })
}