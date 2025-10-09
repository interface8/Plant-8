"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Users,
  Clock,
  Activity,
  Search,
  RefreshCw,
  Calendar,
  User,
} from "lucide-react";

interface AuditActivity {
  id: string;
  type: "role_assigned" | "role_created" | "role_modified" | "role_deleted";
  description: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  role?: {
    id: string;
    name: string;
  };
  performedBy?: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: Date;
}

interface RoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
  };
}

interface RoleHistory {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt?: Date;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

interface AuditData {
  recentActivity: AuditActivity[];
  roleAssignments: RoleAssignment[];
  roleHistory: RoleHistory[];
  totalAssignments: number;
}

export function RoleAuditLog() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/roles/audit");
      if (response.ok) {
        const data = await response.json();
        setAuditData(data);
      }
    } catch (error) {
      console.error("Error fetching audit data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "role_assigned":
        return Users;
      case "role_created":
        return Shield;
      case "role_modified":
        return Activity;
      case "role_deleted":
        return Activity;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "role_assigned":
        return { bg: "bg-green-50", text: "text-green-600", badge: "bg-green-100 text-green-800" };
      case "role_created":
        return { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-100 text-blue-800" };
      case "role_modified":
        return { bg: "bg-yellow-50", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-800" };
      case "role_deleted":
        return { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100 text-red-800" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-600", badge: "bg-gray-100 text-gray-800" };
    }
  };

  const filteredActivities = auditData?.recentActivity.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.role?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || activity.type === filter;

    return matchesSearch && matchesFilter;
  }) || [];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading audit data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditData?.recentActivity.length || 0}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Role Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditData?.roleAssignments.length || 0}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Roles Created
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditData?.roleHistory.length || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Recent (24h)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditData?.recentActivity.filter(a => 
                    new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length || 0}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Activities</option>
                <option value="role_assigned">Role Assignments</option>
                <option value="role_created">Role Creations</option>
                <option value="role_modified">Role Modifications</option>
                <option value="role_deleted">Role Deletions</option>
              </select>
              <Button onClick={fetchAuditData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const colors = getActivityColor(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className={`${colors.bg} p-3 rounded-lg`}>
                      <ActivityIcon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <Badge className={colors.badge}>
                          {activity.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {activity.performedBy && (
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>by {activity.performedBy.name}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No activities found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}