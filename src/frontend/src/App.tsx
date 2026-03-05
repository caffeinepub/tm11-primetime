import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPaymentsPage } from "./pages/AdminPaymentsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminVideosPage } from "./pages/AdminVideosPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MatrixTreePage } from "./pages/MatrixTreePage";
import { PendingPage } from "./pages/PendingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VideoLibraryPage } from "./pages/VideoLibraryPage";
import {
  getCurrentUserId,
  getUsers,
  initializeStore,
  setCurrentUserId,
} from "./store";
import type { PageName, User } from "./types";

// Initialize sample data on first load
initializeStore();

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const id = getCurrentUserId();
    if (!id) return null;
    return getUsers().find((u) => u.id === id) ?? null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("tm11_admin") === "true";
  });

  // Sync user from localStorage on page changes (so status updates reflect)
  const currentUserId = currentUser?.id;
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-sync on page navigation
  useEffect(() => {
    if (currentUserId) {
      const fresh = getUsers().find((u) => u.id === currentUserId);
      if (fresh) setCurrentUser(fresh);
    }
  }, [currentPage, currentUserId]);

  function handleNavigate(page: PageName) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogin(userId: string) {
    const user = getUsers().find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  }

  function handleAdminLogin() {
    setIsAdmin(true);
  }

  function handleLogout() {
    setCurrentUserId(null);
    localStorage.removeItem("tm11_admin");
    setCurrentUser(null);
    setIsAdmin(false);
    handleNavigate("landing");
  }

  function renderPage() {
    // Admin routes
    if (currentPage === "admin-login") {
      return (
        <AdminLoginPage
          onNavigate={handleNavigate}
          onAdminLogin={handleAdminLogin}
        />
      );
    }
    if (isAdmin) {
      switch (currentPage) {
        case "admin-dashboard":
          return <AdminDashboardPage onNavigate={handleNavigate} />;
        case "admin-users":
          return <AdminUsersPage />;
        case "admin-payments":
          return <AdminPaymentsPage />;
        case "admin-videos":
          return <AdminVideosPage />;
        default:
          return <AdminDashboardPage onNavigate={handleNavigate} />;
      }
    }

    // User routes
    if (currentUser) {
      // Refresh user to get latest status
      const freshUser =
        getUsers().find((u) => u.id === currentUser.id) ?? currentUser;

      switch (currentPage) {
        case "dashboard":
          return <DashboardPage user={freshUser} onNavigate={handleNavigate} />;
        case "matrix":
          return <MatrixTreePage user={freshUser} />;
        case "videos":
          return <VideoLibraryPage user={freshUser} />;
        case "pending":
          return <PendingPage user={freshUser} />;
        default:
          return freshUser.status === "pending" ? (
            <PendingPage user={freshUser} />
          ) : (
            <DashboardPage user={freshUser} onNavigate={handleNavigate} />
          );
      }
    }

    // Public routes
    if (currentPage === "register") {
      return <RegisterPage onNavigate={handleNavigate} />;
    }
    if (currentPage === "login") {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
    return <LandingPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      <Navbar
        currentUser={currentUser}
        isAdmin={isAdmin}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
