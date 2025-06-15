import { useState } from "react";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function Admin() {
  const [adminUser, setAdminUser] = useState<any>(null);

  const handleLoginSuccess = (user: any) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    setAdminUser(null);
  };

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard user={adminUser} onLogout={handleLogout} />;
}