import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

export function generateJwt(
  payload: string | object | Buffer,
  secret: Secret,
  expireIn: SignOptions["expiresIn"],
) {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireIn,
  });
  return token;
}
