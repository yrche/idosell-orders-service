import {mongodbConnect} from "../mongodb/mongodb.connect.js";
import {stringify} from "csv-stringify";
import ApiError from "../exeptions/api.error.js";

class OrdersService {

    /**
     * @param collection
     * @param orders
     * @returns {Promise<*>}
     */
    async updateNonDeprecatedOrders(collection, orders) {
        const deprecated = ["finished", "lost", "false"];

        if (!orders) {
            throw new Error("Data update error: no orders were specified")
        }

        if (!collection) {
            throw new Error("Data update error: no collection were specified")
        }

        const options = orders.map((order) => {
            return {
                updateOne: {
                    filter: { _id: order._id },
                    update:  [
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
                    upsert: true,
                }
            };
        })

        if (options.length > 0) {
            return await collection.bulkWrite(options, { ordered: false });
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

        const cluster = mongodbConnect.db("order")
        const collection = cluster.collection("orders")

        const data = await collection.find(filter).toArray();

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
            throw ApiError.BadRequest("Order ID is required")
        }

        const cluster = mongodbConnect.db("order")
        const collection = cluster.collection("orders")

        const data = await collection.findOne({ _id: Number(id) })


        return await new Promise((resolve, reject) => {
            stringify([data], { header: true }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

export default new OrdersService();