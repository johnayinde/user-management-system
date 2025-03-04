import { Router } from "express";
import {
  getAddressByUserId,
  createAddress,
  updateAddress,
} from "../controllers/addressController";
import { validate } from "../middleware/validator";
import { addressValidationRules } from "../validator";

const router = Router();

router.get("/", getAddressByUserId);

router.post("/", validate(addressValidationRules), createAddress);

router.patch("/:userID", updateAddress);

export default router;
