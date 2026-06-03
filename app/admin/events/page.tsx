import { AdminHeader } from '@/components/admin/admin-layout'
import { EventsTable } from '@/components/admin/events-table'

export default function EventsPage() {
  return (
    <>
      <AdminHeader
        title="Eventos"
        description="Gestiona los eventos y sus configuraciones"
      />
      <div className="p-6">
        <EventsTable />
      </div>
    </>
  )
}
