import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/services/productsService";
import { Product } from "@/types";
import allSmoothiesImg from "@/assets/all-smoothies.jpeg";

const Index = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [featuredBowls, setFeaturedBowls] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((p) => {
      const smoothies = p.filter((item) => item.category !== "bowl");
      const bowls = p.filter((item) => item.category === "bowl");
      setFeatured(smoothies.slice(0, 3));
      setFeaturedBowls(bowls.slice(0, 3));
    });
  }, []);

  return (
    <Layout>
      {/* Hero — editorial split */}
      <section className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">Est. 2023 — Juice Bar</span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mt-4 mb-6 text-foreground">
              FRESH<br />
              EVERY<br />
              <em className="font-serif italic font-normal text-foreground/70">single sip.</em>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Cold-pressed juices and small-batch smoothies, blended with whole, real ingredients. No shortcuts. Just the good stuff.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/menu")}
                className="juice-button bg-foreground text-background hover:bg-foreground/90 uppercase text-xs tracking-[0.2em]"
              >
                Order Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/menu")}
                variant="outline"
                className="juice-button border-foreground/20 text-foreground hover:bg-foreground hover:text-background uppercase text-xs tracking-[0.2em]"
              >
                See the Menu
              </Button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
              <img src={allSmoothiesImg} alt="Lifestyle 1104 signature smoothie lineup" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 bg-background border border-border px-5 py-3 rounded-full shadow-sm">
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">100% Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee-style values */}
      <section className="border-y border-border bg-muted/40 py-6 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-wrap justify-around gap-y-3 items-center text-foreground">
          {["Cold-Pressed", "Whole Ingredients", "No Added Sugar", "Made Daily", "Locally Sourced"].map((t) => (
            <span key={t} className="font-display text-sm md:text-base tracking-[0.3em]">
              ✦ {t.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">The Lineup</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">SIGNATURE BLENDS</h2>
          </div>
          <Button
            onClick={() => navigate("/menu")}
            variant="ghost"
            className="self-start md:self-auto uppercase text-xs tracking-[0.2em] text-foreground hover:bg-transparent hover:underline"
          >
            View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {featured.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">Loading menu…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Signature Bowls */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">The Lineup</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-foreground">SIGNATURE BOWLS</h2>
          </div>
          <Button
            onClick={() => navigate("/menu")}
            variant="ghost"
            className="self-start md:self-auto uppercase text-xs tracking-[0.2em] text-foreground hover:bg-transparent hover:underline"
          >
            View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {featuredBowls.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">Loading bowls…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredBowls.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Philosophy */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[11px] tracking-[0.35em] text-background/60 uppercase">The Philosophy</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 mb-6">A LIFESTYLE,<br /><em className="italic font-serif font-normal text-background/80">not a trend.</em></h2>
            <p className="text-background/70 leading-relaxed mb-6">
              Lifestyle 1104 was built on a simple idea: feeling good shouldn't be complicated. Every cup is crafted with intention — real fruit, real vegetables, real nutrition.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div>
                <Leaf className="h-6 w-6 mb-3 text-background/80" />
                <p className="text-xs tracking-[0.15em] uppercase text-background/60">Whole<br />Ingredients</p>
              </div>
              <div>
                <Sparkles className="h-6 w-6 mb-3 text-background/80" />
                <p className="text-xs tracking-[0.15em] uppercase text-background/60">Cold<br />Pressed</p>
              </div>
              <div>
                <Heart className="h-6 w-6 mb-3 text-background/80" />
                <p className="text-xs tracking-[0.15em] uppercase text-background/60">Made<br />With Love</p>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] tracking-[0.35em] text-background/60 uppercase">Why It Matters</span>
            <h3 className="font-display text-3xl md:text-4xl mt-2 mb-8">REAL FOOD.<br />REAL RESULTS.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background/5 border border-background/15 p-6 rounded-2xl">
                <h4 className="font-display text-base mb-2 tracking-wide">ENERGY</h4>
                <p className="text-background/70 text-sm leading-relaxed">
                  Fresh juices provide an instant boost of vitamins and minerals that help fight fatigue and increase your energy levels naturally.
                </p>
              </div>
              <div className="bg-background/5 border border-background/15 p-6 rounded-2xl">
                <h4 className="font-display text-base mb-2 tracking-wide">DIGESTION</h4>
                <p className="text-background/70 text-sm leading-relaxed">
                  The enzymes in fresh juice aid digestion and help your body absorb nutrients more effectively.
                </p>
              </div>
              <div className="bg-background/5 border border-background/15 p-6 rounded-2xl">
                <h4 className="font-display text-base mb-2 tracking-wide">GLOW</h4>
                <p className="text-background/70 text-sm leading-relaxed">
                  Antioxidants in fresh juices help combat free radicals, leading to clearer, more radiant skin.
                </p>
              </div>
              <div className="bg-background/5 border border-background/15 p-6 rounded-2xl">
                <h4 className="font-display text-base mb-2 tracking-wide">IMMUNITY</h4>
                <p className="text-background/70 text-sm leading-relaxed">
                  Regular consumption of fresh juices strengthens your immune system and helps your body fight off illnesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <span className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">Ready?</span>
        <h2 className="font-display text-4xl md:text-6xl mt-3 mb-6 text-foreground">SIP THE DIFFERENCE.</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">Order ahead for pickup or delivery. Your daily glow is one tap away.</p>
        <Button
          onClick={() => navigate("/menu")}
          className="juice-button bg-foreground text-background hover:bg-foreground/90 uppercase text-xs tracking-[0.2em]"
        >
          Start Your Order <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </Layout>
  );
};

export default Index;
