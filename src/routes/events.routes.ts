import express, { Router, Request, Response } from "express";
const router: Router = express.Router();

import { validate } from "../middlewares/validation.middleware";
import { EventBodySchema } from "../schemas/events.schema";

router.post("/", validate(EventBodySchema), (req: Request, res: Response) => {
  console.log("Received event:", req.body);
  res.status(200).send({ message: "Event received" });
});

export default router;
