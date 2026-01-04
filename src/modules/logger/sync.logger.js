import { logger } from './logger.init.js';

export const syncLogger = {

    /**
     * @param msg
     * @param meta
     */
    info(msg, meta = {}) {
        logger.info({ context: 'orders-sync', ...meta }, msg);
    },

    /**
     * @param msg
     * @param meta
     */
    error(msg, meta = {}) {
        logger.error({ context: 'orders-sync', ...meta }, msg);
    }
};
