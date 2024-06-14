import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "./CartContext";
import { useOrder } from "./OrderContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function CartDrawer({ cartCount }: { cartCount: number }) {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { addOrder } = useOrder();

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    deliveryAddress: "",
    phoneNumber: "",
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      addToCart({ ...product, quantity });
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, product) => {
        const price = parseFloat(product.price);
        return total + price * (product.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const createOrderSummary = () => {
    return cart
      .map(
        (product) =>
          `${product.name} - ${product.quantity} x ${product.price} €`
      )
      .join("\n");
  };

  const handleCheckout = async () => {
    // Validation: Check if all fields are filled
    const { firstName, lastName, email, deliveryAddress, phoneNumber } =
      customerInfo;
    if (!firstName || !lastName || !email || !deliveryAddress || !phoneNumber) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newOrder = {
      id: uuidv4(),
      items: cart,
      total: calculateTotal(),
      date: new Date(),
      customerInfo,
    };
    addOrder(newOrder);
    clearCart();

    const orderSummary = createOrderSummary();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error("Error saving order");
      }

      // Send email
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerInfo, orderSummary }),
      });

      if (!emailResponse.ok) {
        throw new Error("Error sending email");
      }

      console.log("Emails envoyés", newOrder);
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de la commande ou de l'envoi des emails:",
        error
      );
    }
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative">
          <ShoppingCart className="cursor-pointer" />
          {cartCount > 0 && (
            <span className="absolute top-2 right-6 px-3 py-2 text-center text-xs font-bold text-white bg-red-500 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>Votre panier</DrawerTitle>
          <DrawerDescription>
            Vous pouvez consulter le contenu de votre panier
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          {cart.length > 0 ? (
            <>
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between space-x-4 border rounded p-4"
                >
                  <Image
                    src={"/" + product.picture}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                  <div className="flex flex-col flex-grow">
                    <span className="font-semibold">{product.name}</span>
                    <span>{product.price} €</span>
                  </div>
                  <div className="w-24">
                    <Select
                      value={product.quantity?.toString() || "1"}
                      onValueChange={(value) =>
                        handleQuantityChange(product.id, parseInt(value, 10))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Quantité" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(Array(10).keys()).map((i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(product.id)}
                    className="ml-4"
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <p>Votre panier est vide</p>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t">
            <span className="font-semibold">Total: {calculateTotal()} €</span>
          </div>
        )}

        <DrawerFooter className="flex flex-col items-center space-y-4">
          {cart.length > 0 && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full max-w-xs">Valider le panier</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Informations Client</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations ci-dessous pour valider votre
                      commande.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Prénom
                      </Label>
                      <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nom
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Adresse-mail
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="deliveryAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Lieu de livraison
                      </Label>
                      <Input
                        type="text"
                        name="deliveryAddress"
                        id="deliveryAddress"
                        value={customerInfo.deliveryAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Numéro de Téléphone
                      </Label>
                      <Input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={customerInfo.phoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCheckout}>
                      Confirmer la commande
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                className="w-full max-w-xs"
                onClick={clearCart}
              >
                Vider le panier
              </Button>
            </>
          )}
          <DrawerClose className="w-full max-w-xs">Fermer</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
