"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Shield,
  UserPlus,
  X,
  Search,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    users: number;
  };
  users: Array<{
    user: User;
    assignedAt: Date;
  }>;
}

interface RoleManagerProps {
  initialRoles: Role[];
}

export function RoleManager({ initialRoles }: RoleManagerProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      if (response.ok) {
        const rolesData = await response.json();
        setRoles(rolesData);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Please select both user and role");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          roleId: selectedRole,
        }),
      });

      if (response.ok) {
        toast.success("Role assigned successfully");
        setSelectedUser("");
        setSelectedRole("");
        setSearchTerm("");
        fetchRoles();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to assign role");
      }
    } catch (error) {
      toast.error("Failed to assign role");
      console.error("Error assigning role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/user-roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          roleId,
        }),
      });

      if (response.ok) {
        toast.success("Role removed successfully");
        fetchRoles();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to remove role");
      }
    } catch (error) {
      toast.error("Failed to remove role");
      console.error("Error removing role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRoleName.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Role created successfully");
        setNewRoleName("");
        setShowCreateForm(false);
        fetchRoles();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create role");
      }
    } catch (error) {
      toast.error("Failed to create role");
      console.error("Error creating role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (["ADMIN", "USER"].includes(roleName)) {
      toast.error("Cannot delete system roles");
      return;
    }

    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Role deleted successfully");
        fetchRoles();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete role");
      }
    } catch (error) {
      toast.error("Failed to delete role");
      console.error("Error deleting role:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSystemRole = (roleName: string) => {
    return ["ADMIN", "USER"].includes(roleName);
  };

  const selectedUserObj = users.find(user => user.id === selectedUser);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Role Management Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assign Role Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select User
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={selectedUserObj?.name || searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedUser("");
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="pl-10"
                />
                {showUserDropdown && searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setSearchTerm("");
                          setShowUserDropdown(false);
                        }}
                      >
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="p-3 text-gray-500 text-center">No users found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Button 
                onClick={handleAssignRole} 
                disabled={loading || !selectedUser || !selectedRole}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
            </div>

            <div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          </div>

          {/* Create Role Form */}
          {showCreateForm && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Role Name
                  </label>
                  <Input
                    placeholder="Enter role name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateRole} disabled={loading}>
                    Create Role
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewRoleName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Current Role Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                    <Badge variant={isSystemRole(role.name) ? "default" : "secondary"}>
                      {isSystemRole(role.name) ? "System" : "Custom"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ({role._count.users} users)
                    </span>
                  </div>
                  {!isSystemRole(role.name) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id, role.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {role.users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {role.users.map((userRole) => (
                      <div key={userRole.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {userRole.user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {userRole.user.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {userRole.user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRole(userRole.user.id, role.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No users assigned to this role
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}