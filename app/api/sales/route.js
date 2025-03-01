// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Sale from "@/models/Sold";
// import AuditLog from "@/models/LogsSchema";

// export const POST = async (req) => {
//   try {
//     await dbConnect();
//     const { sales } = await req.json();

//     if (!Array.isArray(sales) || sales.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Sales data must be a non-empty array." },
//         { status: 400 }
//       );
//     }

//     // Prepare bulk operations for the Sale model
//     const saleOperations = sales.map((sale) => ({
//       updateOne: {
//         filter: { _id: sale._id },
//         update: { $set: sale },
//         upsert: true,
//       },
//     }));

//     const saleIds = sales.map((sale) => sale._id);

//     const existingLogs = await AuditLog.find(
//       { resourceId: { $in: saleIds } },
//       { resourceId: 1, details: 1 } // Only fetch fields needed for comparison
//     ).lean();

//     const logOperations = [];
//     const loggedSaleMap = new Map(
//       existingLogs.map((log) => [log.resourceId.toString(), log])
//     );

//     sales.forEach((sale) => {
//       const existingLog = loggedSaleMap.get(sale._id.toString());
//       const fieldsToTrack = ["status", "amount"];
//       let hasChanges = false;

//       if (!existingLog) {
//         logOperations.push({
//           insertOne: {
//             document: {
//               userId: sale.userId,
//               organizationId: sale.organizationId,
//               action: "SALE_PROCESSED",
//               resource: "Sales",
//               resourceId: sale._id,
//               details: {
//                 status: sale.status,
//                 amount: sale.amount,
//                 date: sale.date,
//               },
//               timestamp: new Date(),
//             },
//           },
//         });
//       } else {
//         for (const field of fieldsToTrack) {
//           if (sale[field] !== existingLog.details[field]) {
//             hasChanges = true;
//             break;
//           }
//         }

//         if (hasChanges) {
//           let action = "SALE_UPDATED"; // Default action

//           // Customize the action based on the status change
//           if (sale.status === "Completed") {
//             action = "SALE_COMPLETED";
//           } else if (sale.status === "Cancelled") {
//             action = "SALE_CANCELLED";
//           } else if (sale.status === "Pending") {
//             action = "SALE_MARKED_PENDING";
//           } else {
//             action = "SALE_PENDING";
//           }

//           const existingLogIndex = existingLogs.findIndex(
//             (log) => log.resourceId === sale._id
//           );

//           if (existingLogIndex > -1) {
//             // Update the existing log entry
//             const existingLog = existingLogs[existingLogIndex];
//             logOperations.push({
//               updateOne: {
//                 filter: { _id: existingLog._id },
//                 update: {
//                   $set: {
//                     action: action,
//                     "details.status": sale.status,
//                     "details.amount": sale.amount,
//                     "details.previousDetails": existingLog.details,
//                     timestamp: new Date(),
//                   },
//                 },
//               },
//             });
//           }
//         }
//       }
//     });

//     await Sale.bulkWrite(saleOperations);
//     logOperations.length > 0 ? await AuditLog.bulkWrite(logOperations) : null;

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Sales and logs processed successfully.",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing sales and logs:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to process sales and logs.",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// };

// // if (hasChanges) {
// //   let action = "SALE_UPDATED"; // Default action

// //   // Customize the action based on the status change
// //   if (sale.status === "Completed") {
// //     action = "SALE_COMPLETED";
// //   } else if (sale.status === "Cancelled") {
// //     action = "SALE_CANCELLED";
// //   } else if (sale.status === "Pending") {
// //     action = "SALE_MARKED_PENDING";
// //   } else {
// //     action = "SALE_PENDING";
// //   }
// //   logOperations.push({
// //     insertOne: {
// //       document: {
// //         userId: sale.userId,
// //         organizationId: sale.organizationId,
// //         action: action,
// //         resource: "Sales",
// //         resourceId: sale._id,
// //         details: {
// //           status: sale.status,
// //           amount: sale.amount,
// //           previousDetails: existingLog.details,
// //         },
// //         timestamp: new Date(),
// //       },
// //     },
// //   });
// // }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sold";
import AuditLog from "@/models/LogsSchema";
import { userRolesAre } from "@/utils/checkRoles";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";

