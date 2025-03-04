import { Response } from "express";

// Standard success response
export const successResponse = (
  res: Response,
  data: any,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

// Standard error response
export const errorResponse = (
  res: Response,
  message = "Error",
  statusCode = 500,
  errors = null
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    errors,
  });
};

// Pagination response
export const paginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number,
  message = "Success"
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;

  return res.status(200).json({
    status: "success",
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  });
};
