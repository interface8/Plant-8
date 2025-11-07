"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Order } from "@/types/marketplace";
import { LoadingSpinner } from "@/components/ui/loader";
import { Package, ArrowLeft } from "lucide-react";

export default function OrdersPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchMyOrders();
    }
  }, [sessionStatus]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/marketplace/orders");
      // Filter for current user's orders
      const myOrders = response.data.filter(
        (order: Order) => order.buyerId === session?.user?.id
      );
      setOrders(myOrders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (sessionStatus === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/marketplace")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Orders</CardTitle>
            <p className="text-muted-foreground mt-1">
              Track your marketplace orders
            </p>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet
                </p>
                <Button onClick={() => router.push("/marketplace")}>
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.orderItems?.map((item, idx) => (
                              <div key={item.id} className="text-sm">
                                <span className="font-medium">
                                  {item.listing?.product?.name || "Product"}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}({item.quantityKg}kg × ₦{item.pricePerKg.toLocaleString()})
                                </span>
                              </div>
                            ))}
                            {(!order.orderItems || order.orderItems.length === 0) && (
                              <span className="text-muted-foreground">No items</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₦{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/marketplace/orders/${order.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
