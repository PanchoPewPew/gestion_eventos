import { AdminHeader } from '@/components/admin/admin-layout'
import { FormsTable } from '@/components/admin/forms-table'

export default function FormsPage() {
  return (
    <>
      <AdminHeader
        title="Formularios"
        description="Gestiona los formularios de inscripcion para tus eventos"
      />
      <div className="p-6">
        <FormsTable />
      </div>
    </>
  )
}
