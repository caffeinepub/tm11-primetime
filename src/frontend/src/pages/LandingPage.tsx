import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ChevronRight,
  Crown,
  IndianRupee,
  Network,
  Play,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import type { PageName } from "../types";

interface LandingPageProps {
  onNavigate: (page: PageName) => void;
}

const VIDEO_CATEGORIES = [
  {
    name: "Tutorial",
    icon: "📖",
    desc: "Step-by-step guides to master the platform",
  },
  {
    name: "Tourism",
    icon: "✈️",
    desc: "Explore India's most beautiful destinations",
  },
  {
    name: "Devotional",
    icon: "🙏",
    desc: "Spiritual content for daily inspiration",
  },
  {
    name: "Entertainment",
    icon: "🎭",
    desc: "Comedy, dance & performance showcases",
  },
  {
    name: "Education",
    icon: "🎓",
    desc: "Financial literacy & personal development",
  },
  { name: "Wellness", icon: "🧘", desc: "Yoga, meditation & health guidance" },
];

const COMMISSION_LEVELS = [
  { level: "Level 1", amount: "₹10", desc: "Direct referral commission" },
  { level: "Level 2", amount: "₹5", desc: "Second-tier referral commission" },
  { level: "Level 3", amount: "₹3", desc: "Third-tier referral commission" },
];

const BENEFITS = [
  "Full access to premium video library",
  "Unique referral code for your network",
  "Earn commissions on 3 matrix levels",
  "WhatsApp sharing integration",
  "Real-time matrix tree visualization",
  "Personal dashboard & commission tracking",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register",
    desc: "Fill in your details and submit your UPI payment of ₹118.",
  },
  {
    step: "02",
    title: "Admin Approves",
    desc: "Admin verifies your UTR and activates your account.",
  },
  {
    step: "03",
    title: "Share Referral",
    desc: "Share your unique code via WhatsApp to grow your matrix.",
  },
  {
    step: "04",
    title: "Earn Commissions",
    desc: "Earn ₹10, ₹5, and ₹3 commissions from your 3-level matrix.",
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.01 260) 0%, oklch(0.14 0.015 280) 50%, oklch(0.12 0.008 260) 100%)",
        }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/assets/generated/hero-bg.dim_1200x600.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.14 75) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.14 75) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative">
          <div className="max-w-3xl">
            <Badge className="gold-gradient text-background border-0 mb-6 font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium MLM Platform
            </Badge>

            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="gold-text">TM11</span>
              <br />
              <span className="text-foreground">PrimeTime</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Join India's fastest-growing network platform. Watch premium
              content, earn referral commissions up to{" "}
              <span className="text-primary font-semibold">
                ₹10 per referral
              </span>
              , and build your 3×3 matrix network.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                size="lg"
                className="gold-gradient text-background font-bold text-lg h-12 px-8 hover:opacity-90"
                onClick={() => onNavigate("register")}
                data-ocid="landing.primary_button"
              >
                <Crown className="w-5 h-5 mr-2" />
                Join Now — ₹118
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 h-12 px-8"
                onClick={() => onNavigate("login")}
                data-ocid="landing.secondary_button"
              >
                Login to Dashboard
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">
                  <Users className="w-4 h-4" />
                </span>
                3×3 Matrix Network
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">
                  <IndianRupee className="w-4 h-4" />
                </span>
                ₹118 One-Time Fee
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">
                  <Video className="w-4 h-4" />
                </span>
                6 Video Categories
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">
                  <Network className="w-4 h-4" />
                </span>
                3-Level Commissions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">
                One-Time Membership
              </h2>
              <p className="text-muted-foreground mb-6">
                Pay once, access everything forever. No recurring fees, no
                hidden charges.
              </p>
              <ul className="space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-background" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Card className="dark-card gold-border w-72">
                <CardContent className="p-8 text-center">
                  <div className="mb-2">
                    <div className="text-5xl font-display font-extrabold gold-text mb-1">
                      ₹118
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹100 + 18% GST
                    </div>
                  </div>
                  <div className="border-t border-border my-6" />
                  <div className="space-y-2 text-sm text-left mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price</span>
                      <span className="font-medium">₹100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="font-medium">₹18</span>
                    </div>
                    <div className="flex justify-between font-bold text-primary">
                      <span>Total</span>
                      <span>₹118</span>
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 text-xs text-muted-foreground mb-6">
                    Pay via UPI:{" "}
                    <span className="font-mono text-primary font-semibold">
                      tm11primetime@upi
                    </span>
                  </div>
                  <Button
                    className="w-full gold-gradient text-background font-bold"
                    onClick={() => onNavigate("register")}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">
              3×3 Matrix Commission
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Earn commissions from 3 levels in your network. Every approved
              member you refer earns you ₹10 directly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {COMMISSION_LEVELS.map((item, levelIdx) => (
              <Card
                key={item.level}
                className="dark-card gold-border text-center"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold ${levelIdx === 0 ? "gold-gradient text-background" : "bg-secondary"}`}
                  >
                    {levelIdx + 1}
                  </div>
                  <div className="font-display text-2xl font-bold gold-text mb-1">
                    {item.amount}
                  </div>
                  <div className="text-sm font-semibold mb-1">{item.level}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.desc}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Library */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">
              Premium Video Library
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Access 6 categories of exclusive content — available to all active
              members.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {VIDEO_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="dark-card rounded-xl p-5 flex items-start gap-4 hover:gold-border transition-colors cursor-default"
              >
                <div className="text-3xl">{cat.icon}</div>
                <div>
                  <div className="font-semibold mb-1">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {cat.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              className="gold-gradient text-background font-bold"
              onClick={() => onNavigate("register")}
            >
              <Play className="w-4 h-4 mr-2" />
              Join to Watch Premium Content
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-border bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-display text-5xl font-extrabold gold-text opacity-30 mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 border-t border-border text-center">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Build Your Network?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of members earning passive income through TM11
              PrimeTime's 3×3 matrix system.
            </p>
            <Button
              size="lg"
              className="gold-gradient text-background font-bold text-lg h-12 px-10"
              onClick={() => onNavigate("register")}
            >
              <Crown className="w-5 h-5 mr-2" />
              Join TM11 PrimeTime — ₹118
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
