"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, Calendar, Package, AlertCircle } from "lucide-react";

interface PreTask {
  id: string;
  title: string;
  description: string | null;
  estimatedCompletionDate: Date | null;
  createdAt: Date;
  product: {
    id: string;
    name: string;
  } | null;
}

interface PreTaskTableProps {
  preTasks: PreTask[];
  products: { id: string; name: string }[];
}

export default function PreTaskTable({ preTasks, products }: PreTaskTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    estimatedCompletionDate: "",
    productId: "",
  });

  const handleEdit = (preTask: PreTask) => {
    setEditingId(preTask.id);
    setEditData({
      title: preTask.title,
      description: preTask.description || "",
      estimatedCompletionDate: preTask.estimatedCompletionDate 
        ? new Date(preTask.estimatedCompletionDate).toISOString().split('T')[0]
        : "",
      productId: preTask.product?.id || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({
      title: "",
      description: "",
      estimatedCompletionDate: "",
      productId: "",
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!editData.productId) {
      toast.error("Product selection is required");
      return;
    }

    const loadingToast = toast.loading("Updating pre-task...", {
      description: "Please wait while we save your changes.",
    });

    try {
      const response = await fetch(`/api/pre-tasks?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description || undefined,
          estimatedCompletionDate: editData.estimatedCompletionDate
            ? new Date(editData.estimatedCompletionDate)
            : undefined,
          productId: editData.productId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Pre-task updated successfully!", {
          description: `"${editData.title}" has been updated.`,
        });
        
        setEditingId(null);
        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to update pre-task.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to update pre-task", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to update pre-task. Please try again.",
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    // Confirmation toast
    toast.custom(
      (t) => (
        <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                confirmDelete(id, title);
              }}
              className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (id: string, title: string) => {
    const loadingToast = toast.loading("Deleting pre-task...", {
      description: "Please wait while we remove the pre-task.",
    });

    try {
      const response = await fetch(`/api/pre-tasks?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Pre-task deleted successfully!", {
          description: `"${title}" has been removed from the system.`,
        });
        
        router.refresh();
      } else {
        const errorMessage = result.error || "Failed to delete pre-task.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to delete pre-task", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to delete pre-task. Please try again.",
      });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  if (preTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pre-tasks found</h3>
        <p className="text-gray-500">Create your first pre-task using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Pre-Tasks ({preTasks.length})</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {preTasks.map((preTask) => (
              <tr key={preTask.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === preTask.id ? (
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{preTask.title}</div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === preTask.id ? (
                    <select
                      value={editData.productId}
                      onChange={(e) => setEditData({ ...editData, productId: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900">{preTask.product?.name || "No product"}</div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === preTask.id ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                    />
                  ) : (
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {preTask.description || "No description"}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === preTask.id ? (
                    <input
                      type="date"
                      value={editData.estimatedCompletionDate}
                      onChange={(e) => setEditData({ ...editData, estimatedCompletionDate: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(preTask.estimatedCompletionDate)}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(preTask.createdAt)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === preTask.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpdate(preTask.id)}
                        className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(preTask)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit pre-task"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(preTask.id, preTask.title)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete pre-task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}