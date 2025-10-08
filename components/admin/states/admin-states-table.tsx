"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, AlertCircle, MapPin } from "lucide-react";

interface State {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    locations: number;
  };
}

interface AdminStatesTableProps {
  states: State[];
}

export default function AdminStatesTable({ states }: AdminStatesTableProps) {
  const router = useRouter();

  const handleEdit = (state: State) => {
    router.push(`/admin/states/${state.id}/edit`);
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
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the state &ldquo;<strong>{name}</strong>&rdquo;? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                performDelete(id, name);
              }}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const performDelete = async (id: string, name: string) => {
    const loadingToast = toast.loading("Deleting state...", {
      description: "Please wait while we remove the state.",
    });

    try {
      const response = await fetch(`/api/admin/states?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("State deleted successfully!", {
          description: `"${name}" has been removed.`,
        });
        router.refresh();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete state", {
          description: result.error || "An error occurred while deleting the state.",
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to delete state. Please try again.",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  if (states.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No states found</h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first state.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">All States</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your states and their locations
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Locations Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {states.map((state) => (
              <tr key={state.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{state.name}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{state._count.locations} location{state._count.locations !== 1 ? 's' : ''}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(state.createdAt)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(state)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit state"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(state.id, state.name)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete state"
                      disabled={state._count.locations > 0}
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