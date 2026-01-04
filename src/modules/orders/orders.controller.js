export default class OrdersController {
    #logger;
    constructor({ service, logger }) {
        this.service = service;
        this.#logger = logger;
    }

    /**
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getOrders(req, res, next) {
        try {
            const data = await this.service.exportOrdersToCsv(req?.query)

            this.#logger.info(req, 'Export orders requested', {
                query: req.query
            })

            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"')
            res.send(data)
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
            const data = await this.service.exportOrderToCsvById(req.params.id)

            this.#logger.info(req, 'Export order by id requested', {
                id: req.params.id
            })

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            res.send(data);
        } catch (error) {
            next(error)
        }
    }

}