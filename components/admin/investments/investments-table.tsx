"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { 
  Edit2, 
  Eye, 
  Trash2, 
  AlertCircle, 
  User, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Clock,
  Activity,
  XCircle
} from "lucide-react";

interface Investment {
  id: string;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
  numberOfPlots: number;
  plotSize: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNo: string | null;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  productType: {
    id: string;
    name: string;
  };
  land: {
    id: string;
    name: string;
    location: {
      name: string;
      state: {
        name: string;
      };
    };
  } | null;
  _count: {
    tasks: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface SortConfig {
  sortBy: string;
  sortOrder: string;
}

interface InvestmentsTableProps {
  investments: Investment[];
  pagination: Pagination;
  currentSort: SortConfig;
}

export default function InvestmentsTable({ investments, pagination, currentSort }: InvestmentsTableProps) {
  const router = useRouter();
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return Clock;
      case "ACTIVE": return Activity;
      case "COMPLETED": return CheckCircle;
      case "FAILED": return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "ACTIVE": return "text-blue-600 bg-blue-50 border-blue-200";
      case "COMPLETED": return "text-green-600 bg-green-50 border-green-200";
      case "FAILED": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleSort = (sortBy: string) => {
    const params = new URLSearchParams(window.location.search);
    const newOrder = currentSort.sortBy === sortBy && currentSort.sortOrder === "desc" ? "asc" : "desc";
    
    params.set("sortBy", sortBy);
    params.set("sortOrder", newOrder);
    params.set("page", "1"); // Reset to first page
    
    router.push(`/admin/investments?${params.toString()}`);
  };

  const getSortIcon = (sortBy: string) => {
    if (currentSort.sortBy !== sortBy) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return currentSort.sortOrder === "asc" ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`/admin/investments?${params.toString()}`);
  };

  const handleView = (investment: Investment) => {
    router.push(`/admin/investments/${investment.id}`);
  };

  const handleEdit = (investment: Investment) => {
    router.push(`/admin/investments/${investment.id}/edit`);
  };

  const handleDelete = async (investment: Investment) => {
    // Confirmation toast
    toast.custom(
      (t) => (
        <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete investment for &ldquo;<strong>{investment.user.name}</strong>&rdquo; 
            in <strong>{investment.product.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                performDelete(investment);
              }}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const performDelete = async (investment: Investment) => {
    const loadingToast = toast.loading("Deleting investment...", {
      description: "Please wait while we remove the investment.",
    });

    try {
      const response = await fetch(`/api/admin/investments?id=${investment.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Investment deleted successfully!", {
          description: `Investment for "${investment.user.name}" has been removed.`,
        });
        router.refresh();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete investment", {
          description: result.error || "An error occurred while deleting the investment.",
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to delete investment. Please try again.",
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedInvestments.length === investments.length) {
      setSelectedInvestments([]);
    } else {
      setSelectedInvestments(investments.map(inv => inv.id));
    }
  };

  const toggleSelectInvestment = (id: string) => {
    setSelectedInvestments(prev => 
      prev.includes(id) ? prev.filter(investId => investId !== id) : [...prev, id]
    );
  };

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No investments found</h3>
          <p className="text-gray-600 mb-4">
            No investments match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">All Investments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} investments
          </p>
        </div>
        
        {selectedInvestments.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedInvestments.length} selected</span>
            <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">
              Bulk Actions
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedInvestments.length === investments.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("userName")}
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  {getSortIcon("userName")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("productName")}
              >
                <div className="flex items-center space-x-1">
                  <span>Product</span>
                  {getSortIcon("productName")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  {getSortIcon("amount")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon("status")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("progress")}
              >
                <div className="flex items-center space-x-1">
                  <span>Progress</span>
                  {getSortIcon("progress")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {investments.map((investment) => {
              const StatusIcon = getStatusIcon(investment.status);
              
              return (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedInvestments.includes(investment.id)}
                      onChange={() => toggleSelectInvestment(investment.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{investment.user.name}</div>
                        <div className="text-sm text-gray-500">{investment.user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {investment.product.imageUrl ? (
                          <Image 
                            src={investment.product.imageUrl} 
                            alt={investment.product.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400 bg-gray-100 rounded p-1" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{investment.product.name}</div>
                        <div className="text-sm text-gray-500">{investment.productType.name}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div className="font-medium">{formatCurrency(investment.amount)}</div>
                        <div className="text-xs text-gray-500">
                          Expected: {formatCurrency(investment.expectedReturn)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(investment.status)}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {investment.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{investment.progress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${investment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        {investment.land ? (
                          <>
                            <div className="font-medium">{investment.land.name}</div>
                            <div className="text-xs text-gray-500">
                              {investment.land.location.name}, {investment.land.location.state.name}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div>{formatDate(investment.createdAt)}</div>
                        <div className="text-xs text-gray-500">
                          {investment._count.tasks} task{investment._count.tasks !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(investment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEdit(investment)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Edit investment"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(investment)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete investment"
                        disabled={!["PENDING", "FAILED"].includes(investment.status)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pagination.page === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}