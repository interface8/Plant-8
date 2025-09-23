// This page is not used. Redirect or show a message.
import React from "react";
import { redirect } from "next/navigation";

export default function ProductsAllPage() {
  // Option 1: Redirect automatically
  redirect("/admin/products");
  // Option 2: Show a message (unreachable if redirect is used)
  // return <div>Redirecting to products...</div>;
}
