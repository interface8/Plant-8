"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import CarouselForm from "./carousel-form";
import CarouselTable from "./carousel-table";
import { CarouselItem } from "../../types/carousel";
import { carouselSchema } from "@/lib/validators/carousel-schema-validators";
import { GlobalModal } from "@/components/admin/global-modal";
import { Plus, Package, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type FormData = z.infer<typeof carouselSchema>;

export default function CarouselManager() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(carouselSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      link: "",
      description: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      isActive: true,
      type: "homepage",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/carousel");
      setItems(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch carousel items");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await axios.put(`/api/carousel/${editingId}`, data);
      } else {
        await axios.post("/api/carousel", data);
      }
      reset();
      setEditingId(null);
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to save carousel item");
    }
  };

  const handleEdit = (item: CarouselItem) => {
    setEditingId(item.id);
    setValue("title", item.title);
    setValue("imageUrl", item.imageUrl);
    setValue("link", item.link || "");
    setValue("description", item.description);
    setValue("startDate", new Date(item.startDate).toISOString().slice(0, 16));
    setValue("endDate", new Date(item.endDate).toISOString().slice(0, 16));
    setValue("isActive", item.isActive);
    setValue("type", item.type);
    setValue("sortOrder", item.sortOrder);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/carousel/${id}`);
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to delete carousel item");
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  const [showModal, setShowModal] = useState(false);

  const handleEditWithModal = (item: CarouselItem) => {
    handleEdit(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    handleCancel();
    setShowModal(false);
  };

  const handleSubmitWithModal = async (data: FormData) => {
    await onSubmit(data);
    setShowModal(false);
  };

  // Filter stats
  const activeCount = items.filter(i => i.isActive).length;
  const inactiveCount = items.filter(i => !i.isActive).length;
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredItems = statusFilter === "active"
    ? items.filter(i => i.isActive)
    : statusFilter === "inactive"
    ? items.filter(i => !i.isActive)
    : items;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Carousel Manager</h1>
          <p className="text-green-700">Manage homepage and page carousels.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Carousel Item
        </button>
      </div>

      {/* Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer border-2 transition-all ${
            statusFilter === null ? 'border-green-500 shadow-lg' : 'border-gray-200 hover:border-green-300'
          }`}
          onClick={() => setStatusFilter(null)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">All Items</p>
                <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            statusFilter === "active" ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => setStatusFilter("active")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            statusFilter === "inactive" ? 'border-gray-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setStatusFilter("inactive")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Inactive</p>
                <p className="text-3xl font-bold text-gray-900">{inactiveCount}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500 text-sm mt-4 p-4 bg-red-50 rounded-lg">{error}</p>}
      
      <CarouselTable
        items={filteredItems}
        onEdit={handleEditWithModal}
        onDelete={handleDelete}
      />

      <GlobalModal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingId ? "Edit Carousel Item" : "Add Carousel Item"}
        size="lg"
      >
        <CarouselForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(handleSubmitWithModal)}
          onCancel={handleModalClose}
          isEditing={!!editingId}
        />
      </GlobalModal>
    </div>
  );
}
