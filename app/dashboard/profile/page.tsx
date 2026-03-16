"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    full_name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [fullName, setFullName] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single()
        
        if (data) {
          setProfile(data)
          setFullName(data.full_name || "")
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage({ type: "error", text: "No se encontró el usuario" })
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id)

    if (error) {
      setMessage({ type: "error", text: "Error al guardar los cambios" })
    } else {
      setMessage({ type: "success", text: "Perfil actualizado correctamente" })
      setProfile(prev => prev ? { ...prev, full_name: fullName } : null)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <>
        <Header title="Mi Perfil" userName="..." />
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Mi Perfil" userName={profile?.full_name || "Usuario"} />
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Información Personal</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="mt-1 block w-full rounded-lg border border-input bg-muted px-4 py-3 text-muted-foreground"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  El correo electrónico no se puede cambiar
                </p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu nombre completo"
                />
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
