import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "orders.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const jsonData = await fs.readFile(ordersFilePath, "utf8");
      const orders = JSON.parse(jsonData);
      const orderIndex = orders.findIndex((order: any) => order.id === id);

      if (orderIndex === -1) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = { ...orders[orderIndex], ...req.body };
      orders[orderIndex] = updatedOrder;

      await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order." });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
