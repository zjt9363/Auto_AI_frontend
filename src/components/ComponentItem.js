export class ComponentItem {
    id
    type
    data

    constructor(id, type, data) {
        this.id = id++
        this.type = type
        if (data) for (const key of data) {
            if (key === 'isActive') {
                this[key] = false
            }else {
                this[key] = null
            }
        }
    }

    set(key, value) {
        this[key] = value
    }

    get(key) {
        return this[key]
    }
}
