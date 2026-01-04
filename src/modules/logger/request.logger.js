import { logger } from './logger.init.js';

export const requestLogger = {
    /**
     * @param req
     * @param msg
     * @param meta
     */
    info(req, msg, meta = {}) {
        logger.info({ traceId: req?.traceId, ...meta }, msg);
    },

    /**
     * @param req
     * @param msg
     * @param meta
     */
    warn(req, msg, meta = {}) {
        logger.warn({ traceId: req?.traceId, ...meta }, msg);
    },

    /**
     * @param req
     * @param msg
     * @param meta
     */
    error(req, msg, meta = {}) {
        logger.error({ traceId: req?.traceId, ...meta }, msg);
    }
};