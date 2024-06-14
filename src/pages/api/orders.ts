import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// Disable the default body parser to handle JSON manually
export const config = {
  api: {
    bodyParser: false,
  },
};

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
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { id, items, total, date, customerInfo } = JSON.parse(body);
        const newOrder = {
          id,
          items,
          total,
          date,
          ...customerInfo,
          check: false,
        };

        const jsonData = await fs.readFile(ordersFilePath, "utf8");
        const orders = JSON.parse(jsonData);
        orders.push(newOrder);
        await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));

        res.status(201).json({ message: "Order saved successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to save order." });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
