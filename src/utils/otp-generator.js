import crypto from "crypto";
export const generateOTP = () => {
  return crypto.randomBytes(6).toString("hex");
};
