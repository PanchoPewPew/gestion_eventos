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
  ExternalLink,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { mockForms, type AdminForm } from '@/lib/admin-data'

function getStatusBadge(status: AdminForm['status']) {
  const config = {
    active: { variant: 'default' as const, label: 'Activo', className: 'bg-success text-success-foreground' },
    draft: { variant: 'secondary' as const, label: 'Borrador', className: '' },
    closed: { variant: 'outline' as const, label: 'Cerrado', className: '' },
  }
  
  const { variant, label, className } = config[status]
  return <Badge variant={variant} className={className}>{label}</Badge>
}

export function FormsTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof AdminForm; direction: 'asc' | 'desc' } | null>(null)

  const filteredForms = mockForms
    .filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (!sortConfig) return 0
      const { key, direction } = sortConfig
      const aValue = a[key]
      const bValue = b[key]
      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

  const toggleSelectAll = () => {
    if (selectedForms.length === filteredForms.length) {
      setSelectedForms([])
    } else {
      setSelectedForms(filteredForms.map((f) => f.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedForms((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSort = (key: keyof AdminForm) => {
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
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar formularios..."
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
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {selectedForms.length > 0 && (
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar ({selectedForms.length})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/admin/forms/new">
              <Plus className="mr-2 size-4" />
              Nuevo Formulario
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
                    checked={selectedForms.length === filteredForms.length && filteredForms.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8"
                    onClick={() => handleSort('title')}
                  >
                    Formulario
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>Evento</TableHead>
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
                    onClick={() => handleSort('responses')}
                  >
                    Inscripciones
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Actualizado
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="size-8" />
                      <p>No se encontraron formularios</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredForms.map((form) => {
                  const percentage = Math.round((form.responses / form.capacity) * 100)
                  return (
                    <TableRow key={form.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedForms.includes(form.id)}
                          onCheckedChange={() => toggleSelect(form.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link
                            href={`/admin/forms/${form.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {form.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {form.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{form.eventName}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(form.status)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{form.responses}</span>
                        <span className="text-muted-foreground"> / {form.capacity}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(form.updatedAt).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
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
                              <Link href={`/admin/forms/${form.id}`}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 size-4" />
                              Vista previa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 size-4" />
                              Abrir formulario
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
          Mostrando {filteredForms.length} de {mockForms.length} formularios
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
