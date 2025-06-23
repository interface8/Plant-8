// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import Image from "next/image";
// import { UserProfile, Address } from "@/types/user";
// import {
//   userUpdateSchema,
//   UserFormData,
//   addressSchema,
//   AddressFormData,
// } from "@/lib/validators";
// import { getUserInitials } from "@/lib/utils";
// import { toast } from "sonner";
// import { Camera, Save, Plus, Edit, Trash, Check } from "lucide-react";

// export default function ProfilePage() {
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [addressTypes, setAddressTypes] = useState<
//     { id: string; name: string }[]
//   >([]);
//   const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);

//   const userForm = useForm<UserFormData>({
//     resolver: zodResolver(userUpdateSchema),
//     defaultValues: { name: "", phoneNo: "", password: "" },
//   });

//   const addressForm = useForm<AddressFormData>({
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

//   const fetchProfile = useCallback(async () => {
//     try {
//       const { data } = await axios.get<UserProfile>("/api/user/profile");
//       console.log("Fetched user addresses:", data.addresses); // Debug
//       setUser(data);
//       userForm.reset({
//         name: data.name,
//         phoneNo: data.phoneNo || "",
//         password: "",
//       });
//     } catch (error) {
//       toast.error("Failed to load profile");
//     }
//   }, [userForm]);

//   const fetchAddressTypes = useCallback(async () => {
//     try {
//       const { data } = await axios.get<{ id: string; name: string }[]>(
//         "/api/address-types"
//       );
//       setAddressTypes(data);
//     } catch (error) {
//       toast.error("Failed to load address types");
//     }
//   }, []);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.id) {
//       fetchProfile();
//       fetchAddressTypes();
//     }
//   }, [status, session?.user?.id, fetchProfile, fetchAddressTypes]);

//   const onUserSubmit = async (data: UserFormData) => {
//     try {
//       const response = await axios.put<UserProfile>("/api/user/profile", data);
//       const updatedProfile: UserProfile = response.data;
//       setUser(updatedProfile);
//       userForm.reset({ ...data, password: "" });
//       toast.success("Profile updated successfully");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to update profile");
//     }
//   };

