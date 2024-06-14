import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "orders.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const jsonData = await fs.readFile(ordersFilePath, "utf8");
      const orders = JSON.parse(jsonData);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to read orders." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
