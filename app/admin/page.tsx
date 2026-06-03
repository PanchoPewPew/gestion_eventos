import { Plus } from 'lucide-react'
import Link from 'next/link'

import { AdminHeader } from '@/components/admin/admin-layout'
import { DashboardContent } from '@/components/admin/dashboard-content'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Resumen general del sistema de gestion de eventos"
        action={
          <Button asChild>
            <Link href="/admin/forms/new">
              <Plus className="mr-2 size-4" />
              Nuevo Formulario
            </Link>
          </Button>
        }
      />
      <DashboardContent />
    </>
  )
}
