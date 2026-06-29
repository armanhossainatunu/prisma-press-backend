import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";

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
// app.post();
app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);
export default app;
