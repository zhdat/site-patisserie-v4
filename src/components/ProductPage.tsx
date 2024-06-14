import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CircleArrowLeft } from "lucide-react";
import Image from "next/image";
import { SVGProps, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import { useCart } from "./CartContext";
import Footer from "./Footer";
import Header from "./Header";
import { useToast } from "./ui/use-toast";

export function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  // Vérifier si location.state est nul
  useEffect(() => {
    if (!location.state) {
      navigate("/ProductsPage"); // Rediriger vers la page des produits si l'état est nul
    }
  }, [location, navigate]);

  if (!location.state) {
    return null; // Rendre null si l'état est nul pour éviter les erreurs de rendu
  }

  const { picture, name, price, description, category } = location.state;

  const handleAddToCart = () => {
    console.log("Add to cart");
    const product = { ...location.state, quantity };
    addToCart(product);
  };

  return (
    <div>
      <Header />
      <div
        className="ml-8 cursor-pointer w-fit"
        onClick={() => {
          navigate("/ProductsPage");
        }}
      >
        <CircleArrowLeft className="w-10 h-10" />
      </div>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="grid gap-4">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Image
                  src={"/" + picture}
                  width={600}
                  height={600}
                  alt="Product Image"
                  className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src={"/" + picture}
                  width={600}
                  height={600}
                  alt="Product Image"
                  className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src={"/" + picture}
                  width={600}
                  height={600}
                  alt="Product Image"
                  className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="grid gap-4 md:gap-10 items-start ml-6">
          <div className="grid gap-4">
            <h1 className="font-bold font-imperial text-3xl lg:text-4xl">
              {name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
            </div>
            <div className="text-4xl font-bold">{price} €</div>
            <div>
              <p>{description}</p>
              <p>{category}</p>
            </div>
          </div>
          <form
            className="grid gap-4 md:gap-10"
            onSubmit={(e) => {
              e.preventDefault(); // Empêcher la soumission du formulaire par défaut
              handleAddToCart();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-base">
                Quantité
              </Label>
              <Select
                value={quantity.toString()}
                onValueChange={(value) => setQuantity(parseInt(value, 10))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              size="lg"
              type="submit"
              onClick={() => {
                toast({
                  title: "Produit ajouté au panier ✅",
                  description:
                    "Le produit " + name + " a bien été ajouté au panier",
                });
              }}
            >
              Ajouter au panier
            </Button>
          </form>
          <Separator />
          <div className="grid gap-4 text-sm leading-loose">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate molestias odit nulla asperiores incidunt illo cum quae
              amet, aut impedit repellat quisquam ad alias harum! Facere, rem?
              Voluptatem, modi facilis!
            </p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              accusamus repudiandae libero cupiditate perspiciatis. Odit sequi
              nobis pariatur facilis at, laudantium, odio nesciunt voluptatum
              exercitationem deserunt optio earum blanditiis id.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
