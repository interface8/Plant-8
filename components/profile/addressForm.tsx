import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Address } from "@/types/user";
import {
  addressSchema,
  AddressFormData,
} from "@/lib/validators/address-schema-validators";

interface AddressFormProps {
  addressTypes: { id: string; name: string }[];
  initialData?: Address | null;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export function AddressForm({
  addressTypes,
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}: AddressFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      no: initialData?.no || "",
      line1: initialData?.line1 || "",
      phoneNo: initialData?.phoneNo || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
      code: initialData?.code || "",
      gps: initialData?.gps || "",
      useAsDelivery: initialData?.useAsDelivery || false,
      addressTypeId: initialData?.addressType?.id || "",
    },
  });

  const handleSubmit = async (data: AddressFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House Number / Unit
          </label>
          <input
            {...form.register("no")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="e.g., 123, Unit 4B"
          />
          {form.formState.errors.no && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.no.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <input
            {...form.register("line1")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Street name and details"
          />
          {form.formState.errors.line1 && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.line1.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            {...form.register("phoneNo")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Phone number for this address"
          />
          {form.formState.errors.phoneNo && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.phoneNo.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            {...form.register("state")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="State or region"
          />
          {form.formState.errors.state && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.state.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            {...form.register("city")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="City or town"
          />
          {form.formState.errors.city && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
            <span className="text-xs text-gray-500 ml-1">(optional)</span>
          </label>
          <input
            {...form.register("code")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Postal or ZIP code"
          />
          {form.formState.errors.code && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.code.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GPS Coordinates
          <span className="text-xs text-gray-500 ml-1">(optional)</span>
        </label>
        <input
          {...form.register("gps")}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
          placeholder="e.g., 6.5244, 3.3792"
        />
        {form.formState.errors.gps && (
          <p className="text-red-500 text-sm mt-2">
            {form.formState.errors.gps.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Type
        </label>
        <select
          {...form.register("addressTypeId")}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-white"
        >
          <option value="">Select address type</option>
          {addressTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {form.formState.errors.addressTypeId && (
          <p className="text-red-500 text-sm mt-2">
            {form.formState.errors.addressTypeId.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
        <input
          type="checkbox"
          {...form.register("useAsDelivery")}
          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <div>
          <label className="text-sm font-medium text-gray-700">
            Set as Primary Delivery Address
          </label>
          <p className="text-xs text-gray-500">
            This address will be used as default for deliveries
          </p>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Save className="h-4 w-4 mr-2" />
          {form.formState.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Address"
            : "Add Address"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
}
