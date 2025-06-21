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
import { Camera, Save, Plus, Edit, Trash, Check } from "lucide-react";

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

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: { name: "", password: "" },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      no: "",
      line1: "",
      line2: "",
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
      setUser(data);
      userForm.reset({
        name: data.name,
        password: "",
      });
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      const { data: updatedProfile } = await axios.put<UserProfile>(
        "/api/user/profile",
        data
      );
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
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    addressForm.reset({
      no: address.no,
      line1: address.line1,
      line2: address.line2 || "",
      state: address.state,
      city: address.city,
      code: address.code,
      gps: address.gps,
      useAsDelivery: address.useAsDelivery,
      //   addressTypeId: address.addressType.id,
    });
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await axios.delete(`/api/user/addresses/${id}`);
      setUser((prev) => ({
        ...prev!,
        addresses: prev!.addresses.filter((addr) => addr.id !== id),
      }));
      toast.success("Address deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete address");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session?.user || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Profile Picture
        </h2>
        <div className="flex items-center space-x-4">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          ) : user.image ? (
            <Image
              src={user.image}
              alt="Profile picture"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-medium">
              {getUserInitials(user.name)}
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image"
            />
            <label
              htmlFor="profile-image"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              <Camera className="h-5 w-5 mr-2" />
              Choose Image
            </label>
            {imageFile && (
              <div className="mt-2">
                <button
                  onClick={uploadImage}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Upload
                </button>
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <form
          onSubmit={userForm.handleSubmit(onUserSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={user.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...userForm.register("name")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            {userForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {userForm.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password (optional)
            </label>
            <input
              type="password"
              {...userForm.register("password")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            {userForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {userForm.formState.errors.password.message}
              </p>
            )}
          </div>
          {user.modifiedOn && (
            <div className="text-sm text-gray-500">
              Last modified on{" "}
              {new Date(user.modifiedOn).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
              })}
            </div>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </form>
      </div>

      {/* Addresses Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Addresses</h2>
          <button
            onClick={() => {
              setShowAddressForm(true);
              setEditingAddressId(null);
              addressForm.reset();
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Address
          </button>
        </div>

        {showAddressForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>
            <form
              onSubmit={addressForm.handleSubmit(onAddressSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House Number
                </label>
                <input
                  {...addressForm.register("no")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addressForm.formState.errors.no && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.no.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  {...addressForm.register("line1")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addressForm.formState.errors.line1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.line1.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2 (optional)
                </label>
                <input
                  {...addressForm.register("line2")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  {...addressForm.register("state")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addressForm.formState.errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...addressForm.register("city")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addressForm.formState.errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  {...addressForm.register("code")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addressForm.formState.errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.code.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GPS Coordinates
                </label>
                <input
                  {...addressForm.register("gps")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {addressForm.formState.errors.gps && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.gps.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Type
                </label>
                <select
                  {...addressForm.register("addressTypeId")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select type</option>
                  {addressTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {addressForm.formState.errors.addressTypeId && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressForm.formState.errors.addressTypeId.message}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...addressForm.register("useAsDelivery")}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-medium text-gray-700">
                  Set as Delivery Address
                </label>
              </div>
              <div className="sm:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingAddressId ? "Update Address" : "Add Address"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                    addressForm.reset();
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 bg-gray-50 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {address.no}, {address.line1}, {address.city}, {address.state}
                  , {address.code}
                </p>
                <p className="text-sm text-gray-500">
                  {address.addressType.name}
                </p>
                {address.useAsDelivery && (
                  <p className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Delivery Address
                  </p>
                )}
                {address.modifiedOn && (
                  <p className="text-sm text-gray-500">
                    Last modified on{" "}
                    {new Date(address.modifiedOn).toLocaleString("en-NG", {
                      timeZone: "Africa/Lagos",
                    })}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
