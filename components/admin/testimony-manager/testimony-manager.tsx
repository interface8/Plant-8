"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import TestimonyForm from "./testimony-form";
import TestimonyTable from "./testimony-table";
import { Testimony } from "@/types/testimony";
import { testimonySchema } from "@/lib/validators/testimony-schema-validators";
import { GlobalModal } from "@/components/admin/global-modal";
import { Plus, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      const response = await axios.get("/api/testimonials?admin=true");
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

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/testimonials/${id}`, {
        isApproved: !currentStatus,
      });
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to update approval status");
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleEditWithModal = (item: Testimony) => {
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
  const approvedCount = items.filter(i => i.isApproved).length;
  const pendingCount = items.filter(i => !i.isApproved).length;
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredItems = statusFilter === "approved"
    ? items.filter(i => i.isApproved)
    : statusFilter === "pending"
    ? items.filter(i => !i.isApproved)
    : items;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Testimony Manager</h1>
          <p className="text-green-700">Manage and approve customer testimonials.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Testimony
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
                <p className="text-sm font-medium text-gray-600 mb-1">All Testimonies</p>
                <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            statusFilter === "approved" ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => setStatusFilter("approved")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            statusFilter === "pending" ? 'border-yellow-500 shadow-lg' : 'border-gray-200 hover:border-yellow-300'
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500 text-sm mt-4 p-4 bg-red-50 rounded-lg">{error}</p>}
      
      <TestimonyTable
        items={filteredItems}
        onEdit={handleEditWithModal}
        onDelete={handleDelete}
        onToggleApproval={handleToggleApproval}
      />

      <GlobalModal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingId ? "Edit Testimony" : "Add Testimony"}
        size="lg"
      >
        <TestimonyForm
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
