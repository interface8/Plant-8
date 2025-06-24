import { Edit, Trash, MapPin, Phone, Check, Calendar } from "lucide-react";
import { Address } from "@/types/user";

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="relative group bg-white rounded-2xl border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Delivery Badge */}
      {address.useAsDelivery && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
          <Check className="h-3 w-3 mr-1" />
          Primary
        </div>
      )}

      {/* Address Type Badge */}
      <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-lg">
        {address.addressType.name}
      </div>

      {/* Address Content */}
      <div className="pr-8">
        {/* Address Details */}
        <div className="flex items-start space-x-3 mb-4">
          <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {address.no}, {address.line1}
            </p>
            <p className="text-sm text-gray-600">
              {address.city}, {address.state}
              {address.code && `, ${address.code}`}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3 mb-3">
          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">{address.phoneNo}</span>
        </div>

        {/* GPS Coordinates */}
        {address.gps && (
          <div className="mb-3">
            <p className="text-xs text-gray-500">📍 GPS: {address.gps}</p>
          </div>
        )}

        {/* Last Modified */}
        {address.modifiedOn && (
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>
              Updated {new Date(address.modifiedOn).toLocaleDateString("en-NG")}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onEdit}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          title="Edit address"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          title="Delete address"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
}
