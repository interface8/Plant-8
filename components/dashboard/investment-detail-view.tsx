"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  Package,
  DollarSign,
  User,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  imageUrl: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  inspectorId: string | null;
  inspector: {
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
  numberOfFarmers: number;
  amount: number;
  expectedReturn: number;
  totalCost: number;
  estimatedRevenue: number;
  netReturn: number;
  roiPercent: number;
  progress: number;
  status: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    roi: number | null;
    currentMarketPricePerKg: number;
    duration: { id: string; name: string };
    ProductType: { id: string; name: string };
  };
  productType: { id: string; name: string };
  land: {
    id: string;
    name: string;
    gpsCoordinates: string | null;
    imageUrl: string | null;
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

interface InvestmentDetailViewProps {
  investment: Investment;
}

export default function InvestmentDetailView({ investment }: InvestmentDetailViewProps) {
  const router = useRouter();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

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

  const getInvestmentStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-600 text-white">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
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
            onClick={() => router.push("/dashboard")}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-white">
                {investment.product.name} Investment
              </h1>
              <p className="text-white/80 mt-1">
                Investment ID: {investment.id.slice(0, 8)}...
              </p>
            </div>
            <div>{getInvestmentStatusBadge(investment.status)}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Investment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Investment Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span>Investment Amount</span>
                    </div>
                    <p className="text-lg font-semibold">₦{investment.amount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>Expected Return</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      ₦{investment.expectedReturn.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>Net Return</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      ₦{investment.netReturn.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Package className="h-4 w-4" />
                      <span>Number of Plots</span>
                    </div>
                    <p className="text-lg font-semibold">{investment.numberOfPlots}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <p className="text-lg font-semibold">{investment.product.duration.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Started</span>
                    </div>
                    <p className="text-sm">{format(new Date(investment.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </div>

                {investment.land && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Land Location</p>
                        <p className="text-sm text-muted-foreground">
                          {investment.land.name}, {investment.land.location.name},{" "}
                          {investment.land.location.state.name}
                        </p>
                        {investment.land.gpsCoordinates && (
                          <p className="text-xs text-muted-foreground mt-1">
                            GPS: {investment.land.gpsCoordinates}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tasks Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">Task Progress</h2>
                    <span className="text-2xl font-bold text-[#1E7B47]">
                      {investment.taskStats.progressPercentage}%
                    </span>
                  </div>
                  <Progress value={investment.taskStats.progressPercentage} className="h-3" />
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold">{investment.taskStats.total}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-600">Completed</p>
                      <p className="text-lg font-semibold text-green-600">
                        {investment.taskStats.completed}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600">In Progress</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {investment.taskStats.inProgress}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-lg font-semibold">{investment.taskStats.pending}</p>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg mb-3">All Tasks</h3>
                  {investment.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() =>
                          setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                        }
                      >
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
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(task.status)}
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${
                                  expandedTaskId === task.id ? "rotate-90" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {expandedTaskId === task.id && (
                            <div className="mt-3 pt-3 border-t space-y-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Created {formatDistanceToNow(new Date(task.createdAt))} ago
                                </span>
                              </div>
                              {task.completedAt && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>
                                    Completed {formatDistanceToNow(new Date(task.completedAt))} ago
                                  </span>
                                </div>
                              )}
                              {task.inspector && (
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-3 w-3" />
                                  <span>Inspector: {task.inspector.name}</span>
                                </div>
                              )}
                            </div>
                          )}
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

          {/* Right Column - Product Info & Actions */}
          <div className="space-y-6">
            {/* Product Card */}
            <Card>
              <CardContent className="p-6">
                {investment.product.images && investment.product.images[0] && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                    <Image
                      src={investment.product.images[0]}
                      alt={investment.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{investment.product.name}</h3>
                <Badge variant="outline" className="mb-3">
                  {investment.productType.name}
                </Badge>
                {investment.product.description && (
                  <p className="text-sm text-muted-foreground">
                    {investment.product.description}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/investments/product/${investment.productId}`}>
                    <Button variant="outline" className="w-full">
                      View Product Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="font-semibold">₦{investment.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Revenue</span>
                    <span className="font-semibold">
                      ₦{investment.estimatedRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-medium">Net Return</span>
                    <span className="font-bold text-green-600">
                      ₦{investment.netReturn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="font-semibold text-green-600">
                      {investment.roiPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report an Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
