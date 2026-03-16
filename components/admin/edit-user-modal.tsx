"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  subscription_status: string
  subscription_expires_at: string | null
  created_at: string
}

interface EditUserModalProps {
  user: Profile
  onClose: () => void
  onUpdate: (user: Profile) => void
}

export function EditUserModal({ user, onClose, onUpdate }: EditUserModalProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState(user.subscription_status)
  const [subscriptionExpires, setSubscriptionExpires] = useState(
    user.subscription_expires_at 
      ? new Date(user.subscription_expires_at).toISOString().split("T")[0]
      : ""
  )
  const [role, setRole] = useState(user.role)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from("profiles")
      .update({
        subscription_status: subscriptionStatus,
        subscription_expires_at: subscriptionExpires ? new Date(subscriptionExpires).toISOString() : null,
        role,
      })
      .eq("id", user.id)

    if (error) {
      setError("Error al actualizar el usuario")
      setSaving(false)
      return
    }

    onUpdate({
      ...user,
      subscription_status: subscriptionStatus,
      subscription_expires_at: subscriptionExpires ? new Date(subscriptionExpires).toISOString() : null,
      role,
    })
  }

  // Quick action to extend subscription by X days
  const extendSubscription = (days: number) => {
    const currentDate = subscriptionExpires 
      ? new Date(subscriptionExpires) 
      : new Date()
    
    if (currentDate < new Date()) {
      currentDate.setTime(new Date().getTime())
    }
    
    currentDate.setDate(currentDate.getDate() + days)
    setSubscriptionExpires(currentDate.toISOString().split("T")[0])
    setSubscriptionStatus("active")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* User Info (read-only) */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Usuario</p>
            <p className="font-medium text-foreground">{user.full_name || "Sin nombre"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-foreground">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Subscription Status */}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Estado de Suscripción
            </label>
            <select
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="inactive">Inactiva</option>
              <option value="active">Activa</option>
              <option value="expired">Expirada</option>
            </select>
          </div>

          {/* Subscription Expiration */}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Fecha de Expiración
            </label>
            <input
              type="date"
              value={subscriptionExpires}
              onChange={(e) => setSubscriptionExpires(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Extender Suscripción
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => extendSubscription(7)}
                className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                +7 días
              </button>
              <button
                type="button"
                onClick={() => extendSubscription(30)}
                className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                +30 días
              </button>
              <button
                type="button"
                onClick={() => extendSubscription(90)}
                className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                +90 días
              </button>
              <button
                type="button"
                onClick={() => extendSubscription(365)}
                className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                +1 año
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
