
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
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
          <span className="font-medium text-foreground whitespace-nowrap">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
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
