import { login } from "./auth.service.js";

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body.email, req.body.password);

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};
