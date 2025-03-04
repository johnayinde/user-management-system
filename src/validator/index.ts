import { body } from "express-validator";

export const userValidationRules = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
];

export const postValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("body").notEmpty().withMessage("Body is required"),
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be a number"),
];

export const addressValidationRules = [
  body("street").notEmpty().withMessage("Street is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("zipCode").notEmpty().withMessage("Zip code is required"),
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be a number"),
];
