import { check, ZodError } from "zod";

export const validate = (schema) => {
  if (!schema) {
    throw new TypeError("A valid Zod schema must be provided to validate().");
  }
  return async (req, res, next) => {
    try {
      const data = req.body;
      const result = await schema.parseAsync(data);
      req.body = result; // Replace with the validated and parsed data
      next();
    } catch (error) {
      next(error);
    }
  };
};
