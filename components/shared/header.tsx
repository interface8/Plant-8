"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import UserDropdown from "../user/user.dropdown";
import InvestmentsDropdown from "../investment/investmentsDropdown";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navigationLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/investments", label: "Investments" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/blogs", label: "Blog" },
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
              {navigationLinks.map((link) =>
                link.label === "Investments" ? (
                  <InvestmentsDropdown key={link.href} />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {status === "loading" ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : status === "authenticated" && session?.user ? (
                <UserDropdown />
              ) : (
                <div className="hidden md:flex space-x-4">
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

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
                aria-expanded={isMenuOpen}
                aria-label="Main menu"
              >
                {isMenuOpen ? (
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
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-opacity-30 backdrop-blur-sm cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-l border-green-200 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-green-200 bg-white/50">
            <Link
              href="/"
              className="text-xl font-bold text-green-600 transition-transform hover:scale-105 duration-200"
              onClick={handleLinkClick}
            >
              FAM 8
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationLinks.map((link, index) =>
              link.label === "Investments" ? (
                <div key={link.href}>
                  <InvestmentsDropdown
                    isMobile={true}
                    onClose={handleLinkClick}
                  />
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {status !== "authenticated" && (
            <div className="border-t border-green-200 p-4 bg-white/50">
              <div className="space-y-2">
                <Link
                  href="/sign-in"
                  onClick={handleLinkClick}
                  className="block w-full text-center px-4 py-2.5 rounded-md text-sm font-medium text-green-700 hover:bg-green-100 transition-all duration-200 border border-green-300"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={handleLinkClick}
                  className="block w-full text-center px-4 py-2.5 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
