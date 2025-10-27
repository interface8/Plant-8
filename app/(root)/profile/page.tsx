/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";
import { useProfileData } from "@/hooks/use-profile-data";
import { ProfileHeader } from "@/components/profile/profileHeader";
import { ProfilePicture } from "@/components/profile/profilePicture";
import { UserInfo } from "@/components/profile/userInfo";
import { AddressesSection } from "@/components/profile/addressesSection";
import { LoadingSpinner } from "@/components/ui/loader";

export const revalidate = 60;
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const {
    user,
    addressTypes,
    isLoading,
    updateProfile,
    uploadProfileImage,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useProfileData();

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  if (!session?.user || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-semibold text-gray-800">Unauthorized</h2>
          <p className="text-gray-600 mt-2">
            Please sign in to access your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <ProfilePicture user={user} onImageUpload={uploadProfileImage} />
          </div>

          {/* Right Column - Personal Info and Addresses */}
          <div className="lg:col-span-2 space-y-8">
            <UserInfo user={user} onUpdate={updateProfile} />

            <AddressesSection
              addresses={user.addresses}
              addressTypes={addressTypes}
              onAdd={addAddress}
              onUpdate={updateAddress}
              onDelete={deleteAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
