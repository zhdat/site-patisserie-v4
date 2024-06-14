import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

const users = [
  {
    username: "admin",
    password: "$2a$12$7HIFd60oNGCphYzdH84tvuH9GVW9U8YTAm16lXW3auOsic6pWEcoy",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  const token = jwt.sign({ username: user.username }, "your_jwt_secret_key", {
    expiresIn: "10h",
  });

  return res.status(200).json({ token });
}
