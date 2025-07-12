import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  Search, 
  Package, 
  User, 
  HelpCircle, 
  Menu,
  MessageCircle,
  Bell
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/find-tailor", icon: Search, label: "Find Tailor" },
    { to: "/orders", icon: Package, label: "My Orders" },
    { to: "/messages", icon: MessageCircle, label: "Messages" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/help", icon: HelpCircle, label: "Help" },
  ];

  const NavItem = ({ to, icon: Icon, label, mobile = false }: {
    to: string;
    icon: any;
    label: string;
    mobile?: boolean;
  }) => (
    <NavLink
      to={to}
      onClick={() => mobile && setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        } ${mobile ? "text-lg" : "text-sm"}`
      }
    >
      <Icon className={mobile ? "h-6 w-6" : "h-4 w-4"} />
      {mobile && <span>{label}</span>}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-primary">StitchMatch</span>
          </NavLink>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm">
            Login
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-50">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-lg font-bold text-primary">StitchMatch</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Guest User</div>
                    <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground">
                      Login / Register
                    </Button>
                  </div>
                </div>
                
                {navItems.map((item) => (
                  <NavItem key={item.to} {...item} mobile />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;