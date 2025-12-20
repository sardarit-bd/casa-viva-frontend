"use client";

import AdminDashboard from "@/components/dashboard/Admin/AdminDashboard";
import OwnerDashboard from "@/components/dashboard/Owner/OwnerDashboard";
import TenantDashboard from "@/components/dashboard/Tenant/TenantDashboard";
import { useAuth } from "@/hooks/userAuth";

export default function DashboardHome() {
  const { user } = useAuth();

  if (!user) return <p>Access denied</p>;

  if (user.role === "admin" || user.role === "super_admin") {
    return <AdminDashboard />;
  }

  if (user.role === "owner") {
    return <OwnerDashboard />;
  }

  if (user.role === "tenant") {
    return <TenantDashboard />;
  }

  return <p>Access denied</p>;
}
