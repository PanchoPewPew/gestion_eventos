import { AdminHeader } from '@/components/admin/admin-layout'
import { RegistrationsTable } from '@/components/admin/registrations-table'

export default function RegistrationsPage() {
  return (
    <>
      <AdminHeader
        title="Inscripciones"
        description="Visualiza y gestiona todas las inscripciones recibidas"
      />
      <div className="p-6">
        <RegistrationsTable />
      </div>
    </>
  )
}
