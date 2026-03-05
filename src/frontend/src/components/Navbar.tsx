import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, LogOut, Menu, Wallet, X } from "lucide-react";
import { useState } from "react";
import type { User } from "../types";
import type { PageName } from "../types";

interface NavbarProps {
  currentUser: User | null;
  isAdmin: boolean;
  onNavigate: (page: PageName) => void;
  onLogout: () => void;
}

export function Navbar({
  currentUser,
  isAdmin,
  onNavigate,
  onLogout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 group"
          onClick={() =>
            onNavigate(
              currentUser
                ? "dashboard"
                : isAdmin
                  ? "admin-dashboard"
                  : "landing",
            )
          }
        >
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
            <Crown className="w-4 h-4 text-background" />
          </div>
          <span className="font-display font-bold text-lg gold-text">
            TM11 PrimeTime
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {currentUser && (
            <>
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate("matrix")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Matrix Tree
              </button>
              <button
                type="button"
                onClick={() => onNavigate("videos")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Video Library
              </button>
              <button
                type="button"
                onClick={() => onNavigate("wallet")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Wallet className="w-3.5 h-3.5" />
                Wallet
              </button>
            </>
          )}
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => onNavigate("admin-dashboard")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => onNavigate("admin-users")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Users
              </button>
              <button
                type="button"
                onClick={() => onNavigate("admin-payments")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Payments
              </button>
              <button
                type="button"
                onClick={() => onNavigate("admin-videos")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Videos
              </button>
              <button
                type="button"
                onClick={() => onNavigate("admin-withdrawals")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Withdrawals
              </button>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentUser.name.split(" ")[0]}
              </span>
              <Badge
                variant="outline"
                className={
                  currentUser.status === "approved"
                    ? "status-approved text-xs border-0"
                    : "status-pending text-xs border-0"
                }
              >
                {currentUser.status === "approved" ? "Active" : "Pending"}
              </Badge>
            </div>
          )}
          {isAdmin && (
            <Badge
              variant="outline"
              className="hidden md:flex status-approved text-xs border-0"
            >
              Admin
            </Badge>
          )}
          {(currentUser || isAdmin) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive hidden md:flex gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
          {!currentUser && !isAdmin && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("login")}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="gold-gradient text-background font-semibold"
                onClick={() => onNavigate("register")}
              >
                Join Now
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 flex flex-col gap-2">
          {currentUser && (
            <>
              <div className="flex items-center gap-2 py-2 border-b border-border mb-1">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <Badge
                  variant="outline"
                  className={
                    currentUser.status === "approved"
                      ? "status-approved text-xs border-0"
                      : "status-pending text-xs border-0"
                  }
                >
                  {currentUser.status === "approved" ? "Active" : "Pending"}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate("dashboard");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("matrix");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Matrix Tree
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("videos");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Video Library
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("wallet");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground flex items-center gap-1.5"
              >
                <Wallet className="w-4 h-4" />
                Wallet
              </button>
            </>
          )}
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => {
                  onNavigate("admin-dashboard");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Admin Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("admin-users");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Users
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("admin-payments");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Payments
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("admin-videos");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Videos
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate("admin-withdrawals");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Withdrawals
              </button>
            </>
          )}
          {!currentUser && !isAdmin && (
            <>
              <button
                type="button"
                onClick={() => {
                  onNavigate("login");
                  setMobileOpen(false);
                }}
                className="text-sm py-2 text-left text-foreground"
              >
                Login
              </button>
              <Button
                size="sm"
                className="gold-gradient text-background font-semibold w-full mt-1"
                onClick={() => {
                  onNavigate("register");
                  setMobileOpen(false);
                }}
              >
                Join Now
              </Button>
            </>
          )}
          {(currentUser || isAdmin) && (
            <button
              type="button"
              onClick={() => {
                onLogout();
                setMobileOpen(false);
              }}
              className="text-sm py-2 text-left text-destructive flex items-center gap-1 mt-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
