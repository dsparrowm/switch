const MockRedis = class {
    data: Map<any, any>;
    
    constructor() {
        this.data = new Map();
    }
    async get(key) {
        return this.data.get(key);
    }
    async set(key, value) {
        this.data.set(key, value);
    }
}

export default MockRedis;