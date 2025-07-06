/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ProductType {
  id: string;
  name: string;
  category: string;
  prevId?: string | null;
  children: ProductType[];
  href?: string;
}

export default function InvestmentsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch ProductType data
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch("/api/product-types");
        const data = await response.json();
        setProductTypes(
          data.map((item: any) => ({
            ...item,
            href:
              item.category === "Duration"
                ? `/investments/duration/${item.name
                    .toLowerCase()
                    .replace(" ", "-")}`
                : `/investments/class/${item.name
                    .toLowerCase()
                    .replace(" ", "-")}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };
    fetchProductTypes();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
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
  }, []);

  // Handle hover open/close with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveSubmenu(null);
    }, 200);
  };

  // Toggle submenu on click (mobile)
  const toggleSubmenu = (id: string) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const durations = productTypes.filter((type) => type.category === "Duration");
  const classes = productTypes.filter(
    (type) => type.category === "Class" && !type.prevId
  );

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
          className={`ml-1 h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="p-4">
          {/* Durations Section */}
          {durations.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                By Duration
              </h3>
              <div className="space-y-1">
                {durations.map((duration) => (
                  <Link
                    key={duration.id}
                    href={duration.href || "#"}
                    className="block px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      setActiveSubmenu(null);
                    }}
                    role="menuitem"
                  >
                    {duration.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Classes Section */}
          {classes.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                By Class
              </h3>
              <div className="space-y-1">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="relative">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-between"
                      onClick={() => toggleSubmenu(classItem.id)}
                      onMouseEnter={() => setActiveSubmenu(classItem.id)}
                      role="menuitem"
                    >
                      {classItem.name}
                      {classItem.children.length > 0 && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            activeSubmenu === classItem.id ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>
                    {classItem.children.length > 0 && (
                      <div
                        className={`absolute left-full top-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ease-in-out ${
                          activeSubmenu === classItem.id
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                        onMouseEnter={() => {
                          if (timeoutRef.current)
                            clearTimeout(timeoutRef.current);
                          setActiveSubmenu(classItem.id);
                        }}
                        onMouseLeave={handleMouseLeave}
                        role="menu"
                      >
                        <div className="p-4">
                          {classItem.children.map((subClass) => (
                            <Link
                              key={subClass.id}
                              href={subClass.href || "#"}
                              className="block px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              onClick={() => {
                                setIsOpen(false);
                                setActiveSubmenu(null);
                              }}
                              role="menuitem"
                            >
                              {subClass.name}
                            </Link>
                          ))}
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
