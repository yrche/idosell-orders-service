import MongoInit from "./mongo.init.js";

export default class MongoContainer extends MongoInit {
    #models;
    #cache;
    constructor({ connection, models, logger }) {
        super({ ...connection, logger });
        this.#cache = new Map()
        this.#models = new Proxy(models, this.#handler())
    }

    /**
     * @returns {{get: (function(*, *): Collection<Document>)}}
     */
    #handler() {
        return {
            get: (target, prop) => {
                if (!Object.prototype.hasOwnProperty.call(target, prop)) {
                    throw new Error(`Model with name ${prop} does not exists`)
                }
                const database = this.db(target[prop].database)
                this.#cache.set(prop, database.collection(target[prop].collection))
                return this.#cache.get(prop)
            }
        }
    }

    /**
     * @returns {*}
     */
    get model() {
        return this.#models
    }
}