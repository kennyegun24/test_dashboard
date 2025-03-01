import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const verifyToken = (req) => {
  return new Promise((resolve, reject) => {
    const header = req.headers?.get("authorization");
    if (header) {
      const token = header.split(" ")[1];
      jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
          return reject({
            isValid: false,
            message: "Token not valid",
          });
        }
        req.user = user;
        resolve(true);
      });
    } else {
      reject({ isValid: false });
    }
  });
};

export const verifyTokenAndAuthz = async (req, userId) => {
  try {
    await verifyToken(req);
    // console.log(userId);
    if (req?.user?.id === userId || req?.user?.is_admin) {
      return { isValid: true, id: req?.user?.id };
    } else {
      return { isValid: false };
    }
  } catch (err) {
    return { isValid: false };
  }
};

export const verifyAdminToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req?.user?.is_admin) {
      return NextResponse.json({ isValid: true });
    } else {
      return NextResponse.json({ isValid: false });
    }
  });
};

export const checkIfUserIsValid = (verify, userId) => {
  if (!verify.isValid) return { message: "Authentication issues", status: 401 };
  if (verify.id !== userId) return { message: "Conflicted data!", status: 401 };
};
