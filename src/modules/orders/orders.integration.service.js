import { OrdersAPI } from './orders.api.js'
import { OrdersDto } from "./orders.dto.js";
import { delay } from "../utils/utils.js";
import OrdersService from "./orders.service.js";

export default class OrdersIntegrationService extends OrdersAPI {
    constructor(baseUrl, apiKey) {
        super(baseUrl)
        this.auth(apiKey)
    }

    /**
     * @param collection
     * @param options
     * @returns {Promise<{message: string, totalPages: number, error}|{message: string, totalPages: number}>}
     */
    async syncAllOrders(collection, options = {}) {
        let page = 0;
        const { delayMs = 300, limitPages } = options
        while (page < limitPages || limitPages === undefined) {
            try {
                const response = await this.getOrders(page);
                const orders = response.Results
                    .map(order => new OrdersDto(order).toDataBaseFormat());

                await OrdersService.updateNonDeprecatedOrders(collection, orders)
                await delay(delayMs);
                page++
            } catch (error) {
                if (!error.statusCode) {
                    return {
                        message: `Synchronization failed`,
                        totalPages: page,
                        error: error.message
                    }
                }
                break;
            }
        }

        return { message: 'Synchronization complete', totalPages: page }
    }

    async autoSyncOrders(database, options) {
        const {
            intervalMs = 60000,
            onSuccess = (result) => console.log('Sync completed:', result),
            onError = (error) => console.error('Sync failed:', error)
        } = options;

        return setInterval(async () => {
            try {
                const cluster = database.db("order")
                const collection = cluster.collection("orders")

                const result = await this.syncAllOrders(collection)
                onSuccess(result)
            } catch (error) {
                onError(error)
            }
        }, intervalMs)
    }
}