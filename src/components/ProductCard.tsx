import { useNavigate } from "react-router-dom";
import { DirectionAwareHover } from "./ui/direction-aware-hover";

export function ProductCard({
  id,
  picture,
  name,
  price,
  description,
  category,
}: {
  id: string;
  picture: string;
  name: string;
  price: string;
  description: string;
  category: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className="h-fit relative flex items-center justify-center"
      onClick={() => {
        navigate("/ProductPage", {
          state: { id, picture, name, price, description, category },
        });
      }}
    >
      <DirectionAwareHover imageUrl={"/" + picture}>
        <p className="font-imperial font-bold text-xl">{name}</p>
        <p className="font-normal text-sm">{price} €</p>
      </DirectionAwareHover>
    </div>
  );
}
