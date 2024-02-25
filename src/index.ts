import express, { Express, Request, Response } from "express";
import bookReservation from "./bookReservation.js";
import dotenv from "dotenv";
import { Booking } from "./types.js";
dotenv.config();

const app: Express = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome, This is Villa Mandhari");
});

app.post("/book-reservation", (req: Request, res: Response) => {
  const totalOccupants = req.body?.totalOccupants;
  const availableCalendarIds = req.body?.availableCalendarIds;
  const customerEmail = req.body?.customerEmail;
  const startTime = req.body?.startTime;
  const endTime = req.body?.endTime;
  console.error("availableCalendarIds", availableCalendarIds);
  if (availableCalendarIds) {
    bookReservation({
      totalOccupants: parseInt(totalOccupants as string),
      availableCalendarIds: availableCalendarIds,
      customerEmail,
      startTime,
      endTime,
    } as Booking).then((data) => {
      res.json(data);
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
