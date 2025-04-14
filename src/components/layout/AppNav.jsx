
import { Link, useLocation } from "react-router-dom";
import { ActivitySquare, Database, FlaskConical, Home, Settings, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

function NavItem({ href, icon: Icon, label, isActive }) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive 
          ? "bg-accent text-accent-foreground font-medium" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function AppNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { href: "/", label: "Dashboard", icon: LineChart },
    { href: "/management", label: "Cache Management", icon: Database },
    { href: "/testing", label: "API Testing", icon: FlaskConical },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex items-center space-x-2 lg:space-x-4">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={
            item.href === "/" 
              ? currentPath === "/" 
              : currentPath.startsWith(item.href)
          }
        />
      ))}
    </div>
  );
}
