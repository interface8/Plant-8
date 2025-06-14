"use client";

import { Testimony } from "@/types/testimony";

interface TestimonyTableProps {
  items: Testimony[];
  onEdit: (item: Testimony) => void;
  onDelete: (id: string) => void;
}

export default function TestimonyTable({
  items,
  onEdit,
  onDelete,
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
              <td className="px-4 py-3 text-sm text-gray-900">
                {item.isApproved ? "Yes" : "No"}
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
              <td className="px-4 py-3 text-sm">
                <button
                  onClick={() => onEdit(item)}
                  className="text-green-600 hover:text-green-800 mr-4"
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
