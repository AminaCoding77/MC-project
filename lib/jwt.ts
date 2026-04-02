import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
