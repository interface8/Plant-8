"use client";

import { Testimony } from "@/types/testimony";

interface TestimonyTableProps {
  items: Testimony[];
  onEdit: (item: Testimony) => void;
  onDelete: (id: string) => void;
  onToggleApproval: (id: string, currentStatus: boolean) => void;
}

export default function TestimonyTable({
  items,
  onEdit,
  onDelete,
  onToggleApproval,
}: TestimonyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comment
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Approved
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created On
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modified By
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modified On
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm text-gray-900">
                {item.investorName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {item.location}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {item.comment.slice(0, 50)}...
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.rating}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.isApproved 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {item.isApproved ? "Approved" : "Pending"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {item.createdBy.name || "Unknown"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {new Date(item.createdOn).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {item.modifiedBy.name || "Unknown"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {new Date(item.modifiedOn).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm space-x-2">
                <button
                  onClick={() => onToggleApproval(item.id, item.isApproved)}
                  className={`px-3 py-1 rounded text-white text-xs font-medium ${
                    item.isApproved
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {item.isApproved ? "Unapprove" : "Approve"}
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
