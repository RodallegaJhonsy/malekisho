import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { UserTable } from "@/components/admin/user-table"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single()

  const userName = adminProfile?.full_name || user?.email?.split("@")[0] || "Admin"

  // Get all users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <>
      <Header title="Gestión de Usuarios" userName={userName} />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Usuarios</h2>
            <p className="text-muted-foreground">
              Gestiona las suscripciones de los usuarios
            </p>
          </div>
        </div>

        <UserTable users={users || []} />
      </div>
    </>
  )
}
