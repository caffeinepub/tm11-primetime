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
import { AlertCircle, Crown, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getUsers, setCurrentUserId } from "../store";
import type { PageName } from "../types";

interface LoginPageProps {
  onNavigate: (page: PageName) => void;
  onLogin: (userId: string) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");
    if (!mobile.trim()) {
      setError("Please enter your mobile number");
      return;
    }

    const users = getUsers();
    const user = users.find((u) => u.mobile === mobile);

    if (!user) {
      setError("Mobile number not found. Please check and try again.");
      return;
    }

    setCurrentUserId(user.id);
    onLogin(user.id);

    if (user.status === "rejected") {
      toast.error("Your account has been rejected. Please contact support.");
      return;
    }

    if (user.status === "pending") {
      onNavigate("pending");
      toast.info("Your account is pending approval.");
    } else {
      onNavigate("dashboard");
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
    }
  }

  return (
    <div className="container py-12 max-w-md">
      <Card className="dark-card gold-border">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-background" />
          </div>
          <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Login to your TM11 PrimeTime account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-mobile">Mobile Number</Label>
            <Input
              id="login-mobile"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="bg-input"
              type="tel"
              inputMode="numeric"
              data-ocid="login.input"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
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
            data-ocid="login.submit_button"
          >
            Login
          </Button>

          <div className="relative flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Don't have an account?{" "}
            <span className="text-primary font-medium">Register here</span>
          </button>

          <div className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => onNavigate("admin-login")}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              data-ocid="login.admin_link"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
