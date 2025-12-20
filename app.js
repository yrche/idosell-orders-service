import express from 'express';
import env from './config.js';
import OrdersIntegrationService from "./src/modules/orders/orders.integration.service.js";
import { mongodbConnect } from "./src/modules/mongodb/mongodb.connect.js";
import { router } from "./src/modules/orders/orders.router.js";
import errorMiddleware from "./src/modules/middleware/error.middleware.js";

const app = express();
const api = new OrdersIntegrationService(env.ORDERS_HOSTNAME, env.ORDERS_API_KEY);

async function main () {
    try {
        app.use(express.json());
        app.use('/api', router)
        app.use(errorMiddleware)
        app.listen(env.PORT, async () => {
            await mongodbConnect.initializeConnection()
            await api.autoSyncOrders(mongodbConnect, 60000)

            console.log(`Server listening on port ${env.PORT}`)
        })

    } catch (error) {
        console.log(error)
    }
}

await main();