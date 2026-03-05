import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, RefreshCw, Trash2, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { approveUser, getUsers, removeUser, updateUser } from "../store";
import type { User, UserStatus } from "../types";

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [activeTab, setActiveTab] = useState<"all" | UserStatus>("all");

  function refresh() {
    setUsers(getUsers());
  }

  function handleApprove(userId: string) {
    approveUser(userId);
    refresh();
    const user = getUsers().find((u) => u.id === userId);
    toast.success(`${user?.name ?? "User"} approved and activated!`);
  }

  function handleReject(userId: string) {
    const allUsers = getUsers();
    const u = allUsers.find((u2) => u2.id === userId);
    if (!u) return;
    updateUser({
      ...u,
      status: "rejected" as UserStatus,
      paymentStatus: "rejected",
    });
    refresh();
    toast.error(`${u.name} rejected.`);
  }

  function handleRemove(userId: string) {
    removeUser(userId);
    refresh();
    toast.success("User removed from the system.");
  }

  const filtered =
    activeTab === "all" ? users : users.filter((u) => u.status === activeTab);

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.status === "pending").length,
    approved: users.filter((u) => u.status === "approved").length,
    rejected: users.filter((u) => u.status === "rejected").length,
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Approve, reject, or remove members
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={refresh} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as typeof activeTab)}
      >
        <TabsList className="bg-secondary/50">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="capitalize data-[state=active]:gold-gradient data-[state=active]:text-background data-[state=active]:font-bold"
              data-ocid="admin_users.tab"
            >
              {tab}
              <Badge
                variant="secondary"
                className="ml-1.5 text-xs h-4 px-1 min-w-4 flex items-center justify-center"
              >
                {counts[tab]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <div
              className="text-center py-12 dark-card rounded-xl"
              data-ocid="admin_users.empty_state"
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No users found in this category.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-auto rounded-xl dark-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Ref Code
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Referred By
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        UTR
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user, i) => (
                      <tr
                        key={user.id}
                        className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                        data-ocid={`admin_users.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm">
                          {user.mobile}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-secondary/50 px-2 py-0.5 rounded font-bold text-primary">
                            {user.referralCode}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs">
                            {user.referredBy ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              user.status === "approved"
                                ? "status-approved border-0"
                                : user.status === "rejected"
                                  ? "status-rejected border-0"
                                  : "status-pending border-0"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              user.paymentStatus === "confirmed"
                                ? "status-approved border-0"
                                : user.paymentStatus === "rejected"
                                  ? "status-rejected border-0"
                                  : user.paymentStatus === "pending"
                                    ? "status-pending border-0"
                                    : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {user.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {user.utrNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(user.joinedAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="flex items-center gap-1.5"
                            data-ocid="admin_users.button"
                          >
                            {user.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                  onClick={() => handleApprove(user.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleReject(user.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  data-ocid="admin_users.delete_button"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="dark-card gold-border">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remove User
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove{" "}
                                    <strong>{user.name}</strong>? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel data-ocid="admin_users.cancel_button">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleRemove(user.id)}
                                    data-ocid="admin_users.confirm_button"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filtered.map((user, i) => (
                  <div
                    key={user.id}
                    className="dark-card rounded-xl p-4 space-y-3"
                    data-ocid={`admin_users.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {user.mobile}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          user.status === "approved"
                            ? "status-approved border-0"
                            : user.status === "rejected"
                              ? "status-rejected border-0"
                              : "status-pending border-0"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-secondary/50 rounded px-2 py-0.5">
                        Code:{" "}
                        <span className="font-mono font-bold text-primary">
                          {user.referralCode}
                        </span>
                      </span>
                      {user.referredBy && (
                        <span className="bg-secondary/50 rounded px-2 py-0.5">
                          Via: {user.referredBy}
                        </span>
                      )}
                      {user.utrNumber && (
                        <span className="bg-secondary/50 rounded px-2 py-0.5 font-mono">
                          {user.utrNumber}
                        </span>
                      )}
                    </div>
                    <div
                      className="flex gap-2 pt-1"
                      data-ocid="admin_users.button"
                    >
                      {user.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-green-500/30 text-green-400 h-8"
                            onClick={() => handleApprove(user.id)}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-destructive/30 text-destructive h-8"
                            onClick={() => handleReject(user.id)}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark-card gold-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove {user.name}? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleRemove(user.id)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
