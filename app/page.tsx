import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="text-lg font-semibold text-foreground">Malekisho</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-4 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Bienvenido a <span className="text-primary">Malekisho</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Plataforma de gestión con acceso controlado por suscripción. 
            Inicia sesión para acceder a tu panel de control.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Crear cuenta
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Acceso Seguro</h3>
            <p className="text-muted-foreground">
              Sistema de autenticación robusto con control de suscripciones.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Panel Admin</h3>
            <p className="text-muted-foreground">
              Gestiona usuarios y controla las suscripciones desde un solo lugar.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Control de Fechas</h3>
            <p className="text-muted-foreground">
              Configura fechas de expiración y mantén el control de acceso.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Malekisho. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
