import connectMongoDb from "@/lib/mongodb";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";
import Role from "@/models/Roles";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectMongoDb();

    const { name, permissions, color, type } = await req.json();
    const userId = req?.headers?.get("userId");
    const verify = await verifyTokenAndAuthz(req, userId);
    // Check if the user is valid
    const check = checkIfUserIsValid(verify, userId);
    // console.log(check);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "CREATE_PERMISSIONS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    // Validate required fields
    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required." },
        { status: 400 }
      );
    }

    // Check if the role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return NextResponse.json(
        { error: "Role with this name already exists." },
        { status: 400 }
      );
    }

    // Create new role
    const newRole = new Role({
      name,
      type: type || "CUSTOM",
      permissions: permissions || ["VIEW_TEAMS"],
      color,
    });

    // Save to database
    await newRole.save();

    return NextResponse.json(
      { message: "Role created successfully!", role: newRole },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};

export const PUT = async (req, res) => {
  try {
    await connectMongoDb();
    const userId = req?.headers?.get("userId");
    const verify = await verifyTokenAndAuthz(req, userId);
    // Check if the user is valid
    console.log(verify);
    const check = checkIfUserIsValid(verify, userId);
    // console.log(check);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "EDIT_PERMISSIONS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { permissions, name, color, _id } = body;
    const existingRole = await Role.findOne({ _id });

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found." }, { status: 404 });
    }

    const updateData = {};
    if (permissions) {
      const truthyKeys = Object.keys(permissions).filter(
        (key) => permissions[key]
      );
      updateData.permissions = truthyKeys;
    }
    if (color && color !== existingRole.color) {
      updateData.color = color;
    }
    if (name && name !== existingRole.name) {
      updateData.name = name;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          message: "No changes detected. Role remains the same.",
          role: existingRole,
        },
        { status: 200 }
      );
    }

    const updatedRole = await Role.findOneAndUpdate(
      { _id: _id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log(updatedRole);
    return NextResponse.json(
      { message: "Role updated successfully", role: updatedRole },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectMongoDb();
    const roles = await Role.find();
    return NextResponse.json(
      { message: "Role fetched successfully!", roles: roles },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};
