import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.role === "admin"
  const userName = profile?.full_name || user.email?.split("@")[0] || "Usuario"

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} userName={userName} />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
}
