import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filePath = path.join(process.cwd(), "public", "products.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  let products = JSON.parse(jsonData);

  if (req.method === "PUT") {
    const { id } = req.query;
    const { Name, Price, Description, Category } = req.body;

    products = products.map((product: { Id: string }) => {
      return product.Id === id
        ? { ...product, Name, Price, Description, Category }
        : product;
    });

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    return res.status(200).json({ message: "Product updated successfully" });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    console.log("id", id);

    products = products.filter((product: { Id: string }) => product.Id !== id);
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    return res.status(200).json({ message: "Product deleted successfully" });
  } else if (req.method === "POST") {
    const { Id, Picture, Name, Price, Description, Category } = req.body;

    // Validation simple des données
    if (!Id || !Name || !Price || !Description || !Category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Vérifiez si l'Id est unique
    const existingProduct = products.find(
      (product: { Id: string }) => product.Id === Id
    );
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this ID already exists" });
    }

    // Ajouter le nouveau produit
    const newProduct = {
      Id: Id,
      Picture,
      Name,
      Price: parseFloat(Price),
      Description,
      Category,
    };
    products.push(newProduct);

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    return res.status(201).json({ message: "Product added successfully" });
  } else {
    res.setHeader("Allow", ["PUT", "DELETE", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
