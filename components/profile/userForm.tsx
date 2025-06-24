/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";
import { userUpdateSchema, UserFormData } from "@/lib/validators";
import { Save, User, Mail, Phone } from "lucide-react";

/**
 * Props for UserForm component.
 */
interface UserFormProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

/**
 * Component for editing user profile information.
 */
export default function UserForm({ user, setUser }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      phoneNo: user.phoneNo || "",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.put<UserProfile>("/api/user/profile", data);
      setUser(response.data);
      reset({ ...data, password: "" });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-green-600" />
        Personal Information
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={user.email}
                disabled
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                {...register("name")}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number (optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                {...register("phoneNo")}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            {errors.phoneNo && (
              <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password (optional)
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          aria-label="Save profile changes"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </form>
    </div>
  );
}
