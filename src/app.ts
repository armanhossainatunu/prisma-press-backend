import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const app: Application = express();
// middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.post("/api/users/register", async (req: Request, res: Response) => {
  const payload = req.body;
  const { name, email, password, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExist) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_Salt_Rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const profile = await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    statuscode: httpStatus.CREATED,
    data: {
      user,
    },
    message: "User registered successfully",
  });
});
export default app;
