
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

type JuiceSize = "16oz" | "24oz";
const SIZE_UPCHARGE: Record<JuiceSize, number> = { "16oz": 0, "24oz": 2 };

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const isJuice = product.category === "juice";
  const [size, setSize] = useState<JuiceSize>("16oz");

  const displayPrice = isJuice ? product.price + SIZE_UPCHARGE[size] : product.price;

  const handleAddToCart = () => {
    if (isJuice) {
      addToCart({
        ...product,
        id: `${product.id}-${size}`,
        name: `${product.name} (${size})`,
        price: product.price + SIZE_UPCHARGE[size],
      });
    } else {
      addToCart(product);
    }
  };

  return (
    <Card className={cn("juice-card h-full flex flex-col group border-0 shadow-none bg-transparent", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
        />
        <span className="absolute top-3 left-3 text-[10px] tracking-[0.25em] uppercase bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full">
          {product.category}
        </span>
      </div>
      <CardContent className="pt-5 px-1 flex-grow">
        <div className="flex justify-between items-baseline mb-2 gap-3">
          <h3 className="font-display text-xl tracking-wide text-foreground">{product.name.toUpperCase()}</h3>
          <span className="font-medium text-foreground whitespace-nowrap">${displayPrice.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
        {isJuice && (
          <div className="mt-4 flex gap-2">
            {(["16oz", "24oz"] as JuiceSize[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "flex-1 text-xs tracking-[0.15em] uppercase py-2 rounded-full border transition-colors",
                  size === s
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 px-1">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 tracking-[0.15em] text-xs uppercase"
        >
          <Plus className="mr-2 h-4 w-4" /> Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
