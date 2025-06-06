"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInitials } from "@/lib/utils";
import { toast } from "sonner";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";

interface UserType {
  id: string;
  name?: string | null;
  email?: string | null;
  roles?: string[];
  image?: string | null;
}

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setIsOpen(false);

    const loadingToast = toast.loading("Signing you out...", {
      description: "Please wait while we sign you out",
    });

    try {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });

      toast.dismiss(loadingToast);
      toast.success("Signed out successfully", {
        description: "You have been signed out of your account",
        duration: 3000,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.dismiss(loadingToast);
      toast.error("Sign out failed", {
        description: "Unable to sign out. Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  const user: UserType = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    roles: session.user.roles || [],
    image: session.user.image,
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-full p-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
        disabled={isSigningOut}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-medium">
            {getUserInitials(user.name)}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user.name || "User"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || "User"}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.email || "No email"}
            </p>
            {user.roles && user.roles.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {user.roles.join(", ")}
              </p>
            )}
          </div>

          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleLinkClick}
            role="menuitem"
          >
            <div className="flex items-center">
              <User className="h-4 w-4 mr-3 text-gray-400" />
              Your Profile
            </div>
          </Link>

          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleLinkClick}
            role="menuitem"
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-3 text-gray-400" />
              Settings
            </div>
          </Link>

          <div className="border-t border-gray-100">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              role="menuitem"
            >
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-3 text-red-500" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
