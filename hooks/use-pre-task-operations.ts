"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PreTaskData {
  title: string;
  description?: string;
  estimatedCompletionDate?: Date;
  productId: string;
}

export function usePreTaskOperations() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createPreTask = async (data: PreTaskData) => {
    setIsLoading(true);
    
    const loadingToast = toast.loading("Creating pre-task...", {
      description: "Please wait while we save your pre-task.",
    });

    try {
      const response = await fetch("/api/pre-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.preTask) {
        toast.dismiss(loadingToast);
        toast.success("Pre-task created successfully!", {
          description: `"${result.preTask.title}" has been added to the system.`,
        });
        
        router.refresh();
        return { success: true, data: result.preTask };
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to create pre-task.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to create pre-task", {
          description: errorMessage,
        });
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMsg = "Failed to create pre-task. Please try again.";
      
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: errorMsg,
      });
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreTask = async (id: string, data: Partial<PreTaskData>) => {
    setIsLoading(true);
    
    const loadingToast = toast.loading("Updating pre-task...", {
      description: "Please wait while we save your changes.",
    });

    try {
      const response = await fetch(`/api/pre-tasks?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Pre-task updated successfully!", {
          description: `"${data.title || 'Pre-task'}" has been updated.`,
        });
        
        router.refresh();
        return { success: true, data: result.preTask };
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to update pre-task.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to update pre-task", {
          description: errorMessage,
        });
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMsg = "Failed to update pre-task. Please try again.";
      
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: errorMsg,
      });
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const deletePreTask = async (id: string, title: string) => {
    setIsLoading(true);
    
    const loadingToast = toast.loading("Deleting pre-task...", {
      description: "Please wait while we remove the pre-task.",
    });

    try {
      const response = await fetch(`/api/pre-tasks?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Pre-task deleted successfully!", {
          description: `"${title}" has been removed from the system.`,
        });
        
        router.refresh();
        return { success: true };
      } else {
        const errorMessage = result.error || "Failed to delete pre-task.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to delete pre-task", {
          description: errorMessage,
        });
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMsg = "Failed to delete pre-task. Please try again.";
      
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: errorMsg,
      });
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPreTask,
    updatePreTask,
    deletePreTask,
    isLoading,
  };
}