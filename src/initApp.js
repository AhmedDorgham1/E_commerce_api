import connectionDB from "../db/connection.js";
import { AppError } from "../src/utils/classError.js";
import { GlobalErrorHandler } from "../src/utils/asyncHandler.js";
import * as routers from "./modules/index.routes.js";

export const initApp = (express, app) => {
  const port = process.env.PORT || 3001;

  app.use(express.json());

  //connect to db
  connectionDB();

  app.use("/users", routers.userRouter);
  app.use("/categories", routers.categoryRouter);
  app.use("/subCategories", routers.subCategoryRouter);
  app.use("/brands", routers.brandRouter);
  app.use("/products", routers.productRouter);
  app.use("/coupons", routers.couponRouter);
  app.use("/carts", routers.cartRouter);
  app.use("/orders", routers.orderRouter);
  app.use("/reviews", routers.reviewRouter);

  //handle invalid URLs.
  app.use("*", (req, res, next) => {
    next(new AppError(`inValid url ${req.originalUrl}`));
  });

  //GlobalErrorHandler
  app.use(GlobalErrorHandler);

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
};
