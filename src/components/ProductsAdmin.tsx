import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import AddProductDialog from "./AddProductDialog"; // Assurez-vous d'importer le composant
import Footer from "./Footer";
import HeaderAdmin from "./HeaderAdmin";
import { Button } from "./ui/button";

interface Product {
  Id: string;
  Picture: string;
  Name: string;
  Price: string;
  Description: string;
  Category: string;
}

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = async (
    e: FormEvent<HTMLFormElement>,
    productId: string
  ) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { name, price, description, category } = form.elements as any;

    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name.value,
        Price: price.value,
        Description: description.value,
        Category: category.value,
      }),
    });

    if (response.ok) {
      await fetchProducts();
      setCurrentProduct(null);
    }
  };

  const handleDelete = async (productId: string) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchProducts();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin />
      <div className="flex-grow px-4 py-8">
        <AddProductDialog onAdd={fetchProducts} />{" "}
        {/* Ajoutez ce composant ici */}
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Modifier</TableHead>
              <TableHead>Supprimer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{product.Id}</TableCell>
                <TableCell>
                  <Image
                    src={"/" + product.Picture}
                    alt="produit"
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.Name}</TableCell>
                <TableCell>{product.Price}</TableCell>
                <TableCell>{product.Description}</TableCell>
                <TableCell>{product.Category}</TableCell>
                <TableCell className="">
                  <Dialog>
                    <DialogTrigger>
                      <Button onClick={() => setCurrentProduct(product)}>
                        <Pencil />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Modifier le produit</DialogTitle>
                        <DialogDescription>
                          Apportez les modifications nécessaires, puis cliquez
                          sur &quot;Modifier&quot;.
                        </DialogDescription>
                      </DialogHeader>
                      {currentProduct && currentProduct.Id === product.Id && (
                        <form onSubmit={(e) => handleEdit(e, product.Id)}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Nom
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                defaultValue={product.Name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="price" className="text-right">
                                Prix
                              </Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                defaultValue={product.Price}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="description"
                                className="text-right"
                              >
                                Description
                              </Label>
                              <Input
                                id="description"
                                name="description"
                                defaultValue={product.Description}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="category" className="text-right">
                                Catégorie
                              </Label>
                              <Input
                                id="category"
                                name="category"
                                defaultValue={product.Category}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Modifier</Button>
                          </DialogFooter>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="">
                  <Button onClick={() => handleDelete(product.Id)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Footer />
    </div>
  );
}
