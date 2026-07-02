import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.registerUser);

const auth = ()=>{
  return (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        statuscode: 401,
        message: "Unauthorized: No access token provided",
      });
    }
    next();
  }
}
router.get(
  "/me",
  auth(),
  (req: Request, res: Response, next: NextFunction) => {
    //    console.log(req.cookies, "cookie");
    const { accessToken } = req.cookies;
    //    console.log(accessToken);

    const verifyToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    if (typeof verifyToken === "string") {
      throw new Error(verifyToken);
    }
    const { id, name, email, role } = verifyToken;
    const requestRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    if (!requestRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statuscode: 403,
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }
    req.user = { id, name, email, role };
    next();
  },
  userController.getMyProfile,
);

export const userRouter = router;
