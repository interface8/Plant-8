"use client";

import { useState } from "react";

interface BlogFilterProps {
  categories: string[];
  popularTags: string[];
  selectedCategory?: string;
  selectedTags: string[];
  searchQuery: string;
  onCategoryChange: (category: string | undefined) => void;
  onTagsChange: (tags: string[]) => void;
  onSearchChange: (search: string) => void;
}

export default function BlogFilter({
  categories,
  popularTags,
  selectedCategory,
  selectedTags,
  searchQuery,
  onCategoryChange,
  onTagsChange,
  onSearchChange,
}: BlogFilterProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Search</h3>
        <form onSubmit={handleSearchSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search blogs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              !selectedCategory
                ? "bg-green-100 text-green-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-green-100 text-green-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => onTagsChange([])}
              className="mt-3 text-sm text-red-600 hover:text-red-700"
            >
              Clear all tags
            </button>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedCategory || selectedTags.length > 0 || searchQuery) && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Active Filters
            </h3>
            <button
              onClick={() => {
                onCategoryChange(undefined);
                onTagsChange([]);
                onSearchChange("");
                setSearchInput("");
              }}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            {selectedCategory && (
              <div>Category: <span className="font-medium">{selectedCategory}</span></div>
            )}
            {selectedTags.length > 0 && (
              <div>Tags: <span className="font-medium">{selectedTags.join(", ")}</span></div>
            )}
            {searchQuery && (
              <div>Search: <span className="font-medium">{searchQuery}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
