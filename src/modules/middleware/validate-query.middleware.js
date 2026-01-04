import { requestLogger } from "../logger/request.logger.js";
import ApiError from "../exeptions/api.error.js";

export default function (req, res, next) {
    try {
        const { minWorth, maxWorth } = req.query;

        if (minWorth > maxWorth) {
            requestLogger.warn(req, 'Invalid range', { minWorth, maxWorth })
            return next(ApiError.BadRequest(`Invalid range: minWorth (${ minWorth }) cannot be greater than maxWorth (${ maxWorth })`))
        }

        for (const key in req.query) {
            const value = req.query[key]
            if (isNaN(Number(value))) {
                requestLogger.warn(req, 'The query parameter must be a number', { query: req.query })
                return next(ApiError.BadRequest(`The query parameter '${ key }' must be a number`));
            }
        }

        next()
    } catch (error) {
        next(error)
    }
}