"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackToListButtonProps {
  href: string;
  label?: string;
}

export function BackToListButton({ href, label = "Back to List" }: BackToListButtonProps) {
  return (
    <Button asChild variant="outline" size="sm" className="mb-4">
      <Link href={href} className="flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}
