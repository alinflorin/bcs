// src/middleware/notFoundHandler.ts
import { Request, Response, NextFunction } from "express";

export default function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.auth?.["https://bcs-api/roles"]?.includes("admin")) {
    return next();
  }
  return res.status(403).json({
    error: {
      message: "Access denied.",
      status: 403,
    },
  });
}
