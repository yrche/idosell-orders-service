import { stringify } from "csv-stringify";
import ApiError from "../exeptions/api.error.js";

export default class OrdersService {
    #logger;
    constructor({ model, logger }) {
        this.model = model;
        this.#logger = logger;
    }

    /**
     * @param orders
     * @returns {Promise<*>}
     */
    async updateNonDeprecatedOrders(orders) {
        const deprecated = ["finished", "lost", "false"];

        if (!orders) {
            this.#logger.warn({ context: 'service' }, 'No orders were specified')
            throw new Error("Data update error: no orders were specified")
        }

        const options = orders.map((order) => {
            return {
                updateOne: {
                    filter: { _id: order._id },
                    update: [
                        {
                            $replaceRoot: {
                                newRoot: {
                                    $cond: [
                                        { $in: ["$status", deprecated] },
                                        "$$ROOT",
                                        order
                                    ]
                                }
                            }
                        }
                    ],
                    upsert: true
                }
            };
        })

        if (options.length > 0) {
            return await this.model.bulkWrite(options, { ordered: false });
        }
    }

    /**
     * @param minWorth
     * @param maxWorth
     * @returns {Promise<unknown>}
     */
    async exportOrdersToCsv({ minWorth, maxWorth }) {
        const filter = {};
        if (minWorth !== undefined && maxWorth !== undefined) {
            filter.$and = [
                { totalWorth: { $gte: Number(minWorth) } },
                { totalWorth: { $lte: Number(maxWorth) } }
            ];
        } else if (minWorth !== undefined) {
            filter.totalWorth = { $gte: Number(minWorth) };
        } else if (maxWorth !== undefined) {
            filter.totalWorth = { $lte: Number(maxWorth) };
        }

        const data = await this.model.find(filter).toArray();

        return await new Promise((resolve, reject) => {
            stringify(data, { header: true }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    /**
     * @param id
     * @returns {Promise<unknown>}
     */
    async exportOrderToCsvById(id) {
        if (!id) {
            this.#logger.warn({ context: 'service' , id }, 'Order ID is required')
            throw ApiError.BadRequest("Order ID is required")
        }

        const data = await this.model.findOne({ _id: Number(id) })

        if (!data) {
            this.#logger.warn({ context: 'service' , id }, 'Order not found')
            throw ApiError.BadRequest(`No such order with id: ${id}`)
        }

        return await new Promise((resolve, reject) => {
            stringify([data], { header: true }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}