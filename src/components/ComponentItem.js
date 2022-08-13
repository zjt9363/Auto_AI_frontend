export class ComponentItem {
    id
    type
    data

    constructor(id, type, data) {
        this.id = id++
        this.type = type
        if (Array.isArray(data) && data) {
            for (const key of data) {
                this[key] = null
            }
        }else {
            for (const key in data) {
                this.set(key, data[key])
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
