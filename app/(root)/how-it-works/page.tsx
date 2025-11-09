"use client";

import { useRouter } from "next/navigation";
import { BuyerWorkflow } from "@/components/home/buyer-workflow";

export default function HowItWorksPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/investments/catalog");
  };

  return <BuyerWorkflow onGetStarted={handleGetStarted} />;
}
