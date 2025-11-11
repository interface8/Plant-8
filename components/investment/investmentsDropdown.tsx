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
        <div className="relative inline-block mr-2">
          <div className="text-xl animate-bounce">🌱</div>
        </div>
        <span className="text-gray-700 text-sm">Loading investments...</span>
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
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>Investments</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="mt-1 ml-4 space-y-1 border-l-2 border-green-200 pl-3">
            {/* Browse All Catalog Link */}
            <Link
              href="/investments/catalog"
              className="block mb-2 px-3 py-2 bg-green-600 text-white rounded-md font-medium text-center text-sm hover:bg-green-700 transition-colors"
              onClick={handleLinkClick}
            >
              Browse All Investments
            </Link>
            
            {/* Duration Section */}
            {durations.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  By Duration
                </div>
                {durations.map((duration) => (
                  <Link
                    key={duration.id}
                    href={`/investments/catalog?duration=${encodeURIComponent(duration.name)}`}
                    className="block px-3 py-1.5 text-sm text-gray-600 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors"
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
                <div className="flex items-center px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  By Type
                </div>
                {parentProductTypes.map((parent) => (
                  <div key={parent.id}>
                    <button
                      className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors flex items-center justify-between"
                      onClick={() => toggleSubmenu(parent.id)}
                    >
                      {parent.name}
                      {parent.children?.length > 0 && (
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            activeSubmenu === parent.id ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>
                    {parent.children?.length > 0 &&
                      activeSubmenu === parent.id && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-green-200 pl-2">
                          {parent.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/investments/catalog?type=${encodeURIComponent(child.name)}`}
                              className="block px-2 py-1.5 text-xs text-gray-500 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors"
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
        className="text-gray-700 hover:text-[#1E7B47] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
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
        className={`absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-green-200 transform transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="p-5">
          {/* Browse All Catalog Link */}
          <Link
            href="/investments/catalog"
            className="block mb-4 p-3 bg-[#1E7B47] hover:bg-[#145C33] text-white rounded-lg font-medium text-center transition-all duration-200 shadow-sm"
            onClick={handleLinkClick}
            role="menuitem"
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Browse All Investments</span>
            </div>
          </Link>
          
          {/* Duration Section */}
          {durations.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center mb-2.5">
                <Clock className="h-4 w-4 mr-2 text-[#1E7B47]" />
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  By Duration
                </h3>
              </div>
              <div className="space-y-0.5">
                {durations.map((duration) => (
                  <Link
                    key={duration.id}
                    href={`/investments/catalog?duration=${encodeURIComponent(duration.name)}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:text-[#1E7B47] hover:bg-green-100 rounded-md transition-colors group"
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
            <div className="border-t border-green-200 pt-5">
              <div className="flex items-center mb-2.5">
                <TrendingUp className="h-4 w-4 mr-2 text-[#1E7B47]" />
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">By Type</h3>
              </div>
              <div className="space-y-0.5">
                {parentProductTypes.map((parent) => (
                  <div key={parent.id} className="relative group">
                    <div
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#1E7B47] hover:bg-green-100 rounded-md transition-colors flex items-center justify-between cursor-pointer"
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
                        className={`absolute left-full top-0 ml-2 w-56 bg-white rounded-lg shadow-xl border border-green-200 transition-all duration-300 ease-in-out ${
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
                        <div className="p-3">
                          <div className="space-y-0.5">
                            {parent.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/investments/catalog?type=${encodeURIComponent(child.name)}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:text-[#1E7B47] hover:bg-green-100 rounded-md transition-colors group"
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
