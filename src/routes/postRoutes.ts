import { Router } from "express";
import {
  getPostsByUserId,
  createPost,
  deletePost,
} from "../controllers/postController";
import { validate } from "../middleware/validator";
import { postValidationRules } from "../validator";

const router = Router();

router.get("/", getPostsByUserId);

router.post("/", validate(postValidationRules), createPost);

router.delete("/:id", deletePost);

export default router;
