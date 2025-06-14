"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "@/types/testimony";

interface TestimonyFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export default function TestimonyForm({
  register,
  errors,
  onSubmit,
  onCancel,
  isEditing,
}: TestimonyFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Investor Name
          </label>
          <input
            type="text"
            {...register("investorName")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.investorName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.investorName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            {...register("location")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            {...register("comment")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            rows={4}
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating (1–5)
          </label>
          <input
            type="number"
            {...register("rating", { valueAsNumber: true })}
            min="1"
            max="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isApproved")}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Approved
          </label>
          {errors.isApproved && (
            <p className="text-red-500 text-sm mt-1">
              {errors.isApproved.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          {isEditing ? "Update" : "Create"} Testimony
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
