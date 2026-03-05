import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PageName } from "../types";

interface AdminLoginPageProps {
  onNavigate: (page: PageName) => void;
  onAdminLogin: () => void;
}

const ADMIN_PASSWORD = "admin123";

export function AdminLoginPage({
  onNavigate,
  onAdminLogin,
}: AdminLoginPageProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");
    if (!password) {
      setError("Please enter the admin password");
      return;
    }
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password. Please try again.");
      return;
    }
    localStorage.setItem("tm11_admin", "true");
    onAdminLogin();
    onNavigate("admin-dashboard");
    toast.success("Welcome, Admin!");
  }

  return (
    <div className="container py-12 max-w-sm">
      <Card className="dark-card gold-border">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4 border border-border">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your admin credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Admin Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input pr-10"
                data-ocid="admin_login.input"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            className="w-full gold-gradient text-background font-bold h-11"
            onClick={handleLogin}
            data-ocid="admin_login.submit_button"
          >
            <Shield className="w-4 h-4 mr-2" />
            Login as Admin
          </Button>

          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to User Login
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
