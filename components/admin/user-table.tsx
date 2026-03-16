"use client"

import { useState } from "react"
import { EditUserModal } from "./edit-user-modal"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  subscription_status: string
  subscription_expires_at: string | null
  created_at: string
}

interface UserTableProps {
  users: Profile[]
}

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserUpdate = (updatedUser: Profile) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    )
    setSelectedUser(null)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      expired: "bg-red-100 text-red-800",
    }[status] || "bg-gray-100 text-gray-800"

    const labels = {
      active: "Activa",
      inactive: "Inactiva",
      expired: "Expirada",
    }[status] || status

    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles}`}>
        {labels}
      </span>
    )
  }

  const getRoleBadge = (role: string) => {
    const styles = role === "admin" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-blue-100 text-blue-800"
    
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles}`}>
        {role === "admin" ? "Admin" : "Usuario"}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No definida"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Expiración
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Registro
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {user.full_name || "Sin nombre"}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(user.subscription_status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {formatDate(user.subscription_expires_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUserUpdate}
        />
      )}
    </>
  )
}
