import ApiError from "../exeptions/api.error.js";
import {requestLogger} from "../logger/request.logger.js";

export default function (err, req, res) {
    requestLogger.error(req, err)
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: "Unpredictable error"})
}