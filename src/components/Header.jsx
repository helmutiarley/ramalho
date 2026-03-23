
import React, { useState, useEffect } from "react"
import { Menu, Lock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Sidebar } from "@/components/Sidebar"
import { useTheme } from "@/components/ThemeProvider"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { checkAdminSession, logoutAdmin } from "@/lib/auth"
import { getSettings } from "@/lib/settings"

const menuItems = [
  {
    title: "Início",
    href: "/"
  },
  {
    title: "Catálogo",
    href: "/catalogo"
  }
]

export function Header() {
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logos, setLogos] = useState({
    light: "https://storage.googleapis.com/hostinger-horizons-assets-prod/191d9fe7-4e97-4407-97ba-91113abbc963/7cd262480343c632df850d68746b348c.png",
    dark: "https://storage.googleapis.com/hostinger-horizons-assets-prod/191d9fe7-4e97-4407-97ba-91113abbc963/f79693977158bd8da64541625328ae22.png"
  })

  useEffect(() => {
    loadSettings()
    setIsAuthenticated(checkAdminSession())
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getSettings()
      if (settings) {
        setLogos({
          light: settings.logo_light || logos.light,
          dark: settings.logo_dark || logos.dark
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleAuthClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      logoutAdmin()
      setIsAuthenticated(false)
      navigate("/")
    } else {
      navigate("/admin/login")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex w-full items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-4">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <Sidebar 
                onNavigate={() => setOpen(false)} 
                isAuthenticated={isAuthenticated}
                onAuthClick={handleAuthClick}
              />
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-center md:justify-start">
            {/* <img 
              src={theme === "dark" ? logos.dark : logos.light} 
              alt="Logo" 
              style={{ height: "56px", width: "auto" }}
              className="my-2"
            /> */}
            <nav className="hidden md:flex ml-8 space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          {/* Link de autenticação apenas no desktop */}
          <a
            href="#"
            onClick={handleAuthClick}
            className={cn(
              "hidden md:flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
              location.pathname.startsWith("/admin") ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Entrar</span>
              </>
            )}
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
