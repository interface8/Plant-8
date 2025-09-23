import React from "react";

interface ProductHeaderProps {
  onAdd?: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ onAdd }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">Products</h1>
    <button
      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
      onClick={onAdd}
    >
      Add New Product
    </button>
  </div>
);
