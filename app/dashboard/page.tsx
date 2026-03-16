import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Usuario"
  
  // Format subscription expiration date
  const expiresAt = profile?.subscription_expires_at 
    ? new Date(profile.subscription_expires_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "No definida"

  const subscriptionStatusText = {
    active: "Activa",
    inactive: "Inactiva",
    expired: "Expirada"
  }[profile?.subscription_status || "inactive"]

  const subscriptionStatusColor = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800"
  }[profile?.subscription_status || "inactive"]

  return (
    <>
      <Header title="Panel Principal" userName={userName} />
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Bienvenido, {userName}
          </h2>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de tu cuenta
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Subscription Status Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado de Suscripción</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${subscriptionStatusColor}`}>
                  {subscriptionStatusText}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Expiration Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Expiración</p>
                <p className="text-lg font-semibold text-foreground">{expiresAt}</p>
              </div>
            </div>
          </div>

          {/* Account Type Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Cuenta</p>
                <p className="text-lg font-semibold text-foreground capitalize">
                  {profile?.role === "admin" ? "Administrador" : "Usuario"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Acciones Rápidas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/dashboard/profile"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Editar Perfil</p>
                <p className="text-sm text-muted-foreground">Actualiza tu información personal</p>
              </div>
            </a>

            <a
              href="/dashboard/subscription"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Ver Suscripción</p>
                <p className="text-sm text-muted-foreground">Consulta los detalles de tu plan</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
