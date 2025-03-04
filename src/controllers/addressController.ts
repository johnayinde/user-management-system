import { Request, Response, NextFunction } from "express";

import Address from "../models/Address";
import User from "../models/User";
import { asyncHandler } from "../middleware/errorHandler";
import { successResponse } from "../utils/responses";
import { AppError } from "../middleware/errorHandler";

// Get address by user ID
export const getAddressByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.query.userId as string);

    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError(`User with ID ${userId} not found`, 404));
    }

    const address = await Address.findOne({
      where: { userId },
    });

    if (!address) {
      return next(
        new AppError(`Address for user with ID ${userId} not found`, 404)
      );
    }

    return successResponse(res, address, "Address retrieved successfully");
  }
);

// Create a new address for a user with user ID
export const createAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { street, city, state, zipCode, userId } = req.body;

    if (!userId || isNaN(Number(userId))) {
      return next(
        new AppError("Invalid user ID. Please provide a valid ID.", 400)
      );
    }

    const id = parseInt(userId);

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError(`User with ID ${id} not found`, 404));
    }

    // Check if the user already has an address
    const existingAddress = await Address.findOne({ where: { id } });
    if (existingAddress) {
      return next(
        new AppError(`User with ID ${id} already has an address`, 400)
      );
    }

    const address = await Address.create({
      street,
      city,
      state,
      zipCode,
      userId: id,
    });

    return successResponse(res, address, "Address created successfully", 201);
  }
);

// Update an address
export const updateAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userID;
    const { street, city, state, zipCode } = req.body;

    if (!userId || isNaN(Number(userId))) {
      return next(
        new AppError("Invalid user ID. Please provide a valid.", 400)
      );
    }
    const id = parseInt(userId);

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError(`User with ID ${id} not found`, 404));
    }

    // Check if the address exists
    const address = await Address.findOne({ where: { id } });
    if (!address) {
      return next(
        new AppError(`Address for user with ID ${id} not found`, 404)
      );
    }

    // Update the address
    await address.update({
      street: street || address.street,
      city: city || address.city,
      state: state || address.state,
      zipCode: zipCode || address.zipCode,
    });

    return successResponse(res, address, "Address updated successfully");
  }
);
