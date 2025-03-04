import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Address from "../models/Address";
import { asyncHandler } from "../middleware/errorHandler";
import { successResponse, paginatedResponse } from "../utils/responses";
import { AppError } from "../middleware/errorHandler";

// Get all users with pagination
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const pageNumber = parseInt(req.query.pageNumber as string) || 0;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const offset = pageNumber * pageSize;

  const { count, rows } = await User.findAndCountAll({
    limit: pageSize,
    offset,
    include: [{ model: Address, as: "address" }],
    order: [["createdAt", "DESC"]],
  });

  return paginatedResponse(
    res,
    rows,
    pageNumber,
    pageSize,
    count,
    "Users retrieved successfully"
  );
});

// Get user count
export const getUserCount = asyncHandler(
  async (req: Request, res: Response) => {
    const count = await User.count();
    return successResponse(res, { count }, "User count retrieved successfully");
  }
);

// Get user by ID
export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId || isNaN(Number(userId))) {
      return next(
        new AppError("Invalid user ID. Please provide a valid ID.", 400)
      );
    }

    const id = parseInt(userId);
    const user = await User.findByPk(id, {
      include: [{ model: Address, as: "address" }],
    });

    if (!user) {
      return next(new AppError(`User with ID ${id} not found`, 404));
    }

    return successResponse(res, user, "User retrieved successfully");
  }
);

// Create a new user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;

  // Check if user with email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
  });

  return successResponse(res, user, "User created successfully", 201);
});
