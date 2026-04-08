// Force restart
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import AppError from "../errors/AppError";

export default function validateRequest(
  schema: ObjectSchema,
  source: "body" | "query" = "body",
) {
  return async function validator(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = source === "body" ? req.body : req.query;

      if (source === "body" && (!data || Object.keys(data).length === 0)) {
        if (
          req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "PATCH"
        ) {
          return next(AppError.badRequest("Request body is missing or empty."));
        }
      }

      const validated = await schema.validateAsync(data || {}, {
        abortEarly: false,
      });

      if (source === "body") {
        req.body = validated;
      } else {
        // req.query is read-only, so we store validated data in res.locals
        res.locals.validatedQuery = validated;
        // Optionally update req.query if possible without throwing
        try {
          Object.keys(req.query).forEach((key) => delete req.query[key]);
          Object.assign(req.query, validated);
        } catch (err) {
          // Ignore if req.query is immutable
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
