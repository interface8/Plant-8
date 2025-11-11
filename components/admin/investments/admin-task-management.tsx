"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  User,
  Upload,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  imageUrl: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  modifiedOn: string | null;
  inspectorId: string | null;
  inspector: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  modifiedBy: {
    id: string;
    name: string;
    image: string | null;
  } | null;
}

interface Investment {
  id: string;
  userId: string;
  productId: string;
  productTypeId: string;
  landId: string | null;
  numberOfPlots: number;
  numberOfTerms: number;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
  };
  productType: { id: string; name: string };
  land: {
    id: string;
    name: string;
    location: {
      id: string;
      name: string;
      state: { id: string; name: string };
    };
  } | null;
  tasks: Task[];
  taskStats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    progressPercentage: number;
  };
}

interface AdminTaskManagementProps {
  investment: Investment;
  adminId: string;
}

export default function AdminTaskManagement({ investment, adminId }: AdminTaskManagementProps) {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [taskComment, setTaskComment] = useState<string>("");
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setTaskStatus(task.status);
    setTaskComment("");
    setTaskImage(null);
    setImagePreview(task.imageUrl || "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTaskImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    setIsUpdating(true);
    try {
      let imageUrl = selectedTask.imageUrl;

      // Upload image if provided
      if (taskImage) {
        const formData = new FormData();
        formData.append("image", taskImage);

        const uploadRes = await fetch("/api/tasks/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // Update task
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: taskStatus,
          imageUrl,
          inspectorId: adminId,
          comment: taskComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      toast.success("Task updated successfully");
      router.refresh();
      setSelectedTask(null);
      setTaskComment("");
      setTaskImage(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "IN_PROGRESS":
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case "OVERDUE":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case "OVERDUE":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9F6EE] via-white to-[#E9F6EE]">
      {/* Header */}
      <div
        className="py-6 px-4"
        style={{ background: "linear-gradient(90deg, #1E7B47 0%, #145C33 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/investments")}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Investments
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-white">
                Task Management - {investment.product.name}
              </h1>
              <p className="text-white/80 mt-1">
                Investor: {investment.user.name} | Investment ID: {investment.id.slice(0, 8)}...
              </p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 w-fit">
              {investment.taskStats.progressPercentage}% Complete
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Task List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">Overall Progress</h2>
                    <span className="text-2xl font-bold text-[#1E7B47]">
                      {investment.taskStats.progressPercentage}%
                    </span>
                  </div>
                  <Progress value={investment.taskStats.progressPercentage} className="h-3" />
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-lg font-semibold">{investment.taskStats.pending}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600">In Progress</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {investment.taskStats.inProgress}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-600">Completed</p>
                      <p className="text-lg font-semibold text-green-600">
                        {investment.taskStats.completed}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-red-600">Overdue</p>
                      <p className="text-lg font-semibold text-red-600">
                        {investment.taskStats.overdue}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task List */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">All Tasks</h3>
                <div className="space-y-3">
                  {investment.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedTask?.id === task.id ? "border-[#1E7B47] bg-[#E9F6EE]/30" : ""
                      }`}
                      onClick={() => handleTaskSelect(task)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(task.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium">
                                {index + 1}. {task.name}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                              {task.imageUrl && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                  <ImageIcon className="h-4 w-4" />
                                  <span>Has proof image</span>
                                </div>
                              )}
                            </div>
                            {getStatusBadge(task.status)}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Updated {formatDistanceToNow(new Date(task.updatedAt))} ago
                            {task.inspector && ` by ${task.inspector.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {investment.tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No tasks have been created for this investment yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Task Update Form */}
          <div className="space-y-6">
            {selectedTask ? (
              <>
                {/* Task Details */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Update Task</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Task Name</Label>
                        <p className="text-sm font-medium mt-1">{selectedTask.name}</p>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={taskStatus} onValueChange={setTaskStatus}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="OVERDUE">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="image">Upload Proof Image</Label>
                        <div className="mt-2">
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => document.getElementById("image")?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {taskImage ? "Change Image" : "Upload Image"}
                          </Button>
                        </div>
                        {imagePreview && (
                          <div className="mt-3 relative aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt="Task proof"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="comment">Comment / Notes</Label>
                        <Textarea
                          id="comment"
                          value={taskComment}
                          onChange={(e) => setTaskComment(e.target.value)}
                          placeholder="Add any comments or notes about this task..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <Button
                        onClick={handleUpdateTask}
                        disabled={isUpdating}
                        className="w-full bg-[#1E7B47] hover:bg-[#145C33]"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isUpdating ? "Updating..." : "Update Task"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Task History */}
                {selectedTask.modifiedOn && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">Last Updated</h4>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          {format(new Date(selectedTask.modifiedOn), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        {selectedTask.modifiedBy && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>by {selectedTask.modifiedBy.name}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a task to update its status and add proof images</p>
                </CardContent>
              </Card>
            )}

            {/* Investment Info */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Investment Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₦{investment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Return</span>
                    <span className="font-medium text-green-600">
                      ₦{investment.expectedReturn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plots</span>
                    <span className="font-medium">{investment.numberOfPlots}</span>
                  </div>
                  {investment.land && (
                    <div className="pt-3 border-t">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-xs text-muted-foreground">
                            {investment.land.name}, {investment.land.location.name},{" "}
                            {investment.land.location.state.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
