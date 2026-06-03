'use client'

import {
  FileText,
  Calendar,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { dashboardStats, mockForms, mockEvents, mockRegistrations } from '@/lib/admin-data'

const registrationData = [
  { name: 'Lun', registrations: 12 },
  { name: 'Mar', registrations: 18 },
  { name: 'Mie', registrations: 15 },
  { name: 'Jue', registrations: 25 },
  { name: 'Vie', registrations: 32 },
  { name: 'Sab', registrations: 8 },
  { name: 'Dom', registrations: 5 },
]

const monthlyData = [
  { month: 'Ene', forms: 3, events: 2 },
  { month: 'Feb', forms: 5, events: 4 },
  { month: 'Mar', forms: 4, events: 3 },
  { month: 'Abr', forms: 6, events: 5 },
  { month: 'May', forms: 8, events: 6 },
  { month: 'Jun', forms: 7, events: 5 },
]

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={`flex items-center text-xs font-medium ${
                trend.isPositive ? 'text-success' : 'text-destructive'
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {trend.value}%
            </span>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    active: { variant: 'default', label: 'Activo' },
    draft: { variant: 'secondary', label: 'Borrador' },
    closed: { variant: 'outline', label: 'Cerrado' },
    upcoming: { variant: 'default', label: 'Proximo' },
    ongoing: { variant: 'secondary', label: 'En Curso' },
    completed: { variant: 'outline', label: 'Completado' },
    confirmed: { variant: 'default', label: 'Confirmado' },
    pending: { variant: 'secondary', label: 'Pendiente' },
    waitlist: { variant: 'outline', label: 'Lista Espera' },
  }
  
  const config = variants[status] || { variant: 'outline', label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function DashboardContent() {
  const occupancyRate = Math.round((dashboardStats.totalOccupancy / dashboardStats.totalCapacity) * 100)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Formularios Activos"
          value={dashboardStats.activeForms}
          description={`de ${dashboardStats.totalForms} totales`}
          icon={<FileText className="size-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Eventos Proximos"
          value={dashboardStats.upcomingEvents}
          description={`de ${dashboardStats.totalEvents} totales`}
          icon={<Calendar className="size-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Inscripciones"
          value={dashboardStats.totalRegistrations}
          description={`${dashboardStats.pendingRegistrations} pendientes`}
          icon={<Users className="size-5" />}
          trend={{ value: 23, isPositive: true }}
        />
        <StatCard
          title="Tasa de Ocupacion"
          value={`${occupancyRate}%`}
          description={`${dashboardStats.totalOccupancy}/${dashboardStats.totalCapacity} cupos`}
          icon={<TrendingUp className="size-5" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inscripciones esta Semana</CardTitle>
            <CardDescription>Numero de inscripciones por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
            <CardDescription>Formularios y eventos creados por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="forms"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Forms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Formularios Recientes</CardTitle>
              <CardDescription>Ultimos formularios creados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/forms">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockForms.slice(0, 4).map((form) => (
                <div key={form.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{form.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {form.responses}/{form.capacity} inscripciones
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(form.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Proximos Eventos</CardTitle>
              <CardDescription>Eventos programados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/events">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents
                .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
                .slice(0, 4)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-chart-2/10">
                        <Calendar className="size-4 text-chart-2" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{event.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(event.startDate).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inscripciones Recientes</CardTitle>
              <CardDescription>Ultimas inscripciones recibidas</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/registrations">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRegistrations.slice(0, 4).map((reg) => (
                <div key={reg.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-lg ${
                        reg.status === 'confirmed'
                          ? 'bg-success/10'
                          : reg.status === 'pending'
                          ? 'bg-warning/10'
                          : 'bg-muted'
                      }`}
                    >
                      {reg.status === 'confirmed' ? (
                        <CheckCircle2 className="size-4 text-success" />
                      ) : reg.status === 'pending' ? (
                        <AlertCircle className="size-4 text-warning" />
                      ) : (
                        <Clock className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {String(reg.data.nombre || reg.data.nombreEquipo || reg.data.lider)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{reg.eventName}</p>
                    </div>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Capacidad de Eventos</CardTitle>
          <CardDescription>Ocupacion actual de los eventos activos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockEvents
              .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
              .map((event) => {
                const percentage = Math.round((event.registrations / event.capacity) * 100)
                return (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{event.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.registrations} de {event.capacity} cupos ocupados
                        </p>
                      </div>
                      <span className="text-sm font-semibold">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
