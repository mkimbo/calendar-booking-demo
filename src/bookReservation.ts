import {
  google, // The top level object used to access services
  // General types used throughout the library
} from "googleapis";
import { Booking } from "./types.js";
import dotenv from "dotenv";
dotenv.config();
type CalendarEvent = {
  calendarId: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
};

const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
    project_id: process.env.GOOGLE_PROJECT_ID!,
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
  scopes: "https://www.googleapis.com/auth/calendar", //full access to edit calendar
});

const calendar = google.calendar({ version: "v3", auth });

export default async ({
  totalOccupants,
  availableCalendarIds,
  customerEmail,
  startTime,
  endTime,
}: Booking) => {
  const maxOccupantsPerVilla = 4;
  let remainingOccupants = totalOccupants;

  // Function to create an event in Google Calendar
  async function createCalendarEvent({
    calendarId,
    summary,
    description,
    startTime,
    endTime,
  }: CalendarEvent) {
    calendar.events.insert(
      {
        auth: auth,
        calendarId: calendarId,
        requestBody: {
          summary: summary,
          description: description,
          start: {
            dateTime: startTime,
          },
          end: {
            dateTime: endTime,
          },
        },
      },
      function (err: any, event: any) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created");
      }
    );
  }

  for (const calendarId of availableCalendarIds) {
    if (remainingOccupants <= 0) {
      break; // Stop if all occupants have been accommodated
    }
    const occupantsThisVilla = Math.min(
      remainingOccupants,
      maxOccupantsPerVilla
    );
    remainingOccupants -= occupantsThisVilla;

    // Prepare event details
    const summary = `Villa Booking for ${customerEmail}`;
    const description = `Booking for ${occupantsThisVilla} occupant(s) from ${customerEmail}.`;

    // Create a calendar event for the current villa
    const eventToAdd: CalendarEvent = {
      calendarId,
      summary,
      description,
      startTime,
      endTime,
    };

    await createCalendarEvent(eventToAdd);
  }

  if (remainingOccupants > 0) {
    console.error("Error: Not all occupants have been accommodated.");
    return false;
  }

  return true; // success
};
