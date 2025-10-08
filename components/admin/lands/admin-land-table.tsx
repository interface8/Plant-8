"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, MapPin, Banknote, AlertCircle, Building } from "lucide-react";

interface Land {
  id: string;
  name: string;
  gpsCoordinates: string | null;
  halfPlotPrice: number;
  fullPlotPrice: number;
  imageUrl: string | null;
  createdAt: Date;
  location: {
    id: string;
    name: string;
    state: {
      id: string;
      name: string;
    } | null;
  } | null;
}

interface AdminLandTableProps {
  lands: Land[];
}

export default function AdminLandTable({ lands }: AdminLandTableProps) {
  const router = useRouter();

  const handleEdit = (land: Land) => {
    router.push(`/admin/lands/${land.id}/edit`);
  };

  const handleDelete = async (id: string, name: string) => {
    // Confirmation toast
    toast.custom(
      (t) => (
        <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete &quot;{name}&quot;? This action cannot be undone.
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
                confirmDelete(id, name);
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

  const confirmDelete = async (id: string, name: string) => {
    const loadingToast = toast.loading("Deleting land...", {
      description: "Please wait while we remove the land.",
    });

    try {
      const response = await fetch(`/api/admin/lands?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Land deleted successfully!", {
          description: `"${name}" has been removed from the system.`,
        });
        
        router.refresh();
      } else {
        const errorMessage = result.error || "Failed to delete land.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to delete land", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to delete land. Please try again.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (lands.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No lands found</h3>
        <p className="text-gray-500 mb-4">Create your first land using the button above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Lands ({lands.length})</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Land Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GPS Coordinates
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
            {lands.map((land) => (
              <tr key={land.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{land.name}</div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <div>
                      <div>{land.location?.name || "No location"}</div>
                      {land.location?.state && (
                        <div className="text-xs text-gray-500">{land.location.state.name}</div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div>Half: {formatCurrency(land.halfPlotPrice)}</div>
                        <div>Full: {formatCurrency(land.fullPlotPrice)}</div>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {land.gpsCoordinates || "Not set"}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(land.createdAt)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(land)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit land"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(land.id, land.name)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete land"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}