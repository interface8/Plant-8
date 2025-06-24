import { UserProfile } from "@/types/user";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              {user.name}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">{user.email}</p>

            <div className="flex items-center mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Active</span>
              </div>
              {user.modifiedOn && (
                <div className="ml-4 text-sm text-gray-400">
                  Updated{" "}
                  {new Date(user.modifiedOn).toLocaleDateString("en-NG")}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-6 md:space-x-8">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-semibold text-gray-900">
                {user.addresses?.length || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">
                Addresses
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-semibold text-emerald-600">
                {user.addresses?.filter((addr) => addr.useAsDelivery).length ||
                  0}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">
                Primary
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
