"use client";

import { Address } from "../../types/user";
import { Check, Edit, Trash, MapPin, Plus } from "lucide-react";

/**
 * Props for AddressList component.
 */
interface AddressListProps {
  addresses: Address[];
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
  onAdd: () => void;
}

/**
 * Component for displaying user addresses.
 */
export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onAdd,
}: AddressListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          Delivery Addresses
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          aria-label="Add new address"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>
      {addresses.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No addresses yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 bg-gray-50 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {address.no}, {address.line1}, {address.city}, {address.state}
                  {address.code ? `, ${address.code}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {address.phoneNo}
                </p>
                <p className="text-sm text-gray-600">
                  {address.addressType.name}
                </p>
                {address.gps && (
                  <p className="text-sm text-gray-600">GPS: {address.gps}</p>
                )}
                {address.useAsDelivery && (
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Check className="h-4 w-4 mr-1" /> Delivery Address
                  </p>
                )}
                {address.modifiedOn && (
                  <p className="text-sm text-gray-500">
                    Updated{" "}
                    {new Date(address.modifiedOn).toLocaleDateString("en-NG", {
                      timeZone: "Africa/Lagos",
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(address.id)}
                  className="text-green-600 hover:text-green-800"
                  aria-label={`Edit address ${address.line1}`}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(address.id)}
                  className="text-red-600 hover:text-red-800"
                  aria-label={`Delete address ${address.line1}`}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
