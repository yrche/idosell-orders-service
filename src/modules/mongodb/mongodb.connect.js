import {ServerApiVersion} from "mongodb";
import MongodbInit from "./mongodb.init.js";
import env from "../../../config.js"

export const mongodbConnect = new MongodbInit(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});