export const POST = async (req) => {
  try {
    await dbConnect();
    const { sales } = await req.json();

    if (!Array.isArray(sales) || sales.length === 0) {
      return NextResponse.json(
        { success: false, message: "Sales data must be a non-empty array." },
        { status: 400 }
      );
    }
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

    const isUserAllowed = await userRolesAre(userId, "ADD_NEW_SALES_RECORDS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    // Separate sales into new and existing based on presence of _id
    // let newSales = sales.filter((sale) => !sale._id);
    let newSales = sales
      .filter((sale) => !sale._id)
      .map((e) => ({
        clientName: e.clientName,
        email: e.email,
        phone: e.phone,
        country: e.country,
        projectName: e.projectName,
        serviceRequired: e.serviceRequired,
        projectValue: e.projectValue,
        status: e.status,
        additionalNote: e.additionalNote,
        status: "Pending",
        expenses: e.expenses?.map((e) => {
          const { _id, ...data } = e;
          return data;
        }),
      }));
    const existingSales = sales.filter((sale) => sale._id);
    const saleOperations = [
      // Update existing sales
      ...existingSales.map((sale) => ({
        updateOne: {
          filter: { _id: sale._id },
          update: { $set: sale },
          upsert: true,
        },
      })),
      // Insert new sales
      ...newSales.map((sale) => ({
        insertOne: {
          document: sale, // No _id required for new sales
        },
      })),
    ];
    // Collect sale ids to use in AuditLog operations
    const combinedSales = [...existingSales, ...newSales];
    const saleIds = [
      ...existingSales.map((sale) => sale._id),
      ...newSales.map(() => null),
    ];

    // Find existing logs for the sales that already have _id
    const existingLogs = await AuditLog.find(
      { resourceId: { $in: saleIds.filter((id) => id !== null) } },
      { resourceId: 1, details: 1 }
    ).lean();

    const loggedSaleMap = new Map(
      existingLogs.map((log) => [log.resourceId.toString(), log])
    );

    const logOperations = [];

    combinedSales.forEach((sale) => {
      const existingLog = loggedSaleMap.get(
        sale._id > 10 ? sale._id.toString() : null
      );
      const fieldsToTrack = ["status", "amount"];
      const changedFields = {};
      let hasChanges = false;

      if (existingLog) {
        fieldsToTrack.forEach((field) => {
          if (sale[field] !== existingLog.details[field]) {
            hasChanges = true;
            changedFields[field] = existingLog.details[field];
          }
        });
      } else {
        hasChanges = true;
      }

      if (hasChanges) {
        const action =
          sale.status === "Completed"
            ? "SALE_COMPLETED"
            : sale.status === "Cancelled"
            ? "SALE_CANCELLED"
            : sale.status === "Pending"
            ? "SALE_MARKED_PENDING"
            : "SALE_UPDATED";

        if (existingLog) {
          logOperations.push({
            updateOne: {
              filter: { _id: existingLog._id },
              update: {
                $set: {
                  action,
                  "details.status": sale.status,
                  "details.projectValue": sale.projectValue,
                  "details.projectName": sale.projectName,
                  "details.previousDetails": changedFields,
                  timestamp: new Date(),
                },
              },
            },
          });
        } else {
          logOperations.push({
            insertOne: {
              document: {
                userId: sale.userId,
                organizationId: sale.organizationId,
                action,
                resource: "Sales",
                resourceId: sale._id, // This will be generated after the sale insert if it's new
                details: {
                  status: sale.status,
                  projectValue: sale.projectValue,
                  projectName: sale.projectName,
                  previousDetails: null,
                },
                timestamp: new Date(),
              },
            },
          });
        }
      }
    });
    // Perform the bulk operations for sales and logs
    await Sale.bulkWrite(saleOperations);

    // If there are any log operations, perform them
    if (logOperations.length > 0) {
      await AuditLog.bulkWrite(logOperations);
    }

    return NextResponse.json(
      { success: true, message: "Sales and logs processed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing sales and logs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process sales and logs.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
