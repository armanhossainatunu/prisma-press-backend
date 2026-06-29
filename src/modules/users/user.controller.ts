import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const user = await userService.registerUserIntoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statuscode: httpStatus.CREATED,
//       data: {
//         user,
//       },
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statuscode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to register user",
//       error: (error as Error).message,
//     });
//   }
// };

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
