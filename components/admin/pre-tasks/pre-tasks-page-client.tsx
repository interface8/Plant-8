"use client";

import { useState } from "react";
import AdminPreTaskForm from "./pre-task-form";
import PreTaskTable from "./pre-task-table";
import PreTaskStats from "./pre-task-stats";
import { GlobalModal } from "@/components/admin/global-modal";
import { Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PreTasksPageClientProps {
  initialPreTasks: any[];
  products: any[];
}

export default function PreTasksPageClient({ initialPreTasks, products }: PreTasksPageClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [preTasks, setPreTasks] = useState(initialPreTasks);

  const filteredPreTasks = statusFilter 
    ? preTasks.filter(pt => pt.status === statusFilter)
    : preTasks;

  const pendingCount = preTasks.filter(pt => pt.status === 'PENDING').length;
  const completedCount = preTasks.filter(pt => pt.status === 'COMPLETED').length;
  const allCount = preTasks.length;

  const filterCards = [
    {
      label: "All Tasks",
      count: allCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      value: null,
    },
    {
      label: "Pending",
      count: pendingCount,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      value: "PENDING",
    },
    {
      label: "Completed",
      count: completedCount,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      value: "COMPLETED",
    },
  ];

  const handlePreTaskCreated = (newPreTask: any) => {
    setPreTasks([newPreTask, ...preTasks]);
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Pre-Tasks Management</h1>
          <p className="text-green-700">Create and manage pre-tasks for your products.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Pre-Task
        </button>
      </div>
      
      <PreTaskStats preTasks={preTasks} products={products} />

      {/* Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filterCards.map((card) => (
          <Card
            key={card.label}
            className={`cursor-pointer border-2 transition-all ${
              statusFilter === card.value 
                ? 'border-green-500 shadow-lg' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setStatusFilter(card.value)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.count}
                  </p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <PreTaskTable 
        preTasks={filteredPreTasks} 
        products={products}
      />

      <GlobalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Pre-Task"
        size="lg"
      >
        <AdminPreTaskForm 
          products={products} 
          onSuccess={handlePreTaskCreated}
        />
      </GlobalModal>
    </div>
  );
}
