import formidable from "formidable";
import fs from "fs-extra";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Désactivez l'analyse du corps par défaut de Next.js pour cette route
export const config = {
  api: {
    bodyParser: false,
  },
};

const form = formidable({
  uploadDir: path.join(process.cwd(), "public"),
  multiples: false, // Ensure single file upload
  keepExtensions: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filePath = path.join(process.cwd(), "public", "products.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  let products = JSON.parse(jsonData);

  if (req.method === "GET") {
    res.status(200).json(products);
  } else if (req.method === "POST") {
    form.parse(req, async (err, fields, files) => {
      console.log("fields", fields);
      console.log("files", files);
      if (err) {
        res.status(500).json({ message: "Error parsing form data" });
        return;
      }

      // Normalize fields to avoid accumulation of array values
      const { Name, Price, Description, Category } = fields;
      const Picture = files.Picture;

      console.log("Picture", Picture);

      const normalizedFields = {
        Name: Array.isArray(Name) ? Name[0] : Name,
        Price: Array.isArray(Price) ? Price[0] : Price,
        Description: Array.isArray(Description) ? Description[0] : Description,
        Category: Array.isArray(Category) ? Category[0] : Category,
        Picture: Array.isArray(Picture) ? Picture[0] : Picture,
      };

      console.log("normalizedFields", normalizedFields);

      if (
        !normalizedFields.Name ||
        !normalizedFields.Price ||
        !normalizedFields.Description ||
        !normalizedFields.Category ||
        !normalizedFields.Picture
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newProduct = {
        Id: uuidv4(),
        Picture: normalizedFields.Picture.newFilename,
        Name: normalizedFields.Name,
        Price: parseFloat(normalizedFields.Price as unknown as string),
        Description: normalizedFields.Description,
        Category: normalizedFields.Category,
      };

      products.push(newProduct);
      await fs.writeFile(filePath, JSON.stringify(products, null, 2));
      res.status(201).json({ message: "Product added successfully" });
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
