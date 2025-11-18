"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PreTaskFormProps {
  products: { id: string; name: string }[];
  onSuccess?: (newPreTask: any) => void;
}

export default function AdminPreTaskForm({ products, onSuccess }: PreTaskFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!session?.user?.id) {
      const errorMsg = "Please sign in to create a pre-task.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    if (!title.trim()) {
      const errorMsg = "Title is required.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    if (!productId) {
      const errorMsg = "Product selection is required.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Creating pre-task...", {
      description: "Please wait while we save your pre-task.",
    });

    try {
      const response = await fetch("/api/pre-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          estimatedCompletionDate: estimatedCompletionDate || undefined,
          productId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.preTask) {
        // Clear form on success
        setTitle("");
        setDescription("");
        setEstimatedCompletionDate("");
        setProductId("");
        setError(null);
        
        toast.dismiss(loadingToast);
        toast.success("Pre-task created successfully!", {
          description: `"${result.preTask.title}" has been added to the system.`,
        });
        // If parent provided an onSuccess handler, call it so caller can update local state
        if (typeof onSuccess === "function") {
          try {
            onSuccess(result.preTask);
          } catch (err) {
            // ignore errors from parent handler
          }
        }

        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to create pre-task.";
        setError(errorMessage);
        
        toast.dismiss(loadingToast);
        toast.error("Failed to create pre-task", {
          description: errorMessage,
        });
      }
    } catch {
      const errorMsg = "Failed to create pre-task. Please try again.";
      setError(errorMsg);
      
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label
          htmlFor="estimatedCompletionDate"
          className="block text-sm font-medium text-gray-700"
        >
          Estimated Completion Date
        </label>
        <input
          type="date"
          id="estimatedCompletionDate"
          value={estimatedCompletionDate}
          onChange={(e) => setEstimatedCompletionDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label
          htmlFor="productId"
          className="block text-sm font-medium text-gray-700"
        >
          Product
        </label>
        <select
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {isSubmitting ? "Creating..." : "Create Pre-Task"}
      </button>
    </form>
  );
}
