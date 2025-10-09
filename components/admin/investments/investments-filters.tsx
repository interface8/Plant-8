"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface CurrentFilters {
  search?: string;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface InvestmentsFiltersProps {
  products: Product[];
  users: User[];
  currentFilters: CurrentFilters;
}

export default function InvestmentsFilters({ currentFilters }: Pick<InvestmentsFiltersProps, 'currentFilters'>) {
  const router = useRouter();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<CurrentFilters>(currentFilters);

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        params.set(key, value.toString());
      }
    });
    
    // Reset to first page when applying filters
    params.set("page", "1");
    
    router.push(`/admin/investments?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({});
    router.push("/admin/investments");
  };

  const exportInvestments = async () => {
    const loadingToast = toast.loading("Exporting investments...");
    
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      params.set("limit", "1000"); // Export up to 1000 records
      
      const response = await fetch(`/api/admin/investments?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        // Convert to CSV
        const csvContent = convertToCSV(data.investments);
        downloadCSV(csvContent, `investments-${new Date().toISOString().split('T')[0]}.csv`);
        
        toast.dismiss(loadingToast);
        toast.success("Investments exported successfully!");
      } else {
        throw new Error(data.error || "Export failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to export investments");
      console.error("Export error:", error);
    }
  };

  const convertToCSV = (investments: unknown[]) => {
    const headers = [
      "Investment ID",
      "User Name",
      "User Email",
      "Product Name",
      "Product Type",
      "Amount",
      "Expected Return",
      "Progress",
      "Status",
      "Number of Plots",
      "Plot Size",
      "Land Location",
      "Created Date",
      "Tasks Count"
    ];

    const rows = investments.map((investment: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inv = investment as Record<string, any>;
      return [
        inv.id || "N/A",
        inv.user?.name || "N/A",
        inv.user?.email || "N/A",
        inv.product?.name || "N/A",
        inv.productType?.name || "N/A",
        inv.amount || "N/A",
        inv.expectedReturn || "N/A",
        (inv.progress || 0) + "%",
        inv.status || "N/A",
        inv.numberOfPlots || "N/A",
        inv.plotSize || "N/A",
        inv.land ? 
          `${inv.land.name || "N/A"}, ${inv.land.location?.name || "N/A"}, ${inv.land.location?.state?.name || "N/A"}` : 
          "N/A",
        inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "N/A",
        inv._count?.tasks || "0"
      ];
    });

    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => value && value.toString().trim() !== "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {Object.values(currentFilters).filter(v => v).length} active filters
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filters
          </button>
          
          <button
            onClick={exportInvestments}
            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, email, product..."
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        {/* Status Filter */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.status || ""}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>

        {/* Sort By */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.sortBy || "createdAt"}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="progress">Sort by Progress</option>
          <option value="status">Sort by Status</option>
          <option value="userName">Sort by User Name</option>
          <option value="productName">Sort by Product</option>
        </select>

        {/* Sort Order */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.sortOrder || "desc"}
          onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Advanced Filters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Amount Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min amount"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={filters.minAmount || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Max amount"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={filters.maxAmount || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={filters.dateFrom || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={filters.dateTo || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
        
        <p className="text-sm text-gray-500">
          Use filters to narrow down the investment list and find specific records quickly.
        </p>
      </div>
    </div>
  );
}