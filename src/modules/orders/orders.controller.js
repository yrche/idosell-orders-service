import OrdersService from "./orders.service.js";

class OrdersController {

    /**
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getOrders(req, res, next) {
        try {
            const data = await OrdersService.exportOrdersToCsv(req?.query)

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            res.send(data);
        } catch (error) {
            next(error)
        }
    }

    /**
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getOrderById(req, res, next) {
        try {
            const data = await OrdersService.exportOrderToCsvById(req.params.id)

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            res.send(data);
        } catch (error) {
            next(error)
        }
    }

}

export default new OrdersController();