import { logger } from './logger.init.js';

export const externalApiLogger = {
    /**
     * @param msg
     * @param meta
     */
    info(msg, meta = {}) {
        logger.info({ context: 'external-api', ...meta }, msg);
    },

    /**
     * @param msg
     * @param meta
     */
    warn(msg, meta = {}) {
        logger.warn({ context: 'external-api', ...meta }, msg);
    },

    /**
     * @param msg
     * @param meta
     */
    error(msg, meta = {}) {
        logger.error({ context: 'external-api', ...meta }, msg);
    }
};
