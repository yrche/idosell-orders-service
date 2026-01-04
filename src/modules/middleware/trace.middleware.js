import { randomUUID } from 'crypto';

export default function traceMiddleware(req, res, next) {
    const traceId = randomUUID();
    req.traceId = traceId;
    res.setHeader('X-Trace-Id', traceId);
    next();
}