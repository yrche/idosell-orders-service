import https from 'node:https';
import http from 'node:http';

class Base {
    #apiKey;
    baseUrl;

    constructor(baseUrl) {
        this.baseUrl = new URL(baseUrl?.toString());
        this.#apiKey = null;
    }

/**
 * @param apiKey
 * @returns void
 */
    auth(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error("API KEY should be a non empty string")
        }

        this.#apiKey = apiKey;
    }

/**
 * @returns {{"Content-Type": string, "X-API-KEY": string}}
 */
    #getHeaders() {
        if (!this.#apiKey || typeof this.#apiKey !== 'string') {
            throw new Error("API KEY should be a non empty string")
        }

        return {
            'Content-Type': 'application/json',
            'X-API-KEY': this.#apiKey
        }
    }


/**
 * @param url
 * @returns {Promise<unknown>}
 */
    async request(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.protocol === 'https:' ? https : http;
            const options = {
                headers: this.#getHeaders(),
            };

            protocol.request(url, options, (res) => {

                if (res.statusCode >= 400) {
                    const error = new Error(`HTTP ${res.statusCode}`);
                    error.statusCode = res.statusCode;
                    res.resume()
                    return reject(error);
                }

                if (res.statusCode === 207) {
                // IMPORTANT:
                // According to idosell API behavior, HTTP 207 is used to signal
                // an empty result set ("Wyszukiwarka zamówień: zwrócono pusty wynik").
                // This is not a transport error but a business-level stop condition
                // for further pagination.
                    const error = new Error(`HTTP ${res.statusCode}, No more orders`)
                    error.statusCode = res.statusCode
                    res.resume()
                    return reject(error);
                }

                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => {
                    try {
                        const data = JSON.parse(Buffer.concat(chunks).toString());
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                });
                res.on('error', reject);
            }).on('error', () => reject("error")).end();
        })
    }
}

export class OrdersAPI extends Base {
    constructor(baseUrl) {
        super(baseUrl);
    }

/**
 *
 * @param page
 * @param limit
 * @returns {Promise<*>}
 */
    async getOrders(page = 0, limit = 100) {
        const url = new URL(this.baseUrl)
        url.pathname = "/api/admin/v7/orders/orders"
        url.searchParams.set('resultsPage', page.toString())
        url.searchParams.set('resultsLimi', limit.toString())
        return await this.request(url);
    }

    /**
     *
     * @param id
     * @returns {Promise<*>}
     */
    async getOrderById(id) {
        const url = new URL(this.baseUrl)
        url.pathname = "/api/admin/v7/orders/orders"
        url.searchParams.set('ordersSerialNumbers', id)
        return await this.request(url)
    }

/**
 *
 * @returns {Promise<{Results: *[], resultsNumberAll: number}>}
 */
    async getAllOrders() {
        const orders = [];
        let page = 0;

        while (true) {
            try {
                const data = await this.getOrders(page)
                orders.push(...data.Results)
                page++
            } catch (error) {
                break
            }
        }

        return {
            Results: orders,
            resultsNumberAll: orders.length
        }
    }
}