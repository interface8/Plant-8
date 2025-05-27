"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserDropdown from "../user/user.dropdown";

export default function Header() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                FAM 8
              </Link>
            </div>
            <nav className="ml-8 flex space-x-8 items-center">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              {isClient && isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/investments"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Investments
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            {isClient ? (
              isAuthenticated && user ? (
                <UserDropdown />
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )
            ) : (
              <div className="w-32 h-8" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
