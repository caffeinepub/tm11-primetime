import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, IndianRupee, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { approveUser, getUsers, updateUser } from "../store";
import type { PaymentStatus, User } from "../types";

export function AdminPaymentsPage() {
  const [users, setUsers] = useState<User[]>(() =>
    getUsers().filter((u) => u.utrNumber),
  );
  const [activeTab, setActiveTab] = useState<"all" | PaymentStatus>("all");

  function refresh() {
    setUsers(getUsers().filter((u) => u.utrNumber));
  }

  function handleConfirm(user: User) {
    if (user.status === "pending") {
      approveUser(user.id);
    } else {
      updateUser({ ...user, paymentStatus: "confirmed" as PaymentStatus });
    }
    refresh();
    toast.success(`Payment confirmed for ${user.name}. Account activated!`);
  }

  function handleReject(user: User) {
    updateUser({ ...user, paymentStatus: "rejected" as PaymentStatus });
    refresh();
    toast.error(`Payment rejected for ${user.name}.`);
  }

  const filtered =
    activeTab === "all"
      ? users
      : users.filter((u) => u.paymentStatus === activeTab);

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.paymentStatus === "pending").length,
    confirmed: users.filter((u) => u.paymentStatus === "confirmed").length,
    rejected: users.filter((u) => u.paymentStatus === "rejected").length,
    none: users.filter((u) => u.paymentStatus === "none").length,
  };

  const totalConfirmed =
    users.filter((u) => u.paymentStatus === "confirmed").length * 118;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Payment Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Verify and confirm UPI payment proofs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs text-muted-foreground">Total Revenue</div>
            <div className="font-display font-bold text-xl gold-text">
              ₹{totalConfirmed}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={refresh} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* UPI info banner */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center shrink-0">
          <IndianRupee className="w-5 h-5 text-background" />
        </div>
        <div>
          <div className="font-semibold text-primary text-sm">
            UPI Payment Account
          </div>
          <div className="text-xs text-muted-foreground">
            UPI ID:{" "}
            <span className="font-mono font-bold text-foreground">
              tm11primetime@upi
            </span>{" "}
            · Amount: <span className="font-bold">₹118</span> per member
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as typeof activeTab)}
      >
        <TabsList className="bg-secondary/50">
          {(["all", "pending", "confirmed", "rejected"] as const).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="capitalize data-[state=active]:gold-gradient data-[state=active]:text-background data-[state=active]:font-bold text-xs md:text-sm"
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
              className="text-center py-12 dark-card rounded-xl"
              data-ocid="admin_payments.empty_state"
            >
              <IndianRupee className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No payments in this category.
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
                        User
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        UTR Reference
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
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
                        data-ocid={`admin_payments.item.${i + 1}`}
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
                        <td className="px-4 py-3 font-mono text-sm text-primary">
                          {user.utrNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-bold text-primary">
                          ₹118
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(user.joinedAt).toLocaleDateString("en-IN")}
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
                        <td className="px-4 py-3">
                          {user.paymentStatus === "pending" && (
                            <div
                              className="flex items-center gap-1.5"
                              data-ocid="admin_payments.button"
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                onClick={() => handleConfirm(user)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-destructive hover:bg-destructive/10"
                                onClick={() => handleReject(user)}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                          {user.paymentStatus !== "pending" && (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
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
                    data-ocid={`admin_payments.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {user.mobile}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          user.paymentStatus === "confirmed"
                            ? "status-approved border-0"
                            : user.paymentStatus === "rejected"
                              ? "status-rejected border-0"
                              : "status-pending border-0"
                        }`}
                      >
                        {user.paymentStatus}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      UTR:{" "}
                      <span className="font-mono text-foreground font-medium">
                        {user.utrNumber}
                      </span>
                    </div>
                    <div className="font-bold text-primary">₹118</div>
                    {user.paymentStatus === "pending" && (
                      <div
                        className="flex gap-2"
                        data-ocid="admin_payments.button"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-green-500/30 text-green-400 h-8"
                          onClick={() => handleConfirm(user)}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-destructive/30 text-destructive h-8"
                          onClick={() => handleReject(user)}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
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
