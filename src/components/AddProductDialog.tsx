import { Button } from "@/components/ui/button";
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
import { FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AddProductDialogProps {
  onAdd: () => void;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({
  onAdd,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const fileInput = form.elements.namedItem("Picture") as HTMLInputElement;
    const file = fileInput.files?.[0];
    console.log("file", file);

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const fileName = file.name;
    formData.set("Id", uuidv4());
    formData.append("Picture", file, fileName);

    console.log("file name", fileName);
    console.log("form data", formData);

    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      onAdd();
      setIsDialogOpen(false); // Fermer le dialog après ajout
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>
          Ajouter un produit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations suivantes pour ajouter un nouveau
            produit.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAdd} encType="multipart/form-data">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Picture" className="text-right">
                Photo
              </Label>
              <Input
                id="Picture"
                name="Picture"
                type="file"
                accept="image/*"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Name" className="text-right">
                Nom
              </Label>
              <Input
                id="Name"
                name="Name"
                type="text"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Price" className="text-right">
                Prix
              </Label>
              <Input
                id="Price"
                name="Price"
                type="number"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Description" className="text-right">
                Description
              </Label>
              <Input
                id="Description"
                name="Description"
                type="text"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Category" className="text-right">
                Catégorie
              </Label>
              <Input
                id="Category"
                name="Category"
                type="text"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
