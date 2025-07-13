import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import FindTailor from "./pages/FindTailor";
import TailorProfile from "./pages/TailorProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/find-tailor" element={<FindTailor />} />
            <Route path="/tailor/:id" element={<TailorProfile />} />
            <Route path="/orders" element={<div className="p-8 text-center">Orders page coming soon...</div>} />
            <Route path="/messages" element={<div className="p-8 text-center">Messages page coming soon...</div>} />
            <Route path="/profile" element={<div className="p-8 text-center">Profile page coming soon...</div>} />
            <Route path="/help" element={<div className="p-8 text-center">Help page coming soon...</div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
