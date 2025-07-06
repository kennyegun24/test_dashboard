import connectMongoDb from "@/lib/mongodb";
import Role from "@/models/Roles";
import Teams from "@/models/Teams";

export const userRolesAre = async (user_id, routePermission) => {
  try {
    await connectMongoDb();
    const user = await Teams.findById(user_id).select("roles");
    console.log(user, "user");
    if (!user || !user.roles.length) return false;
    const roles = await Role.find({ name: { $in: user.roles } }).select(
      "permissions"
    );
    const permissions = roles.flatMap((role) => role.permissions);
    return permissions.includes(routePermission);
  } catch (error) {
    console.error("Error checking user roles:", error);
    return false;
  }
};
