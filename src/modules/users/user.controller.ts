import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userService.registerUserIntoDB(payload);
  sendResponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });
});

export const userController = {
  registerUser,
};
