import { login } from "./auth.service.js";

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body.email, req.body.password);
    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
