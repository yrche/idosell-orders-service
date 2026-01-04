import { OrdersAPI } from './orders.api.js'
import { OrdersDto } from "./orders.dto.js";
import { convertToMillis, delay } from "../utils/utils.js";

export default class OrdersIntegrationService extends OrdersAPI {
    #logger;
    constructor({ baseUrl, apiKey, logger, service }) {
        super(baseUrl);
        this.auth(apiKey);
        this.#logger = logger;
        this.service = service;
    }

    /**
     * @param options
     * @returns {Promise<{totalPages: number}>}
     */
    async syncAllOrders(options) {
        const { delayMs = 300, limitPages } = options
        let page = 0;

        while (page < limitPages || limitPages === undefined) {
            try {
                const response = await this.getOrders(page);
                const orders = response.Results
                    .map(order => new OrdersDto(order).toDataBaseFormat());

                await this.service.updateNonDeprecatedOrders(orders)
                await delay(delayMs);
                page++
            } catch (error) {
                if (!error.statusCode) {
                    const errorMeta = {
                        totalPages: page,
                        error: error.message,
                    }
                    this.#logger.error('Synchronization failed', errorMeta)
                    throw new Error(`Sync failed after ${page} pages: ${error.message}`);
                }

                break;
            }
        }
        return { totalPages: page }
    }

    /**
     * @param options
     * @returns {NodeJS.Interval}
     */
    async autoSyncOrders(options) {
        const {
            interval, // { minutes: X }
            onSuccess = (result) => this.#logger.info('Auto Sync completed', result),
            onError = (error) => this.#logger.error('Auto Sync failed', error)
        } = options;

        if (!interval) {
            this.#logger.error('Interval didnt provided', { interval: interval })
            throw new Error('Interval didnt provided')
        }

        const autoUpdateInterval = setInterval(async () => {
            try {
                const result = await this.syncAllOrders({})
                onSuccess(result)
            } catch (error) {
                onError(error)
                clearTimeout(autoUpdateInterval)
            }
        }, convertToMillis(interval))

        return autoUpdateInterval;
    }
}