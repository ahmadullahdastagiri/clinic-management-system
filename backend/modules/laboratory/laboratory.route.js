import express from "express";

import { validate } from "../../middlewares/validation.middleware.js";
import {
  createLaboratoryOrderController,
  createLaboratoryResultController,
  createLaboratoryTestController,
  deleteLaboratoryOrderByIdController,
  deleteLaboratoryResultByIdController,
  deleteLaboratoryTestByIdController,
  getAllLaboratoryOrdersController,
  getAllLaboratoryResultsController,
  getAllLaboratoryTestsController,
  getLaboratoryOrderByIdController,
  getLaboratoryResultByIdController,
  getLaboratoryTestByIdController,
  updateLaboratoryOrderByIdController,
  updateLaboratoryResultByIdController,
  updateLaboratoryTestByIdController,
} from "./laboratory.controller.js";
import {
  createLaboratoryOrderSchema,
  createLaboratoryResultSchema,
  createLaboratoryTestSchema,
  updateLaboratoryOrderSchema,
  updateLaboratoryResultSchema,
  updateLaboratoryTestSchema,
} from "./laboratory.validation.js";

const router = express.Router();

/* LAB TESTS */
router.post(
  "/tests",
  validate(createLaboratoryTestSchema),
  createLaboratoryTestController,
);
router.get("/tests", getAllLaboratoryTestsController);
router.get("/tests/:id", getLaboratoryTestByIdController);
router.put(
  "/tests/:id",
  validate(updateLaboratoryTestSchema),
  updateLaboratoryTestByIdController,
);
router.delete("/tests/:id", deleteLaboratoryTestByIdController);

/* LAB ORDERS */
router.post(
  "/orders",
  validate(createLaboratoryOrderSchema),
  createLaboratoryOrderController,
);
router.get("/orders", getAllLaboratoryOrdersController);
router.get("/orders/:id", getLaboratoryOrderByIdController);
router.put(
  "/orders/:id",
  validate(updateLaboratoryOrderSchema),
  updateLaboratoryOrderByIdController,
);
router.delete("/orders/:id", deleteLaboratoryOrderByIdController);

/* LAB RESULTS */
router.post(
  "/results",
  validate(createLaboratoryResultSchema),
  createLaboratoryResultController,
);
router.get("/results", getAllLaboratoryResultsController);
router.get("/results/:id", getLaboratoryResultByIdController);
router.put(
  "/results/:id",
  validate(updateLaboratoryResultSchema),
  updateLaboratoryResultByIdController,
);
router.delete("/results/:id", deleteLaboratoryResultByIdController);

export default router;
