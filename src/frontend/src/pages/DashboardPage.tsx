import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Copy,
  Crown,
  IndianRupee,
  Network,
  Share2,
  User as UserIcon,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { getUserCommissions } from "../store";
import type { User } from "../types";
import type { PageName } from "../types";

interface DashboardPageProps {
  user: User;
  onNavigate: (page: PageName) => void;
}

export function DashboardPage({ user, onNavigate }: DashboardPageProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const commissions = getUserCommissions(user.id);

  const level1Earnings = commissions
    .filter((c) => c.level === 1)
    .reduce((sum, c) => sum + c.amount, 0);
  const level2Earnings = commissions
    .filter((c) => c.level === 2)
    .reduce((sum, c) => sum + c.amount, 0);
  const _level3Earnings = commissions
    .filter((c) => c.level === 3)
    .reduce((sum, c) => sum + c.amount, 0);
  const totalEarnings = user.commissionBalance;

  const appUrl = window.location.origin;
  const whatsappMessage = encodeURIComponent(
    `🏆 Join TM11 PrimeTime! India's #1 premium network platform.\n\n✅ Watch exclusive videos\n💰 Earn commissions up to ₹10 per referral\n🔗 Use my referral code: *${user.referralCode}*\n\nRegister now: ${appUrl}`,
  );

  function copyCode() {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.success("Referral code copied!");
  }

  const isApproved = user.status === "approved";

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Welcome,{" "}
            <span className="gold-text">{user.name.split(" ")[0]}</span>!
          </h1>
          <p className="text-muted-foreground mt-1">
            Member since{" "}
            {new Date(user.joinedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              isApproved
                ? "status-approved border-0 text-sm px-3 py-1"
                : "status-pending border-0 text-sm px-3 py-1"
            }
          >
            {isApproved ? "✓ Active Member" : "⏳ Pending Approval"}
          </Badge>
          {isApproved && user.matrixLevel && (
            <Badge
              variant="outline"
              className="border-primary/30 text-primary text-sm px-3 py-1"
            >
              Level {user.matrixLevel}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Wallet Balance",
            value: `₹${user.walletBalance ?? 0}`,
            icon: <Wallet className="w-5 h-5" />,
            highlight: true,
          },
          {
            label: "Commission Earned",
            value: `₹${totalEarnings}`,
            icon: <IndianRupee className="w-5 h-5" />,
            highlight: false,
          },
          {
            label: "Level 1 (₹10)",
            value: `₹${level1Earnings}`,
            icon: <Users className="w-5 h-5" />,
            highlight: false,
          },
          {
            label: "Level 2 (₹5)",
            value: `₹${level2Earnings}`,
            icon: <Network className="w-5 h-5" />,
            highlight: false,
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`dark-card ${stat.highlight ? "gold-border" : ""}`}
          >
            <CardContent className="p-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.highlight ? "gold-gradient text-background" : "bg-secondary text-primary"}`}
              >
                {stat.icon}
              </div>
              <div
                className={`text-2xl font-display font-bold ${stat.highlight ? "gold-text" : ""}`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Referral section */}
        <Card className="dark-card gold-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <div className="text-4xl font-display font-extrabold tracking-widest gold-text mb-1">
                {user.referralCode}
              </div>
              <div className="text-xs text-muted-foreground">
                Share this code to earn commissions
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                onClick={copyCode}
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copiedCode ? "Copied!" : "Copy Code"}
              </Button>
              <Button
                className="flex-1"
                style={{ background: "#25D366", color: "white" }}
                asChild
                data-ocid="dashboard.primary_button"
              >
                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <SiWhatsapp className="w-4 h-4" />
                  Share on WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="dark-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigate("wallet")}
              className="w-full flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
              data-ocid="dashboard.tab"
            >
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                <Wallet className="w-5 h-5 text-background" />
              </div>
              <div>
                <div className="font-semibold text-sm">My Wallet</div>
                <div className="text-xs text-muted-foreground">
                  Check balance &amp; request withdrawal
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("matrix")}
              className="w-full flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
              data-ocid="dashboard.tab"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:gold-gradient transition-all">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">View Matrix Tree</div>
                <div className="text-xs text-muted-foreground">
                  See your 3×3 network structure
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                isApproved
                  ? onNavigate("videos")
                  : toast.error("Account approval required to access videos")
              }
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left group ${isApproved ? "bg-secondary/30 hover:bg-secondary/50" : "bg-secondary/10 opacity-60 cursor-not-allowed"}`}
              data-ocid="dashboard.tab"
              disabled={!isApproved}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  Premium Videos
                  {!isApproved && (
                    <Badge variant="outline" className="text-xs border-border">
                      Locked
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isApproved
                    ? "Access 6 categories of content"
                    : "Requires account approval"}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => toast.info("Profile settings coming soon")}
              className="w-full flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
              data-ocid="dashboard.tab"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">My Profile</div>
                <div className="text-xs text-muted-foreground">
                  Mobile: {user.mobile} · Email: {user.email}
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Commission history */}
      {commissions.length > 0 && (
        <Card className="dark-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              Commission History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commissions.slice(0, 10).map((commission) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      L{commission.level}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Level {commission.level} Commission
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(commission.date).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <div className="font-display font-bold text-green-400">
                    +₹{commission.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending notice */}
      {!isApproved && (
        <Card className="status-pending border-0 bg-primary/10">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-primary mb-1">
                Account Pending Approval
              </div>
              <div className="text-sm text-muted-foreground">
                Your registration is being reviewed. Admin will verify your UPI
                payment (UTR: {user.utrNumber ?? "Not submitted"}) and activate
                your account.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
