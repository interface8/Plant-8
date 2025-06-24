import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Address } from "@/types/user";
import { AddressFormData } from "@/lib/validators";
import { AddressForm } from "./addressForm";
import { AddressCard } from "./addressCard";

interface AddressesSectionProps {
  addresses: Address[];
  addressTypes: { id: string; name: string }[];
  onAdd: (data: AddressFormData) => Promise<Address>;
  onUpdate: (id: string, data: AddressFormData) => Promise<Address>;
  onDelete: (id: string) => Promise<void>;
}

export function AddressesSection({
  addresses,
  addressTypes,
  onAdd,
  onUpdate,
  onDelete,
}: AddressesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: AddressFormData) => {
    try {
      if (editingId) {
        await onUpdate(editingId, data);
      } else {
        await onAdd(data);
      }
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await onDelete(id);
    }
  };

  const editingAddress = editingId
    ? addresses.find((addr) => addr.id === editingId)
    : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Delivery Addresses
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({addresses.length})
          </span>
        </h2>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={handleFormCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <AddressForm
            addressTypes={addressTypes}
            initialData={editingAddress}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing={!!editingId}
          />
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses yet
          </h3>
          <p className="text-gray-500 mb-4">
            Add your delivery addresses to make ordering easier
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
