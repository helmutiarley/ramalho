
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Header } from "@/components/Header"
import { Calculator } from "@/components/Calculator"
import { Catalog } from "@/components/Catalog"
import { ProductPage } from "@/components/ProductPage"
import { AdminLogin } from "@/components/AdminLogin"
import { AdminPanel } from "@/components/AdminPanel"
import { AdminRoute } from "@/components/AdminRoute"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex flex-col">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <>
                <Header />
                <AdminLogin />
                <Footer />
              </>
            } />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Header />
                  <AdminPanel />
                  <Footer />
                </AdminRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <main className="container mx-auto flex-1">
                    <Calculator />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/catalogo"
              element={
                <>
                  <Header />
                  <main className="container mx-auto flex-1">
                    <Catalog />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/produto/:id"
              element={
                <>
                  <Header />
                  <main className="container mx-auto flex-1">
                    <ProductPage />
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
