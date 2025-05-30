"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import UserDropdown from "../user/user.dropdown";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = [
    { href: "/", label: "Home" },
    ...(status === "authenticated"
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : []),
    { href: "/investments", label: "Investments" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                FAM 8
              </Link>
            </div>

            <nav className="hidden md:flex ml-8 space-x-8 items-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center">
              {status === "loading" ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : status === "authenticated" && session?.user ? (
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
              )}
            </div>

            <div className="md:hidden flex items-center space-x-4">
              {status === "authenticated" && session?.user && (
                <div className="flex items-center">
                  <UserDropdown />
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
                aria-expanded={isMobileMenuOpen}
                aria-label="Main menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <div
          ref={mobileMenuRef}
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link
              href="/"
              className="text-xl font-bold text-green-600"
              onClick={handleMobileLinkClick}
            >
              FAM 8
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {navigationLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleMobileLinkClick}
                className={`block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:translate-x-1`}
                style={{
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                  animation: isMobileMenuOpen
                    ? "slideInFromRight 0.3s ease-out forwards"
                    : "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {status !== "authenticated" && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <Link
                  href="/sign-in"
                  onClick={handleMobileLinkClick}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-white transition-colors border border-gray-300"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={handleMobileLinkClick}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
