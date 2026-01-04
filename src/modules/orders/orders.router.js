import { Router } from "express";
import queryValidation from "../middleware/validate-query.middleware.js"
import authMiddleware from "../middleware/auth.middleware.js";

export default function router(controller) {
    const router = new Router();

    router.get('/orders', authMiddleware, queryValidation, controller.getOrders.bind(controller));
    router.get('/orders/:id', authMiddleware, controller.getOrderById.bind(controller))

    return router
}