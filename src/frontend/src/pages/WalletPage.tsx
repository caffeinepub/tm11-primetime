import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowDownCircle,
  CheckCircle2,
  Clock,
  Gift,
  IndianRupee,
  Loader2,
  Lock,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addWithdrawalRequest, getUserWithdrawals } from "../store";
import type { PageName, User, WithdrawalRequest } from "../types";

interface WalletPageProps {
  user: User;
  onNavigate: (page: PageName) => void;
}

export function WalletPage({ user }: WalletPageProps) {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    getUserWithdrawals(user.id),
  );

  const totalBalance =
    (user.walletBalance ?? 0) + (user.commissionBalance ?? 0);
  const isApproved = user.status === "approved";

  function refreshWithdrawals() {
    setWithdrawals(getUserWithdrawals(user.id));
  }

  async function handleWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = Number(amount);

    if (!amountNum || amountNum < 500) {
      toast.error("Minimum withdrawal amount is Rs.500");
      return;
    }
    if (!upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = addWithdrawalRequest(user.id, amountNum, upiId.trim());
      if (result.success) {
        toast.success(
          "Withdrawal request submitted! Admin will process it shortly.",
        );
        setAmount("");
        setUpiId("");
        refreshWithdrawals();
      } else {
        toast.error(result.error ?? "Failed to submit withdrawal request");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function getStatusBadge(status: WithdrawalRequest["status"]) {
    switch (status) {
      case "approved":
        return (
          <Badge className="status-approved border-0 gap-1 text-xs">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="status-rejected border-0 gap-1 text-xs">
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="status-pending border-0 gap-1 text-xs">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
    }
  }

  return (
    <div className="container py-8 space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Wallet className="w-5 h-5 text-background" />
          </div>
          My Wallet
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Manage your wallet balance and request withdrawals
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Wallet Balance Card */}
        <Card
          className="dark-card gold-border relative overflow-hidden"
          data-ocid="wallet.card"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                <Wallet className="w-5 h-5 text-background" />
              </div>
              {isApproved && (
                <Badge className="bg-green-500/20 text-green-400 border-0 text-xs gap-1">
                  <Gift className="w-3 h-3" /> Bonus Credited
                </Badge>
              )}
            </div>
            <div className="text-3xl font-display font-extrabold gold-text">
              ₹{user.walletBalance ?? 0}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              Wallet Balance
            </div>
            {isApproved && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Rs.150 Joining Bonus Credited
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission Balance Card */}
        <Card className="dark-card" data-ocid="wallet.card">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <IndianRupee className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-display font-extrabold">
              ₹{user.commissionBalance ?? 0}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              Commission Balance
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Total Available:{" "}
              <span className="text-foreground font-semibold">
                ₹{totalBalance}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Request Section */}
      <Card className="dark-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-primary" />
            Request Withdrawal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isApproved ? (
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">Withdrawal Locked</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Withdrawal is available after your account is approved by
                  admin.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWithdrawal} className="space-y-5">
              {/* Info notice */}
              <div className="flex items-start gap-2.5 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Minimum withdrawal amount is{" "}
                  <span className="text-foreground font-semibold">Rs.500</span>.
                  Funds are deducted from wallet balance first, then commission
                  balance. Only one pending request is allowed at a time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="withdraw-amount"
                    className="text-sm font-medium"
                  >
                    Amount (Rs.)
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="withdraw-amount"
                      type="number"
                      min={500}
                      max={totalBalance}
                      placeholder="Minimum Rs.500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-9 bg-secondary/30 border-border focus:border-primary"
                      data-ocid="wallet.amount_input"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available: ₹{totalBalance}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="withdraw-upi" className="text-sm font-medium">
                    UPI ID
                  </Label>
                  <Input
                    id="withdraw-upi"
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="bg-secondary/30 border-border focus:border-primary font-mono"
                    data-ocid="wallet.upi_input"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g. name@okaxis, mobile@paytm
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="gold-gradient text-background font-semibold w-full sm:w-auto"
                data-ocid="wallet.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ArrowDownCircle className="w-4 h-4 mr-2" />
                    Request Withdrawal
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal History Section */}
      <Card className="dark-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Withdrawal History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="text-center py-10" data-ocid="wallet.empty_state">
              <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                <ArrowDownCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No withdrawal requests yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Your withdrawal history will appear here
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-auto rounded-xl border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        UPI ID
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Requested
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Processed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w, i) => (
                      <tr
                        key={w.id}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                        data-ocid={`wallet.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-display font-bold text-primary">
                          ₹{w.amount}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {w.upiId}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(w.status)}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(w.requestedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {w.processedAt
                            ? new Date(w.processedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {withdrawals.map((w, i) => (
                  <div
                    key={w.id}
                    className="bg-secondary/20 rounded-xl p-4 space-y-2.5"
                    data-ocid={`wallet.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-primary text-lg">
                        ₹{w.amount}
                      </span>
                      {getStatusBadge(w.status)}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {w.upiId}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Requested:{" "}
                        {new Date(w.requestedAt).toLocaleDateString("en-IN")}
                      </span>
                      {w.processedAt && (
                        <span>
                          Processed:{" "}
                          {new Date(w.processedAt).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
