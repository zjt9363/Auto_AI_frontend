import axios from 'axios'


const service = axios.create({
    baseURL: '/api',
    timeout: 60000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'token': '',
        'X-Requested-With': 'XMLHttpRequest',
    }
})

service.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        return Promise.reject((error))
    }
)

service.interceptors.response.use(
    function (response) {
        return response.data
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default service