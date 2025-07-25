"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Save, User, Mail, Phone, Lock } from "lucide-react";
import { UserProfile } from "@/types/user";
import {
  userUpdateSchema,
  UserFormData,
} from "@/lib/validators/user-schema-validators";

interface UserInfoProps {
  user: UserProfile;
  onUpdate: (data: UserFormData) => Promise<UserProfile>;
}

export function UserInfo({ user, onUpdate }: UserInfoProps) {
  const { update } = useSession();
  const [phoneNo, setPhoneNo] = useState(user.phoneNo || "+234");
  const form = useForm<UserFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      phoneNo: user.phoneNo || "+234",
      password: "",
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+234")) {
      value = "+234" + value.replace(/^\+234/, "");
    }
    setPhoneNo(value);
    form.setValue("phoneNo", value);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const updatedUser = await onUpdate(data);
      await update({ name: updatedUser.name, phoneNo: updatedUser.phoneNo });
      window.dispatchEvent(new Event("profileUpdated")); // Notify UserDropdown
      toast.success("Profile updated successfully");
      form.reset({ ...data, password: "" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <User className="h-5 w-5 mr-2 text-green-600" />
        Personal Information
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            Email Address
          </label>
          <div className="relative">
            <input
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              aria-label="Email address (read-only)"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                Verified
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            Full Name
          </label>
          <input
            {...form.register("name")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Enter your full name"
            aria-label="Full name"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            Phone Number
            <span className="text-xs text-gray-500 ml-2">(optional)</span>
          </label>
          <input
            value={phoneNo}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="+234 Enter your phone number"
            aria-label="Phone number"
          />
          {form.formState.errors.phoneNo && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {form.formState.errors.phoneNo.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Lock className="h-4 w-4 mr-2 text-gray-500" />
            New Password
            <span className="text-xs text-gray-500 ml-2">(optional)</span>
          </label>
          <input
            type="password"
            {...form.register("password")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Enter new password to change"
            aria-label="New password"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {user.modifiedOn && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last updated:</span>{" "}
              {new Date(user.modifiedOn).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            aria-label={
              form.formState.isSubmitting ? "Saving changes" : "Save changes"
            }
          >
            <Save className="h-5 w-5 mr-2" />
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
