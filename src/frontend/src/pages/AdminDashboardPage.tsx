import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  IndianRupee,
  Shield,
  Users,
  Video,
} from "lucide-react";
import { getCommissions, getUsers } from "../store";
import type { PageName } from "../types";

interface AdminDashboardPageProps {
  onNavigate: (page: PageName) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const users = getUsers();
  const commissions = getCommissions();

  const totalUsers = users.length;
  const pendingApprovals = users.filter((u) => u.status === "pending").length;
  const activeMembers = users.filter((u) => u.status === "approved").length;
  const totalRevenue =
    users.filter((u) => u.paymentStatus === "confirmed").length * 118;

  const recentUsers = [...users]
    .sort(
      (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            TM11 PrimeTime Management Panel
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            icon: <Users className="w-5 h-5" />,
            color: "blue",
          },
          {
            label: "Pending Approvals",
            value: pendingApprovals,
            icon: <Clock className="w-5 h-5" />,
            color: "yellow",
            urgent: pendingApprovals > 0,
          },
          {
            label: "Total Revenue",
            value: `₹${totalRevenue}`,
            icon: <IndianRupee className="w-5 h-5" />,
            color: "gold",
          },
          {
            label: "Active Members",
            value: activeMembers,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "green",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`dark-card ${stat.urgent ? "border-yellow-500/40" : stat.color === "gold" ? "gold-border" : ""}`}
          >
            <CardContent className="p-5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                  stat.color === "gold"
                    ? "gold-gradient text-background"
                    : stat.color === "green"
                      ? "bg-green-500/20 text-green-400"
                      : stat.color === "yellow"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {stat.icon}
              </div>
              <div
                className={`text-2xl font-display font-bold ${stat.color === "gold" ? "gold-text" : ""}`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
              {stat.urgent && (
                <div className="text-xs text-yellow-400 font-medium mt-1">
                  ⚠ Needs attention
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button
          className="h-16 dark-card border border-border hover:border-primary/40 text-foreground bg-transparent flex items-center gap-3 justify-start px-5 hover:bg-secondary/30"
          variant="ghost"
          onClick={() => onNavigate("admin-users")}
          data-ocid="admin.tab"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Manage Users</div>
            <div className="text-xs text-muted-foreground">
              Approve, reject, remove members
            </div>
          </div>
        </Button>
        <Button
          className="h-16 dark-card border border-border hover:border-primary/40 text-foreground bg-transparent flex items-center gap-3 justify-start px-5 hover:bg-secondary/30"
          variant="ghost"
          onClick={() => onNavigate("admin-payments")}
          data-ocid="admin.tab"
        >
          <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Payment Approvals</div>
            <div className="text-xs text-muted-foreground">
              Confirm or reject UPI payments
            </div>
          </div>
        </Button>
        <Button
          className="h-16 dark-card border border-border hover:border-primary/40 text-foreground bg-transparent flex items-center gap-3 justify-start px-5 hover:bg-secondary/30"
          variant="ghost"
          onClick={() => onNavigate("admin-videos")}
          data-ocid="admin.tab"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Video Library</div>
            <div className="text-xs text-muted-foreground">
              Add or remove video content
            </div>
          </div>
        </Button>
      </div>

      {/* Recent registrations */}
      <Card className="dark-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Recent Registrations</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary text-xs"
            onClick={() => onNavigate("admin-users")}
          >
            View all →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 p-3 bg-secondary/20 rounded-lg"
                data-ocid="admin.row"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {user.mobile}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      user.status === "approved"
                        ? "status-approved border-0"
                        : user.status === "rejected"
                          ? "status-rejected border-0"
                          : "status-pending border-0"
                    }`}
                  >
                    {user.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.joinedAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission overview */}
      {commissions.length > 0 && (
        <Card className="dark-card">
          <CardHeader>
            <CardTitle className="text-lg">Commission Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((level) => {
                const total = commissions
                  .filter((c) => c.level === level)
                  .reduce((s, c) => s + c.amount, 0);
                const count = commissions.filter(
                  (c) => c.level === level,
                ).length;
                const rate = level === 1 ? 10 : level === 2 ? 5 : 3;
                return (
                  <div key={level} className="bg-secondary/30 rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Level {level} (₹{rate})
                    </div>
                    <div className="font-display text-xl font-bold gold-text">
                      ₹{total}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {count} commissions
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
