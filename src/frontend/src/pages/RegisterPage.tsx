import { Badge } from "@/components/ui/badge";
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
import { AlertCircle, Check, Copy, Crown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addUser, generateId, generateReferralCode, getUsers } from "../store";
import type { PageName } from "../types";

interface RegisterPageProps {
  onNavigate: (page: PageName) => void;
}

type Step = "details" | "payment";

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [step, setStep] = useState<Step>("details");
  const [userId, setUserId] = useState<string>("");
  const [referralCode, setReferralCode] = useState("");

  // Step 1 fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Step 2 fields
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validateDetails(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!mobile.trim() || !/^\d{10}$/.test(mobile))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email address";

    const users = getUsers();
    if (users.find((u) => u.mobile === mobile))
      newErrors.mobile = "Mobile number already registered";

    if (referredBy.trim()) {
      const refUser = users.find(
        (u) => u.referralCode === referredBy.toUpperCase(),
      );
      if (!refUser) newErrors.referredBy = "Invalid referral code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleDetailsSubmit() {
    if (!validateDetails()) return;

    const code = generateReferralCode();
    const id = generateId();

    addUser({
      id,
      name: name.trim(),
      mobile,
      email: email.trim(),
      referralCode: code,
      referredBy: referredBy ? referredBy.toUpperCase() : null,
      status: "pending",
      paymentStatus: "none",
      utrNumber: null,
      joinedAt: new Date().toISOString(),
      commissionBalance: 0,
      matrixLevel: null,
    });

    setUserId(id);
    setReferralCode(code);
    setStep("payment");
  }

  function handlePaymentSubmit() {
    if (!utr.trim()) {
      toast.error("Please enter your UTR/Transaction reference number");
      return;
    }
    if (utr.trim().length < 6) {
      toast.error("UTR number must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        paymentStatus: "pending",
        utrNumber: utr.trim(),
      };
      localStorage.setItem("tm11_users", JSON.stringify(users));
    }
    setSubmitting(false);
    toast.success(
      "Payment proof submitted! Admin will verify and approve your account.",
    );
    onNavigate("login");
  }

  function copyUpi() {
    navigator.clipboard.writeText("yespay.bizsbiz12758@yesbankltd");
    setCopiedUpi(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopiedUpi(false), 2000);
  }

  const UPI_ID = "yespay.bizsbiz12758@yesbankltd";

  function buildUpiUrl(app: "phonepe" | "gpay" | "bhim" | "generic") {
    const pa = encodeURIComponent(UPI_ID);
    const pn = encodeURIComponent("MDBN Trade Master Gaming");
    const upiParams = `pa=${pa}&pn=${pn}&cu=INR`;
    if (app === "phonepe")
      return `intent://pay?${upiParams}#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=https%3A%2F%2Fphonepe.com;end`;
    if (app === "gpay")
      return `intent://upi/pay?${upiParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;S.browser_fallback_url=https%3A%2F%2Fpay.google.com;end`;
    if (app === "bhim")
      return `intent://pay?${upiParams}#Intent;scheme=upi;package=in.org.npci.upiapp;S.browser_fallback_url=https%3A%2F%2Fbhimupi.org.in;end`;
    return `upi://pay?${upiParams}`;
  }

  function openUpiApp(app: "phonepe" | "gpay" | "bhim") {
    const url = buildUpiUrl(app);
    window.location.href = url;
  }

  return (
    <div className="container py-12 max-w-lg">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "details" ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "details" ? "gold-gradient text-background" : "bg-secondary text-foreground"}`}
          >
            1
          </div>
          Your Details
        </div>
        <div className="flex-1 h-px bg-border" />
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "payment" ? "gold-gradient text-background" : "bg-secondary text-foreground"}`}
          >
            2
          </div>
          Payment
        </div>
      </div>

      {step === "details" && (
        <Card className="dark-card gold-border">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <Badge className="gold-gradient text-background border-0 text-xs">
                One-Time Registration
              </Badge>
            </div>
            <CardTitle className="font-display text-2xl">
              Create Your Account
            </CardTitle>
            <CardDescription>
              Join TM11 PrimeTime and start building your network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input"
                data-ocid="register.input"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="bg-input"
                data-ocid="register.input"
                type="tel"
                inputMode="numeric"
                aria-describedby={errors.mobile ? "mobile-error" : undefined}
              />
              {errors.mobile && (
                <p
                  id="mobile-error"
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input"
                data-ocid="register.input"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="referredBy">Referral Code (Optional)</Label>
              <Input
                id="referredBy"
                placeholder="Enter referral code if you have one"
                value={referredBy}
                onChange={(e) =>
                  setReferredBy(e.target.value.toUpperCase().slice(0, 6))
                }
                className="bg-input font-mono uppercase"
                data-ocid="register.input"
                aria-describedby={errors.referredBy ? "ref-error" : undefined}
              />
              {errors.referredBy && (
                <p
                  id="ref-error"
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.referredBy}
                </p>
              )}
            </div>

            <Button
              className="w-full gold-gradient text-background font-bold h-11"
              onClick={handleDetailsSubmit}
              data-ocid="register.submit_button"
            >
              Continue to Payment
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-primary hover:underline"
              >
                Login here
              </button>
            </p>
          </CardContent>
        </Card>
      )}

      {step === "payment" && (
        <Card className="dark-card gold-border">
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Complete Payment
            </CardTitle>
            <CardDescription>
              Send ₹118 via UPI and enter your transaction reference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment instructions */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-primary text-center">
                UPI Payment
              </h3>

              {/* Amount */}
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-primary leading-none">
                  ₹118
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  (₹100 + 18% GST)
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="bg-white rounded-xl p-3 shadow-md inline-block"
                  data-ocid="payment.card"
                >
                  <img
                    src="/assets/uploads/Screenshot_2026-03-04-23-55-20-20_46ab9a055136d85c9320cca100dcfb31-1.jpg"
                    alt="UPI QR Code"
                    width={220}
                    height={220}
                    className="block rounded-lg"
                    style={{ width: 220, height: 220, objectFit: "contain" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan with any UPI app to pay
                </p>
              </div>

              {/* UPI ID copy row */}
              <div className="bg-background/40 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">UPI ID</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-xs font-bold text-foreground break-all">
                    {UPI_ID}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10 shrink-0 gap-1 text-xs px-2"
                    onClick={copyUpi}
                    data-ocid="payment.secondary_button"
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
                  Pay directly with your UPI app
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => openUpiApp("phonepe")}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 active:scale-95 transition-all"
                    data-ocid="payment.phonepe_button"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
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
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 active:scale-95 transition-all"
                    data-ocid="payment.gpay_button"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
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
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 transition-all"
                    data-ocid="payment.bhim_button"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      B
                    </div>
                    <span className="text-xs font-semibold text-orange-300">
                      BHIM UPI
                    </span>
                    <ExternalLink className="w-3 h-3 text-orange-400" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Tap to open — UPI ID auto-filled, just enter ₹118 &amp; pay
                </p>
              </div>

              {/* Remarks instruction */}
              <div className="bg-background/30 rounded-lg p-3 space-y-1">
                <div className="text-xs text-muted-foreground font-medium">
                  Payment Note / Remarks
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {name} - {mobile}
                </div>
                <div className="text-xs text-muted-foreground">
                  Enter your name and mobile as remarks while paying
                </div>
              </div>

              <div className="bg-background/30 rounded-lg p-3 text-xs text-muted-foreground">
                <strong>Tip:</strong> Tap a UPI button to open the app — the
                recipient UPI ID is already filled in. Enter ₹118 as the amount,
                complete the payment, then come back and paste your UTR number
                below.
              </div>
            </div>

            {/* UTR input */}
            <div className="space-y-1.5">
              <Label htmlFor="utr">UTR / Transaction Reference Number *</Label>
              <Input
                id="utr"
                placeholder="Paste UTR number here after payment"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="bg-input font-mono"
                data-ocid="register.payment_input"
              />
              <p className="text-xs text-muted-foreground">
                After paying, find the UTR number in your UPI app's transaction
                history and paste it here
              </p>
            </div>

            <div className="flex items-start gap-3 bg-muted/20 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground text-xs">
                After submitting, our admin will verify your payment and
                activate your account within 24 hours. You'll be able to access
                all features once approved.
              </p>
            </div>

            <Button
              className="w-full gold-gradient text-background font-bold h-11"
              onClick={handlePaymentSubmit}
              disabled={submitting}
              data-ocid="register.payment_submit_button"
            >
              Submit Payment Proof
            </Button>

            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                Your referral code:
              </div>
              <div className="font-mono text-lg font-bold text-primary mt-1">
                {referralCode}
              </div>
              <div className="text-xs text-muted-foreground">
                Save this — you'll need it to login
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
