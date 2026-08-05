"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { UserCheck, Shield, KeyRound, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllAdminUsersAction, createAdminUserAction } from "@/actions/admin.actions";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin" as const,
  });

  const [admins, setAdmins] = useState<AdminUserRow[]>([]);

  const fetchAdmins = async () => {
    try {
      const res = await getAllAdminUsersAction();
      if (res.success && res.data) {
        setAdmins(res.data as AdminUserRow[]);
      } else {
        setAdmins([]);
      }
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createAdminUserAction(newAdmin);
      if (res.success) {
        toast({ title: "Admin User Created", description: res.message, variant: "success" });
        setCreateModalOpen(false);
        setNewAdmin({ fullName: "", email: "", password: "", role: "admin" });
        fetchAdmins();
      } else {
        toast({ title: "Creation Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create admin user.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Admin User Management & RBAC Roles"
          subtitle="Manage administrative accounts, role assignments, password resets, and staff security permissions."
        />
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-2 self-start md:self-auto rounded-xl"
        >
          <UserPlus className="h-4 w-4" /> Create Admin Account
        </Button>
      </div>

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Staff Name</th>
                <th className="p-4">Official Email</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Account Creation Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold">
                    Loading administrative team...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#167A3D]" /> {adm.name}
                    </td>
                    <td className="p-4 font-medium">{adm.email}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-[#167A3D] uppercase">
                        {adm.role}
                      </span>
                    </td>
                    <td className="p-4">{new Date(adm.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-[#D7E8D8]">
                          <KeyRound className="h-3 w-3" /> Reset
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3 w-3" /> Disable
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Admin Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#167A3D]" /> Create Administrative Account
            </CardTitle>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={newAdmin.fullName}
                onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Official Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Temporary Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-[#167A3D] text-white">
              {submitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
