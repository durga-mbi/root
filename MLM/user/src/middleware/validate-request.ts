import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export default function validateRequest(schema: ObjectSchema) {
  return async function validator(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const dataToValidate = req.method === "GET" ? req.query : req.body;
    const validated = await schema.validateAsync(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (req.method === "GET") {
      // req.query might be read-only in some Express versions/setups.
      // We clear and update keys safely.
      const query = req.query as any;
      Object.keys(query).forEach((key) => delete query[key]);
      Object.assign(query, validated);
    }
    
    // Always populate req.body with validated data to ensure use cases that 
    // expect input in req.body still work even for GET requests.
    req.body = validated;
    next();
  };
}
