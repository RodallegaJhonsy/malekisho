import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single()

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Admin"

  // Get user statistics
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: activeUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "active")

  const { count: expiredUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .or("subscription_status.eq.expired,subscription_status.eq.inactive")

  return (
    <>
      <Header title="Panel de Administración" userName={userName} />
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Panel de Administración
          </h2>
          <p className="text-muted-foreground">
            Gestiona usuarios y suscripciones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-3xl font-bold text-foreground">{totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suscripciones Activas</p>
                <p className="text-3xl font-bold text-foreground">{activeUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactivas/Expiradas</p>
                <p className="text-3xl font-bold text-foreground">{expiredUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Acciones Rápidas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/users"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Gestionar Usuarios</p>
                <p className="text-sm text-muted-foreground">Ver, editar y gestionar suscripciones</p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Ir al Dashboard</p>
                <p className="text-sm text-muted-foreground">Ver tu panel personal</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
