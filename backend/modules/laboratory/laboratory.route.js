import express from "express";

import { validate } from "../../middlewares/validation.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
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

router.use(authenticate);

/* LAB TESTS */
router.post(
  "/tests",
  authorize("admin"),
  validate(createLaboratoryTestSchema),
  createLaboratoryTestController,
);
router.get(
  "/tests",
  authorize("admin", "laboratorian"),
  getAllLaboratoryTestsController,
);
router.get(
  "/tests/:id",
  authorize("admin", "laboratorian"),
  getLaboratoryTestByIdController,
);
router.put(
  "/tests/:id",
  validate(updateLaboratoryTestSchema),
  updateLaboratoryTestByIdController,
);
router.delete("/tests/:id", deleteLaboratoryTestByIdController);

/* LAB ORDERS */
router.post(
  "/orders",
  authorize("admin", "receptionist"),
  validate(createLaboratoryOrderSchema),
  createLaboratoryOrderController,
);
router.get(
  "/orders",
  authorize("admin", "receptionist", "laboratorian"),
  getAllLaboratoryOrdersController,
);
router.get(
  "/orders/:id",
  authorize("admin", "receptionist", "laboratorian"),
  getLaboratoryOrderByIdController,
);
router.put(
  "/orders/:id",
  authorize("admin", "receptionist"),
  validate(updateLaboratoryOrderSchema),
  updateLaboratoryOrderByIdController,
);
router.delete(
  "/orders/:id",
  authorize("admin", "receptionist"),
  deleteLaboratoryOrderByIdController,
);

/* LAB RESULTS */
router.post(
  "/results",
  authorize("admin", "laboratorian"),
  validate(createLaboratoryResultSchema),
  createLaboratoryResultController,
);
router.get(
  "/results",
  authorize("admin", "laboratorian"),
  getAllLaboratoryResultsController,
);
router.get(
  "/results/:id",
  authorize("admin", "laboratorian"),
  getLaboratoryResultByIdController,
);
router.put(
  "/results/:id",
  authorize("admin", "laboratorian"),
  validate(updateLaboratoryResultSchema),
  updateLaboratoryResultByIdController,
);
router.delete(
  "/results/:id",
  authorize("admin", "laboratorian"),
  deleteLaboratoryResultByIdController,
);

export default router;
