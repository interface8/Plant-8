"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { fetchListings } from "@/store/slices/marketplace/listingsSlice";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";
import { useMarketplaceSocket } from "@/hooks/use-marketplace-socket";
import { MarketplaceListing } from "@/types/marketplace";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loader";

export default function MarketplacePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { listings, status } = useSelector((state: RootState) => state.marketplace);

  // Initialize socket connection for real-time updates
  useMarketplaceSocket();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchListings() as any);
    }
  }, [status, dispatch]);

  const handleListingClick = (listing: MarketplaceListing) => {
    router.push(`/marketplace/${listing.id}`);
  };

  const handleViewCart = () => {
    router.push("/marketplace/cart");
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <MarketplaceGrid
      listings={listings}
      onListingClick={handleListingClick}
      onViewCart={handleViewCart}
    />
  );
}
