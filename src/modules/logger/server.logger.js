import { logger } from './logger.init.js';

export const serverLogger = {

    /**
     * @param msg
     * @param meta
     */
    info(msg, meta = {}) {
        logger.info({ context: 'server', ...meta }, msg);
    },

    /**
     * @param msg
     * @param meta
     */
    error(msg, meta = {}) {
        logger.error({ context: 'server', ...meta }, msg);
    },

    /**
     * @param msg
     * @param meta
     */
    fatal(msg, meta = {}) {
        logger.fatal({ context: 'server', ...meta }, msg);
    }
};