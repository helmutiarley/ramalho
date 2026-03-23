
import React from "react"
import { Home, ShoppingBag, Lock, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  {
    title: "Início",
    icon: Home,
    href: "/"
  },
  {
    title: "Catálogo",
    icon: ShoppingBag,
    href: "/catalogo"
  }
]

export function Sidebar({ className, onNavigate, isAuthenticated, onAuthClick }) {
  const location = useLocation()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
            <a
              href="#"
              onClick={onAuthClick}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                location.pathname.startsWith("/admin") && "bg-accent text-accent-foreground"
              )}
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
