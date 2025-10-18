"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Clock, TrendingUp } from "lucide-react";
import type { ProductType } from "@/types/product";
import type { Duration } from "@/types/duration";

interface InvestmentsDropdownProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function InvestmentsDropdown({
  isMobile = false,
  onClose,
}: InvestmentsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productTypesResponse, durationsResponse] = await Promise.all([
          fetch("/api/product-types"),
          fetch("/api/durations"),
        ]);

        if (!productTypesResponse.ok) {
          throw new Error("Failed to fetch product types");
        }
        if (!durationsResponse.ok) {
          throw new Error("Failed to fetch durations");
        }

        const productTypesData = await productTypesResponse.json();
        const durationsData = await durationsResponse.json();

        setProductTypes(productTypesData);
        setDurations(durationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load investment options");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveSubmenu(null);
    }, 200);
  };

  const toggleSubmenu = (id: string) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
    if (onClose) onClose();
  };

  // Filter product types to get only parent categories (Crop, Livestock)
  const parentProductTypes = productTypes.filter((type) => !type.prevId);

  if (loading) {
    return (
      <div className="flex items-center px-3 py-2">
        <span className="text-gray-700 text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center px-3 py-2">
        <span className="text-red-600 text-sm">{error}</span>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-transparent hover:border-green-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="ml-3">Investments</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="mt-2 pl-4 space-y-2 border-l-2 border-green-200">
            {/* Browse All Catalog Link */}
            <Link
              href="/investments/catalog"
              className="block mb-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-center text-sm"
              onClick={handleLinkClick}
            >
              Browse All Investments
            </Link>
            
            {/* Duration Section */}
            {durations.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  <Clock className="h-4 w-4 mr-2" />
                  By Duration
                </div>
                {durations.map((duration) => (
                  <Link
                    key={duration.id}
                    href={`/investments/duration/${duration.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors ml-2"
                    onClick={handleLinkClick}
                  >
                    {duration.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Product Types Section */}
            {parentProductTypes.length > 0 && (
              <div className="space-y-1 pt-2">
                <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  By Type
                </div>
                {parentProductTypes.map((parent) => (
                  <div key={parent.id} className="ml-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-between"
                      onClick={() => toggleSubmenu(parent.id)}
                    >
                      {parent.name}
                      {parent.children?.length > 0 && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeSubmenu === parent.id ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>
                    {parent.children?.length > 0 &&
                      activeSubmenu === parent.id && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-green-100 pl-3">
                          {parent.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/investments/category/${child.name
                                .toLowerCase()
                                .replace(" ", "-")}`}
                              className="block px-3 py-2 text-sm text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              onClick={handleLinkClick}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Investments
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="p-6">
          {/* Browse All Catalog Link */}
          <Link
            href="/investments/catalog"
            className="block mb-4 p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-md"
            onClick={handleLinkClick}
            role="menuitem"
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Browse All Investments</span>
            </div>
          </Link>
          
          {/* Duration Section */}
          {durations.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  By Duration
                </h3>
              </div>
              <div className="space-y-1">
                {durations.map((duration) => (
                  <Link
                    key={duration.id}
                    href={`/investments/duration/${duration.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors group"
                    onClick={handleLinkClick}
                    role="menuitem"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      {duration.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Types Section */}
          {parentProductTypes.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">By Type</h3>
              </div>
              <div className="space-y-1">
                {parentProductTypes.map((parent) => (
                  <div key={parent.id} className="relative group">
                    <div
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                      onMouseEnter={() => setActiveSubmenu(parent.id)}
                      role="menuitem"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {parent.name}
                      </span>
                      {parent.children?.length > 0 && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeSubmenu === parent.id ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>

                    {parent.children?.length > 0 && (
                      <div
                        className={`absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out ${
                          activeSubmenu === parent.id
                            ? "opacity-100 scale-100 translate-x-0"
                            : "opacity-0 scale-95 -translate-x-2 pointer-events-none"
                        }`}
                        onMouseEnter={() => {
                          if (timeoutRef.current)
                            clearTimeout(timeoutRef.current);
                          setActiveSubmenu(parent.id);
                        }}
                        onMouseLeave={handleMouseLeave}
                        role="menu"
                      >
                        <div className="p-4">
                          <div className="space-y-1">
                            {parent.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/investments/category/${child.name
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors group"
                                onClick={handleLinkClick}
                                role="menuitem"
                              >
                                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                                  {child.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
