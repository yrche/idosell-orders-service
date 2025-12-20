import { Router } from "express";
import OrdersController from "./orders.controller.js";
import queryValidation from "../middleware/validateQuery.middleware.js"
import authMiddleware from "../middleware/auth.middleware.js";

const router = new Router();

router.get('/orders', authMiddleware, queryValidation, OrdersController.getOrders);
router.get('/orders/:id', authMiddleware, OrdersController.getOrderById)

export { router }