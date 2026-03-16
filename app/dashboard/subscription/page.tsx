import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"

export default async function SubscriptionPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Usuario"
  
  // Format dates
  const createdAt = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "No disponible"

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

  // Calculate days remaining
  let daysRemaining = 0
  if (profile?.subscription_expires_at && profile?.subscription_status === "active") {
    const now = new Date()
    const expiry = new Date(profile.subscription_expires_at)
    const diffTime = expiry.getTime() - now.getTime()
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <>
      <Header title="Mi Suscripción" userName={userName} />
      <div className="p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Subscription Status Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Estado de Suscripción</h2>
                <p className="text-sm text-muted-foreground">Detalles de tu plan actual</p>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-medium ${subscriptionStatusColor}`}>
                {subscriptionStatusText}
              </span>
            </div>

            {profile?.subscription_status === "active" && daysRemaining > 0 && (
              <div className="mt-6 rounded-lg bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-foreground">
                    Te quedan <span className="font-semibold">{daysRemaining} días</span> de suscripción
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Detalles del Plan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Fecha de registro</span>
                <span className="font-medium text-foreground">{createdAt}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Fecha de expiración</span>
                <span className="font-medium text-foreground">{expiresAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tipo de cuenta</span>
                <span className="font-medium text-foreground capitalize">
                  {profile?.role === "admin" ? "Administrador" : "Usuario"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Admin */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold text-foreground">¿Necesitas renovar?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Para renovar o extender tu suscripción, contacta al administrador de la plataforma.
            </p>
            <a
              href="mailto:admin@malekisho.com"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Administrador
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
