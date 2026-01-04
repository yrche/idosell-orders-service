import env from "./config.env.js";
import { ServerApiVersion } from "mongodb";
import { logger } from "../modules/logger/logger.init.js";
import { syncLogger } from "../modules/logger/sync.logger.js";
import { requestLogger } from "../modules/logger/request.logger.js";
import { serverLogger } from "../modules/logger/server.logger.js";

export const config = {
    baseLogger: logger,
    nodeEnv: env.NODE_ENV,
    api: {
        router: {
            path: '/api',
        },
        logger: requestLogger,
    },
    mongo: {
        connection: {
            uri: env.MONGODB_URI,
            options: {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            },
        },
        models: {
            Order: {
                database: 'orders',
                collection: 'orders',
            }
        },
        logger: logger
    },
    externalApi: {
        api: {
            baseUrl: env.ORDERS_HOSTNAME,
            apiKey: env.ORDERS_API_KEY,
            logger: syncLogger,
        },
        autoSyncOrders: {
            interval: { minutes: env.DEFAULT_INTERVAL }
        }
    },
    server: {
        port: env.PORT,
        logger: serverLogger,
    }
}