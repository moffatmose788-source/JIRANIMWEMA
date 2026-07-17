/**
 * BOMAENGWE WELFARE — App Entry Point
 * Routes, providers, and layout orchestration
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import '@/lib/i18n';

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CommitteeDashboard from "./pages/dashboard/CommitteeDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";
import MembersPage from "./pages/members/MembersPage";
import ContributionsPage from "./pages/contributions/ContributionsPage";

import WelfarePage from "./pages/welfare/WelfarePage";
import MeetingsPage from "./pages/meetings/MeetingsPage";
import AnnouncementsPage from "./pages/announcements/AnnouncementsPage";
import FinancesPage from "./pages/finances/FinancesPage";
import ReportsPage from "./pages/reports/ReportsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import MemberIdCardPage from "./pages/members/MemberIdCardPage";
import NotFound from "./pages/NotFound";

// Protected Route Component
function ProtectedRoute({
  component: Component,
  requiredRole,
}: {
  component: React.ComponentType;
  requiredRole?: 'admin' | 'committee' | 'member';
}) {
  const { currentUser, loading, canAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && !canAccess(requiredRole)) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

// Dashboard redirect based on role
function DashboardRedirect() {
  const { role, currentUser, loading } = useAuth();

  if (loading) return null;
  if (!currentUser || !role) return <Redirect to="/login" />;

  if (role === 'admin') return <Redirect to="/admin" />;
  if (role === 'committee') return <Redirect to="/committee" />;
  return <Redirect to="/member" />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />

      {/* Dashboard redirect */}
      <Route path="/dashboard" component={DashboardRedirect} />

      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} requiredRole="admin" />
      </Route>

      {/* Committee routes */}
      <Route path="/committee">
        <ProtectedRoute component={CommitteeDashboard} requiredRole="committee" />
      </Route>

      {/* Member routes */}
      <Route path="/member">
        <ProtectedRoute component={MemberDashboard} requiredRole="member" />
      </Route>

      {/* Module routes (accessible by committee and admin) */}
      <Route path="/members">
        <ProtectedRoute component={MembersPage} requiredRole="committee" />
      </Route>
      <Route path="/members/id-card/:id">
        <ProtectedRoute component={MemberIdCardPage} requiredRole="member" />
      </Route>
      <Route path="/contributions">
        <ProtectedRoute component={ContributionsPage} requiredRole="member" />
      </Route>

      <Route path="/welfare">
        <ProtectedRoute component={WelfarePage} requiredRole="member" />
      </Route>
      <Route path="/meetings">
        <ProtectedRoute component={MeetingsPage} requiredRole="member" />
      </Route>
      <Route path="/announcements">
        <ProtectedRoute component={AnnouncementsPage} requiredRole="member" />
      </Route>
      <Route path="/finances">
        <ProtectedRoute component={FinancesPage} requiredRole="committee" />
      </Route>
      <Route path="/reports">
        <ProtectedRoute component={ReportsPage} requiredRole="committee" />
      </Route>
      <Route path="/notifications">
        <ProtectedRoute component={NotificationsPage} requiredRole="member" />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} requiredRole="member" />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={SettingsPage} requiredRole="admin" />
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <AuthProvider>
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