//   const onAddressSubmit = async (data: AddressFormData) => {
//     try {
//       let response;
//       if (editingAddressId) {
//         response = await axios.put<Address>(
//           `/api/user/addresses/${editingAddressId}`,
//           data
//         );
//       } else {
//         response = await axios.post<Address>("/api/user/addresses", data);
//       }
//       setUser((prev) => ({
//         ...prev!,
//         addresses: editingAddressId
//           ? prev!.addresses.map((addr) =>
//               addr.id === editingAddressId ? response.data : addr
//             )
//           : [...prev!.addresses, response.data],
//       }));
//       addressForm.reset();
//       setEditingAddressId(null);
//       setShowAddressForm(false);
//       toast.success(editingAddressId ? "Address updated" : "Address added");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to save address");
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const uploadImage = async () => {
//     if (!imageFile) return;
//     try {
//       const formData = new FormData();
//       formData.append("image", imageFile);

//       const { data } = await axios.post<UserProfile>(
//         "/api/user/profile/image",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percent = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//               );
//               setUploadProgress(percent);
//             }
//           },
//         }
//       );

//       setUser(data);
//       setImageFile(null);
//       setImagePreview(null);
//       setUploadProgress(0);
//       toast.success("Profile picture updated");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to upload image");
//     }
//   };

//   const handleEditAddress = (address: Address) => {
//     console.log("Editing address:", address); // Debug
//     setEditingAddressId(address.id);
//     setShowAddressForm(true);
//     addressForm.reset({
//       no: address.no,
//       line1: address.line1,
//       phoneNo: address.phoneNo,
//       state: address.state,
//       city: address.city,
//       code: address.code || "",
//       gps: address.gps || "",
//       useAsDelivery: address.useAsDelivery,
//       addressTypeId: address.addressType.id,
//     });
//   };

//   const handleDeleteAddress = async (id: string) => {
//     try {
//       await axios.delete(`/api/user/addresses/${id}`);
//       setUser((prev) => ({
//         ...prev!,
//         addresses: prev!.addresses.filter((address) => address.id !== id),
//       }));
//       toast.success("Address deleted");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to delete address");
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (!session?.user || !user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Unauthorized
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

//       {/* Profile Picture Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Profile Picture
//         </h2>
//         <div className="flex items-center space-x-4">
//           {imagePreview ? (
//             <Image
//               src={imagePreview}
//               alt="Preview"
//               width={96}
//               height={96}
//               className="rounded-full object-cover"
//             />
//           ) : user.image ? (
//             <Image
//               src={user.image}
//               alt="Profile picture"
//               width={96}
//               height={96}
//               className="rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-medium">
//               {getUserInitials(user.name)}
//             </div>
//           )}
//           <div>
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={handleImageChange}
//               className="hidden"
//               id="profile-image"
//             />
//             <label
//               htmlFor="profile-image"
//               className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
//             >
//               <Camera className="h-5 w-5 mr-2" />
//               Choose Image
//             </label>
//             {imageFile && (
//               <div className="mt-2">
//                 <button
//                   onClick={uploadImage}
//                   className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   <Save className="h-5 w-5 mr-2" />
//                   Upload
//                 </button>
//                 {uploadProgress > 0 && (
//                   <div className="mt-2">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div
//                         className="bg-green-600 h-2.5 rounded-full"
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-600">{uploadProgress}%</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Personal Information Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Personal Information
//         </h2>
//         <form
//           onSubmit={userForm.handleSubmit(onUserSubmit)}
//           className="space-y-4"
//         >
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               value={user.email}
//               disabled
//               className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               {...userForm.register("name")}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//             />
//             {userForm.formState.errors.name && (
//               <p className="text-red-500 text-sm mt-1">
//                 {userForm.formState.errors.name.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Phone Number (optional)
//             </label>
//             <input
//               {...userForm.register("phoneNo")}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//             />
//             {userForm.formState.errors.phoneNo && (
//               <p className="text-red-500 text-sm mt-1">
//                 {userForm.formState.errors.phoneNo.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               New Password (optional)
//             </label>
//             <input
//               type="password"
//               {...userForm.register("password")}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//             />
//             {userForm.formState.errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {userForm.formState.errors.password.message}
//               </p>
//             )}
//           </div>
//           {user.modifiedOn && (
//             <div className="text-sm text-gray-500">
//               Last modified on{" "}
//               {new Date(user.modifiedOn).toLocaleString("en-NG", {
//                 timeZone: "Africa/Lagos",
//               })}
//             </div>
//           )}
//           <button
//             type="submit"
//             className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//           >
//             <Save className="h-5 w-5 mr-2" />
//             Save Changes
//           </button>
//         </form>
//       </div>

//       {/* Addresses Section */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">Addresses</h2>
//           <button
//             onClick={() => {
//               setShowAddressForm(true);
//               setEditingAddressId(null);
//               addressForm.reset();
//             }}
//             className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add Address
//           </button>
//         </div>

//         {showAddressForm && (
//           <div className="mb-6 p-4 bg-gray-50 rounded-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               {editingAddressId ? "Edit Address" : "Add New Address"}
//             </h3>
//             <form
//               onSubmit={addressForm.handleSubmit(onAddressSubmit)}
//               className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//             >
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   House Number
//                 </label>
//                 <input
//                   {...addressForm.register("no")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.no && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.no.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Address
//                 </label>
//                 <input
//                   {...addressForm.register("line1")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.line1 && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.line1.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Phone Number
//                 </label>
//                 <input
//                   {...addressForm.register("phoneNo")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.phoneNo && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.phoneNo.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   State
//                 </label>
//                 <input
//                   {...addressForm.register("state")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.state && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.state.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   City
//                 </label>
//                 <input
//                   {...addressForm.register("city")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.city && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.city.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Postal Code (optional)
//                 </label>
//                 <input
//                   {...addressForm.register("code")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.code && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.code.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   GPS Coordinates (optional)
//                 </label>
//                 <input
//                   {...addressForm.register("gps")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 />
//                 {addressForm.formState.errors.gps && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.gps.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Address Type
//                 </label>
//                 <select
//                   {...addressForm.register("addressTypeId")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//                 >
//                   <option value="">Select type</option>
//                   {addressTypes.map((type) => (
//                     <option key={type.id} value={type.id}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select>
//                 {addressForm.formState.errors.addressTypeId && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {addressForm.formState.errors.addressTypeId.message}
//                   </p>
//                 )}
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   {...addressForm.register("useAsDelivery")}
//                   className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 block text-sm font-medium text-gray-700">
//                   Set as Delivery Address
//                 </label>
//               </div>
//               <div className="sm:col-span-2 flex space-x-4">
//                 <button
//                   type="submit"
//                   className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                 >
//                   <Save className="h-5 w-5 mr-2" />
//                   {editingAddressId ? "Update Address" : "Add Address"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddressForm(false);
//                     setEditingAddressId(null);
//                     addressForm.reset();
//                   }}
//                   className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="space-y-4">
//           {user.addresses.map((address) => (
//             <div
//               key={address.id}
//               className="p-4 bg-gray-50 rounded-md flex justify-between items-center"
//             >
//               <div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {address.no}, {address.line1}, {address.city}, {address.state}
//                   {address.code ? `, ${address.code}` : ""}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Phone: {address.phoneNo}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {address.addressType.name}
//                 </p>
//                 {address.gps && (
//                   <p className="text-sm text-gray-500">GPS: {address.gps}</p>
//                 )}
//                 {address.useAsDelivery && (
//                   <p className="text-sm text-green-600 flex items-center">
//                     <Check className="h-4 w-4 mr-1" /> Delivery Address
//                   </p>
//                 )}
//                 {address.modifiedOn && (
//                   <p className="text-sm text-gray-500">
//                     Last modified on{" "}
//                     {new Date(address.modifiedOn).toLocaleString("en-NG", {
//                       timeZone: "Africa/Lagos",
//                     })}
//                   </p>
//                 )}
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditAddress(address)}
//                   className="text-green-600 hover:text-green-800"
//                 >
//                   <Edit className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteAddress(address.id)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { UserProfile, Address } from "@/types/user";
import {
  userUpdateSchema,
  UserFormData,
  addressSchema,
  AddressFormData,
} from "@/lib/validators";
import { getUserInitials } from "@/lib/utils";
import { toast } from "sonner";
import {
  Camera,
  Save,
  Plus,
  Edit,
  Trash,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  X,
  Home,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addressTypes, setAddressTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: { name: "", phoneNo: "", password: "" },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      no: "",
      line1: "",
      phoneNo: "",
      state: "",
      city: "",
      code: "",
      gps: "",
      useAsDelivery: false,
      addressTypeId: "",
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get<UserProfile>("/api/user/profile");
      console.log("Fetched user addresses:", data.addresses); // Debug
      setUser(data);
      userForm.reset({
        name: data.name,
        phoneNo: data.phoneNo || "",
        password: "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    }
  }, [userForm]);

  const fetchAddressTypes = useCallback(async () => {
    try {
      const { data } = await axios.get<{ id: string; name: string }[]>(
        "/api/address-types"
      );
      setAddressTypes(data);
    } catch (error) {
      toast.error("Failed to load address types");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProfile();
      fetchAddressTypes();
    }
  }, [status, session?.user?.id, fetchProfile, fetchAddressTypes]);

  const onUserSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.put<UserProfile>("/api/user/profile", data);
      const updatedProfile: UserProfile = response.data;
      setUser(updatedProfile);
      userForm.reset({ ...data, password: "" });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      let response;
      if (editingAddressId) {
        response = await axios.put<Address>(
          `/api/user/addresses/${editingAddressId}`,
          data
        );
      } else {
        response = await axios.post<Address>("/api/user/addresses", data);
      }
      setUser((prev) => ({
        ...prev!,
        addresses: editingAddressId
          ? prev!.addresses.map((addr) =>
              addr.id === editingAddressId ? response.data : addr
            )
          : [...prev!.addresses, response.data],
      }));
      addressForm.reset();
      setEditingAddressId(null);
      setShowAddressForm(false);
      toast.success(editingAddressId ? "Address updated" : "Address added");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save address");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const { data } = await axios.post<UserProfile>(
        "/api/user/profile/image",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      setUser(data);
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      toast.success("Profile picture updated");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    console.log("Editing address:", address); // Debug
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    addressForm.reset({
      no: address.no,
      line1: address.line1,
      phoneNo: address.phoneNo,
      state: address.state,
      city: address.city,
      code: address.code || "",
      gps: address.gps || "",
      useAsDelivery: address.useAsDelivery,
      addressTypeId: address.addressType.id,
    });
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await axios.delete(`/api/user/addresses/${id}`);
      setUser((prev) => ({
        ...prev!,
        addresses: prev!.addresses.filter((address) => address.id !== id),
      }));
      toast.success("Address deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete address");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
          <div className="mt-4 text-slate-600 font-medium">
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your Profile
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your personal information and addresses
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center hover:shadow-2xl transition-all duration-300">
              <div className="relative inline-block mb-6">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={150}
                    height={150}
                    className="rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
                  />
                ) : user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile picture"
                    width={150}
                    height={150}
                    className="rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-indigo-100 shadow-lg">
                    {getUserInitials(user.name)}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <Camera className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {user.name}
              </h2>
              <p className="text-slate-600 mb-6 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>

              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <label
                  htmlFor="profile-image"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 cursor-pointer transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Camera className="w-5 h-5" />
                  Choose New Photo
                </label>

                {imageFile && (
                  <div className="space-y-3">
                    <button
                      onClick={uploadImage}
                      disabled={isUploading}
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Upload className="w-5 h-5" />
                      {isUploading ? "Uploading..." : "Upload Photo"}
                    </button>

                    {uploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                          {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {user.modifiedOn && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Profile updated on{" "}
                    {new Date(user.modifiedOn).toLocaleDateString("en-NG", {
                      timeZone: "Africa/Lagos",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Personal Information
                </h2>
              </div>

              <form
                onSubmit={userForm.handleSubmit(onUserSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        value={user.email}
                        disabled
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        {...userForm.register("name")}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    {userForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {userForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Phone Number
                      <span className="text-slate-400 font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        {...userForm.register("phoneNo")}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    {userForm.formState.errors.phoneNo && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {userForm.formState.errors.phoneNo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      New Password
                      <span className="text-slate-400 font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="password"
                      {...userForm.register("password")}
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {userForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {userForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </form>
            </div>

            {/* Addresses Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Delivery Addresses
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddressForm(true);
                    setEditingAddressId(null);
                    addressForm.reset();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add Address
                </button>
              </div>

              {showAddressForm && (
                <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddressId(null);
                        addressForm.reset();
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          House Number
                        </label>
                        <input
                          {...addressForm.register("no")}
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        {addressForm.formState.errors.no && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.no.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Street Address
                        </label>
                        <input
                          {...addressForm.register("line1")}
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        {addressForm.formState.errors.line1 && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.line1.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...addressForm.register("phoneNo")}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        {addressForm.formState.errors.phoneNo && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.phoneNo.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          State
                        </label>
                        <input
                          {...addressForm.register("state")}
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        {addressForm.formState.errors.state && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.state.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          City
                        </label>
                        <input
                          {...addressForm.register("city")}
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        {addressForm.formState.errors.city && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Postal Code
                          <span className="text-slate-400 font-normal ml-1">
                            (optional)
                          </span>
                        </label>
                        <input
                          {...addressForm.register("code")}
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        {addressForm.formState.errors.code && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.code.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          GPS Coordinates
                          <span className="text-slate-400 font-normal ml-1">
                            (optional)
                          </span>
                        </label>
                        <input
                          {...addressForm.register("gps")}
                          placeholder="e.g., 6.5244, 3.3792"
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        {addressForm.formState.errors.gps && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.gps.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Address Type
                        </label>
                        <select
                          {...addressForm.register("addressTypeId")}
                          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select address type</option>
                          {addressTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        {addressForm.formState.errors.addressTypeId && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {addressForm.formState.errors.addressTypeId.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-200">
                      <input
                        type="checkbox"
                        {...addressForm.register("useAsDelivery")}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                      />
                      <label className="ml-3 block text-sm font-semibold text-slate-700">
                        Set as default delivery address
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Save className="w-5 h-5" />
                        {editingAddressId ? "Update Address" : "Add Address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                          addressForm.reset();
                        }}
                        className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl hover:bg-slate-300 transition-all duration-200 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {user.addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      No addresses yet
                    </h3>
                    <p className="text-slate-600">
                      Add your first delivery address to get started.
                    </p>
                  </div>
                ) : (
                  user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="group relative p-6 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg">
                                {address.addressType.name}
                              </h4>
                              <p className="text-slate-600">
                                {address.no}, {address.line1}
                              </p>
                              <p className="text-slate-600">
                                {address.city}, {address.state}
                                {address.code ? ` ${address.code}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Phone className="w-4 h-4" />
                              <span>{address.phoneNo}</span>
                            </div>
                            {address.gps && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span className="font-mono text-xs">
                                  {address.gps}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-4">
                            {address.useAsDelivery && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium">
                                <Check className="w-4 h-4" />
                                Default Delivery
                              </div>
                            )}
                            {address.modifiedOn && (
                              <span className="text-xs text-slate-500">
                                Updated{" "}
                                {new Date(
                                  address.modifiedOn
                                ).toLocaleDateString("en-NG", {
                                  timeZone: "Africa/Lagos",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                            title="Edit address"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                            title="Delete address"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
