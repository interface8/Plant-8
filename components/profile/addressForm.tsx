import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Address } from "@/types/user";
import { addressSchema, AddressFormData } from "@/lib/validators";

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
        {/* House Number */}
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

        {/* Street Address */}
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

        {/* Phone Number */}
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

        {/* State */}
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

        {/* City */}
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

        {/* Postal Code */}
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

      {/* GPS Coordinates */}
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

      {/* Address Type */}
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

      {/* Use as Delivery Checkbox */}
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

      {/* Form Actions */}
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { toast } from "sonner";
// import { Address } from "@/types/user";
// import { AddressFormData, addressSchema } from "@/lib/validators";
// import { Save, X, MapPin, Phone } from "lucide-react";
// import { useEffect } from "react";

// /**
//  * Props for AddressForm component.
//  */
// interface AddressFormProps {
//   userPhoneNo: string | null | undefined;
//   addressTypes: { id: string; name: string }[];
//   editingAddressId: string | null;
//   addresses: Address[];
//   onSubmit: (address: Address) => void;
//   onCancel: () => void;
// }

// /**
//  * Component for adding or editing an address.
//  * Note: Address.phoneNo defaults to userPhoneNo for new addresses but can be set independently.
//  */
// export default function AddressForm({
//   addressTypes,
//   editingAddressId,
//   addresses,
//   onSubmit,
//   onCancel,
// }: AddressFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<AddressFormData>({
//     resolver: zodResolver(addressSchema),
//     defaultValues: {
//       no: "",
//       line1: "",
//       phoneNo: "",
//       state: "",
//       city: "",
//       code: "",
//       gps: "",
//       useAsDelivery: false,
//       addressTypeId: "",
//     },
//   });

//   // Populate form when editing an address
//   useEffect(() => {
//     if (editingAddressId) {
//       const address = addresses.find((addr) => addr.id === editingAddressId);
//       if (address) {
//         console.log("Editing address:", address);
//         reset({
//           no: address.no,
//           line1: address.line1,
//           phoneNo: address.phoneNo,
//           state: address.state,
//           city: address.city,
//           code: address.code ?? "",
//           gps: address.gps ?? "",
//           useAsDelivery: address.useAsDelivery,
//           addressTypeId: address.addressType?.id ?? "",
//         });
//       }
//     } else {
//       reset({
//         no: "",
//         line1: "",
//         phoneNo: "",
//         state: "",
//         city: "",
//         code: "",
//         gps: "",
//         useAsDelivery: false,
//         addressTypeId: "",
//       });
//     }
//   }, [editingAddressId, addresses, reset]);

//   const onFormSubmit = async (data: AddressFormData) => {
//     try {
//       const response = editingAddressId
//         ? await axios.put<Address>(
//             `/api/user/addresses/${editingAddressId}`,
//             data
//           )
//         : await axios.post<Address>("/api/user/addresses", data);
//       onSubmit(response.data);
//       toast.success(editingAddressId ? "Address updated" : "Address added");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to save address");
//     }
//   };

//   return (
//     <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-4">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <MapPin className="h-4 w-4 text-green-600" />
//           {editingAddressId ? "Edit Address" : "Add Address"}
//         </h3>
//         <button
//           onClick={() => {
//             onCancel();
//             reset();
//           }}
//           className="text-gray-600 hover:text-gray-800"
//           aria-label="Close address form"
//         >
//           <X className="h-4 w-4" />
//         </button>
//       </div>
//       <form
//         onSubmit={handleSubmit(onFormSubmit)}
//         className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//       >
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             House Number
//           </label>
//           <input
//             {...register("no")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           />
//           {errors.no && (
//             <p className="text-red-500 text-sm mt-1">{errors.no.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Address Line 1
//           </label>
//           <input
//             {...register("line1")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           />
//           {errors.line1 && (
//             <p className="text-red-500 text-sm mt-1">{errors.line1.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Phone Number
//           </label>
//           <div className="relative">
//             <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               {...register("phoneNo")}
//               className="pl-              pl-10 mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//             />
//           </div>
//           {errors.phoneNo && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.phoneNo.message}
//             </p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             State
//           </label>
//           <input
//             {...register("state")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           />
//           {errors.state && (
//             <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             City
//           </label>
//           <input
//             {...register("city")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           />
//           {errors.city && (
//             <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Postal Code (optional)
//           </label>
//           <input
//             {...register("code")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           />
//           {errors.code && (
//             <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             GPS Coordinates (optional)
//           </label>
//           <input
//             {...register("gps")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           />
//           {errors.gps && (
//             <p className="text-red-500 text-sm mt-1">{errors.gps.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Address Type
//           </label>
//           <select
//             {...register("addressTypeId")}
//             className="mt-1 block w-full rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
//           >
//             <option value="">Select type</option>
//             {addressTypes.map((type) => (
//               <option key={type.id} value={type.id}>
//                 {type.name}
//               </option>
//             ))}
//           </select>
//           {errors.addressTypeId && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.addressTypeId.message}
//             </p>
//           )}
//         </div>
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             {...register("useAsDelivery")}
//             className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//           />
//           <label className="ml-2 text-sm font-medium text-gray-700">
//             Set as Delivery Address
//           </label>
//         </div>
//         <div className="sm:col-span-2 flex gap-4">
//           <button
//             type="submit"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//             aria-label={editingAddressId ? "Update address" : "Add address"}
//           >
//             <Save className="h-4 w-4" />
//             {editingAddressId ? "Update" : "Add"}
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               onCancel();
//               reset();
//             }}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
//             aria-label="Cancel address form"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
