import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  preparing: "bg-blue-500",
  ready: "bg-purple-500",
  delivered: "bg-green-500",
  completed: "bg-gray-500",
};

const statusMessages: Record<string, string> = {
  pending: "Your order has been received",
  preparing: "Your order is being prepared",
  ready: "Your order is ready for pickup/delivery",
  delivered: "Your order has been delivered",
  completed: "Your order is complete",
};

const TrackOrder = () => {
  const [params] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("id") ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ order: any; items: any[] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error("Please enter your order ID.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("lookup-order", {
        body: { orderId: orderId.trim(), email: email.trim(), phone: phone.trim() },
      });
      if (error || !data?.order) {
        toast.error(data?.error || error?.message || "No order found.");
        return;
      }
      setResult({ order: data.order, items: data.items || [] });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const order = result?.order;
  const items = result?.items ?? [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Order Lookup</span>
            <h1 className="font-display text-3xl md:text-4xl mt-2">Track Your Order</h1>
            <p className="text-muted-foreground text-sm mt-3">
              Enter your order ID. Add the email or phone from checkout only if we ask for it.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. a1b2c3 or full ID"
                    maxLength={64}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can enter the full ID or just the last few characters shown on your confirmation.
                  </p>
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    maxLength={255}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    maxLength={32}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Looking up…</>
                  ) : (
                    <><Search className="h-4 w-4 mr-2" /> Look up order</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {order && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-5)}</CardTitle>
                    <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
                  </div>
                  <Badge className={`${statusColors[order.status] || "bg-gray-500"} text-white capitalize`}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {statusMessages[order.status] || ""}
                </p>

                <ul className="space-y-2">
                  {items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.products?.name ?? "Item"}
                      </span>
                      <span className="text-muted-foreground">
                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Separator className="my-4" />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${Number(order.total_amount).toFixed(2)}</span>
                </div>

                {order.order_details && (
                  <div className="mt-4 text-sm text-muted-foreground space-y-1">
                    {order.order_details.deliveryMethod && (
                      <p>
                        <span className="font-medium text-foreground">Method:</span>{" "}
                        <span className="capitalize">{order.order_details.deliveryMethod}</span>
                      </p>
                    )}
                    {order.order_details.pickupLocation && (
                      <p>
                        <span className="font-medium text-foreground">Pickup:</span>{" "}
                        {order.order_details.pickupLocation}
                      </p>
                    )}
                    {order.order_details.address && (
                      <p>
                        <span className="font-medium text-foreground">Shipping to:</span>{" "}
                        {order.order_details.address}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;