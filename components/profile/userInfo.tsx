import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, User, Mail, Phone, Lock } from "lucide-react";
import { UserProfile } from "@/types/user";
import { userUpdateSchema, UserFormData } from "@/lib/validators";

interface UserInfoProps {
  user: UserProfile;
  onUpdate: (data: UserFormData) => Promise<UserProfile>;
}

export function UserInfo({ user, onUpdate }: UserInfoProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      phoneNo: user.phoneNo || "",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await onUpdate(data);
      form.reset({ ...data, password: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <User className="h-5 w-5 mr-2 text-green-600" />
        Personal Information
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field (Read-only) */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            Email Address
          </label>
          <div className="relative">
            <input
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            Full Name
          </label>
          <input
            {...form.register("name")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Enter your full name"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            Phone Number
            <span className="text-xs text-gray-500 ml-2">(optional)</span>
          </label>
          <input
            {...form.register("phoneNo")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Enter your phone number"
          />
          {form.formState.errors.phoneNo && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {form.formState.errors.phoneNo.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Lock className="h-4 w-4 mr-2 text-gray-500" />
            New Password
            <span className="text-xs text-gray-500 ml-2">(optional)</span>
          </label>
          <input
            type="password"
            {...form.register("password")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Enter new password to change"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Last Modified Info */}
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

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Save className="h-5 w-5 mr-2" />
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
