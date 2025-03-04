import { Router } from "express";
import {
  getUsers,
  getUserCount,
  getUserById,
  createUser,
} from "../controllers/userController";
import { validate } from "../middleware/validator";
import { userValidationRules } from "../validator";

const router = Router();

router.get("/", getUsers);

router.get("/count", getUserCount);

router.get("/:id", getUserById);

router.post("/", validate(userValidationRules), createUser);

export default router;
