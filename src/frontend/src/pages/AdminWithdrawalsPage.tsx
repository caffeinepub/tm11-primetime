import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  approveWithdrawal,
  getUsers,
  getWithdrawals,
  rejectWithdrawal,
} from "../store";
import type { WithdrawalRequest, WithdrawalStatus } from "../types";

type TabValue = "all" | WithdrawalStatus;

export function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    getWithdrawals().sort(
      (a, b) =>
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    ),
  );
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const allUsers = getUsers();

  function getUserInfo(userId: string) {
    return allUsers.find((u) => u.id === userId);
  }

  function refresh() {
    setWithdrawals(
      getWithdrawals().sort(
        (a, b) =>
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
      ),
    );
  }

  function handleApprove(w: WithdrawalRequest) {
    const userInfo = getUserInfo(w.userId);
    approveWithdrawal(w.id);
    refresh();
    toast.success(
      `Withdrawal of ₹${w.amount} approved for ${userInfo?.name ?? "user"}.`,
    );
  }

  function handleReject(w: WithdrawalRequest) {
    const userInfo = getUserInfo(w.userId);
    rejectWithdrawal(w.id);
    refresh();
    toast.error(
      `Withdrawal of ₹${w.amount} rejected for ${userInfo?.name ?? "user"}.`,
    );
  }

  const filtered =
    activeTab === "all"
      ? withdrawals
      : withdrawals.filter((w) => w.status === activeTab);

  const counts = {
    all: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === "pending").length,
    approved: withdrawals.filter((w) => w.status === "approved").length,
    rejected: withdrawals.filter((w) => w.status === "rejected").length,
  };

  const totalPending = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);

  function getStatusBadge(status: WithdrawalRequest["status"]) {
    switch (status) {
      case "approved":
        return (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium status-approved border-0">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium status-rejected border-0">
            Rejected
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium status-pending border-0">
            Pending
          </span>
        );
    }
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5 text-background" />
            </div>
            Withdrawal Requests
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and process user withdrawal requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          {counts.pending > 0 && (
            <div className="text-right hidden md:block">
              <div className="text-xs text-muted-foreground">
                Pending Amount
              </div>
              <div className="font-display font-bold text-xl gold-text">
                ₹{totalPending}
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={refresh} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary banner */}
      {counts.pending > 0 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center shrink-0">
            <ArrowDownCircle className="w-5 h-5 text-background" />
          </div>
          <div>
            <div className="font-semibold text-primary text-sm">
              {counts.pending} Pending Request{counts.pending !== 1 ? "s" : ""}
            </div>
            <div className="text-xs text-muted-foreground">
              Total pending payout:{" "}
              <span className="font-bold text-foreground">₹{totalPending}</span>
            </div>
          </div>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabValue)}
      >
        <TabsList className="bg-secondary/50">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="capitalize data-[state=active]:gold-gradient data-[state=active]:text-background data-[state=active]:font-bold text-xs md:text-sm"
              data-ocid="admin_withdrawals.tab"
            >
              {tab}
              <span className="ml-1.5 text-xs bg-secondary/60 rounded px-1 py-0.5">
                {counts[tab]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <div
              className="text-center py-14 dark-card rounded-xl"
              data-ocid="admin_withdrawals.empty_state"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                <ArrowDownCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No withdrawal requests in this category.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-auto rounded-xl dark-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "#",
                        "User",
                        "Mobile",
                        "Amount",
                        "UPI ID",
                        "Status",
                        "Requested",
                        "Actions",
                      ].map((col) => (
                        <th
                          key={col}
                          className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((w, i) => {
                      const userInfo = getUserInfo(w.userId);
                      return (
                        <tr
                          key={w.id}
                          className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                          data-ocid={`admin_withdrawals.item.${i + 1}`}
                        >
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {userInfo?.name ?? "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {userInfo?.email ?? "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm">
                            {userInfo?.mobile ?? "—"}
                          </td>
                          <td className="px-4 py-3 font-display font-bold text-primary text-base">
                            ₹{w.amount}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {w.upiId}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(w.status)}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(w.requestedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {w.status === "pending" ? (
                              <div
                                className="flex items-center gap-1.5"
                                data-ocid="admin_withdrawals.button"
                              >
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                  onClick={() => handleApprove(w)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleReject(w)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {w.processedAt
                                  ? new Date(w.processedAt).toLocaleDateString(
                                      "en-IN",
                                    )
                                  : "—"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filtered.map((w, i) => {
                  const userInfo = getUserInfo(w.userId);
                  return (
                    <div
                      key={w.id}
                      className="dark-card rounded-xl p-4 space-y-3"
                      data-ocid={`admin_withdrawals.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">
                            {userInfo?.name ?? "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {userInfo?.mobile ?? "—"}
                          </div>
                        </div>
                        {getStatusBadge(w.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-primary text-lg">
                          ₹{w.amount}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {w.upiId}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Requested:{" "}
                        {new Date(w.requestedAt).toLocaleDateString("en-IN")}
                      </div>
                      {w.status === "pending" && (
                        <div
                          className="flex gap-2"
                          data-ocid="admin_withdrawals.button"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-green-500/30 text-green-400 h-8"
                            onClick={() => handleApprove(w)}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-destructive/30 text-destructive h-8"
                            onClick={() => handleReject(w)}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
