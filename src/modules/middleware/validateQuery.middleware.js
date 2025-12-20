import ApiError from "../exeptions/api.error.js";

export default function (req, res, next) {
    try {
        const { minWorth, maxWorth } = req.query;

        if (minWorth > maxWorth) {
            return next(ApiError.BadRequest(`Invalid range: minWorth (${minWorth}) cannot be greater than maxWorth (${maxWorth})`))
        }

        for (const key in req.query) {
            const value = req.query[key]
            if (isNaN(Number(value))) {
                return next(ApiError.BadRequest(`Query parameter '${key}' must be a number`));
            }
        }

        next()
    } catch (error) {
        next(error)
    }
}