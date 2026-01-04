import express from "express";
import traceMiddleware from "../modules/middleware/trace.middleware.js";
import errorMiddleware from "../modules/middleware/error.middleware.js";
import MongoContainer from "../modules/mongo/mongo.container.js";
import OrdersService from "../modules/orders/orders.service.js";
import OrdersController from "../modules/orders/orders.controller.js";
import OrdersIntegrationService from "../modules/orders/orders.integration-service.js";
import router from "../modules/orders/orders.router.js";

const app = express();

export async function startServer (config) {

    const mongoInit = new MongoContainer(config.mongo);

    const service = new OrdersService({
        model: mongoInit.model.Order,
        logger: config.baseLogger,
    })

    const controller = new OrdersController({
        logger: config.api.logger,
        service,
    })

    const api = new OrdersIntegrationService({
        ...config.externalApi.api,
        service
    });

    try {
        app.use(traceMiddleware)
        app.use(express.json())
        app.use(config.api.router.path, router(controller))
        app.use(errorMiddleware)

        await mongoInit.initializeConnection()
        await api.autoSyncOrders(config.externalApi.autoSyncOrders)

        app.listen(config.server.port, async () => {
            config.server.logger.info(
                `Server listening on port ${config.server.port}`,
                { port: config.server.port })
        })

    } catch (error) {
        config.server.logger.fatal('Server failed to start', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
}