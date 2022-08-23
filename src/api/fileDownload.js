import httpRequest from '@/request/index'

export function downloadPyFile(param) {
    return httpRequest({
        url: 'downloadPyFile',
        method: 'post',
        data: param
    })
}


export function downloadImg(param) {
    return httpRequest({
        url: 'getImg',
        method: 'post',
        responseType: 'blob',
        data: param
    })
}


