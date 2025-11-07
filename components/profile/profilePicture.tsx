"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Camera, Upload, X } from "lucide-react";
import { UserProfile } from "@/types/user";
import { getUserInitials } from "@/lib/utils";

interface ProfilePictureProps {
  user: UserProfile;
  onImageUpload: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<UserProfile>;
}

export function ProfilePicture({ user, onImageUpload }: ProfilePictureProps) {
  const { update } = useSession();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast.error("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    try {
      const updatedUser = await onImageUpload(imageFile, setUploadProgress);
      await update({ image: updatedUser.image });
      window.dispatchEvent(new Event("profileUpdated")); // Notify UserDropdown
      toast.success("Profile picture updated");
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-8 sticky top-18 text-center hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
        <Camera className="w-5 h-5 text-green-600" />
        Profile Picture
      </h2>

      <div className="relative inline-block mb-6">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            width={150}
            height={150}
            className="rounded-full object-cover ring-4 ring-green-200 shadow-lg"
          />
        ) : user.image ? (
          <Image
            src={user.image}
            alt="Profile picture"
            width={150}
            height={150}
            className="rounded-full object-cover ring-4 ring-green-200 shadow-lg"
          />
        ) : (
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-green-200 shadow-lg">
            {getUserInitials(user.name)}
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
          <Camera className="w-5 h-5 text-green-600" />
        </div>
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
        className="hidden"
        id="profile-image"
        disabled={isUploading}
        aria-label="Choose profile picture"
      />
      <label
        htmlFor="profile-image"
        className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 ${
          isUploading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 cursor-pointer"
        }`}
        aria-label="Choose new photo"
      >
        <Camera className="w-5 h-5" />
        Choose New Photo
      </label>

      {imageFile && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white rounded-2xl font-semibold backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isUploading ? "Uploading photo" : "Upload photo"}
            >
              <Upload className="w-5 h-5" />
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>

            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-2xl font-semibold backdrop-blur-sm shadow-md hover:bg-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel upload"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>

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

      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>• Maximum file size: 5MB</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
      </div>
    </div>
  );
}
