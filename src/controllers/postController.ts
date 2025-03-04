import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import User from "../models/User";
import { asyncHandler } from "../middleware/errorHandler";
import { successResponse } from "../utils/responses";
import { AppError } from "../middleware/errorHandler";

// Get posts by user ID
export const getPostsByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId as string;

    if (!userId || isNaN(Number(userId))) {
      return next(
        new AppError("Invalid post ID. Please provide a valid ID.", 400)
      );
    }
    const id = parseInt(userId);

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError(`User with ID ${id} not found`, 404));
    }

    const posts = await Post.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, posts, "Posts retrieved successfully");
  }
);

// Create a new post
export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body, userId } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError(`User with ID ${userId} not found`, 404));
    }

    const post = await Post.create({
      title,
      body,
      userId,
    });

    return successResponse(res, post, "Post created successfully", 201);
  }
);

// Delete a post
export const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    if (!postId || isNaN(Number(postId))) {
      return next(
        new AppError("Invalid post ID. Please provide a valid ID.", 400)
      );
    }
    const id = parseInt(postId);

    const post = await Post.findByPk(id);

    if (!post) {
      return next(new AppError(`Post with ID ${id} not found`, 404));
    }

    await post.destroy();

    return successResponse(
      res,
      { deleted: true },
      "Post deleted successfully",
      200
    );
  }
);
