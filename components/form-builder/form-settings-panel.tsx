"use client"

import type { FormSettings, EventInfo } from "@/lib/form-types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Globe,
  Laptop,
  Building,
} from "lucide-react"

interface FormSettingsPanelProps {
  settings: FormSettings
  event?: EventInfo
  onUpdateSettings: (updates: Partial<FormSettings>) => void
  onUpdateEvent: (updates: Partial<EventInfo>) => void
}

const eventStatusLabels: Record<EventInfo["status"], string> = {
  borrador: "Borrador",
  publicado: "Publicado",
  cupo_completo: "Cupo completo",
  cerrado: "Cerrado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
}

const eventStatusColors: Record<EventInfo["status"], string> = {
  borrador: "bg-muted text-muted-foreground",
  publicado: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cupo_completo: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cerrado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  finalizado: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cancelado: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

const modalityIcons: Record<EventInfo["modality"], React.ReactNode> = {
  presencial: <Building className="h-4 w-4" />,
  online: <Globe className="h-4 w-4" />,
  hibrido: <Laptop className="h-4 w-4" />,
}

export function FormSettingsPanel({
  settings,
  event,
  onUpdateSettings,
  onUpdateEvent,
}: FormSettingsPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Event information */}
        {event && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Información del evento
              </h4>
              <Badge className={eventStatusColors[event.status]}>
                {eventStatusLabels[event.status]}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventName">Nombre del evento</Label>
              <Input
                id="eventName"
                value={event.name}
                onChange={(e) => onUpdateEvent({ name: e.target.value })}
                placeholder="Nombre del evento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDescription">Descripción</Label>
              <Textarea
                id="eventDescription"
                value={event.description}
                onChange={(e) => onUpdateEvent({ description: e.target.value })}
                placeholder="Descripción del evento"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Proyecto</Label>
              <Input
                id="projectName"
                value={event.projectName}
                onChange={(e) => onUpdateEvent({ projectName: e.target.value })}
                placeholder="Nombre del proyecto"
              />
            </div>

            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Select
                value={event.modality}
                onValueChange={(value) =>
                  onUpdateEvent({ modality: value as EventInfo["modality"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">
                    <div className="flex items-center gap-2">
                      {modalityIcons.presencial}
                      <span>Presencial</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      {modalityIcons.online}
                      <span>Online</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hibrido">
                    <div className="flex items-center gap-2">
                      {modalityIcons.hibrido}
                      <span>Híbrido</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Ubicación / Enlace</span>
                </div>
              </Label>
              <Input
                id="location"
                value={event.location || ""}
                onChange={(e) => onUpdateEvent({ location: e.target.value })}
                placeholder={
                  event.modality === "online"
                    ? "https://zoom.us/..."
                    : "Dirección del evento"
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Fecha inicio</span>
                  </div>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={event.startDate}
                  onChange={(e) => onUpdateEvent({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Fecha fin</span>
                  </div>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={event.endDate}
                  onChange={(e) => onUpdateEvent({ endDate: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            {/* Capacity control */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Users className="h-4 w-4" />
                Control de cupos
              </h4>

              <div className="space-y-2">
                <Label htmlFor="capacity">Cupo máximo</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={event.capacity}
                  onChange={(e) =>
                    onUpdateEvent({ capacity: e.target.valueAsNumber || 1 })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">
                    {event.registeredCount}
                  </div>
                  <div className="text-muted-foreground">Confirmados</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {event.waitlistCount}
                  </div>
                  <div className="text-muted-foreground">En espera</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir lista de espera</Label>
                  <p className="text-xs text-muted-foreground">
                    Registrar personas cuando el cupo esté lleno
                  </p>
                </div>
                <Switch
                  checked={settings.allowWaitlist}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ allowWaitlist: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Event status */}
            <div className="space-y-2">
              <Label>Estado del evento</Label>
              <Select
                value={event.status}
                onValueChange={(value) =>
                  onUpdateEvent({ status: value as EventInfo["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(eventStatusLabels) as [
                      EventInfo["status"],
                      string
                    ][]
                  ).map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Separator />

        {/* Form settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Configuración del formulario
          </h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Formulario activo</Label>
              <p className="text-xs text-muted-foreground">
                Permitir nuevas inscripciones
              </p>
            </div>
            <Switch
              checked={settings.isActive}
              onCheckedChange={(checked) =>
                onUpdateSettings({ isActive: checked })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="openDate">Fecha de apertura</Label>
              <Input
                id="openDate"
                type="date"
                value={settings.openDate || ""}
                onChange={(e) =>
                  onUpdateSettings({ openDate: e.target.value || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeDate">Fecha de cierre</Label>
              <Input
                id="closeDate"
                type="date"
                value={settings.closeDate || ""}
                onChange={(e) =>
                  onUpdateSettings({ closeDate: e.target.value || undefined })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Validación de duplicados</Label>
            <Select
              value={settings.duplicateValidationField || "none"}
              onValueChange={(value) =>
                onUpdateSettings({
                  duplicateValidationField:
                    value === "none"
                      ? undefined
                      : (value as FormSettings["duplicateValidationField"]),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin validación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin validación</SelectItem>
                <SelectItem value="email">Por correo electrónico</SelectItem>
                <SelectItem value="rut">Por RUT</SelectItem>
                <SelectItem value="phone">Por teléfono</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Evitar inscripciones duplicadas
            </p>
          </div>
        </div>

        <Separator />

        {/* Messages */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Mensajes
          </h4>

          <div className="space-y-2">
            <Label htmlFor="confirmationMessage">Mensaje de confirmación</Label>
            <Textarea
              id="confirmationMessage"
              value={settings.confirmationMessage}
              onChange={(e) =>
                onUpdateSettings({ confirmationMessage: e.target.value })
              }
              placeholder="Gracias por tu inscripción..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacityFullMessage">Mensaje de cupo completo</Label>
            <Textarea
              id="capacityFullMessage"
              value={settings.capacityFullMessage}
              onChange={(e) =>
                onUpdateSettings({ capacityFullMessage: e.target.value })
              }
              placeholder="Lo sentimos, el evento ha alcanzado su capacidad..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
