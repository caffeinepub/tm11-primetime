import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Copy, Crown, ExternalLink, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../types";

interface PendingPageProps {
  user: User;
}

const UPI_ID = "yespay.bizsbiz12758@yesbankltd";
function buildUpiUrl(app: "phonepe" | "gpay" | "bhim") {
  const pa = encodeURIComponent(UPI_ID);
  const pn = encodeURIComponent("MDBN Trade Master Gaming");
  const upiParams = `pa=${pa}&pn=${pn}&cu=INR`;
  if (app === "phonepe")
    return `intent://pay?${upiParams}#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=https%3A%2F%2Fphonepe.com;end`;
  if (app === "gpay")
    return `intent://upi/pay?${upiParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;S.browser_fallback_url=https%3A%2F%2Fpay.google.com;end`;
  return `intent://pay?${upiParams}#Intent;scheme=upi;package=in.org.npci.upiapp;S.browser_fallback_url=https%3A%2F%2Fbhimupi.org.in;end`;
}

export function PendingPage({ user }: PendingPageProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);

  function copyUpi() {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopiedUpi(false), 2000);
  }

  function openUpiApp(app: "phonepe" | "gpay" | "bhim") {
    const url = buildUpiUrl(app);
    window.location.href = url;
  }

  return (
    <div className="container py-12 max-w-lg">
      <Card className="dark-card gold-border" data-ocid="pending.card">
        <CardContent className="p-8 text-center">
          {/* Animated waiting indicator */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold mb-3">
            Registration Under Review
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your registration is being reviewed by our admin team. Once your UPI
            payment is verified, your account will be activated and you'll get
            full access.
          </p>

          {/* Status cards */}
          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs font-bold">✓</span>
              </div>
              <div>
                <div className="text-sm font-medium">
                  Registration Submitted
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(user.joinedAt).toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${user.utrNumber ? "bg-green-500/20" : "bg-yellow-500/20"}`}
              >
                <span
                  className={`text-xs font-bold ${user.utrNumber ? "text-green-400" : "text-yellow-400"}`}
                >
                  {user.utrNumber ? "✓" : "?"}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">Payment Proof</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {user.utrNumber ? `UTR: ${user.utrNumber}` : "Not submitted"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm font-medium">Admin Verification</div>
                <div className="text-xs text-muted-foreground">
                  Pending — Usually within 24 hours
                </div>
              </div>
            </div>
          </div>

          {/* Referral code preview */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
            <div className="text-xs text-muted-foreground mb-1">
              Your referral code (save this)
            </div>
            <div className="font-display text-3xl font-extrabold tracking-widest gold-text">
              {user.referralCode}
            </div>
          </div>

          {/* Pay Now section — for users who haven't paid yet */}
          {!user.utrNumber && (
            <div className="border border-primary/30 rounded-xl overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => setShowQr((v) => !v)}
                className="w-full flex items-center justify-between p-3 bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-semibold text-primary"
                data-ocid="pending.toggle"
              >
                <span>💳 Pay Now — ₹118</span>
                <span className="text-xs text-muted-foreground">
                  {showQr ? "Hide ▲" : "Show QR ▼"}
                </span>
              </button>
              {showQr && (
                <div
                  className="p-4 space-y-3 bg-background/20"
                  data-ocid="pending.panel"
                >
                  {/* QR code */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white rounded-xl p-2 shadow-md inline-block">
                      <img
                        src="/assets/uploads/Screenshot_2026-03-04-23-55-20-20_46ab9a055136d85c9320cca100dcfb31-1.jpg"
                        alt="UPI QR Code"
                        width={160}
                        height={160}
                        className="block rounded-lg"
                        style={{
                          width: 160,
                          height: 160,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Scan with any UPI app to pay
                    </p>
                  </div>

                  {/* UPI ID copy row */}
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      UPI ID
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-mono text-xs font-bold text-foreground break-all">
                        {UPI_ID}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10 shrink-0 gap-1 text-xs px-2"
                        onClick={copyUpi}
                        data-ocid="pending.secondary_button"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Direct UPI App Buttons */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground text-center font-medium">
                      Or pay directly with your app
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => openUpiApp("phonepe")}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 active:scale-95 transition-all"
                        data-ocid="pending.phonepe_button"
                      >
                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          P
                        </div>
                        <span className="text-xs font-semibold text-purple-300">
                          PhonePe
                        </span>
                        <ExternalLink className="w-3 h-3 text-purple-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openUpiApp("gpay")}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 active:scale-95 transition-all"
                        data-ocid="pending.gpay_button"
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          G
                        </div>
                        <span className="text-xs font-semibold text-blue-300">
                          Google Pay
                        </span>
                        <ExternalLink className="w-3 h-3 text-blue-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openUpiApp("bhim")}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 transition-all"
                        data-ocid="pending.bhim_button"
                      >
                        <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                          B
                        </div>
                        <span className="text-xs font-semibold text-orange-300">
                          BHIM UPI
                        </span>
                        <ExternalLink className="w-3 h-3 text-orange-400" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Tap to open — UPI ID auto-filled, just enter ₹118 &amp;
                      pay
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            For support, contact admin with your mobile number and UTR
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
          <Crown className="w-3 h-3 text-primary" />
          UPI: <span className="font-mono text-primary">{UPI_ID}</span>
        </div>
      </div>
    </div>
  );
}
