import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import FindTailor from "./pages/FindTailor";
import TailorProfile from "./pages/TailorProfile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import CustomerSignup from "./pages/CustomerSignup";
import TailorSignup from "./pages/TailorSignup";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/find-tailor" element={<FindTailor />} />
              <Route path="/tailor/:id" element={<TailorProfile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/payment/:orderId" element={<Payment />} />
              <Route path="/customer-signup" element={<CustomerSignup />} />
              <Route path="/tailor-signup" element={<TailorSignup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/help" element={<div className="p-8 text-center">Help page coming soon...</div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
