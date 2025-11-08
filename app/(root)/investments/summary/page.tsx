"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import InvestmentSummaryForm from "@/components/investment/investmentSummaryForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvestmentSummaryPage() {
  const router = useRouter();
  const investment = useSelector((state: RootState) => state.investment);
  const [product, setProduct] = useState(null);
  const [land, setLand] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if required investment data is missing
    if (!investment.productId || !investment.landId || !investment.durationId) {
      setIsRedirecting(true);
      router.replace("/investments");
      return;
    }

    async function fetchData() {
      const [productRes, landRes, durationRes] = await Promise.all([
        fetch(`/api/products/${investment.productId}`).then(r => r.json()),
        fetch(`/api/lands/${investment.landId}`).then(r => r.json()),
        fetch(`/api/durations/${investment.durationId}`).then(r => r.json()),
      ]);
      setProduct(productRes);
      setLand(landRes);
      setDuration(durationRes);
    }
    fetchData();
  }, [investment.productId, investment.landId, investment.durationId, router]);

  if (isRedirecting) {
    return null;
  }

  if (!product || !land || !duration) {
    return <div className="text-center py-10">Loading investment details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <InvestmentSummaryForm />
    </div>
  );
}
