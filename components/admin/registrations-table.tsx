'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Send,
  FileText,
  Calendar,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { mockRegistrations, mockForms, type Registration } from '@/lib/admin-data'

function getStatusBadge(status: Registration['status']) {
  const config = {
    confirmed: {
      variant: 'default' as const,
      label: 'Confirmado',
      className: 'bg-success text-success-foreground',
      icon: CheckCircle,
    },
    pending: {
      variant: 'secondary' as const,
      label: 'Pendiente',
      className: 'bg-warning text-warning-foreground',
      icon: Clock,
    },
    waitlist: {
      variant: 'outline' as const,
      label: 'Lista Espera',
      className: '',
      icon: Clock,
    },
    cancelled: {
      variant: 'destructive' as const,
      label: 'Cancelado',
      className: '',
      icon: XCircle,
    },
  }

  const { variant, label, className, icon: Icon } = config[status]
  return (
    <Badge variant={variant} className={cn('gap-1', className)}>
      <Icon className="size-3" />
      {label}
    </Badge>
  )
}

interface RegistrationDetailsProps {
  registration: Registration
}

function RegistrationDetails({ registration }: RegistrationDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {String(registration.data.nombre || registration.data.nombreEquipo || registration.data.lider)}
          </h3>
          <p className="text-sm text-muted-foreground">{registration.eventName}</p>
        </div>
        {getStatusBadge(registration.status)}
      </div>

      <Separator />

      {/* Data Fields */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Datos del Formulario
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(registration.data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <p className="text-sm text-muted-foreground">
                {Array.isArray(value) ? value.join(', ') : value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Metadata */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Informacion del Registro
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Formulario</label>
            <p className="text-sm text-muted-foreground">{registration.formTitle}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Fecha de Inscripcion</label>
            <p className="text-sm text-muted-foreground">
              {new Date(registration.submittedAt).toLocaleString('es-CL', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        {registration.status === 'pending' && (
          <>
            <Button className="flex-1">
              <CheckCircle className="mr-2 size-4" />
              Confirmar
            </Button>
            <Button variant="destructive" className="flex-1">
              <XCircle className="mr-2 size-4" />
              Rechazar
            </Button>
          </>
        )}
        {registration.status === 'waitlist' && (
          <Button className="flex-1">
            <CheckCircle className="mr-2 size-4" />
            Mover a Confirmados
          </Button>
        )}
        {registration.data.email && (
          <Button variant="outline">
            <Mail className="mr-2 size-4" />
            Enviar Email
          </Button>
        )}
      </div>
    </div>
  )
}

export function RegistrationsTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [formFilter, setFormFilter] = useState<string>('all')
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Registration | 'name'
    direction: 'asc' | 'desc'
  } | null>(null)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  const filteredRegistrations = mockRegistrations
    .filter((reg) => {
      const name = String(reg.data.nombre || reg.data.nombreEquipo || reg.data.lider || '')
      const email = String(reg.data.email || '')
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
      const matchesForm = formFilter === 'all' || reg.formId === formFilter
      return matchesSearch && matchesStatus && matchesForm
    })
    .sort((a, b) => {
      if (!sortConfig) return 0
      const { key, direction } = sortConfig
      let aValue: string | number
      let bValue: string | number

      if (key === 'name') {
        aValue = String(a.data.nombre || a.data.nombreEquipo || a.data.lider || '')
        bValue = String(b.data.nombre || b.data.nombreEquipo || b.data.lider || '')
      } else {
        aValue = a[key] as string
        bValue = b[key] as string
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

  const toggleSelectAll = () => {
    if (selectedRegistrations.length === filteredRegistrations.length) {
      setSelectedRegistrations([])
    } else {
      setSelectedRegistrations(filteredRegistrations.map((r) => r.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedRegistrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSort = (key: keyof Registration | 'name') => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const stats = {
    total: mockRegistrations.length,
    confirmed: mockRegistrations.filter((r) => r.status === 'confirmed').length,
    pending: mockRegistrations.filter((r) => r.status === 'pending').length,
    waitlist: mockRegistrations.filter((r) => r.status === 'waitlist').length,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Inscripciones</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Confirmados</CardDescription>
            <CardTitle className="text-2xl text-success">{stats.confirmed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pendientes</CardDescription>
            <CardTitle className="text-2xl text-warning">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lista de Espera</CardDescription>
            <CardTitle className="text-2xl">{stats.waitlist}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="waitlist">Lista Espera</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={formFilter} onValueChange={setFormFilter}>
            <SelectTrigger className="w-[180px]">
              <FileText className="mr-2 size-4" />
              <SelectValue placeholder="Formulario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los formularios</SelectItem>
              {mockForms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {selectedRegistrations.length > 0 && (
            <>
              <Button variant="outline" size="sm">
                <Send className="mr-2 size-4" />
                Enviar Email ({selectedRegistrations.length})
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Eliminar
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedRegistrations.length === filteredRegistrations.length &&
                      filteredRegistrations.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8"
                    onClick={() => handleSort('name')}
                  >
                    Participante
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>Evento / Formulario</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8"
                    onClick={() => handleSort('status')}
                  >
                    Estado
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8"
                    onClick={() => handleSort('submittedAt')}
                  >
                    Fecha
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="size-8" />
                      <p>No se encontraron inscripciones</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((reg) => {
                  const name = String(
                    reg.data.nombre || reg.data.nombreEquipo || reg.data.lider || 'Sin nombre'
                  )
                  const email = String(reg.data.email || '')
                  const phone = String(reg.data.telefono || '')

                  return (
                    <TableRow key={reg.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedRegistrations.includes(reg.id)}
                          onCheckedChange={() => toggleSelect(reg.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="text-left hover:text-primary"
                              onClick={() => setSelectedRegistration(reg)}
                            >
                              <span className="font-medium hover:underline">{name}</span>
                              {reg.data.empresa && (
                                <p className="text-xs text-muted-foreground">
                                  {String(reg.data.empresa)}
                                </p>
                              )}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Detalle de Inscripcion</DialogTitle>
                              <DialogDescription>
                                Informacion completa del registro
                              </DialogDescription>
                            </DialogHeader>
                            <RegistrationDetails registration={reg} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{reg.eventName}</p>
                          <p className="text-xs text-muted-foreground">{reg.formTitle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {email && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Mail className="size-3 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{email}</span>
                            </div>
                          )}
                          {phone && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Phone className="size-3" />
                              <span>{phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="size-3" />
                          {new Date(reg.submittedAt).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="mr-2 size-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Detalle de Inscripcion</DialogTitle>
                                  <DialogDescription>
                                    Informacion completa del registro
                                  </DialogDescription>
                                </DialogHeader>
                                <RegistrationDetails registration={reg} />
                              </DialogContent>
                            </Dialog>
                            {reg.status === 'pending' && (
                              <>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 size-4" />
                                  Confirmar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="mr-2 size-4" />
                                  Rechazar
                                </DropdownMenuItem>
                              </>
                            )}
                            {email && (
                              <DropdownMenuItem>
                                <Mail className="mr-2 size-4" />
                                Enviar email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 size-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredRegistrations.length} de {mockRegistrations.length} inscripciones
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="mr-1 size-4" />
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
