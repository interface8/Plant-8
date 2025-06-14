"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import TestimonyForm from "./testimony-form";
import TestimonyTable from "./testimony-table";
import { Testimony } from "@/types/testimony";
import { testimonySchema } from "@/lib/validators";

type FormData = {
  investorName: string;
  comment: string;
  rating: number;
  location: string;
  isApproved: boolean;
};

export default function TestimonyManager() {
  const [items, setItems] = useState<Testimony[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(testimonySchema),
    defaultValues: {
      investorName: "",
      comment: "",
      rating: 5,
      location: "",
      isApproved: false,
    },
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/testimonials");
      setItems(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch testimonies");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await axios.put(`/api/testimonials/${editingId}`, data);
      } else {
        await axios.post("/api/testimonials", data);
      }
      reset();
      setEditingId(null);
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to save testimony");
    }
  };

  const handleEdit = (item: Testimony) => {
    setEditingId(item.id);
    setValue("investorName", item.investorName);
    setValue("comment", item.comment);
    setValue("rating", item.rating);
    setValue("location", item.location);
    setValue("isApproved", item.isApproved);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/testimonials/${id}`);
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to delete testimony");
    }
  };

  const handleCancel = () => {
    reset();
    setValue("investorName", "");
    setValue("comment", "");
    setValue("rating", 5);
    setValue("location", "");
    setValue("isApproved", false);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Testimony Manager</h1>
      <TestimonyForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        isEditing={!!editingId}
      />
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      <TestimonyTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
