import ApiError from "../exeptions/api.error.js";
import env from "../../../config.js";

export default function (req, res, next) {
    try {
        const clientKey = req.headers['x-api-key'];
        if (!clientKey) {
            return next(ApiError.Unauthorized());
        }

        if (clientKey !== env.API_KEY) {
            return next(ApiError.Unauthorized());
        }

        next();
    } catch (err) {
        return next(ApiError.Unauthorized())
    }
}