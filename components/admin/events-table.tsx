'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Pencil,
  Copy,
  Trash2,
  Eye,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Video,
  Building,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { mockEvents, type AdminEvent } from '@/lib/admin-data'

function getStatusBadge(status: AdminEvent['status']) {
  const config = {
    upcoming: { variant: 'default' as const, label: 'Proximo', className: 'bg-info text-info-foreground' },
    ongoing: { variant: 'default' as const, label: 'En Curso', className: 'bg-success text-success-foreground' },
    completed: { variant: 'secondary' as const, label: 'Completado', className: '' },
    cancelled: { variant: 'destructive' as const, label: 'Cancelado', className: '' },
  }
  
  const { variant, label, className } = config[status]
  return <Badge variant={variant} className={className}>{label}</Badge>
}

function getModalityIcon(modality: AdminEvent['modality']) {
  switch (modality) {
    case 'presencial':
      return <Building className="size-4" />
    case 'virtual':
      return <Video className="size-4" />
    case 'hibrido':
      return (
        <div className="flex">
          <Building className="size-3" />
          <Video className="size-3 -ml-1" />
        </div>
      )
  }
}

function getModalityLabel(modality: AdminEvent['modality']) {
  const labels = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    hibrido: 'Hibrido',
  }
  return labels[modality]
}

export function EventsTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalityFilter, setModalityFilter] = useState<string>('all')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof AdminEvent; direction: 'asc' | 'desc' } | null>(null)

  const filteredEvents = mockEvents
    .filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter
      const matchesModality = modalityFilter === 'all' || event.modality === modalityFilter
      return matchesSearch && matchesStatus && matchesModality
    })
    .sort((a, b) => {
      if (!sortConfig) return 0
      const { key, direction } = sortConfig
      const aValue = a[key]
      const bValue = b[key]
      if (aValue === null) return 1
      if (bValue === null) return -1
      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(filteredEvents.map((e) => e.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSort = (key: keyof AdminEvent) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="upcoming">Proximos</SelectItem>
              <SelectItem value="ongoing">En Curso</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={modalityFilter} onValueChange={setModalityFilter}>
            <SelectTrigger className="w-[140px]">
              <Video className="mr-2 size-4" />
              <SelectValue placeholder="Modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="hibrido">Hibrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {selectedEvents.length > 0 && (
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar ({selectedEvents.length})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/admin/events/new">
              <Plus className="mr-2 size-4" />
              Nuevo Evento
            </Link>
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
                    checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
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
                    Evento
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Modalidad</TableHead>
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
                    onClick={() => handleSort('startDate')}
                  >
                    Fecha
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>Inscripciones</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="size-8" />
                      <p>No se encontraron eventos</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => {
                  const percentage = Math.round((event.registrations / event.capacity) * 100)
                  return (
                    <TableRow key={event.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => toggleSelect(event.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {event.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="size-3" />
                            {event.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {event.project}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModalityIcon(event.modality)}
                          <span className="text-sm">{getModalityLabel(event.modality)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(event.startDate).toLocaleDateString('es-CL', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.startDate).toLocaleTimeString('es-CL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <div className="flex items-center gap-1.5">
                            <Users className="size-4 text-muted-foreground" />
                            <span className="font-medium">{event.registrations}</span>
                            <span className="text-muted-foreground">/ {event.capacity}</span>
                          </div>
                          <Progress value={percentage} className="h-2 w-16" />
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 size-4" />
                              Ver inscripciones
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 size-4" />
                              Duplicar
                            </DropdownMenuItem>
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
          Mostrando {filteredEvents.length} de {mockEvents.length} eventos
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
