
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { products as localProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchProducts } from "@/services/productsService";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProducts().then((fetched) => {
      if (mounted) {
        setDbProducts(fetched);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Merge DB products and hardcoded only if db is empty (fallback to old)
  const allProducts = (dbProducts.length > 0 ? dbProducts : localProducts);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(allProducts.map(p => p.category)))];

  // Filter products based on search term
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ingredients.some((i: string) => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getCategoryProducts = (category: string) => {
    if (category === "all") {
      return filteredProducts;
    }
    return filteredProducts.filter(p => p.category === category);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-muted/40 border-b border-border py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">The Menu</span>
          <h1 className="font-display text-5xl md:text-7xl mt-3 mb-5 text-foreground">EVERY SIP, INTENTIONAL.</h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Cold-pressed juices and small-batch smoothies — made fresh every day.
          </p>
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search the menu..."
              className="pl-10 py-6 rounded-full bg-background border-border"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 py-2 capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              {getCategoryProducts(category).length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-semibold mb-2">No juices found</h3>
                  <p className="text-gray-500">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getCategoryProducts(category).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        )}
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/40 py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">Why It Matters</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">REAL FOOD. REAL RESULTS.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-background p-8 rounded-2xl border border-border">
              <h3 className="font-display text-lg mb-3 text-foreground tracking-wide">ENERGY</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Fresh juices provide an instant boost of vitamins and minerals that help fight fatigue and increase your energy levels naturally.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border">
              <h3 className="font-display text-lg mb-3 text-foreground tracking-wide">DIGESTION</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The enzymes in fresh juice aid digestion and help your body absorb nutrients more effectively.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border">
              <h3 className="font-display text-lg mb-3 text-foreground tracking-wide">GLOW</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Antioxidants in fresh juices help combat free radicals, leading to clearer, more radiant skin.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border">
              <h3 className="font-display text-lg mb-3 text-foreground tracking-wide">IMMUNITY</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Regular consumption of fresh juices strengthens your immune system and helps your body fight off illnesses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Menu;
