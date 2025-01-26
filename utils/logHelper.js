const { default: AuditLog } = require("@/models/LogsSchema");
/**
 * NEW AND UPDATING BLOG
 * ABOUT ME, COMPANY DETAILS, FAQ, SOCIALS
 * LEGAL PAGES
 *
 **/
export const saveLogActivity = async (log) => {
  try {
    console.log(log);
    const saveAudit = new AuditLog({ ...log });
    await saveAudit.save();

    return true;
  } catch (error) {
    console.error("Error saving log:", error);
    throw new Error("Failed to save log activity.");
  }
};

// Adding new team members
