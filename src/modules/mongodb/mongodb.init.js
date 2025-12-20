import process from 'node:process';
import { MongoClient } from "mongodb";

export default class MongodbInit extends MongoClient{
    constructor(uri, options) {
        super(uri, options);
    }

    /**
     * initialize connection to mongodb cluster
     * @returns {Promise<void>}
     */
    async initializeConnection() {
        try {
            await this.connect()
            process.stdout.write("Connection has been established successfully\n")
        } catch (error) {
            throw new Error(`Connection error: ${error}`)
        }
    }
}