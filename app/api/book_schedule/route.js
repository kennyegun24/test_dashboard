import connectMongoDb from "@/lib/mongodb";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";
import Appointment from "@/models/Appointment";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  const { name, email, country, date, additional_info, service } =
    await req.json();

  if (!date || date < new Date()) {
    return NextResponse.json({ error: "Date should not be in the past" });
  }

  try {
    await connectMongoDb();

    const appointmentStart = new Date(date);
    const appointmentEnd = new Date(appointmentStart);
    appointmentEnd.setMinutes(appointmentStart.getMinutes() + 30);

    if (appointmentEnd <= appointmentStart) {
      return NextResponse.json(
        {
          error: "End time must be after start time",
        },
        { status: 400 }
      );
    }

    const conflictingAppointments = await Appointment.find({
      $or: [
        {
          $and: [
            { startTime: { $lt: appointmentEnd } },
            { endTime: { $gt: appointmentStart } },
          ],
        },
      ],
    });

    if (conflictingAppointments.length > 0) {
      return NextResponse.json(
        {
          error: "Time slot is unavailable",
        },
        { status: 409 }
      );
    }

    // Create new appointment
    const newAppointment = await Appointment.create({
      startTime: appointmentStart,
      endTime: appointmentEnd,
      email,
      name,
      country,
      additional_info,
      service,
    });

    return NextResponse.json(
      {
        success: true,
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    // Connect to the database
    const userId = req?.headers?.get("userId");
    const verify = await verifyTokenAndAuthz(req, userId);
    // Check if the user is valid
    const check = checkIfUserIsValid(verify, userId);
    await connectMongoDb();
    // console.log(check);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "COMPANY_CONTENT");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    // Fetch all appointments
    const appointments = await Appointment.find();

    // Return the appointments as JSON
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    // Handle errors
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
};
