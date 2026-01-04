import ApiError from "../exeptions/api.error.js";
import env from "../../config/config.env.js";
import {requestLogger} from "../logger/request.logger.js";

export default function (req, res, next) {
    try {
        const clientKey = req.headers['x-api-key'];
        if (!clientKey) {
            // TODO: add logger
            return next(ApiError.Unauthorized());
        }

        if (clientKey !== env.API_KEY) {
            // TODO: add logger
            return next(ApiError.Unauthorized());
        }

        next();
    } catch (err) {
        return next(ApiError.Unauthorized())
    }
}