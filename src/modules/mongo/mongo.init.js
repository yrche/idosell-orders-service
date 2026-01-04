import { MongoClient } from "mongodb";

export default class MongoInit extends MongoClient {
    #logger;

    constructor({ uri, options, logger }) {
        super(uri, options);
        this.#logger = logger;
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async initializeConnection() {
        try {
            await this.connect
            this.#logger.info({ context: 'database'}, 'Connection has been established successfully')
        } catch (error) {
            this.#logger.error({ context: 'database', ...error}, 'Connection has been failed')
            throw error
        }
    }
}