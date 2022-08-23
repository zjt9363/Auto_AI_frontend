import httpRequest from '@/request/index'

export function uploadFile(data) {
    return httpRequest({
        url: 'upload',
        method: 'post',
        data,
    })
}