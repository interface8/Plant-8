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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { MarketplaceListing } from "@/types/marketplace";
import { LoadingSpinner } from "@/components/ui/loader";

export default function MyListingsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchMyListings();
    }
  }, [sessionStatus]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/marketplace/listings");
      // Filter for current user's listings
      const myListings = response.data.filter(
        (listing: MarketplaceListing) => 
          listing.investment?.userId === session?.user?.id
      );
      setListings(myListings);
    } catch (error) {
      toast.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await axios.delete(`/api/marketplace/listings/${id}`);
      toast.success("Listing deleted successfully");
      fetchMyListings();
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`/api/marketplace/listings/${id}`, { status: newStatus });
      toast.success("Listing status updated");
      fetchMyListings();
    } catch (error) {
      toast.error("Failed to update listing status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SOLD":
        return "bg-gray-100 text-gray-800";
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">My Listings</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Manage your marketplace listings
                </p>
              </div>
              <Button onClick={() => router.push("/marketplace/listing/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't created any listings yet
                </p>
                <Button onClick={() => router.push("/marketplace/listing/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Price per kg</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Negotiable</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">
                          {listing.product?.name}
                        </TableCell>
                        <TableCell>{listing.quantityKg}</TableCell>
                        <TableCell>₦{listing.pricePerKg.toLocaleString()}</TableCell>
                        <TableCell>₦{listing.totalValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {listing.isNegotiable ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/marketplace/${listing.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/marketplace/listing/edit/${listing.id}`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {listing.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(listing.id, "ACTIVE")
                                  }
                                >
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {listing.status === "ACTIVE" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(listing.id, "PENDING")
                                  }
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(listing.id)}
                                className="text-destructive"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
