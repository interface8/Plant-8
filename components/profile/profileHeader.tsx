import { UserProfile } from "@/types/user";
import { getUserInitials } from "@/lib/utils";
import Image from "next/image";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl opacity-10"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {user.image ? (
              <Image
                src={user.image}
                alt="Profile picture"
                width={80}
                height={80}
                className="rounded-2xl object-cover ring-4 ring-green-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-green-200">
                {getUserInitials(user.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back, {user.name}! 🌱
            </h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Active</span>
              </span>
              {user.modifiedOn && (
                <span>
                  Last updated{" "}
                  {new Date(user.modifiedOn).toLocaleDateString("en-NG")}
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:flex space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {user.addresses?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Addresses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {user.addresses?.filter((addr) => addr.useAsDelivery).length ||
                  0}
              </div>
              <div className="text-sm text-gray-500">Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
